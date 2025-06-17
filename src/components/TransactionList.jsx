import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useUser } from '../hooks/useUser';
import { CATEGORIES } from '../lib/categories';
import dayjs from 'dayjs';

export default function TransactionList({ transactions = [], refreshTrigger, onDelete }) {
  const { user } = useUser();
  const [editId, setEditId] = useState(null);
  const [editValues, setEditValues] = useState({
    label: '',
    amount: '',
    category: '',
    type: ''
  });

  const handleUpdate = async (id) => {
    if (!editValues.label.trim()) {
      alert('Label cannot be empty.');
      return;
    }

    const { error } = await supabase
      .from('transactions')
      .update({
        label: editValues.label,
        amount: editValues.amount,
        category: editValues.category,
        type: editValues.type
      })
      .eq('id', id);

    if (error) {
      alert('Failed to update transaction: ' + error.message);
    } else {
      setEditId(null);
      if (onDelete) onDelete();
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this transaction?');
    if (!confirm) return;

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Failed to delete transaction: ' + error.message);
    } else {
      if (onDelete) onDelete();
    }
  };

  if (!transactions.length) {
    return <p>No transactions found.</p>;
  }

  return (
    <ul>
      {transactions.map((tx) => (
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
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
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
              <strong>{tx.label}</strong> — ${tx.amount} ({tx.category}, {tx.type}) on{' '}
              {dayjs(tx.date).format('MMM D, YYYY')}
            </span>
          )}
          <button
            onClick={() => {
              setEditId(tx.id);
              setEditValues({
                label: tx.label,
                amount: tx.amount,
                category: tx.category,
                type: tx.type
              });
            }}
          >
            Edit
          </button>
          <button onClick={() => handleDelete(tx.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
