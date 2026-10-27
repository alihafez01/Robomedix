import os
from pathlib import Path

import firebase_admin
from firebase_admin import credentials, db

# Initialize app only once
if not firebase_admin._apps:
    credential_path = os.getenv(
        "FIREBASE_SERVICE_ACCOUNT_PATH",
        str(Path(__file__).with_name("service-account.json")),
    )
    database_url = os.getenv(
        "FIREBASE_DATABASE_URL",
        "https://robomedix-da70a-default-rtdb.firebaseio.com/",
    )
    cred = credentials.Certificate(credential_path)
    firebase_admin.initialize_app(cred, {
        "databaseURL": database_url,
    })
