import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = ({ setMovies }) => {
  const [name, setName] = useState('');
  const [genre, setGenre] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [description, setDescription] = useState('');
  const [poster, setPoster] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [preview, setPreview] = useState(null);
  const [movies, setLocalMovies] = useState([]);
  const [editingMovie, setEditingMovie] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get('http://localhost:15400/api/movies');
      setLocalMovies(response.data);
    } catch (error) {
      setError('Failed to fetch movies');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file (e.g., JPG, PNG).');
        setPoster(null);
        setPreview(null);
        return;
      }
      setPoster(file);
      setPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const resetForm = () => {
    setName('');
    setGenre('');
    setReleaseYear('');
    setDescription('');
    setPoster(null);
    setPreview(null);
    setEditingMovie(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !genre || !releaseYear || !description || (!poster && !editingMovie)) {
      setError('All fields are required.');
      setSuccess('');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('genre', genre);
    formData.append('releaseYear', releaseYear);
    formData.append('description', description);
    if (poster) {
      formData.append('poster', poster);
    }

    try {
      const token = localStorage.getItem('token');
      let response;

      if (editingMovie) {
        response = await axios.put(
          `http://localhost:15400/api/movies/${editingMovie._id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSuccess('Movie updated successfully!');
      } else {
        response = await axios.post('http://localhost:15400/api/movies', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        setSuccess('Movie added successfully!');
      }

      setMovies(prevMovies => {
        if (editingMovie) {
          return prevMovies.map(m => m._id === editingMovie._id ? response.data.movie : m);
        }
        return [...prevMovies, response.data.movie];
      });

      fetchMovies();
      resetForm();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save movie. Please try again.');
      setSuccess('');
    }
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setName(movie.name);
    setGenre(movie.genre);
    setReleaseYear(movie.releaseYear);
    setDescription(movie.description);
    setPreview(movie.poster.startsWith('http') ? movie.poster : `http://localhost:15400${movie.poster}`);
  };

  const handleDelete = async (movieId) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:15400/api/movies/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMovies(prevMovies => prevMovies.filter(m => m._id !== movieId));
      setLocalMovies(prevMovies => prevMovies.filter(m => m._id !== movieId));
      setSuccess('Movie deleted successfully!');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete movie. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1>Admin Panel</h1>
        <p>{editingMovie ? 'Edit Movie' : 'Add a new movie to the database'}</p>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="input-group">
            <label htmlFor="name">Movie Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter movie name"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="genre">Genre</label>
            <input
              type="text"
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Enter genre (e.g., Action, Comedy)"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="releaseYear">Release Year</label>
            <input
              type="number"
              id="releaseYear"
              value={releaseYear}
              onChange={(e) => setReleaseYear(e.target.value)}
              placeholder="Enter release year (e.g., 2023)"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter movie description"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="poster">Movie Poster</label>
            <input
              type="file"
              id="poster"
              accept="image/*"
              onChange={handleFileChange}
              required={!editingMovie}
            />
          </div>
          {preview && (
            <div className="poster-preview">
              <img src={preview} alt="Poster Preview" className="preview-image" />
            </div>
          )}
          <div className="button-group">
            <button type="submit" className="auth-button">
              {editingMovie ? 'Update Movie' : 'Add Movie'}
            </button>
            {editingMovie && (
              <button
                type="button"
                className="auth-button cancel-button"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        <div className="movie-list mt-5">
          <h2>Manage Movies</h2>
          <div className="movie-grid">
            {movies.map((movie) => (
              <div key={movie._id} className="movie-card">
                <img
                  src={movie.poster.startsWith('http') ? movie.poster : `http://localhost:15400${movie.poster}`}
                  alt={`${movie.name} poster`}
                  className="movie-poster"
                />
                <div className="movie-details">
                  <h3>{movie.name}</h3>
                  <p><strong>Genre:</strong> {movie.genre}</p>
                  <p><strong>Year:</strong> {movie.releaseYear}</p>
                  <div className="movie-actions">
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleEdit(movie)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(movie._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;