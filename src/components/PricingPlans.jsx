import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaTimes, FaShieldAlt, FaRegCreditCard, FaRegCalendarTimes, FaChevronDown } from 'react-icons/fa';

const PricingPlans = () => {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [activeFAQ, setActiveFAQ] = useState(null);

  const faqs = [
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Absolutely! You are free to cancel your subscription at any time. Your access will continue until the end of your current billing period, with no hidden fees or penalties."
    },
    {
      question: "Is there a free trial for paid plans?",
      answer: "We offer a 14-day money-back guarantee on all paid plans. You can explore the Premium features risk-free, and if it's not a fit, we'll refund you, no questions asked."
    },
    {
      question: "What happens when I exceed my limits?",
      answer: "We'll send you a friendly notification when you're close to your limit. You can choose to upgrade for more capacity or wait for the next billing cycle. We never auto-charge for overages."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, security is our top priority. We use industry-standard encryption for all data and payments. Your information is safe and never shared with third parties."
    }
  ];

  const plans = [
    {
      title: 'Free Plan',
      price: 'Free',
      period: '',
      features: [
        { text: 'Access to Standard Tools', included: true },
        { text: 'Basic Search Functionality', included: true },
        { text: 'Save 5 Favorites', included: true },
        { text: 'Community Reviews', included: true },
        { text: 'Advanced Filters', included: false },
        { text: 'Tool Comparisons', included: false },
        { text: 'API Access', included: false },
      ],
      highlight: false,
    },
    {
      title: 'Starter Plan',
      basePrice: 9,
      period: '/month',
      features: [
        { text: 'Everything in Free', included: true },
        { text: 'Unlimited Favorites', included: true },
        { text: 'Advanced Search Filters', included: true },
        { text: 'Compare Tools Side-by-Side', included: true },
        { text: 'Ad-free Experience', included: true },
        { text: 'Early Access to New Tools', included: false },
        { text: 'API Access', included: false },
      ],
      highlight: false,
    },
    {
      title: 'Premium Plan',
      basePrice: 19,
      period: '/month',
      badge: 'Most Popular',
      features: [
        { text: 'Everything in Starter', included: true },
        { text: 'Early Access to New Tools', included: true },
        { text: 'Exclusive In-depth Reviews', included: true },
        { text: 'Verified Pro Badge', included: true },
        { text: 'API Access (Beta)', included: true },
        { text: 'Priority Tool Submission', included: true },
        { text: 'Direct Developer Contact', included: true },
      ],
      highlight: true,
    },
  ];

  const getPrice = (plan) => {
    if (plan.price === 'Free') return 'Free';
    if (billingCycle === 'yearly') {
      const yearlyTotal = plan.basePrice * 12 * 0.8;
      // Round to nearest dollar for cleaner look
      return `$${Math.round(yearlyTotal)}`;
    }
    return `$${plan.basePrice}`;
  };

  const getPeriod = (plan) => {
      if (plan.price === 'Free') return '';
      return billingCycle === 'yearly' ? '/year' : '/month';
  };

  const getDetails = (plan) => {
      if (plan.price === 'Free' || billingCycle === 'monthly') return null;
      
      const yearlyTotal = Math.round(plan.basePrice * 12 * 0.8);
      const originalTotal = plan.basePrice * 12;
      const savings = originalTotal - yearlyTotal;
      
      return (
        <div className="mt-2 text-xs text-gray-500 font-light flex flex-col gap-1">
            <span>Billed yearly</span>
            <div>
                <span>${plan.basePrice}/mo × 12 = ${originalTotal}</span>
                <span className="block mt-0.5 font-medium text-orange-400">
                    Save ${savings}
                </span>
            </div>
        </div>
      );
  };


  return (
    <section className="relative min-h-screen w-full bg-[#050505] text-white overflow-hidden flex flex-col items-center justify-center py-12 md:py-20 font-sans">
      
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
         {/* Ambient Glows */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute top-0 left-0 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-orange-600/10 rounded-full blur-[80px] md:blur-[120px] -translate-x-1/2 -translate-y-1/2" 
        />
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="absolute bottom-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-orange-900/10 rounded-full blur-[60px] md:blur-[100px] translate-x-1/3 translate-y-1/3" 
        />
        
        {/* Giant Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-full z-0">
          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 0.3 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-[6rem] md:text-[20rem] font-bold text-transparent bg-clip-text bg-gradient-to-b from-orange-500/10 to-transparent blur-xl select-none leading-none tracking-tighter"
          >
            Pricing
          </motion.h1>
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl px-6 flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center mb-10 space-y-4">
            <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="text-3xl md:text-5xl font-medium text-white tracking-tight"
            >
                Choose the Plan That Fits Your Growth
            </motion.h2>
            <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-base md:text-lg text-gray-400 font-light max-w-2xl mx-auto"
            >
                Simple, transparent pricing. Upgrade anytime as your needs scale.
            </motion.p>
        </div>

        {/* Billing Toggle */}
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative flex items-center bg-white/5 backdrop-blur-md rounded-full p-1 mb-10 md:mb-16 border border-white/10"
        >
            <button
                onClick={() => setBillingCycle('monthly')}
                className="relative px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300 z-10 text-white"
            >
                {billingCycle === 'monthly' && (
                    <motion.div
                        layoutId="activePill"
                        className="absolute inset-0 bg-orange-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}
                <span className="relative z-10">Monthly</span>
            </button>
            <button
                onClick={() => setBillingCycle('yearly')}
                className="relative px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300 z-10 text-white flex items-center gap-2"
            >
                {billingCycle === 'yearly' && (
                    <motion.div
                        layoutId="activePill"
                        className="absolute inset-0 bg-orange-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}
                <span className="relative z-10 flex items-center gap-2">
                    Yearly <span className="text-xs text-orange-200 font-normal opacity-90">(Save 20%)</span>
                </span>
            </button>
        </motion.div>

        {/* Pricing Grid */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl items-stretch"
        >
            {plans.map((plan, index) => {
                // Order classes
                let orderClass = '';
                if (index === 0) orderClass = 'order-3 md:order-1';
                if (index === 1) orderClass = 'order-2 md:order-2';
                if (index === 2) orderClass = 'order-1 md:order-3';

                return (
                <motion.div
                    key={index}
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                        delay: index * 0.15 + 0.6, 
                        duration: 0.8, 
                        ease: [0.215, 0.61, 0.355, 1] 
                    }}
                    whileHover={{ 
                        y: -10, 
                        transition: { duration: 0.3, ease: "easeOut" } 
                    }}
                    className={`
                        ${orderClass}
                        relative flex flex-col p-8 rounded-2xl
                        backdrop-blur-xl border
                        transition-all duration-300 group
                        ${plan.highlight 
                            ? 'bg-white/5 border-orange-500/50 shadow-2xl shadow-orange-900/20 scale-100 md:scale-105 z-10' 
                            : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'}
                    `}
                >
                    {/* Badge */}
                    {plan.badge && (
                        <motion.div 
                            initial={{ scale: 0.8 }}
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-500/40 z-20"
                        >
                            {plan.badge}
                        </motion.div>
                    )}
                
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-xl font-medium text-gray-200">{plan.title}</h3>
                        <div className={`
                            w-3 h-3 rounded-full 
                            ${plan.highlight ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.6)]' : 'bg-gray-700'}
                        `} />
                    </div>

                    {/* Price */}
                    <div className="mb-6 min-h-[5.5rem]">
                        <motion.div
                            key={billingCycle}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex items-baseline">
                                <span className="text-4xl font-bold text-white tracking-tight">{getPrice(plan)}</span>
                                <span className="text-sm text-gray-500 font-light ml-1">{getPeriod(plan)}</span>
                            </div>
                            {getDetails(plan)}
                        </motion.div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-white/10 w-full mb-6" />

                    {/* Features */}
                    <ul className="flex-1 space-y-4 mb-8">
                        {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm group-hover:text-gray-200 transition-colors">
                                {feature.included ? (
                                    <FaCheck className="text-orange-500 mt-1 shrink-0" />
                                ) : (
                                    <FaTimes className="text-gray-600 mt-1 shrink-0" />
                                )}
                                <span className={feature.included ? 'text-gray-300' : 'text-gray-600'}>
                                    {feature.text}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* Button */}
                    <button className={`
                        w-full py-3 rounded-xl font-medium transition-all duration-300 relative overflow-hidden
                        ${plan.highlight 
                            ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-900/40' 
                            : 'bg-white/10 hover:bg-white/20 text-white'}
                    `}>
                        Get Started
                    </button>
                    
                    {/* Glow effect on hover for all cards */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
                </motion.div>
                );
            })}
        </motion.div>



        {/* FAQ Section */}
        <div className="w-full max-w-3xl mt-24 mb-10">
            <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl md:text-3xl font-medium text-center mb-8 text-white"
            >
                Frequently Asked Questions
            </motion.h3>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className={`
                            rounded-xl overflow-hidden border transition-all duration-300
                            ${activeFAQ === index ? 'bg-white/10 border-orange-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}
                        `}
                    >
                        <button
                            onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                            className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                        >
                            <span className="text-lg font-medium text-gray-200">{faq.question}</span>
                            <motion.div
                                animate={{ rotate: activeFAQ === index ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <FaChevronDown className={`text-sm ${activeFAQ === index ? 'text-orange-500' : 'text-gray-500'}`} />
                            </motion.div>
                        </button>
                        <AnimatePresence>
                            {activeFAQ === index && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                >
                                    <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed">
                                        {faq.answer}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* Trust & Reassurance */}
        <div className="flex flex-wrap justify-center gap-8 mt-16 text-sm text-gray-400">
            <div className="flex items-center gap-2">
                <FaRegCreditCard className="text-orange-500" />
                <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
                 <FaRegCalendarTimes className="text-orange-500" />
                <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
                 <FaShieldAlt className="text-orange-500" />
                <span>Secure payments</span>
            </div>
        </div>

        {/* Bottom Reassurance */}
         <p className="mt-8 text-sm text-gray-500 text-center font-light">
            No matter which plan you choose, you’re one step closer to professional design.
        </p>

      </div>
    </section>
  );
};

export default PricingPlans;
