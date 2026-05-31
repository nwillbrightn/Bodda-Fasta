import paho.mqtt.client as mqtt
import json
import time
from datetime import datetime

MQTT_BROKER = "localhost"
MQTT_PORT = 1883
TOPIC = "driver/location"

# --- SUBSCRIBER (Passenger side) ---
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Subscriber connected to MQTT broker")
        client.subscribe(TOPIC)
    else:
        print(f"Failed to connect, code {rc}")

def on_message(client, userdata, msg):
    payload = json.loads(msg.payload.decode())
    print(f"[PASSENGER] Received location update: {payload}")

# Set up subscriber client
subscriber = mqtt.Client(client_id="passenger_subscriber")
subscriber.on_connect = on_connect
subscriber.on_message = on_message
subscriber.connect(MQTT_BROKER, MQTT_PORT, 60)
subscriber.loop_start()

# Give subscriber time to connect
time.sleep(1)

# --- PUBLISHER (Driver side) ---
publisher = mqtt.Client(client_id="driver_publisher")
publisher.connect(MQTT_BROKER, MQTT_PORT, 60)

# Simulate driver moving through Dar es Salaam
locations = [
    {"latitude": -6.7924, "longitude": 39.2083, "area": "Nyerere Square"},
    {"latitude": -6.8000, "longitude": 39.2150, "area": "Kariakoo"},
    {"latitude": -6.8100, "longitude": 39.2200, "area": "Buguruni"},
    {"latitude": -6.8200, "longitude": 39.2300, "area": "Tabata"},
]

print("\n--- Bodda-Fasta Driver Location Simulation ---\n")

for loc in locations:
    payload = json.dumps({
        "driver_id": 1,
        "latitude": loc["latitude"],
        "longitude": loc["longitude"],
        "area": loc["area"],
        "timestamp": datetime.utcnow().isoformat()
    })
    publisher.publish(TOPIC, payload)
    print(f"[DRIVER] Published location: {loc['area']}")
    time.sleep(2)

print("\n--- Simulation Complete ---")
subscriber.loop_stop()