from app.applications.models import Application
from marshmallow_sqlalchemy import SQLAlchemySchema
from marshmallow import fields
from app import db
from marshmallow import post_load

class ApplicationSchema(SQLAlchemySchema):
    class Meta(SQLAlchemySchema.Meta):
        model = Application
        sqla_session = db.session

    id = fields.Number(dump_only=True)
    holder_id = fields.String(required=True)
    application_json = fields.Raw(required=True)
    issuer_id = fields.String(required=True)
    template_id = fields.Integer(required=True)
    status = fields.String(dump_only=True)  # status 为只读字段，不允许输入

    @post_load
    def make_instance(self, data, **kwargs):
        return Application(**data)