from flask import request
from app import db
from app.applications import applications_bp
from app.applications.models import Application
from app.applications.schema import ApplicationSchema
from app.utils.responses import response_with
from app.utils import responses as resp
from flask_jwt_extended import jwt_required

@applications_bp.route('/create', methods=['POST'])
def create_application():
    try:
        data = request.get_json()
        application_schema = ApplicationSchema()
        application = application_schema.load(data)
        result = application_schema.dump(application.create())
        return response_with(resp.SUCCESS_201, value={"application": result})
    except Exception as e:
        print(e)
        return response_with(resp.INVALID_INPUT_422)

@applications_bp.route('/issuer/<issuer_id>', methods=['GET'])
def get_applications(issuer_id):
    fetched = Application.query.filter_by(issuer_id=issuer_id).all()
    application_schema = ApplicationSchema(many=True)
    applications = application_schema.dump(fetched)
    return response_with(resp.SUCCESS_200, value={"applications": applications})

@applications_bp.route('/<int:id>', methods=['GET'])
def get_application_detail(id):
    fetched = Application.query.get_or_404(id)
    application_schema = ApplicationSchema()
    application = application_schema.dump(fetched)
    return response_with(resp.SUCCESS_200, value={"application": application})

@applications_bp.route('/<int:id>', methods=['PUT'])
def update_application_detail(id):
    data = request.get_json()
    get_application = Application.query.get_or_404(id)
    get_application.application_json = data['application_json']
    db.session.add(get_application)
    db.session.commit()

    application_schema = ApplicationSchema()
    application = application_schema.dump(get_application)
    return response_with(resp.SUCCESS_200, value={"application": application})

# @applications_bp.route('/applications/<int:id>', methods=['DELETE'])
# def delete_application(id):
#     get_application = Application.query.get_or_404(id)
#     db.session.delete(get_application)
#     db.session.commit()
#     return response_with(resp.SUCCESS_204)

@applications_bp.route('/update_status/rejected/<int:id>', methods=['PUT'])
def update_application_status_to_rejected(id):
    try:
        application = Application.query.get_or_404(id)
        application.status = "rejected"
        db.session.commit()

        application_schema = ApplicationSchema()
        result = application_schema.dump(application)
        return response_with(resp.SUCCESS_200, value={"application": result})
    except Exception as e:
        print(e)
        return response_with(resp.SERVER_ERROR_500)

@applications_bp.route('/update_status/completed/<int:id>', methods=['PUT'])
def update_application_status_to_completed(id):
    try:
        application = Application.query.get_or_404(id)
        application.status = "completed"
        db.session.commit()

        application_schema = ApplicationSchema()
        result = application_schema.dump(application)
        return response_with(resp.SUCCESS_200, value={"application": result})
    except Exception as e:
        print(e)
        return response_with(resp.SERVER_ERROR_500)
    
@applications_bp.route('/update_status/revoked/<int:id>', methods=['PUT'])
def update_application_status_to_revoked(id):
    try:
        application = Application.query.get_or_404(id)
        application.status = "revoked"
        db.session.commit()

        application_schema = ApplicationSchema()
        result = application_schema.dump(application)
        return response_with(resp.SUCCESS_200, value={"application": result})
    except Exception as e:
        print(e)
        return response_with(resp.SERVER_ERROR_500)