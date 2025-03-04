from marshmallow_sqlalchemy import SQLAlchemySchema
from marshmallow import fields, post_load
from app import db
from app.template_generator.models import GeneratedTemplate

class GeneratedTemplateSchema(SQLAlchemySchema):
    class Meta(SQLAlchemySchema.Meta):
        model = GeneratedTemplate
        sqla_session = db.session

    id = fields.Number(dump_only=True)
    description = fields.String(required=True)
    attribute_count = fields.Integer(required=True)
    template_json = fields.Raw(required=True)
    created_at = fields.DateTime(dump_only=True)

    @post_load
    def make_instance(self, data, **kwargs):
        return GeneratedTemplate(**data)

class TemplateGeneratorInputSchema(SQLAlchemySchema):
    description = fields.String(required=True)
    attribute_count = fields.Integer(required=True)
