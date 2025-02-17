import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

// If you have a logo file:
import logo from '../assets/UofAlogo.png'; 
// Or comment out/remove the <img src={logo} /> if you don't have a logo

const Advisor = () => {
  // --- Chat states ---
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // --- Navbar mobile menu state ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // For highlighting active link
  const location = useLocation();

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- Chat submission handler ---
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

  // --- Clear chat history ---
  const handleClearHistory = async () => {
    try {
      await axios.post('/api/clear-history');
      setMessages([]);
      setError(null);
    } catch (err) {
      setError('Failed to clear chat history');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col text-grey overflow-hidden font-apple">
      {/* 
        Navbar (fixed at top) 
        - same style as Home page 
      */}
      <nav className="w-full fixed top-0 left-0 z-50 bg-transparent py-4">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 flex items-center justify-between">
          {/* Logo + Title */}
          <div className="flex items-center space-x-3">
            <img
              src={logo}
              alt="UAlberta Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="font-bold text-2xl lg:text-3xl text-white">
              BearSmart
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8 font-semibold text-white">
            <Link
              to="/search"
              className={`transition ${
                location.pathname === '/search'
                  ? 'text-yellow-200'
                  : 'hover:text-yellow-100'
              }`}
            >
              Finals
            </Link>
            <Link to="/calendar" className="hover:text-yellow-100 transition">
              Calendar
            </Link>
            <Link to="/resource" className="hover:text-yellow-100 transition">
              Resource
            </Link>
            <Link to="/" className="hover:text-yellow-100 transition">
              Home
            </Link>

            {/* Optional: Search form in the navbar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const searchQuery = e.target.elements.search.value.trim();
                if (searchQuery) {
                  window.location.href = `/search?course=${encodeURIComponent(
                    searchQuery
                  )}`;
                }
              }}
              className="relative"
            >
              <input
                type="text"
                name="search"
                placeholder="Search finals..."
                className="rounded-full pl-4 pr-20 py-1 text-black placeholder-gray-600 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 21l-4.35-4.35"></path>
                  <circle cx="10" cy="10" r="7"></circle>
                </svg>
              </button>
            </form>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden focus:outline-none"
          >
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d={
                  isMenuOpen
                    ? 'M6 18L18 6M6 6l12 12'
                    : 'M4 6h16M4 12h16M4 18h16'
                }
              />
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-2 bg-white/10 backdrop-blur-sm rounded p-4 max-w-6xl mx-auto">
            <div className="flex flex-col space-y-3 font-semibold text-white">
              <Link
                to="/search"
                className="hover:text-yellow-100 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Finals
              </Link>
              <Link
                to="/calendar"
                className="hover:text-yellow-100 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Calendar
              </Link>
              <Link
                to="/resource"
                className="hover:text-yellow-100 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Resource
              </Link>
              <Link
                to="/"
                className="hover:text-yellow-100 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* 
        Background Gradient & Blobs 
        (same approach as Home component)
      */}
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

      {/* 
        Chat Container 
        - padded from top so it doesn't hide under navbar
      */}
      <div className="flex-1 flex flex-col items-center justify-center pt-20 px-4">
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
              className="px-4 py-2 text-sm font-bold text-yellow-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
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

/* Individual Message Component */
const Message = ({ message }) => (
  <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div
      className={`max-w-[70%] rounded-xl p-4 ${
        message.role === 'user'
          ? 'bg-blue-500 text-white'
          : 'bg-white border text-black'
      }`}
    >
      <div className="break-words">{message.content}</div>
    </div>
  </div>
);

/* Typing Indicator */
const TypingIndicator = () => (
  <div className="flex justify-start">
    <span className="animate-pulse">...</span>
  </div>
);

export default Advisor;
