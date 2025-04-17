import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import Preloader from './Preloader';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const ADMIN_CREDENTIALS = [
  { username: 'admin', password: 'admin123' },
];

const Login = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate(); 
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
      navigate('/admin'); // 👈 navigate to admin page
    } else {
      setError('Invalid Credentials');
    }
  };

  const handleUserLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", { username, password });
      if (response.data.token) {
        sessionStorage.setItem("token", response.data.token);
      }
      navigate('/user'); // 
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      setError('Invalid Credentials');
    }
  };

  if (isLoading) {
    return <Preloader />;
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
          <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
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

        {(userType === 'admin' || userType === 'people') && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={e => {
              e.preventDefault();
              userType === 'admin' ? handleAdminLogin() : handleUserLogin();
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
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-600 text-white text-sm rounded px-4 py-2">
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
