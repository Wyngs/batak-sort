import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Advisor = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll on new messages
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
        message: inputMessage,
      });

      const botMessage = {
        content: response.data.content,
        role: 'bot',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await axios.post('/api/clear-history');
      setMessages([]); // Clear messages from UI
      setError(null);
    } catch (err) {
      setError('Failed to clear chat history');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col text-grey overflow-hidden font-apple">
      {/* Background Gradient & Blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full bg-gradient-to-b from-[#004022] to-[#001a0f] relative overflow-hidden">
          <div className="blobs-container h-full w-full absolute inset-0 pointer-events-none">
            <div className="blob blob1 bg-yellow-400 opacity-70 mix-blend-screen" />
            <div className="blob blob2 bg-yellow-400 opacity-60 mix-blend-screen" />
            <div className="blob blob3 bg-yellow-400 opacity-50 mix-blend-screen" />
            <div className="blob blob4 bg-yellow-400 opacity-70 mix-blend-screen" />
            <div className="blob blob5 bg-yellow-400 opacity-60 mix-blend-screen" />
            <div className="blob blob6 bg-yellow-400 opacity-50 mix-blend-screen" />
            <div className="blob blob7 bg-yellow-400 opacity-70 mix-blend-screen" />
            <div className="blob blob8 bg-yellow-400 opacity-60 mix-blend-screen" />
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col items-center justify-center pt-16 px-4">
        <div className="w-full max-w-4xl flex flex-col h-[80vh] bg-white/20 rounded-xl p-4">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent max-h-[calc(80vh-100px)]">
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

          <div className="flex justify-end px-4">
            <button
              onClick={handleClearHistory}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
            >
              Clear History
            </button>
          </div>

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
    </div>
  );
};

const Message = ({ message }) => (
  <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div className={`max-w-[70%] rounded-xl p-4 ${message.role === 'user' ? 'bg-blue-500 text-grey' : 'bg-white border'}`}>
      <div className="break-words">{message.content}</div>
    </div>
  </div>
);

const TypingIndicator = () => (
  <div className="flex justify-start">
    <span className="animate-pulse">...</span>
  </div>
);

export default Advisor;
