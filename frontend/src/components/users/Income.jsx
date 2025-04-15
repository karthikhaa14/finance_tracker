import React, { useState } from 'react';
import axios from 'axios';
const Income = () => {
  const [showForm, setShowForm] = useState(false);
  const [incomes, setIncomes] = useState([]);
  const [formData, setFormData] = useState({ amount: '', source: '', date: '' });
  const [showIncomeList, setShowIncomeList] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async() => {
    if (formData.amount && formData.source && formData.date) {
      try {
        const response = await axios.post("http://localhost:5000/api/incomes/", formData);
        setIncomes((prev) => [...prev, response.data]);
        setFormData({ amount: '', source: '', date: '' });
        setShowForm(false);
      } catch (error) {
        console.error('Error saving income data:', error);
      }
    }
  };

  const handleDelete = (id) => {
    setIncomes(incomes.filter((income) => income.id !== id));
  };

  const handleEdit = (id) => {
    const incomeToEdit = incomes.find((income) => income.id === id);
    setFormData(incomeToEdit);
    setIncomes(incomes.filter((income) => income.id !== id));
    setShowForm(true);
    setShowIncomeList(false);
  };

  const handleBack = () => {
    setShowIncomeList(false);
    setShowForm(false);
  };

  return (
    <div className="p-6 relative">
      {/* Top Right Buttons */}
      <div className="flex justify-end gap-3 mb-4">
        {!showForm && !showIncomeList && (
          <button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"> 
            Add Income </button>)
        }
        {incomes.length > 0 && (
          <>
            <button onClick={() => setShowIncomeList(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
              View Income </button>
            <button onClick={() => alert('Downloading income...')}  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
              Download Income </button>
          </>
        )}
      </div>
      {/* Form Section */}
      {showForm && !showIncomeList && (
        <div className="mt-6 space-y-4 max-w-md">
          <input  type="number"  name="amount" placeholder="Amount"  value={formData.amount}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"  />
          <input type="text" name="source" placeholder="Source" value={formData.source}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded" />
          <input type="date" name="date"  value={formData.date}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"/>
          <div className="flex gap-4">
            <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
              Save Income
            </button>
            <button onClick={handleBack} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Income Table Section */}
      {showIncomeList && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Income Records</h2>
            <button
              onClick={handleBack}
              className="text-sm text-blue-600 hover:underline"
            >
              ← Back
            </button>
          </div>

          {incomes.length === 0 ? (
            <p className="text-gray-500">No income records found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 shadow-md rounded">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="py-2 px-4 border-b">Amount</th>
                    <th className="py-2 px-4 border-b">Source</th>
                    <th className="py-2 px-4 border-b">Date</th>
                    <th className="py-2 px-4 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {incomes.map((income) => (
                    <tr key={income.id} className="text-center">
                      <td className="py-2 px-4 border-b">${income.amount}</td>
                      <td className="py-2 px-4 border-b">{income.source}</td>
                      <td className="py-2 px-4 border-b">{income.date}</td>
                      <td className="py-2 px-4 border-b space-x-2">
                        <button
                          onClick={() => handleEdit(income.id)}
                          className="text-blue-500 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(income.id)}
                          className="text-red-500 hover:underline"
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

export default Income;
