from flask import request
from app import db
from app.credentials import credentials_bp  # Ensure you have a blueprint for templates
from app.credentials.models import Credential
from app.credentials.schema import CredentialSchema
from app.utils.responses import response_with
from app.utils import responses as resp

@credentials_bp.route('/register', methods=['POST'])
def register_credential():
    try:
        data = request.get_json()
        credential_schema = CredentialSchema()
        credential = credential_schema.load(data)
        result = credential_schema.dump(credential.create())
        return response_with(resp.SUCCESS_201, value={"credential": result})
    except Exception as e:
        print(e)
        return response_with(resp.INVALID_INPUT_422)

@credentials_bp.route('/holder/<holder_id>', methods=['GET'])
def get_applications(holder_id):
    fetched = Credential.query.filter_by(holder_id=holder_id).all()
    credential_schema = CredentialSchema(many=True)
    credentials = credential_schema.dump(fetched)
    return response_with(resp.SUCCESS_200, value={"credentials": credentials})

@credentials_bp.route('/<int:id>', methods=['GET'])
def get_credential_detail(id):
    fetched = Credential.query.get_or_404(id)
    credential_schema = CredentialSchema()
    credential = credential_schema.dump(fetched)
    return response_with(resp.SUCCESS_200, value={"credential": credential})