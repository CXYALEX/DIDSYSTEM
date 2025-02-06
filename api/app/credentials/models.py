from app import db
from datetime import datetime

class Credential(db.Model):
    __tablename__ = 'credentials'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    holder_id = db.Column(db.String(50), nullable=False)
    issuer_id = db.Column(db.String(50), nullable=True)
    template_id = db.Column(db.Integer, nullable=True)
    credential_json = db.Column(db.JSON, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, holder_id, credential_json, issuer_id=None, template_id=None):
        self.holder_id = holder_id
        self.credential_json = credential_json
        self.issuer_id = issuer_id
        self.template_id = template_id

    def create(self):
        db.session.add(self)
        db.session.commit()
        return self