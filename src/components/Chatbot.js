import React, { useState, useEffect, useCallback } from 'react';
import ChatWindow from './ChatWindow';
import './Chatbot.css';

const Chatbot = ({ loggedInUser }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatWindow = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = useCallback((event) => {
    if (isOpen && !event.target.closest('.chat-window-container') && !event.target.closest('.chatbot-toggle')) {
      setIsOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <div className="chatbot-toggle" onClick={toggleChatWindow}>
          <img src="https://miro.medium.com/v2/resize:fit:525/1*lyyXmbeoK5JiIBNCnzzjjg.png" alt="Chatbot" className="bot-icon" />
          <div className="hover-message">Hey, I am LinkMaster!</div>
        </div>
      )}
      {isOpen && (
        <div className="chat-window-container">
          <ChatWindow loggedInUser={loggedInUser} onClose={toggleChatWindow} />
        </div>
      )}
    </div>
  );
};

export default Chatbot;











