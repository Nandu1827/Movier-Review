const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  fullName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  emotionTag: { type: String, enum: ['Happy', 'Sad', 'Scary', 'Thrilled', 'Funny', 'Romantic'], required: false },
});

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Movie name is required"],
    trim: true,
    unique: true,
  },
  genre: {
    type: String,
    required: [true, "Genre is required"],
    trim: true,
  },
  releaseYear: {
    type: Number,
    required: [true, "Release year is required"],
    min: [1900, "Enter a valid year"],
  },
  description: {
    type: String,
    required: [true, "Movie description is required"],
    trim: true,
  },
  poster: {
    type: String,
    required: true,
  },
  reviews: [reviewSchema],
}, { timestamps: true });

// Pre-save hook to convert releaseYear to a number
movieSchema.pre('save', function (next) {
  if (typeof this.releaseYear === 'string') {
    this.releaseYear = parseInt(this.releaseYear, 10);
  }
  next();
});

module.exports = mongoose.model("Movie", movieSchema);