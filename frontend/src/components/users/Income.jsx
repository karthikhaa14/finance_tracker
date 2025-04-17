import React, { useState,useEffect } from 'react';
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

const Income = () => {
  const context = useOutletContext();
  const userId = context.userId;

  const [showForm, setShowForm] = useState(false);
  const [incomes, setIncomes] = useState([]);
  const [formData, setFormData] = useState({ amount: '', source: '', date: '' });
  const [showIncomeList, setShowIncomeList] = useState(false);

  useEffect(() => {
    const fetchIncomes = async () => {     
      try { 
        const response = await axios.get(`http://localhost:5000/api/incomes/user/${userId}`, {
          headers: {  
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },  
        });
        setIncomes(response.data);
        setShowIncomeList(true);
      } catch (error) {
        console.error('Error fetching Incomes:', error); 
      } 
    };
    fetchIncomes();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {

    if (formData.amount && formData.source && formData.date) {
      try {
        let response;
        if(formData.id){
  
          const response = await axios.put(`http://localhost:5000/api/incomes/${formData.id}`, formData,{
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
          });
          const updatedIncome=response.data;
          setIncomes(prev=>prev.map(income=>income.id===updatedIncome.id?updatedIncome:income));
        }
        else{
        const response = await axios.post(`http://localhost:5000/api/incomes/${userId}`, formData,{
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
        const newIncome=response.data;
        setIncomes(prev=>[...prev,newIncome]);
      } 
      setShowIncomeList(true);
      setShowForm(false);
     
    }catch (error) {
        console.error('Error saving income data:', error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/incomes/${id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });

      if (response.status === 204) {
        setIncomes((prev) => prev.filter((income) => income.id !== id));
      }
    } catch (error) {
      console.error('Error deleting income:', error);
    }
  };

  const handleEdit = async (id) => {
    console.log(id);
    try {
      const response = await axios.get(`http://localhost:5000/api/incomes/${id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });

      const incomeToEdit = response.data;
      setFormData(incomeToEdit);
      // setIncomes((prev) => prev.filter((income) => income.id !== id));
      setShowForm(true);
      setShowIncomeList(false);
    } catch (error) {
      console.error('Error fetching income to edit:', error);
    }
  };

  const viewIncome = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/incomes/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      setIncomes(response.data);
      setShowIncomeList(true);
      setShowForm(false);
    } catch (error) {
      console.error('Error fetching income list:', error);
    }
  };

  const handleBack = () => {
    setShowIncomeList(true);
    setShowForm(false);
  };

  const downloadCSV = () => {
    const worksheet = utils.json_to_sheet(incomes);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Incomes');
    writeFile(workbook, 'IncomeData.xlsx');
  };

  const gradientButtonClass = "flex items-center gap-2 bg-gradient-to-r from-blue-700 to-blue-900 text-white px-4 py-2 rounded shadow-md hover:opacity-90 transition";

  return (
    <div className="p-6 relative">
      {/* Top Buttons */}
      <div className="flex justify-end gap-3 mb-4">
        {!showForm&&<button
          onClick={() => {
            setShowForm(true);
            setShowIncomeList(false);
          }}
          className={gradientButtonClass}
        >
          <PlusCircle size={18} />
          Add Income
        </button>}
        {!showForm&&(<button
                  onClick={downloadCSV}
                  className={gradientButtonClass}
                >
                  <Download size={18} />
                  Download Income
                </button>)}
        {!showIncomeList&&<button
          onClick={viewIncome}
          className={gradientButtonClass}
        >
          <Eye size={18} />
          View Income
        </button>}
      </div>

      {/* Income Form */}
      {showForm && !showIncomeList && (
        <div className="max-w-md mx-auto bg-white mt-10 shadow-lg rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold mb-2 text-center">Add Income</h2>
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
            name="source"
            placeholder="Source"
            value={formData.source}
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
              Save Income
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

      {/* Income List Table */}
      {showIncomeList && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Income Records</h2>
          </div>

          {incomes.length === 0 ? (
            <p className="text-gray-500">No income records found.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr className="text-left text-sm">
                      <th className="px-4 py-2 border-b">Amount</th>
                      <th className="px-4 py-2 border-b">Source</th>
                      <th className="px-4 py-2 border-b">Date</th>
                      <th className="px-4 py-2 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {incomes.map((income, index) => (
                      <tr key={income.id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-4 py-2">₹{income.amount}</td>
                        <td className="px-4 py-2">{income.source}</td>
                        <td className="px-4 py-2">{income.date.split('T')[0]}</td>
                        <td className="px-4 py-2 flex gap-3">
                          <button
                            onClick={() => handleEdit(income.id)}

                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(income.id)}
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

            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Income;
