import React, { useState, useEffect } from 'react';
import Login from './Login';
import './App.css';
import Chatbot from './components/Chatbot';

const App = () => {
  const [user, setUser] = useState(null);

  // Check for logged-in user in localStorage when the component mounts
  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  // Handle login for predefined users (Titan, Dcathelon, DRL)
  const handleLogin = (username) => {
    const validUsers = ['Titan', 'Dcathelon', 'DRL'];
    if (validUsers.includes(username)) {
      setUser(username);
      localStorage.setItem('loggedInUser', username); // Store user in localStorage
    } else {
      alert('Invalid username');
    }
  };

  // Handle logout by clearing user state and localStorage
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('loggedInUser');
  };

  return (
    <div className="app-container">
      {user ? (
        <div className="greeting-container">
          <h1>Hello, {user}!</h1>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
          <Chatbot loggedInUser={user} />
        </div>
      ) : (
        // Google Login and traditional login are handled in Login.js
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;

