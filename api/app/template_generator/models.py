from app import db
import datetime

class GeneratedTemplate(db.Model):
    __tablename__ = 'generated_templates'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    description = db.Column(db.Text, nullable=False)
    attribute_count = db.Column(db.Integer, nullable=False)
    template_json = db.Column(db.JSON, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def __init__(self, description, attribute_count, template_json):
        self.description = description
        self.attribute_count = attribute_count
        self.template_json = template_json

    def create(self):
        db.session.add(self)
        db.session.commit()
        return self
