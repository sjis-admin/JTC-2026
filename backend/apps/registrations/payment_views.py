import logging
from django.conf import settings
from django.http import HttpResponseRedirect
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Registration
from .notifications import send_confirmation_email, send_confirmation_sms
from .sslcommerz import initiate_sslcommerz_session, validate_sslcommerz_transaction
from apps.core.throttles import BurstAnonThrottle

logger = logging.getLogger(__name__)


@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
@throttle_classes([BurstAnonThrottle])
def sslcommerz_initiate(request, code):
    """
    Public endpoint: Initiates an SSLCommerz payment session for a given confirmation code.
    Returns JSON: { 'status': 'SUCCESS', 'gateway_url': 'https://...' }
    """
    try:
        registration = Registration.objects.select_related('participant').get(confirmation_code=code)
    except Registration.DoesNotExist:
        return Response({'error': 'Registration not found.'}, status=status.HTTP_404_NOT_FOUND)

    if registration.total_fee <= 0:
        return Response({'error': 'This registration has a fee of 0 BDT. No online payment required.'}, status=status.HTTP_400_BAD_REQUEST)

    result = initiate_sslcommerz_session(registration, request)
    if result.get('status') == 'SUCCESS':
        return Response({
            'status': 'SUCCESS',
            'gateway_url': result.get('gateway_url'),
            'sessionkey': result.get('sessionkey'),
        })
    else:
        return Response({
            'status': 'FAILED',
            'error': result.get('error', 'Failed to initiate SSLCommerz gateway session.'),
        }, status=status.HTTP_502_BAD_GATEWAY)


@csrf_exempt
def sslcommerz_success(request):
    """
    SSLCommerz Success Callback URL.
    Validates the transaction with SSLCommerz servers, verifies exact payment amount, and marks verified.
    """
    frontend_url = settings.FRONTEND_URL.rstrip('/')
    tran_id = request.POST.get('tran_id') or request.GET.get('tran_id')
    val_id = request.POST.get('val_id') or request.GET.get('val_id')
    bank_tran_id = request.POST.get('bank_tran_id', '')
    card_type = request.POST.get('card_type', 'SSLCOMMERZ')
    amount = request.POST.get('amount', '')

    logger.info(f"SSLCommerz Success Callback: tran_id={tran_id}, val_id={val_id}, amount={amount}")

    if not tran_id:
        return HttpResponseRedirect(f"{frontend_url}/register/success?payment=failed&reason=missing_tran_id")

    try:
        registration = Registration.objects.get(confirmation_code=tran_id)
    except Registration.DoesNotExist:
        return HttpResponseRedirect(f"{frontend_url}/register/success?payment=failed&reason=reg_not_found")

    # Anti-Tampering Check: Validate transaction directly with SSLCommerz API
    validation_data = validate_sslcommerz_transaction(val_id)
    val_status = validation_data.get('status', '').upper()
    val_amount_raw = validation_data.get('amount') or amount

    # Check for amount tampering
    try:
        paid_amount = float(val_amount_raw)
        if abs(paid_amount - float(registration.total_fee)) > 0.01:
            logger.critical(
                f"SECURITY ALERT - PAYMENT AMOUNT TAMPERING DETECTED: "
                f"Registration {registration.confirmation_code} expected {registration.total_fee} BDT but paid {paid_amount} BDT"
            )
            registration.payment_status = 'REJECTED'
            registration.admin_notes = f"SECURITY ALERT: Tampered Amount. Expected {registration.total_fee}, Gateway reported {paid_amount} (val_id: {val_id})"
            registration.save()
            return HttpResponseRedirect(
                f"{frontend_url}/register/success?code={registration.confirmation_code}&payment=failed&reason=amount_tampered"
            )
    except (ValueError, TypeError) as e:
        logger.warning(f"Could not parse amount during validation: {e}")

    if val_status in ['VALID', 'VALIDATED'] or (settings.SSLCOMMERZ_IS_SANDBOX and val_id):
        registration.payment_status = 'VERIFIED'
        registration.payment_method = 'SSLCOMMERZ'
        registration.payment_reference = bank_tran_id or val_id
        registration.payment_verified_at = timezone.now()
        registration.admin_notes = f"Verified via SSLCommerz ({card_type}) • val_id: {val_id}"
        registration.save()

        # Send confirmation notifications
        send_confirmation_email(registration)
        send_confirmation_sms(registration)

        return HttpResponseRedirect(
            f"{frontend_url}/register/success?code={registration.confirmation_code}&payment=success&method={card_type}"
        )
    else:
        logger.warning(f"SSLCommerz transaction validation failed for val_id: {val_id}")
        return HttpResponseRedirect(
            f"{frontend_url}/register/success?code={registration.confirmation_code}&payment=failed&reason=validation_failed"
        )


@csrf_exempt
def sslcommerz_fail(request):
    """SSLCommerz Fail Callback URL."""
    frontend_url = settings.FRONTEND_URL.rstrip('/')
    tran_id = request.POST.get('tran_id') or request.GET.get('tran_id')
    error_reason = request.POST.get('error') or request.POST.get('failedreason') or 'payment_failed'

    logger.warning(f"SSLCommerz Failed Callback for tran_id: {tran_id}, reason: {error_reason}")
    if tran_id:
        return HttpResponseRedirect(f"{frontend_url}/register/success?code={tran_id}&payment=failed&reason={error_reason}")
    return HttpResponseRedirect(f"{frontend_url}/register/success?payment=failed")


@csrf_exempt
def sslcommerz_cancel(request):
    """SSLCommerz Cancel Callback URL."""
    frontend_url = settings.FRONTEND_URL.rstrip('/')
    tran_id = request.POST.get('tran_id') or request.GET.get('tran_id')

    logger.info(f"SSLCommerz Cancelled Callback for tran_id: {tran_id}")
    if tran_id:
        return HttpResponseRedirect(f"{frontend_url}/register/success?code={tran_id}&payment=cancelled")
    return HttpResponseRedirect(f"{frontend_url}/register/success?payment=cancelled")


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def sslcommerz_ipn(request):
    """
    SSLCommerz Instant Payment Notification (IPN) server-to-server webhook.
    """
    val_id = request.POST.get('val_id')
    tran_id = request.POST.get('tran_id')
    bank_tran_id = request.POST.get('bank_tran_id', '')

    logger.info(f"SSLCommerz IPN Received: tran_id={tran_id}, val_id={val_id}")

    if not tran_id or not val_id:
        return Response({'status': 'IGNORED'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        registration = Registration.objects.get(confirmation_code=tran_id)
        if registration.payment_status != 'VERIFIED':
            validation_data = validate_sslcommerz_transaction(val_id)
            val_status = validation_data.get('status', '').upper()
            val_amount_raw = validation_data.get('amount')

            # Anti-Tampering Check
            if val_amount_raw:
                try:
                    paid_amount = float(val_amount_raw)
                    if abs(paid_amount - float(registration.total_fee)) > 0.01:
                        logger.critical(f"IPN AMOUNT TAMPERING: expected {registration.total_fee}, paid {paid_amount}")
                        registration.payment_status = 'REJECTED'
                        registration.admin_notes = f"IPN ALERT: Tampered Amount ({paid_amount} vs {registration.total_fee})"
                        registration.save()
                        return Response({'status': 'AMOUNT_MISMATCH'}, status=status.HTTP_400_BAD_REQUEST)
                except (ValueError, TypeError):
                    pass

            if val_status in ['VALID', 'VALIDATED']:
                registration.payment_status = 'VERIFIED'
                registration.payment_method = 'SSLCOMMERZ'
                registration.payment_reference = bank_tran_id or val_id
                registration.payment_verified_at = timezone.now()
                registration.admin_notes = f"Verified via SSLCommerz IPN • val_id: {val_id}"
                registration.save()
                send_confirmation_email(registration)
                send_confirmation_sms(registration)
        return Response({'status': 'SUCCESS'})
    except Registration.DoesNotExist:
        return Response({'status': 'NOT_FOUND'}, status=status.HTTP_404_NOT_FOUND)
