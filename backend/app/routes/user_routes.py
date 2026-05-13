from flask import Blueprint
from app.controllers.user_controller import register_user, fetch_users

user_bp = Blueprint("user_bp", __name__)

@user_bp.route("/users", methods=["GET"])
def users():
    return fetch_users()

@user_bp.route("/users", methods=["POST"])
def register():
    return register_user()