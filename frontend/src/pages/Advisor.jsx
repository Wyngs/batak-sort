// App.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Initialize session
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const storedSessionId = localStorage.getItem('chatSessionId');
        if (storedSessionId) {
          const response = await axios.get(`/api/sessions/${storedSessionId}`);
          setSessionId(storedSessionId);
          setMessages(response.data.messages);
        } else {
          const response = await axios.post('/api/sessions');
          const newSessionId = response.data.sessionId;
          localStorage.setItem('chatSessionId', newSessionId);
          setSessionId(newSessionId);
        }
      } catch (err) {
        setError('Failed to initialize chat session');
      }
    };
    initializeSession();
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const userMessage = {
        content: inputMessage,
        role: 'user',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');

      const response = await axios.post('/api/chat', {
        sessionId,
        message: inputMessage,
      });

      const botMessage = {
        content: response.data.content,
        role: 'bot',
        timestamp: new Date().toISOString(),
        metadata: response.data.metadata,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg flex flex-col h-[90vh]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message, index) => (
            <Message key={index} message={message} />
          ))}
          <div ref={messagesEndRef} />
          {isLoading && <TypingIndicator />}
        </div>

        {error && (
          <div className="text-red-600 bg-red-100 p-3 mx-4 my-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

const Message = ({ message }) => (
  <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div className={`max-w-[70%] rounded-xl p-4 ${
      message.role === 'user' 
        ? 'bg-blue-500 text-white rounded-br-none'
        : 'bg-white border border-gray-200 rounded-bl-none'
    }`}>
      <div className="break-words">{message.content}</div>
      <div className="text-xs mt-2 opacity-70 text-right">
        {new Date(message.timestamp).toLocaleTimeString()}
      </div>
    </div>
  </div>
);

const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="bg-white border border-gray-200 rounded-xl rounded-bl-none p-3">
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
      </div>
    </div>
  </div>
);

export default App;