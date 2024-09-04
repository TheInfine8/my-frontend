import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);

  // Handle traditional username login (for Titan, Dcathelon, DRL)
  const handleLogin = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (username.trim()) {
        onLogin(username.trim());
      } else {
        alert('Please enter a username.');
      }
    }
  };

  // Handle Google OAuth login success
  const onGoogleLoginSuccess = (credentialResponse) => {
    console.log('Login Success:', credentialResponse);
    const { credential } = credentialResponse;

    // Send the credential to the backend to validate and handle sign-up or login
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
          console.log('User logged in successfully:', data);

          // Check if the user object is defined
          if (data.user && data.user.email) {
            let googleEmail = data.user.email;
            let mappedUser;

            // Map Google email to predefined users including sujitahire25 as a valid user
            if (googleEmail === 'testuser1@gmail.com') {
              mappedUser = 'Titan';
            } else if (googleEmail === 'testuser2@gmail.com') {
              mappedUser = 'Dcathelon';
            } else if (googleEmail === 'testuser3@gmail.com') {
              mappedUser = 'DRL';
            } else if (googleEmail === 'sujitahire25@gmail.com') {
              mappedUser = 'Sujit'; // Map this email to give access like Titan, Dcathelon, DRL
            } else {
              alert('Access denied: This Google account is not authorized.');
              return;
            }

            // Treat the Google user as one of the predefined users (Titan, Dcathelon, DRL)
            setUser(mappedUser);
            localStorage.setItem('loggedInUser', mappedUser); // Store the mapped user in localStorage
          } else {
            console.error('Error: No email found in the user data:', data);
          }
        } else {
          console.error('Login failed:', data.message);
        }
      })
      .catch((error) => {
        console.error('Google login failed:', error);
      });
  };

  // Handle Google OAuth login failure
  const onGoogleLoginError = () => {
    console.error('Google login failed');
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      {/* Traditional Username Login */}
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyPress={handleLogin}
        className="login-input"
      />
      <button onClick={handleLogin} className="login-button">
        Login
      </button>

      {/* Google Login Option */}
      <div className="google-login">
        <h3>Or Sign In with Google</h3>
        <GoogleLogin
          onSuccess={onGoogleLoginSuccess}
          onError={onGoogleLoginError}
        />
      </div>
    </div>
  );
};

export default Login;





