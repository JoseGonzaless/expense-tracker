import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useUser } from '../hooks/useUser';

import BudgetForm from '../components/BudgetForm';
import BudgetProgress from '../components/BudgetProgress';

export default function Budgets() {
  const { user } = useUser();

  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [budgetLimits, setBudgetLimits] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (!error && data) setTransactions(data);
    };

    if (user) fetchTransactions();
  }, [user, refreshKey]); // include refreshKey to re-fetch after updates

  // Fetch budgets
  useEffect(() => {
    const fetchBudgets = async () => {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id);

      if (!error && data) {
        const mapped = {};
        data.forEach((b) => {
          mapped[b.category] = b.limit;
        });
        setBudgetLimits(mapped);
      }
    };

    if (user) fetchBudgets();
  }, [user, refreshKey]); // include refreshKey to re-fetch after updates

  // No special filtering logic for now — all transactions passed to BudgetProgress
  useEffect(() => {
    setFiltered(transactions);
  }, [transactions]);

  return (
    <div className="container">
      <h2>Budgets</h2>
      <BudgetForm onUpdate={triggerRefresh} />
      <BudgetProgress filtered={filtered} budgetLimits={budgetLimits} />
    </div>
  );
}
