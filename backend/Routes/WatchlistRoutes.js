const express = require("express");
const { getWatchlist, addToWatchlist, removeFromWatchlist } = require("../controller/WatchlistController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// All watchlist routes require authentication
router.get("/", authMiddleware, getWatchlist);
router.post("/:movieId", authMiddleware, addToWatchlist);
router.delete("/:movieId", authMiddleware, removeFromWatchlist);

module.exports = router;
