from flask import Blueprint
from app.controllers.bodaboda_controller import (
    create_rider,
    get_riders,
    get_rider_by_user,
    update_rider,
    delete_rider,
    request_ride          # 👈 add this import
)

bodaboda_bp = Blueprint("bodaboda_bp", __name__)

# CREATE
bodaboda_bp.route("/riders", methods=["POST"])(create_rider)

# READ ALL
bodaboda_bp.route("/riders", methods=["GET"])(get_riders)

# READ ONE (by user_id)
bodaboda_bp.route("/riders/<int:user_id>", methods=["GET"])(get_rider_by_user)

# UPDATE
bodaboda_bp.route("/riders/<int:user_id>", methods=["PUT"])(update_rider)

# DELETE
bodaboda_bp.route("/riders/<int:user_id>", methods=["DELETE"])(delete_rider)

# MATCH RIDER (ride request)
bodaboda_bp.route("/rides/request", methods=["POST"])(request_ride) 