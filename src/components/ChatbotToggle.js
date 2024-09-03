import React from 'react';
import './Chatbot.css';

const ChatbotToggle = ({ onToggle }) => {
  return (
    <div className="chatbot-toggle" onClick={onToggle} title="Hello, It's LinkMaster">
      <img src="link_to_bot_image.png" alt="Chatbot" className="chatbot-icon" />
    </div>
  );
};

export default ChatbotToggle;
