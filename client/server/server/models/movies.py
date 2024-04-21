from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from datetime import datetime, date
from urllib.parse import urlparse  # Import urlparse for URL parsing
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

class Movie(db.Model, SerializerMixin):
    __tablename__ = 'movies'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    genre = db.Column(db.String)
    director = db.Column(db.String)
    release_date = db.Column(db.String)
    poster_image = db.Column(db.String)
    trailer_url = db.Column(db.String)
    tag = db.Column(db.String)

    tickets = db.relationship('Ticket', backref='movie', lazy=True)
    reviews = db.relationship('Review', backref='movie', lazy=True)
      
    review_ratings = association_proxy('reviews', 'rating')
    review_comments = association_proxy('reviews', 'comment')
    tickets_quantity = association_proxy('tickets','quantity')

    serialize_only = ('id', 'title', 'genre', 'director', 'release_date', 'poster_image', 'trailer_url', 'tag','review_ratings','review_comments','tickets_quantity',)

    @validates('release_date')
    def validates_release_date(self, key, release_date):
        if release_date is not None:
            try:
                datetime.strptime(release_date, '%Y-%m-%d')  
            except ValueError:
                raise ValueError('Release date must be in the format YYYY-MM-DD')
        return release_date

    @property
    def calculate_tag(self):
        release_date = datetime.strptime(self.release_date, '%Y-%m-%d').date()  # Adjusted format
        today = date.today()
        if release_date > today:
            return 'upcoming'
        elif release_date <= today:
            return 'in theatres'

    def __repr__(self):
        return f'<Movie {self.id} {self.title}>'

    def __init__(self, **kwargs):
        super(Movie, self).__init__(**kwargs)
        self.tag = self.calculate_tag
        self.trailer_url = self.parse_trailer_url(kwargs.get('trailer_url', ''))  # Parse trailer URL

    def parse_trailer_url(self, trailer_url):
        # If the URL is not provided or is empty, return None
        if not trailer_url:
            return None
        
        # Parse the URL to ensure it's properly formatted
        parsed_url = urlparse(trailer_url)
        
        # Check if the scheme is valid (http or https) and return the sanitized URL
        if parsed_url.scheme in ['http', 'https']:
            return trailer_url
        else:
            # If the scheme is not valid, return None or raise an error based on your requirement
            return None  # Or raise ValueError('Invalid trailer URL')
