from marshmallow_sqlalchemy import SQLAlchemySchema
from marshmallow import fields
from app.users.models import User,Auth,Role,Menu
from app import db
from marshmallow import post_load

class UserSchema(SQLAlchemySchema):
    class Meta(SQLAlchemySchema.Meta):
        model = User
        sqla_session = db.session

    id = fields.Number(dump_only=True)
    username = fields.String(required=True)
    role_id = fields.Integer(required=True)
    password = fields.String(load_only=True, required=True)

    @post_load
    def make_instance(self, data, **kwargs):
        return User(**data) 

class AuthSchema(SQLAlchemySchema):
    class Meta(SQLAlchemySchema.Meta):
        model = Auth
        sqla_session = db.session

    id = fields.Number(dump_only=True)
    name = fields.String(required=True)

    @post_load
    def make_instance(self, data, **kwargs):
        return Auth(**data) 

class RoleSchema(SQLAlchemySchema):
    class Meta(SQLAlchemySchema.Meta):
        model = Role
        sqla_session = db.session

    id = fields.Number(dump_only=True)
    name = fields.String(required=True)

    @post_load
    def make_instance(self, data, **kwargs):
        return Role(**data) 


class MenuSchema(SQLAlchemySchema):
    class Meta(SQLAlchemySchema.Meta):
        model = Menu
        sqla_session = db.session

    id = fields.Number(dump_only=True)
    name = fields.String(required=True)

    @post_load
    def make_instance(self, data, **kwargs):
        return Menu(**data) 