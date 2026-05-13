from flask import request, jsonify
from app import db
from app.models.bodaboda_rider import BodabodaRider
from app.models.user import User
from app.models.rating import Rating
from datetime import datetime
from sqlalchemy import func
import math


# =========================
# CREATE rider
# =========================
def create_rider():
    data = request.get_json()

    user_id = data.get("user_id")
    plate_number = data.get("plate_number")
    registered_name = data.get("registered_name")
    city = data.get("city")

    if not user_id or not registered_name or not city:
        return jsonify({"msg": "Missing required fields"}), 400

    if not plate_number or not plate_number.startswith("MC"):
        return jsonify({"msg": "Plate number must start with MC"}), 400

    # Check user exists
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    # Prevent duplicate rider
    existing = BodabodaRider.query.filter_by(user_id=user_id).first()
    if existing:
        return jsonify({"msg": "User is already a rider"}), 400

    rider = BodabodaRider(
        user_id=user_id,
        plate_number=plate_number,
        registered_name=registered_name,
        city=city,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.session.add(rider)

    # 🔥 UPDATE USER TYPE
    user.user_type = "rider"
    user.updated_at = datetime.utcnow()

    db.session.commit()

    return jsonify({
        "msg": "Rider created successfully",
        "rider": rider.to_dict(),
        "user_type": user.user_type
    }), 201


# =========================
# GET all riders
# =========================
def get_riders():
    riders = BodabodaRider.query.all()
    return jsonify([r.to_dict() for r in riders]), 200


# =========================
# GET single rider by user_id
# =========================
def get_rider_by_user(user_id):
    rider = BodabodaRider.query.filter_by(user_id=user_id).first()

    if not rider:
        return jsonify({"msg": "Rider not found"}), 404

    return jsonify(rider.to_dict()), 200


# =========================
# UPDATE rider
# =========================
def update_rider(user_id):
    rider = BodabodaRider.query.filter_by(user_id=user_id).first()

    if not rider:
        return jsonify({"msg": "Rider not found"}), 404

    data = request.get_json()

    if "plate_number" in data:
        if not data["plate_number"].startswith("MC"):
            return jsonify({"msg": "Plate must start with MC"}), 400
        rider.plate_number = data["plate_number"]

    if "registered_name" in data:
        rider.registered_name = data["registered_name"]

    if "city" in data:
        rider.city = data["city"]

    rider.updated_at = datetime.utcnow()

    db.session.commit()

    return jsonify({
        "msg": "Rider updated successfully",
        "rider": rider.to_dict()
    }), 200


# =========================
# DELETE rider
# =========================
def delete_rider(user_id):
    rider = BodabodaRider.query.filter_by(user_id=user_id).first()

    if not rider:
        return jsonify({"msg": "Rider not found"}), 404

    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    # 🔥 DELETE RIDER
    db.session.delete(rider)

    # 🔥 RESET USER TYPE
    user.user_type = "customer"
    user.updated_at = datetime.utcnow()

    db.session.commit()

    return jsonify({
        "msg": "Rider deleted and user reverted to customer"
    }), 200


# =========================
# REQUEST / MATCH RIDER
# =========================
def request_ride():
    data = request.get_json()

    pickup_lat = data.get("pickup_lat")
    pickup_lng = data.get("pickup_lng")

    if pickup_lat is None or pickup_lng is None:
        return jsonify({"msg": "pickup_lat and pickup_lng are required"}), 400

    # Fetch only available riders WHO HAVE a location set
    riders = BodabodaRider.query.filter_by(is_available=True).filter(
        BodabodaRider.current_lat.isnot(None),
        BodabodaRider.current_lng.isnot(None)
    ).all()

    if not riders:
        return jsonify({"msg": "No riders available right now"}), 404

    def haversine(lat1, lng1, lat2, lng2):
        R = 6371000  # Earth radius in METRES
        d_lat = math.radians(lat2 - lat1)
        d_lng = math.radians(lng2 - lng1)
        a = (math.sin(d_lat / 2) ** 2 +
             math.cos(math.radians(lat1)) *
             math.cos(math.radians(lat2)) *
             math.sin(d_lng / 2) ** 2)
        return R * 2 * math.asin(math.sqrt(a))

    def format_distance(metres):
        if metres >= 1000:
            return f"{round(metres / 1000, 1)} km"
        return f"{round(metres)} m"

    # Sort by distance and take top 3
    sorted_riders = sorted(
        riders,
        key=lambda r: haversine(pickup_lat, pickup_lng, r.current_lat, r.current_lng)
    )[:3]

    result = []
    for rider in sorted_riders:
        distance_m = haversine(pickup_lat, pickup_lng, rider.current_lat, rider.current_lng)

        # 🔥 Get driver name from users table, fallback to registered_name
        driver_name = rider.user.name if rider.user else rider.registered_name

        # Get average rating and total ratings count
        rating_data = db.session.query(
            func.avg(Rating.rate).label("avg_rate"),
            func.count(Rating.id).label("total_ratings")
        ).filter(Rating.rider_id == rider.id).first()

        result.append({
            "id": rider.id,
            "name": driver_name,                                      # 🔥 from users table
            "registered_name": rider.registered_name,                 # bike registration name
            "plate_number": rider.plate_number,
            "phone": rider.user.phone if rider.user else None,
            "avg_rating": round(float(rating_data.avg_rate), 1) if rating_data.avg_rate else 0.0,
            "total_ratings": rating_data.total_ratings,
            "distance_m": round(distance_m),
            "distance_label": format_distance(distance_m)
        })

    return jsonify({
        "msg": "Riders found successfully",
        "riders": result
    }), 200