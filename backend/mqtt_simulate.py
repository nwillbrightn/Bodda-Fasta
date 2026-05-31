import paho.mqtt.client as mqtt
import json
import time
from datetime import datetime, timezone

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

# Simulate driver moving through Dodoma, Tanzania
locations = [
    {"latitude": -6.1722, "longitude": 35.7395, "area": "Makulu"},
    {"latitude": -6.1850, "longitude": 35.7420, "area": "Sabasaba"},
    {"latitude": -6.1650, "longitude": 35.7500, "area": "Chamwino"},
    {"latitude": -6.2000, "longitude": 35.7600, "area": "Ihumwa"},
]

print("\n--- Bodda-Fasta Driver Location Simulation (Dodoma) ---\n")

for loc in locations:
    payload = json.dumps({
        "driver_id": 1,
        "latitude": loc["latitude"],
        "longitude": loc["longitude"],
        "area": loc["area"],
        "timestamp": datetime.now(timezone.utc).isoformat()
    })
    publisher.publish(TOPIC, payload)
    print(f"[DRIVER] Published location: {loc['area']}")
    time.sleep(2)

print("\n--- Simulation Complete ---")
subscriber.loop_stop()