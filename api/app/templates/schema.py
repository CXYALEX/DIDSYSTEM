from marshmallow_sqlalchemy import SQLAlchemySchema
from marshmallow import fields
from app import db
from marshmallow import post_load
from app.templates.models import Template

class TemplateSchema(SQLAlchemySchema):
    class Meta(SQLAlchemySchema.Meta):
        model = Template
        sqla_session = db.session

    id = fields.Number(dump_only=True)
    name = fields.String(required=True)
    issuer_id = fields.String(required=True)
    template_json = fields.Raw(required=True)  # Use Raw for JSON field

    @post_load
    def make_instance(self, data, **kwargs):
        return Template(**data)