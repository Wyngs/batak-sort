import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AddToCalendarButton } from "add-to-calendar-button-react";
import confetti from "canvas-confetti";
import logo from "../assets/UofAlogo.png";

// Utility for random
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Cookie helpers
function setCookie(name, value, days) {
  try {
    const expires = new Date();
    expires.setTime(expires.getTime() + days*24*60*60*1000);
    document.cookie = `${name}=${JSON.stringify(value)};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
    return true;
  } catch (error) {
    console.error("Error setting cookie:", error);
    return false;
  }
}
function getCookie(name) {
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
}

const BLOB_COUNT = 8;

export default function Calendar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Saved exams state
  const [savedExams, setSavedExams] = useState([]);
  // Add exam popup
  const [showPopup, setShowPopup] = useState(false);
  const [newExam, setNewExam] = useState({
    course: "",
    section: "",
    date: "",
    time: "",
    length: "",
    window: "",
    location: "",
  });
  const [errors, setErrors] = useState({});

  // Random blobs
  const [blobPositions, setBlobPositions] = useState([]);

  // On mount
  useEffect(() => {
    // load saved exams from cookie
    const data = getCookie("savedExams");
    if (data) setSavedExams(data);

    // generate random blob positions
    const arr = [];
    for (let i = 0; i < BLOB_COUNT; i++) {
      arr.push({
        top: getRandom(5, 80),
        left: getRandom(5, 80),
        duration: getRandom(15, 25),
      });
    }
    setBlobPositions(arr);
  }, []);

  // Keep cookie updated
  useEffect(() => {
    if (savedExams.length > 0) {
      setCookie("savedExams", savedExams, 30);
    } else {
      document.cookie = "savedExams=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  }, [savedExams]);

  // Toggle add vs remove
  const handleToggleExam = (exam) => {
    const isExamSaved = savedExams.some((saved) => saved[0] === exam[0] && saved[1] === exam[1]);
    if (isExamSaved) {
      setSavedExams(
        savedExams.filter((saved) => !(saved[0] === exam[0] && saved[1] === exam[1]))
      );
    } else {
      setSavedExams([...savedExams, exam]);
    }
  };

  // Confetti
  const triggerFireworks = () => {
    const duration = 500;
    const end = Date.now() + duration;
    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
      });
    }, 50);
  };

  // Validation
  const validateInput = {
    // Course: allow uppercase/lowercase letters, 2-6 letters, then optional spaces, then 3 digits
    // e.g. "cmput 175" or "CMPUT175"
    course: (val) => {
      const pattern = /^[A-Za-z]{2,6}\s*\d{3}$/;
      return pattern.test(val.trim()) ? "" : 'Format like "CMPUT 175"';
    },
    // Section: uppercase/lowercase or digits, up to 3
    section: (val) => {
      const pattern = /^[A-Za-z0-9]{1,3}$/;
      return pattern.test(val.trim()) ? "" : "Section: up to 3 letters/digits";
    },
    // date: mm/dd/yyyy
    date: (val) => {
      const pattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
      return pattern.test(val) ? "" : "Use MM/DD/YYYY";
    },
    // time: hh:mm am/pm
    time: (val) => {
      const pattern = /^(0?[1-9]|1[0-2]):[0-5]\d\s?(AM|PM)$/i;
      return pattern.test(val) ? "" : "Use HH:MM AM/PM";
    },
    // length: if user only typed a number (or decimal), we'll append " hours"
    length: (val) => {
      // We'll handle auto-append in handleAddNewExam
      // This pattern checks if final input is something like "2 hours", "2 hr", etc
      const pattern = /^\d+(\.\d+)?\s*(hour|hours|hr|hrs)$/i;
      // If it doesn't match and doesn't match just digits, return error
      // We'll do auto-append if it's only digits in handleAddNewExam
      // If user typed "2 hours" it is valid
      // If user typed "2" we fix it in handleAddNewExam
      if (pattern.test(val)) return "";
      // else check if purely digits or decimal
      const digitsOnly = /^\d+(\.\d+)?$/;
      if (digitsOnly.test(val.trim())) {
        // We'll fix it in handleAddNewExam
        return "";
      }
      return 'e.g. "2 hours" or just a number (we add "hours")';
    }
  };

  // Add new exam
  const handleAddNewExam = (e) => {
    e.preventDefault();

    // If user typed only digits in length, auto append " hours"
    if (/^\d+(\.\d+)?$/.test(newExam.length.trim())) {
      // user typed "2" => we convert to "2 hours"
      newExam.length = newExam.length.trim() + " hours";
    }

    // Validate
    const newErrors = {
      course: validateInput.course(newExam.course),
      section: validateInput.section(newExam.section),
      date: validateInput.date(newExam.date),
      time: validateInput.time(newExam.time),
      length: validateInput.length(newExam.length),
      window: newExam.window ? "" : "Required field",
      location: newExam.location ? "" : "Required field",
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err !== "")) {
      return;
    }

    // All good, store as array
    const examArray = [
      newExam.course,
      newExam.section,
      newExam.date,
      newExam.time,
      newExam.length,
      newExam.window,
      newExam.location
    ];

    setSavedExams([...savedExams, examArray]);
    setCookie("savedExams", JSON.stringify([...savedExams, examArray]), 30);
    setShowPopup(false);

    // Reset
    setNewExam({
      course: "",
      section: "",
      date: "",
      time: "",
      length: "",
      window: "",
      location: "",
    });
  };

  return (
    <div className="relative min-h-screen flex flex-col text-white overflow-hidden font-apple">
      {/* 1) Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full bg-gradient-to-b from-[#004022] to-[#001a0f]" />
      </div>

      {/* 2) Floating Blobs behind content, z-0 */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {blobPositions.map((b, i) => (
          <div
            key={i}
            className="blob bg-yellow-400 mix-blend-screen opacity-60"
            style={{
              top: `${b.top}%`,
              left: `${b.left}%`,
              animationDuration: `${b.duration}s`,
              position: "absolute",
            }}
          />
        ))}
      </div>

      {/* 3) Navbar (like finals) */}
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
            <Link to="/search" className="hover:text-yellow-100 transition">
              Finals
            </Link>
            <Link to="/resource" className="hover:text-yellow-100 transition">
              Resource
            </Link>
            <Link to="/advisor" className="hover:text-yellow-100 transition">
              Advisor
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
          <div className="md:hidden mt-2 bg-white/10 backdrop-blur-sm rounded p-4 max-w-6xl mx-auto">
            <div className="flex flex-col space-y-3 font-semibold">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/search" onClick={() => setIsMenuOpen(false)}>
                Search
              </Link>
              <Link to="/resource" onClick={() => setIsMenuOpen(false)}>
                Resource
              </Link>
              <Link to="/advisor" onClick={() => setIsMenuOpen(false)}>
                Advisor
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* 4) Main Content Container */}
      <div className="relative z-10 mt-8 max-w-6xl mx-auto px-4 md:px-8 w-full">
        <h1 className="font-bold text-3xl text-yellow-300 mb-3">Your Saved Exams</h1>
        
        {/* Top Buttons (excluding confetti now) */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => setShowPopup(true)}
              className="
            px-6 py-2
            rounded-md
            font-bold
            backdrop-blur-sm
            bg-yellow-400/80
            text-black
            hover:bg-yellow-400/90
            active:scale-95
            transition
            shadow-lg
            hover:shadow-xl
          "
            >
              Add Your Exam
            </button>
            <button
              onClick={() => window.print()}
              className="
            px-6 py-2
            rounded-md
            font-bold
            backdrop-blur-sm
            bg-yellow-400/80
            text-black
            hover:bg-yellow-400/90
            active:scale-95
            transition
            shadow-lg
            hover:shadow-xl
          "
            >
              Get Final Schedule
            </button>
          </div>
        </div>

        {/* Add Popup */}
        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            {/* Outer container: black frosted glass */}
            <div className="bg-black/70 backdrop-blur-sm rounded-xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-white">Add New Exam</h2>
              <form onSubmit={handleAddNewExam}>
                {/* Course */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Course (e.g., CMPUT 175)"
                    className={`w-full p-2 rounded text-black ${
                      errors.course ? "border-2 border-red-500" : ""
                    }`}
                    value={newExam.course}
                    onChange={(e) => {
                      setNewExam({ ...newExam, course: e.target.value });
                      setErrors({ ...errors, course: "" });
                    }}
                    required
                  />
                  {errors.course && (
                    <p className="text-red-500 text-sm mt-1">{errors.course}</p>
                  )}
                </div>

                {/* Section */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Section"
                    className={`w-full p-2 rounded text-black ${
                      errors.section ? "border-2 border-red-500" : ""
                    }`}
                    value={newExam.section}
                    onChange={(e) => {
                      setNewExam({ ...newExam, section: e.target.value });
                      setErrors({ ...errors, section: "" });
                    }}
                    required
                  />
                  {errors.section && (
                    <p className="text-red-500 text-sm mt-1">{errors.section}</p>
                  )}
                </div>

                {/* Date */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Date (MM/DD/YYYY)"
                    className={`w-full p-2 rounded text-black ${
                      errors.date ? "border-2 border-red-500" : ""
                    }`}
                    value={newExam.date}
                    onChange={(e) => {
                      setNewExam({ ...newExam, date: e.target.value });
                      setErrors({ ...errors, date: "" });
                    }}
                    required
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                  )}
                </div>

                {/* Time */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Time (HH:MM AM/PM)"
                    className={`w-full p-2 rounded text-black ${
                      errors.time ? "border-2 border-red-500" : ""
                    }`}
                    value={newExam.time}
                    onChange={(e) => {
                      setNewExam({ ...newExam, time: e.target.value });
                      setErrors({ ...errors, time: "" });
                    }}
                    required
                  />
                  {errors.time && (
                    <p className="text-red-500 text-sm mt-1">{errors.time}</p>
                  )}
                </div>

                {/* Length */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder='Length (e.g., "2 hours" or just "2")'
                    className={`w-full p-2 rounded text-black ${
                      errors.length ? "border-2 border-red-500" : ""
                    }`}
                    value={newExam.length}
                    onChange={(e) => {
                      setNewExam({ ...newExam, length: e.target.value });
                      setErrors({ ...errors, length: "" });
                    }}
                    required
                  />
                  {errors.length && (
                    <p className="text-red-500 text-sm mt-1">{errors.length}</p>
                  )}
                </div>

                {/* Completion Window */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Completion Window"
                    className={`w-full p-2 rounded text-black ${
                      errors.window ? "border-2 border-red-500" : ""
                    }`}
                    value={newExam.window}
                    onChange={(e) => {
                      setNewExam({ ...newExam, window: e.target.value });
                      setErrors({ ...errors, window: "" });
                    }}
                    required
                  />
                  {errors.window && (
                    <p className="text-red-500 text-sm mt-1">{errors.window}</p>
                  )}
                </div>

                {/* Location */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Location"
                    className={`w-full p-2 rounded text-black ${
                      errors.location ? "border-2 border-red-500" : ""
                    }`}
                    value={newExam.location}
                    onChange={(e) => {
                      setNewExam({ ...newExam, location: e.target.value });
                      setErrors({ ...errors, location: "" });
                    }}
                    required
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-md font-bold bg-yellow-400 text-black hover:bg-yellow-500 active:scale-95 transition"
                  >
                    Add Exam
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPopup(false)}
                    className="flex-1 py-2 rounded-md font-bold bg-red-500 text-white hover:bg-red-600 active:scale-95 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Frosted table */}
        <div className="relative overflow-x-auto overflow-y-hidden rounded-xl bg-white/35 backdrop-blur-sm w-full">
            <table className="w-full text-white font-semibold table-auto">
              <thead className="bg-white/40 hidden tableCollapse:table-header-group">
                <tr>
                  <th className="px-4 py-3 border-b border-white/20">Course</th>
                  <th className="px-4 py-3 border-b border-white/20">Section</th>
                  <th className="px-4 py-3 border-b border-white/20">Date</th>
                  <th className="px-4 py-3 border-b border-white/20">Time</th>
                  <th className="px-4 py-3 border-b border-white/20">Length</th>
                  <th className="px-4 py-3 border-b border-white/20">Window</th>
                  <th className="px-4 py-3 border-b border-white/20">Location</th>
                  {/* New “Calendar” column */}
                  <th className="px-4 py-3 border-b border-white/20">
                    <span className="hidden md:inline">Calendar</span>
                  </th>
                  {/* Status column => remove or add exam */}
                  <th className="px-4 py-3 border-b border-white/20">Status</th>
                </tr>
              </thead>
              <tbody>
                {savedExams.map((exam, index) => {
                  // exam = [course, section, date, time, length, window, location]
                  const isSaved = savedExams.some(
                    (saved) => saved[0]===exam[0] && saved[1]===exam[1]
                  );
                  return (
                    <tr
                      key={index}
                      className="
                        tableCollapse:table-row
                        block
                        mb-4
                        md:mb-0
                        border-b border-white/20
                        last:border-b-0
                        hover:bg-white/10
                        transition
                      "
                    >
                      <td className="px-4 py-2 block tableCollapse:table-cell">
                        <span className="font-bold tableCollapse:hidden">Course: </span>
                        {exam[0]}
                      </td>
                      <td className="px-4 py-2 block tableCollapse:table-cell">
                        <span className="font-bold tableCollapse:hidden">Section: </span>
                        {exam[1]}
                      </td>
                      <td className="px-4 py-2 block tableCollapse:table-cell">
                        <span className="font-bold tableCollapse:hidden">Date: </span>
                        {exam[2]}
                      </td>
                      <td className="px-4 py-2 block tableCollapse:table-cell">
                        <span className="font-bold tableCollapse:hidden">Time: </span>
                        {exam[3]}
                      </td>
                      <td className="px-4 py-2 block tableCollapse:table-cell">
                        <span className="font-bold tableCollapse:hidden">Length: </span>
                        {exam[4]}
                      </td>
                      <td className="px-4 py-2 block tableCollapse:table-cell">
                        <span className="font-bold tableCollapse:hidden">Window: </span>
                        {exam[5]}
                      </td>
                      <td className="px-4 py-2 block tableCollapse:table-cell">
                        <span className="font-bold tableCollapse:hidden">Location: </span>
                        {exam[6]}
                      </td>

                      {/* New calendar column => just the google calendar icon */}
                      <td className="px-4 py-2 block tableCollapse:table-cell">
                        <span className="font-bold tableCollapse:hidden">Calendar: </span>
                        {/* We show a small G icon but the same functionality */}
                        <AddToCalendarButton
                          name={exam[0]}
                          startDate={
                            exam[2].split("/")[2] +
                            "-" + exam[2].split("/")[0] +
                            "-" + exam[2].split("/")[1]
                          }
                          location={exam[6]}
                          description={"Section: " + exam[1]}
                          options="Google"

                          label=""

                          /* 
                            Forces the built-in text to be empty and font-size to zero. 
                            You can also reduce the button to an icon with a small size 
                          */
                          styleLight="--btn-height:40px; --btn-width:40px;"
                          size="2"
                        />
                      </td>

                      {/* Status => Add or Remove */}
                      <td className="px-4 py-2 block tableCollapse:table-cell">
                        <span className="font-bold tableCollapse:hidden">Status: </span>
                        <button
                          onClick={() => handleToggleExam(exam)}
                          className={`
                            px-3 py-1 rounded font-bold
                            active:scale-95 transition-transform shadow-lg hover:shadow-xl backdrop-blur-sm
                            ${
                              isSaved
                                ? "bg-red-700/60 text-white hover:bg-red-700/90"
                                : "bg-blue-500 text-white hover:bg-blue-600"
                            }
                          `}
                        >
                          {isSaved ? "Remove" : "Add Exam"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        {/* The confetti button is now below the table, styled consistently */}
        <div className="flex justify-center mt-4 mb-4">
          <button
            onClick={triggerFireworks}
            className="
            px-6 py-2
            rounded-md
            font-bold
            backdrop-blur-sm
            bg-yellow-400/80
            text-black
            hover:bg-yellow-400/90
            active:scale-95
            transition
            shadow-lg
            hover:shadow-xl
          "
          >
            Best of Luck on Your Exams! 🍀
          </button>
        </div>
      </div>
    </div>
  );
}
