import React from 'react';
import { motion as m } from 'framer-motion';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 px-4 sm:px-6 lg:px-8">
      <m.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl"
      >
        <h1 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Terms of Service
        </h1>
        <p className="text-gray-400 mb-8 text-sm uppercase tracking-wider font-semibold">
          Last Updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-10 text-gray-300 leading-relaxed">
          {/* Agreement to Terms */}
          <section className="border-l-4 border-blue-500 pl-6">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-blue-400">1.</span> Agreement to Terms
            </h2>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
              <p className="text-lg">
                These <span className="font-semibold text-blue-400">Terms of Service</span> constitute a <span className="font-semibold text-blue-300">legally binding agreement</span> made between you, whether personally or on behalf of an entity ("<span className="text-purple-400">you</span>") and <span className="font-semibold text-blue-400">AI Tools Hub</span> ("<span className="text-purple-400">we</span>," "<span className="text-purple-400">us</span>" or "<span className="text-purple-400">our</span>"), concerning your access to and use of our website. By accessing the site, you agree that you have read, understood, and agreed to be bound by all of these Terms of Service.
              </p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          {/* Intellectual Property Rights */}
          <section className="border-l-4 border-purple-500 pl-6">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-purple-400">2.</span> Intellectual Property Rights
            </h2>
            <p className="text-lg mb-4">
              Unless otherwise indicated, the Site is our <span className="font-semibold text-purple-400">proprietary property</span> and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "<span className="font-semibold text-purple-300">Content</span>") and the trademarks, service marks, and logos contained therein (the "<span className="font-semibold text-purple-300">Marks</span>") are owned or controlled by us or licensed to us.
            </p>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Protected by:</h3>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/40 rounded-lg text-purple-300 font-semibold">
                  Copyright Laws
                </span>
                <span className="px-4 py-2 bg-pink-500/20 border border-pink-500/40 rounded-lg text-pink-300 font-semibold">
                  Trademark Laws
                </span>
                <span className="px-4 py-2 bg-blue-500/20 border border-blue-500/40 rounded-lg text-blue-300 font-semibold">
                  IP Regulations
                </span>
              </div>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          {/* User Representations */}
          <section className="border-l-4 border-pink-500 pl-6">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-pink-400">3.</span> User Representations
            </h2>
            <p className="text-lg mb-4">
              By using the Site, you <span className="font-semibold text-pink-400">represent and warrant</span> that:
            </p>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-pink-400 text-xl mt-1">①</span>
                  <span className="text-lg">All <span className="font-semibold text-pink-300">registration information</span> you submit will be <span className="font-semibold text-pink-300">true, accurate, current, and complete</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-pink-400 text-xl mt-1">②</span>
                  <span className="text-lg">You will <span className="font-semibold text-pink-300">maintain the accuracy</span> of such information and promptly update such registration information as necessary</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-pink-400 text-xl mt-1">③</span>
                  <span className="text-lg">You have the <span className="font-semibold text-pink-300">legal capacity</span> and you agree to <span className="font-semibold text-pink-300">comply</span> with these Terms of Service</span>
                </li>
              </ul>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          {/* Prohibited Activities */}
          <section className="border-l-4 border-red-500 pl-6">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-red-400">4.</span> Prohibited Activities
            </h2>
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
              <p className="text-lg mb-3">
                You may <span className="font-semibold text-red-400">not access or use</span> the Site for any purpose other than that for which we make the Site available.
              </p>
              <p className="text-lg font-semibold text-red-300">
                ⚠️ The Site may NOT be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
              </p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          {/* Disclaimer */}
          <section className="border-l-4 border-orange-500 pl-6">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-orange-400">5.</span> Disclaimer
            </h2>
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6">
              <p className="text-lg mb-3">
                The site is provided on an <span className="font-semibold text-orange-400">"AS-IS"</span> and <span className="font-semibold text-orange-400">"AS-AVAILABLE"</span> basis. You agree that your use of the site and our services will be at your <span className="font-semibold text-orange-300">sole risk</span>.
              </p>
              <p className="text-gray-400 text-base italic">
                To the fullest extent permitted by law, we disclaim all warranties, express or implied, in connection with the site and your use thereof.
              </p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          {/* Limitation of Liability */}
          <section className="border-l-4 border-yellow-500 pl-6">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-yellow-400">6.</span> Limitation of Liability
            </h2>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
              <p className="text-lg mb-3">
                In <span className="font-semibold text-yellow-400">no event</span> will we or our directors, employees, or agents be liable to you or any third party for any:
              </p>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-black/30 rounded-lg p-3 text-center">
                  <span className="text-yellow-300 font-semibold">Direct Damages</span>
                </div>
                <div className="bg-black/30 rounded-lg p-3 text-center">
                  <span className="text-yellow-300 font-semibold">Indirect Damages</span>
                </div>
                <div className="bg-black/30 rounded-lg p-3 text-center">
                  <span className="text-yellow-300 font-semibold">Lost Profit</span>
                </div>
                <div className="bg-black/30 rounded-lg p-3 text-center">
                  <span className="text-yellow-300 font-semibold">Lost Revenue</span>
                </div>
                <div className="bg-black/30 rounded-lg p-3 text-center">
                  <span className="text-yellow-300 font-semibold">Loss of Data</span>
                </div>
                <div className="bg-black/30 rounded-lg p-3 text-center">
                  <span className="text-yellow-300 font-semibold">Other Damages</span>
                </div>
              </div>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          {/* Contact Section */}
          <section className="border-l-4 border-cyan-500 pl-6">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-cyan-400">7.</span> Contact Us
            </h2>
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-6">
              <p className="text-lg">
                In order to resolve a <span className="font-semibold text-cyan-400">complaint</span> regarding the Site or to receive further <span className="font-semibold text-cyan-400">information</span> regarding use of the Site, please contact us through our dedicated <span className="font-semibold text-cyan-300">contact page</span>.
              </p>
            </div>
          </section>
        </div>
      </m.div>
    </div>
  );
};

export default TermsOfService;