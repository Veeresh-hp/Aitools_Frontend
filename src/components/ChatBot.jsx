import React, { useState, useRef, useEffect } from 'react';
import { X, Send, ExternalLink, Bot, Eraser, Sparkles, Wand2 } from 'lucide-react';
import { FaPaperPlane, FaMagic, FaExternalLinkAlt } from "react-icons/fa"; // Keep existing icons used in previous layout
import { motion, AnimatePresence } from 'framer-motion';
import { addRefToUrl } from '../utils/linkUtils'; 

// Import Logo
import LogoImage from '../assets/logo.png';
// Import local tools data
import toolsData from '../data/toolsData';

const quickReplies = [
  { label: "🖼️ Image Tools", action: "image" },
  { label: "✍️ Copywriting", action: "copywriting" },
  { label: "💻 Coding Help", action: "code" },
  { label: "🎁 Free Tools", action: "free" }
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hi there! 👋 I'm your AI Tools Assistant. I can help you find tools, compare options, or answer questions about pricing. What are you looking for today?", 
      sender: 'bot' 
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Context Memory State
  const [context, setContext] = useState({
      lastIntent: null,     // 'search', 'chat', 'greeting', 'comparison', 'pricing'
      lastTopic: null,      // 'image', 'code', etc.
      lastResults: [],      // Stored results from search
      shownCount: 0,        // How many results shown so far
      userPreferences: {
          budget: null, // 'free', 'paid'
          role: null    // 'student', 'developer'
      }
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Helper to flatten local tools data
  const getInitialTools = () => {
      // toolsData is array of { category: string, tools: [] }
      // Adjust based on actual structure inspection: const toolsData = [ {id, name, tools: []} ... ]
      if (Array.isArray(toolsData)) {
          return toolsData.flatMap(category => category.tools || []);
      }
      return [];
  };

  // Initialize with flattened local data
  const [allTools, setAllTools] = useState(getInitialTools());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 300);
    }
  }, [messages, isOpen]);

  // Fetch live tools and merge
  useEffect(() => {
    const fetchTools = async () => {
        try {
            const apiModule = await import('../utils/api');
            const api = apiModule.default;
            
            const response = await api.get('/api/tools/approved');
            if (response.data && response.data.tools) {
                const liveTools = response.data.tools;
                const localTools = getInitialTools();

                // Create a map of normalized tools to prevent duplicates
                // Priority: Live tools overwrite local tools with same name
                const toolsMap = new Map();

                // Add local tools first
                localTools.forEach(tool => {
                    toolsMap.set(tool.name.toLowerCase(), { ...tool, source: 'local' });
                });

                // Add/Overwrite with live tools
                liveTools.forEach(tool => {
                    toolsMap.set(tool.name.toLowerCase(), {
                        ...tool,
                        image: tool.snapshotUrl || tool.image || LogoImage,
                        isAiToolsChoice: tool.isAiToolsChoice,
                        source: 'live'
                    });
                });

                const mergedTools = Array.from(toolsMap.values());
                setAllTools(mergedTools);
            }
        } catch (error) {
            console.error("Failed to fetch live tools:", error);
            // Fallback is already set in initial state
        }
    };
    fetchTools();
  }, []);

  // --- ADVANCED LOGIC ---

  const updatePreferences = (text) => {
      const lower = text.toLowerCase();
      let updates = {};
      if (lower.includes('student') || lower.includes('learn')) updates.role = 'student';
      if (lower.includes('developer') || lower.includes('coder')) updates.role = 'developer';
      if (lower.includes('free') || lower.includes('no cost')) updates.budget = 'free';
      
      if (Object.keys(updates).length > 0) {
          setContext(prev => ({
              ...prev,
              userPreferences: { ...prev.userPreferences, ...updates }
          }));
      }
  };

  const detectIntent = (text) => {
      const lower = text.toLowerCase();
      if (lower.match(/compare|vs|better than/)) return 'comparison';
      if (lower.match(/price|cost|free|paid|subscription/)) return 'pricing';
      if (lower.match(/best|top|suggest|recommend|find|show/)) return 'discovery';
      if (lower.match(/learn|course|study|student|education/)) return 'education';
      if (lower.match(/how many|count|total|stats|number of tools/)) return 'stats';
      if (lower.match(/^(hi|hello|hey|greetings)/)) return 'greeting';
      if (lower.match(/more|next|continue/)) return 'continuation';
      return 'unknown';
  };

  const handleStats = () => {
      const count = allTools.length;
      return { 
          text: `I currently have access to **${count}** amazing AI tools depending on my data source! 🚀 \n\nI can help you search through all of them. Try 'Find image tools'.` 
      };
  };

  const handleGreeting = () => {
      setContext(prev => ({ ...prev, lastIntent: 'greeting', shownCount: 0 }));
      return { text: "Hello! 👋 Ready to explore AI tools? You can skip the search and ask things like 'Best free coding tools' or 'Compare ChatGPT and Claude'." };
  };

  const handleComparison = (text) => {
      const mentionedTools = allTools.filter(t => text.toLowerCase().includes(t.name.toLowerCase()));
      if (mentionedTools.length >= 2) {
          const [t1, t2] = mentionedTools.slice(0, 2);
          setContext(prev => ({ ...prev, lastIntent: 'comparison', lastResults: mentionedTools }));
          return {
              text: `Here's a quick comparison:\n\n**${t1.name}**\n• ${t1.description}\n• Pricing: ${t1.pricing || 'Check site'}\n\n**${t2.name}**\n• ${t2.description}\n• Pricing: ${t2.pricing || 'Check site'}\n\nWhich one fits your needs better?`,
              tools: [t1, t2]
          };
      }
      return { text: "I need two tool names to compare! Try 'Compare ChatGPT and Jasper'." };
  };

  const handlePricing = (text) => {
      const mentionedTools = allTools.filter(t => text.toLowerCase().includes(t.name.toLowerCase()));
      if (mentionedTools.length > 0) {
          const tool = mentionedTools[0];
          return { 
              text: `**${tool.name}** is listed as **${tool.pricing || 'Variable'}**. \nAlways verify on their official site as pricing can change.`,
              tools: [tool] 
          };
      }
      return { text: "Most tools here are Freemium. Ask about a specific tool, e.g., 'Is Midjourney free?'" };
  };

  const handleEducation = () => {
      const eduTools = allTools.filter(t => 
          (t.category?.toLowerCase().includes('education') || t.description.toLowerCase().includes('learning')) &&
          (t.pricing?.toLowerCase().includes('free') || t.pricing?.toLowerCase().includes('freemium'))
      );
      const topEdu = eduTools.sort((a, b) => (b.isAiToolsChoice ? 1 : 0) - (a.isAiToolsChoice ? 1 : 0)).slice(0, 4);
      setContext(prev => ({ lastIntent: 'education', lastResults: eduTools, shownCount: 4 }));
      return { text: "Here are some great tools for learning & education 🎓:", tools: topEdu };
  };

  const handleDiscovery = (text, currentContext, currentTools) => {
      const lower = text.toLowerCase();
      let categoryKeywords = [];
      if (lower.includes('image') || lower.includes('art')) categoryKeywords.push('image', 'art');
      if (lower.includes('code') || lower.includes('dev')) categoryKeywords.push('code', 'developer');
      if (lower.includes('write') || lower.includes('copy')) categoryKeywords.push('writing', 'copy');
      if (lower.includes('video')) categoryKeywords.push('video');

      let results = currentTools.filter(t => {
          const content = (t.name + t.description + (t.category || '')).toLowerCase();
          return categoryKeywords.some(k => content.includes(k)) || categoryKeywords.length === 0;
      });

      // Simple keyword match if no categorical keywords
      if (categoryKeywords.length === 0) {
           const query = lower.replace('best', '').replace('tools', '').trim();
           if (query) {
             results = currentTools.filter(t => (t.name + t.description + (t.tags?.join('') || '')).toLowerCase().includes(query));
           }
      }

      if (currentContext.userPreferences.budget === 'free') {
          results = results.filter(t => t.pricing?.toLowerCase().includes('free'));
      }

      // Rank: AI Choice first
      results.sort((a, b) => {
           const aScore = (a.isAiToolsChoice ? 2 : 0) + (a.badge === 'Recommended' ? 1 : 0);
           const bScore = (b.isAiToolsChoice ? 2 : 0) + (b.badge === 'Recommended' ? 1 : 0);
           return bScore - aScore;
      });

      const top = results.slice(0, 4);
      if (top.length > 0) {
          setContext(prev => ({ ...prev, lastIntent: 'discovery', lastResults: results, shownCount: 4 }));
          return { text: `Here are the top picks based on your request! 🚀`, tools: top };
      }
      return { text: "I couldn't find exact matches. Try 'Best image tools' or 'Free coding assistants'." };
  };

  const handleContinuation = () => {
      if (context.lastResults.length > context.shownCount) {
           const nextBatch = context.lastResults.slice(context.shownCount, context.shownCount + 3);
           setContext(prev => ({ ...prev, shownCount: prev.shownCount + 3 }));
           return { text: `Here are ${nextBatch.length} more results:`, tools: nextBatch };
      }
      return { text: "That's all I found! Ready for a new search?" };
  };

  const handleUnknown = (text) => {
      const lower = text.toLowerCase();
      const matched = allTools.filter(t => (t.name + t.description).toLowerCase().includes(lower));
      if (matched.length > 0) {
          const top = matched.slice(0, 3);
          setContext(prev => ({ lastIntent: 'search', lastResults: matched, shownCount: 3 }));
          return { text: `I found these tools mentioning "${text}":`, tools: top };
      }
      return { text: "I didn't quite get that. Try 'Find video tools' or 'Compare X and Y'." };
  };

  const getUpdatedPreferences = (text, currentPrefs) => {
      const lower = text.toLowerCase();
      let updates = {};
      if (lower.includes('student') || lower.includes('learn')) updates.role = 'student';
      if (lower.includes('developer') || lower.includes('coder')) updates.role = 'developer';
      if (lower.includes('free') || lower.includes('no cost')) updates.budget = 'free';
      
      return { ...currentPrefs, ...updates };
  };

  const generateSmartResponse = (userInput) => {
      // 1. Calculate new preferences immediately
      const newPreferences = getUpdatedPreferences(userInput, context.userPreferences || { budget: null, role: null });
      
      // Update state if changed
      if (JSON.stringify(newPreferences) !== JSON.stringify(context.userPreferences)) {
          setContext(prev => ({
              ...prev,
              userPreferences: newPreferences
          }));
      }

      // 2. Create a temporary context object allowed to satisfy the handlers immediately
      const tempContext = { ...context, userPreferences: newPreferences };

      const intent = detectIntent(userInput);
      
      switch (intent) {
          case 'greeting': return handleGreeting();
          case 'stats': return handleStats();
          case 'comparison': return handleComparison(userInput);
          case 'pricing': return handlePricing(userInput);
          case 'education': return handleEducation();
          case 'continuation': return handleContinuation();
          case 'discovery': return handleDiscovery(userInput, tempContext, allTools);
          default: return handleUnknown(userInput);
      }
  };
 
  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    const newUserMsg = { id: Date.now(), text: text, sender: 'user' };
    setMessages(prev => [...prev, newUserMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateSmartResponse(text);
      const newBotMsg = { 
        id: Date.now() + 1, 
        text: botResponse.text, 
        tools: botResponse.tools, 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, newBotMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const clearChat = () => {
    setMessages([{ 
      id: 1, 
      text: "Chat cleared! ✨ How can I help you today?", 
      sender: 'bot' 
    }]);
    setContext({ lastIntent: null, lastTopic: null, lastResults: [], shownCount: 0, userPreferences: { budget: null, role: null } });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Button */}
      {!isOpen && (
      <button
        onClick={() => setIsOpen(true)}
        className="w-16 h-16 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 active:scale-95 group relative"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
        }}
      >
          <div className="relative">
            <img src={LogoImage} alt="Chat" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900 shadow-lg shadow-green-400/50 animate-pulse" />
          </div>
      </button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
      {isOpen && (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-4 sm:right-6 z-[100] w-[90vw] sm:w-[380px] h-[600px] max-h-[80vh] rounded-3xl overflow-hidden flex flex-col font-sans border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]"
            style={{
                background: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
            }}
        >
          {/* Animated Background Blobs */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-purple-500/20 rounded-full blur-[80px] animate-pulse" />
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-cyan-500/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          {/* Header */}
          <div className="relative z-10 px-5 py-4 border-b border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full p-[1px] bg-gradient-to-tr from-cyan-400 to-purple-500">
                    <div className="w-full h-full rounded-full bg-slate-900/50 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                         <img src={LogoImage} alt="AI" className="w-full h-full object-cover opacity-90" />
                    </div>
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-slate-900 shadow-[0_0_8px_rgba(74,222,128,0.5)] animate-pulse" />
              </div>
              <div>
                <h3 className="text-white font-bold text-base tracking-wide flex items-center gap-1.5 shadow-black drop-shadow-md">
                  AI Hub Assistant
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                </h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 animate-pulse" />
                  <span className="text-[10px] text-cyan-200/80 font-medium tracking-wider uppercase">Online</span>
                </div>
              </div>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={clearChat}
                className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all hover:rotate-12 active:scale-95 group"
                title="Clear Chat"
              >
                <Eraser className="w-4 h-4 group-hover:text-pink-400 transition-colors" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all hover:scale-110 active:scale-95 hover:rotate-90 duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

        {/* Messages Area - Flex Grow */}
        <div 
            className="flex-1 min-h-0 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent relative z-10"
        >
            {messages.map((msg) => (
                <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} gap-1`}
                >
                    {/* Message Bubble */}
                    <div
                        className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-lg backdrop-blur-md border border-white/10 ${
                            msg.sender === 'user'
                                ? 'bg-gradient-to-br from-cyan-600/80 to-blue-600/80 text-white rounded-br-none'
                                : 'bg-white/10 text-gray-100 rounded-bl-none'
                        }`}
                    >
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>

                    {/* Tool Suggestions (Card Style) */}
                    {msg.tools && msg.tools.length > 0 && (
                        <div className="mt-2 w-[90%] space-y-2">
                            {msg.tools.map((tool, idx) => (
                                <motion.a 
                                    key={idx}
                                    href={addRefToUrl(tool.url)}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/50 transition-all group cursor-pointer text-left backdrop-blur-sm shadow-sm"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-black/40 overflow-hidden flex-shrink-0 border border-white/5">
                                        <img src={tool.image || LogoImage} alt={tool.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-medium text-xs truncate group-hover:text-cyan-300 transition-colors">{tool.name}</h4>
                                        <p className="text-gray-400 text-[10px] truncate">{tool.description}</p>
                                    </div>
                                    <FaExternalLinkAlt className="text-gray-500 text-xs group-hover:text-cyan-300" />
                                </motion.a>
                            ))}
                        </div>
                    )}
                    
                    <span className="text-[9px] text-gray-400/70 px-1">
                        {msg.sender === 'user' ? 'You' : 'AI Assistant'}
                    </span>
                </motion.div>
            ))}
            
            {isTyping && (
                <div className="flex justify-start">
                    <div className="bg-white/5 p-4 rounded-2xl rounded-bl-sm flex gap-1.5 items-center backdrop-blur-sm border border-white/10">
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies & Input Wrapper - Flex Footer */}
        <div className="flex-none bg-white/5 border-t border-white/10 backdrop-blur-md relative z-20">
            
                {/* Quick Replies */}
            {!isTyping && messages.length < 2 && (
                <div className="px-4 pt-3 flex gap-2 flex-wrap justify-center">
                    {quickReplies.map((qr) => (
                        <button
                            key={qr.label}
                            onClick={() => handleSend(qr.action)}
                            className="text-xs bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/50 text-cyan-100 hover:text-white px-3 py-1.5 rounded-full transition-all backdrop-blur-sm shadow-sm"
                        >
                            {qr.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Input Area */}
            <div className="p-4">
                <div className="relative group">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type to find tools..."
                        className="w-full bg-black/20 text-white pl-4 pr-12 py-3.5 rounded-xl border border-white/10 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10 focus:outline-none transition-all placeholder:text-gray-500 text-sm shadow-inner backdrop-blur-sm"
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={!input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-cyan-400 hover:bg-cyan-500/20 disabled:text-gray-600 disabled:hover:bg-transparent transition-all"
                    >
                        <FaPaperPlane className={`text-sm transform transition-transform ${input.trim() ? 'scale-110' : 'scale-100'}`} />
                    </button>
                </div>
                <div className="mt-2 text-center">
                    <span className="text-[9px] text-gray-500 flex items-center justify-center gap-1.5">
                        <FaMagic className="text-xs text-purple-400" /> AI Context Smart Search(Beta)
                    </span>
                </div>
            </div>
        </div>

        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;