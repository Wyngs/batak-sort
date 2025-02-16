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
        <div 
          className="min-h-screen flex flex-col bg-zinc-900 overflow-x-hidden">
          {/* Background Overlay */}
          <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `
                  radial-gradient(circle, rgba(34,197,94,0.3) 0%, rgba(34,197,94,0.1) 70%, transparent 100%),
                  url('https://www.transparenttextures.com/patterns/noisy.png')
                `,
                backgroundBlendMode: 'overlay',
                opacity: 0.8,
              }}>
    
          </div>
    
          {/* Navbar */}
          <nav 
            className="w-full text-yellow-300 textpx-4 md:px-20 py-4 fixed top-0 left-0 z-50 backdrop-blur-lg "
            style={{
            backgroundImage: `
              radial-gradient(ellipse, rgba(237, 244, 244, 0.3) 0%, rgba(93, 95, 95, 0.1) 70%, transparent 100%),
              url('https://www.transparenttextures.com/patterns/noisy.png')
            `,
            backgroundBlendMode: 'overlay',
            opacity: 0.8,
            }}>
    
            {/* Navbar Container */}
            <div className="max-w-full mx-auto flex items-center justify-between relative z-10">
              <div className="flex items-center">
                <img src={logo} alt="UofA Logo" className="w-8 h-8 md:w-9 md:h-9 mr-4" />
                <span className="font-bold text-2xl md:text-x">UAlberta Scheduler</span>
              </div>
    
              {/* Desktop navigation */}
              
              
              <div className="hidden md:flex items-center space-x-6">
                <span>
                  <Link
                      to="/search"
                      style={{
                        textShadow: location.pathname === "/"
                          ? "0 0 10px rgba(255, 255, 0, 0.8), 0 0 20px rgba(255, 255, 0, 0.6)"
                          : "none",
                      }}
                      className={`font-bold text-base transition duration-200 ${
                        location.pathname === "/" ? "text-white" : "hover:text-yellow-500"
                      }`}
                    >
                      Search
                  </Link>
                </span>
                <span>
                  <Link 
                    to="/calendar" 
                    className="hover:text-yellow-500 font-bold text-base transition duration-200"
                    >
                      Calendar
                  </Link>
                </span>
                <span>
                  <Link 
                    to="/resource" 
                    className="hover:text-yellow-500 font-bold text-base transition duration-200"
                    >
                      Resource
                  </Link>
                </span>
    
              {/* Search Bar */}
              <span>
              <form
                  className="relative flex items-center"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const searchQuery = e.target.elements.search.value.trim();
                    if (searchQuery) {
                      window.location.href = `/search?course=${encodeURIComponent(searchQuery)}`;
                    }
                  }}
                >
                  {/* Search Input */}
                  <input
                    name="search"
                    type="text"
                    placeholder="Search for a Resource..."
                    className="text-black px-4 py-2 w-64 pr-10 rounded-xl bg-white/80 placeholder-gray-800 "
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  />
                </form>
              </span>
              </div>
              {/* Mobile menu button */}
          <div className="md:hidden">
                <div>
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
                    <path d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
                  </svg>
                 </button>
                </div>
                </div>
                </div>
    
              {/* Mobile Menu Dropdown */}
    
                <div 
                className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} mt-4`}>
    
                  <div 
                  className="flex flex-col items-center space-y-3">
                    <Link
                      to="/"
                      className="block py-2 text-yellow-300 hover:bg-green-900 rounded transition duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Home
                    </Link>
    
                    <Link
                      to="/calendar"
                      className="block py-2 text-yellow-300 hover:bg-green-900 rounded transition duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Calendar
                    </Link>
                    
                    <Link
                      to="/search"
                      className="block py-2 text-yellow-300 hover:bg-green-900 rounded transition duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Search
                    </Link>
    
                    <Link
                      to="/"
                      className="block py-2 text-yellow-300 hover:bg-green-900 rounded transition duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Home
                    </Link>
    
                  </div>
            </div>
        </nav>

      {/* Main Content */}
      <div>

        {/* Social Media Grid */}
        <div className="flex items-between justify-center">
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
