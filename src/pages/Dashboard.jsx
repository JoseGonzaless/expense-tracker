import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div className="container">
      <h2>Welcome to your Dashboard!</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
