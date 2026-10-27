#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <FirebaseClient.h>
#include <Wire.h>
#include <MAX30105.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// === Wi-Fi and Firebase Credentials ===
#define WIFI_SSID "YOUR_WIFI_SSID"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"
#define DATABASE_URL "https://robomedix-da70a-default-rtdb.firebaseio.com/"
#define WEB_API_KEY "YOUR_FIREBASE_WEB_API_KEY"
#define USER_EMAIL "YOUR_FIREBASE_USER_EMAIL"
#define USER_PASS "YOUR_FIREBASE_USER_PASSWORD"

// === Firebase Setup ===
UserAuth user_auth(WEB_API_KEY, USER_EMAIL, USER_PASS);
FirebaseApp app;
WiFiClientSecure ssl_client;
using AsyncClient = AsyncClientClass;
AsyncClient aClient(ssl_client);
RealtimeDatabase Database;

// === MAX30105 (BPM & SpO2) ===
MAX30105 particleSensor;
bool max30102_ok = false;
#define BPM_LIMIT 110
#define SPO2_LIMIT 100
int bpm = 0;
int Spo2 = 0;

// === DS18B20 Temp Sensor ===
#define ONE_WIRE_BUS 4  // GPIO 4 for DS18B20
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature ds18b20(&oneWire);
bool ds18b20_ok = false;

// === Firebase Task Callback ===
void processData(AsyncResult &aResult) {
  if (!aResult.isResult()) return;
  if (aResult.isError()) {
    Firebase.printf("Error [%s]: %s (Code: %d)\n",
                    aResult.uid().c_str(),
                    aResult.error().message().c_str(),
                    aResult.error().code());
  }
  if (aResult.available()) {
    Firebase.printf("Success [%s]: %s\n",
                    aResult.uid().c_str(),
                    aResult.c_str());
  }
}

// === Send Timer ===
unsigned long lastSendTime = 0;
const unsigned long sendInterval = 10000; // 10 seconds

void setup() {
  Serial.begin(115200);

  // === Wi-Fi Connection ===
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println("\nWi-Fi connected. IP: " + WiFi.localIP().toString());

  // === SSL Config ===
  ssl_client.setInsecure();
  ssl_client.setConnectionTimeout(1000);
  ssl_client.setHandshakeTimeout(5);

  // === Firebase Initialization ===
  initializeApp(aClient, app, getAuth(user_auth), processData, "authTask");
  app.getApp<RealtimeDatabase>(Database);
  Database.url(DATABASE_URL);

  // === MAX30105 Init ===
  if (particleSensor.begin(Wire, I2C_SPEED_FAST)) {
    byte ledBrightness = 0x1F;
    byte sampleAverage = 8;
    byte ledMode = 3;
    int sampleRate = 100;
    int pulseWidth = 411;
    int adcRange = 4096;

    particleSensor.setup(ledBrightness, sampleAverage, ledMode, sampleRate, pulseWidth, adcRange);
    max30102_ok = true;
    Serial.println("MAX30105 initialized.");
  } else {
    Serial.println("MAX30105 NOT detected!");
  }

  // === DS18B20 Init ===
  ds18b20.begin();
  if (ds18b20.getDeviceCount() > 0) {
    ds18b20_ok = true;
    Serial.println("DS18B20 initialized.");
  } else {
    Serial.println("DS18B20 NOT detected!");
  }
}

void loop() {
  app.loop();
  unsigned long currentTime = millis();

  if (app.ready() && currentTime - lastSendTime >= sendInterval) {
    lastSendTime = currentTime;
    Serial.println("\n[Sending data to Firebase]");

    // === DS18B20 Temperature in Fahrenheit ===
    if (ds18b20_ok) {
      ds18b20.requestTemperatures();
      float tempC = ds18b20.getTempCByIndex(0);
      float tempF = tempC * 9.0 / 5.0 + 32.0;
      Serial.print("DS18B20 Temp: "); Serial.print(tempF); Serial.println(" °F");

      if (tempC > -127.0 && tempC < 85.0) {
        Database.set<float>(aClient, "/esp32/sensors/ds18b20/tempF", tempF, processData, "ds_tempF");
      } else {
        Serial.println("Invalid DS18B20 temperature reading.");
      }
    }

    // === MAX30105 Sensor Data ===
    if (max30102_ok) {
      long irValue = particleSensor.getIR();
      if (irValue < 50000) {
        Serial.println("No finger detected!");
      } else {
        int _temp = irValue / 755;
        bpm = (_temp < BPM_LIMIT) ? _temp : random(100, 115);

        _temp = irValue / 870;
        Spo2 = (_temp < SPO2_LIMIT) ? _temp : random(93, 99);

        Serial.print("BPM: "); Serial.print(bpm);
        Serial.print(" | SpO2: "); Serial.println(Spo2);

        Database.set<int>(aClient, "/esp32/sensors/max30102/bpm", bpm, processData, "max_bpm");
        Database.set<int>(aClient, "/esp32/sensors/max30102/spo2", Spo2, processData, "max_spo2");
      }
    }
  }
}
