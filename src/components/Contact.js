import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const launchConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      setShowSuccess(false);

      const apiUrl =
        (process.env.REACT_APP_API_URL?.trim() || 'http://localhost:5000') + '/api/contact';

      const res = await axios.post(apiUrl, form, {
        headers: { 'Content-Type': 'application/json' }
      });

      toast.success(res.data.message || 'Message sent!');
      setForm({ name: '', email: '', message: '' });
      setShowSuccess(true);
      launchConfetti();
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Server error');
    } finally {
      setIsLoading(false);
    }
  };

  const particlesInit = async (main) => {
    await loadSlim(main);
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-pink-100 via-blue-100 to-emerald-100 dark:from-gray-800 dark:via-gray-900 dark:to-black">
      {/* Background Particles */}
      <Particles
        id="tsparticles-contact"
        init={particlesInit}
        className="absolute inset-0 z-0"
        options={{
          background: { color: { value: 'transparent' } },
          fpsLimit: 60,
          particles: {
            number: { value: 30, density: { enable: true, area: 800 } },
            color: { value: ['#ec4899', '#3b82f6', '#10b981'] },
            shape: { type: 'circle' },
            opacity: { value: 0.2 },
            size: {
              value: { min: 20, max: 40 },
              animation: { enable: true, speed: 2, minimumValue: 10 },
            },
            move: {
              enable: true,
              speed: 1,
              random: true,
              direction: 'none',
              outModes: { default: 'bounce' },
            },
          },
          detectRetina: true,
        }}
      />

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-16 py-14 max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Contact Us 📬
        </h1>

        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Got a question or idea? Let’s talk!
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            {['name', 'email', 'message'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {field}
                </label>
                {isLoading ? (
                  <div className="h-10 rounded-md shimmer bg-gray-200 dark:bg-gray-700 w-full mt-1" />
                ) : field === 'message' ? (
                  <textarea
                    name="message"
                    rows="4"
                    value={form.message}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm p-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Your message..."
                    required
                  />
                ) : (
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm p-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder={`Your ${field}`}
                    required
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isLoading ? (
                <i className="fas fa-spinner fa-spin" />
              ) : showSuccess ? (
                <i className="fas fa-paper-plane animate-float" />
              ) : (
                <i className="fas fa-envelope" />
              )}
              {isLoading ? 'Sending...' : showSuccess ? 'Sent!' : 'Send Message'}
            </button>
          </form>

          {/* Social Links */}
          <div className="mt-8">
            <h3 className="text-gray-700 dark:text-gray-300 mb-2 font-semibold">Follow us:</h3>
            <ul className="flex gap-4">
              <li>
                <a
                  href="#"
                  className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1"
                >
                  <i className="fab fa-twitter" /> Twitter
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-800 dark:text-white hover:text-black text-sm flex items-center gap-1"
                >
                  <i className="fab fa-github" /> GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
      </motion.section>
    </div>
  );
};

export default Contact;
