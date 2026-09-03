import logging
import requests
from django.conf import settings

logger = logging.getLogger(__name__)

CLOUDFLARE_TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

def verify_turnstile_token(token: str, remote_ip: str = None) -> bool:
    """
    Verifies Cloudflare Turnstile token against Cloudflare's /siteverify API.
    If Turnstile is disabled (e.g. in local development), it automatically passes.
    """
    enabled = getattr(settings, 'CLOUDFLARE_TURNSTILE_ENABLED', False)
    if not enabled:
        # Development / local mode bypass
        return True

    if not token:
        logger.warning("Turnstile token missing while verification is enabled.")
        return False

    secret_key = getattr(settings, 'CLOUDFLARE_TURNSTILE_SECRET_KEY', '')
    if not secret_key:
        logger.error("CLOUDFLARE_TURNSTILE_SECRET_KEY is not configured.")
        return False

    payload = {
        'secret': secret_key,
        'response': token,
    }
    if remote_ip:
        payload['remoteip'] = remote_ip

    try:
        response = requests.post(CLOUDFLARE_TURNSTILE_VERIFY_URL, data=payload, timeout=5)
        data = response.json()
        success = data.get('success', False)
        if not success:
            logger.warning(f"Turnstile verification failed: {data.get('error-codes', [])}")
        return success
    except Exception as e:
        logger.error(f"Error connecting to Cloudflare Turnstile API: {e}")
        # In case of network timeout to Cloudflare, log error
        return False
