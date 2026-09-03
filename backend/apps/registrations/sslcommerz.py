import logging
import requests
from django.conf import settings

logger = logging.getLogger(__name__)

SANDBOX_SESSION_URL = 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'
LIVE_SESSION_URL = 'https://securepay.sslcommerz.com/gwprocess/v4/api.php'

SANDBOX_VALIDATION_URL = 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php'
LIVE_VALIDATION_URL = 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php'


def get_sslcommerz_config():
    """Dynamically resolves SSLCommerz credentials from Database SiteSettings or env settings."""
    try:
        from apps.core.models import SiteSettings
        site = SiteSettings.get()
        store_id = site.sslcommerz_store_id.strip() if site.sslcommerz_store_id else settings.SSLCOMMERZ_STORE_ID
        store_pass = site.sslcommerz_store_pass.strip() if site.sslcommerz_store_pass else settings.SSLCOMMERZ_STORE_PASS
        is_sandbox = site.sslcommerz_is_sandbox if site.sslcommerz_store_id else settings.SSLCOMMERZ_IS_SANDBOX
        return store_id, store_pass, is_sandbox
    except Exception:
        return settings.SSLCOMMERZ_STORE_ID, settings.SSLCOMMERZ_STORE_PASS, settings.SSLCOMMERZ_IS_SANDBOX


def get_session_url() -> str:
    _, _, is_sandbox = get_sslcommerz_config()
    return SANDBOX_SESSION_URL if is_sandbox else LIVE_SESSION_URL


def get_validation_url() -> str:
    _, _, is_sandbox = get_sslcommerz_config()
    return SANDBOX_VALIDATION_URL if is_sandbox else LIVE_VALIDATION_URL


def initiate_sslcommerz_session(registration, request=None) -> dict:
    """
    Initiates an official SSLCommerz payment session for a registration.
    Returns:
        dict with keys: 'status' ('SUCCESS' or 'FAILED'), 'gateway_url', 'sessionkey', 'error'
    """
    store_id, store_pass, is_sandbox = get_sslcommerz_config()
    backend_url = settings.BACKEND_URL.rstrip('/')

    post_data = {
        'store_id': store_id,
        'store_passwd': store_pass,
        'total_amount': str(registration.total_fee),
        'currency': 'BDT',
        'tran_id': str(registration.confirmation_code),
        'success_url': f"{backend_url}/api/payments/sslcommerz/success/",
        'fail_url': f"{backend_url}/api/payments/sslcommerz/fail/",
        'cancel_url': f"{backend_url}/api/payments/sslcommerz/cancel/",
        'ipn_url': f"{backend_url}/api/payments/sslcommerz/ipn/",
        # Customer Info
        'cus_name': registration.participant.name or 'Participant',
        'cus_email': registration.participant.email or 'noreply@sjis.edu.bd',
        'cus_add1': registration.participant.school_display or 'Dhaka',
        'cus_city': 'Dhaka',
        'cus_postcode': '1207',
        'cus_country': 'Bangladesh',
        'cus_phone': registration.participant.phone or '01700000000',
        # Shipment / Order Info
        'shipping_method': 'NO',
        'num_of_item': len(registration.registration_events.all()) or 1,
        'product_name': f"JTC 2026 Entry Pass ({registration.short_code})",
        'product_category': 'Festival Registration',
        'product_profile': 'non-physical-goods',
    }

    try:
        response = requests.post(get_session_url(), data=post_data, timeout=30)
        data = response.json()
        logger.info(f"SSLCommerz Session Init for {registration.confirmation_code}: {data.get('status')}")

        if data.get('status') == 'SUCCESS':
            return {
                'status': 'SUCCESS',
                'gateway_url': data.get('GatewayPageURL'),
                'sessionkey': data.get('sessionkey'),
            }
        else:
            return {
                'status': 'FAILED',
                'error': data.get('failedreason') or 'Failed to initiate SSLCommerz payment gateway.',
            }
    except Exception as e:
        logger.exception(f"SSLCommerz connection error: {e}")
        return {
            'status': 'FAILED',
            'error': f"Gateway connection error: {str(e)}",
        }


def validate_sslcommerz_transaction(val_id: str) -> dict:
    """
    Queries SSLCommerz validation API to confirm legitimate payment completion.
    """
    if not val_id:
        return {'status': 'INVALID', 'error': 'Missing val_id'}

    store_id, store_pass, _ = get_sslcommerz_config()

    params = {
        'val_id': val_id,
        'store_id': store_id,
        'store_passwd': store_pass,
        'format': 'json',
    }

    try:
        response = requests.get(get_validation_url(), params=params, timeout=30)
        data = response.json()
        logger.info(f"SSLCommerz Validation status for {val_id}: {data.get('status')}")
        return data
    except Exception as e:
        logger.exception(f"SSLCommerz validation error: {e}")
        return {'status': 'ERROR', 'error': str(e)}
