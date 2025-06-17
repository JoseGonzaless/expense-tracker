// Transactions.jsx
// Main page for viewing, filtering, and managing transactions

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useUser } from '../hooks/useUser';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import utc from 'dayjs/plugin/utc';
dayjs.extend(isoWeek);
dayjs.extend(utc);

import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import TransactionFilters from '../components/TransactionFilters';
import BudgetSummary from '../components/BudgetSummary';

export default function Transactions() {
  const { user } = useUser();
  const [refreshKey, setRefreshKey] = useState(0);

  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('this');
  const [selectedCategory, setSelectedCategory] = useState('');

  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  // Fetch transactions from Supabase
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
  }, [user, refreshKey]);

  // Filter transactions based on selected filters
  useEffect(() => {
    let result = [...transactions];

    // Filter by month
    if (selectedMonth) {
      result = result.filter((tx) => {
        const month = dayjs(tx.date).format('MMMM');
        return month === selectedMonth;
      });
    }

    // Filter by week
    if (selectedWeek === 'this' || selectedWeek === 'last') {
      const currentWeek = dayjs.utc().isoWeek();
      result = result.filter((tx) => {
        const txWeek = dayjs.utc(tx.date).isoWeek();
        return selectedWeek === 'this' ? txWeek === currentWeek : txWeek === currentWeek - 1;
      });
    }

    // Filter by category
    if (selectedCategory) {
      result = result.filter((tx) => tx.category === selectedCategory);
    }

    setFiltered(result);
  }, [transactions, selectedMonth, selectedWeek, selectedCategory]);

  return (
    <div className="container">
      <h2>Transactions</h2>

      <TransactionForm onAdd={triggerRefresh} />

      <TransactionFilters
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedWeek={selectedWeek}
        setSelectedWeek={setSelectedWeek}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <BudgetSummary filtered={filtered} />

      <TransactionList
        refreshTrigger={refreshKey}
        onDelete={triggerRefresh}
        transactions={filtered}
      />
    </div>
  );
}
