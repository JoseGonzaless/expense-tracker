import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard' // create placeholder
import { useUser } from './hooks/useUser'

function App() {
  const { user, loading } = useUser()

  if (loading) return

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  )
}

export default App
