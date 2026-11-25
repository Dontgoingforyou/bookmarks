#!/bin/sh
set -e

python bookmarks/manage.py migrate --noinput
exec python bookmarks/manage.py runserver 0.0.0.0:8000
