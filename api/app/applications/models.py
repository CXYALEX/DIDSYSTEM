from app import db
from datetime import datetime

class Application(db.Model):
    __tablename__ = 'applications'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    holder_id = db.Column(db.String(50), nullable=False)
    issuer_id = db.Column(db.String(50), nullable=True)  # 关联的签发机构
    template_id = db.Column(db.Integer, nullable=True)  # 新增的 template_id
    application_json = db.Column(db.JSON, nullable=False)
    status = db.Column(db.String(20), default="waited", nullable=False)  # 新增的 status 字段
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, holder_id, application_json, issuer_id=None, template_id=None):
        self.holder_id = holder_id
        self.application_json = application_json
        self.issuer_id = issuer_id
        self.template_id = template_id  # 初始化 template_id
        self.status = "waited"  # 初始化 status 字段

    def create(self):
        db.session.add(self)
        db.session.commit()
        return self