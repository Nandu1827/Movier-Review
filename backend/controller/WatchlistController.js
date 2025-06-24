const Watchlist = require('../models/Watchlist');
const Movie = require('../models/Movie');

// Get user's watchlist
exports.getWatchlist = async (req, res) => {
  try {
    const userEmail = req.user.email;
    let watchlist = await Watchlist.findOne({ userEmail }).populate('movies');
    
    if (!watchlist) {
      watchlist = new Watchlist({ userEmail, movies: [] });
      await watchlist.save();
    }
    
    res.status(200).json(watchlist);
  } catch (error) {
    console.error('Error in getWatchlist:', error);
    res.status(500).json({ message: 'Server error in getWatchlist', error: error.message });
  }
};

// Add movie to watchlist
exports.addToWatchlist = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const movieId = req.params.movieId;

    // Validate movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    let watchlist = await Watchlist.findOne({ userEmail });
    if (!watchlist) {
      watchlist = new Watchlist({ userEmail, movies: [] });
    }

    // Check if movie is already in watchlist
    if (watchlist.movies.includes(movieId)) {
      return res.status(400).json({ message: 'Movie is already in watchlist' });
    }

    watchlist.movies.push(movieId);
    await watchlist.save();

    res.status(200).json({ message: 'Movie added to watchlist', watchlist });
  } catch (error) {
    console.error('Error in addToWatchlist:', error);
    res.status(500).json({ message: 'Server error in addToWatchlist', error: error.message });
  }
};

// Remove movie from watchlist
exports.removeFromWatchlist = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const movieId = req.params.movieId;

    const watchlist = await Watchlist.findOne({ userEmail });
    if (!watchlist) {
      return res.status(404).json({ message: 'Watchlist not found' });
    }

    watchlist.movies = watchlist.movies.filter(id => id.toString() !== movieId);
    await watchlist.save();

    res.status(200).json({ message: 'Movie removed from watchlist', watchlist });
  } catch (error) {
    console.error('Error in removeFromWatchlist:', error);
    res.status(500).json({ message: 'Server error in removeFromWatchlist', error: error.message });
  }
};
