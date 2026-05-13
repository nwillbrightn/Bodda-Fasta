from app import db
from datetime import datetime

class Rating(db.Model):
    __tablename__ = "ratings"

    id = db.Column(db.Integer, primary_key=True)

    # FK to bodaboda_riders
    rider_id = db.Column(db.Integer, db.ForeignKey("bodaboda_riders.id"), nullable=False)

    review = db.Column(db.Text, nullable=True)

    # 0 - 5
    rate = db.Column(db.Float, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    # relationship
    rider = db.relationship("BodabodaRider", backref="ratings", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "rider_id": self.rider_id,
            "review": self.review,
            "rate": self.rate,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }