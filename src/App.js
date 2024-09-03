import React, { useState } from 'react';
import Login from './Login';
import './App.css';
import Chatbot from './components/Chatbot';

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogin = (username) => {
    const validUsers = ['Titan', 'Dcathelon', 'DRL'];
    if (validUsers.includes(username)) {
      setUser(username);
      localStorage.setItem('loggedInUser', username); // Store user in localStorage
    } else {
      alert('Invalid username');
    }
  };

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
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;



