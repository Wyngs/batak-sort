import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Search from './pages/Search'
import Calendar from './pages/Calendar'
import './App.css'

function App() {
  

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/calendar" element={<Calendar />} />
    </Routes>
  )
}

export default App