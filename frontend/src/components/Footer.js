import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ background: '#1e1e2f', color: '#e0e0e0', padding: '2rem 0', textAlign: 'center' }}>
      <div className="container">
        <p>© PopcornTimes {new Date().getFullYear()} .</p>
        <div className="social-links">
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
        <p style={{ marginTop: '1rem' }}>
          <Link to="/contact" style={{ color: '#ff6f61', textDecoration: 'none', margin: '0 1rem' }}>
            Contact Us
          </Link>{' '}
          |
          <Link to="/about" style={{ color: '#ff6f61', textDecoration: 'none', margin: '0 1rem' }}>
            About
          </Link>{' '}
          |
          <Link to="/privacy" style={{ color: '#ff6f61', textDecoration: 'none', margin: '0 1rem' }}>
            Privacy Policy
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;