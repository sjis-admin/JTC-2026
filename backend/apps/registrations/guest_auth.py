"""
guest_auth.py — Registration gate authentication helpers.

Provides:
  - GoogleTokenVerifier  : verifies a Google ID token against Google's tokeninfo API.
  - OTPStore             : generates/validates short-lived 6-digit OTPs via Django cache.
  - generate_session_jwt : issues a short-lived HS256 JWT after successful auth.
  - verify_session_jwt   : validates the session JWT on incoming registration requests.
"""

import re
import secrets
import logging
from datetime import datetime, timezone, timedelta

import jwt
import requests as http_requests
from django.conf import settings
from django.core.cache import cache
from django.core.mail import send_mail

logger = logging.getLogger(__name__)

_OTP_CACHE_PREFIX = 'jtc_otp_'
_OTP_TTL_SECONDS = 600           # 10-minute OTP validity
_OTP_MAX_ATTEMPTS = 5            # lock after N wrong guesses
_OTP_ATTEMPTS_PREFIX = 'jtc_otp_attempts_'
_JWT_ALGORITHM = 'HS256'


# ─── Google Token Verification ────────────────────────────────────────────────

class GoogleTokenVerifier:
    """
    Verifies a Google ID token (credential) returned by the GSI JS SDK.
    Uses Google's public tokeninfo endpoint — no local key management required.
    """
    TOKENINFO_URL = 'https://oauth2.googleapis.com/tokeninfo'

    @classmethod
    def verify(cls, id_token: str) -> dict:
        """
        Returns a dict with {email, name, picture, sub} on success.
        Raises ValueError with a human-readable message on failure.
        """
        client_id = settings.GOOGLE_CLIENT_ID
        if not client_id:
            raise ValueError('Google OAuth is not configured on this server.')

        try:
            resp = http_requests.get(
                cls.TOKENINFO_URL,
                params={'id_token': id_token},
                timeout=5,
            )
        except http_requests.RequestException as exc:
            logger.error('Google tokeninfo request failed: %s', exc)
            raise ValueError('Could not reach Google servers. Please try again.')

        if resp.status_code != 200:
            raise ValueError('Invalid or expired Google token. Please sign in again.')

        payload = resp.json()

        # Verify the token was issued for our app
        if payload.get('aud') != client_id:
            logger.warning('Google token aud mismatch: %s', payload.get('aud'))
            raise ValueError('Token was not issued for this application.')

        email = payload.get('email', '').strip().lower()
        if not email:
            raise ValueError('Google account does not have a verified email.')

        if payload.get('email_verified') not in (True, 'true'):
            raise ValueError('Your Google account email is not verified.')

        return {
            'email': email,
            'name': payload.get('name', ''),
            'picture': payload.get('picture', ''),
            'sub': payload.get('sub', ''),
        }


# ─── Guest OTP Store ──────────────────────────────────────────────────────────

class OTPStore:
    """
    Generates, stores, and validates 6-digit OTPs using Django's cache framework.
    OTPs are rate-limited (max _OTP_MAX_ATTEMPTS wrong guesses before lockout).
    """

    @staticmethod
    def _cache_key(email: str) -> str:
        return f'{_OTP_CACHE_PREFIX}{email.lower().strip()}'

    @staticmethod
    def _attempts_key(email: str) -> str:
        return f'{_OTP_ATTEMPTS_PREFIX}{email.lower().strip()}'

    @classmethod
    def generate_and_store(cls, email: str) -> str:
        """Generates a new 6-digit OTP, stores it in cache, and returns it."""
        otp = f'{secrets.randbelow(900000) + 100000}'  # 100000-999999
        cache.set(cls._cache_key(email), otp, timeout=_OTP_TTL_SECONDS)
        cache.delete(cls._attempts_key(email))          # reset attempt counter
        return otp

    @classmethod
    def validate(cls, email: str, otp_input: str) -> bool:
        """
        Returns True if OTP matches and is still valid.
        Increments attempt counter; raises ValueError on lockout.
        """
        attempts_key = cls._attempts_key(email)
        attempts = cache.get(attempts_key, 0)

        if attempts >= _OTP_MAX_ATTEMPTS:
            raise ValueError('Too many incorrect attempts. Please request a new OTP.')

        stored_otp = cache.get(cls._cache_key(email))

        if stored_otp is None:
            raise ValueError('OTP has expired or was never generated. Please request a new code.')

        if not secrets.compare_digest(str(stored_otp), str(otp_input).strip()):
            cache.set(attempts_key, attempts + 1, timeout=_OTP_TTL_SECONDS)
            return False

        # Valid - consume it (one-time use)
        cache.delete(cls._cache_key(email))
        cache.delete(attempts_key)
        return True

    @classmethod
    def send_otp_email(cls, email: str, otp: str) -> None:
        """Sends the OTP to the guest's email via Django's email backend."""
        try:
            send_mail(
                subject='Your JTC 2026 Registration Verification Code',
                message=(
                    f'Your one-time verification code is: {otp}\n\n'
                    f'This code expires in 10 minutes.\n\n'
                    f'If you did not request this, please ignore this email.\n\n'
                    f'-- Josephite Tech Club | SJIS Inter-School Tech Carnival 2026'
                ),
                html_message=f"""
                <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
                  <h2 style="color:#f59e0b;margin-bottom:8px;">JTC 2026 Registration</h2>
                  <p style="color:#334155;margin-bottom:24px;">
                    Use the code below to verify your email and unlock the registration form.
                  </p>
                  <div style="background:#0f172a;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
                    <span style="font-size:36px;font-weight:900;letter-spacing:12px;color:#f59e0b;font-family:monospace;">
                      {otp}
                    </span>
                  </div>
                  <p style="color:#64748b;font-size:13px;">
                    This code expires in <strong>10 minutes</strong>.<br>
                    If you did not request this, you can safely ignore this email.
                  </p>
                  <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
                  <p style="color:#94a3b8;font-size:12px;">
                    Josephite Tech Club &mdash; SJIS Inter-School Tech Carnival 2026
                  </p>
                </div>
                """,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
        except Exception as exc:
            logger.error('Failed to send OTP email to %s: %s', email, exc)
            raise


# ─── Session JWT Helpers ──────────────────────────────────────────────────────

def generate_session_jwt(email: str, name: str = '', auth_method: str = 'guest') -> str:
    """
    Issues a short-lived HS256 JWT for the registration session.
    Payload: { email, name, auth_method, iat, exp }
    """
    now = datetime.now(tz=timezone.utc)
    expiry_minutes = getattr(settings, 'SESSION_JWT_EXPIRY_MINUTES', 60)
    payload = {
        'email': email.lower().strip(),
        'name': name,
        'auth_method': auth_method,   # 'google' | 'guest'
        'iat': now,
        'exp': now + timedelta(minutes=expiry_minutes),
    }
    secret = settings.SESSION_JWT_SECRET
    return jwt.encode(payload, secret, algorithm=_JWT_ALGORITHM)


def verify_session_jwt(token: str):
    """
    Validates a session JWT. Returns the decoded payload dict on success,
    or None if invalid / expired (non-blocking -- registration is still allowed).
    """
    try:
        secret = settings.SESSION_JWT_SECRET
        payload = jwt.decode(token, secret, algorithms=[_JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        logger.debug('Registration session token expired.')
        return None
    except jwt.InvalidTokenError as exc:
        logger.debug('Invalid registration session token: %s', exc)
        return None


# ─── Email Validation ─────────────────────────────────────────────────────────

_EMAIL_RE = re.compile(r'^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$')


def is_valid_email(email: str) -> bool:
    return bool(_EMAIL_RE.match(email.strip())) if email else False
