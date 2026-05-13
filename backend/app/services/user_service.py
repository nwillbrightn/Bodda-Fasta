from app import db
from app.models.user import User

def create_user(data):
    user = User(
        name=data.get("name"),
        email=data.get("email"),
        account_status=0,
        access_privileges=1
    )

    db.session.add(user)
    db.session.commit()

    return {
        "status": "success",
        "user": user.to_dict()
    }


def get_users():
    users = User.query.all()
    return {
        "status": "success",
        "users": [u.to_dict() for u in users]
    }