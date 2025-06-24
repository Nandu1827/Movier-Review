import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

const Navbar = ({ isSignedIn, userEmail, handleSignOut, isAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAdmin) {
      console.log('Admin user detected, setting up notifications...');
      fetchNotifications();
      // Set up polling for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication error: No token found');
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      const response = await axios.get('http://localhost:15400/api/notifications/admin/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (Array.isArray(response.data)) {
        setNotifications(response.data);
        setUnreadCount(response.data.filter(n => !n.isRead).length);
        setError('');
      } else {
        setError('Invalid notifications data received');
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setError('You must be an admin to view notifications.');
      } else {
        setError('Error fetching notifications. Please try again.');
      }
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const toggleDropdown = () => {
    if (isAdmin) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        fetchNotifications(); // Refresh notifications when opening dropdown
      }
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        setError('Authentication error: No token found');
        return;
      }

      await axios.put(
        `http://localhost:15400/api/notifications/admin/notifications/${notification._id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update local state immediately for better UX
      setNotifications(prevNotifications =>
        prevNotifications.map(n =>
          n._id === notification._id ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Refresh notifications in background
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error.response?.data || error.message);
      setError('Error marking notification as read. Please try again.');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand" to="/">PopcornTimes</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/browse">Browse</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact</Link>
            </li>
            {isSignedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/watchlist">Watchlist</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Profile</Link>
                </li>
                {isSignedIn && !isAdmin && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/contact">Contact</Link>
                  </li>
                )}
                {isAdmin && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">Admin Panel</Link>
                  </li>
                )}
                <li className="nav-item">
                  <button className="nav-link" onClick={handleSignOut}>Sign Out</button>
                </li>
                {isAdmin && (
                  <li className="nav-item">
                    <div className="notification-dropdown">
                      <div className="notification-trigger" onClick={toggleDropdown}>
                        <i className="fas fa-bell notification-icon"></i>
                        {unreadCount > 0 && (
                          <span className="notification-badge">{unreadCount}</span>
                        )}
                      </div>
                      {isOpen && (
                        <div className="notification-menu">
                          <div className="notification-header">
                            <h3>Notifications</h3>
                            <button className="close-button" onClick={toggleDropdown}>
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                          {error && <div className="error-message">{error}</div>}
                          <div className="notification-list">
                            {notifications && notifications.length > 0 ? (
                              notifications.map((notification) => (
                                <div
                                  key={notification._id}
                                  className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                                  onClick={() => handleNotificationClick(notification)}
                                >
                                  <div className="notification-content">
                                    <h4>{notification.name}</h4>
                                    <p className="notification-email">{notification.email}</p>
                                    <p className="notification-message">{notification.message}</p>
                                    <p className="notification-time">
                                      {new Date(notification.createdAt).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="no-notifications">No notifications</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                )}
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/signin">Sign In</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;