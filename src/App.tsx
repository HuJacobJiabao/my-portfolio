import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Blog from './pages/Blog'
import Archive from './pages/Archive'
import './App.css'

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset scroll position to top when route changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
   <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/my-portfolio/" element={<Home />} />
        <Route path="/my-portfolio/project/" element={<Projects />} />
        <Route path="/my-portfolio/blog/" element={<Blog />} />
        <Route path="/my-portfolio/archive/" element={<Archive />} />
      </Routes>
    </Router>
  )
}

export default App
