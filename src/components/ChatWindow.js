import React, { useState, useEffect, useRef } from 'react';
import './ChatWindow.css';

const ChatWindow = ({ loggedInUser, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatWindowRef = useRef(null);
  const [lastMessageId, setLastMessageId] = useState(null); // Keep track of the last processed message

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

  // Function to fetch responses from the backend
  const fetchResponses = () => {
    fetch(`https://my-backend-service-y4up.onrender.com/get-responses.php?user=${loggedInUser}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.messages) {
          // Filter messages to avoid duplicates
          const newMessages = data.messages.filter((msg) => msg.id !== lastMessageId);
          if (newMessages.length > 0) {
            setLastMessageId(newMessages[newMessages.length - 1].id); // Track last message ID
            setMessages((prevMessages) => [
              ...prevMessages, 
              ...newMessages.map(msg => ({ user: 'Teams', message: msg.message }))
            ]); // Append new messages from Teams
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching responses:', error);
      });
  };

  useEffect(() => {
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchResponses, 5000);
    return () => clearInterval(interval); // Cleanup on component unmount
  }, [lastMessageId]);

  const handleSend = () => {
    if (input.trim()) {
      const newMessage = { user: loggedInUser, message: input };

      // Update messages immediately in the user's chat window
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInput(''); // Clear input field after sending

      // Send the message to the PHP backend
      fetch('https://my-backend-service-y4up.onrender.com/index.php', {
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
          console.log('Message sent successfully:', data.message);
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





