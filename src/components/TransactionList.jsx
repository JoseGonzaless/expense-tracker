import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useUser } from '../hooks/useUser'

export default function TransactionList({ refreshTrigger }) {
  const { user } = useUser()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTransactions = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    if (error) setError(error.message)
    else setTransactions(data)

    setLoading(false)
  }

  useEffect(() => {
    if (user) fetchTransactions()
  }, [user, refreshTrigger]) // refreshTrigger = change signal from form

  if (loading) return <p>Loading transactions...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (transactions.length === 0) return <p>No transactions found.</p>

  return (
    <div>
      <h3>Transaction History</h3>
      <ul>
        {transactions.map((tx) => (
          <li key={tx.id}>
            <strong>{tx.label}</strong> — ${tx.amount} ({tx.category}, {tx.type}) on {tx.date}
          </li>
        ))}
      </ul>
    </div>
  )
}
