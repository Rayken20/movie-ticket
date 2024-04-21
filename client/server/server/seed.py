#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
from random import uniform
from datetime import datetime, timedelta

# Remote library imports
from faker import Faker

from config import db

# Local imports
from app import app
from models.movies import Movie
from models.tickets import Ticket
from models.users import User
from models.reviews import Review
from models.theaters import Theatre

def seed_movies(num_movies=20):
    genre_list = ["Action", "Comedy", "Drama", "Thriller", "Horror", "Romance", "Sci-Fi", "Crime", "Adventure", "Narrative", "Fantasy", "Documentary", "Musical", "Anime", "Mystery", "Slapstick", "Art", "Hindi", "Korean", "History"]
    movies = []
    for _ in range(num_movies):
        start_date = datetime.now() - timedelta(days=30)    # 1 month ago from today
        end_date = datetime.now() + timedelta(days=60)      # 2 months from now
        movie = Movie(
            title=fake.catch_phrase(),
            genre=rc(genre_list),
            director=fake.name(),
            release_date=fake.date_between(start_date=start_date, end_date=end_date).strftime('%Y-%m-%d'),
            poster_image=fake.image_url()
        )
        movies.append(movie)
        db.session.add(movie)
    db.session.commit()
    return movies

def seed_theatres(num_theatres=10):
    theatre_names = ["Westgate Cinema", "Prestige Cinema", "Mega Cinema", "Planet Media Cinemas", "Century Cinemax", "Motion Cinemas", "Nyumba Cinema", "Anga Sky Cinema", "Nairobi Cinema", "Casino Cinema"]
    theatre_locations = ["The Hub Karen", "Westgate mall", "Junction mall", "GardenCity Mall", "PanariSky Centre", "Rosslyn Riviera Mall", "Sarit Centre", "Greenspan mall", "K.U", "Kisumu Mega Plaza"]
    theatres = []
    for _ in range(num_theatres):
        theatre = Theatre(
            name=rc(theatre_names),
            location=rc(theatre_locations),
            capacity=randint(50, 100),
            
        )
        theatres.append(theatre)
        db.session.add(theatre)
    db.session.commit()
    print (theatres)


def seed_users(num_users=50):
    users = []
    for _ in range(num_users):
        user = User(
            username=fake.user_name(),
            email=fake.email(),
        )
        user.password_hash = fake.password()
        users.append(user)
        db.session.add(user)
    db.session.commit()
    return users

def seed_tickets(num_tickets=50):
    movies = Movie.query.all()
    users = User.query.all()
    theatres = Theatre.query.all()
    tickets = []
    for _ in range(num_tickets):
        ticket = Ticket(
            user=fake.random_element(users),
            movie=fake.random_element(movies),
            theatre=fake.random_element(theatres),
            quantity=randint(1, 5),
            price=randint(100, 500),
            purchase_date=fake.date_time_this_year(),
            showtime=fake.date_time_this_month(),
            screen = randint(1,5),
        )
        tickets.append(ticket)
        db.session.add(ticket)
    db.session.commit()
    return tickets

def seed_reviews(num_reviews=30):
    movies = Movie.query.all()
    users = User.query.all()
    theatres = Theatre.query.all()
    reviews = []
    for _ in range(num_reviews):
        review = Review(
            user=fake.random_element(users),
            movie=fake.random_element(movies),
            rating = randint(1, 5),
            comment=fake.paragraph(),
            submission_date=fake.date_time_this_month()
        )
        reviews.append(review)
        db.session.add(review)
    db.session.commit()
    return reviews

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():

        print("Clearing db...")
        Theatre.query.delete()
        Ticket.query.delete()
        User.query.delete()
        Review.query.delete()

        print("Starting seed...")

        # print("seeding movies...")
        # movies = seed_movies()

        print("seeding theatres...")
        theatres = seed_theatres()

        print("seeding users...")
        users = seed_users()

        print("seeding tickets...")
        tickets = seed_tickets()

        print("seeding reviews...")
        reviews = seed_reviews()

        print("Seed completed successfully!")
