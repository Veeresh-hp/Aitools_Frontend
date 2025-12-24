import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaLink, FaListUl, FaImage, FaLightbulb, FaCopy } from 'react-icons/fa';
import api from '../utils/api';
import bgVideo from '../assets/Cinematic_Mosaic_Wall_Animation.mp4';

// Searchable Dropdown (Combobox)
const SearchableSelect = ({ label, options, value, onChange, placeholder, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = React.useRef(null);

  // Sync internal input with external value
  useEffect(() => {
      const found = options.find(opt => opt.value === value);
      if (found) {
          setSearchTerm(found.label);
      } else {
          setSearchTerm(value || '');
      }
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on search term
  // Don't filter if the search term strictly matches the selected option's label to avoid empty list when selected
  const filteredOptions = options.filter(opt => 
     opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
      const val = e.target.value;
      setSearchTerm(val);
      setIsOpen(true);
      // Propagate the raw text to parent immediately so typing "New Cat" works
      onChange({ target: { name, value: val } });
  };

  const handleOptionClick = (opt) => {
      onChange({ target: { name, value: opt.value } }); // Provide the ID/Slug
      setSearchTerm(opt.label);
      setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="text-sm font-semibold text-gray-300 mb-2 block">{label}</label>
      <div className={`relative w-full rounded-xl bg-[#0F0F0F] border ${isOpen ? 'border-blue-500/50 ring-2 ring-blue-500/20' : 'border-white/10'} transition-all hover:bg-white/5`}>
          <input
              type="text"
              name={name}
              className="w-full px-4 py-3 bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 outline-none rounded-xl pr-10"
              placeholder={placeholder}
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={() => setIsOpen(true)}
              autoComplete="off"
          />
          {/* Arrow Icon */}
          <div 
              className="absolute right-0 top-0 h-full w-10 flex items-center justify-center cursor-pointer text-gray-400"
              onClick={() => setIsOpen(!isOpen)}
          >
              <span className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
          </div>
      </div>
      
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-[#0F0F0F] backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 z-50 p-2 max-h-60 overflow-y-auto scrollbar-hide">
          <div className="space-y-1">
            {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <div 
                      key={opt.value} 
                      onClick={() => handleOptionClick(opt)} 
                      className={`px-4 py-3 rounded-xl cursor-pointer text-sm font-medium transition-all duration-200 flex items-center justify-between ${value === opt.value ? 'bg-blue-600/20 text-blue-200' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
                  >
                  {opt.label}
                  {value === opt.value && <span className="text-blue-400">✓</span>}
                  </div>
                ))
            ) : (
                <div className="px-4 py-3 text-sm text-gray-500 italic">
                    No matching categories. Press submit to create "{searchTerm}".
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const AddTool = ({ historyProp }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);

  const [form, setForm] = useState({
    name: '',
    shortDescription: '',
    description: '',
    url: '',
    category: '', // This will hold the slug OR the typed name
    categoryDisplay: '', // This holds the display value (Name)
    pricing: 'Free',
    hashtags: ''
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showQuickFill, setShowQuickFill] = useState(false);
  const [promptMode, setPromptMode] = useState('json'); // 'json' or 'text'
  const [isDragging, setIsDragging] = useState(false);
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  // Paste Support (Step 3)
  useEffect(() => {
    const handlePaste = (e) => {
        if (currentStep === 3 && e.clipboardData.files.length > 0) {
            const pastedFile = e.clipboardData.files[0];
            if (pastedFile.type.startsWith('image/')) {
                setFile(pastedFile);
                e.preventDefault();
            }
        }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [currentStep]);

  // Drag & Drop Handlers
  const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragging(true);
  };
  const handleDragLeave = (e) => {
      e.preventDefault();
      setIsDragging(false);
  };
  const handleDrop = (e) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          const droppedFile = e.dataTransfer.files[0];
          if (droppedFile.type.startsWith('image/')) {
              setFile(droppedFile);
          }
      }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/api/categories');
        const fetchedCategories = res.data.map(c => ({ id: c.slug, name: c.name }));
        setCategories(fetchedCategories);
      } catch (err) {
        console.error('Failed to fetch categories', err);
        setMessage(`⚠️ Failed to load categories: ${err.message || 'Server error'}`);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      let snapshotUrl = '';
      if (file) {
        const formData = new FormData();
        formData.append('snapshot', file);
        const uploadRes = await api.post('/api/tools/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        snapshotUrl = uploadRes.data.url;
      }

      let finalCategory = '';
      
      // Resolve Category
      // Check if current form.category (which might be Name or Slug or Typed Text) matches an existing category
      const exactMatch = categories.find(c => c.name.toLowerCase() === form.category.toLowerCase() || c.id === form.category);
      
      if (exactMatch) {
          finalCategory = exactMatch.id;
      } else {
          // Custom category - create it
          try {
              const catRes = await api.post('/api/categories/request', { name: form.category });
              finalCategory = catRes.data.category.slug;
          } catch (catErr) {
              console.error('Failed to create custom category', catErr);
              // Fallback: just send what they typed (backend might reject if stringent, but tool model allows string)
              finalCategory = form.category;
          }
      }

      const toolData = {
        ...form,
        category: finalCategory,
        snapshotUrl,
        hashtags: form.hashtags ? form.hashtags.split(/[\s,]+/).filter(tag => tag.trim() !== '') : []
      };

      await api.post('/api/tools/submit', toolData);
      setMessage('✅ Tool submitted successfully! It will be reviewed by an admin.');
      setForm({ name: '', shortDescription: '', description: '', url: '', category: '', categoryDisplay: '', pricing: 'Free', hashtags: '' });
      setFile(null);
      setCurrentStep(1); // Reset to step 1
    } catch (err) {
      console.error('Submit error:', err);
      setMessage(err.response?.data?.error || err.message || 'Failed to submit tool');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- WIZARD LOGIC ---
  const steps = [
    { id: 1, title: 'Essentials', desc: 'Identify your tool', icon: FaLink },
    { id: 2, title: 'Details', desc: 'Describe functionality', icon: FaListUl },
    { id: 3, title: 'Visuals', desc: 'Add screenshot', icon: FaImage }
  ];

  const validateStep = (step) => {
    if (step === 1) return form.name && form.url && form.category && form.pricing;
    if (step === 2) return form.shortDescription && form.description;
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setDirection(1);
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    } else {
      // Could add a shake animation or toast here
      alert('Please fill in all required fields.');
    }
  };

  const prevStep = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  // Reusable Dropdown (kept from previous code)
  const CustomDropdown = ({ label, options, value, onChange, placeholder, name, dropUp = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = React.useRef(null);
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const selectedOption = options.find(opt => opt.value === value);
    return (
      <div className="relative" ref={dropdownRef}>
        <label className="text-sm font-semibold text-gray-300 mb-2 block">{label}</label>
        <div onClick={() => setIsOpen(!isOpen)} className={`w-full px-4 py-3 rounded-xl bg-[#0F0F0F] border ${isOpen ? 'border-blue-500/50 ring-2 ring-blue-500/20' : 'border-white/10'} text-white cursor-pointer flex items-center justify-between transition-all hover:bg-white/5`}>
          <span className={!selectedOption ? "text-gray-400" : ""}>{selectedOption ? selectedOption.label : placeholder}</span>
          <span className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
        </div>
        {isOpen && (
          <div className={`absolute left-0 w-full bg-[#0F0F0F] backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 z-50 p-2 max-h-60 overflow-y-auto scrollbar-hide ${dropUp ? 'bottom-full mb-2' : 'top-full mt-2'}`}>
            <div className="space-y-1">
              {options.map((opt) => (
                <div key={opt.value} onClick={() => { onChange({ target: { name, value: opt.value } }); setIsOpen(false); }} className={`px-4 py-3 rounded-xl cursor-pointer text-sm font-medium transition-all duration-200 flex items-center justify-between ${value === opt.value ? 'bg-blue-600/20 text-blue-200' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}>
                  {opt.label}
                  {value === opt.value && <span className="text-blue-400">✓</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- QUICK FILL LOGIC ---
  const handleQuickFill = (text) => {
      if (!text) return;

      // Helper to strip markdown links if ChatGPT provides them: [url](url) -> url
      const cleanUrl = (val) => {
          if (!val) return '';
          const match = val.match(/\[.*?\]\((.*?)\)/);
          return match ? match[1] : val;
      };
      
      try {
          // 1. Try Valid JSON first
          let jsonToParse = text;
          const firstBrace = text.indexOf('{');
          const lastBrace = text.lastIndexOf('}');
          
          // If valid braces found, extract just the JSON part to ignore headers/footers
          if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
              jsonToParse = text.substring(firstBrace, lastBrace + 1);
          }

          const data = JSON.parse(jsonToParse);
          setForm(prev => ({ 
              ...prev, 
              name: data.name || prev.name,
              url: cleanUrl(data.url) || prev.url, 
              shortDescription: data.shortDescription || prev.shortDescription,
              description: data.description || prev.description,
              category: data.category || prev.category,
              pricing: data.pricing || prev.pricing,
              hashtags: data.hashtags || prev.hashtags,
          }));
          setMessage('✅ Auto-filled from JSON!');
      } catch (e) {
          // 2. Fallback to Line-by-Line Text Parsing
          const lines = text.split('\n');
          const newForm = { ...form };
          let updated = false;

          lines.forEach(line => {
              if (line.includes(':')) {
                  const [key, ...valParts] = line.split(':');
                  const value = valParts.join(':').trim();
                  const k = key.trim().toLowerCase();

                  if (value) {
                      if (k.includes('name')) { newForm.name = value; updated = true; }
                      else if (k.includes('url')) { newForm.url = cleanUrl(value); updated = true; }
                      else if (k.includes('short')) { newForm.shortDescription = value; updated = true; }
                      else if (k.includes('description') || k.includes('desc')) { newForm.description = value; updated = true; }
                      else if (k.includes('category')) { newForm.category = value; updated = true; }
                      else if (k.includes('pricing')) { newForm.pricing = value; updated = true; }
                      else if (k.includes('hashtag')) { newForm.hashtags = value; updated = true; }
                  }
              }
          });

          if (updated) {
              setForm(newForm);
              setMessage('✅ Auto-filled from Text!');
          } else {
              alert('Could not parse text. Use format "Key: Value" (e.g. Name: MyTool)');
              return; // Don't close modal if failed
          }
      }
      setShowQuickFill(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  // Pricing Options
  const PRICING_OPTIONS = ['Free', 'Freemium', 'Paid', 'Free Trial', 'Contact'];

  // Helper: Get comma-separated list of categories for the prompt
  // Include the user's typed category if it's not already in the list to trigger the AI to use it
  const categoryListString = [
      ...categories.map(c => c.name),
      (form.category && !categories.find(c => c.name.toLowerCase() === form.category.toLowerCase()) ? form.category : null)
  ].filter(Boolean).join(', ');
  
  // Dynamic Prompt Construction
  const jsonPromptText = `Analyze the tool at ${form.url || form.name || 'this URL'} and generate a JSON object for my directory AI Tools Hub.

Return ONLY this raw JSON structure (no markdown, no backticks):

{
  "name": "Tool Name",
  "url": "${form.url || 'https://...'}",
  "shortDescription": "Max 150 chars catchy summary, user-friendly.",
  "description": "1-2 short professional paragraphs explaining main features and value. Avoid hype.",
  "category": "Choose ONE best fit from: ${categoryListString || '(Loading categories...)'}",
  "pricing": "Choose ONE from: ${PRICING_OPTIONS.join(', ')}",
  "hashtags": "#Tag1 #Tag2 #Tag3"
}`;

  const textPromptText = `Create a clean AI tool listing for ${form.url || form.name || 'this URL'} for AI Tools Hub.

Format:
Name: [Tool Name]
URL: ${form.url || 'https://...'}
Category: [Choose from: ${categoryListString || '(Loading categories...)'}]
Pricing: [Choose from: ${PRICING_OPTIONS.join(', ')}]
Short Description: [Max 150 chars]
Description: [1-2 professional paragraphs]
Hashtags: #Tag1 #Tag2`;

  const activePrompt = promptMode === 'json' ? jsonPromptText : textPromptText;

  // Image Preview Side Effect
  const [previewUrl, setPreviewUrl] = useState(null);
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Video */}
      <div className="fixed inset-0 z-0">
          <video src={bgVideo} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
      </div>

      {/* Main Container - GRID with Sidebar */}
      <div className="w-full max-w-7xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT SIDEBAR (Progress Flow) */}
        <div className="lg:col-span-3 bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl relative">
             <div className="mb-8">
                 <h1 className="text-2xl font-bold text-white mb-2">Submit Tool</h1>
                 <p className="text-gray-400 text-sm mb-4">Follow the steps to list your AI tool.</p>
                 
                 {/* Quick Fill Button */}
                 <button 
                    onClick={() => setShowQuickFill(true)}
                    className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                 >
                    <span>⚡</span> Quick Fill
                 </button>
             </div>

             <div className="flex justify-between items-start lg:block lg:space-y-6 relative">
                 {/* Connecting Line (Vertical - Desktop) */}
                 <div className="hidden lg:block absolute left-[15px] top-4 bottom-4 w-[2px] bg-white/10 z-0"></div>
                 {/* Connecting Line (Horizontal - Mobile) */}
                 <div className="lg:hidden absolute top-[15px] left-4 right-4 h-[2px] bg-white/10 z-0"></div>

                 {steps.map((step) => {
                     const isCompleted = currentStep > step.id;
                     const isActive = currentStep === step.id;
                     
                     return (
                         <div key={step.id} className={`relative z-10 flex flex-col lg:flex-row items-center gap-2 lg:gap-4 transition-all duration-300 ${isActive || isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                             {/* Icon Circle */}
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 shrink-0 ${isCompleted ? 'bg-green-500 border-green-500' : isActive ? 'bg-[#FF6B00] border-[#FF6B00]' : 'bg-black border-white/20'}`}>
                                 {isCompleted ? <FaCheck className="text-white text-xs" /> : <step.icon className="text-white text-xs" />}
                             </div>
                             
                             {/* Text */}
                             <div className="text-center lg:text-left">
                                 <h3 className={`text-[10px] lg:text-sm font-bold ${isActive ? 'text-white' : 'text-gray-300'}`}>{step.title}</h3>
                                 <p className="text-xs text-gray-500 hidden xl:block">{step.desc}</p>
                             </div>
                         </div>
                     );
                 })}
             </div>
        </div>

        {/* CENTER CONTENT (Form) */}
        <motion.div 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="lg:col-span-6 bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl relative"
        >
          {/* Form Header (Simplified) */}
          <div className="mb-8 flex items-center justify-between">
             <h2 className="text-xl font-bold text-white tracking-tight">{steps[currentStep-1].title}</h2>
             <span className="text-xs font-mono text-[#FF6B00] border border-[#FF6B00]/30 px-2 py-1 rounded bg-[#FF6B00]/10">Step {currentStep}/3</span>
          </div>

          {message && (
            <div className={`mb-6 p-3 rounded-lg text-sm font-medium ${message.includes('successfully') ? 'bg-green-500/20 border border-green-500/50 text-green-300' : 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-300'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
             <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                   {/* STEP 1: ESSENTIALS */}
                   {currentStep === 1 && (
                      <>
                         <input name="name" value={form.name} onChange={handleChange} autoFocus placeholder="Tool Name *" className="w-full px-4 py-3 rounded-lg bg-gray-700/40 border border-white/20 text-white placeholder-gray-400 focus:bg-gray-700/60 focus:border-[#FF6B00]/50 transition-all outline-none" />
                         
                         <input name="url" value={form.url} onChange={handleChange} placeholder="Tool URL (https://...) *" className="w-full px-4 py-3 rounded-lg bg-gray-700/40 border border-white/20 text-white placeholder-gray-400 focus:bg-gray-700/60 focus:border-[#FF6B00]/50 transition-all outline-none" />

                         <div className="grid grid-cols-1 gap-4">
                            {/* Searchable Category Input */}
                            <SearchableSelect 
                                label="Category *" 
                                options={categories.map(c => ({ value: c.id, label: c.name }))}
                                value={form.category} 
                                onChange={handleChange} 
                                name="category" 
                                placeholder="Type or Select Category" 
                            />

                            <CustomDropdown label="Pricing *" options={PRICING_OPTIONS.map(p => ({ value: p, label: p }))} value={form.pricing} onChange={handleChange} name="pricing" placeholder="Select Pricing" dropUp={true} />
                         </div>
                      </>
                   )}

                   {/* STEP 2: DETAILS */}
                   {currentStep === 2 && (
                      <>
                         <textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} autoFocus placeholder="Short Description (max 150 chars) *" rows={3} maxLength={150} className="w-full px-4 py-3 rounded-lg bg-gray-700/40 border border-white/20 text-white placeholder-gray-400 focus:bg-gray-700/60 focus:border-[#FF6B00]/50 transition-all outline-none resize-none" />
                         
                         <textarea name="description" value={form.description} onChange={handleChange} placeholder="Full Description / Details *" rows={6} className="w-full px-4 py-3 rounded-lg bg-gray-700/40 border border-white/20 text-white placeholder-gray-400 focus:bg-gray-700/60 focus:border-[#FF6B00]/50 transition-all outline-none resize-none" />

                         <div>
                           <label className="text-xs font-semibold text-gray-400 mb-2 block uppercase">Hashtags</label>
                           <input name="hashtags" value={form.hashtags} onChange={handleChange} placeholder="#AI #Design..." className="w-full px-4 py-3 rounded-lg bg-gray-700/40 border border-white/20 text-white placeholder-gray-400 focus:bg-gray-700/60 focus:border-[#FF6B00]/50 transition-all outline-none" />
                           <div className="mt-2 flex flex-wrap gap-2">
                             {['#AI', '#Design', '#Code', '#Writing'].map(tag => (
                               <button type="button" key={tag} onClick={() => setForm(prev => ({ ...prev, hashtags: prev.hashtags ? `${prev.hashtags} ${tag}` : tag }))} className="px-2 py-1 text-[10px] rounded-md bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all">
                                 {tag}
                               </button>
                             ))}
                           </div>
                         </div>
                      </>
                   )}

                   {/* STEP 3: VISUALS */}
                   {currentStep === 3 && (
                      <>
                         <div 
                             className={`border-2 border-dashed rounded-xl p-8 text-center transition-all group cursor-pointer relative overflow-hidden ${isDragging ? 'border-[#FF6B00] bg-[#FF6B00]/10 scale-[1.02]' : 'border-white/10 hover:border-[#FF6B00]/50 bg-black/20'}`}
                             onDragOver={handleDragOver}
                             onDragLeave={handleDragLeave}
                             onDrop={handleDrop}
                         >
                           <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                           <div className="flex flex-col items-center pointer-events-none relative z-20">
                               {previewUrl ? (
                                  <div className="relative">
                                     <img src={previewUrl} alt="Preview" className="max-h-48 rounded-lg shadow-2xl border border-white/20 mb-3" />
                                     <div className="flex items-center justify-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                        <span>✅ {file.name}</span>
                                     </div>
                                  </div>
                               ) : (
                                  <>
                                     <span className={`text-3xl mb-2 transition-transform ${isDragging ? 'scale-125' : 'group-hover:scale-110'}`}>📸</span>
                                     <p className="text-sm text-gray-300 font-medium">{isDragging ? 'Drop it here!' : 'Click, Paste, or Drop screenshot'}</p>
                                     <p className="text-xs text-gray-500 mt-1">PNG, JPG (Max 5MB)</p>
                                  </>
                               )}
                           </div>
                         </div>

                         {!file && <p className="text-center text-xs text-red-400">* Screenshot is required</p>}
                      </>
                   )}
                </motion.div>
             </AnimatePresence>

             {/* Navigation Buttons */}
             <div className="flex gap-4 mt-8 pt-6 border-t border-white/5">
                {currentStep > 1 && (
                  <button type="button" onClick={prevStep} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-all">
                    Back
                  </button>
                )}
                
                {currentStep < 3 ? (
                  <button type="button" onClick={nextStep} className="flex-1 py-3 rounded-xl bg-[#FF6B00] hover:bg-[#ff8533] text-white font-bold shadow-lg hover:shadow-[#FF6B00]/20 transition-all">
                    Next: {steps[currentStep].title}
                  </button>
                ) : (
                  <button type="submit" disabled={isSubmitting || !file} className="flex-1 py-3 rounded-xl bg-[#FF6B00] hover:bg-[#ff8533] text-white font-bold shadow-lg hover:shadow-[#FF6B00]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmitting ? 'Submitting...' : 'Submit Tool 🚀'}
                  </button>
                )}
             </div>
          </form>
        </motion.div>

        {/* RIGHT SIDEBAR (AI Helper) */}
        <div className="lg:col-span-3 space-y-4"> 
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
               className="bg-[#1A1A1A]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl"
            >
               <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-yellow-400/20 flex items-center justify-center">
                          <FaLightbulb className="text-yellow-400 text-sm" />
                      </div>
                      <h3 className="font-bold text-gray-200">AI Helper</h3>
                  </div>
                  
                  {/* Prompt Mode Toggle */}
                  <div className="flex bg-black/50 rounded-lg p-1 border border-white/10">
                      <button 
                        onClick={() => setPromptMode('json')}
                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${promptMode === 'json' ? 'bg-[#FF6B00] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                      >
                        JSON
                      </button>
                      <button 
                        onClick={() => setPromptMode('text')}
                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${promptMode === 'text' ? 'bg-[#FF6B00] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                      >
                        Text
                      </button>
                  </div>
               </div>
               
               <div className="mb-4">
                  <p className="text-xs text-gray-400 leading-relaxed mb-2">
                     Generate a professional description in seconds:
                  </p>
                  <ol className="text-[10px] text-gray-500 space-y-1 list-decimal list-inside font-mono">
                     <li>Enter your <span className="text-white">Tool URL</span>.</li>
                     <li>Copy the prompt below to <span className="text-white">ChatGPT</span>.</li>
                     <li>Copy the <b>{promptMode === 'json' ? 'JSON' : 'Text'} response</b>.</li>
                     <li>Click <b>⚡ Quick Fill</b> and paste it!</li>
                  </ol>
               </div>

               <div className="bg-black/50 p-3 rounded-xl border border-white/5 relative group">
                  <p className="text-[10px] text-gray-400 font-mono italic whitespace-pre-wrap max-h-60 overflow-y-auto pr-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#FF6B00]/50 transition-colors">
                     "{activePrompt}"
                  </p>
                  <button 
                    onClick={() => copyToClipboard(activePrompt)}
                    className="absolute top-2 right-2 p-2 rounded-lg bg-[#FF6B00]/10 hover:bg-[#FF6B00]/20 text-[#FF6B00] border border-[#FF6B00]/20 transition-all shadow-lg hover:shadow-[#FF6B00]/10 z-10 group-hover:scale-105"
                    title="Copy Prompt"
                  >
                     <FaCopy size={14} />
                  </button>
               </div>
               
               <div className="mt-3 flex gap-2">
                  <div className="h-1 flex-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-30"></div>
                  <div className="h-1 flex-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-30"></div>
               </div>
            </motion.div>

            {/* Extra Tip for Visuals */}
            {currentStep === 3 && (
                <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="bg-blue-500/10 backdrop-blur-xl p-6 rounded-3xl border border-blue-500/20 shadow-xl"
                >
                    <h3 className="font-bold text-blue-200 text-sm mb-2">📸 Image Tip</h3>
                    <p className="text-xs text-blue-200/70 leading-relaxed">
                       Use a clear, high-quality screenshot of your tool's dashboard or landing page. 16:9 aspect ratio works best!
                    </p>
                </motion.div>
            )}
        </div>
      </div>
      {/* QUICK FILL MODAL */}
      <AnimatePresence>
        {showQuickFill && (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                onClick={() => setShowQuickFill(false)}
            >
                <div 
                    className="w-full max-w-lg bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 shadow-2xl relative"
                    onClick={e => e.stopPropagation()}
                >
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        ⚡ Quick Fill
                    </h3>
                    <p className="text-xs text-gray-400 mb-4">
                        Paste JSON or text (e.g., <code>Name: Tool ...</code>) to auto-populate.
                    </p>
                    <textarea 
                        autoFocus
                        className="w-full h-48 bg-black/50 border border-white/10 rounded-xl p-4 text-sm text-white font-mono placeholder-gray-600 focus:border-[#FF6B00] outline-none resize-none"
                        placeholder={'{\n  "name": "My AI Tool",\n  "url": "https://...",\n  ...\n}\n\nOR\n\nName: My AI Tool\nURL: https://...'}
                        onKeyDown={(e) => {
                             if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                 handleQuickFill(e.target.value);
                             }
                        }}
                    />
                    <div className="flex justify-end gap-3 mt-4">
                        <button 
                            onClick={() => setShowQuickFill(false)}
                            className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={() => {
                                const ta = document.querySelector('textarea'); 
                                if(ta) handleQuickFill(ta.value);
                            }}
                            className="px-6 py-2 rounded-lg bg-[#FF6B00] hover:bg-[#ff8533] text-white font-bold shadow-lg shadow-orange-500/20"
                        >
                            Auto-Fill
                        </button>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AddTool;
// Fixed ESLint errors