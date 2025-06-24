const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: [true, "User email is required"],
    trim: true,
  },
  movies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  }]
}, { timestamps: true });

module.exports = mongoose.model("Watchlist", watchlistSchema); 