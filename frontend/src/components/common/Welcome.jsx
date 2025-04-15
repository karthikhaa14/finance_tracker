import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Camera, Shield, Search } from 'lucide-react';

const Welcome = () => {
  const iconVariants = {
    hover: { scale: 1.2, rotate: 10 },
    initial: { scale: 1, rotate: 0 },
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#00093f] to-[#5177c9] flex justify-center items-center text-white text-center font-sans">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
        >
          FinanceFlow Tracker
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg md:text-xl mb-10"
        >
         Smart Budgeting and Expense Insights to Help You Take Control of Your Money
        </motion.p>

        <div className="flex justify-center flex-wrap gap-8 mb-12">
          {[
            { Icon: Camera, label: 'High-Resolution Capture' },
            { Icon: Shield, label: 'Real-Time Protection' },
            { Icon: Search, label: 'Intelligent Tracking' },
            { Icon: Lock, label: 'Secure Authentication' },
          ].map(({ Icon, label }) => (
            <motion.div
              key={label}
              variants={iconVariants}
              whileHover="hover"
              initial="initial"
              className="flex flex-col items-center"
            >
              <Icon size={48} strokeWidth={1.5} className="mb-2" />
              <p className="text-sm">{label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          {/* Uncomment below button if needed */}
          {/* <button className="px-6 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-[#1a2980] transition">
            Get Started
          </button> */}
        </motion.div>
      </div>
    </div>
  );
};

export default Welcome;
