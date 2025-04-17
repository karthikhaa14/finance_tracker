import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {Outlet,Link} from 'react-router-dom';
import {
  BookOpen,
  Users,
  Shield,
  MessageCircleQuestion,
  Globe,
  Info,
  LogOut,
  X,
  Menu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Preloader from '../common/Preloader';
import {jwtVerify} from 'jose'


let payloadData;
const MainPagePeople = () => {
  const navigate=useNavigate();
  const [selectedComponent, setSelectedComponent] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [permissions, setPermissions] = useState({
    dash: false,
    inc: false,
    exp: false,
    chat: false
  });
  

  useEffect( () => {
    const fetchPermissions = async () => {
      try {
        const token= sessionStorage.getItem('token');
        const secret = new TextEncoder().encode("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
        const {payload} = await jwtVerify(token, secret)
        payloadData = payload
        if (!token) {
          throw new Error('No authentication token found');
        }
        const response = await axios.get(`http://localhost:5000/api/permissions/${payload.userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPermissions({
          dash: response.data.dashboard_access,
          inc: response.data.income_access,
          exp: response.data.expense_access,
          chat: response.data.chatbot_access
        });
        navigate('/user/dashboard');
      } catch (error) {
        console.error('Error fetching permissions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPermissions();
  }, []);

  if (isLoading) return <Preloader />;

  const handleLogout = () => {
    sessionStorage.removeItem('token'); // Clear the session token
    //onLogout(); // Call the onLogout function passed from the parent
    navigate('/');  // Redirect to the login page
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <div className={`flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-16'} bg-[#1e2125] text-white`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between px-4 py-3 bg-[#2c3034] border-b border-gray-700"
        >
          {isSidebarOpen && <h2 className="text-lg font-semibold">Finance Tracker user view</h2>}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white border border-white/50 p-1 rounded"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </motion.div>

        <div className="flex-1 px-2 py-4 space-y-1">
          <Link to='/user/dashboard'>
          {permissions.dash && <SidebarItem
            icon={<BookOpen size={20} />}
            text="Dashboard"
            active={selectedComponent === 'dashboard'}
            onClick={() => setSelectedComponent('dashboard')}
            isOpen={isSidebarOpen}
          />}</Link>
           <Link to='/user/income'>
          {permissions.inc&& <SidebarItem
            icon={<Users size={20} />}
            text="Income"
            active={selectedComponent === 'income'}
            onClick={() => setSelectedComponent('income')}
            isOpen={isSidebarOpen}
          />}</Link>
          <Link to ='/user/expense'>
          {permissions.exp&&<SidebarItem
            icon={<Shield size={20} />}
            text="Expense"
            active={selectedComponent === 'expense'}
            onClick={() => setSelectedComponent('expense')}
            isOpen={isSidebarOpen}
          />}</Link>
          <Link to ='/user/chatbot'>
          {permissions.chat&&<SidebarItem
            icon={<MessageCircleQuestion size={20} />}
            text="Chatbot"
            active={selectedComponent === 'chatbot'}
            onClick={() => setSelectedComponent('chatbot')}
            isOpen={isSidebarOpen}
          />}</Link>
          <Link to ='/user/chatrequest'>
          {!permissions.chat &&<SidebarItem
            icon={<MessageCircleQuestion size={20} />}
            text="Request for Chatbot"
            active={selectedComponent === 'request'}
            onClick={() => setSelectedComponent('request')}
            isOpen={isSidebarOpen}
          />}</Link>
        </div>

        <div className="px-2 pb-4">
          <SidebarItem
            icon={<LogOut size={20} />}
            text="Logout"
            onClick={handleLogout}
            isOpen={isSidebarOpen}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto bg-[#f4f6f9] p-6 transition-all duration-300 ease-in-out">
        
        <Outlet context={{ userId: payloadData?.userId }}/>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, text, active, onClick, isOpen }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-2 cursor-pointer rounded px-3 py-2 transition-all duration-200 
      ${active ? 'bg-gradient-to-r from-blue-700 to-blue-900 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}
    `}
  >
    {React.cloneElement(icon, {
      className: active ? 'text-white' : 'text-gray-400',
    })}
    {isOpen && <span className="text-sm">{text}</span>}
  </div>
);

export default MainPagePeople;
