import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useUser } from '../hooks/useUser';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

import BudgetSummary from '../components/BudgetSummary';
import BudgetProgress from '../components/BudgetProgress';
import TransactionCharts from '../components/TransactionCharts';

export default function Dashboard() {
  const { user } = useUser();
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [budgetLimits, setBudgetLimits] = useState([]);

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
  }, [user]);

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
  }, [user]);

  useEffect(() => {
    setFiltered(transactions);
  }, [transactions]);

  return (
    <div className="container">
      <h2>Welcome to your Dashboard!</h2>

      <BudgetSummary filtered={filtered} />
      <BudgetProgress filtered={filtered} budgetLimits={budgetLimits} />
      <TransactionCharts fullData={transactions} />
    </div>
  );
}
