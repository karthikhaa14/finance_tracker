import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { Send, Upload, User, Bot } from 'lucide-react';
 
const Chatbot = () => {
  const [excelData, setExcelData] = useState([]);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
 
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
 
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(json);
      alert('Excel file uploaded successfully!');
    };
    reader.readAsArrayBuffer(file);
  };
 
  const askGemini = async () => {
    if (!query.trim()) return;
 
    const userMessage = { text: query, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setQuery('');
 
    try {
      const res = await axios.post('http://localhost:5000/api/bot/ask', {
        query,
        data: excelData},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          }
        }
      );
      const botMessage = { text: res.data.answer, sender: 'bot' };
      //console.log(botMessage)
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      const errorMessage = {
        text: 'Something went wrong. Please try again.',
        sender: 'bot',
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };
 
  useEffect(() => {
    const chatArea = document.getElementById('chat-area');
    if (chatArea) {
      chatArea.scrollTop = chatArea.scrollHeight;
    }
  }, [messages]);
 
  return (
    <div className="h-screen w-full bg-[#fafbfc] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 text-lg font-semibold shadow-sm sticky top-0 z-10">
       Ask Chatbot
      </div>
 
      {/* Chat Area */}
      <div
        id="chat-area"
        className="flex-1 overflow-y-auto px-6 py-4 space-y-4 max-w-3xl mx-auto w-full"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex items-start max-w-lg">
              {msg.sender === 'bot' ? (
                <Bot className="text-gray-500 mt-1 mr-2 w-5 h-5" />
              ) : (
                <User className="text-gray-700 mt-1 mr-2 w-5 h-5" />
              )}
              <div
                className={`px-4 py-3 rounded-xl text-sm ${
                  msg.sender === 'user'
                    ? 'bg-gray-800 text-white'
                    : 'bg-[#f1f1f1] text-gray-800 border border-[#e4e6eb]'
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}
      </div>
 
      {/* Input Area */}
      <div className="bg-white border-t px-6 py-3 sticky bottom-0 z-10">
        <div className="flex items-center gap-3 max-w-3xl mx-auto w-full">
          <label className="cursor-pointer text-gray-600 hover:text-gray-800 transition-all">
            <Upload size={20} />
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Send a message..."
            className="flex-1 px-4 py-2 rounded-full border border-[#e4e6eb] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] text-sm"
          />
          <button
            onClick={askGemini}
            className="bg-gray-800  text-white p-2 rounded-full transition-all"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
 
export default Chatbot;