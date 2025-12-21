import React from 'react';
import ReactDOM from 'react-dom';
import { motion as m, AnimatePresence } from 'framer-motion';
import { FaTimes, FaArrowLeft } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';

const AuthModal = ({ isOpen, onClose }) => {
  const history = useHistory();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    history.push('/login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignup = () => {
    onClose();
    history.push('/signup');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <m.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-[#050505] border border-white/10 w-full max-w-md p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center overflow-hidden"
          >
             {/* Back Arrow (Visual) */}
             <div className="absolute top-6 left-6 text-gray-400 hover:text-white cursor-pointer transition-colors" onClick={onClose}>
                <FaArrowLeft size={18} />
             </div>

            <h2 className="text-2xl font-bold text-white mb-2 mt-4">Sign In Required</h2>
            <p className="text-gray-400 text-sm mb-8 px-4">
              Please sign in or create an account to access this feature.
            </p>

            <div className="flex gap-4 w-full">
              <button
                onClick={handleLogin}
                className="flex-1 py-3 px-4 rounded-xl border border-white/20 text-white font-medium hover:bg-white/5 transition-all"
              >
                Login
              </button>
              <button
                onClick={handleSignup}
                className="flex-1 py-3 px-4 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 transition-all shadow-[0_0_15px_rgba(234,88,12,0.3)]"
              >
                Sign Up
              </button>
            </div>

            <button
              onClick={onClose}
              className="mt-6 text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Cancel
            </button>
          </m.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default AuthModal;
