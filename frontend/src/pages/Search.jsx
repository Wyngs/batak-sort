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

  return(
    
  );
};