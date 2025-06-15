import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useUser } from '../hooks/useUser'
import { CATEGORIES } from '../lib/categories'

const categories = CATEGORIES

export default function BudgetForm({ onUpdate }) {
  const { user } = useUser()
  const [budgets, setBudgets] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) fetchBudgets()
  }, [user])

  const fetchBudgets = async () => {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id)

    if (error) {
      console.error('Error fetching budgets:', error)
    } else {
      const budgetMap = {}
      data.forEach((b) => {
        budgetMap[b.category] = b.limit
      })
      setBudgets(budgetMap)
    }
    setLoading(false)
  }

  const handleChange = (category, value) => {
    setBudgets((prev) => ({
      ...prev,
      [category]: value
    }))
  }

  const handleSave = async (category) => {
    const limit = Number(budgets[category])
    if (isNaN(limit)) return alert('Enter a valid number')

    const { data: existing } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id)
      .eq('category', category)
      .maybeSingle()

    if (existing) {
      await supabase
        .from('budgets')
        .update({ limit })
        .eq('id', existing.id)
    } else {
      await supabase
        .from('budgets')
        .insert({ user_id: user.id, category, limit })
    }

    if (onUpdate) onUpdate()
    alert(`Saved budget for ${category}`)
  }

  if (loading) return <p>Loading budget settings...</p>

  return (
    <div>
      <h4>Set Your Budget Limits</h4>
      <ul>
        {categories.map((cat) => (
          <li key={cat}>
            <label>
              {cat}: $
              <input
                type="number"
                value={budgets[cat] ?? ''}
                onChange={(e) => handleChange(cat, e.target.value)}
              />
            </label>
            <button onClick={() => handleSave(cat)}>Save</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
