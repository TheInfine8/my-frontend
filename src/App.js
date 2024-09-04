import React, { useState, useEffect } from 'react';
import Login from './Login';
import './App.css';
import Chatbot from './components/Chatbot';
import { GoogleLogin } from '@react-oauth/google';

const App = () => {
  const [user, setUser] = useState(null);

  // Check if the user is already logged in
  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  // Handle login for existing users (Titan, Dcathelon, DRL)
  const handleLogin = (username) => {
    const validUsers = ['Titan', 'Dcathelon', 'DRL'];
    if (validUsers.includes(username)) {
      setUser(username);
      localStorage.setItem('loggedInUser', username); // Store user in localStorage
    } else {
      alert('Invalid username');
    }
  };

  // Handle Google login success
  const handleGoogleLoginSuccess = (credentialResponse) => {
    const { credential } = credentialResponse;

    // Send the Google credential to the backend for validation
    fetch('https://my-backend-service-y4up.onrender.com/register.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ credential }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const googleUser = data.user;
          setUser(googleUser.email); // You can change this based on how you want to display the user
          localStorage.setItem('loggedInUser', googleUser.email); // Store user in localStorage
        } else {
          alert('Google sign-in failed');
        }
      });
  };

  // Handle logout
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
        <div className="login-container">
          {/* Existing Username Login */}
          <Login onLogin={handleLogin} />

          {/* Google Sign-In */}
          <div className="google-login">
            <h3>Or Sign In with Google</h3>
            <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={() => alert('Google sign-in failed')} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;






