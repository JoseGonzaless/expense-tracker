// TransactionFilters.jsx
// Reusable dropdown filters for transactions (Month, Week, Category)
// Useful for both data tables and charts. You can optionally hide the category filter.

import { CATEGORIES } from '../lib/categories';

export default function TransactionFilters({
  selectedMonth,
  setSelectedMonth,
  selectedWeek,
  setSelectedWeek,
  selectedCategory,
  setSelectedCategory,
  showWeek = true,
  showCategory = true // Optional prop to toggle category filter
}) {
  return (
    <div className="filter-group">
      {/* Month Selector */}
      <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
        <option value="">All Months</option>
        {[
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ].map((month) => (
          <option key={month} value={month}>{month}</option>
        ))}
      </select>

      {/* Week Selector */}
      {showWeek && (
        <select value={selectedWeek} onChange={(e) => setSelectedWeek(e.target.value)}>
          <option value="this">This Week</option>
          <option value="last">Last Week</option>
          <option value="">All Weeks</option>
        </select>
      )}

      {/* Category Selector (Optional) */}
      {showCategory && (
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      )}
    </div>
  );
}
