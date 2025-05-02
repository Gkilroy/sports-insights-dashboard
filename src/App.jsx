// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ParlayBuilder from './pages/ParlayBuilder'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/parlay" element={<ParlayBuilder />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
