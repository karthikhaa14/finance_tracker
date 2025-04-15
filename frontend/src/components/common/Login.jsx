import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import Mainpage from '../users/Mainpage'
import MainpageAdmin from '../admin/MainpageAdmin';
import Preloader from './Preloader';
import axios from 'axios';

const ADMIN_CREDENTIALS = [
  { username: 'admin', password: 'admin123' },
];

const Login = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleAdminLogin = () => {
    const validUser = ADMIN_CREDENTIALS.find(
      cred => cred.username === username && cred.password === password
    );
    if (validUser) {
      setIsLoggedIn(true);
      setUserType('admin');
    } else {
      setError('Invalid Credentials');
    }
  };

  const handleUserLogin= async() => {
    try {
      console.log({username,password})
      const response = await axios.post("http://localhost:5000/api/auth/login", { username, password });
      console.log("Login Success");
      if (response.data.token) {
        sessionStorage.setItem("token", response.data.token);
        // localStorage.setItem("userId",response.data.user_id);
      }  
      setIsLoggedIn(true);
      setUserType('people');
    }
    catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setUsername('');
    setPassword('');
    setError('');
  };

  if (isLoading) {
    return <Preloader />;
  }
  

  if (isLoggedIn) {
    return userType === 'admin' ? (
      <MainpageAdmin onLogout={handleLogout} />
    ) : (
      <Mainpage onLogout={handleLogout} />
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-[#00093f] to-[#5177c9] flex items-center justify-center">
      <motion.div
        className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-lg shadow-xl p-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-4">
          <ShieldCheck size={48} className="mx-auto mb-2 text-white" />
          <h2 className="text-2xl font-bold">Login here!</h2>
        </div>

        {!userType && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="mb-4 text-white text-lg">Select User Type</h4>
            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={() => setUserType('admin')}
              >
                Admin Login
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                onClick={() => setUserType('people')}
              >
                User Login
              </motion.button>
            </div>
          </motion.div>
        )}

        {userType === 'admin' && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={e => {
              e.preventDefault();
              handleAdminLogin();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block mb-1 text-white font-semibold">
                <User size={18} className="inline mr-2" />
                Username
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-white font-semibold">
                <Lock size={18} className="inline mr-2" />
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-3 py-2 rounded bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-600 text-white text-sm rounded px-4 py-2"
              >
                {error}
              </motion.div>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
            >
              Login
            </motion.button>
          </motion.form>
        )}

        {userType === 'people' && (
          <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={e => {
            e.preventDefault();
            handleUserLogin();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block mb-1 text-white font-semibold">
              <User size={18} className="inline mr-2" />
              Username
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-white font-semibold">
              <Lock size={18} className="inline mr-2" />
              Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-3 py-2 rounded bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-2 text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-600 text-white text-sm rounded px-4 py-2"
            >
              {error}
            </motion.div>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            Login
          </motion.button>
        </motion.form>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
