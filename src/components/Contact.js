import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { motion as m } from 'framer-motion';
import videoSource from '../assets/Video_Editing_Request_and_Completion.mp4';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '', interest: 'General Inquiry' });
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
      const apiUrl = (process.env.REACT_APP_API_URL?.trim() || 'http://localhost:5000') + '/api/contact';
      
      const res = await axios.post(apiUrl, form, {
        headers: { 'Content-Type': 'application/json' }
      });

      toast.success(res.data.message || 'Message sent successfully!');
      setForm({ name: '', email: '', message: '', interest: 'Explaining a Project' });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Server error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col lg:block font-serif [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
      
      {/* LEFT SIDE - Video Visual */}
      <div className="lg:fixed lg:top-0 lg:left-0 lg:w-1/2 h-[40vh] lg:h-screen bg-black relative flex items-center justify-center overflow-hidden z-0">
         {/* Video Background */}
         <video 
            src={videoSource} 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-80"
         />
         
         {/* Gradient Overlay for Text Readability */}
         <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
         
         {/* Overlay Text */}
         <m.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="relative z-10 text-center px-6"
         >
             <h2 className="text-4xl md:text-5xl font-light tracking-tighter text-white drop-shadow-2xl">
                 Empowering <span className="font-serif italic text-white/80">Your</span> <br/>
                 AI Journey
             </h2>
         </m.div>
      </div>

      {/* RIGHT SIDE - Content & Form */}
      {/* RIGHT SIDE - Content & Form - Scrollable via Window */}
      <div className="lg:ml-[50%] lg:w-1/2 min-h-screen bg-[#050505] flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-16 lg:py-12 relative z-10 border-l border-white/5">
        
        {/* Navigation Links */}
        <div className="absolute top-8 right-8 lg:right-12 flex gap-6 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-sans">
            <span className="hover:text-white cursor-pointer transition-all duration-300 hover:tracking-[0.3em]">Vision</span>
            <span className="hover:text-white cursor-pointer transition-all duration-300 hover:tracking-[0.3em]">Story</span>
            <span className="hover:text-white cursor-pointer transition-all duration-300 hover:tracking-[0.3em]">Contact</span>
        </div>

        <m.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-xl w-full"
        >
            <span className="block text-[#FF4D00] text-[10px] font-sans font-bold tracking-[0.3em] uppercase mb-6">
                Let's Work Together
            </span>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl leading-[1.1] mb-12 font-serif font-light text-white/90">
                Got <br/>
                <span className="italic">Questions?</span> <br/>
                Let's <br/>
                <span className="font-normal text-white">Connect</span>
            </h1>

            {/* Minimalist Form */}
            <form onSubmit={handleSubmit} className="space-y-8 font-sans w-full">
                <div className="group">
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-[#FF4D00] transition-colors duration-300">Name*</label>
                    <input 
                        type="text" 
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent border-b border-white/10 py-2 text-white outline-none focus:border-white focus:bg-white/5 hover:border-white/30 transition-all duration-300 text-sm placeholder-white/20" 
                    />
                </div>

                <div className="group">
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-[#FF4D00] transition-colors duration-300">Email Address*</label>
                    <input 
                        type="email" 
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent border-b border-white/10 py-2 text-white outline-none focus:border-white focus:bg-white/5 hover:border-white/30 transition-all duration-300 text-sm placeholder-white/20" 
                    />
                </div>

                <div className="group">
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-[#FF4D00] transition-colors duration-300">I'm interested in*</label>
                    <select 
                        name="interest"
                        value={form.interest}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-white/10 py-2 text-white/70 outline-none focus:border-white focus:bg-white/5 hover:border-white/30 transition-all duration-300 text-sm appearance-none cursor-pointer"
                    >
                        <option className="bg-[#111] text-white">General Inquiry</option>
                        <option className="bg-[#111] text-white">Submit a Tool</option>
                        <option className="bg-[#111] text-white">Report an Issue</option>
                        <option className="bg-[#111] text-white">Advertising / Partnership</option>
                    </select>
                </div>

                 <div className="group">
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-[#FF4D00] transition-colors duration-300">Message*</label>
                    <textarea 
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={1}
                        className="w-full bg-transparent border-b border-white/10 py-2 text-white outline-none focus:border-white focus:bg-white/5 hover:border-white/30 transition-all duration-300 text-sm placeholder-white/20 resize-none overflow-hidden" 
                        placeholder="How can we help you?" 
                        onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                    />
                </div>

                <div className="pt-4">
                     <button 
                        type="submit"
                        disabled={isLoading}
                        className="text-xs uppercase tracking-[0.2em] border border-white/20 px-10 py-4 hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        {isLoading ? 'Sending...' : 'Send Message'}
                     </button>
                </div>
            </form>
        </m.div>

        {/* Footer info */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between text-[10px] text-gray-600 font-sans tracking-wider uppercase gap-4">
             <span>© 2024 AI Tools Hub</span>
             <span className="hidden sm:block">Designed by Veeresh H P</span>
        </div>

      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          background: 'rgba(5, 5, 5, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'white',
          fontFamily: 'sans-serif'
        }}
      />
    </div>
  );
};

export default Contact;