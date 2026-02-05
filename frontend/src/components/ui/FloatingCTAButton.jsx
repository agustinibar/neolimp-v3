import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingCTAButton = ({ onClick, label, icon, className, wrapperClassName }) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className={wrapperClassName}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="
              bg-gray-900 text-white text-sm font-medium
              px-4 py-2 rounded-lg shadow-lg
              whitespace-nowrap
            "
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón */}
      <motion.button
        onClick={onClick}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={className}
        aria-label={label}
      >
        {icon}
      </motion.button>
    </div>
  );
};

export default FloatingCTAButton;
