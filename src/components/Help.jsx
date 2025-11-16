import React from 'react';
import { motion as m } from 'framer-motion';

const Help = () => {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Background theme layers like Home */}
      <div className="absolute inset-0 bg-[#05060b]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#1a1f2e_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,#1e2235_0%,transparent_55%)]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.07]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
      <m.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="relative px-6 py-16 max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <m.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
            Help & Support
          </m.h1>
          <m.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-4 text-gray-300 max-w-2xl mx-auto">
            Find quick answers, tips, and ways to contact us.
          </m.p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[{
            title: 'Getting Started',
            body: 'Learn the basics: searching, bookmarking favorites, and navigating categories.'
          },{
            title: 'Account & Profile',
            body: 'Update display name and manage account settings in your Profile.'
          },{
            title: 'Newsletter',
            body: 'Subscribe to get curated AI tools and updates directly to your inbox.'
          },{
            title: 'Contact Support',
            body: 'Email us anytime. We aim to respond within 1–2 business days.'
          }].map((card, i) => (
            <m.div
              key={card.title}
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="rounded-2xl p-5 bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <h3 className="text-lg font-semibold mb-1">{card.title}</h3>
              <p className="text-sm text-gray-300">{card.body}</p>
            </m.div>
          ))}
        </div>
        <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-12 text-center text-xs text-gray-400">
          Still stuck? Reach out at <span className="text-indigo-300">support@ai-tools-hub.example</span>
        </m.div>
      </m.div>
    </div>
  );
};

export default Help;