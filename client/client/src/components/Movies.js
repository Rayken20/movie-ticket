// Movies.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import 'bootstrap/dist/css/bootstrap.min.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import NowShowing from "./NowShowing";

export default function Movies(){
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const url = '/movies';
                const response = await fetch(url, {
                    headers: {
                        'Accept': "application/json",
                        'Content-Type': "application/json",
                    },
                });
                const data = await response.json();
                setMovies(data);
                console.log(data)
            } catch (error) {
                console.log('Error fetching movies:', error);
            }
        };
        fetchMovies();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 2
    };

    return (
        <div>
        <h1>Movies</h1>
        <div className="container">
            <Slider {...settings}>
                {movies.map((movie, index) => (
                <div key={index} className="movie-card">
                    <div className="col-md-4 mb-4">
                    <div className="card" style={{ width: '27rem' }}>
                        <img className="card-img-top" src={movie.poster_image} alt={`${movie.title} Poster`} style={{ height: '500px', objectFit: 'cover' }} />
                        <div className="card-body">
                        <h5 className="card-title">{movie.title}</h5>
                        <p className="card-text"><strong>Genre:</strong> {movie.genre}</p>
                        <p className="card-text"><strong>Director:</strong> {movie.director}</p>
                        <p className="card-text"><strong>Release Date:</strong> {movie.release_date}</p>
                        <Link to={`/movies/${movie.id}`} className="btn btn-primary">Details</Link>
                        </div>
                    </div>
                    </div>
                </div>
                ))}
            </Slider>
            </div>

        </div>
       
    );
}
