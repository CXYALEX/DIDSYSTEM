from flask import Blueprint

template_generator_bp = Blueprint('template_generator_bp', __name__)

from app.template_generator import routes
