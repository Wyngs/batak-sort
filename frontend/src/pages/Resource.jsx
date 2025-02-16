import { Link } from 'react-router-dom';
import { useState } from 'react';
import logo from '../assets/UofAlogo.png';
import discord from '../assets/discord.png';
import reddit from '../assets/Reddit.png';
import instagram from '../assets/Instagram.png';
import youtube from '../assets/Youtube.png';
import github from '../assets/Github.png';

export default function Resource() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Example social media data
  const socialMediaLinks = [
    { name: "Discord", icon: <img src={discord} alt="Discord" className="w-8 h-8" />, url: "https://discord.com" },
    { name: "Reddit", icon: <img src={reddit} alt="Reddit" className="w-8 h-8" />, url: "https://www.reddit.com" },
    { name: "Instagram", icon: <img src={instagram} alt="Reddit" className="w-8 h-8" />, url: "https://www.reddit.com" },
    { name: "Youtube", icon: <img src={youtube} alt="Youtube" className="w-8 h-8" />, url: "https://www.youtube.com" },
    { name: "Github", icon: <img src={github} alt="Github" className="w-8 h-8" />, url: "https://www.github.com" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-green-700 overflow-x-hidden">
      {/* Navbar */}
      <nav className="w-full bg-green-800 text-yellow-300 px-4 md:px-8 py-4">
        <div className="max-w-full mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="UofA Logo"
                className="w-10 h-10 md:w-14 md:h-14 mr-4"
              />
              <span className="font-bold text-lg md:text-xl">UofA Scheduler</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-yellow-300 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                d={
                  isMenuOpen
                    ? 'M6 18L18 6M6 6l12 12'
                    : 'M4 6h16M4 12h16M4 18h16'
                }
              ></path>
            </svg>
          </button>

          {/* Desktop navigation */}
          <ul className="hidden md:flex space-x-10 font-semibold text-xl">
            <li>
              <Link
                to="/"
                className="hover:text-yellow-500 transition duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/search"
                className="hover:text-yellow-500 transition duration-200"
              >
                Search
              </Link>
            </li>
            <li>
              <Link
                to="/calendar"
                className="hover:text-yellow-500 transition duration-200"
              >
                Calendar
              </Link>
            </li>
          </ul>
        </div>

        {/* Mobile menu dropdown */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} pt-4`}>
          <div className="flex flex-col space-y-3">
            <Link
              to="/"
              className="block py-2 text-center text-yellow-300 hover:bg-green-900 rounded transition duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/search"
              className="block py-2 text-center text-yellow-300 hover:bg-green-900 rounded transition duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Search
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow p-4">

        {/* Social Media Grid */}
        <div className="flex items-center justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
            {socialMediaLinks.map((media, index) => (
              <a
                key={index}
                href={media.url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex flex-col items-center justify-center
                  bg-gray-800 rounded-lg p-6 text-white
                  hover:bg-gray-700 transition-colors
                "
              >
                <span className="text-4xl mb-2 transition-transform duration-300 group-hover:scale-110">
                  {media.icon}
                </span>
                <span className="font-bold">{media.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
