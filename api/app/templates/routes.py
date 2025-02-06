from flask import request
from app import db
from app.templates import templates_bp  # Ensure you have a blueprint for templates
from app.templates.models import Template
from app.templates.schema import TemplateSchema
from app.utils.responses import response_with
from app.utils import responses as resp

@templates_bp.route('/register', methods=['POST'])
def register_template():
    try:
        data = request.get_json()
        template_schema = TemplateSchema()
        template = template_schema.load(data)
        result = template_schema.dump(template.create())
        return response_with(resp.SUCCESS_201, value={"template": result})
    except Exception as e:
        print(e)
        return response_with(resp.INVALID_INPUT_422)

@templates_bp.route('/', methods=['GET'])
def get_template_list():
    fetched = Template.query.all()
    template_schema = TemplateSchema(many=True, only=['id', 'name', 'issuer_id'])
    templates = template_schema.dump(fetched)
    return response_with(resp.SUCCESS_200, value={"templates": templates})

@templates_bp.route('/<int:id>', methods=['GET'])
def get_template_detail(id):
    fetched = Template.query.get_or_404(id)
    template_schema = TemplateSchema()
    template = template_schema.dump(fetched)
    return response_with(resp.SUCCESS_200, value={"template": template})

@templates_bp.route('/searchbyname/<string:name>', methods=['GET'])
def get_template_by_name(name):
    try:
        fetched = Template.query.filter_by(name=name).first()
        if fetched:
            template_schema = TemplateSchema()
            template = template_schema.dump(fetched)
            return response_with(resp.SUCCESS_200, value={"template": template})
        else:
            return response_with(resp.NOT_FOUND_404, message=f"Template with name '{name}' not found")
    except Exception as e:
        print(e)
        return response_with(resp.INVALID_INPUT_422)