from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates

from config import db


class Ticket(db.Model, SerializerMixin):
    __tablename__ = 'tickets'
    
    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    purchase_date = db.Column(db.String, nullable=False)
    showtime = db.Column(db.String, nullable=False)
    screen = db.Column(db.Integer, nullable=False)

    
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete= 'Cascade'))
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id', ondelete= 'Cascade'))
    theatre_id = db.Column(db.Integer, db.ForeignKey('theaters.id', ondelete= 'Cascade'))

    # Serialization rules
    serialize_only = ('id','quantity','price','purchase_date','showtime','screen','user_id','movie_id','theatre_id',)
     
    # Validation
    @validates('quantity')
    def validate_quantity(self, key, quantity):
        if quantity <= 0:
            raise ValueError("Quantity must be greater than zero.")
        return quantity

    @validates('price')
    def validate_price(self, key, price):
        if price <= 0:
            raise ValueError("Price must be greater than zero.")
        return price
    
    def __repr__(self):
        return f"Ticket(ticket_id={self.ticket_id}, user_id={self.user_id}, movie_id={self.movie_id}, theatre_id={self.theatre_id}, quantity={self.quantity}, price={self.price}, purchase_date={self.purchase_date}, showtime={self.showtime})"
