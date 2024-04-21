from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

class Theatre(db.Model, SerializerMixin):
   
    __tablename__ = 'theaters'
    
    theatre_names = ["Westgate Cinema", "Prestige Cinema", "Mega Cinema", "Planet Media Cinemas", "Century Cinemax", "Motion Cinemas", "Nyumba Cinema", "Anga Sky Cinema", "Nairobi Cinema", "Casino Cinema"]
    theatre_locations = ["The Hub Karen", "Westgate mall", "Junction mall", "GardenCity Mall", "PanariSky Centre", "Rosslyn Riviera Mall", "Sarit Centre", "Greenspan mall", "K.U", "Kisumu Mega Plaza"]

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    location = db.Column(db.String, nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
   
    # Relationships
    tickets = db.relationship('Ticket', backref='theatre', lazy=True)
    
    ticket_showtimes = association_proxy('tickets', 'showtime')
    ticket_screens = association_proxy('tickets', 'screen') 
    
    # Serialization rules
    serialize_only = ('id','name','location','capacity','ticket_showtimes','ticket_screens')
    
    
    

    @validates('capacity')
    def validate_capacity(self, key, capacity):
        if capacity is None:
            raise ValueError("Capacity must be provided")
        if not isinstance(capacity, int) or capacity <= 0:
            raise ValueError("Capacity must be a positive integer")

        return capacity

    @validates('name')
    def validate_name(self, key, name):
        if not name:
            raise ValueError("Name of theatre must be provided")
        if not isinstance(name, str) or len(name) < 1:
            raise ValueError("Name must be a non-empty string")

        return name

    @validates('location')
    def validate_location(self, key, location):
        if not location: 
            raise ValueError("Location of theatre must be provided")
        if not isinstance(location, str) or len(location) < 1:
            raise ValueError("Location must be a non-empty string")

        return location

    def __repr__(self):
        return f"<Theatre(id={self.id}, name={self.name}, location={self.location}, capacity={self.capacity})>"
