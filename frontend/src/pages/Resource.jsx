import { Link } from 'react-router-dom';
import { useState } from 'react';

// Dynamically import all images from `src/assets/`
const images = import.meta.glob('../assets/*.{png,jpg,jpeg,svg}', { eager: true });

// Function to get image dynamically
const getImage = (imageName) => images[`../assets/${imageName}`]?.default || '';

export default function Resource() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);

  // Define social media links dynamically
  const socialMediaLinks = [
    { name: 'Discord', icon: <img src={getImage('discord.png')} alt="Discord" className="w-8 h-8" />, url: 'https://discord.com' },
    { name: 'Reddit', icon: <img src={getImage('Reddit.png')} alt="Reddit" className="w-8 h-8" />, url: 'https://www.reddit.com' },
    { name: 'Instagram', icon: <img src={getImage('instagram.png')} alt="Instagram" className="w-8 h-8" />, url: 'https://www.instagram.com' },
    { name: 'Youtube', icon: <img src={getImage('youtube.png')} alt="Youtube" className="w-8 h-8" />, url: 'https://www.youtube.com' },
    { name: 'Github', icon: <img src={getImage('github.png')} alt="Github" className="w-8 h-8" />, url: 'https://www.github.com' },
    { name: 'Gmail', icon: <img src={getImage('gmail.png')} alt="Gmail" className="w-8 h-8" />, url: 'https://apps.ualberta.ca/' },
    { name: 'Eclass', icon: <img src={getImage('gmail.png')} alt="Eclass" className="w-8 h-8" />, url: 'https://eclass.srv.ualberta.ca/portal/' },
    { name: 'Bear Tracks', icon: <img src={getImage('gmail.png')} alt="Bear Tracks" className="w-8 h-8" />, url: 'https://www.beartracks.ualberta.ca/' },
    { name: 'Canvas', icon: <img src={getImage('gmail.png')} alt="Canvas" className="w-8 h-8" />, url: 'https://canvas.ualberta.ca/' },
    { name: 'Library', icon: <img src={getImage('gmail.png')} alt="Library" className="w-8 h-8" />, url: 'https://www.library.ualberta.ca/' },
    { name: 'Prof Finder', icon: <img src={getImage('gmail.png')} alt="Prof Finder" className="w-8 h-8" />, url: 'https://apps.ualberta.ca/directory' },
    { name: 'Events Finder', icon: <img src={getImage('gmail.png')} alt="Events Finder" className="w-8 h-8" />, url: 'https://www.ualberta.ca/events/index.html' },
    { name: 'University Map', icon: <img src={getImage('gmail.png')} alt="University Map" className="w-8 h-8" />, url: 'https://www.ualberta.ca/maps.html' },
    { name: 'Careers', icon: <img src={getImage('gmail.png')} alt="Careers" className="w-8 h-8" />, url: 'https://www.ualberta.ca/en/careers.html' },
    { name: 'Student Union', icon: <img src={getImage('gmail.png')} alt="Student Union" className="w-8 h-8" />, url: 'https://www.su.ualberta.ca/' },
    { name: 'Academic Success', icon: <img src={getImage('gmail.png')} alt="Academic Success" className="w-8 h-8" />, url: 'https://www.ualberta.ca/en/campus-life/academic-success/index.html' },
    { name: 'BearsDen', icon: <img src={getImage('gmail.png')} alt="BearsDen" className="w-8 h-8" />, url: 'https://alberta.campuslabs.ca/engage/' },
    { name: 'Calendar', icon: <img src={getImage('google-calendar.png')} alt="Google Calendar" className="w-8 h-8" />, url: 'https://calendar.google.com/a/ualberta.ca/' },
    { name: 'Drive', icon: <img src={getImage('google-drive.png')} alt="Drive" className="w-8 h-8" />, url: 'https://drive.google.com/a/ualberta.ca/' },
    { name: 'Student Service Center', icon: null, url: 'https://www.ualberta.ca/en/services/student-service-centre/index.html' },
    { name: 'Staff Services Centre', icon: null, url: 'https://www.ualberta.ca/en/services/staff-service-centre/index.html' },
    { name: 'Campus Security', icon: null, url: 'https://www.ualberta.ca/en/campus-life/campus-security.html' },
    { name: 'ONECard Account', icon: null, url: 'https://www.ualberta.ca/en/onecard/index.html' },
    { name: 'MyCCID', icon: null, url: 'https://myccid.ualberta.ca/' },
    { name: 'Peer Tutors', icon: null, url: 'https://www.ualberta.ca/en/residence/community-life/academic-support/peer-tutors.html' },
    { name: 'Tutor Listing', icon: null, url: 'https://www2.su.ualberta.ca/services/infolink/tutor/registry/browse/2/' },
  ];

  // Filter social media links based on the search term
  const filteredLinks = socialMediaLinks.filter((media) =>
    media.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Determine the links to display based on the showAll state
  const linksToDisplay = showAll ? filteredLinks : filteredLinks.slice(0, 8);

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
            <Link to="/">
              <span className="font-bold text-2xl md:text-xl">
                BearSmart
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <span>
              <Link
                to="/"
                className="hover:text-yellow-500 font-bold text-base transition duration-200"
              >
                Home
              </Link>
            </span>
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
                to="/advisor"
                className="hover:text-yellow-500 font-bold text-base transition duration-200"
              >
                Advisor
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
      <div className="pt-24 px-4">
        {/* Social Media Grid */}
        <div className="flex justify-center">
          {filteredLinks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
              {linksToDisplay.map((media, index) => (
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
          ) : (
            <div className="text-white text-center mt-8">
              No results found.
            </div>
          )}
        </div>
        {filteredLinks.length > 8 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setShowAll(!showAll)}
              className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              {showAll ? 'Show Less' : 'Show More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
