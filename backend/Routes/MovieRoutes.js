const express = require("express");
const multer = require("multer");
const path = require("path");
const { getMovies, getPublishedMovies, getMovieById, addMovie, submitReview, updateMovie, deleteMovie } = require("../controller/MovieController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Set up Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure "uploads/" directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage: storage });

// Public routes
router.get("/", getMovies); // Get all movies (with filters)
router.get("/published", getPublishedMovies); // Get published movies (for Home page)
router.get("/:id", getMovieById); // Get movie by ID (for Review page)

// Protected routes
router.post("/", authMiddleware, upload.single("poster"), addMovie); // Add movie (admin only)
router.post("/:id/review", authMiddleware, submitReview); // Submit review (users only)
router.put("/:id", authMiddleware, upload.single("poster"), updateMovie);
router.delete("/:id", authMiddleware, deleteMovie);

module.exports = router;