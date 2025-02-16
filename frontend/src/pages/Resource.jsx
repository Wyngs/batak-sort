import { Link } from 'react-router-dom';
import { useState } from 'react';

// 🔥 Dynamically import all images from `src/assets/`
const images = import.meta.glob('../assets/*.{png,jpg,jpeg,svg}', { eager: true });

// Function to get image dynamically
const getImage = (imageName) => images[`../assets/${imageName}`]?.default || '';

export default function Resource() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 🔥 Define social media links dynamically
  const socialMediaLinks = [
    { name: 'Discord', icon: <img src={getImage('discord.png')} alt="Discord" className="w-8 h-8" />, url: 'https://discord.com' },
    { name: 'Reddit', icon: <img src={getImage('Reddit.png')} alt="Reddit" className="w-8 h-8" />, url: 'https://www.reddit.com' },
    { name: 'Instagram', icon: <img src={getImage('instagram.png')} alt="Instagram" className="w-8 h-8" />, url: 'https://www.instagram.com' },
    { name: 'Youtube', icon: <img src={getImage('youtube.png')} alt="Youtube" className="w-8 h-8" />, url: 'https://www.youtube.com' },
    { name: 'Github', icon: <img src={getImage('github.png')} alt="Github" className="w-8 h-8" />, url: 'https://www.github.com' },
  ];

  // 🔎 Filter social media links based on the search term
  const filteredLinks = socialMediaLinks.filter((media) =>
    media.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-zinc-900 overflow-x-hidden relative">
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
        }}
      />

      {/* Navbar */}
      <nav
        className="w-full text-yellow-300 px-4 md:px-20 py-4 fixed top-0 left-0 z-50 backdrop-blur-lg"
        style={{
          backgroundImage: `
            radial-gradient(ellipse, rgba(237, 244, 244, 0.3) 0%, rgba(93, 95, 95, 0.1) 70%, transparent 100%),
            url('https://www.transparenttextures.com/patterns/noisy.png')
          `,
          backgroundBlendMode: 'overlay',
          opacity: 0.8,
        }}
      >
        {/* Navbar Container */}
        <div className="max-w-full mx-auto flex items-center justify-between relative z-10">
          <div className="flex items-center">
            <img
              src={getImage('UofAlogo.png')}
              alt="UofA Logo"
              className="w-8 h-8 md:w-9 md:h-9 mr-4"
            />
            <span className="font-bold text-2xl md:text-xl">
              UAlberta Scheduler
            </span>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <span>
              <Link
                to="/search"
                className="font-bold text-base hover:text-yellow-500 transition duration-200"
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
                  // No redirect — local filtering only
                }}
              >
                {/* Search Input */}
                <input
                  name="search"
                  type="text"
                  placeholder="Search for a Resource..."
                  className="text-black px-4 py-2 w-64 pr-10 rounded-xl bg-white/80 placeholder-gray-800"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {/* Add top padding so grid is not hidden under fixed navbar */}
      <div className="pt-24 px-4">
        {/* Social Media Grid */}
        <div className="flex justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
            {filteredLinks.map((media, index) => (
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
