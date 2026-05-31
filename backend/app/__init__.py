from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
from dotenv import load_dotenv
import os

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
socketio = SocketIO()

def create_app():
    load_dotenv()

    app = Flask(__name__)
    CORS(app)

    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

    db.init_app(app)

    from app.models.user import User
    from app.models.bodaboda_rider import BodabodaRider
    from app.models.rating import Rating
    from app.models.ride import Ride

    migrate.init_app(app, db)
    jwt.init_app(app)
    socketio.init_app(app, cors_allowed_origins="*", async_mode="threading")

    from app.routes.user_routes import user_bp
    from app.routes.auth_routes import auth_bp
    from app.routes.bodaboda_routes import bodaboda_bp
    from app.routes.ride_routes import ride_bp

    app.register_blueprint(user_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(bodaboda_bp, url_prefix="/api")
    app.register_blueprint(ride_bp, url_prefix="/api")

    from app.sockets import rider_sockets
    rider_sockets.register(socketio)

    # Start MQTT client
    from app.mqtt_client import start_mqtt
    start_mqtt()

    return app