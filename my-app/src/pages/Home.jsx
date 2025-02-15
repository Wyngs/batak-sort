import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from "../assets/UofAlogo.png";
import Mascot from "../assets/Mascot.png";

const Home = () => {
  const [isFilling, setIsFilling] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

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
                placeholder="Search for a course..."
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

              </div>
        </div>
    </nav>

      <div className="flex-1 flex items-center justify-center px-6 md:px-8">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">
          {/* Main Content */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6 md:w-1/2 pl-4 md:pl-0">
            <h1 className="text-4xl md:text-6xl font-bold text-yellow-300 leading-tight">
              BearSmart
            </h1>
            <p className="text-xl text-white max-w-lg">
              Browse final exam schedules with ease and add them to your calendar!
            </p>
            <Link to="/search" className="w-full md:w-auto">
              <button
    className="w-full md:max-w-sm h-14 bg-green-700 text-white font-bold rounded-lg relative px-4 overflow-hidden 
               hover:text-yellow-500 transition duration-300"
    style={{
      backgroundImage: `
          radial-gradient(ellipse, rgba(231, 232, 232, 0.3) 0%, rgba(51, 52, 52, 0.1) 70%, transparent 100%),
          url('https://www.transparenttextures.com/patterns/noisy.png')
        `,
        backgroundBlendMode: 'overlay',
        opacity: 0.8,
      boxShadow: "0 0 30px rgba(255, 255, 0, 0.8), 0 0 30px rgba(255, 255, 0, 0.6)",
      textShadow: "0 0 15px rgba(255, 255, 0, 0.8), 0 0 20px rgba(255, 255, 0, 0.6)",
    }}
  >
    Get started 🔎
  </button>
</Link>
          </div>

          {/* Mascot Image */}
          <div className="max-w-[80vw] md:max-w-[40vw] mt-8 md:mt-0">
            <img src={Mascot} alt="Mascot" className="w-full h-auto object-contain " />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
