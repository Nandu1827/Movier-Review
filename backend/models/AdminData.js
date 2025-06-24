const mongoose = require("mongoose");

const adminDataSchema = new mongoose.Schema({
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
  poster: {
    type: String, // URL or file path for movie poster
    required: true,
  },
  isPublished: {
    type: Boolean,
    default: false, // Admin must approve before showing on homepage
  }
}, { timestamps: true });

const AdminData = mongoose.model("AdminData", adminDataSchema);

module.exports = AdminData;
