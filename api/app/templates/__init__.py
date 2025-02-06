from flask import Blueprint

templates_bp = Blueprint('templates_bp',__name__)

from app.templates import routes
