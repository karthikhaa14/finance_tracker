import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

import UserManagement from './UserManagement'
import Requestscomponent from './Requestscomponent'
import UsersList from './UsersList';
import Preloader from '../common/Preloader';

const MainpageAdmin = ({ onLogout }) => {
    const [selectedComponent, setSelectedComponent] = useState('user management');
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 5000);
      return () => clearTimeout(timer);
    }, []);
  
    if (isLoading) return <Preloader />;
  
    const renderComponent = () => {
      switch (selectedComponent) {
        case 'user management': return <UserManagement/>;
        case 'users list': return <UsersList/>;
        case 'request':return <Requestscomponent />
        default: return <Dashboard />;
      }
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
            {isSidebarOpen && <h2 className="text-lg font-semibold">Finance Tracker Admin view</h2>}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-white border border-white/50 p-1 rounded"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </motion.div>
  
          <div className="flex-1 px-2 py-4 space-y-1">
            
            <SidebarItem
              icon={<Users size={20} />}
              text="User Management"
              active={selectedComponent === 'user management'}
              onClick={() => setSelectedComponent('user management')}
              isOpen={isSidebarOpen}
            />
            <SidebarItem
              icon={<Users size={20} />}
              text="Users"
              active={selectedComponent === 'users list'}
              onClick={() => setSelectedComponent('users list')}
              isOpen={isSidebarOpen}
            />
            <SidebarItem
              icon={<Shield size={20} />}
              text="Requests"
              active={selectedComponent === 'request'}
              onClick={() => setSelectedComponent('request')}
              isOpen={isSidebarOpen}
            />
          </div>
  
          <div className="px-2 pb-4">
            <SidebarItem
              icon={<LogOut size={20} />}
              text="Logout"
              onClick={onLogout}
              isOpen={isSidebarOpen}
            />
          </div>
        </div>
  
        {/* Main content */}
        <div className="flex-1 overflow-y-auto bg-[#f4f6f9] p-6 transition-all duration-300 ease-in-out">
          {renderComponent()}
        </div>
      </div>
    );
  };
  
  const SidebarItem = ({ icon, text, active, onClick, isOpen }) => (
    <div
      onClick={onClick}
      className={`flex items-center gap-2 cursor-pointer rounded px-3 py-2 transition-all duration-200 
        ${active ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}
      `}
    >
      {React.cloneElement(icon, {
        className: active ? 'text-white' : 'text-gray-400',
      })}
      {isOpen && <span className="text-sm">{text}</span>}
    </div>
  );
  

export default MainpageAdmin