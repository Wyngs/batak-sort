import { Link } from 'react-router-dom';
import { useState } from 'react';

// Dynamically import all images from `src/assets/`
const images = import.meta.glob('../assets/*.{png,jpg,jpeg,svg}', { eager: true });

// Function to get image dynamically
const getImage = (imageName) => images[`../assets/${imageName}`]?.default || '';

// 1. Define categories + order
const categories = [
  {
    name: 'Social',
    items: ['Discord', 'Reddit', 'Github'],
  },
  {
    name: 'Apps@',
    items: ['Prof Finder'],
  },
  {
    name: 'Google',
    items: ['Calendar', 'Drive'],
  },
  {
    name: 'Featured',
    items: ['Gmail', 'Canvas', 'Eclass', 'Bear Tracks'],
  },
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
      'University Map',
      'Events Finder',
      'Careers',
    ],
  }
];

// Helper to find a link's category index
function getCategoryIndex(name) {
  for (let i = 0; i < categories.length; i++) {
    if (categories[i].items.includes(name)) {
      return i;
    }
  }
  return 999; // "Misc" or not found
}

// 2. Original component
export default function Resource() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);

  // 3. Your original links array
  const socialMediaLinks = [
    { name: 'Discord', icon: <img src={getImage('discord.png')} alt="Discord" className="w-8 h-8" />, url: 'https://discord.com' },
    { name: 'Reddit', icon: <img src={getImage('Reddit.png')} alt="Reddit" className="w-8 h-8" />, url: 'https://www.reddit.com' },
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

  // 4. Filter by search
  const filteredLinks = socialMediaLinks.filter((media) =>
    media.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 5. Sort links by category order
  const sortedLinks = [...filteredLinks].sort((a, b) => {
    const catA = getCategoryIndex(a.name);
    const catB = getCategoryIndex(b.name);
    return catA - catB;
  });

  // 6. "Show more" logic remains the same
  const linksToDisplay = showAll ? sortedLinks : sortedLinks.slice(0, 8);

  // 7. Group the final links by category for display
  //    (only the items in `linksToDisplay`)
  const groupedByCategory = categories.map((cat) => {
    // All links from linksToDisplay that belong to this category
    const catItems = linksToDisplay.filter((link) =>
      cat.items.includes(link.name)
    );
    return { ...cat, items: catItems };
  }).filter((cat) => cat.items.length > 0); 
  // filter out empty categories

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
                  // local filtering only
                }}
              >
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
        {/* 8. Display each category with its own heading & grid */}
        {groupedByCategory.length > 0 ? (
          groupedByCategory.map((cat) => (
            <div key={cat.name} className="mb-8">
              {/* Category Heading */}
              <h2 className="text-white text-xl font-bold mb-2">
                {cat.name}
              </h2>

              {/* Items Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
                {cat.items.map((media) => (
                  <a
                    key={media.name}
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
          ))
        ) : (
          <div className="text-white text-center mt-8">
            No results found.
          </div>
        )}

        {/* Show More / Show Less Button */}
        {sortedLinks.length > 8 && (
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
