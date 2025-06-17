import { supabase } from '../lib/supabase'
import { useState } from 'react'
import TransactionForm from '../components/TransactionForm'
import TransactionList from '../components/TransactionList'
import BudgetForm from '../components/BudgetForm'

export default function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0)

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="container">
      <h2>Welcome to your Dashboard!</h2>
      <BudgetForm onUpdate={triggerRefresh} />
      <TransactionList refreshTrigger={refreshKey} onDelete={triggerRefresh}/>
      <TransactionForm onAdd={triggerRefresh} />
    </div>
  )
}
