import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);

     const apiUrl =
  (process.env.REACT_APP_API_URL?.trim() || 'http://localhost:5000') +
  '/api/contact';


      console.log('📬 Sending to:', apiUrl); // Debug log

      const res = await axios.post(apiUrl, form, {
        headers: { 'Content-Type': 'application/json' }
      });

      toast.success(res.data.message || 'Message sent!');
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('❌ API Error:', error); // Debug log
      toast.error(
        error.response?.data?.error ||
          error.message ||
          'Server error. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="px-4 sm:px-6 md:px-12 lg:px-16 py-14 max-w-4xl mx-auto"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Contact Us 📬
      </h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Got a question, suggestion, or just wanna chat about AI? We’re all
          ears... or rather, all pixels! 😎
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Drop us a line at{' '}
          <a
            href="mailto:aitoolshub2@gmail.com"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            support@aitoolshub.com
          </a>{' '}
          and we’ll get back to you faster than an AI can generate a meme! 🚀
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Your Name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="4"
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Your message..."
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        {/* Social Links */}
        <div className="mt-8">
          <h3 className="text-gray-700 dark:text-gray-300 mb-2 font-semibold">
            Follow us:
          </h3>
          <ul className="flex gap-4">
            <li>
              <a
                href="#"
                className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1"
              >
                <i className="fab fa-twitter"></i> Twitter
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-800 dark:text-white hover:text-black text-sm flex items-center gap-1"
              >
                <i className="fab fa-github"></i> GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
    </motion.section>
  );
};

export default Contact;
