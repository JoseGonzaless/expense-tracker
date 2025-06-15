import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useUser } from '../hooks/useUser'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
dayjs.extend(isoWeek)
import SpendingChart from './SpendingChart'
import { CATEGORIES } from '../lib/categories'

export default function TransactionList({ refreshTrigger, onDelete }) {
  const { user } = useUser()
  const [transactions, setTransactions] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editId, setEditId] = useState(null)
  const [editValues, setEditValues] = useState({ label: '', amount: '', category: '', type: '' })
  const [budgetLimits, setBudgetLimits] = useState({})

  // Filters
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedWeek, setSelectedWeek] = useState('this')
  const [selectedCategory, setSelectedCategory] = useState('')

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

  const handleUpdate = async (id) => {
    if (!editValues.label.trim()) {
        alert('Label cannot be empty.')
        return
    }

    const { error } = await supabase
        .from('transactions')
        .update({
        label: editValues.label,
        amount: editValues.amount,
        category: editValues.category,
        type: editValues.type
        })
        .eq('id', id)

    if (error) {
        alert('Failed to update transaction: ' + error.message)
    } else {
        setEditId(null)
        if (onDelete) onDelete()
    }
  }

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this transaction?')
    if (!confirm) return

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Failed to delete transaction: ' + error.message)
    } else {
      if (onDelete) onDelete()
    }
  }

  useEffect(() => {
    if (user) fetchTransactions()
  }, [user, refreshTrigger])

  useEffect(() => {
    let result = [...transactions]

    if (selectedMonth) {
      result = result.filter((tx) => {
        const month = dayjs(tx.date).format('MMMM')
        return month === selectedMonth
      })
    }

    if (selectedWeek) {
      const now = dayjs()
      const currentWeek = now.isoWeek()
      result = result.filter((tx) => {
        const txWeek = dayjs(tx.date).isoWeek()
        return selectedWeek === 'this'
          ? txWeek === currentWeek
          : txWeek === currentWeek - 1
      })
    }

    if (selectedCategory) {
      result = result.filter((tx) => tx.category === selectedCategory)
    }

    setFiltered(result)
  }, [transactions, selectedMonth, selectedWeek, selectedCategory])

  useEffect(() => {
    const fetchBudgets = async () => {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)

      if (!error && data) {
        const mapped = {}
        data.forEach((b) => {
          mapped[b.category] = b.limit
        })
        setBudgetLimits(mapped)
      }
    }

    if (user) fetchBudgets()
  }, [user, refreshTrigger])

  if (loading) return <p>Loading transactions...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h3>Transaction History</h3>

      {/* Filters */}
      <div>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          <option value="">All Months</option>
          {[
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ].map((month) => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>

        <select value={selectedWeek} onChange={(e) => setSelectedWeek(e.target.value)}>
          <option value="this">This Week</option>
          <option value="last">Last Week</option>
          <option value="">All Weeks</option>
        </select>

        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
        </select>
      </div>

      {/* Budget Summary */}
      <div>
        <h4>Summary</h4>
        <ul>
          <li><strong>Total Income:</strong> ${filtered.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + Number(tx.amount), 0).toFixed(2)}</li>
          <li><strong>Total Expenses:</strong> ${filtered.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + Number(tx.amount), 0).toFixed(2)}</li>
          <li><strong>Net:</strong> ${(filtered.reduce((sum, tx) => {
            return tx.type === 'income'
              ? sum + Number(tx.amount)
              : sum - Number(tx.amount)
          }, 0)).toFixed(2)}</li>
        </ul>

        <h4>Budget Tracking</h4>
        <ul>
          {CATEGORIES.map((cat) => {
            const limit = budgetLimits[cat] ?? null
            const spent = filtered
              .filter(tx => tx.category === cat && tx.type === 'expense')
              .reduce((sum, tx) => sum + Number(tx.amount), 0)
            return (
              <li key={cat}>
                <strong>{cat}:</strong> ${spent.toFixed(2)}
                {limit !== null && ` / $${limit.toFixed(2)} (${spent > limit ? 'Over' : 'Under'})`}
              </li>
            )
          })}
        </ul>
      </div>

      {/* Chart */}
      <SpendingChart data={filtered} />

      {/* Transactions */}
      {filtered.length === 0 ? (
        <p>No transactions found for the selected filters.</p>
      ) : (
        <ul>
          {filtered.map((tx) => (
            <li key={tx.id}>
                {editId === tx.id ? (
                <div>
                    <input
                    type="text"
                    value={editValues.label}
                    onChange={(e) => setEditValues({ ...editValues, label: e.target.value })}
                    />
                    <input
                    type="number"
                    value={editValues.amount}
                    onChange={(e) => setEditValues({ ...editValues, amount: e.target.value })}
                    />
                    <select
                    value={editValues.category}
                    onChange={(e) => setEditValues({ ...editValues, category: e.target.value })}
                    >
                    <option value="Wants">Wants</option>
                    <option value="Meal Prep">Meal Prep</option>
                    <option value="Investment">Investment</option>
                    <option value="Income">Income</option>
                    </select>
                    <select
                    value={editValues.type}
                    onChange={(e) => setEditValues({ ...editValues, type: e.target.value })}
                    >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                    </select>
                    <button onClick={() => handleUpdate(tx.id)}>Save</button>
                    <button onClick={() => setEditId(null)}>Cancel</button>
                </div>
                ) : (
                <span>
                    <strong>{tx.label}</strong> — ${tx.amount} ({tx.category}, {tx.type}) on {dayjs(tx.date).format('MMM D, YYYY')}
                </span>
                )}
                <button onClick={() => {
                    setEditId(tx.id)
                    setEditValues({
                        label: tx.label,
                        amount: tx.amount,
                        category: tx.category,
                        type: tx.type
                    })
                    }}>
                    Edit
                </button>
                <button onClick={() => handleDelete(tx.id)}>
                    Delete
                </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
