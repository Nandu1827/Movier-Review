import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ContactUs = ({ isSignedIn }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting contact form:', formData);
      const response = await axios.post('http://localhost:15400/api/notifications/contact', formData);
      console.log('Contact form response:', response.data);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setError('');
      
      // Show success message for 3 seconds then redirect
      setTimeout(() => {
        setIsSubmitted(false);
        if (isSignedIn) {
          navigate('/profile');
        } else {
          navigate('/');
        }
      }, 3000);
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message);
      setError('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>We'd love to hear from you! Reach out with any questions or feedback.</p>
          <ul className="contact-details">
            <li>
              <i className="fas fa-envelope" style={{ marginRight: '0.5rem', color: '#ff6f61' }}></i>
              <strong>Email:</strong>{' '}
              <a href="mailto:support@popcorntimes.com">support@popcorntimes.com</a>
            </li>
            <li>
              <i className="fas fa-phone" style={{ marginRight: '0.5rem', color: '#ff6f61' }}></i>
              <strong>Phone:</strong>{' '}
              <a href="tel:+1234567890">+1 (234) 567-890</a>
            </li>
            <li>
              <i className="fas fa-map-marker-alt" style={{ marginRight: '0.5rem', color: '#ff6f61' }}></i>
              <strong>Address:</strong> 123 Movie Lane, Cinema City, CA 90210
            </li>
          </ul>
          <div className="social-links">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a
                href="https://facebook.com"
                className="social-icon"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://twitter.com"
                className="social-icon"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <i className="fab fa-x-twitter"></i>
              </a>
              <a
                href="https://instagram.com"
                className="social-icon"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="contact-form">
          <h2>Send Us a Message</h2>
          {isSubmitted && (
            <div className="success-message">
              Thank you for your message! We'll get back to you soon.
            </div>
          )}
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit} className="form">
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                required
              />
            </div>
            <button type="submit" className="auth-button">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;