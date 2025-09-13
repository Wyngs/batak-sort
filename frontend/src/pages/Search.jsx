import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/UofAlogo.png";
import examData from "../../../constants/Fall24FinalSchedule.json";

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const setCookie = (name, value, days) => {
  try {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${JSON.stringify(value)};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
    return true;
  } catch (error) {
    console.error("Error setting cookie:", error);
    return false;
  }
};
const getCookie = (name) => {
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop().split(";").shift();
      return JSON.parse(cookieValue);
    }
    return null;
  } catch (error) {
    console.error("Error getting cookie:", error);
    return null;
  }
};

const CHUNK_SIZE = 8;

export default function Finals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [savedExams, setSavedExams] = useState([]);
  const [chunksToShow, setChunksToShow] = useState(1); // 1 chunk => 8 rows
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // This holds random blob positions for each chunk
  // chunkBlobs[i] => an array of random { top, left, duration } for chunk i
  const [chunkBlobs, setChunkBlobs] = useState([]);

  useEffect(() => {
    // On mount:
    // 1) Make 5 random blobs for chunk #1
    // 2) Load savedExams from cookie
    setChunkBlobs([generateBlobs(5)]);
    const savedExamsData = getCookie("savedExams");
    if (savedExamsData) {
      setSavedExams(savedExamsData);
    }
  }, []);

  function generateBlobs(count) {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        top: getRandom(5, 80),    // random 5%–80% vertically
        left: getRandom(5, 80),   // random 5%–80% horizontally
        duration: getRandom(15, 25) // 15–25s
      });
    }
    return arr;
  }

  function handleShowMore() {
    // Each time we show another chunk
    setChunksToShow(chunksToShow + 1);

    // Generate new random blobs for the next chunk
    const newBlobs = generateBlobs(5);
    setChunkBlobs([...chunkBlobs, newBlobs]);
  }

  // Extract searchTerm from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const courseQuery = params.get("course") || "";
    setSearchTerm(courseQuery);
  }, [location]);

  // Save to cookies
  useEffect(() => {
    if (savedExams.length > 0) {
      setCookie("savedExams", savedExams, 30);
    } else {
      document.cookie =
        "savedExams=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  }, [savedExams]);

  // Toggle
  const handleToggleExam = (exam) => {
    const isExamSaved = savedExams.some(
      (saved) => saved[0] === exam[0] && saved[1] === exam[1]
    );
    if (isExamSaved) {
      setSavedExams(
        savedExams.filter(
          (saved) => !(saved[0] === exam[0] && saved[1] === exam[1])
        )
      );
    } else {
      setSavedExams([...savedExams, exam]);
    }
  };

  // Filter data
  const filteredData = examData.data.slice(1).filter((row) =>
    row[0]?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // total chunks possible
  const totalChunks = Math.ceil(filteredData.length / CHUNK_SIZE);
  // how many rows to show
  const rowsToShow = chunksToShow * CHUNK_SIZE;
  const visibleRows = filteredData.slice(0, rowsToShow);
  const canShowMore = chunksToShow < totalChunks;

  return (
    <div className="relative min-h-screen flex flex-col text-white overflow-hidden font-apple">
      {/* 
        1) Dark gradient background 
        No extra lumps up top if we want. Just the base gradient. 
      */}
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full bg-gradient-to-b from-[#004022] to-[#001a0f]" />
      </div>


      <nav className="w-full bg-transparent-800 py-4">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={logo}
              alt="UAlberta"
              className="w-10 h-10 object-contain"
            />
            <span className="font-bold text-2xl md:text-3xl">BearSmart</span>
          </div>

          <div className="hidden md:flex items-center space-x-8 font-semibold text-white">
            <Link to="/" className="hover:text-yellow-100 transition">
              Home
            </Link>
            <Link to="/calendar" className="hover:text-yellow-100 transition">
              Calendar
            </Link>
            <Link to="/resource" className="hover:text-yellow-100 transition">
              Resource
            </Link>
            
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden focus:outline-none"
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
          <div className=" md:hidden mt-2 bg-white/10 backdrop-blur-sm rounded p-4 max-w-6xl mx-auto">
            <div className="flex flex-col space-y-3 font-semibold">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/calendar" onClick={() => setIsMenuOpen(false)}>
                Calendar
              </Link>
              <Link to="/resource" onClick={() => setIsMenuOpen(false)}>
                Resource
              </Link>
              
            </div>
          </div>
        )}
      </nav>

      {/* 
        3) Main content
      */}
      <div className="relative z-10 mt-8 max-w-6xl mx-auto px-4 md:px-8 w-full">
        <h1 className="font-bold text-3xl text-yellow-300 mb-3">Final Exams</h1>
        <p className="text-yellow-100 mb-6">
          Showing {Math.min(visibleRows.length, filteredData.length)} of{" "}
          {filteredData.length} results
        </p>

        {/* Search bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by course name..."
            className="relative z-10 w-full max-w-xl px-4 py-2 rounded-md text-black focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/*
          4) Single table with N rows 
        */}
        <div className="relative z-10 overflow-hidden rounded-xl bg-white/35 backdrop-blur-sm">
  <table className="w-full text-white font-semibold">
    {/* 
      1) Hide the header on mobile (below “md”).
         => "hidden md:table-header-group" 
    */}
    <thead className="bg-white/40 hidden finaltableCollapse:table-header-group">
      <tr>
        <th className="px-4 py-3 border-b border-white/20">Course</th>
        <th className="px-4 py-3 border-b border-white/20">Section</th>
        <th className="px-4 py-3 border-b border-white/20">Date</th>
        <th className="px-4 py-3 border-b border-white/20">Time</th>
        <th className="px-4 py-3 border-b border-white/20">Length</th>
        <th className="px-4 py-3 border-b border-white/20">Window</th>
        <th className="px-4 py-3 border-b border-white/20">Location</th>
        <th className="px-4 py-3 border-b border-white/20">Status</th>
      </tr>
    </thead>

    {/* 
      2) Tbody: Each row is "block" on mobile so columns stack.
         => "block md:table-row"
         Then each <td> is also block on mobile => "block md:table-cell"
         We add an inline label that is only visible on mobile => "font-bold md:hidden"
    */}
    <tbody>
    {visibleRows.map((row, i) => {
    // Check if row is in savedExams
    const isSaved = savedExams.some(
      (saved) => saved[0] === row[0] && saved[1] === row[1]
    );
        return (
          <tr
            key={i}
            className="
              finaltableCollapse:table-row
              block 
              mb-4 
              md:mb-0
              border-b border-white/20
              last:border-b-0 
              hover:bg-white/10
              transition
            "
          >
            {/* 
              Course 
              On mobile: label "Course: " 
              On desktop: it's just the cell under the header. 
            */}
            <td className="px-4 py-2 block finaltableCollapse:table-cell">
              <span className="font-bold finaltableCollapse:hidden">Course: </span>
              {row[0]}
            </td>

            {/* Section */}
            <td className="px-4 py-2 block finaltableCollapse:table-cell">
              <span className="font-bold finaltableCollapse:hidden">Section: </span>
              {row[1]}
            </td>

            {/* Date */}
            <td className="px-4 py-2 block finaltableCollapse:table-cell">
              <span className="font-bold finaltableCollapse:hidden">Date: </span>
              {row[2]}
            </td>

            {/* Time */}
            <td className="px-4 py-2 block finaltableCollapse:table-cell">
              <span className="font-bold finaltableCollapse:hidden">Time: </span>
              {row[3]}
            </td>

            {/* Length */}
            <td className="px-4 py-2 block finaltableCollapse:table-cell">
              <span className="font-bold finaltableCollapse:hidden">Length: </span>
              {row[4]}
            </td>

            {/* Window */}
            <td className="px-4 py-2 block finaltableCollapse:table-cell">
              <span className="font-bold finaltableCollapse:hidden">Window: </span>
              {row[5]}
            </td>

            {/* Location */}
            <td className="px-4 py-2 block finaltableCollapse:table-cell">
              <span className="font-bold finaltableCollapse:hidden">Location: </span>
              {row[6]}
            </td>

            {/* Status => Add Exam button */}
            <td className="px-4 py-2 block finaltableCollapse:table-cell">
              <span className="font-bold finaltableCollapse:hidden">Status: </span>
              <button
               onClick={() => handleToggleExam(row)}
                className={`
                  w-36 py-2 
                  rounded-md 
                  font-bold 
                  active:scale-95 
                  transition-transform
                  ${
                    isSaved
                      ? "bg-green-800 text-white hover:bg-green-700"
                      : "bg-white/20 text-green-900 hover:bg-white/30"
                  }
                `}
              >
                {isSaved ? "Added" : "Add Exam"}
              </button>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>




        {/* 5) Render random blobs behind each chunk */}
        {Array.from({ length: chunksToShow }).map((_, chunkIndex) => {
          // chunkBlobs[chunkIndex] => an array of random positions
          const arr = chunkBlobs[chunkIndex] || [];
          return (
            <div key={chunkIndex} className="chunk-blobs">
              {arr.map((b, i) => (
                <div
                  key={i}
                  className="blob bg-yellow-400"
                  style={{
                    top: `${b.top}%`,
                    left: `${b.left}%`,
                    animationDuration: `${b.duration}s`,
                  }}
                />
              ))}
            </div>
          );
        })}

        {/* If there's more to show, a partial fade & button */}
        {canShowMore && (
  <div className="flex justify-center items-center mt-6">
    <button
      onClick={handleShowMore}
      className="
        show-more-button
        relative
        text-white
        px-10 py-3
        rounded-md
        border border-white/60
        bg-transparent
        font-semibold
        overflow-hidden
      "
    >
      Show more
    </button>
  </div>
)}
      </div>
    </div>
  );
}
