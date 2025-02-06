from app import db

class Template(db.Model):
    __tablename__ = 'templates'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    issuer_id = db.Column(db.String(50), nullable=False)  # Assuming issuerID is a string
    template_json = db.Column(db.JSON, nullable=False)

    def __init__(self, name, issuer_id, template_json):
        self.name = name
        self.issuer_id = issuer_id
        self.template_json = template_json

    def create(self):
        db.session.add(self)
        db.session.commit()
        return self