from app import db
from datetime import datetime

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=True)

    # 0 = default, 1 = active, 2 = suspended, etc.
    account_status = db.Column(db.Integer, default=0, nullable=False)

    # 1 = user, 2 = admin, 3 = super admin
    access_privileges = db.Column(db.Integer, default=1, nullable=False)

    user_type = db.Column(db.String(20), default="customer", nullable=False)

    # timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    def to_dict(self):
        from app.models.bodaboda_rider import BodabodaRider
        rider = BodabodaRider.query.filter_by(user_id=self.id).first()

        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "account_status": self.account_status,
            "access_privileges": self.access_privileges,
            "user_type": self.user_type,
            "rider_id": rider.id if rider else None,  # 👈 added
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }