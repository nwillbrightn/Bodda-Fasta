from app import db
from datetime import datetime

class BodabodaRider(db.Model):
    __tablename__ = "bodaboda_riders"

    id = db.Column(db.Integer, primary_key=True)

    # FK to users table
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    # must start with MC (we enforce in code)
    plate_number = db.Column(db.String(20), unique=True, nullable=False)

    registered_name = db.Column(db.String(120), nullable=False)

    city = db.Column(db.String(100), nullable=False)

    # 🔥 NEW FIELDS
    is_available = db.Column(db.Boolean, default=True, nullable=False)
    current_lat  = db.Column(db.Float, nullable=True)
    current_lng  = db.Column(db.Float, nullable=True)

    # 🔥 RELATIONSHIP to User
    user = db.relationship("User", backref="rider", lazy=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "plate_number": self.plate_number,
            "registered_name": self.registered_name,
            "city": self.city,
            "is_available": self.is_available,
            "current_lat": self.current_lat,
            "current_lng": self.current_lng,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }