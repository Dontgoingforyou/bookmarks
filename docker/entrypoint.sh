#!/bin/sh
set -e

python bookmarks/manage.py migrate --noinput

if ! openssl x509 -in bookmarks/cert.crt -noout -ext subjectAltName 2>/dev/null | grep -q 'bookmarks.test'; then
    openssl req -x509 -newkey rsa:2048 -nodes \
        -keyout bookmarks/cert.key \
        -out bookmarks/cert.crt \
        -days 365 \
        -subj "/CN=bookmarks.test" \
        -addext "subjectAltName=DNS:bookmarks.test,DNS:localhost,IP:127.0.0.1"
fi

exec python docker/serve.py
