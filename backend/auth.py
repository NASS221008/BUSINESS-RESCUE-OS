"""
Auth — verifies Supabase-issued JWTs on incoming requests.

The frontend sends `Authorization: Bearer <supabase_access_token>` on every
API call. Rather than relying on a shared secret, we fetch Supabase's public
signing keys (JWKS) and verify the token's signature against those. That id
in the token's `sub` claim is what we use to scope every database row to the
correct account.
"""

import os
import jwt
from jwt import PyJWKClient
from fastapi import Header, HTTPException

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
JWKS_URL = f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json" if SUPABASE_URL else None

_jwk_client = PyJWKClient(JWKS_URL) if JWKS_URL else None


def get_current_user_id(authorization: str = Header(default=None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or malformed Authorization header")

    token = authorization.split(" ", 1)[1]

    if not _jwk_client:
        raise HTTPException(
            status_code=500,
            detail="Server misconfigured: SUPABASE_URL is not set",
        )

    try:
        signing_key = _jwk_client.get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["ES256", "RS256", "HS256"],
            audience="authenticated",
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired, please log in again")
    except jwt.PyJWKClientError:
        raise HTTPException(status_code=401, detail="Could not verify session (key lookup failed)")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid session token")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Token missing user id")

    return user_id
