import React from 'react';
import { Link } from 'react-router-dom';

const Profile = ({ movies, userEmail, userFullName }) => {
  const userReviews = movies
    .map(movie => ({
      movie,
      review: movie.reviews.find(review => review.userEmail === userEmail),
    }))
    .filter(item => item.review);

  if (!userEmail) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <h2>Profile</h2>
          <p>Please sign in to view your profile.</p>
          <Link to="/signin" className="btn btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h2>Profile</h2>
        <p><strong>Username:</strong> {userFullName}</p>
        <p><strong>Email:</strong> {userEmail}</p>

        {/* Reviews Section */}
        <div className="user-reviews mt-4">
          <h3>Your Reviews</h3>
          {userReviews.length > 0 ? (
            <div>
              {userReviews.map(({ movie, review }, index) => (
                <div key={index} className="review-item">
                  <h4>{movie.name} ({movie.releaseYear})</h4>
                  <p><strong>Rating:</strong> {review.rating}/5</p>
                  <p><strong>Comment:</strong> {review.comment}</p>
                  <p><strong>Emotion:</strong> {review.emotionTag}</p>
                  <p><strong>Date:</strong> {new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>You haven't reviewed any movies yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;