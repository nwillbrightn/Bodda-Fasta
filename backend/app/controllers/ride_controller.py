from flask import request, jsonify
from app import db
from app.models.ride import Ride
from app.models.user import User


def create_ride():
    data = request.get_json()

    rider_id    = data.get("rider_id")
    customer_id = data.get("customer_id")
    status      = data.get("status", 0)
    contact     = data.get("contact", None)

    if not rider_id or not customer_id:
        return jsonify({"error": "rider_id and customer_id are required"}), 400

    if status is not None and status not in range(5):
        return jsonify({"error": "status must be between 0 and 4"}), 400

    rider    = User.query.get(rider_id)
    customer = User.query.get(customer_id)

    if not rider:
        return jsonify({"error": f"Rider with id {rider_id} not found"}), 404
    if not customer:
        return jsonify({"error": f"Customer with id {customer_id} not found"}), 404

    ride = Ride(
        rider_id=rider_id,
        customer_id=customer_id,
        status=status,
        contact=contact,
    )

    db.session.add(ride)
    db.session.commit()

    return jsonify({"message": "Ride created successfully", "ride": ride.to_dict()}), 201


def get_rides():
    customer_id = request.args.get("customer_id", type=int)
    rider_id    = request.args.get("rider_id",    type=int)
    status      = request.args.get("status",      type=int)

    query = Ride.query

    if customer_id:
        query = query.filter_by(customer_id=customer_id)
    if rider_id:
        query = query.filter_by(rider_id=rider_id)
    if status is not None:
        query = query.filter_by(status=status)

    rides = query.order_by(Ride.created_at.desc()).all()

    return jsonify({"rides": [r.to_dict() for r in rides]}), 200


def get_ride(ride_id):
    ride = Ride.query.get(ride_id)

    if not ride:
        return jsonify({"error": f"Ride with id {ride_id} not found"}), 404

    return jsonify({"ride": ride.to_dict()}), 200


def get_rider_rides(rider_id):
    active_ride = Ride.query.filter_by(
        rider_id=rider_id,
        status=1
    ).first()

    if active_ride:
        return jsonify({"rides": [active_ride.to_dict()]}), 200

    pending_rides = Ride.query.filter_by(
        rider_id=rider_id,
        status=0
    ).order_by(Ride.created_at.desc()).limit(5).all()

    return jsonify({"rides": [r.to_dict() for r in pending_rides]}), 200


def update_ride(ride_id):
    ride = Ride.query.get(ride_id)

    if not ride:
        return jsonify({"error": f"Ride with id {ride_id} not found"}), 404

    data    = request.get_json()
    status  = data.get("status")
    contact = data.get("contact")

    if status is not None:
        if status not in range(5):
            return jsonify({"error": "status must be between 0 and 4"}), 400
        ride.status = status

    if contact is not None:
        ride.contact = contact

    if "rider_id" in data:
        rider = User.query.get(data["rider_id"])
        if not rider:
            return jsonify({"error": f"Rider with id {data['rider_id']} not found"}), 404
        ride.rider_id = data["rider_id"]

    if "customer_id" in data:
        customer = User.query.get(data["customer_id"])
        if not customer:
            return jsonify({"error": f"Customer with id {data['customer_id']} not found"}), 404
        ride.customer_id = data["customer_id"]

    db.session.commit()

    return jsonify({"message": "Ride updated successfully", "ride": ride.to_dict()}), 200


def delete_ride(ride_id):
    ride = Ride.query.get(ride_id)

    if not ride:
        return jsonify({"error": f"Ride with id {ride_id} not found"}), 404

    db.session.delete(ride)
    db.session.commit()

    return jsonify({"message": f"Ride {ride_id} deleted successfully"}), 200