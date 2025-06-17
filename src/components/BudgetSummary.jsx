// BudgetSummary.jsx
// Displays a summary of total income, total expenses, and net balance from filtered transactions.

export default function BudgetSummary({ filtered }) {
  // Calculate total income
  const income = filtered
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + Number(tx.amount), 0)
    .toFixed(2);

  // Calculate total expenses
  const expenses = filtered
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + Number(tx.amount), 0)
    .toFixed(2);

  // Calculate net balance (income - expenses)
  const net = filtered
    .reduce((sum, tx) => {
      return tx.type === 'income'
        ? sum + Number(tx.amount)
        : sum - Number(tx.amount);
    }, 0)
    .toFixed(2);

  return (
    <div>
      <h4>Summary</h4>
      <ul>
        <li><strong>Total Income:</strong> ${income}</li>
        <li><strong>Total Expenses:</strong> ${expenses}</li>
        <li><strong>Net:</strong> ${net}</li>
      </ul>
    </div>
  );
}
