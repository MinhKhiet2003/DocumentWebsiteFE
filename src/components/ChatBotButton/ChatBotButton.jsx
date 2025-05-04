import React, { useState } from 'react';
import './ChatBotButton.css';
import ChatBotDialog from '../ChatBotDialog/ChatBotDialog';

const ChatBotButton = () => {
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);

  const toggleChatBot = () => {
    setIsChatBotOpen(!isChatBotOpen);
  };

  return (
    <>
      <button className="chatbot-button" onClick={toggleChatBot} aria-label="Open ChatBot">
        <i className="fa-solid fa-robot"></i>
      </button>
      <ChatBotDialog isOpen={isChatBotOpen} onClose={() => setIsChatBotOpen(false)} />
    </>
  );
};

export default ChatBotButton;