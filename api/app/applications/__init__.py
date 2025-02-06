from flask import Blueprint

applications_bp = Blueprint('applications_bp',__name__)

from app.applications import routes
