import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar';
import Home from './pages/Home'
import './App.css'

function App() {
  return (
   <Router>
      <NavBar />
      <Routes>
        <Route path="/my-portfolio" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App
