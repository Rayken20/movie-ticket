import React, { useState, useEffect } from "react";

export default function UserDashboard({ user }) {
  const [reviews, setReviews] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedReview, setEditedReview] = useState({
    rating: "",
    comment: ""
  });

  useEffect(() => {
    if (user) {
      fetchUserReviews(user.id);
      fetchUserTickets(user.id);
    }
  }, [user]);

  const fetchUserReviews = (userId) => {
    fetch("/reviews")
      .then((response) => response.json())
      .then((data) => {
        const userReviews = data.filter((review) => review.user.id === userId);
        setReviews(userReviews);
      })
      .catch((error) => {
        console.error("Error fetching user reviews:", error);
      });
  };

  const fetchUserTickets = (userId) => {
    fetch("/tickets")
      .then((response) => response.json())
      .then((data) => {
        const userTickets = data.filter((ticket) => ticket.user.id === userId);
        setTickets(userTickets);
      })
      .catch((error) => {
        console.error("Error fetching user tickets", error);
      });
  };

  const handleEditReview = (review) => {
    setEditingReviewId(review.id);
    setEditedReview({
      rating: review.rating,
      comment: review.comment
    });
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditedReview({
      rating: "",
      comment: ""
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedReview({
      ...editedReview,
      [name]: value
    });
  };

  const handleSaveReview = (reviewId) => {
    const { rating, title, comment } = editedReview;
    fetch(`/reviews/${reviewId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ rating: parseInt(rating), title, comment }) // Convert rating to an integer
    })
      .then((response) => {
        if (response.ok) {
          // Successfully updated review, reset editing state
          setEditingReviewId(null);
          setEditedReview({
            rating: "",
            title: "",
            comment: ""
          });
          // Update reviews data to reflect changes
          fetchUserReviews(user.id);
        } else {
          throw new Error("Failed to update review");
        }
      })
      .catch((error) => {
        console.error("Error updating review:", error);
      });
  };
  

  const handleDeleteReview = (reviewId) => {
    fetch(`/reviews/${reviewId}`, {
      method: "DELETE"
    })
      .then((response) => {
        if (response.ok) {
          // Successfully deleted review
          // Update reviews data to reflect changes
          fetchUserReviews(user.id);
        } else {
          throw new Error("Failed to delete review");
        }
      })
      .catch((error) => {
        console.error("Error deleting review:", error);
      });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <div>
        <h3>User Reviews</h3>
        <div className="row">
          {reviews.map((review) => (
            <div className="col-md-4 mb-4" key={review.id}>
              <div className="card" style={{ height: editingReviewId === review.id ? "auto" : "100%" }}>
                <div className="card-body">
                  {editingReviewId === review.id ? (
                    <div>
                      <form>
                        <div className="form-group">
                          <label htmlFor="rating">Rating:</label>
                          <input
                            type="number"
                            className="form-control"
                            id="rating"
                            name="rating"
                            value={editedReview.rating}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="comment">Comment:</label>
                          <textarea
                            className="form-control"
                            id="comment"
                            name="comment"
                            value={editedReview.comment}
                            onChange={handleInputChange}
                          />
                        </div>
                        <button
                          type="button"
                          className="btn btn-primary mr-2"
                          onClick={() => handleSaveReview(review.id)}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div>
                      <h5 className="card-title">Rating: {review.rating}/5</h5>
                      <p className="card-text">Title: {review.movie.title}</p>
                      <p className="card-text">Comment: {review.comment}</p>
                      <button
                        className="btn btn-sm btn-primary mr-2"
                        onClick={() => handleEditReview(review)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3>User Tickets</h3>
        <div className="row">
          {tickets.map((ticket) => (
            <div className="col-md-4 mb-4" key={ticket.id}>
              <div className="card">
                <div className="card-body">
                  <h5>Title: {ticket.movie.title}</h5>
                  <p className="card-text">Quantity: {ticket.quantity}</p>
                  <p className="card-text">Price: {ticket.price * ticket.quantity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
