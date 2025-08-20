import React, { useState, useRef } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import {
  FaTwitter, FaLinkedin, FaGithub, FaDiscord, FaYoutube, FaTelegram, FaInstagram,
  FaEnvelope, FaHeart, FaArrowUp, FaTools, FaUsers, FaCode, FaLightbulb, FaShieldAlt,
  FaGlobe, FaBook, FaNewspaper, FaSpinner, FaChevronDown, FaChevronUp, FaRocket,
  FaStar, FaFire, FaChartLine
} from 'react-icons/fa';
import { motion as m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import Logo from '../assets/logo.png';
import toolsData from '../data/toolsData';

const Footer = () => {
  const [expandedSections, setExpandedSections] = useState({});
  const history = useHistory();
  const location = useLocation();

  // Pages where footer should be hidden
  const hiddenPages = ['/signup', '/login', '/history', '/sign-up', '/log-in'];
  
  const shouldHideFooter = hiddenPages.some(page => 
    location.pathname === page || location.pathname.startsWith(page + '/')
  );

  if (shouldHideFooter) {
    return null;
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const aiToolLinks = toolsData.slice(0, 6).map(category => ({
    name: category.name,
    href: `#${category.id}`
  }));

  const footerLinks = {
    'AI Tools': aiToolLinks,
    'Company': [
      { name: 'About Us', href: '/about', icon: FaGlobe },
      { name: 'Contact', href: '/contact', icon: FaEnvelope },
      { name: 'Blog', href: '/blog', icon: FaNewspaper },
    ],
    'Legal': [
      { name: 'Privacy Policy', href: '/privacy', icon: FaShieldAlt },
      { name: 'Terms of Service', href: '/terms', icon: FaBook },
    ]
  };

  const socialLinks = [
    { icon: FaTwitter, label: 'Twitter', color: 'hover:text-blue-400', bgColor: 'hover:bg-blue-400/20' },
    { icon: FaLinkedin, href: 'https://www.linkedin.com/in/veereshhp/', label: 'LinkedIn', color: 'hover:text-blue-600', bgColor: 'hover:bg-blue-600/20' },
    { icon: FaGithub, href: 'https://github.com/Veeresh-hp', label: 'GitHub', color: 'hover:text-gray-300', bgColor: 'hover:bg-gray-300/20' },
    { icon: FaDiscord, href: 'https://discord.gg/veer_thinks_53322', label: 'Discord', color: 'hover:text-indigo-400', bgColor: 'hover:bg-indigo-400/20' },
    { icon: FaYoutube, href: 'https://youtube.com/@veerthinks?si=vYqUUFQ2mg2utng3', label: 'YouTube', color: 'hover:text-red-500', bgColor: 'hover:bg-red-500/20' },
    { icon: FaInstagram, label: 'Instagram', color: 'hover:text-pink-400', bgColor: 'hover:bg-pink-400/20' },
  ];

  const handleFooterLinkClick = (href) => {
    if (href.startsWith('#')) {
      history.push(`/${href}`);
      const id = href.substring(1);
      setTimeout(() => {
        const element = document.querySelector(`[data-category="${id}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      history.push(href);
      window.scrollTo({ top: 0 });
    }
  };

  const FooterLink = ({ href, name }) => (
    <m.button
      onClick={() => handleFooterLinkClick(href)}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      className="group text-gray-400 hover:text-white text-sm transition-all duration-300 relative py-2 w-full text-left"
    >
      <span className="relative z-10">{name}</span>
      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-r-lg transition-all duration-300 group-hover:w-full -z-0" />
      <span className="absolute left-0 bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-6" />
    </m.button>
  );

  const CollapsibleSection = ({ title, children, sectionKey }) => (
    <div className="lg:block">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="lg:pointer-events-none lg:cursor-default flex items-center justify-between w-full font-bold text-lg mb-4 text-white py-2 lg:py-0"
      >
        <span className="flex items-center gap-2">{title}</span>
        <m.div
          animate={{ rotate: expandedSections[sectionKey] ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden"
        >
          <FaChevronDown className="text-sm" />
        </m.div>
      </button>
      
      <AnimatePresence>
        {(expandedSections[sectionKey] || window.innerWidth >= 1024) && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden lg:!h-auto lg:!opacity-100"
          >
            <ul className="space-y-2 pb-4 lg:pb-0">
              {children}
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );

  const features = [
    {
      icon: FaRocket,
      title: "Lightning Fast",
      description: "Discover AI tools instantly with our optimized search"
    },
    {
      icon: FaStar,
      title: "Curated Collection",
      description: "Hand-picked premium AI tools for maximum productivity"
    },
    {
      icon: FaFire,
      title: "Always Updated",
      description: "Latest AI innovations added weekly to our platform"
    },
    {
      icon: FaChartLine,
      title: "Trending Tools",
      description: "Stay ahead with the most popular AI solutions"
    }
  ];

  return (
    <LazyMotion features={domAnimation}>
      <m.footer
        className="relative bg-gray-900 border-t border-gray-800 text-white"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0 }}
      >
        {/* Simplified Background */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          
          {/* Mobile-First Brand Section */}
          <div className="text-center lg:text-left mb-12 lg:mb-0">
            <Link 
              to="/" 
              onClick={() => window.scrollTo({ top: 0 })} 
              className="inline-flex items-center text-2xl lg:text-3xl font-extrabold mb-6 group"
            >
              <m.img 
                src={Logo} 
                alt="AI Tools Hub Logo" 
                className="w-12 h-12 lg:w-14 lg:h-14 mr-3 rounded-xl shadow-lg group-hover:shadow-blue-500/30 transition-shadow duration-300" 
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                AI Tools Hub
              </span>
            </Link>
            
            <p className="text-gray-300 text-base lg:text-lg leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
              Discover cutting-edge AI tools to supercharge your productivity and innovation in the digital age.
            </p>
            
            {/* Enhanced Social Links */}
            <div className="flex justify-center lg:justify-start flex-wrap gap-3 mb-12 lg:mb-0">
              {socialLinks.map((social, index) => (
                <m.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4, scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center bg-white/5 backdrop-blur-sm border border-white/20 text-gray-400 transition-all duration-300 ${social.color} ${social.bgColor} hover:border-white/40 hover:shadow-lg relative overflow-hidden group`}
                  title={social.label}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <social.icon className="text-lg lg:text-xl relative z-10" />
                </m.a>
              ))}
            </div>
          </div>

          {/* Mobile-Optimized Links Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {Object.entries(footerLinks).map(([category, links]) => (
              <CollapsibleSection 
                key={category} 
                title={category} 
                sectionKey={category}
              >
                {links.map((link) => (
                  <li key={link.name}>
                    <FooterLink href={link.href} name={link.name} />
                  </li>
                ))}
              </CollapsibleSection>
            ))}
          </div>


        </div>

        {/* Enhanced Bottom Bar */}
        <div className="border-t border-gray-800 bg-gray-900/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-400 text-sm text-center sm:text-left">
                © {new Date().getFullYear()} AI Tools Hub. All rights reserved.
              </p>
              
              <div className="flex items-center gap-4">
                <span className="text-gray-500 text-sm flex items-center gap-1">
                  Made with <FaHeart className="text-red-500 text-xs" /> by myalltools
                </span>
                <m.button
                  onClick={scrollToTop} 
                  whileHover={{ y: -2 }} 
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-md flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all"
                  title="Back to top"
                >
                  <FaArrowUp className="text-xs" />
                </m.button>
              </div>
            </div>
          </div>
        </div>
      </m.footer>
    </LazyMotion>
  );
};

export default Footer;