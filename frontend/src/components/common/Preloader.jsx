import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck } from 'lucide-react';

const Preloader = () => {
  const iconVariants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 360],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#00093f] to-[#5177c9] flex flex-col justify-center items-center text-white">
      <motion.div
        variants={iconVariants}
        animate="animate"
        className="mb-6 flex justify-center"
      >
        <ShieldCheck size={100} strokeWidth={1.5} />
      </motion.div>
      <h2 className="text-3xl font-semibold mb-4 text-center">Finance Tracker</h2>
      <div className="flex justify-center gap-4">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            transition: {
              duration: 1,
              repeat: Infinity,
              delay: 0,
            },
          }}
        >
          <Lock size={24} />
        </motion.div>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            transition: {
              duration: 1,
              repeat: Infinity,
              delay: 0.3,
            },
          }}
        >
          <Lock size={24} />
        </motion.div>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            transition: {
              duration: 0.7,
              repeat: Infinity,
              delay: 0.6,
            },
          }}
        >
          <Lock size={24} />
        </motion.div>
      </div>
      <p className="mt-4 text-lg">Initializing...</p>
    </div>
  );
};

export default Preloader;
