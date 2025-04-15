import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { utils, writeFile } from 'xlsx';

const Expense = ({ userId }) => {
  const [showForm, setShowForm] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({ amount: '', category: '', date: '' });
  const [showExpenseList, setShowExpenseList] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (formData.amount && formData.category && formData.date) {
      try {
        const token= sessionStorage.getItem('token');
        const response = await axios.post(`http://localhost:5000/api/expenses/${userId}`, formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setExpenses((prev) => [...prev, response.data]);
        setFormData({ amount: '', category: '', date: '' });
        setShowForm(false);
      } catch (error) {
        console.error('Error saving expense data:', error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      if (response.status === 204) {
        setExpenses((prev) => prev.filter((exp) => exp.id !== id));
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      setFormData(response.data);
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
      setShowForm(true);
      setShowExpenseList(false);
    } catch (error) {
      console.error('Error fetching expense to edit:', error);
    }
  };

  const viewExpense = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/expenses/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      setExpenses(response.data);
      setShowExpenseList(true);
      setShowForm(false);
    } catch (error) {
      console.error('Error fetching expense list:', error);
    }
  };

  const handleBack = () => {
    setShowExpenseList(false);
    setShowForm(false);
  };

  const downloadCSV = () => {
    const worksheet = utils.json_to_sheet(expenses);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Expenses');
    writeFile(workbook, 'ExpenseData.xlsx');
  };

  return (
    <div className="p-6 relative">
      {/* Top Right Buttons */}
      <div className="flex justify-end gap-3 mb-4">
        <button
          onClick={() => {
            setShowForm(true);
            setShowExpenseList(false);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Add Expense
        </button>
        <button
          onClick={viewExpense}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          View Expense
        </button>
        {showExpenseList && (
  <button
    onClick={downloadCSV}
    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
  >
    Download Expense
  </button>
)}

      </div>

      {/* Expense Form */}
      {showForm && !showExpenseList && (
        <div className="mt-6 space-y-4 max-w-md">
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Save Expense
            </button>
            <button
              onClick={handleBack}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Expense List */}
      {showExpenseList && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Expense Records</h2>
            <button
              onClick={handleBack}
              className="text-sm text-blue-600 hover:underline"
            >
              Back
            </button>
          </div>
          {expenses.length === 0 ? (
            <p className="text-gray-500">No expense records found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2">Amount</th>
                    <th className="border px-4 py-2">Category</th>
                    <th className="border px-4 py-2">Date</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((exp) => (
                    <tr key={exp.id} className="text-center">
                      <td className="border px-4 py-2">${exp.amount}</td>
                      <td className="border px-4 py-2">{exp.category}</td>
                      <td className="border px-4 py-2">{exp.date}</td>
                      <td className="border px-4 py-2 space-x-2">
                        <button
                          onClick={() => handleEdit(exp.id)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(exp.id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Expense;
