#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request,session,jsonify,make_response
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports

from models.movies import Movie
from models.tickets import Ticket
from models.users import User
from models.reviews import Review
from models.theaters import Theatre
# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

class ClearSession(Resource):

    def delete(self):
    
        session['page_views'] = None
        session['user_id'] = None

        return {}, 204
    
class Movies(Resource):
    def get(self):
        movies = [movie.to_dict() for movie in Movie.query.all()]
        return make_response(jsonify(movies),200)
    
    def post(self):
        data = request.get_json()
        
        try:
            title = data['title']
            genre = data['genre']
            director = data['director']
            release_date = data['release_date']
            poster_image = data['poster_image']
            trailer_url = data['trailer_url']
        
        except Exception as e:
            return make_response(jsonify({"errors": ['validation errors']}),400)
        
        movie = Movie(title=title,genre=genre,director=director,release_date=release_date,poster_image=poster_image,trailer_url=trailer_url)
        
        try:
            db.session.add(movie)
            db.session.commit()
            return make_response(jsonify(movie.to_dict()), 201)
        
        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({"errors": "Failed to create Movie"}), 400)
        
    
class Movie_By_ID(Resource):
    def get(self, id):
        movie = Movie.query.filter_by(id=id).first()
        
        if not movie:
            response_dict = {"error": "Movie not found"}
            return make_response(jsonify(response_dict), 404)
        
        return make_response(jsonify(movie.to_dict()), 200)

    def patch(self, id):
        movie = Movie.query.filter_by(id=id).first()

        if not movie:
            response_dict = {"error": "Movie not found"}
            return make_response(jsonify(response_dict), 404)

        data = request.get_json()
        
        try:
            if 'title' in data:
                movie.title = data['title']
            if 'genre' in data:
                movie.genre = data['genre']
            if 'director' in data:
                movie.director = data['director']
            if 'release_date' in data:
                movie.release_date = data['release_date']
            if 'poster_image' in data:
                movie.poster_image = data['poster_image']

            db.session.commit()
            return make_response(jsonify({"message": "Movie updated successfully.", "movie": movie.to_dict()}), 200)

        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({"error": "Failed to update movie.", "details": str(e)}), 400)

    def delete(self, id):
        movie = Movie.query.filter_by(id=id).first()

        if not movie:
            response_dict = {"error": "Movie not found"}
            return make_response(jsonify(response_dict), 404)

        try:
            db.session.delete(movie)
            db.session.commit()
            return make_response(jsonify({"message": "Movie deleted successfully."}), 200)

        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({"error": "Failed to delete movie.", "details": str(e)}), 400)

    
class Theaters(Resource):
    def get(self):
        theatres = [theatre.to_dict() for theatre in Theatre.query.all()]
        return make_response(jsonify(theatres), 200)

    def post(self):
        data = request.get_json()
        
        try:
            name = data['name']
            location = data['location']
            capacity = data['capacity']
        
        except KeyError:
            return make_response(jsonify({"error": "Validation error: Missing required fields."}), 400)
        
        try:
            theatre = Theatre(name=name, location=location, capacity=capacity)
            db.session.add(theatre)
            db.session.commit()
            return make_response(jsonify({"message": "Theater created successfully.", "theatre": theatre.to_dict()}), 201)
        
        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({"error": "Failed to create theatre.", "details": str(e)}), 400)

class Reviews(Resource):
    def get(self):
        reviews = Review.query.all()
        reviews_data = []
        for review in reviews:
            response_data = {
             "id": review.id,
            "comment": review.comment,
            "rating":review.rating,
            "user": {
                "id":review.user.id,
                "name":review.user.username,
            },
            "movie": {
                "id":review.movie.id,
                "title":review.movie.title,
                "genre": review.movie.genre,
                "director": review.movie.director,
                "release_date": review.movie.release_date   
            }
            }
            reviews_data.append(response_data)
        return make_response(jsonify(reviews_data), 200)

    def post(self):
        data = request.get_json()
        expected_keys = ['rating', 'comment', 'user_id', 'movie_id']
        missing_keys = [key for key in expected_keys if key not in data]

        if missing_keys:
            return make_response(jsonify({"errors": [f"Validation errors: Missing required fields: {', '.join(missing_keys)}"]}), 401)

        try:
            rating = data['rating']
            if rating < 0:
                return make_response(jsonify({"errors": ['Rating must be an integer above 0']}), 400)
            
            comment = data['comment']
            user_id = data['user_id']
            movie_id = data['movie_id']
            
            review = Review(rating=rating, comment=comment, user_id=user_id, movie_id=movie_id)
            db.session.add(review)
            db.session.commit()
            
            response_data = {
                "id": review.id,
                "comment": review.comment,
                "rating": review.rating,
                "user": {
                    "id": review.user.id,
                    "name": review.user.username,
                },
                "movie": {
                    "id": review.movie.id,
                    "title": review.movie.title,
                    "genre": review.movie.genre,
                    "director": review.movie.director,
                    "release_date": review.movie.release_date
                }
            }

            return make_response(jsonify({"message": "Review added successfully.", "review": response_data}), 201)

        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({"errors": ['Failed to create review.', str(e)]}), 400)

        
       

class ReviewById(Resource):
    def get(self, id):
        review = Review.query.filter_by(id=id).first()
        response_data = {
            "id": review.id,
            "comment": review.comment,
            "rating":review.rating,
            "user": {
                "id":review.user.id,
                "name":review.user.username,
            },
            "movie": {
                "id":review.movie.id,
                "title":review.movie.title,
                "genre": review.movie.genre,
                "director": review.movie.director,
                "release_date": review.movie.release_date
            }
        }
        
        if not review:
            response_dict = {"error": "Review not found"}
            return make_response(jsonify(response_dict), 404)
        
        return make_response(jsonify(response_data), 200)

    def patch(self, id):
        review = Review.query.filter_by(id=id).first()

        if not review:
            response_dict = {"error": "Review not found"}
            return make_response(jsonify(response_dict), 404)

        data = request.get_json()
        
        try:
            if 'rating' in data:
                review.rating = data['rating']
            if 'comment' in data:
                review.comment = data['comment']

            db.session.commit()
            return make_response(jsonify({"message": "Review updated successfully.", "review": review.to_dict()}), 200)

        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({"error": "Failed to update review.", "details": str(e)}), 400)

    def delete(self, id):
        review = Review.query.filter_by(id=id).first()

        if not review:
            response_dict = {"error": "Review not found"}
            return make_response(jsonify(response_dict), 404)

        try:
            db.session.delete(review)
            db.session.commit()
            return make_response(jsonify({"message": "Review deleted successfully."}), 200)

        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({"error": "Failed to delete review.", "details": str(e)}), 400)

class Tickets(Resource):
    def get(self):
        tickets = Ticket.query.all()
        tickets_data = []
        for ticket in tickets:
            response_data = {
            "id": ticket.id,
            "price": ticket.price,
            "purchase_date": ticket.purchase_date,
            "screen":ticket.screen,
            "quantity":ticket.quantity,
            "showtime":ticket.showtime,
            "user": {
                "id":ticket.user.id,
                "name":ticket.user.username,
            },
            "movie": {
                "id":ticket.movie.id,
                "title":ticket.movie.title,
                "genre": ticket.movie.genre,
                "director": ticket.movie.director,
                "release_date": ticket.movie.release_date
            },
            "theatre": {
                "id": ticket.theatre.id,
                "name": ticket.theatre.name,
                "location": ticket.theatre.location,
                "capacity":ticket.theatre.capacity,
            }
            }
            tickets_data.append(response_data)
        return make_response(jsonify(tickets_data), 200)

    def post(self):
        data = request.get_json()
        
        try:
            user_id = data['user_id']
            movie_id = data['movie_id']
            theatre_id = data['theatre_id']
            price = data['price']
            purchase_date = data['purchase_date']
            screen = data['screen']
            quantity = data['quantity']
            showtime = data['showtime']
        
        except KeyError:
            return make_response(jsonify({"error": "Validation error: Missing required fields."}), 400)
        
        try:
            ticket = Ticket(user_id=user_id, movie_id=movie_id, theatre_id=theatre_id, price=price, purchase_date=purchase_date, screen=screen,quantity=quantity,showtime=showtime)
            db.session.add(ticket)
            db.session.commit()
            return make_response(jsonify({"message": "Ticket created successfully.", "ticket": ticket.to_dict()}), 201)
        
        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({"error": "Failed to create ticket.", "details": str(e)}), 400)

class TicketsByID(Resource):
    def get(self, id):
        ticket = Ticket.query.filter_by(id=id).first()
        response_data = {
            "id": ticket.id,
            "price": ticket.price,
            "purchase_date": ticket.purchase_date,
            "screen":ticket.screen,
            "quantity":ticket.quantity,
            "showtime":ticket.showtime,
            "user": {
                "id":ticket.user.id,
                "name":ticket.user.username,
            },
            "movie": {
                "id":ticket.movie.id,
                "title":ticket.movie.title,
                "genre": ticket.movie.genre,
                "director": ticket.movie.director,
                "release_date": ticket.movie.release_date
            },
            "theatre": {
                "id": ticket.theatre.id,
                "name": ticket.theatre.name,
                "location": ticket.theatre.location,
                "capacity":ticket.theatre.capacity,
            }
            }
        
        if not ticket:
            response_dict = {"error": "Ticket not found"}
            return make_response(jsonify(response_dict), 404)
        
        return make_response(jsonify(response_data), 200)

    def patch(self, id):
        ticket = Ticket.query.filter_by(id=id).first()

        if not ticket:
            response_dict = {"error": "Ticket not found"}
            return make_response(jsonify(response_dict), 404)

        data = request.get_json()
        
        try:
            if 'user_id' in data:
                ticket.user_id = data['user_id']
            if 'movie_id' in data:
                ticket.movie_id = data['movie_id']
            if 'theatre_id' in data:
                ticket.theatre_id = data['theatre_id']
            if 'price' in data:
                ticket.price = data['price']
            if 'purchase_date' in data:
                ticket.purchase_date = data['purchase_date']
            if 'screen' in data:
                ticket.screen = data['screen']
            if 'quantity' in data:
                ticket.quantity = data['quantity']
            if 'showtime' in data:
                ticket.showtime = data['showtime']

            db.session.commit()
            return make_response(jsonify({"message": "Ticket updated successfully.", "ticket": ticket.to_dict()}), 200)

        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({"error": "Failed to update ticket.", "details": str(e)}), 400)

    def delete(self, id):
        ticket = Ticket.query.filter_by(id=id).first()

        if not ticket:
            response_dict = {"error": "Ticket not found"}
            return make_response(jsonify(response_dict), 404)

        try:
            db.session.delete(ticket)
            db.session.commit()
            return make_response(jsonify({"message": "Ticket deleted successfully."}), 200)

        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({"error": "Failed to delete ticket.", "details": str(e)}), 400)

class TheatreById(Resource):
    def get(self, id):
        theatre = Theatre.query.filter_by(id=id).first()
        
        if not theatre:
            response_dict = {"error": "Theater not found"}
            return make_response(jsonify(response_dict), 404)
        
        return make_response(jsonify(theatre.to_dict()), 200)

    def patch(self, id):
        theatre = Theatre.query.filter_by(id=id).first()

        if not theatre:
            response_dict = {"error": "Theater not found"}
            return make_response(jsonify(response_dict), 404)

        data = request.get_json()
        
        try:
            if 'name' in data:
                theatre.name = data['name']
            if 'location' in data:
                theatre.location = data['location']
            if 'capacity' in data:
                theatre.capacity = data['capacity']

            db.session.commit()
            return make_response(jsonify({"message": "Theater updated successfully.", "theatre": theatre.to_dict()}), 200)

        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({"error": "Failed to update theatre.", "details": str(e)}), 400)

    def delete(self, id):
        theatre = Theatre.query.filter_by(id=id).first()

        if not theatre:
            response_dict = {"error": "Theater not found"}
            return make_response(jsonify(response_dict), 404)

        try:
            db.session.delete(theatre)
            db.session.commit()
            return make_response(jsonify({"message": "Theater deleted successfully."}), 200)

        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({"error": "Failed to delete theatre.", "details": str(e)}), 400)
        
class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')  
        user = User.query.filter(User.username == username).first()
        
        if user and user.authenticate(data['password']):
            session['user_id'] = user.id
            return user.to_dict(), 200
        
        return {}, 401

class Signup(Resource):
    
    def post(self):
        json = request.get_json()
        user = User(
            username=json['username'],
            email=json['email']
        )
        user.password_hash = json['password']
        db.session.add(user)
        db.session.commit()
        return user.to_dict(), 201
 
class Logout(Resource):
    def delete(self):
        session.pop('user_id',None)
        return {},204
    
class CheckSession(Resource):
    def get(self):
        user_id = session['user_id']
        if user_id is not None:
            user = User.query.filter(User.id == user_id).first()
            if user is not None:
                return user.to_dict()
        
        return {},204
    
api.add_resource(ClearSession, '/clear', endpoint='clear')
api.add_resource(Movies, '/movies')
api.add_resource(Movie_By_ID, '/movies/<int:id>')
api.add_resource(Theaters, '/theaters')
api.add_resource(Reviews,'/reviews')
api.add_resource(TheatreById, '/theaters/<int:id>')
api.add_resource(ReviewById, '/reviews/<int:id>')
api.add_resource(Tickets,'/tickets')
api.add_resource(TicketsByID, '/tickets/<int:id>')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

