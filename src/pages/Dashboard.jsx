import { supabase } from '../lib/supabase'
import { useState } from 'react'
import TransactionForm from '../components/TransactionForm'
import TransactionList from '../components/TransactionList'

export default function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="container">
      <h2>Welcome to your Dashboard!</h2>
      <TransactionForm onAdd={triggerRefresh} />
      <hr />
      <TransactionList refreshTrigger={refreshKey} />
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
