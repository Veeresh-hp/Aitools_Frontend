import React from 'react';
import { motion as m } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaFileContract, FaUpRightFromSquare, FaUserCheck, FaBan, FaEnvelope } from 'react-icons/fa6';
import TermsBg from '../assets/terms_bg.png';

const TermsOfService = ({ isModal = false }) => {
  return (
    <div className={`${isModal ? 'h-full bg-transparent' : 'min-h-screen bg-[#050505] selection:bg-orange-500/30'} text-white font-sans relative overflow-x-hidden`}>
      
      {/* Global Background (Dominic Theme - Navy/Orange) */}
      {!isModal ? (
        <div className="fixed inset-0 z-0 pointer-events-none">
           {/* Base gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#050505] via-[#0a0a12] to-[#050505]" />
          
          {/* Background image layer */}
          <img 
            src={TermsBg} 
            alt="Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-30 animate-subtle-zoom" 
            style={{ mixBlendMode: 'overlay' }}
          />

          {/* Glow Overlays */}
          <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#FF6B00]/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-black/60" />
        </div>
      ) : (
        /* Modal Background - Subtle Gradient */
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-orange-900/5 mix-blend-overlay" />
          <div className="absolute top-0 right-0 w-full h-64 bg-gradient-to-b from-black/50 to-transparent" />
        </div>
      )}

      <div className={`relative z-10 ${isModal ? 'p-0' : 'py-20 px-4 sm:px-6 lg:px-8'}`}>
        <m.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`${isModal ? '' : 'max-w-4xl mx-auto bg-black/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 sm:p-12 shadow-2xl relative'} overflow-hidden`}
        >
          {/* Internal Glow - Hide in modal to reduce visual noise */}
          {!isModal && (
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B00]/5 rounded-full blur-3xl pointer-events-none" />
          )}

          {/* Header */}
          <div className={`flex flex-col md:flex-row items-start md:items-center gap-6 ${isModal ? 'mb-8' : 'mb-12 border-b border-white/5 pb-10'}`}>
             <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF6B00]/20 to-blue-600/20 flex items-center justify-center border border-[#FF6B00]/30 text-[#FF6B00] text-4xl shadow-lg shadow-orange-900/20 shrink-0">
                <FaFileContract />
             </div>
             <div>
                <h1 className={`${isModal ? 'text-3xl' : 'text-4xl md:text-5xl'} font-extrabold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent drop-shadow-sm mb-2`}>
                  Terms of Service
                </h1>
                <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
                  Please read these terms carefully before using <Link to="/" className="text-[#FF6B00] hover:text-orange-400 transition-colors font-semibold">AI Tools Hub</Link>. By using our platform, you agree to be bound by these terms.
                </p>
                <p className="text-gray-500 text-xs mt-4 uppercase tracking-wider font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF6B00]"></span>
                  Last Updated: {new Date().toLocaleDateString()}
                </p>
             </div>
          </div>

          <div className="space-y-12 text-gray-300 leading-relaxed font-light">
          
          {/* 1. Acceptance */}
          <section className="group">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3 group-hover:text-[#FF6B00] transition-colors">
              <span className="text-[#FF6B00] font-mono opacity-50 group-hover:opacity-100 transition-opacity">01.</span> 
              <span>Acceptance of Terms</span>
            </h2>
            <div className="pl-4 border-l-2 border-white/5 group-hover:border-[#FF6B00]/50 transition-colors">
              <p className="mb-4">
                These Terms of Service ("Terms") constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and <span className="font-semibold text-white">AI Tools Hub</span> ("we," "us," or "our").
              </p>
              <p>
                By accessing <Link to="/" className="text-blue-400 hover:underline">aitoolshub.com</Link>, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree with all of these Terms, then you are expressly prohibited from using the Site and must discontinue use immediately.
              </p>
            </div>
          </section>

          {/* 2. User Accounts */}
          <section className="group">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3 group-hover:text-[#FF6B00] transition-colors">
              <FaUserCheck className="text-xl text-[#FF6B00]/50 group-hover:text-[#FF6B00] transition-colors" />
              <span>User Accounts & Registration</span>
            </h2>
            <div className="bg-white/5 border border-white/5 rounded-xl p-6 hover:bg-white/[0.07] transition-colors">
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="text-[#FF6B00] font-bold">•</span>
                  <span>You may need to register via <Link to="/signup" className="text-[#FF6B00] hover:underline">Sign Up</Link> to access certain features (e.g., saving tools, submitting content).</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#FF6B00] font-bold">•</span>
                  <span>You agree to keep your password confidential and will be responsible for all use of your account and password.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#FF6B00] font-bold">•</span>
                  <span>We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* 3. Third Party Links */}
          <section className="group">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3 group-hover:text-[#FF6B00] transition-colors">
              <FaUpRightFromSquare className="text-lg text-[#FF6B00]/50 group-hover:text-[#FF6B00] transition-colors" />
              <span>Third-Party Tools & Links</span>
            </h2>
            <div className="pl-4 border-l-2 border-white/5 group-hover:border-[#FF6B00]/50 transition-colors">
              <p className="mb-4">
                The Site contains links to other websites ("Third-Party Websites") as well as articles, photographs, text, graphics, pictures, designs, music, sound, video, information, applications, software, and other content or items belonging to or originating from third parties ("Third-Party Content").
              </p>
              <div className="bg-blue-900/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-200/80 flex items-start gap-3">
                 <div className="mt-1 text-blue-400">ℹ️</div>
                 <div>
                    <span className="font-bold text-blue-400">Important:</span> We are not responsible for any Third-Party Websites accessed through the Site. Inclusion of any link does not imply approval or endorsement by us. If you decide to leave the Site and access the Third-Party Websites, you do so at your own risk.
                 </div>
              </div>
            </div>
          </section>

          {/* 4. Prohibited Activities */}
          <section className="group">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3 group-hover:text-red-400 transition-colors">
              <FaBan className="text-xl text-red-500/50 group-hover:text-red-500 transition-colors" />
              <span>Prohibited Activities</span>
            </h2>
            <p className="mb-4 text-gray-400">
              You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us. As a user of the Site, you agree not to:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
               <div className="bg-red-900/5 border border-red-500/10 p-4 rounded-lg text-sm text-gray-400 hover:border-red-500/30 transition-colors">
                  Systematically retrieve data or other content from the Site to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.
               </div>
               <div className="bg-red-900/5 border border-red-500/10 p-4 rounded-lg text-sm text-gray-400 hover:border-red-500/30 transition-colors">
                  Use the Site to advertise or offer to sell goods and services without our express written consent.
               </div>
               <div className="bg-red-900/5 border border-red-500/10 p-4 rounded-lg text-sm text-gray-400 hover:border-red-500/30 transition-colors">
                  Circumvent, disable, or otherwise interfere with security-related features of the Site.
               </div>
               <div className="bg-red-900/5 border border-red-500/10 p-4 rounded-lg text-sm text-gray-400 hover:border-red-500/30 transition-colors">
                  Engage in unauthorized framing of or linking to the Site.
               </div>
            </div>
          </section>

          {/* 5. Disclaimer */}
          <section className="group">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3 group-hover:text-[#FF6B00] transition-colors">
               <span className="text-[#FF6B00] font-mono opacity-50 group-hover:opacity-100 transition-opacity">05.</span>
               <span>Disclaimer</span>
            </h2>
            <div className="bg-gradient-to-br from-[#FF6B00]/5 to-black border border-[#FF6B00]/20 rounded-xl p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <FaFileContract className="text-6xl text-[#FF6B00]" />
               </div>
              <p className="italic text-gray-300 mb-2 font-medium">
                "The site is provided on an 'AS-IS' and 'AS-AVAILABLE' basis."
              </p>
              <p className="relative z-10">
                We cannot guarantee that the AI tools listed on our site will essentially function as described forever, as they are maintained by third parties. We assume no liability or responsibility for any (1) errors, mistakes, or inaccuracies of content and materials, (2) personal injury or property damage, of any nature whatsoever, resulting from your access to and use of the specific tools linked here.
              </p>
            </div>
          </section>

          {/* 6. Contact Us */}
          <section className="group border-t border-white/5 pt-10">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span>Contact Us</span>
            </h2>
            <div className={`bg-gradient-to-r from-gray-900 to-black border border-white/10 rounded-2xl ${isModal ? 'p-6' : 'p-8'} flex flex-col md:flex-row items-center justify-between gap-6 hover:border-white/20 transition-all`}>
              <div>
                <p className="text-lg font-semibold text-white mb-2">Have questions about these Terms?</p>
                <p className="text-gray-400 text-sm">
                   Our support team is available to assist you with any legal or platform-related inquiries.
                </p>
              </div>
              <Link to="/contact">
                <button className="whitespace-nowrap px-8 py-4 bg-[#FF6B00] text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-900/20 flex items-center gap-2 group-hover:gap-3">
                  <FaEnvelope /> Contact Support
                </button>
              </Link>
            </div>
             {!isModal && (
               <div className="mt-8 text-center text-gray-600 text-sm">
                  Read our <Link to="/privacy" className="text-blue-500 hover:text-blue-400">Privacy Policy</Link> to learn how we manage your data.
               </div>
             )}
          </section>

        </div>
        </m.div>
      </div>
    </div>
  );
};

export default TermsOfService;