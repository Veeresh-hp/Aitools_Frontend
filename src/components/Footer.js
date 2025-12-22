import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import {
  FaLinkedin, FaGithub, FaYoutube, FaTwitter, FaDiscord,
  FaEnvelope, FaHeart, FaArrowUp, FaShieldAlt,
  FaArrowRight,
  FaCheck,
  FaInstagram, FaFacebook, FaPinterest,
  FaGlobe, FaChevronRight
} from 'react-icons/fa';
import { motion as m, AnimatePresence } from 'framer-motion';
import Logo from '../assets/logo.png';
import SubscriptionSuccess from './SubscriptionSuccess';

import AuthModal from './AuthModal';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const { language, setLanguage, t } = useLanguage();
  const history = useHistory();
  const location = useLocation();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
  }, []);

  // Pages where footer should be hidden
  const hiddenPages = ['/signup', '/login', '/history', '/sign-up', '/log-in'];
  const shouldHideFooter = hiddenPages.some(page =>
    location.pathname === page || location.pathname.startsWith(page + '/')
  );

  if (shouldHideFooter) return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigation handler for restricted links
  const handleRestrictedLink = (path) => {
    const token = localStorage.getItem('token');
    if (token) {
      history.push(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowAuthModal(true);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setStatus({ state: 'idle', message: '' });
    const trimmed = email.trim();
    if (!trimmed) {
      setStatus({ state: 'error', message: 'Email is required' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setStatus({ state: 'error', message: 'Invalid email address' });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed })
      });
      const json = await res.json();
      if (res.ok) {
        setStatus({ state: 'success', message: 'Subscribed successfully' });
        setEmail('');
      } else {
        setStatus({ state: 'error', message: json.error || 'Failed to subscribe' });
      }
    } catch (err) {
      setStatus({ state: 'error', message: 'Connection error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="relative bg-[#050505] text-white pt-20 pb-10 overflow-hidden font-sans border-t border-white/5">
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      
      {/* --- CTA Section --- */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 mb-24">
        <div className="relative rounded-[2.5rem] bg-[#0A0A0A] border border-white/10 overflow-hidden p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 group">
             {/* Background Gradients/Glows */}
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/10 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none transition-opacity duration-700 group-hover:opacity-100 opacity-60" />
            
            <div className="relative z-10 max-w-xl text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 mb-6 tracking-tight">
                    {t('footer_ready_title')}
                </h2>
                <p className="text-gray-400 text-lg mb-8 font-light">
                    {t('footer_ready_desc')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <Link 
                        to={isLoggedIn ? "/upgrade" : "/signup"} 
                        onClick={scrollToTop}
                        className="px-8 py-3.5 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    >
                        {isLoggedIn ? t('footer_upgrade') : t('footer_start_trial')} <FaArrowRight className="inline ml-2 text-sm" />
                    </Link>
                    <Link to="/contact" className="px-8 py-3.5 rounded-full bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all backdrop-blur-md">
                        {t('footer_contact_sales')}
                    </Link>
                </div>
                 <div className="mt-8 flex items-center justify-center md:justify-start gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-2"><FaCheck className="text-orange-500" /> {t('footer_no_setup')}</span>
                    <span className="flex items-center gap-2"><FaCheck className="text-orange-500" /> {t('footer_cancel_anytime')}</span>
                </div>
            </div>

            {/* Visual element (Abstract Circles) */}
            {/* Visual element (Social Orbit) */}
            <div className="relative w-72 h-72 md:w-96 md:h-96 flex-shrink-0 opacity-90 md:opacity-100 flex items-center justify-center">
                 {/* Center Glow */}
                 <div className="absolute inset-0 bg-orange-500/20 blur-[80px] rounded-full" />
                 
                 {/* Center Logo */}
                 <div className="relative z-20 w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(249,115,22,0.4)] border-4 border-[#0A0A0A]">
                    <img src={Logo} alt="Logo" className="w-12 h-12 object-contain brightness-0 invert" />
                 </div>

                 {/* Ring 1 (Inner) */}
                 <div className="absolute w-[60%] h-[60%] border border-white/5 rounded-full flex items-center justify-center animate-spin-slow-reverse">
                     {/* Icon: Twitter/X */}
                     <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-[#0A0A0A] border border-white/10 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <FaTwitter />
                     </div>
                 </div>

                 {/* Ring 2 (Middle) */}
                 <div className="absolute w-[80%] h-[80%] border border-white/5 rounded-full flex items-center justify-center animate-spin-slow">
                     {/* Icon: LinkedIn */}
                     <div className="absolute top-1/2 -right-5 -translate-y-1/2 w-12 h-12 bg-[#0077b5]/20 backdrop-blur-md border border-[#0077b5]/30 rounded-2xl flex items-center justify-center text-[#0077b5] shadow-lg">
                        <FaLinkedin size={20} />
                     </div>
                      {/* Icon: Discord */}
                     <div className="absolute top-1/2 -left-5 -translate-y-1/2 w-12 h-12 bg-[#5865F2]/20 backdrop-blur-md border border-[#5865F2]/30 rounded-2xl flex items-center justify-center text-[#5865F2] shadow-lg">
                        <FaDiscord size={20} />
                     </div>
                 </div>

                 {/* Ring 3 (Outer) */}
                 <div className="absolute w-full h-full border border-white/5 rounded-full animate-spin-slower">
                      {/* Icon: Instagram */}
                     <div className="absolute top-0 right-[20%] w-14 h-14 bg-pink-600/20 backdrop-blur-md border border-pink-500/30 rounded-2xl flex items-center justify-center text-pink-500 shadow-xl">
                        <FaInstagram size={24} />
                     </div>
                      {/* Icon: Facebook */}
                     <div className="absolute bottom-[20%] left-0 w-14 h-14 bg-blue-600/20 backdrop-blur-md border border-blue-500/30 rounded-2xl flex items-center justify-center text-blue-500 shadow-xl">
                        <FaFacebook size={24} />
                     </div>
                      {/* Icon: Pinterest */}
                     <div className="absolute bottom-0 right-[30%] w-12 h-12 bg-red-600/20 backdrop-blur-md border border-red-500/30 rounded-2xl flex items-center justify-center text-red-500 shadow-xl">
                        <FaPinterest size={20} />
                     </div>
                 </div>
            </div>
        </div>
      </div>


      {/* --- Main Footer Grid --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20 border-b border-white/5 pb-16">
        
        {/* Brand Column */}
        <div className="lg:col-span-4 space-y-6">
            <Link to="/" onClick={scrollToTop} className="flex items-center gap-3 group">
                <img src={Logo} alt="AI Tools Hub" className="w-10 h-10 rounded-lg" />
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                    AI Tools Hub
                </span>
            </Link>
            <p className="text-gray-400 leading-relaxed max-w-sm">
                Your all-in-one platform to discover, compare, and leverage the power of AI tools. 
                Streamline your workflow today.
            </p>
            <div className="flex gap-4">
                {[
                    { Icon: FaDiscord, href: '#' },
                    { Icon: FaTwitter, href: '#' },
                    { Icon: FaGithub, href: 'https://github.com/Veeresh-hp' },
                    { Icon: FaLinkedin, href: 'https://www.linkedin.com/in/veereshhp/' },
                    { Icon: FaYoutube, href: 'https://youtube.com/@veerthinks' },
                ].map(({ Icon, href }, i) => (
                    <a key={i} href={href} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-orange-400 transition-colors border border-white/5">
                        <Icon size={18} />
                    </a>
                ))}
            </div>

            {/* Language Selector */}
            <div className="pt-2 relative">
                <button 
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-gray-400 text-sm hover:text-white hover:border-white/30 hover:bg-white/10 transition-all group"
                >
                    <FaGlobe className="text-lg" />
                    <span className="font-medium">{language}</span>
                    <FaChevronRight className={`text-xs ml-1 opacity-50 group-hover:opacity-100 transition-transform duration-300 ${showLangMenu ? 'rotate-90' : ''}`} />
                </button>

                <AnimatePresence>
                  {showLangMenu && (
                    <m.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full left-0 mb-2 w-40 bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-xl z-50"
                    >
                      {['English', 'Hindi', 'Kannada'].map((lang) => (
                        <button
                          key={lang}
                          onClick={() => {
                            setLanguage(lang);
                            setShowLangMenu(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors ${language === lang ? 'text-[#FF4D00]' : 'text-gray-400'}`}
                        >
                          {lang}
                        </button>
                      ))}
                    </m.div>
                  )}
                </AnimatePresence>
            </div>
        </div>

        {/* Links Columns */}
        <div className="lg:col-span-2 space-y-6">
            <h4 className="text-white font-semibold">{t('footer_product')}</h4>
            <ul className="space-y-3 text-gray-500 text-sm">
                <li><Link to="/blog" onClick={scrollToTop} className="hover:text-orange-400 transition-colors">{t('nav_blog')}</Link></li>
                <li>
                    <button onClick={() => handleRestrictedLink('/upgrade')} className="hover:text-orange-400 transition-colors text-left w-full">{t('footer_pricing')}</button>
                </li>
                <li><Link to="/showcase" onClick={scrollToTop} className="hover:text-orange-400 transition-colors">{t('footer_showcase')}</Link></li>
                <li><Link to="/add-tool" onClick={scrollToTop} className="hover:text-orange-400 transition-colors">{t('nav_submit')}</Link></li>
                <li>
                    <button onClick={() => handleRestrictedLink('/favorites')} className="hover:text-orange-400 transition-colors text-left w-full">{t('nav_favorites')}</button>
                </li>
                <li>
                    <button onClick={() => handleRestrictedLink('/history')} className="hover:text-orange-400 transition-colors text-left w-full">{t('footer_history')}</button>
                </li>
            </ul>
        </div>

         <div className="lg:col-span-2 space-y-6">
            <h4 className="text-white font-semibold">{t('footer_support')}</h4>
             <ul className="space-y-3 text-gray-500 text-sm">
                <li><Link to="/about" onClick={scrollToTop} className="hover:text-orange-400 transition-colors">{t('nav_about')}</Link></li>
                <li><Link to="/help" onClick={scrollToTop} className="hover:text-orange-400 transition-colors">{t('footer_help')}</Link></li>
                <li><Link to="/contact" onClick={scrollToTop} className="hover:text-orange-400 transition-colors">{t('nav_contact')}</Link></li>
                <li><Link to="/terms" onClick={scrollToTop} className="hover:text-orange-400 transition-colors">{t('footer_terms')}</Link></li>
                <li><Link to="/privacy" onClick={scrollToTop} className="hover:text-orange-400 transition-colors">{t('footer_privacy')}</Link></li>
            </ul>
        </div>

        {/* Newsletter Column */}
        <div className="lg:col-span-4 space-y-6">
             <h4 className="text-white font-semibold">{t('footer_get_updates')}</h4>
             <p className="text-gray-500 text-sm">
                {t('footer_updates_desc')}
            </p>
             <form onSubmit={handleSubscribe} className="relative">
                <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1 focus-within:border-orange-500/50 focus-within:ring-1 focus-within:ring-orange-500/50 transition-all shadow-lg shadow-black/20">
                    <FaEnvelope className="ml-4 text-gray-500 flex-shrink-0" />
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('footer_enter_email')}
                        className="bg-transparent !bg-transparent border-none !border-none outline-none focus:ring-0 focus:outline-none text-sm text-white w-full px-4 py-3 placeholder-gray-500 appearance-none"
                    />
                    <button 
                        type="submit" 
                        disabled={isSubmitting || status.state === 'success'}
                        className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 flex-shrink-0"
                    >
                        {isSubmitting ? '...' : (status.state === 'success' ? <FaCheck /> : t('footer_subscribe'))}
                    </button>
                </div>
                 {/* Status Message */}
                 <AnimatePresence>
                    {status.message && (
                        <m.p 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`text-xs mt-2 ml-4 ${status.state === 'error' ? 'text-red-400' : 'text-green-400'}`}
                        >
                            {status.message}
                        </m.p>
                    )}
                </AnimatePresence>
             </form>
        </div>

      </div>


      {/* --- Bottom Bar --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-600 gap-4">
        <p>© {new Date().getFullYear()} AI Tools Hub. All rights reserved.</p>
        <div className="flex items-center gap-6">
            <Link to="/privacy" onClick={scrollToTop} className="hover:text-gray-400 transition-colors">{t('footer_privacy')}</Link>
            <Link to="/terms" onClick={scrollToTop} className="hover:text-gray-400 transition-colors">{t('footer_terms')}</Link>
             <button
                onClick={scrollToTop}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors"
             >
                <FaArrowUp />
             </button>
        </div>
      </div>


      {/* --- Giant Background Text --- */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none select-none z-0 overflow-hidden w-full flex justify-center">
        <h1 className="text-[12vw] font-bold leading-none text-white/[0.02] whitespace-nowrap tracking-tighter">
            AI Tools Hub
        </h1>
      </div>

    </footer>
  );
};

export default Footer;