import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

const Browse = ({ movies, setMovies, isSignedIn, userEmail }) => {
  const [ratingFilter, setRatingFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filteredMovies, setFilteredMovies] = useState(movies);

  const getAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return "No reviews";
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    return avg.toFixed(1);
  };

  const hasReviewed = (movie) => {
    return movie.reviews.some((review) => review.userEmail === userEmail);
  };

  const uniqueYears = [...new Set(movies.map((movie) => movie.releaseYear))].sort((a, b) => b - a);
  const uniqueGenres = [...new Set(movies.map((movie) => movie.genre))].sort();

  const handleApplyFilters = async () => {
    try {
      const params = {};
      if (ratingFilter) params.rating = ratingFilter;
      if (genreFilter) params.genre = genreFilter;
      if (yearFilter) params.releaseYear = yearFilter;
      if (sortBy) params.sortBy = sortBy;

      console.log('Applying filters with params:', params);
      const response = await axios.get('http://localhost:15400/api/movies', { params });
      let filtered = response.data;

      if (searchTerm) {
        filtered = filtered.filter(movie =>
          movie.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      console.log('Filtered movies:', filtered);
      setFilteredMovies(filtered);
    } catch (error) {
      console.error('Error applying filters:', error);
      // Show error message to user
      alert('Error applying filters. Please try again.');
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    handleApplyFilters();
  };

  return (
    <div className="browse-page container py-5">
      <h2 className="text-center mb-4 browse-heading">Browse Movies</h2>

      {/* Filter Section - Inline with Box */}
      <div className="card filter-box mb-5">
        <div className="card-body p-4">
          <h5 className="card-title mb-3 filter-heading">Filter Movies</h5>
          <div className="row g-3 align-items-center">
            {/* Search Bar */}
            <div className="col-md-3 position-relative">
              <input
                type="text"
                className="form-control search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by movie name..."
              />
              {searchTerm && (
                <button
                  className="btn btn-link clear-search-button position-absolute"
                  style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }}
                  onClick={handleClearSearch}
                >
                  ✕
                </button>
              )}
            </div>
            {/* Rating Filter */}
            <div className="col-md-2">
              <select
                className="form-select filter-select"
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
              >
                <option value="">All Ratings</option>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <option key={rating} value={rating}>{rating}+ Stars</option>
                ))}
              </select>
            </div>
            {/* Genre Filter */}
            <div className="col-md-2">
              <select
                className="form-select filter-select"
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
              >
                <option value="">All Genres</option>
                {uniqueGenres.map((genre) => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            {/* Year Filter */}
            <div className="col-md-2">
              <select
                className="form-select filter-select"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              >
                <option value="">All Years</option>
                {uniqueYears.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            {/* Sort By Filter */}
            <div className="col-md-2">
              <select
                className="form-select filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="">Sort By</option>
                <option value="rating">Top Rated</option>
                <option value="releaseYear">Release Year</option>
              </select>
            </div>
            {/* Apply Filters Button */}
            <div className="col-md-1">
              <button
                className="btn btn-primary w-100 apply-button"
                onClick={handleApplyFilters}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Cards */}
      {filteredMovies.length > 0 ? (
        <div className="movie-grid">
          {filteredMovies.map((movie) => (
            <div key={movie._id} className="movie-card">
              <Link to={`/review/${movie._id}`} className="movie-poster-wrapper">
                <img
                  src={
                    movie.poster
                      ? movie.poster.startsWith("http")
                        ? movie.poster
                        : `http://localhost:15400${movie.poster}`
                      : "/default-poster.jpg"
                  }
                  alt={`${movie.name} poster`}
                  className="movie-poster"
                />
                <div className="movie-overlay">
                  <span>View Details</span>
                </div>
              </Link>
              <div className="movie-details">
                <h3 className="movie-title">{movie.name} ({movie.releaseYear})</h3>
                <p><strong>Genre:</strong> {movie.genre}</p>
                <p><strong>Avg Rating:</strong> {getAverageRating(movie.reviews)}</p>
                {isSignedIn && hasReviewed(movie) && (
                  <span className="badge bg-success reviewed-badge">Reviewed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-light">No movies match your filters or search.</p>
      )}
    </div>
  );
};

export default Browse;



