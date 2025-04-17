import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useOutletContext } from 'react-router-dom';

const COLORS = ['#4F83CC', '#6B7280', '#10B981', '#F59E0B', '#EF4444']; // More neutral, professional colors

const Dashboard = () => {
  const { userId } = useOutletContext();
  console.log(userId);
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const incomeRes = await axios.get(`http://localhost:5000/api/incomes/user/${userId}`,{ headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },});
        const expenseRes = await axios.get(`http://localhost:5000/api/expenses/user/${userId}`,{ headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },});
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
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">

      {/* Summary Card */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Financial Overview</h2>
        <div className="flex justify-around text-center">
          <div className="bg-gray-100 py-6 px-4 rounded-xl w-1/4 mx-2 shadow-sm h-40 flex flex-col justify-center">
            <h3 className="text-md font-medium text-gray-500">Total Income</h3>
            <p className="text-2xl font-semibold text-green-800">{totalIncome.toFixed(2)}</p>
          </div>
          <div className="bg-gray-100 py-6 px-4 rounded-xl w-1/4 mx-2 shadow-sm h-40 flex flex-col justify-center">
            <h3 className="text-md font-medium text-gray-500">Total Expenses</h3>
            <p className="text-2xl font-semibold text-red-600">{totalExpense.toFixed(2)}</p>
          </div>
          <div className="bg-gray-100 py-6 px-4 rounded-xl w-1/4 mx-2 shadow-sm h-40 flex flex-col justify-center">
            <h3 className="text-md font-medium text-gray-500">Remaining Balance</h3>
            <p className="text-2xl font-semibold text-blue-600">{remaining.toFixed(2)}</p>
          </div>
        </div>
      </div>
      
      {/* Charts Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 text-center">Income by Source</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={incomeByCategory} dataKey="value" nameKey="name" outerRadius={100}>
                {incomeByCategory.map((_, index) => (
                  <Cell key={`income-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 text-center">Expense by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={expenseByCategory} dataKey="value" nameKey="name" outerRadius={100}>
                {expenseByCategory.map((_, index) => (
                  <Cell key={`expense-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Latest Transactions Card */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 text-center">Recent Transactions</h3>
        {latestEntries.length !== 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr className="text-gray-600">
                  <th className="py-2 px-4 border">Type</th>
                  <th className="py-2 px-4 border">Category/Source</th>
                  <th className="py-2 px-4 border">Amount</th>
                  <th className="py-2 px-4 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {latestEntries.map((entry, index) => (
                  <tr key={index} className="text-center hover:bg-gray-50">
                    <td className="py-2 px-4 border">{'source' in entry ? 'Income' : 'Expense'}</td>
                    <td className="py-2 px-4 border">{'source' in entry ? entry.source : entry.category}</td>
                    <td className="py-2 px-4 border text-gray-700">${parseFloat(entry.amount).toFixed(2)}</td>
                    <td className="py-2 px-4 border text-gray-500">{new Date(entry.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">No entries yet</p>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
