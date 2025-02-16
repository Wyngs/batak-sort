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
}