from flask import Blueprint
from app.controllers.ride_controller import (
    create_ride,
    get_rides,
    get_ride,
    get_rider_rides,
    update_ride,
    delete_ride,
)

ride_bp = Blueprint("ride_bp", __name__)

# CREATE
ride_bp.route("/rides", methods=["POST"])(create_ride)

# READ ALL (with optional filters)
ride_bp.route("/rides", methods=["GET"])(get_rides)

# READ ONE
ride_bp.route("/rides/<int:ride_id>", methods=["GET"])(get_ride)

# READ FOR SPECIFIC RIDER
ride_bp.route("/rides/rider/<int:rider_id>", methods=["GET"])(get_rider_rides)

# UPDATE
ride_bp.route("/rides/<int:ride_id>", methods=["PUT"])(update_ride)

# DELETE
ride_bp.route("/rides/<int:ride_id>", methods=["DELETE"])(delete_ride)