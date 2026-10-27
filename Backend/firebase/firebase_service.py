from firebase_admin import db
from . import firebase_config

def get_sensor_data():
    try:
        ref = db.reference("/esp32/sensors")  # corrected path
        data = ref.get()
        print("🔥 Raw Firebase Data:", data)

        if data:
            return {
                "temperature": data.get("ds18b20", {}).get("tempF"),
                "bpm": data.get("max30102", {}).get("bpm"),
                "spo2": data.get("max30102", {}).get("spo2")
            }
        else:
            return {}
    except Exception as e:
        print("Firebase read error:", str(e))
        return {}
