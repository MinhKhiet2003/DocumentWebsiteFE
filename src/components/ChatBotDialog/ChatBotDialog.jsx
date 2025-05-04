import React, { useState, useEffect, useRef } from 'react';
import './ChatBotDialog.css';

const ChatBotDialog = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setMessages([{ role: 'assistant', content: 'Xin chào! Tôi là Hachieve. Hôm nay tôi có thể giúp gì cho bạn?' }]);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const requestBody = {
      model: 'gpt-4o-mini',
      messages: messages.concat(userMessage).map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      max_tokens: 500, // Increased to allow full responses
    };

    console.log('Sending request to /api/openai:', JSON.stringify(requestBody));

    try {
      const response = await fetch('https://hachieve.runasp.net/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch response');
      }

      const data = await response.json();
      console.log('Received response from OpenAI:', data);

      const assistantMessage = {
        role: 'assistant',
        content: data.choices[0].message.content,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Lỗi: ${error.message}` },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chatbot-dialog">
      <div className="chatbot-header">
        <h3>Hachieve</h3>
        <button onClick={onClose} aria-label="Close ChatBot">
          ✕
        </button>
      </div>
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chatbot-message ${msg.role === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <span className="message-sender">{msg.role === 'user' ? 'Bạn' : 'Hachieve'}:</span> {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nhập tin nhắn..."
        />
        <button onClick={sendMessage} disabled={!input.trim()}>
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ChatBotDialog;