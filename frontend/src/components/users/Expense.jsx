import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { utils, writeFile } from 'xlsx';
import { useOutletContext } from 'react-router-dom';

// Lucide Icons
import {
  PlusCircle,
  Eye,
  Download,
  Pencil,
  Trash2,
  ArrowLeft
} from 'lucide-react';

const Expense = () => {
  const context = useOutletContext();
  const userId = context.userId;

  const [showForm, setShowForm] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({ amount: '', category: '', date: '' });
  const [showExpenseList, setShowExpenseList] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    const fetchExpenses = async () => {     
      try { 
        const response = await axios.get(`http://localhost:5000/api/expenses/user/${userId}`, {
          headers: {  
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },  
        });
        setExpenses(response.data);
        setShowExpenseList(true);
      } catch (error) {
        console.error('Error fetching expenses:', error); 
      } 
    };
    fetchExpenses();
  }, [userId]);

  const handleSave = async () => {
    if (formData.amount && formData.category && formData.date) {
      try {
        let response;
        if(formData.id){
          const response = await axios.put(`http://localhost:5000/api/expenses/${formData.id}`, formData,{
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
          });
          const updatedExpense=response.data;
          setExpenses(prev=>prev.map(expense=>expense.id===updatedExpense.id?updatedExpense:expense));
        }
        else{
        const response = await axios.post(`http://localhost:5000/api/expenses/${userId}`, formData,{
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
        const newExpense=response.data;
        setExpenses(prev=>[...prev,newExpense]);} 
        setShowExpenseList(true);
        setShowForm(false);
       
      }catch (error) {
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
        setExpenses((prev) => prev.filter((expense) => expense.id !== id));
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

      const expenseToEdit = response.data;
      setFormData(expenseToEdit);
     // setExpenses((prev) => prev.filter((expense) => expense.id !== id));
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
    setShowExpenseList(true);
    setShowForm(false);
    setFormData({ amount: '', category: '', date: '' });
  };

  const downloadCSV = () => {
    const worksheet = utils.json_to_sheet(expenses);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Expenses');
    writeFile(workbook, 'ExpenseData.xlsx');
  };

  const gradientButtonClass = "flex items-center gap-2 bg-gradient-to-r from-blue-700 to-blue-900 text-white px-4 py-2 rounded shadow-md hover:opacity-90 transition";

  return (
    <div className="p-6 relative">
      {/* Top Buttons */}
      <div className="flex justify-end gap-3 mb-4">
       { !showForm&&<button
          onClick={() => {
            setShowForm(true);
            setShowExpenseList(false);
          }}
          className={gradientButtonClass}
        >
          <PlusCircle size={18} />
          Add Expense
        </button>}
        {showExpenseList && (
          <button
            onClick={downloadCSV}
            className={gradientButtonClass}
          >
            <Download size={18} />
            Download Expense
          </button>
        )}
        {!showExpenseList && showForm && (<button
          onClick={viewExpense}
          className={gradientButtonClass}
        >
          <Eye size={18} />
          View Expense
        </button>)}
      </div>

      {/* Expense Form */}
      {showForm && !showExpenseList && (
        
        <div className="max-w-md mx-auto bg-white mt-10 shadow-lg rounded-lg p-6 space-y-4">    
          <h2 className="text-xl font-bold mb-2 text-center">Add Expense</h2>
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
          <div className="flex gap-4 justify-center mt-4">
            <button
              onClick={handleSave}
              className={gradientButtonClass}
            >
              <PlusCircle size={18} />
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
           
          </div>

          {expenses.length === 0 ? (
            <p className="text-gray-500">No expense records found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-100 text-gray-700">
                  <tr className="text-left text-sm">
                    <th className="px-6 py-3 border-b">Amount</th>
                    <th className="px-6 py-3 border-b">Category</th>
                    <th className="px-6 py-3 border-b">Date</th>
                    <th className="px-6 py-3 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {expenses.map((expense, index) => (
                    <tr key={expense.id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-6 py-3">₹{expense.amount}</td>
                      <td className="px-6 py-3">{expense.category}</td>
                      <td className="px-6 py-3">{expense.date.split('T')[0]}</td>
                      <td className="px-6 py-3 flex gap-4">
                        <button
                          onClick={() => handleEdit(expense.id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 size={18} />
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

      {/* Download Button */}
      
    </div>
  );
};

export default Expense;
