import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

// Images
import logo from "../assets/UofAlogo.png";
import Mascot from "../assets/Mascot.png";

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="relative min-h-screen flex flex-col text-white overflow-hidden font-apple">
      {/*
        1) Dark green→black gradient + multiple blurred yellow blobs
        .blobs-container & .blob classes are now in index.css
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

      {/* Navbar */}
      <nav className="w-full fixed top-0 left-0 z-50 bg-transparent py-4">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="UAlberta Logo" className="w-10 h-10 object-contain" />
            <span className="font-bold text-2xl lg:text-3xl">BearSmart</span>
          </div>
          <div className="hidden lg:flex items-center space-x-8 font-semibold text-white">
            <Link
              to="/search"
              className={`transition ${
                location.pathname === "/search" ? "text-yellow-200" : "hover:text-yellow-100"
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
            <Link to="/advisor" className="hover:text-yellow-100 transition">
              Advisor
            </Link>

            {/* Search form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const searchQuery = e.target.elements.search.value.trim();
                if (searchQuery) {
                  window.location.href = `/search?course=${encodeURIComponent(searchQuery)}`;
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

          {/* Mobile menu button */}
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
              <path
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden mt-2 bg-white/10 backdrop-blur-sm rounded p-4 max-w-6xl mx-auto">
            <div className="flex flex-col space-y-3 font-semibold">
              <Link to="/search" className="hover:text-yellow-100 transition" onClick={() => setIsMenuOpen(false)}>
                Finals
              </Link>
              <Link to="/calendar" className="hover:text-yellow-100 transition" onClick={() => setIsMenuOpen(false)}>
                Calendar
              </Link>
              <Link to="/resource" className="hover:text-yellow-100 transition" onClick={() => setIsMenuOpen(false)}>
                Resource
              </Link>
              <Link to="/advisor" className="hover:text-yellow-100 transition" onClick={() => setIsMenuOpen(false)}>
                Advisor
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <div className="flex-1 flex flex-col-reverse md:flex-row items-center justify-center pt-28 md:pt-32">
        <div className="max-w-6xl mx-auto px-4 md:px-8 w-full flex flex-col-reverse md:flex-row items-center justify-center gap-8">
          {/* Left: Headline + CTA */}
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              BearSmart <br />
              Your Ultimate Helper
            </h1>
            <p className="text-lg md:text-xl max-w-xl">
              Join thousands of UAlberta students who trust BearSmart for effortless academic planning and success!
            </p>
            <Link to="/advisor">
              <button className="mt-4 arrow-button px-9 py-3 rounded-md bg-black font-semibold transition relative">
                Get started
              </button>
            </Link>
          </div>

          {/* Right: Mascot + shadow */}
          <div className="relative w-full h-[30rem] flex justify-center items-end">
            <div className="oval-shadow" />
            {/* 
              The float-up-down animation is from index.css 
              so we just apply "animate-float-up-down"
            */}
            <img
              src={Mascot}
              alt="UAlberta Mascot"
              className="h-full w-auto object-contain animate-float-up-down"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
