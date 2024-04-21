// admin.js

import React, { useState } from "react";

export default function Admin() {
  const genre_list = [
    "Action", "Comedy", "Drama", "Thriller", "Horror", "Romance", "Sci-Fi",
    "Crime", "Adventure", "Narrative", "Fantasy", "Documentary", "Musical",
    "Anime", "Mystery", "Slapstick", "Art", "Hindi", "Korean", "History"
  ];

  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    director: "",
    release_date: "",
    poster_image: "",
    trailer_url: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        // Movie added successfully
        alert("Movie added successfully!");
        // Clear form fields
        setFormData({
          title: "",
          genre: "",
          director: "",
          release_date: "",
          poster_image: "",
          trailer_url: ""
        });
      } else {
        // Error adding movie
        alert("Error adding movie. Please try again later.");
      }
    } catch (error) {
      console.error("Error adding movie: ", error);
      alert("Error adding movie. Please try again later.");
    }
  };

  return (
    <div className="container">
      <h1>Add Movie</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Genre:</label>
          <select
            className="form-control"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            required
          >
            <option value="">Select genre</option>
            {genre_list.map((genre, index) => (
              <option key={index} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Director:</label>
          <input
            type="text"
            className="form-control"
            name="director"
            value={formData.director}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Release Date:</label>
          <input
            type="date"
            className="form-control"
            name="release_date"
            value={formData.release_date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Poster Image URL:</label>
          <input
            type="url"
            className="form-control"
            name="poster_image"
            value={formData.poster_image}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Trailer URL:</label>
          <input
            type="text"
            className="form-control"
            name="trailer_url"
            value={formData.trailer_url}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Movie
        </button>
      </form>
    </div>
  );
}
