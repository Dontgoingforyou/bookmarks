import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "bookmarks"))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

import django_extensions.management.commands.runserver_plus as runserver_plus
from django.core.management import execute_from_command_line

_inner_run = runserver_plus.Command.inner_run
_setitem = os._Environ.__setitem__


def _setitem_skip_run_main(self, key, value):
    # With the reloader off, django-extensions marks the process as a reloader
    # child. Werkzeug then waits for a socket that was never created.
    if key == "WERKZEUG_RUN_MAIN":
        return
    _setitem(self, key, value)


def inner_run(self, options):
    options = dict(options)
    options["use_reloader"] = False
    os._Environ.__setitem__ = _setitem_skip_run_main
    try:
        return _inner_run(self, options)
    finally:
        os._Environ.__setitem__ = _setitem


runserver_plus.Command.inner_run = inner_run

if __name__ == "__main__":
    execute_from_command_line(
        [
            "bookmarks/manage.py",
            "runserver_plus",
            "0.0.0.0:8000",
            "--cert-file",
            "bookmarks/cert.crt",
            "--threaded",
        ]
    )
