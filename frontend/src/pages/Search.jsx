import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import logo from "../assets/UofAlogo.png" 
import examData from '../../../constants/Fall24FinalSchedule.json'
import { AddToCalendarButton } from 'add-to-calendar-button-react';



const setCookie = (name, value, days) => {
  try {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${JSON.stringify(value)};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
    return true;
  } catch (error) {
    console.error('Error setting cookie:', error);
    return false;
  }
};

const getCookie = (name) => {
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop().split(';').shift();
      return JSON.parse(cookieValue);
    }
    return null;
  } catch (error) {
    console.error('Error getting cookie:', error);
    return null;
  }
};

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [savedExams, setSavedExams] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  

  // Load saved exams from cookies on component mount
  useEffect(() => {
    const savedExamsData = getCookie('savedExams');
    if (savedExamsData) {
      setSavedExams(savedExamsData);
    }
  }, []);

// Extract the search term from the URL query parameter and set it to the searchTerm state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const courseQuery = params.get('course') || ''; // Default to empty if no query
    setSearchTerm(courseQuery);
  }, [location]);



  // Save exams to cookies whenever savedExams changes
  useEffect(() => {
    if (savedExams.length > 0) {
      setCookie('savedExams', savedExams, 30); // 30 days
    } else {
      document.cookie = 'savedExams=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
  }, [savedExams]);


  const handleToggleExam = (exam) => {
    const isExamSaved = savedExams.some(
      saved => saved[0] === exam[0] && saved[1] === exam[1]
    )
    
    if (isExamSaved) {
      // Remove exam
      setSavedExams(savedExams.filter(
        saved => !(saved[0] === exam[0] && saved[1] === exam[1])
      ))
    } else {
      // Add exam
      setSavedExams([...savedExams, exam])
    }
  }

  

  // Filter data based on search term
  const filteredData = examData.data.slice(1).filter(row => {
    return row[0]?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (  
    
    <div className="min-h-screen flex flex-col bg-green-700 overflow-x-hidden">
    
          {/* Navbar */}
          <nav className="w-full bg-green-800 text-yellow-300 px-4 md:px-8 py-4">
            <div className="max-w-full mx-auto flex items-center justify-between">
              <div className="flex items-center">
                 
                <Link to="/" className="flex items-center">
                  <img src={logo} alt="UofA Logo" className="w-10 h-10 md:w-14 md:h-14 mr-4" />
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
                  <path d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
                </svg>
              </button>

              {/* Desktop navigation */}
              <ul className="hidden md:flex space-x-10 font-semibold text-xl">
                <li><Link to="/" className="hover:text-yellow-500 transition duration-200">Home</Link></li>
                <li><Link to="/calendar" className="hover:text-yellow-500 transition duration-200">Calendar</Link></li>
                <li><Link to="/resource" className="hover:text-yellow-500 transition duration-200">Resource</Link></li>
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
                  to="/calendar" 
                  className="block py-2 text-center text-yellow-300 hover:bg-green-900 rounded transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Calendar
                </Link>
                <Link 
                  to="/resource" 
                  className="block py-2 text-center text-yellow-300 hover:bg-green-900 rounded transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Resource
                </Link>
              </div>
            </div>
          </nav>

    <div className='p-4'>
      <h1 className='font-bold text-2xl pb-3 text-yellow-300'>Search and add! All added courses are displayed in the Calender 📅</h1>

      {/* <div className="mb-4">
        <button
          onClick={() => setShowPopup(true)}
          className="w-full md:w-auto py-2 px-4 rounded-md font-bold bg-yellow-400 text-black hover:bg-yellow-500 active:scale-95 transition-transform duration-150"
        >
          Add Your Exam
        </button>
      </div> */}

      {/* Popup Window */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-green-700 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-white">Add New Exam</h2>
            <form onSubmit={handleAddNewExam}>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Course (e.g., CMPUT 175)"
                  className={`w-full p-2 rounded ${errors.course ? 'border-2 border-red-500' : ''}`}
                  value={newExam.course}
                  onChange={(e) => {
                    setNewExam({...newExam, course: e.target.value});
                    setErrors({...errors, course: ''});
                  }}
                  required
                />
                {errors.course && <p className="text-red-500 text-sm mt-1">{errors.course}</p>}
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Section"
                  className={`w-full p-2 rounded ${errors.section ? 'border-2 border-red-500' : ''}`}
                  value={newExam.section}
                  onChange={(e) => {
                    setNewExam({...newExam, section: e.target.value});
                    setErrors({...errors, section: ''});
                  }}
                  required
                />
                {errors.section && <p className="text-red-500 text-sm mt-1">{errors.section}</p>}
              </div>
              <input
                type="text"
                placeholder="Date (MM/DD/YYYY)"
                className={`w-full mb-2 p-2 rounded ${errors.date ? 'border-2 border-red-500' : ''}`}
                value={newExam.date}
                onChange={(e) => {
                  setNewExam({...newExam, date: e.target.value});
                  setErrors({...errors, date: ''});
                }}
                required
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
              <input
                type="text"
                placeholder="Time"
                className={`w-full mb-2 p-2 rounded ${errors.time ? 'border-2 border-red-500' : ''}`}
                value={newExam.time}
                onChange={(e) => {
                  setNewExam({...newExam, time: e.target.value});
                  setErrors({...errors, time: ''});
                }}
                required
              />
              {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
              <input
                type="text"
                placeholder="Length"
                className={`w-full mb-2 p-2 rounded ${errors.length ? 'border-2 border-red-500' : ''}`}
                value={newExam.length}
                onChange={(e) => {
                  setNewExam({...newExam, length: e.target.value});
                  setErrors({...errors, length: ''});
                }}
                required
              />
              {errors.length && <p className="text-red-500 text-sm mt-1">{errors.length}</p>}
              <input
                type="text"
                placeholder="Completion Window"
                className={`w-full mb-2 p-2 rounded ${errors.window ? 'border-2 border-red-500' : ''}`}
                value={newExam.window}
                onChange={(e) => {
                  setNewExam({...newExam, window: e.target.value});
                  setErrors({...errors, window: ''});
                }}
                required
              />
              {errors.window && <p className="text-red-500 text-sm mt-1">{errors.window}</p>}
              <input
                type="text"
                placeholder="Location"
                className={`w-full mb-4 p-2 rounded ${errors.location ? 'border-2 border-red-500' : ''}`}
                value={newExam.location}
                onChange={(e) => {
                  setNewExam({...newExam, location: e.target.value});
                  setErrors({...errors, location: ''});
                }}
                required
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-md font-bold bg-yellow-400 text-black hover:bg-yellow-500 active:scale-95 transition-transform duration-150"
                >
                  Add Exam
                </button>
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="flex-1 py-2 rounded-md font-bold bg-red-500 text-white hover:bg-red-600 active:scale-95 transition-transform duration-150"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search input */}
      <div className="mb-4 w-full">
        <input
          type="text"
          placeholder="Search by course name..."
          className="w-full p-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Scrollable table container */}
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-full border-collapse border border-green-700 text-white font-bold text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-4 py-2 bg-green-700">Course</th>
              <th className="border border-gray-200 px-4 py-2 bg-green-700">Section</th>
              <th className="border border-gray-200 px-4 py-2 bg-green-700">Date</th>
              <th className="border border-gray-200 px-4 py-2 bg-green-700">Time</th>
              <th className="border border-gray-200 px-4 py-2 bg-green-700">Length</th>
              <th className="border border-gray-200 px-4 py-2 bg-green-700">Completion Window</th>
              <th className="border border-gray-200 px-4 py-2 bg-green-700">Location</th>
              <th className="border border-gray-200 px-4 py-2 bg-green-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 text-white font-bold hover:text-yellow-300 hover:font-bold hover:bg-lime-800">
                <td className="border border-gray-200 px-4 py-2">{row[0]}</td>
                <td className="border border-gray-200 px-4 py-2">{row[1]}</td>
                <td className="border border-gray-200 px-4 py-2">{row[2]}</td>
                <td className="border border-gray-200 px-4 py-2">{row[3]}</td>
                <td className="border border-gray-200 px-4 py-2">{row[4]}</td>
                <td className="border border-gray-200 px-4 py-2">{row[5]}</td>
                <td className="border border-gray-200 px-4 py-2">{row[6]}</td>
                <td className="border border-gray-200 px-4 py-2">
                <button
                  onClick={() => handleToggleExam(row)}
                  className={`w-full py-2 rounded-md font-bold ${
                    savedExams.some(saved => saved[0] === row[0] && saved[1] === row[1])
                      ? 'bg-sky-500 text-white hover:bg-sky-600'
                      : 'bg-yellow-400 text-black hover:bg-yellow-500'
                  } active:scale-95 transition-transform duration-150 mb-2`}
                >
                  {savedExams.some(saved => saved[0] === row[0] && saved[1] === row[1]) ? 'Added' : 'Add Exam'}
                </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tile-based format for mobile */}
      <div className="md:hidden">
        {filteredData.map((row, index) => (
          <div key={index} className="border border-green-700 rounded-lg p-4 mb-4 bg-[#e9e9e9] text-green-800 shadow-md hover:bg-gray-200">
            <div className="flex flex-col items-center text-center">
              <div className="mb-2 text-lg font-bold">
                {row[0]} - {row[1]}
              </div>
              <div className="mb-2">
                <strong>Date:</strong> {row[2]}
              </div>
              <div className="mb-2">
                <strong>Time:</strong> {row[3]}
              </div>
              <div className="mb-2">
                <strong>Length:</strong> {row[4]}
              </div>
              <div className="mb-2">
                <strong>Completion Window:</strong> {row[5]}
              </div>
              <div className="mb-3">
                <strong>Location:</strong> {row[6]}
              </div>
              <button
                onClick={() => handleToggleExam(row)}
                className={`w-full py-2 rounded-md font-bold ${
                  savedExams.some(saved => saved[0] === row[0] && saved[1] === row[1])
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-yellow-400 text-black hover:bg-yellow-500'
                } active:scale-95 transition-transform duration-150 mb-2`}
              >
                {savedExams.some(saved => saved[0] === row[0] && saved[1] === row[1]) ? 'Added' : 'Add Exam'}
              </button>
              
              <div className="w-full">
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

