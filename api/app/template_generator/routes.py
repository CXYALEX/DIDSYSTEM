from flask import request, jsonify
from app import db
from app.template_generator import template_generator_bp
from app.template_generator.generator import credential_template_generator, validate_template
from app.template_generator.models import GeneratedTemplate
from app.template_generator.schema import GeneratedTemplateSchema, TemplateGeneratorInputSchema
from app.utils.responses import response_with
from app.utils import responses as resp
from marshmallow import ValidationError

@template_generator_bp.route('/generate', methods=['POST'])
def generate_template():
    """
    Generate a credential template based on description and attribute count.
    
    Request body:
    {
        "description": "Description of the credential",
        "attribute_count": 6
    }
    """
    try:
        # Validate input
        input_schema = TemplateGeneratorInputSchema()
        data = request.get_json()
        
        if not data:
            return response_with(resp.BAD_REQUEST_400, message="No input data provided")
        
        try:
            validated_data = input_schema.load(data)
        except ValidationError as err:
            return response_with(resp.INVALID_INPUT_422, message=str(err))
        
        description = validated_data.get('description')
        attribute_count = validated_data.get('attribute_count')
        
        if not description or not attribute_count:
            return response_with(resp.INVALID_INPUT_422, message="Description and attribute count are required")
        
        if attribute_count <= 0 or attribute_count > 20:
            return response_with(resp.INVALID_INPUT_422, message="Attribute count must be between 1 and 20")
            
        # Generate template
        template = credential_template_generator(description, attribute_count)
        
        if not template:
            return response_with(resp.SERVER_ERROR_500, message="Failed to generate template")
            
        # Validate the generated template
        validated_template = validate_template(template)
        
        # Save to database
        gen_template = GeneratedTemplate(
            description=description,
            attribute_count=attribute_count,
            template_json=validated_template
        )
        db.session.add(gen_template)
        db.session.commit()
        
        # Return results
        template_schema = GeneratedTemplateSchema()
        result = template_schema.dump(gen_template)
        
        return response_with(resp.SUCCESS_201, value={"template": result})
        
    except Exception as e:
        print(f"Error in generate_template: {str(e)}")
        db.session.rollback()
        return response_with(resp.SERVER_ERROR_500, message=str(e))

@template_generator_bp.route('/history', methods=['GET'])
def get_generated_templates():
    """Get a list of previously generated templates"""
    try:
        templates = GeneratedTemplate.query.order_by(GeneratedTemplate.created_at.desc()).limit(50).all()
        template_schema = GeneratedTemplateSchema(many=True, exclude=['template_json'])
        result = template_schema.dump(templates)
        return response_with(resp.SUCCESS_200, value={"templates": result})
    except Exception as e:
        print(e)
        return response_with(resp.SERVER_ERROR_500)

@template_generator_bp.route('/history/<int:id>', methods=['GET'])
def get_generated_template_detail(id):
    """Get details of a specific generated template"""
    try:
        template = GeneratedTemplate.query.get_or_404(id)
        template_schema = GeneratedTemplateSchema()
        result = template_schema.dump(template)
        return response_with(resp.SUCCESS_200, value={"template": result})
    except Exception as e:
        print(e)
        return response_with(resp.SERVER_ERROR_500)
