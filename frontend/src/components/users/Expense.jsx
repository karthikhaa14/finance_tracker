import React, { useState } from 'react';

const Expense = () => {
  const [showForm, setShowForm] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({ amount: '', category: '', date: '' });
  const [showExpenseList, setShowExpenseList] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (formData.amount && formData.category && formData.date) {
      setExpenses([...expenses, { ...formData, id: Date.now() }]);
      setFormData({ amount: '', category: '', date: '' });
      setShowForm(false);
    }
  };

  const handleDelete = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const handleEdit = (id) => {
    const expenseToEdit = expenses.find((expense) => expense.id === id);
    setFormData(expenseToEdit);
    setExpenses(expenses.filter((expense) => expense.id !== id));
    setShowForm(true);
  };

  return (
    <div className="p-6 relative min-h-screen">
      {/* Add Expense Button */}
      {!showForm && !showExpenseList && (
        <div className="flex justify-end">
          <button 
            onClick={() => setShowForm(true)} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            Add Expense
          </button>
        </div>
      )}

      {/* Buttons during Form Display */}
      {showForm && (
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => setShowExpenseList(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-sm"
          >
            View Expense
          </button>
          <button
            onClick={() => alert('Downloading expense...')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-sm"
          >
            Download Expense
          </button>
        </div>
      )}

      {/* Expense Form (Card Style) */}
      {showForm && (
        <div className="flex justify-center mt-8">
          <div className="space-y-4 w-full max-w-md p-6 bg-white rounded-lg shadow-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-center">Add New Expense</h2>
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSave}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Save Expense
            </button>
          </div>
        </div>
      )}

      {/* Expense Table */}
      {showExpenseList && (
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4">Expense Records</h2>
          {expenses.length === 0 ? (
            <p className="text-gray-500">No expense records found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2">Amount</th>
                    <th className="border px-4 py-2">Category</th>
                    <th className="border px-4 py-2">Date</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="text-center">
                      <td className="border px-4 py-2">${expense.amount}</td>
                      <td className="border px-4 py-2">{expense.category}</td>
                      <td className="border px-4 py-2">{expense.date}</td>
                      <td className="border px-4 py-2 space-x-2">
                        <button
                          onClick={() => handleEdit(expense.id)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
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
