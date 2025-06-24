const mongoose = require('mongoose');
const Movie = require('../models/Movie');
// Get All Movies (supports filtering and sorting)
exports.getMovies = async (req, res) => {
  try {
    let query = {};

    // Filtering conditions
    if (req.query.genre) query.genre = req.query.genre;
    if (req.query.releaseYear) query.releaseYear = Number(req.query.releaseYear);
    
    // Get all movies first
    let movies = await Movie.find(query);

    // Apply rating filter if specified
    if (req.query.rating) {
      const minRating = Number(req.query.rating);
      movies = movies.filter(movie => {
        if (!movie.reviews || movie.reviews.length === 0) return false;
        const avgRating = movie.reviews.reduce((sum, r) => sum + r.rating, 0) / movie.reviews.length;
        return avgRating >= minRating;
      });
    }

    // Apply sorting if specified
    if (req.query.sortBy) {
      if (req.query.sortBy === 'rating') {
        movies.sort((a, b) => {
          const avgRatingA = a.reviews.length ? a.reviews.reduce((sum, r) => sum + r.rating, 0) / a.reviews.length : 0;
          const avgRatingB = b.reviews.length ? b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length : 0;
          return avgRatingB - avgRatingA;
        });
      } else if (req.query.sortBy === 'releaseYear') {
        movies.sort((a, b) => b.releaseYear - a.releaseYear);
      }
    }

    console.log('Filtered and sorted movies:', movies.length);
    res.status(200).json(movies);
  } catch (error) {
    console.error('Error in getMovies:', error.message, error.stack);
    res.status(500).json({ message: 'Server error in getMovies', error: error.message });
  }
};

// Get Published Movies (for Home Page)
exports.getPublishedMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error) {
    console.error('Error in getPublishedMovies:', error.message, error.stack);
    res.status(500).json({ message: 'Server error in getPublishedMovies', error: error.message });
  }
};

// Get Movie by ID (for Review Page)
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.status(200).json(movie);
  } catch (error) {
    console.error('Error in getMovieById:', error.message, error.stack);
    res.status(500).json({ message: 'Server error in getMovieById', error: error.message });
  }
};

// Add Movie (Admin only)
exports.addMovie = async (req, res) => {
  const { name, genre, releaseYear, description } = req.body;
  const poster = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    if (!name || !genre || !releaseYear || !description || !poster) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate releaseYear is a number
    const releaseYearNum = parseInt(releaseYear, 10);
    if (isNaN(releaseYearNum)) {
      return res.status(400).json({ message: 'Release year must be a valid number' });
    }

    const movie = new Movie({
      name,
      genre,
      releaseYear: releaseYearNum,
      description,
      poster,
      reviews: [],
    });
    await movie.save();
    res.status(201).json({ message: 'Movie added successfully', movie });
  } catch (error) {
    console.error('Error in addMovie:', error.message, error.stack);
    res.status(500).json({ message: 'Server error in addMovie', error: error.message });
  }
};

// Submit Review
exports.submitReview = async (req, res) => {
  const { rating, comment, fullName, emotionTag } = req.body;
  const userEmail = req.user.email;

  try {
    // Validate movieId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid movie ID' });
    }

    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    // Validate required fields
    if (!rating || !comment || !fullName) {
      return res.status(400).json({ message: 'Rating, comment, and name are required' });
    }

    // Validate rating is a number between 1 and 5
    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
    }

    // Validate emotionTag if provided
    if (emotionTag && !['Happy', 'Sad', 'Scary', 'Thrilled', 'Funny', 'Romantic'].includes(emotionTag)) {
      return res.status(400).json({ message: 'Invalid emotion tag' });
    }

    const existingReview = movie.reviews.find(review => review.userEmail === userEmail);
    if (existingReview) return res.status(400).json({ message: 'You have already reviewed this movie' });

    movie.reviews.push({
      userEmail,
      fullName,
      rating: ratingNum,
      comment,
      emotionTag: emotionTag || null,
      createdAt: new Date(),
    });
    await movie.save();
    res.status(201).json({ message: 'Review submitted successfully', movie });
  } catch (error) {
    console.error('Error in submitReview:', error.message, error.stack);
    res.status(500).json({ message: 'Server error in submitReview', error: error.message });
  }
};

// Update Movie (Admin only)
exports.updateMovie = async (req, res) => {
  try {
    const { name, genre, releaseYear, description } = req.body;
    const movieId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({ message: 'Invalid movie ID' });
    }

    const updateData = {
      name,
      genre,
      releaseYear: parseInt(releaseYear, 10),
      description
    };

    // If a new poster is uploaded, update the poster path
    if (req.file) {
      updateData.poster = `/uploads/${req.file.filename}`;
    }

    const movie = await Movie.findByIdAndUpdate(
      movieId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json({ message: 'Movie updated successfully', movie });
  } catch (error) {
    console.error('Error in updateMovie:', error.message, error.stack);
    res.status(500).json({ message: 'Server error in updateMovie', error: error.message });
  }
};

// Delete Movie (Admin only)
exports.deleteMovie = async (req, res) => {
  try {
    const movieId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({ message: 'Invalid movie ID' });
    }

    const movie = await Movie.findByIdAndDelete(movieId);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Error in deleteMovie:', error.message, error.stack);
    res.status(500).json({ message: 'Server error in deleteMovie', error: error.message });
  }
};