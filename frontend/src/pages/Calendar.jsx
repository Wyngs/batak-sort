import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AddToCalendarButton } from 'add-to-calendar-button-react';
import logo from "../assets/UofAlogo.png" 
import confetti from 'canvas-confetti';

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

const validateInput = { 
  course: (value) => {
    const pattern = /^[A-Z]{2,6}\s*\d{3}$/;
    return pattern.test(value.trim()) ? '' : 'Format should be like "CMPUT 175"';
  },
  section: (value) => {
    const pattern = /^[A-Z0-9]{1,3}$/;
    return pattern.test(value.trim()) ? '' : 'Section should be 1-3 characters';
  },
  date: (value) => {
    const pattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
    return pattern.test(value) ? '' : 'Format: MM/DD/YYYY';
  },
  time: (value) => {
    const pattern = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s*(AM|PM)$/i;
    return pattern.test(value) ? '' : 'Format: HH:MM AM/PM';
  },
  length: (value) => {
    const pattern = /^\d+(\.\d+)?\s*(hour|hours|hr|hrs)$/i;
    return pattern.test(value) ? '' : 'Format: X hours or X hrs';
  }
};

export default function Calendar() {
  const [savedExams, setSavedExams] = useState([])
  const [showPopup, setShowPopup] = useState(false);
  const [newExam, setNewExam] = useState({
    course: '',
    section: '',
    date: '',
    time: '',
    length: '',
    window: '',
    location: ''
  });
  const [errors, setErrors] = useState({});
  const [showFireworks, setShowFireworks] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Load saved exams from cookies on component mount
  useEffect(() => {
    const getCookie = (name) => {
      try {
        const value = `; ${document.cookie}`
        const parts = value.split(`; ${name}=`)
        if (parts.length === 2) {
          const cookieValue = parts.pop().split(';').shift()
          return JSON.parse(cookieValue)
        }
        return null
      } catch (error) {
        console.error('Error getting cookie:', error)
        return null
      }
    }

    const savedExamsData = getCookie('savedExams')
      if (savedExamsData) {
        setSavedExams(savedExamsData)
      }
    }, [])

    const handleToggleExam = (exam) => {
      const isExamSaved = savedExams.some(
        saved => saved[0] === exam[0] && saved[1] === exam[1]
      )
      
      if (isExamSaved) {
        setSavedExams(savedExams.filter(
          saved => !(saved[0] === exam[0] && saved[1] === exam[1])
        ))
      } else {
        setSavedExams([...savedExams, exam])
      }
    }

    const handleRemoveExam = (examToRemove) => {
      const updatedExams = savedExams.filter(exam => 
        !(exam[0] === examToRemove[0] && exam[1] === examToRemove[1])
      );
      setSavedExams(updatedExams);
      setCookie('savedExams', JSON.stringify(updatedExams), 30);
    };
    
  useEffect(() => {
    if (savedExams.length > 0) {
      setCookie('savedExams', savedExams, 30);
    } else {
      document.cookie = 'savedExams=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
  }, [savedExams]);

  const handleAddNewExam = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {
      course: validateInput.course(newExam.course),
      section: validateInput.section(newExam.section),
      date: validateInput.date(newExam.date),
      time: validateInput.time(newExam.time),
      length: validateInput.length(newExam.length),
      window: newExam.window ? '' : 'Required field',
      location: newExam.location ? '' : 'Required field'
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }

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
    setCookie('savedExams', JSON.stringify([...savedExams, examArray]), 30);
    setShowPopup(false);
    setNewExam({
      course: '',
      section: '',
      date: '',
      time: '',
      length: '',
      window: '',
      location: ''
    });
  };

  const triggerFireworks = () => {
    const duration = 500;
    const end = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }

      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: {
          x: Math.random(),
          y: Math.random() - 0.2
        }
      });
    }, 50);
  };

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
      <li><Link to="/search" className="hover:text-yellow-500 transition duration-200">Search</Link></li>
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
        to="/search" 
        className="block py-2 text-center text-yellow-300 hover:bg-green-900 rounded transition duration-200"
        onClick={() => setIsMenuOpen(false)}
      >
        Search
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h1 className='font-bold text-2xl text-yellow-300'>Your Saved Exams 📅</h1>
        
        <div className="flex flex-col md:flex-row gap-2">
          <button
            onClick={() => setShowPopup(true)}
            className="py-2 px-4 rounded-md font-bold bg-yellow-400 text-black hover:bg-yellow-500 active:scale-95 transition-transform duration-150"
          >
            Add Your Exam
          </button>
          <button 
            onClick={() => window.print()}
            className="py-2 px-4 rounded-md font-bold bg-yellow-400 text-black hover:bg-yellow-500 active:scale-95 transition-transform duration-150"
          >
            Get Final Schedule
          </button>
        </div>
      </div>

      {/* Add Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-green-700 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-white">Add New Exam</h2>
            <form onSubmit={handleAddNewExam}>
              {/* Input fields with validation */}
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

              {/* Repeat for other input fields */}
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

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Date (MM/DD/YYYY)"
                  className={`w-full p-2 rounded ${errors.date ? 'border-2 border-red-500' : ''}`}
                  value={newExam.date}
                  onChange={(e) => {
                    setNewExam({...newExam, date: e.target.value});
                    setErrors({...errors, date: ''});
                  }}
                  required
                />
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Time (HH:MM AM/PM)"
                  className={`w-full p-2 rounded ${errors.time ? 'border-2 border-red-500' : ''}`}
                  value={newExam.time}
                  onChange={(e) => {
                    setNewExam({...newExam, time: e.target.value});
                    setErrors({...errors, time: ''});
                  }}
                  required
                />
                {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Length (e.g., 2 hours)"
                  className={`w-full p-2 rounded ${errors.length ? 'border-2 border-red-500' : ''}`}
                  value={newExam.length}
                  onChange={(e) => {
                    setNewExam({...newExam, length: e.target.value});
                    setErrors({...errors, length: ''});
                  }}
                  required
                />
                {errors.length && <p className="text-red-500 text-sm mt-1">{errors.length}</p>}
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Completion Window"
                  className={`w-full p-2 rounded ${errors.window ? 'border-2 border-red-500' : ''}`}
                  value={newExam.window}
                  onChange={(e) => {
                    setNewExam({...newExam, window: e.target.value});
                    setErrors({...errors, window: ''});
                  }}
                  required
                />
                {errors.window && <p className="text-red-500 text-sm mt-1">{errors.window}</p>}
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Location"
                  className={`w-full p-2 rounded ${errors.location ? 'border-2 border-red-500' : ''}`}
                  value={newExam.location}
                  onChange={(e) => {
                    setNewExam({...newExam, location: e.target.value});
                    setErrors({...errors, location: ''});
                  }}
                  required
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>

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

      {/* Scrollable table container */}
      <div className="overflow-x-auto mt-4 hidden md:block">
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
            {savedExams.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 text-white hover:text-yellow-300 hover:font-bold hover:bg-lime-800">
                <td className="border border-gray-200 px-4 py-2">{row[0]}</td>
                <td className="border border-gray-200 px-4 py-2">{row[1]}</td>
                <td className="border border-gray-200 px-4 py-2">{row[2]}</td>
                <td className="border border-gray-200 px-4 py-2">{row[3]}</td>
                <td className="border border-gray-200 px-4 py-2">{row[4]}</td>
                <td className="border border-gray-200 px-4 py-2">{row[5]}</td>
                <td className="border border-gray-200 px-4 py-2">{row[6]}</td>
                <td className="border border-gray-200 px-4 py-2">
                <div className="flex items-center gap-10">
                  <button
                    onClick={() => handleToggleExam(row)}
                    className={`px-3 py-1 rounded ${
                      savedExams.some(saved => saved[0] === row[0] && saved[1] === row[1])
                        ? 'bg-red-500 text-white  hover:bg-red-900'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {savedExams.some(saved => saved[0] === row[0] && saved[1] === row[1])
                      ? 'Remove'
                      : 'Add Exam'}
                  </button>
                  
                  <AddToCalendarButton 
                    name= {row[0]}
                    options= "Google"
                    startDate= {row[2].split("/")[2]+"-"+row[2].split("/")[0]+"-"+row[2].split("/")[1]}
                    location = {row[6]}
                    description= {"Section: " + row[1]}
                    
                  ></AddToCalendarButton>
                </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden">
        {savedExams.map((exam, index) => (
          <div key={index} className="border border-green-700 rounded-lg p-4 mb-4 bg-[#e9e9e9] text-green-800 shadow-md hover:bg-gray-200">
            <div className="flex flex-col items-center text-center">
              <div className="mb-2 text-lg font-bold">
                {exam[0]} - {exam[1]}
              </div>
              <div className="mb-2">
                <strong>Date:</strong> {exam[2]}
              </div>
              <div className="mb-2">
                <strong>Time:</strong> {exam[3]}
              </div>
              <div className="mb-2">
                <strong>Length:</strong> {exam[4]}
              </div>
              <div className="mb-2">
                <strong>Completion Window:</strong> {exam[5]}
              </div>
              <div className="mb-3">
                <strong>Location:</strong> {exam[6]}
              </div>

              <button
                onClick={() => handleRemoveExam(exam)}
                className="w-full py-2 rounded-md font-bold bg-red-500 text-white hover:bg-red-600 active:scale-95 transition-transform duration-150 mb-2"
              >
                Remove Exam
              </button>

              <AddToCalendarButton 
                    name= {exam[0]}
                    startDate= {exam[2].split("/")[2]+"-"+exam[2].split("/")[0]+"-"+exam[2].split("/")[1]}
                    location = {exam[6]}
                    options= "'Google'"
                    description= {"Section: " + exam[1]}
                    
                    // styleLight="--btn-background; --btn-text: #000000; --btn-shadow: none; width: 100%;"
                  ></AddToCalendarButton>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="flex justify-center mb-8">
      <button
        onClick={triggerFireworks}
        className="py-3 px-6 rounded-full font-bold bg-yellow-400 text-black hover:bg-yellow-500 active:scale-95 transition-transform duration-150 shadow-lg hover:shadow-xl"
      >
        Best of Luck on Your Exams! 🍀
      </button>
    </div>
  </div>
  )
}