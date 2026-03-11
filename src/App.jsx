import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import TertuliaPage from './pages/TertuliaPage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import GalleryPage from './pages/GalleryPage'
import TeamPage from './pages/TeamPage'
import ContactPage from './pages/ContactPage'
import Admin from './pages/Admin'
import Login from './pages/Login'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken')
  if (!token) return <Navigate to="/login" replace />
  return children
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/tertulia" element={<TertuliaPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App
