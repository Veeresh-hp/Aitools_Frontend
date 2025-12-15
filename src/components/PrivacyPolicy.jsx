import React from 'react';
import { motion as m } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 px-4 sm:px-6 lg:px-8">
      <m.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl"
      >
        <h1 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        <p className="text-gray-400 mb-8 text-sm uppercase tracking-wider font-semibold">
          Last Updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-10 text-gray-300 leading-relaxed">
          {/* Introduction Section */}
          <section className="border-l-4 border-blue-500 pl-6">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-blue-400">1.</span> Introduction
            </h2>
            <p className="text-lg">
              Welcome to <span className="font-semibold text-blue-400">AI Tools Hub</span> ("<span className="text-purple-400">we</span>," "<span className="text-purple-400">our</span>," or "<span className="text-purple-400">us</span>"). We are committed to protecting your <span className="font-semibold text-green-400">personal information</span> and your right to <span className="font-semibold text-green-400">privacy</span>. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.
            </p>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          {/* Information Collection */}
          <section className="border-l-4 border-purple-500 pl-6">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-purple-400">2.</span> Information We Collect
            </h2>
            <p className="text-lg mb-4">
              We collect <span className="font-semibold text-purple-400">personal information</span> that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website, or otherwise when you contact us.
            </p>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mt-4">
              <h3 className="text-xl font-semibold text-white mb-4">Data Categories:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 text-xl">•</span>
                  <span><span className="font-semibold text-blue-300">Names and Contact Data</span> <span className="text-gray-400">(email addresses, usernames)</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 text-xl">•</span>
                  <span><span className="font-semibold text-purple-300">Credentials</span> <span className="text-gray-400">(passwords, stored in hashed format)</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-pink-400 text-xl">•</span>
                  <span><span className="font-semibold text-pink-300">Usage Data</span> <span className="text-gray-400">(favorites, search history, tool click history)</span></span>
                </li>
              </ul>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          {/* How We Use Information */}
          <section className="border-l-4 border-pink-500 pl-6">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-pink-400">3.</span> How We Use Your Information
            </h2>
            <p className="text-lg">
              We use personal information collected via our website for a variety of <span className="font-semibold text-pink-400">business purposes</span> described below. We process your personal information for these purposes in reliance on our <span className="font-semibold text-pink-400">legitimate business interests</span>, in order to enter into or perform a <span className="font-semibold text-pink-400">contract</span> with you, with your <span className="font-semibold text-pink-400">consent</span>, and/or for compliance with our <span className="font-semibold text-pink-400">legal obligations</span>.
            </p>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          {/* Sharing Information */}
          <section className="border-l-4 border-green-500 pl-6">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-green-400">4.</span> Sharing Your Information
            </h2>
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
              <p className="text-lg">
                We only share information with your <span className="font-semibold text-green-400">consent</span>, to comply with <span className="font-semibold text-green-400">laws</span>, to provide you with <span className="font-semibold text-green-400">services</span>, to protect your <span className="font-semibold text-green-400">rights</span>, or to fulfill <span className="font-semibold text-green-400">business obligations</span>.
              </p>
              <p className="text-lg mt-3 font-semibold text-green-300">
                ✓ We do NOT sell your personal information to third parties.
              </p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          {/* Cookies Section */}
          <section className="border-l-4 border-orange-500 pl-6">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-orange-400">5.</span> Cookies and Tracking Technologies
            </h2>
            <p className="text-lg">
              We may use <span className="font-semibold text-orange-400">cookies</span> and similar tracking technologies (like <span className="font-semibold text-orange-400">web beacons</span> and <span className="font-semibold text-orange-400">pixels</span>) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our <span className="font-semibold text-orange-300">Cookie Notice</span>.
            </p>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          {/* Security Section */}
          <section className="border-l-4 border-red-500 pl-6">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-red-400">6.</span> Security of Your Information
            </h2>
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
              <p className="text-lg mb-3">
                We use <span className="font-semibold text-red-400">administrative</span>, <span className="font-semibold text-red-400">technical</span>, and <span className="font-semibold text-red-400">physical security measures</span> to help protect your personal information.
              </p>
              <p className="text-gray-400 text-base italic">
                While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
              </p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          {/* Contact Section */}
          <section className="border-l-4 border-cyan-500 pl-6">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-cyan-400">7.</span> Contact Us
            </h2>
            <p className="text-lg">
              If you have questions or comments about this policy, you may <span className="font-semibold text-cyan-400">email us</span> or reach out via our <span className="font-semibold text-cyan-400">Contact page</span>.
            </p>
          </section>
        </div>
      </m.div>
    </div>
  );
};

export default PrivacyPolicy;