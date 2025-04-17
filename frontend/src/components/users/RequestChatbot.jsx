import React, { useState } from 'react';
import axios from 'axios';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
const RequestChatbot = () => {
  const context = useOutletContext();
  const userId = context.userId;
  console.log(userId)
  const [requestStatus, setRequestStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [buttondisabled,setButtonDisabled] = useState(false);

  const handleRequestChatbot = async () => {
   
    try {
      const response = await axios.post(`http://localhost:5000/api/requests/`, {
        user_id: userId,
        request_type: 'chatbot_access', headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      setRequestStatus('Your request has been submitted successfully.');
      setButtonDisabled(true);
      setErrorMessage('');
      if(response.requestStatus=='Rejected'){
        setButtonDisabled(false);
      }
    } catch (error) {
      console.error('Error requesting chatbot access:', error);
      setRequestStatus(null);
      setErrorMessage('Failed to send the request. Please try again later.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Request Chatbot Access</h2>
      <p className="text-gray-600 mb-6 leading-relaxed">
        Request access to our intelligent chatbot assistant. It helps you upload and manage income/expense data efficiently, and answers questions like:
        <ul className="list-disc list-inside mt-2 ml-3 text-gray-500">
          <li>“What is my total income this month?”</li>
          <li>“What are my major expenses this week?”</li>
        </ul>
      </p>

      <button
        onClick={handleRequestChatbot}
        disabled={buttondisabled}
        className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold px-5 py-3 rounded-xl shadow-md"
      >
         Request Access
      </button>

      {requestStatus && (
        <div className="mt-6 flex items-center gap-2 text-green-700 bg-green-100 border border-green-300 rounded-lg p-4">
          <CheckCircle className="w-5 h-5" />
          <span>{requestStatus}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mt-6 flex items-center gap-2 text-red-700 bg-red-100 border border-red-300 rounded-lg p-4">
          <AlertCircle className="w-5 h-5" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

export default RequestChatbot;
