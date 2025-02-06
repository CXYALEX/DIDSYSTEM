from app import db
from passlib.hash import pbkdf2_sha256 as sha256
from marshmallow_sqlalchemy import SQLAlchemySchema
from marshmallow import fields
from datetime import datetime
from sqlalchemy.orm import relationship  # 创建关系


# 用户
class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(50), nullable=True, unique=True)
    is_super = db.Column(db.SmallInteger)  # 是否为管理员，1为管理员
    is_active = db.Column(db.SmallInteger) # 账号是否禁用，1为禁用
    role_id = db.Column(db.Integer, db.ForeignKey("roles.id"))  # 所属角色
    remarks = db.Column(db.String(500))  # 备注
    reg_time = db.Column(db.DateTime, default=datetime.now)

    def create(self):
        db.session.add(self)
        db.session.commit()
        return self

    @classmethod
    def find_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

    @staticmethod
    def generate_hash(password):
        return sha256.hash(password)

    @staticmethod
    def verify_hash(password, hash):
        return sha256.verify(password, hash)


# 角色
class Role(db.Model):
    __tablename__ = "roles"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True)
    description = db.Column(db.String(600))  # 角色描述
    auths = db.Column(db.String(600))  # 权限列表
    add_time = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    admins = db.relationship("User", backref="roles")

    def create(self):
        db.session.add(self)
        db.session.commit()
        return self


# 权限
class Auth(db.Model):
    __tablename__ = "auth"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True)
    url = db.Column(db.String(255), unique=True)
    parent_id = db.Column(db.Integer, default=0)
    status = db.Column(db.Integer, default=0)
    add_time = db.Column(db.DateTime, index=True, default=datetime.utcnow)

    def create(self):
        db.session.add(self)
        db.session.commit()
        return self


# 菜单
class Menu(db.Model):
    __tablename__ = 'menu'
    id = db.Column(db.Integer, primary_key=True)
    icon = db.Column(db.String(50))
    name = db.Column(db.String(120), unique=True)
    path = db.Column(db.String(255), unique=True)
    component = db.Column(db.String(255), unique=True)
    pid = db.Column(db.Integer, default=1)
    add_time = db.Column(db.DateTime, index=True, default=datetime.utcnow)

    def create(self):
        db.session.add(self)
        db.session.commit()
        return self
