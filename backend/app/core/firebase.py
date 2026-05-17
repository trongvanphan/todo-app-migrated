import os
import firebase_admin
from firebase_admin import credentials


_initialized = False


def init_firebase() -> None:
    global _initialized
    if _initialized:
        return
    cred_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    if cred_path and os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    else:
        firebase_admin.initialize_app()
    _initialized = True
