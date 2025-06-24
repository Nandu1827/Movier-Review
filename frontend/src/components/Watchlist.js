import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Watchlist = ({ isSignedIn }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!isSignedIn) return;

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:15400/api/watchlist', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWatchlist(response.data.movies);
        setError('');
      } catch (error) {
        console.error('Error fetching watchlist:', error);
        setError('Failed to load watchlist');
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [isSignedIn]);

  const getPosterUrl = (poster) => {
    if (!poster) return '/default-poster.jpg';
    if (poster.startsWith('http')) return poster;
    return `http://localhost:15400${poster}`;
  };

  if (!isSignedIn) {
    return (
      <div className="watchlist-page container py-5">
        <div className="text-center">
          <h2>My Watchlist</h2>
          <p>Please sign in to view your watchlist.</p>
          <Link to="/signin" className="btn btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="watchlist-page container py-5">
        <div className="text-center">
          <h2>My Watchlist</h2>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="watchlist-page container py-5">
      <h2 className="text-center mb-4">My Watchlist</h2>
      {error && <div className="error-message text-center mb-4">{error}</div>}
      
      {watchlist.length > 0 ? (
        <div className="movie-grid">
          {watchlist.map((movie) => (
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
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p>Your watchlist is empty. Start adding movies!</p>
          <Link to="/browse" className="btn btn-primary">Browse Movies</Link>
        </div>
      )}
    </div>
  );
};

export default Watchlist; 