import React from 'react';
import { motion as m } from 'framer-motion';

const plans = [
  {
    name: 'Free',
    price: '$0',
    tagline: 'Get started',
    features: ['Basic tool access', 'Community support', 'Favorites list'],
    accent: 'from-slate-600/40 to-slate-800/40 border-slate-500/30',
  },
  {
    name: 'Pro',
    price: '$9',
    tagline: 'Power features',
    features: ['Unlimited favorites', 'Early beta tools', 'Priority support', 'Profile badge'],
    accent: 'from-indigo-600/40 to-purple-600/40 border-indigo-500/40',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    tagline: 'Scale & control',
    features: ['Team workspaces', 'Dedicated support', 'Usage analytics', 'Custom integrations'],
    accent: 'from-pink-600/40 to-orange-500/40 border-pink-500/40',
  },
];

const Upgrade = () => {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Background theme layers like Home */}
      <div className="absolute inset-0 bg-[#05060b]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#1a1f2e_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,#1e2235_0%,transparent_55%)]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.07]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
      <m.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative px-6 py-16 max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <m.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
            Upgrade Your Toolkit
          </m.h1>
          <m.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-4 text-gray-300 max-w-2xl mx-auto">
            Unlock more features, speed, and collaboration. Choose the plan that matches how you build.
          </m.p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p, i) => (
            <m.div
              key={p.name}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className={`relative rounded-2xl p-6 bg-gradient-to-br ${p.accent} border backdrop-blur-sm flex flex-col`}
            >
              {p.popular && (
                <span className="absolute -top-3 right-4 bg-indigo-600/90 text-xs tracking-wide font-semibold px-3 py-1 rounded-full shadow">Popular</span>
              )}
              <h2 className="text-xl font-semibold mb-1">{p.name}</h2>
              <div className="text-3xl font-bold mb-1">{p.price}<span className="text-sm font-normal text-gray-400 ml-1">{p.price !== 'Custom' ? '/mo' : ''}</span></div>
              <div className="text-sm text-gray-300 mb-4">{p.tagline}</div>
              <ul className="space-y-2 text-sm text-gray-200 flex-1">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-1 w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button disabled className={`mt-6 w-full rounded-xl px-4 py-2 text-sm font-medium transition-colors border border-white/20 opacity-60 cursor-not-allowed ${p.popular ? 'bg-white/15' : 'bg-white/5'}`}>Coming Soon</button>
            </m.div>
          ))}
        </div>
        <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-14 text-center text-xs text-gray-400">
          Need a custom enterprise arrangement? <span className="text-indigo-300">Contact us</span> for volume pricing.
        </m.div>
      </m.div>
    </div>
  );
};

export default Upgrade;