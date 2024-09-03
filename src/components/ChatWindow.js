import React, { useState, useEffect, useRef } from 'react';
import './ChatWindow.css';

const ChatWindow = ({ loggedInUser, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatWindowRef = useRef(null);

  useEffect(() => {
    // Listen for clicks outside the chat window to close it
    const handleClickOutside = (event) => {
      if (chatWindowRef.current && !chatWindowRef.current.contains(event.target)) {
        onClose(); // Close chat window
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleSend = () => {
    if (input.trim()) {
      const newMessage = { user: loggedInUser, message: input }; 
  
      // Update messages immediately in the user's chat window
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInput(''); // Clear input field after sending
  
      // Send the message to the PHP backend
      fetch('http://localhost:8000/index.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessage),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.status === "success") {
          console.log(data.message);
        } else {
          console.error('Error:', data.message);
          setMessages((prevMessages) => [...prevMessages, { user: 'System', message: 'Failed to send message' }]);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setMessages((prevMessages) => [...prevMessages, { user: 'System', message: 'Failed to send message' }]);
      });
    } else {
      console.warn('Cannot send an empty message');
    }
  };

  return (
    <div className="chat-window" ref={chatWindowRef}>
      <div className="chat-header">
        <h2>LinkMaster Chat</h2>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <strong>{message.user}: </strong>
            <span>{message.message}</span>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
      <div className="end-chat-container">
        <button onClick={onClose} className="end-chat-button">
          End Chat
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;





