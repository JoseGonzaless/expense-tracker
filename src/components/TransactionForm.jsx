import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useUser } from '../hooks/useUser'
import { CATEGORIES } from '../lib/categories'

export default function TransactionForm({ onAdd }) {
  const { user } = useUser()
  const [form, setForm] = useState({
    label: '',
    amount: '',
    category: '',
    type: 'expense'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [recurring, setRecurring] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.from('transactions').insert({
      user_id: user.id,
      label: form.label,
      amount: parseFloat(form.amount),
      category: form.category,
      type: form.type,
      recurring,
      date: new Date().toLocaleDateString('en-CA') // e.g., '2025-06-15'
    })

    if (error) {
      setError(error.message)
    } else {
      setForm({ label: '', amount: '', category: '', type: 'expense' })
      setRecurring(false)
      if (onAdd) onAdd() // optional refresh trigger
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Transaction</h3>
      <input name="label" placeholder="Label" value={form.label} onChange={handleChange} required />
      <input name="amount" type="number" placeholder="Amount" value={form.amount} onChange={handleChange} required />
      <label>
        <input
          type="checkbox"
          checked={recurring}
          onChange={(e) => setRecurring(e.target.checked)}
        />
        Recurring
      </label>
      <select name="category" value={form.category} onChange={handleChange} required>
        <option value="">Select Category</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <select name="type" value={form.type} onChange={handleChange}>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Add Transaction'}
      </button>
      {error && <p>{error}</p>}
    </form>
  )
}
