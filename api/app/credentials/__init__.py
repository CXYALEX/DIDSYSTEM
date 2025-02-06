from flask import Blueprint

credentials_bp = Blueprint('credentials_bp',__name__)

from app.credentials import routes
