import { Routes, Route, Navigate } from 'react-router-dom'
import { useUser } from './hooks/useUser'

import Auth from './pages/Auth'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budgets from './pages/Budgets'
import Reports from './pages/Reports'

export default function App() {
  const { user, loading } = useUser()

  if (loading) return null

  return (
    <Routes>
      <Route path="/login" element={<Auth />} />

      {user && (
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      )}

      <Route
        path="*"
        element={<Navigate to={user ? '/dashboard' : '/login'} />}
      />
    </Routes>
  )
}
