import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ movies, userEmail, isSignedIn }) => {
  const hasReviewed = (movie) => {
    return movie.reviews.some(review => review.userEmail === userEmail);
  };

  const getPosterUrl = (poster) => {
    if (!poster) return '/default-poster.jpg';
    if (poster.startsWith('http')) return poster;
    return `http://localhost:15400${poster}`;
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to PopcornTimes</h1>
        <p>Discover, Rate, and Review Your Favorite Movies!</p>
        <div className="hero-buttons">
          <Link to="/browse" className="hero-button browse-button">Browse Movies</Link>
          {!isSignedIn && (
            <Link to="/signup" className="hero-button signup-button">Sign Up Now</Link>
          )}
        </div>
      </div>
      <div className="movie-section">
        <h2>Featured Movies</h2>
        {movies.length > 0 ? (
          <div className="movie-grid">
            {movies.map((movie) => (
              <div key={movie._id} className="movie-card">
                <Link to={`/review/${movie._id}`} className="movie-poster-wrapper">
                  <img
                    src={getPosterUrl(movie.poster)}
                    alt={`${movie.name} poster`}
                    className="movie-poster"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-poster.jpg';
                    }}
                  />
                  <div className="movie-overlay">
                    <span>View Details</span>
                  </div>
                </Link>
                <div className="movie-details">
                  <h3>{movie.name} ({movie.releaseYear})</h3>
                  <p><strong>Genre:</strong> {movie.genre}</p>
                  {isSignedIn && hasReviewed(movie) && (
                    <span className="reviewed-badge">Reviewed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No movies available. Check back later!</p>
        )}
      </div>
    </div>
  );
};

export default Home;