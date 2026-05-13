from app import db
from datetime import datetime

class Ride(db.Model):
    __tablename__ = "rides"

    id          = db.Column(db.Integer, primary_key=True)
    rider_id    = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status      = db.Column(db.Integer, nullable=True)  # 0–4
    contact = db.Column(db.String(20), nullable=True)

    created_at  = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at  = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    rider    = db.relationship('User', foreign_keys=[rider_id])
    customer = db.relationship('User', foreign_keys=[customer_id])

    def to_dict(self):
        return {
            "id":          self.id,
            "rider_id":    self.rider_id,
            "customer_id": self.customer_id,
            "status":      self.status,
            "contact":     self.contact,
            "created_at":  self.created_at,
            "updated_at":  self.updated_at,
        }