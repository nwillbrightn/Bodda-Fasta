import paho.mqtt.client as mqtt
import json
from datetime import datetime

MQTT_BROKER = "mqtt"  # matches service name in docker-compose
MQTT_PORT = 1883
TOPIC_DRIVER_LOCATION = "driver/location"

client = mqtt.Client()

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT broker")
        client.subscribe(TOPIC_DRIVER_LOCATION)
    else:
        print(f"Failed to connect, code {rc}")

def on_message(client, userdata, msg):
    payload = json.loads(msg.payload.decode())
    print(f"Location update received: {payload}")

client.on_connect = on_connect
client.on_message = on_message

def start_mqtt():
    try:
        client.connect(MQTT_BROKER, MQTT_PORT, 60)
        client.loop_start()
        print("MQTT client started")
    except Exception as e:
        print(f"MQTT connection error: {e}")

def publish_location(driver_id, latitude, longitude):
    payload = json.dumps({
        "driver_id": driver_id,
        "latitude": latitude,
        "longitude": longitude,
        "timestamp": datetime.utcnow().isoformat()
    })
    client.publish(TOPIC_DRIVER_LOCATION, payload)
    print(f"Published location: {payload}")