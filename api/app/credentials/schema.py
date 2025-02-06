from marshmallow_sqlalchemy import SQLAlchemySchema
from marshmallow import fields, post_load
from app.credentials.models import Credential
from app import db
class CredentialSchema(SQLAlchemySchema):
    class Meta(SQLAlchemySchema.Meta):
        model = Credential
        sqla_session = db.session

    id = fields.Number(dump_only=True)
    holder_id = fields.String(required=True)
    credential_json = fields.Raw(required=True)
    issuer_id = fields.String(required=True)
    template_id = fields.Integer(required=True)

    @post_load
    def make_instance(self, data, **kwargs):
        return Credential(**data)