import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Dynamically import all images
const images = import.meta.glob('../assets/*.{png,jpg,jpeg,svg}', { eager: true });
const getImage = (imageName) => images[`../assets/${imageName}`]?.default || '';

// Categories
const categories = [
  { name: 'Social', items: ['Discord', 'Reddit', 'Github'] },
  { name: 'Apps@', items: ['Prof Finder'] },
  { name: 'Google', items: ['Calendar', 'Drive'] },
  { name: 'Featured', items: ['Gmail', 'Canvas', 'Eclass', 'Bear Tracks'] },
  {
    name: 'Help',
    items: [
      'Student Service Center',
      'Staff Services Centre',
      'Campus Security',
      'Academic Success',
      'Peer Tutors',
      'Tutor Listing',
    ],
  },
  {
    name: 'Campus',
    items: [
      'BearsDen',
      'Library',
      'MyCCID',
      'ONECard Account',
      'Student Union',
      'Uni Map',
      'Events Finder',
      'Careers',
    ],
  },
];

// Finds the category index of a given name
function getCategoryIndex(name) {
  for (let i = 0; i < categories.length; i++) {
    if (categories[i].items.includes(name)) {
      return i;
    }
  }
  return 999;
}

// Resource Links
const socialMediaLinks = [
  { name: 'Discord', icon: <img src={getImage('discord.svg')} alt="Discord" className="w-12 h-12" />, url: 'https://discord.com/invite/ualberta-727246296406032477' },
  { name: 'Reddit', icon: <img src={getImage('Reddit.png')} alt="Reddit" className="w-12 h-12" />, url: 'https://www.reddit.com/r/uAlberta/?rdt=51734' },
  { name: 'Github', icon: <img src={getImage('github.png')} alt="Github" className="w-12 h-12" />, url: 'https://www.github.com' },
  { name: 'Prof Finder', icon: <img src={getImage('magnifying-glass.png')} alt="Prof Finder" className="w-12 h-12" />, url: 'https://apps.ualberta.ca/directory' },
  { name: 'Calendar', icon: <img src={getImage('google-calendar.png')} alt="Calendar" className="w-12 h-12" />, url: 'https://calendar.google.com/a/ualberta.ca/' },
  { name: 'Drive', icon: <img src={getImage('google-drive.png')} alt="Drive" className="w-12 h-12" />, url: 'https://drive.google.com/a/ualberta.ca/' },
  { name: 'Gmail', icon: <img src={getImage('gmail.png')} alt="Gmail" className="w-12 h-12" />, url: 'https://apps.ualberta.ca/' },
  { name: 'Canvas', icon: <img src={getImage('canvas.png')} alt="Canvas" className="w-12 h-12" />, url: 'https://canvas.ualberta.ca/' },
  { name: 'Eclass', icon: <img src={getImage('eclass.png')} alt="Eclass" className="w-12 h-12" />, url: 'https://eclass.srv.ualberta.ca/portal/' },
  { name: 'Bear Tracks', icon: <img src={getImage('beartracks.png')} alt="Bear Tracks" className="w-12 h-12" />, url: 'https://www.beartracks.ualberta.ca/' },
  { name: 'Library', icon: <img src={getImage('library.png')} alt="Library" className="w-12 h-12" />, url: 'https://www.library.ualberta.ca/' },

  // Items with no custom icon => fallback to bigger Gmail icon
  { name: 'Student Service Center',icon: <img src={getImage('ua.png')} alt="Student Service Center" className="w-12 h-12" />, url: 'https://www.ualberta.ca/en/services/student-service-centre/index.html' },
  { name: 'Staff Services Centre',icon: <img src={getImage('ua.png')} alt="Staff Services Centre" className="w-12 h-12" />, url: 'https://www.ualberta.ca/en/services/staff-service-centre/index.html' },
  { name: 'Campus Security',icon: <img src={getImage('ua.png')} alt="Campus Security" className="w-12 h-12" />, url: 'https://www.ualberta.ca/en/campus-life/campus-security.html' },
  { name: 'Academic Success',icon: <img src={getImage('ua.png')} alt="Academic Success" className="w-12 h-12" />, url: 'https://www.ualberta.ca/en/campus-life/academic-success/index.html' },
  { name: 'Peer Tutors',icon: <img src={getImage('ua.png')} alt="Peer Tutors" className="w-12 h-12" />, url: 'https://www.ualberta.ca/en/residence/community-life/academic-support/peer-tutors.html' },
  { name: 'Tutor Listing',icon: <img src={getImage('tutor.png')} alt="Tutor Listing" className="w-12 h-12" />, url: 'https://www2.su.ualberta.ca/services/infolink/tutor/registry/browse/2/' },
  { name: 'BearsDen',icon: <img src={getImage('ua.png')} alt="BearsDen" className="w-12 h-12" />, url: 'https://alberta.campuslabs.ca/engage/' },
  { name: 'MyCCID',icon: <img src={getImage('ua.png')} alt="MyCCID" className="w-12 h-12" />, url: 'https://www.ualberta.ca/en/onecard/index.html' },
  { name: 'ONECard Account',icon: <img src={getImage('ua.png')} alt="ONECard Account" className="w-12 h-12" />, url: 'https://www.ualberta.ca/en/onecard/index.html' },
  { name: 'Student Union',icon: <img src={getImage('ua.png')} alt="Student Union" className="w-12 h-12" />, url: 'https://www.su.ualberta.ca/' },
  { name: 'Uni Map',icon: <img src={getImage('ua.png')} alt="Uni Map" className="w-12 h-12" />, url: 'https://www.ualberta.ca/maps.html' },
  { name: 'Events Finder',icon: <img src={getImage('ua.png')} alt="Events Finder" className="w-12 h-12" />, url: 'https://www.ualberta.ca/events/index.html' },
  { name: 'Careers',icon: <img src={getImage('ua.png')} alt="Careers" className="w-12 h-12" />, url: 'https://www.ualberta.ca/en/careers.html' },
];

const sortedLinks = [...socialMediaLinks].sort((a, b) => {
  const catA = getCategoryIndex(a.name);
  const catB = getCategoryIndex(b.name);
  return catA - catB;
});

export default function Resource() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);

  // Close mobile nav on resize
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const location = useLocation();

  // Filter
  const filteredLinks = sortedLinks.filter((media) =>
    media.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show 6 or all
  const itemsToDisplay = showAll ? filteredLinks : filteredLinks.slice(0, 6);

  return (
    <div className="relative min-h-screen flex flex-col text-white font-apple overflow-hidden">
      {/* Background & Blobs */}
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

      {/* NAVBAR */}
      <nav className="w-full top-0 left-0 z-50 bg-transparent py-4">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <img
              src={getImage('UofAlogo.png')}
              alt="UofA Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="font-bold text-2xl lg:text-3xl">BearSmart</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-8 font-semibold text-white">
            <Link to="/" className="hover:text-yellow-100 transition">
              Home
            </Link>
            <Link
              to="/search"
              className={`transition ${
                location.pathname === '/search' ? 'text-yellow-200' : 'hover:text-yellow-100'
              }`}
            >
              Finals
            </Link>
            <Link to="/calendar" className="hover:text-yellow-100 transition">
              Calendar
            </Link>
            <Link to="/advisor" className="hover:text-yellow-100 transition">
              Advisor
            </Link>

            {/* Desktop Search */}
            <form
              className="relative"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                name="search"
                type="text"
                placeholder="Search Resource..."
                className="rounded-full pl-4 pr-20 py-1 text-black placeholder-gray-600 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                  <path d="M21 21l-4.35-4.35" />
                  <circle cx="10" cy="10" r="7" />
                </svg>
              </button>
            </form>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden focus:outline-none"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-2 bg-white/10 backdrop-blur-sm rounded p-4 max-w-6xl mx-auto">
            <div className="flex flex-col space-y-3 font-semibold">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/search" onClick={() => setIsMenuOpen(false)}>
                Finals
              </Link>
              <Link to="/calendar" onClick={() => setIsMenuOpen(false)}>
                Calendar
              </Link>
              <Link to="/advisor" onClick={() => setIsMenuOpen(false)}>
                Advisor
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* MAIN CONTENT */}
      <div className="pt-24 px-4 md:px-20 pb-12">
        {/* Mobile Search */}
        <div className="mb-6 lg:hidden">
          <form className="relative" onSubmit={(e) => e.preventDefault()}>
            <input
              name="search"
              type="text"
              placeholder="Search Resource..."
              className="rounded-full pl-4 pr-20 py-1 text-black placeholder-gray-600 focus:outline-none w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                <path d="M21 21l-4.35-4.35" />
                <circle cx="10" cy="10" r="7" />
              </svg>
            </button>
          </form>
        </div>

        {/* Card Grid */}
        <div className="max-w-6xl mx-auto">
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-8
              w-full
              items-start
              justify-items-center
            "
          >
            {itemsToDisplay.map((media) => {
              // Fallback icon => bigger Gmail icon
              const icon = media.icon ? (
                media.icon
              ) : (
                <img
                  src={getImage('gmail.png')}
                  alt="Gmail"
                  className="w-12 h-12"
                />
              );

              return (
                <a
                  key={media.name}
                  href={media.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    group
                    relative
                    w-full
                    max-w-[300px]
                    min-h-[320px]
                    bg-white/15
                    backdrop-blur-md
                    rounded-[1.5rem]
                    flex
                    flex-col
                    items-center
                    justify-center
                    text-white
                    p-6
                    shadow-lg
                    transition
                    hover:bg-white/20
                  "
                  style={{ textDecoration: 'none' }}
                >
                  {/* Circle-float-trigger => entire circle + icon float on hover */}
                  <div
                    className="
                      circle-float-trigger
                      w-28
                      h-28
                      rounded-full
                      bg-white
                      flex
                      items-center
                      justify-center
                      mb-6
                      transition-all
                      duration-300
                    "
                  >
                    {icon}
                  </div>

                  {/* Resource name */}
                  <div className="text-xl font-semibold tracking-wide mb-1">
                    {media.name}
                  </div>

                  {/* The float animation triggers on the entire circle */}
                  <style>{`
                    .group:hover .circle-float-trigger {
                      animation: float-up-down 3.5s ease-in-out infinite;
                    }
                  `}</style>
                </a>
              );
            })}
          </div>

          {/* Show More / Show Less button */}
          {filteredLinks.length > 6 && (
            <div className="flex justify-center mt-6">
              {!showAll ? (
                <button
                  onClick={() => setShowAll(true)}
                  className="bg-yellow-500 text-black px-10 py-3 rounded-md font-semibold transition-colors hover:bg-yellow-600"
                >
                  Show More
                </button>
              ) : (
                <button
                  onClick={() => setShowAll(false)}
                  className="bg-yellow-500 text-black px-10 py-3 rounded-md font-semibold transition-colors hover:bg-yellow-600"
                >
                  Show Less
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
