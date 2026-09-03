from rest_framework.throttling import AnonRateThrottle, UserRateThrottle, SimpleRateThrottle

class LoginRateThrottle(AnonRateThrottle):
    """
    Limits authentication attempts to 5 per minute per IP to defend against brute-force attacks.
    """
    scope = 'login'


class RegistrationRateThrottle(AnonRateThrottle):
    """
    Limits registrations per IP to 10 per hour to prevent bot flooding.
    """
    scope = 'registration'


class BurstAnonThrottle(AnonRateThrottle):
    """
    Limits burst request spikes across all anonymous endpoints (max 30 requests/minute).
    """
    scope = 'burst'


class VerifyRateThrottle(AnonRateThrottle):
    """
    Limits verification lookups to 20 lookups per minute to prevent registration code enumeration.
    """
    scope = 'verify'
