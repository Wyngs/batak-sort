import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Search from './pages/Search'
import Calendar from './pages/Calendar'
import Resource from './pages/Resource'
import Advisor from './pages/Advisor'
import './App.css'

function App() {
  

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/resource" element={<Resource />} />
      <Route path="/advisor" element={<Advisor />} />
    </Routes>
  )
}

export default App