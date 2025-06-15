import { supabase } from '../lib/supabase'
import TransactionForm from '../components/TransactionForm'

export default function Dashboard() {
  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const handleRefresh = () => {
    // We'll use this later to reload transactions
    console.log('transaction added')
  }

  return (
    <div className="container">
      <h2>Welcome to your Dashboard!</h2>
      <TransactionForm onAdd={handleRefresh} />
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
