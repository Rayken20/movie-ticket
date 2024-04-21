from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from config import db

class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer)
    comment = db.Column(db.String)
    submission_date = db.Column(db.DateTime, default=db.func.now())
      
    # Add relationships
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'))
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id', ondelete='CASCADE'))
    
    # Add serialization
    serialize_only = ('id','rating','comment','submission_date','user_id','movie_id',)
    
    # Add Validation
    @validates('rating')
    def validate_rating(self, key, rating):
        if rating is None or not isinstance(rating, int) or rating < 0 or rating > 5:
            raise ValueError('Rating must be a non-empty int with a positive value less than 5')
        return rating
        
    @validates('comment')
    def validate_comment(self, key, comment):
        if comment is None or not isinstance(comment, str):
            raise ValueError('Comment must be a non-empty string')
        return comment

    def __repr__(self):
        return f"<Review(id={self.id}, user_id={self.user_id}, movie_id={self.movie_id}, rating={self.rating}, comment={self.comment}, submission_date={self.submission_date})>"
