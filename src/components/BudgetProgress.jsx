// BudgetProgress.jsx
// Displays how much has been spent per category relative to its budget limit.
// Includes visual progress bars and over/under status indicators.

import { CATEGORIES } from '../lib/categories';

export default function BudgetProgress({ filtered, budgetLimits }) {
  // Prepare processed budget data for each category
  const spendingByCategory = CATEGORIES.map((cat) => {
    // Get the user's budget limit for this category, or null if not set
    const limit = budgetLimits[cat] ?? null;

    // Calculate the total amount spent in this category (only expenses)
    const spent = filtered
      .filter((tx) => tx.category === cat && tx.type === 'expense')
      .reduce((sum, tx) => sum + Number(tx.amount), 0);

    // Determine whether the spending has exceeded the budget
    const isOver = limit !== null && spent > limit;

    return {
      category: cat,
      spent,
      limit,
      isOver
    };
  });

  return (
    <div>
      <h4>Budget Tracking</h4>
      <ul>
        {spendingByCategory.map(({ category, spent, limit, isOver }) => (
          <li key={category} style={{ marginBottom: '10px' }}>
            <strong>{category}:</strong> ${spent.toFixed(2)}

            {/* If a limit is set, display the budget comparison */}
            {limit !== null && (
              <>
                {' '} / ${limit.toFixed(2)}
                <progress
                  value={Math.min(spent, limit)}
                  max={limit}
                  style={{ width: '200px', marginLeft: '10px', verticalAlign: 'middle' }}
                />
                <span style={{ marginLeft: '10px', color: isOver ? 'red' : 'green' }}>
                  {isOver ? 'Over' : 'Under'}
                </span>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}