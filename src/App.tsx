import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import PageTransition from './components/PageTransition'
import Home from './pages/Home'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Blog from './pages/Blog'
import Archive from './pages/Archive'
import './App.css'

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // Temporarily disable smooth scrolling for route changes
    const originalBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Reset scroll position to top immediately when route changes
    window.scrollTo(0, 0);
    
    // Restore smooth scrolling after a brief delay
    setTimeout(() => {
      document.documentElement.style.scrollBehavior = originalBehavior;
    }, 100);
  }, [location.pathname, location.search]);

  return null;
}

function AppContent() {
  const location = useLocation();
  
  // Create a transition key that includes both pathname and search params
  // This ensures transitions trigger on same-page navigation
  const transitionKey = `${location.pathname}${location.search}`;

  return (
    <PageTransition transitionKey={transitionKey}>
      <Routes>
        <Route path="/my-portfolio/" element={<Home />} />
        <Route path="/my-portfolio/project/" element={<Projects />} />
        <Route path="/my-portfolio/project/:id" element={<ProjectDetail />} />
        <Route path="/my-portfolio/blog/" element={<Blog />} />
        <Route path="/my-portfolio/archive/" element={<Archive />} />
      </Routes>
    </PageTransition>
  );
}

function App() {
  // Scroll to top on page load/refresh
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
   <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  )
}

export default App
