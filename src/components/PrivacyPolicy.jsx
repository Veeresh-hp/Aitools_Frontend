import React from 'react';
import { motion as m } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaUserShield, FaFingerprint, FaCookieBite, FaShareNodes, FaLock, FaEnvelope } from 'react-icons/fa6';
import PrivacyBg from '../assets/privacy_bg.png';

const PrivacyPolicy = ({ isModal = false }) => {
  return (
    <div className={`${isModal ? 'h-full bg-transparent' : 'min-h-screen bg-[#050505] selection:bg-orange-500/30'} text-white font-sans relative overflow-x-hidden`}>
      
      {/* Global Background (Dominic Theme - Navy/Orange) */}
      {!isModal ? (
        <div className="fixed inset-0 z-0 pointer-events-none">
           {/* Base gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#050505] via-[#050a12] to-[#050505]" />
          
          {/* Background image layer */}
          <img 
            src={PrivacyBg} 
            alt="Privacy Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-30 animate-subtle-zoom" 
            style={{ mixBlendMode: 'overlay' }}
          />

          {/* Glow Overlays */}
          <div className="absolute top-[-20%] right-[10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#FF6B00]/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-black/60" />
        </div>
      ) : (
        /* Modal Background - Subtle Gradient */
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/10 via-transparent to-orange-900/5 mix-blend-overlay" />
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
          {/* Internal Glow - Hide in modal */}
          {!isModal && (
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#FF6B00]/5 rounded-full blur-3xl pointer-events-none" />
          )}

          {/* Header */}
          <div className={`flex flex-col md:flex-row items-start md:items-center gap-6 ${isModal ? 'mb-8' : 'mb-12 border-b border-white/5 pb-10'}`}>
             <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF6B00]/20 to-blue-600/20 flex items-center justify-center border border-[#FF6B00]/30 text-[#FF6B00] text-4xl shadow-lg shadow-orange-900/20 shrink-0">
                <FaUserShield />
             </div>
             <div>
                <h1 className={`${isModal ? 'text-3xl' : 'text-4xl md:text-5xl'} font-extrabold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent drop-shadow-sm mb-2`}>
                  Privacy Policy
                </h1>
                <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
                  Your privacy is important to us. This policy explains how <Link to="/" className="text-[#FF6B00] hover:text-orange-400 transition-colors font-semibold">AI Tools Hub</Link> collects, uses, and protects your information.
                </p>
                <p className="text-gray-500 text-xs mt-4 uppercase tracking-wider font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF6B00]"></span>
                  Last Updated: {new Date().toLocaleDateString()}
                </p>
             </div>
          </div>

          <div className="space-y-12 text-gray-300 leading-relaxed font-light">
          
          {/* 1. Introduction */}
          <section className="group">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3 group-hover:text-[#FF6B00] transition-colors">
              <span className="text-[#FF6B00] font-mono opacity-50 group-hover:opacity-100 transition-opacity">01.</span> Introduction
            </h2>
            <div className="pl-4 border-l-2 border-white/5 group-hover:border-[#FF6B00]/50 transition-colors">
              <p className="mb-4">
                This privacy notice for <span className="font-semibold text-white">AI Tools Hub</span> ("we," "us," or "our") describes how and why we might collect, store, use, and/or share ("process") your information when you use our services ("Services"), such as when you:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2 mb-4 text-gray-400">
                <li>Visit our website at <Link to="/" className="text-blue-400 hover:underline">aitoolshub.com</Link></li>
                <li>Engage with us in other related ways, including creating an account via <Link to="/signup" className="text-blue-400 hover:underline">Sign Up</Link> or sales, marketing, or events.</li>
              </ul>
              <p>
                Reading this privacy notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services.
              </p>
            </div>
          </section>

          {/* 2. Information We Collect */}
          <section className="group">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3 group-hover:text-[#FF6B00] transition-colors">
              <FaFingerprint className="text-xl text-[#FF6B00]/50 group-hover:text-[#FF6B00] transition-colors" />
              <span>Information We Collect</span>
            </h2>
            <p className="mb-4 text-gray-400">
               We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
            </p>
            <div className="bg-white/5 border border-white/5 rounded-xl p-6 mt-4 hover:bg-white/[0.07] transition-colors">
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <span className="w-1.5 h-1.5 bg-[#FF6B00] rounded-full mt-2.5 shrink-0"></span>
                  <span><span className="font-semibold text-orange-200">Personal Data:</span> We collect names; email addresses; usernames; passwords; and other similar information.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2.5 shrink-0"></span>
                  <span><span className="font-semibold text-blue-300">Social Media Login Data:</span> We may provide you with the option to register with us using your existing social media account details, like your Google account.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2.5 shrink-0"></span>
                  <span><span className="font-semibold text-purple-300">Application Data:</span> If you use our application(s), we may also collect specific usage data, search queries, and tool interactions to improve our recommendations.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* 3. How We Use Information */}
          <section className="group">
             <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3 group-hover:text-[#FF6B00] transition-colors">
               <span className="text-[#FF6B00] font-mono opacity-50 group-hover:opacity-100 transition-opacity">03.</span> How We Use Your Information
             </h2>
             <div className="pl-4 border-l-2 border-white/5 group-hover:border-[#FF6B00]/50 transition-colors">
               <p className="mb-4">
                  We process your information for purposes based on legitimate business interests, the fulfillment of our contract with you, compliance with our legal obligations, and/or your consent. We use the information we collect or receive:
               </p>
               <div className="grid md:grid-cols-2 gap-3">
                  <div className="bg-blue-900/10 border border-blue-500/20 p-3 rounded-lg text-sm text-blue-200/80">
                     To facilitate account creation and logon process.
                  </div>
                  <div className="bg-blue-900/10 border border-blue-500/20 p-3 rounded-lg text-sm text-blue-200/80">
                     To send administrative information to you.
                  </div>
                  <div className="bg-blue-900/10 border border-blue-500/20 p-3 rounded-lg text-sm text-blue-200/80">
                     To protect our Services (security & fraud prevention).
                  </div>
                  <div className="bg-blue-900/10 border border-blue-500/20 p-3 rounded-lg text-sm text-blue-200/80">
                     To improve user experience and personalize content.
                  </div>
               </div>
             </div>
          </section>

          {/* 4. Sharing Information */}
          <section className="group">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3 group-hover:text-green-400 transition-colors">
              <FaShareNodes className="text-xl text-green-500/50 group-hover:text-green-500 transition-colors" />
              <span>Sharing Your Information</span>
            </h2>
            <div className="bg-green-900/5 border border-green-500/10 rounded-xl p-6 hover:border-green-500/20 transition-colors">
              <p className="mb-4">
                We may process or share your data that we hold based on the following legal basis:
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                 <li><strong className="text-green-400">Consent:</strong> We may process your data if you have given us specific consent to use your personal information for a specific purpose.</li>
                 <li><strong className="text-green-400">Legitimate Interests:</strong> We may process your data when it is reasonably necessary to achieve our legitimate business interests.</li>
                 <li><strong className="text-green-400">Legal Obligations:</strong> We may disclose your information where we are legally required to do so.</li>
              </ul>
              <div className="mt-4 flex items-center gap-2 text-green-300 text-sm font-semibold bg-green-500/10 p-3 rounded-lg inline-block border border-green-500/10">
                ✓ We do NOT sell your personal information to third parties.
              </div>
            </div>
          </section>

          {/* 5. Cookies */}
          <section className="group">
             <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3 group-hover:text-[#FF6B00] transition-colors">
                <FaCookieBite className="text-xl text-[#FF6B00]/50 group-hover:text-[#FF6B00] transition-colors" />
                <span>Cookies and Tracking Technologies</span>
             </h2>
             <div className="pl-4 border-l-2 border-white/5 group-hover:border-[#FF6B00]/50 transition-colors">
               <p className="text-gray-300">
                  We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.
               </p>
             </div>
          </section>

          {/* 6. Security */}
          <section className="group">
             <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3 group-hover:text-red-400 transition-colors">
                <FaLock className="text-xl text-red-500/50 group-hover:text-red-500 transition-colors" />
                <span>Data Security</span>
             </h2>
             <div className="bg-red-900/5 border border-red-500/10 rounded-xl p-6 hover:border-red-500/20 transition-colors">
               <p className="text-gray-300 mb-3">
                  We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process.
               </p>
               <p className="text-gray-400 text-sm italic">
                  However, safeguards are not impenetrable. We cannot guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information.
               </p>
             </div>
          </section>

          {/* 7. Contact Us */}
          <section className="group border-t border-white/5 pt-10">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span>Contact Us</span>
            </h2>
            <div className={`bg-gradient-to-r from-gray-900 to-black border border-white/10 rounded-2xl ${isModal ? 'p-6' : 'p-8'} flex flex-col md:flex-row items-center justify-between gap-6 hover:border-white/20 transition-all`}>
              <div>
                <p className="text-lg font-semibold text-white mb-2">Have questions about your data?</p>
                <p className="text-gray-400 text-sm">
                   If you have questions or comments about this policy, you may contact our Data Protection Officer.
                </p>
              </div>
              <Link to="/contact">
                 <button className="whitespace-nowrap px-8 py-4 bg-[#FF6B00] text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-900/20 flex items-center gap-2 group-hover:gap-3">
                  <FaEnvelope /> Contact Privacy Team
                </button>
              </Link>
            </div>
             {!isModal && (
               <div className="mt-8 text-center text-gray-600 text-sm">
                 Review our <Link to="/terms" className="text-blue-500 hover:text-blue-400">Terms of Service</Link> for usage guidelines.
              </div>
             )}
          </section>

        </div>
        </m.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;