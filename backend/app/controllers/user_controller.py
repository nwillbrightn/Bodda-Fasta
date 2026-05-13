from flask import request, jsonify
from app.services.user_service import create_user, get_users

def register_user():
    data = request.get_json()
    result = create_user(data)
    return jsonify(result)

def fetch_users():
    result = get_users()
    return jsonify(result)