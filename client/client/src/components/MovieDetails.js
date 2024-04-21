import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function MovieDetails({ user }) {
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [theaters, setTheaters] = useState([]);
    const [selectedTheaterId, setSelectedTheaterId] = useState(null);
    const [selectedTheater, setSelectedTheater] = useState(null);
    const [formData, setFormData] = useState({
        rating: "",
        comment: "",
        user_id: user ? user.id : null,
        movie_id: parseInt(movieId, 10)
    });
    const [ticketFormData, setTicketFormData] = useState({
        quantity: 0,
        price: 0,
        showtime: "",
        screen:Math.floor(Math.random() * 5) + 1,
        user_id: user ? user.id : null,
        movie_id: parseInt(movieId, 10)
    });
    const [showBuyTicketForm, setShowBuyTicketForm] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [showtimes, setShowtimes] = useState(["11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM"]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let parsedValue = value;
        if (name === 'rating') {
            // Ensure the value is an integer
            parsedValue = parseInt(value) || 0;
        }
        // Update the form data
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: parsedValue
        }));
    };

    const generateRandomShowtimes = () => {
        const randomShowtimes = [];
        for (let i = 0; i < 4; i++) {
            const randomHour = Math.floor(Math.random() * 24);
            const randomMinute = Math.floor(Math.random() * 60);
            const showtime = new Date().setHours(randomHour, randomMinute);
            randomShowtimes.push(new Date(showtime));
        }
        return randomShowtimes;
    };

    const fetchMovie = async (movieId) => {
        const url = `/movies/${movieId}`;
        try {
            const response = await fetch(url, {
                headers: {
                    Accept: "application/json"
                },
            });
            const data = await response.json();
            setMovie(data);
        } catch (error) {
            console.error("Error fetching movie: ", error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            // Log the form data
            console.log("Form Data:", formData);

            // Send comment and rating to the backend
            const response = await fetch("/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ formData })
            });

            if (response.ok) {
                // Comment submitted successfully, refresh reviews
                alert("Review added successfully");
                // Reset comment and rating inputs
                setFormData({
                    ...formData,
                    rating: 0,
                    comment: ""
                });
            } else if (response.status === 401) {
                // Handle validation errors
                const responseData = await response.json();
                console.error("Validation errors:", responseData.errors);
                alert("Validation errors: " + responseData.errors.join(", "));
            } else {
                alert("Error adding review. Please try again later");
            }
        } catch (error) {
            console.error("Error submitting comment: ", error);
        }
    };

    const getMovieReviews = (movieId) => {
        movieId = parseInt(movieId);
        fetch("/reviews")
            .then((response) => response.json())
            .then((data) => {
                const movieReviews = data.filter((review) => review.movie.id === movieId);
                setReviews(movieReviews);
            })
            .catch((error) => {
                console.error("Error fetching movie reviews:", error);
            });
    };

    const averageMovieRating = () => {
        if (reviews.length === 0) return 0;
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = totalRating / reviews.length;
        return parseFloat(averageRating.toFixed(1)); // Round to one decimal point
    };

    const fetchTickets = (movieId) => {
        movieId = parseInt(movieId);
        fetch("/tickets")
            .then((response) => response.json())
            .then((data) => {
                const movieTickets = data.filter((ticket) => parseInt(ticket.movie.id) === movieId);
                setTickets(movieTickets);
            })
            .catch((error) => {
                console.error("Error fetching tickets", error);
            });
    };

    const fetchTheaterById = async (theaterId) => {
        const url = `/theaters/${theaterId}`;
        try {
            const response = await fetch(url, {
                headers: {
                    Accept: "application/json"
                },
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching theater by id: ", error);
            return null;
        }
    };

    const fetchTheatersForTickets = async () => {
        const theaterIds = tickets.map((ticket) => parseInt(ticket.theatre.id));
        const uniqueTheaterIds = Array.from(new Set(theaterIds));
        const theatersPromises = uniqueTheaterIds.map((theaterId) => fetchTheaterById(theaterId));
        const theatersData = await Promise.all(theatersPromises);
        setTheaters(theatersData.filter((theater) => theater !== null));
    };

    const handleTheaterChange = async (event) => {
        const theaterId = event.target.value;
        setSelectedTheaterId(theaterId);
        if (theaterId) {
            const theaterInfo = await fetchTheaterById(theaterId);
            setSelectedTheater(theaterInfo);
            setShowBuyTicketForm(true); // Show Buy Ticket form when a theater is selected
        } else {
            setSelectedTheater(null);
            setShowBuyTicketForm(false); // Hide Buy Ticket form when no theater is selected
        }
    };

    useEffect(() => {
        if (movieId) {
            fetchMovie(movieId);
            fetchTickets(movieId);
            getMovieReviews(movieId);
        }
    }, [movieId]);

    useEffect(() => {
        fetchTheatersForTickets();
    }, [tickets]);

    useEffect(() => {
        if (selectedTheater && selectedDate) {
            // Logic to fetch showtimes based on selected theater and date
            const randomShowtimes = generateRandomShowtimes();
            setShowtimes(randomShowtimes);
        }
    }, [selectedTheater, selectedDate]);

    const handleTicketSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/tickets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...ticketFormData,
                    showtime: `${ticketFormData.date} ${selectedTime}` // Combine date and time for showtime
                })
            });
            if (response.ok) {
                alert("Ticket purchased successfully!");
                // Reset ticket form data
                setTicketFormData({
                    ...ticketFormData,
                    quantity: 0,
                    price: 0,
                    screen: ""
                });
            } else {
                alert("Error purchasing ticket. Please try again later.");
            }
        } catch (error) {
            console.error("Error purchasing ticket:", error);
            alert("Error purchasing ticket. Please try again later.");
        }
    };

    const handleQuantityChange = (e) => {
        const { name, value } = e.target;
        setTicketFormData((prevFormData) => ({
            ...prevFormData,
            [name]: parseInt(value),
            price: generateRandomPrice(parseInt(value))
        }));
    };
    
    const generateRandomPrice = (quantity) => {
        const basePrice = Math.floor(Math.random() * (125 - 100 + 1)) + 100; // Random base price between 100 and 125
        return basePrice * quantity;
    };

    const today = new Date();
    const twoWeeksFromNow = new Date(today);
    twoWeeksFromNow.setDate(today.getDate() + 14);
        

    return (
        <div className="container">
            {movie ? (
                <div className="row">
                    <div className="col-md-6 mb-4">
                        <div className="movie-details">
                            <div className="movie-info">
                                <h1>{movie.title}</h1>
                                <p><strong>Genre:</strong> {movie.genre}</p>
                                <p><strong>Director:</strong> {movie.director}</p>
                                <p><strong>Release Date:</strong> {movie.release_date}</p>
                                <p><strong>About:</strong> {movie.about}</p>
                                <p><strong>Average Rating: </strong>{averageMovieRating()}/5</p>
                            </div>
                            {/* Comments section */}
                            <div className="comments-section">
                                <h2>Reviews</h2>
                                {/* Render reviews */}
                                <ul>
                                    {reviews.map((review, index) => (
                                        <li key={index}>
                                            <p>Rating: {review.rating} / 5</p>
                                            <p>{review.comment}</p>
                                        </li>
                                    ))}
                                </ul>
                                {/* Comment form */}
                                <form onSubmit={handleCommentSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="comment">Your Review:</label>
                                        <textarea
                                            className="form-control"
                                            id="comment"
                                            value={formData.comment}
                                            onChange={handleChange}
                                            name="comment"
                                            placeholder="Enter your comment"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="rating">Your Rating (1-5):</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="rating"
                                            value={parseInt(formData.rating)}
                                            onChange={handleChange}
                                            name="rating"
                                            placeholder="Enter your rating"
                                            min={1}
                                            max={5}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mb-4">
                        {/* Movie trailer */}
                        {movie.trailer_url && (
                            <div className="movie-trailer">
                                <iframe
                                    width="100%"
                                    height="315"
                                    src={movie.trailer_url}
                                    title={movie.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        )}
                        {/* Select a theater */}
                        {theaters.length > 0 && (
                            <div className="theater-section">
                                <h2>Select a Theater:</h2>
                                <select className="form-control mb-4" onChange={handleTheaterChange} value={selectedTheaterId}>
                                    <option value="">Select a theater</option>
                                    {theaters.map((theater) => (
                                        <option key={theater.id} value={theater.id}>{theater.name}</option>
                                    ))}
                                </select>
                                {showBuyTicketForm && (
                                    <div className="buy-ticket-form">
                                        <h3>Buy Ticket</h3>
                                        <form onSubmit={handleTicketSubmit}>
                                        <div className="form-group">
                                        <label>Quantity:</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="quantity"
                                            value={ticketFormData.quantity}
                                            onChange={handleQuantityChange}
                                            min={0}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Price:</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="price"
                                            value={ticketFormData.price}
                                            readOnly
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Date:</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="date"
                                            value={ticketFormData.date}
                                            onChange={(e) => setTicketFormData({ ...ticketFormData, date: e.target.value })}
                                            min={today.toISOString().split('T')[0]} // Convert to ISO string and format to 'YYYY-MM-DD'
                                            max={twoWeeksFromNow.toISOString().split('T')[0]} // Convert to ISO string and format to 'YYYY-MM-DD'
                                            required
                                        />
                                    </div>
                                            <div className="form-group">
                                                <label>Time:</label>
                                                <select
                                                    className="form-control"
                                                    value={selectedTime}
                                                    onChange={(e) => setSelectedTime(e.target.value)}
                                                    required
                                                >
                                                    <option value="">Select a time</option>
                                                    {showtimes.map((time, index) => (
                                                        <option key={index} value={time}>{time}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <button type="submit" className="btn btn-primary">Buy Ticket</button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
