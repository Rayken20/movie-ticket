// ComingSoon.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ComingSoon({ movies }) {
    const [comingSoonMovies, setComingSoonMovies] = useState([]);

    useEffect(() => {
        const filteredMovies = movies.filter(movie => movie.tag === "upcoming");
        setComingSoonMovies(filteredMovies);
    }, [movies]);

    return (
        <div>
        <h1>Coming Soon</h1>
        <div className="container">
            <div className="row">
            {comingSoonMovies.map((movie, index) => (
                <div key={index} className="col-md-4 mb-4">
                <div className="card" style={{ width: '20rem' }}>
                    <img className="card-img-top" src={movie.poster_image} alt={`${movie.title} Poster`} style={{ height: '300px', objectFit: 'cover' }} />
                    <div className="card-body">
                    <h5 className="card-title">{movie.title}</h5>
                    <p className="card-text"><strong>Genre:</strong> {movie.genre}</p>
                    <p className="card-text"><strong>Director:</strong> {movie.director}</p>
                    <p className="card-text"><strong>Release Date:</strong> {movie.release_date}</p>
                    <Link to={`/movies/${movie.id}`} className="btn btn-primary">Details</Link>
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>
        </div>
    );
}
