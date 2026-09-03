#!/bin/sh
set -e

echo "=== [JTC Backend Entrypoint] Starting initialization ==="

# Wait for PostgreSQL if DATABASE_URL is configured
if [ -n "$DATABASE_URL" ] && [ "$DATABASE_URL" != "sqlite" ]; then
    echo "Waiting for PostgreSQL database to be ready..."
    
    # Python one-liner to verify database connectivity with timeout
    python << END
import os
import sys
import time
import psycopg2
from urllib.parse import urlparse

db_url = os.environ.get('DATABASE_URL', '')
if not db_url.startswith('postgres'):
    sys.exit(0)

parsed = urlparse(db_url)
user = parsed.username
password = parsed.password
host = parsed.hostname
port = parsed.port or 5432
dbname = parsed.path.lstrip('/')

max_retries = 30
retry_interval = 2

for attempt in range(1, max_retries + 1):
    try:
        conn = psycopg2.connect(
            dbname=dbname,
            user=user,
            password=password,
            host=host,
            port=port,
            connect_timeout=3
        )
        conn.close()
        print(f"Successfully connected to PostgreSQL at {host}:{port}/{dbname} (Attempt {attempt})")
        sys.exit(0)
    except Exception as e:
        print(f"Database unavailable on attempt {attempt}/{max_retries}: {e}")
        time.sleep(retry_interval)

print("Error: Could not connect to PostgreSQL within timeout.")
sys.exit(1)
END
fi
echo "=== [JTC Backend] Database is ready. Executing command: $@ ==="
exec "$@"

