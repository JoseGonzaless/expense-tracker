import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Label, LineChart, Line
} from 'recharts'

import { useState } from 'react'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
dayjs.extend(isoWeek)

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f7f', '#00c49f']

export default function SpendingChart({ fullData, filteredData }) {
  const [selectedMonthForWeekly, setSelectedMonthForWeekly] = useState('')

  const allExpenses = fullData.filter((tx) => tx.type === 'expense')
  const filtExpenses = filteredData.filter((tx) => tx.type === 'expense')

  // ----- Pie Chart Data -----
  const grouped = filtExpenses.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + Number(tx.amount)
    return acc
  }, {})
  const pieData = Object.entries(grouped).map(([name, value]) => ({ name, value }))

  // ----- Bar Chart Data (Weekly Totals) -----
  const weeklyTotals = {}
  allExpenses.forEach((tx) => {
    const week = dayjs(tx.date).isoWeek()
    weeklyTotals[week] = (weeklyTotals[week] || 0) + Number(tx.amount)
  })

  const barData = Object.entries(weeklyTotals).map(([week, value]) => {
    const start = dayjs().isoWeek(Number(week)).startOf('isoWeek')
    const end = dayjs().isoWeek(Number(week)).endOf('isoWeek')
    return {
      week: `${start.format('MMM D')} – ${end.format('MMM D')}`,
      rawStart: start,
      amount: value,
    }
  })

  const filteredBarData = selectedMonthForWeekly
    ? barData.filter(({ rawStart }) => rawStart.format('MMMM') === selectedMonthForWeekly)
    : barData

  // ----- Line Chart Data (Monthly Totals) -----
  const monthlyTotals = {}
  allExpenses.forEach((tx) => {
    const month = dayjs(tx.date).format('MMM')
    monthlyTotals[month] = (monthlyTotals[month] || 0) + Number(tx.amount)
  })
  const lineData = Object.entries(monthlyTotals).map(([month, amount]) => ({ month, amount }))

  return (
    <div>
      {/* Pie Chart */}
      <h4>Spending by Category</h4>
      {pieData.length === 0 ? (
        <p>No expense data for chart.</p>
      ) : (
        <PieChart width={350} height={300}>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={90}
            dataKey="value"
            label
          >
            {pieData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      )}

      {/* Bar Chart */}
      <h4>Weekly Spending Trend</h4>
      <div style={{ marginBottom: '8px' }}>
        <label>Filter Weekly Chart by Month: </label>
        <select value={selectedMonthForWeekly} onChange={(e) => setSelectedMonthForWeekly(e.target.value)}>
          <option value="">All Months</option>
          {[
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ].map((month) => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>
      {filteredBarData.length === 0 ? (
        <p>No weekly data to display.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredBarData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" label={{ value: 'Week Range', position: 'insideBottom', offset: -2 }} />
            <YAxis label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft', offset: 5 }} />
            <Tooltip />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Line Chart */}
      <h4>Monthly Spending Trend</h4>
      {lineData.length === 0 ? (
        <p>No monthly data to display.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottom', offset: -2 }} />
            <YAxis label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft', offset: 5 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
