import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link if you're using react-router

function NowShowing({ movies }) {
  const [nowShowingMovies, setNowShowingMovies] = useState([]);

  useEffect(() => {
    // Filter movies based on the "in_theaters" tag
    const filteredMovies = movies.filter(movie => movie.tag === "in theatres");
    setNowShowingMovies(filteredMovies);
  }, [movies]);

  return (
    <div>
      <h2>Now Showing</h2>
      <div className="card-columns container">
        {nowShowingMovies.map(movie => (
          <div className="card" key={movie.id}>
            <img
              className="card-img-top"
              src={movie.poster_image}
              alt={`${movie.title} Poster`}
              style={{ height: '300px', objectFit: 'cover' }}
            />
            <div className="card-body">
              <h5 className="card-title">{movie.title}</h5>
              <p className="card-text"><strong>Genre:</strong> {movie.genre}</p>
              <p className="card-text"><strong>Director:</strong> {movie.director}</p>
              <p className="card-text"><strong>Release Date:</strong> {movie.release_date}</p>
              {/* Assuming you're using react-router, change Link to appropriate navigation */}
              <Link to={`/movies/${movie.id}`} className="btn btn-primary">Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NowShowing;
