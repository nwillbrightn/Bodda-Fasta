from flask import request, jsonify
from flask_jwt_extended import create_access_token
from app.models.user import User
from app import db

def login():
    data = request.get_json()

    email = data.get("email")
    name = data.get("name")
    account_status = data.get("account_status", 1)
    access_privileges = data.get("access_privileges", 1)

    if not email:
        return jsonify({"msg": "Email is required"}), 400


    user = User.query.filter_by(email=email).first()

    created_new_user = False

    if not user:
        user = User(
            email=email,
            name=name or "Unknown",
            account_status=account_status,
            access_privileges=access_privileges
        )
        db.session.add(user)
        created_new_user = True

    else:
        user.name = name or user.name

    db.session.commit()

    token = create_access_token(identity=user.id)

    return jsonify({
        "access_token": token,
        "user": user.to_dict(),
        "created_new_user": created_new_user
    })