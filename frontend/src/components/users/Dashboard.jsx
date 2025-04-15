import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
 
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384'];
 
const Dashboard = ({ userId }) => {
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const incomeRes = await axios.get(`http://localhost:5000/api/incomes/user/${userId}`);
        const expenseRes = await axios.get(`http://localhost:5000/api/expenses/user/${userId}`);
        setIncomeData(incomeRes.data);
        setExpenseData(expenseRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [userId]);
 
  const totalIncome = incomeData.reduce((sum, inc) => sum + parseFloat(inc.amount), 0);
  const totalExpense = expenseData.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const remaining = totalIncome - totalExpense;
 
  const incomeByCategory = Object.values(
    incomeData.reduce((acc, inc) => {
      acc[inc.source] = acc[inc.source] || { name: inc.source, value: 0 };
      acc[inc.source].value += parseFloat(inc.amount);
      return acc;
    }, {})
  );
 
  const expenseByCategory = Object.values(
    expenseData.reduce((acc, exp) => {
      acc[exp.category] = acc[exp.category] || { name: exp.category, value: 0 };
      acc[exp.category].value += parseFloat(exp.amount);
      return acc;
    }, {})
  );
 
  const latestEntries = [...incomeData, ...expenseData]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);
 
  return (
    <div className="p-6 space-y-6">
      {/* Summary Bars */}
      <div className="flex justify-around text-center text-white">
        <div className="bg-green-500 p-4 rounded-lg shadow-md w-1/4">
          <h3 className="text-lg font-bold">Total Income</h3>
          <p className="text-xl">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-red-500 p-4 rounded-lg shadow-md w-1/4">
          <h3 className="text-lg font-bold">Total Expenses</h3>
          <p className="text-xl">${totalExpense.toFixed(2)}</p>
        </div>
        <div className="bg-blue-500 p-4 rounded-lg shadow-md w-1/4">
          <h3 className="text-lg font-bold">Remaining</h3>
          <p className="text-xl">${remaining.toFixed(2)}</p>
        </div>
      </div>
 
      {/* Pie Charts */}
      <div className="flex justify-around">
        <div className="w-1/2 text-center">
          <h3 className="text-lg font-semibold mb-2">Income by Source</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={incomeByCategory} dataKey="value" nameKey="name" outerRadius={100}>
                {incomeByCategory.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/2 text-center">
          <h3 className="text-lg font-semibold mb-2">Expense by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={expenseByCategory} dataKey="value" nameKey="name" outerRadius={100}>
                {expenseByCategory.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
 
      {/* Last 10 Entries */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-center">Last 10 Entries</h3>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Type</th>
              <th className="py-2 px-4 border">Category/Source</th>
              <th className="py-2 px-4 border">Amount</th>
              <th className="py-2 px-4 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {latestEntries.map((entry, index) => (
              <tr key={index} className="text-center">
                <td className="py-2 px-4 border">{'source' in entry ? 'Income' : 'Expense'}</td>
                <td className="py-2 px-4 border">{'source' in entry ? entry.source : entry.category}</td>
                <td className="py-2 px-4 border">${parseFloat(entry.amount).toFixed(2)}</td>
                <td>{new Date(entry.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
 
export default Dashboard;
 