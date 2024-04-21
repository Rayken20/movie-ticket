from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
from config import db, bcrypt
from sqlalchemy.ext.associationproxy import association_proxy

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    email = db.Column(db.String, nullable=False, unique=True)
    _password_hash = db.Column(db.String)

    tickets = db.relationship('Ticket', backref='user', lazy=True)
    reviews = db.relationship('Review', backref='user', lazy=True)
    
    review_ratings = association_proxy('reviews', 'rating')
    review_comments = association_proxy('reviews', 'comment')
    ticket_quantities = association_proxy('tickets', 'quantity')
    ticket_prices = association_proxy('tickets', 'price')
    ticket_purchase_dates = association_proxy('tickets', 'purchase_date')
    ticket_showtimes = association_proxy('tickets', 'showtime')
    ticket_screens = association_proxy('tickets', 'screen')

    serialize_only = ('id','username','email','review_ratings','review_comments','ticket_quantities','ticket_prices','ticket_purchase_dates','ticket_showtimes','ticket_screens',)

    @validates('username')
    def validate_username(self, key, username):
        existing_user = User.query.filter(User.username == username).first()
        if existing_user:
            raise ValueError("Username already exists")
        return username

    @validates('email')
    def validate_email(self, key, email):
        existing_email = User.query.filter(User.email == email).first()
        if existing_email:
            raise ValueError("Email already exists")
        return email

    @hybrid_property
    def password_hash(self):
        raise Exception('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))

    def __repr__(self):
        return f'User {self.username}, ID: {self.id}'
