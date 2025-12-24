import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { motion as m, AnimatePresence } from 'framer-motion';
import { FaSearch, FaRocket, FaUserCog, FaTools, FaShieldAlt, FaChevronDown, FaEnvelope, FaExternalLinkAlt } from 'react-icons/fa';

const Help = () => {
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const articles = {
    'How to search for tools': {
      title: 'How to Search for Tools',
      content: (
        <div className="space-y-4">
          <p>Finding the perfect AI tool is easy with our search bar:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li><strong>Keyword Search:</strong> Type keywords like "image generator", "coding assistant", or "marketing" into the main search bar on the Home page.</li>
            <li><strong>Real-time Results:</strong> Results update instantly as you type.</li>
            <li><strong>Specific Names:</strong> If you know the name of the tool (e.g., "ChatGPT"), type it directly to find its dedicated page.</li>
          </ul>
        </div>
      )
    },
    'Filtering by category': {
      title: 'Filtering by Category',
      content: (
        <div className="space-y-4">
          <p>Narrow down your options using categories:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li><strong>Sidebar Navigation:</strong> On the Home page, use the left sidebar to click on major categories like "Text & Writing" or "Image & Video".</li>
            <li><strong>Mobile Usage:</strong> On mobile, swipe through the category tabs at the top of the screen.</li>
            <li><strong>Sub-categories:</strong> Some major categories may have specific tags or sub-filters available in the future.</li>
          </ul>
        </div>
      )
    },
    'Using bookmarks': {
      title: 'Using Bookmarks (Favorites)',
      content: (
        <div className="space-y-4">
          <p>Save tools for later with Bookmarks:</p>
          <ol className="list-decimal pl-5 space-y-2 text-gray-300">
            <li><strong>Click the Heart:</strong> On any tool card, click the <span className="inline-block text-gray-400"><FaRocket className="inline w-3 h-3"/></span> Heart icon. If you are logged in, it will turn red/highlighted.</li>
            <li><strong>Access Favorites:</strong> Go to your Profile menu and select <strong>"Favs"</strong> or click the Heart icon in the bottom navigation bar on mobile.</li>
            <li><strong>Manage:</strong> You can remove a tool from favorites by clicking the Heart icon again.</li>
          </ol>
          <p className="text-sm text-gray-400 mt-2">Note: You must be logged in to use this feature.</p>
        </div>
      )
    },
    'Updating your profile': {
      title: 'Updating your Profile',
      content: (
        <div className="space-y-4">
          <p>Keep your account information up to date:</p>
          <ol className="list-decimal pl-5 space-y-2 text-gray-300">
            <li>Click on your <strong>Profile Icon</strong> in the top right (or "Profile" in mobile nav).</li>
            <li>Select <strong>"Profile"</strong> from the menu.</li>
            <li>Click the <strong>"Edit Profile"</strong> button to change your display name or bio.</li>
            <li>You can also update your generic avatar to a custom one if supported.</li>
          </ol>
        </div>
      )
    },
    'Resetting password': {
      title: 'Resetting Password',
      content: (
        <div className="space-y-4">
          <p>If you've lost your password:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li>Go to the <strong>Login</strong> page.</li>
            <li>Click <strong>"Forgot Password?"</strong>.</li>
            <li>Enter your registered email address.</li>
            <li>Check your email for a reset link (ensure to check Spam folder).</li>
            <li>Follow the link to set a new secure password.</li>
          </ul>
        </div>
      )
    },
    'Privacy settings': {
      title: 'Privacy Settings',
      content: (
        <div className="space-y-4">
          <p>We value your privacy. Currently, your profile is:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li><strong>Private by default:</strong> Your favorites list is only visible to you unless shared (feature coming soon).</li>
            <li><strong>Data Usage:</strong> We only use your email for authentication and critical updates. We do not sell your data.</li>
            <li>To delete your account completely, please contact support.</li>
          </ul>
        </div>
      )
    },
    'Submission guidelines': {
      title: 'Submission Guidelines',
      content: (
        <div className="space-y-4">
          <p>Ensure your tool gets approved quickly:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li><strong>Working URL:</strong> The link must be active and accessible.</li>
            <li><strong>Clear Description:</strong> Write a professional, hype-free description of what the tool actually does.</li>
            <li><strong>High-Quality Image:</strong> Upload a clear screenshot of the dashboard or landing page (16:9 ratio preferred).</li>
            <li><strong>Correct Category:</strong> Choose the most relevant category.</li>
          </ul>
        </div>
      )
    },
    'Verification process': {
      title: 'Verification Process',
      content: (
        <div className="space-y-4">
          <p>How we review tools:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li><strong>Automated Check:</strong> We check if the URL is reachable.</li>
            <li><strong>Admin Review:</strong> A human admin reviews the content, image, and safety of the tool.</li>
            <li><strong>Timeline:</strong> Most tools are approved within 24-48 hours.</li>
            <li><strong>Rejection:</strong> If rejected, you will receive an email explaining why (e.g., broken link, inappropriate content).</li>
          </ul>
        </div>
      )
    },
    'Editing your tool': {
      title: 'Editing Your Tool',
      content: (
        <div className="space-y-4">
          <p>Need to update your listing?</p>
          <p>Currently, only Admins can edit live listings to ensure quality consistency.</p>
          <p>If you are the owner, please use the <strong>"Contact Support"</strong> form with the subject "Edit Request" and provide the new details. We are building a "Claim Tool" feature for self-service editing soon.</p>
        </div>
      )
    },
    'Subscription plans': {
      title: 'Subscription Plans',
      content: (
        <div className="space-y-4">
          <p>AI Tools Hub offers flexible plans:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li><strong>Free User:</strong> Unlimited browsing, search, and bookmarks.</li>
            <li><strong>Pro (Coming Soon):</strong> Advanced analytics, API access, and ad-free experience.</li>
            <li><strong>Tool Creator:</strong> Featured listings and traffic analytics for your submitted tools.</li>
          </ul>
        </div>
      )
    },
    'Canceling subscription': {
      title: 'Canceling Subscription',
      content: (
        <div className="space-y-4">
          <p>You can cancel anytime:</p>
          <ol className="list-decimal pl-5 space-y-2 text-gray-300">
            <li>Go to <strong>Settings</strong><strong>Billing</strong>.</li>
            <li>Click <strong>"Manage Subscription"</strong> (opens Stripe portal).</li>
            <li>Select <strong>Cancel Plan</strong>.</li>
          </ol>
          <p>Your premium benefits will continue until the end of the current billing cycle.</p>
        </div>
      )
    },
    'Contact support': {
      title: 'Contact Support',
      content: (
        <div className="space-y-4">
          <p>We are here to help!</p>
          <p>You can reach us via:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li><strong>Form:</strong> Use the "Contact Support" button at the bottom of this page.</li>
            <li><strong>Email:</strong> support@aitoolshub.com</li>
            <li><strong>Discord:</strong> Join our community server for quick peer support.</li>
          </ul>
        </div>
      )
    }
  };

  const categories = [
    { 
      icon: <FaRocket />, 
      title: 'Getting Started', 
      desc: 'Everything you need to know to navigate AI Tools Hub.',
      links: ['How to search for tools', 'Filtering by category', 'Using bookmarks']
    },
    { 
      icon: <FaUserCog />, 
      title: 'Account & Profile', 
      desc: 'Manage your personal settings and preferences.',
      links: ['Updating your profile', 'Resetting password', 'Privacy settings']
    },
    { 
      icon: <FaTools />, 
      title: 'Submitting Tools', 
      desc: 'Guidelines for developers and tool creators.',
      links: ['Submission guidelines', 'Verification process', 'Editing your tool']
    },
    { 
      icon: <FaShieldAlt />, 
      title: 'Billing & Support', 
      desc: 'Information about plans and contacting our team.',
      links: ['Subscription plans', 'Canceling subscription', 'Contact support']
    },
  ];

  const faqs = [
    { 
      q: 'How do I add a new AI tool to the hub?', 
      a: 'To add a tool, navigate to the "Submit Tool" page from the sidebar. You will need to provide the tool name, a brief description, the website URL, and select a relevant category. Our team reviews all submissions within 24-48 hours.' 
    },
    { 
      q: 'Is AI Tools Hub free to use?', 
      a: 'Yes, browsing, searching, and saving tools to your favorites is completely free for all users. We may introduce premium features for tool developers in the future to highlight their products.' 
    },
    { 
      q: 'Can I suggest a new category?', 
      a: 'Absolutely! We love community feedback. If you find a tool that doesn\'t fit into existing categories, please contact us via the support form or join our Discord community to suggest new additions.' 
    },
    { 
      q: 'My tool information is incorrect. How can I fix it?', 
      a: 'If you are the owner of the tool, please log in and navigate to your dashboard to request an edit. Alternatively, use the main contact form to report the inaccuracy, and we will update it promptly.' 
    },
  ];

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  // Filter content based on search query
  const filteredCategories = categories.filter(cat => {
    const q = searchQuery.toLowerCase();
    return (
      cat.title.toLowerCase().includes(q) || 
      cat.desc.toLowerCase().includes(q) || 
      cat.links.some(link => link.toLowerCase().includes(q))
    );
  });

  const filteredFaqs = faqs.filter(faq => {
    const q = searchQuery.toLowerCase();
    return (
      faq.q.toLowerCase().includes(q) || 
      faq.a.toLowerCase().includes(q)
    );
  });

  const hasResults = filteredCategories.length > 0 || filteredFaqs.length > 0;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans relative overflow-x-hidden selection:bg-teal-500/30">
      
       {/* Global Background (Custom Black/Teal Theme) */}
       <div className="fixed inset-0 z-0 pointer-events-none">
         {/* Top Center Teal Glow */}
         <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[800px] h-[500px] bg-teal-900/20 rounded-full blur-[120px]" />
         {/* Bottom Right Subtle Glow */}
         <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-teal-900/10 rounded-full blur-[100px]" />
         
         {/* Tech Grid Overlay */}
         <div className="absolute inset-0 opacity-[0.03]" 
              style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px)', backgroundSize: '50px 50px' }} 
         />

         {/* Giant Watermark Text */}
         <div className="absolute top-32 left-1/2 -translate-x-1/2 font-bold text-[20vw] leading-none text-white/[0.02] select-none tracking-tighter font-sans">
           HELP
         </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 flex flex-col items-center">
        
        {/* Header Section */}
        <m.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl w-full mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
            Help Center
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-white drop-shadow-sm">
            How can we help you?
          </h1>
          <p className="text-lg text-gray-300 mb-10">
            Search our knowledge base for answers to common questions.
          </p>

          {/* Search Bar */}
          <div className="relative group max-w-2xl mx-auto">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
            <div className="relative flex items-center bg-[#0F0F0F] border border-white/10 rounded-xl p-2 shadow-2xl">
              <FaSearch className="text-gray-400 ml-4 text-lg" />
              <input 
                type="text" 
                placeholder="Search articles (e.g., 'password', 'submit tool')..." 
                className="w-full bg-transparent text-white px-4 py-3 focus:outline-none placeholder-gray-500 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-medium transition-colors text-sm">
                Search
              </button>
            </div>
          </div>
        </m.div>

        {!hasResults && searchQuery.length > 0 ? (
          <m.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-center py-20"
          >
            <h3 className="text-xl text-gray-400">No results found for "{searchQuery}"</h3>
            <p className="text-sm text-gray-600 mt-2">Try checking for typos or using different keywords.</p>
          </m.div>
        ) : (
          <>
            {/* Categories Grid */}
            {filteredCategories.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-20">
                {filteredCategories.map((cat, i) => (
                  <m.div
                    key={cat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i, duration: 0.5 }}
                    className="group p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-teal-500/30 hover:bg-white/[0.07] backdrop-blur-sm transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-blue-500/20 flex items-center justify-center text-teal-400 text-xl mb-5 group-hover:scale-110 transition-transform duration-300">
                      {cat.icon}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{cat.title}</h3>
                    <p className="text-sm text-gray-400 mb-6 min-h-[40px] leading-relaxed">{cat.desc}</p>
                    
                    <ul className="space-y-3">
                      {cat.links.map((link, j) => (
                        <li key={j}>
                          <button 
                             onClick={() => {
                               if (articles[link]) {
                                 setSelectedArticle(articles[link]);
                               } else {
                                 console.warn('No article found for:', link);
                               }
                             }}
                             className="text-sm text-gray-400 hover:text-teal-300 transition-colors flex items-center gap-2 group-hover:translate-x-1 duration-200 text-left w-full"
                          >
                            <FaExternalLinkAlt className="text-[10px] opacity-50 shrink-0" />
                            {link}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </m.div>
                ))}
              </div>
            )}

            {/* FAQ Section */}
            {filteredFaqs.length > 0 && (
              <div className="w-full max-w-3xl mb-24">
                <m.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-center mb-10"
                >
                  <h2 className="text-3xl font-bold mb-4">{searchQuery ? 'Matching FAQs' : 'Frequently Asked Questions'}</h2>
                </m.div>
                
                <div className="space-y-4">
                  {filteredFaqs.map((faq, i) => (
                    <m.div 
                      key={faq.q}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="border border-white/10 rounded-xl bg-white/[0.02] overflow-hidden hover:border-white/20 transition-colors"
                    >
                      <button 
                        onClick={() => toggleAccordion(i)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                      >
                        <span className="font-medium text-gray-200 text-lg pr-4">{faq.q}</span>
                        <FaChevronDown className={`text-gray-500 shrink-0 transition-transform duration-300 ${activeAccordion === i ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {activeAccordion === i && (
                          <m.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="p-5 pt-0 text-gray-400 leading-relaxed border-t border-white/5">
                              {faq.a}
                            </div>
                          </m.div>
                        )}
                      </AnimatePresence>
                    </m.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer Support CTA */}
        <m.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-4xl p-8 rounded-3xl bg-gradient-to-r from-teal-900/20 to-blue-900/20 border border-teal-500/20 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 text-2xl">
               <FaEnvelope />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Still need help?</h3>
              <p className="text-gray-400 text-sm mt-1">Our support team is available 24/7 to assist you.</p>
            </div>
          </div>
          <button 
            onClick={() => history.push('/contact')}
            className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg hover:shadow-teal-500/20"
          >
            Contact Support
          </button>
        </m.div>

      </div>

      {/* Article Modal */}
      <AnimatePresence>
          {selectedArticle && (
              <div 
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                  onClick={() => setSelectedArticle(null)}
              >
                  <m.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl relative flex flex-col"
                  >
                      {/* Modal Header */}
                      <div className="p-6 border-b border-white/10 sticky top-0 bg-[#111] z-10 flex justify-between items-center">
                          <h2 className="text-2xl font-bold text-white">{selectedArticle.title}</h2>
                          <button 
                              onClick={() => setSelectedArticle(null)}
                              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                          >
                              ✕
                          </button>
                      </div>
                      
                      {/* Modal Body */}
                      <div className="p-8 text-gray-300 leading-relaxed text-lg">
                          {selectedArticle.content}
                      </div>

                      {/* Modal Footer */}
                      <div className="p-6 border-t border-white/10 bg-white/[0.02] flex justify-end">
                          <button 
                              onClick={() => setSelectedArticle(null)}
                              className="px-6 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold transition-colors"
                          >
                              Close
                          </button>
                      </div>
                  </m.div>
              </div>
          )}
      </AnimatePresence>

    </div>
  );
};

export default Help;