import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f7f', '#00c49f']

export default function SpendingChart({ data }) {
  const expenses = data.filter((tx) => tx.type === 'expense')
  const grouped = expenses.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + Number(tx.amount)
    return acc
  }, {})

  const chartData = Object.entries(grouped).map(([name, value]) => ({
    name,
    value,
  }))

  if (chartData.length === 0) return <p>No expense data for chart.</p>

  return (
    <div>
      <h4>Spending by Category</h4>
      <PieChart width={350} height={300}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={90}
          dataKey="value"
          label
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  )
}
