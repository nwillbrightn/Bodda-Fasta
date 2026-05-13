from flask_socketio import emit
from app import db
from app.models.bodaboda_rider import BodabodaRider
from datetime import datetime


def register(socketio):

    @socketio.on("connect")
    def handle_connect():
        print("✅ Client connected")

    @socketio.on("disconnect")
    def handle_disconnect():
        print("❌ Client disconnected")

    @socketio.on("rider_location_update")
    def handle_location_update(data):
        print("🔥 Location update received:", data)

        rider_id = data.get("rider_id")
        lat = data.get("lat")
        lng = data.get("lng")

        if not rider_id or lat is None or lng is None:
            print("❌ Missing fields:", data)
            emit("error", {"msg": "rider_id, lat and lng are required"})
            return

        try:
            rider = BodabodaRider.query.get(rider_id)

            if not rider:
                print(f"❌ Rider not found: {rider_id}")
                emit("error", {"msg": "Rider not found"})
                return

            rider.current_lat = lat
            rider.current_lng = lng
            rider.updated_at = datetime.utcnow()
            db.session.commit()

            print(f"✅ Rider {rider_id} updated → lat: {lat}, lng: {lng}")

            emit("location_updated", {
                "msg": "Location updated",
                "rider_id": rider_id,
                "lat": lat,
                "lng": lng
            })

        except Exception as e:
            db.session.rollback()
            print(f"💥 Error updating location: {e}")
            emit("error", {"msg": "Server error updating location"})