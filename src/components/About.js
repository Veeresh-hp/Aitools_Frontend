import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // 1. Import Link
import { motion as m } from 'framer-motion';
import { Brain, Sparkles, Users, Target, Rocket, Heart, Star, Zap, Shield, Code } from 'lucide-react';

const About = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered",
      description: "Cutting-edge artificial intelligence tools",
      color: "from-blue-400 to-cyan-400"
    },
    {
      icon: Rocket,
      title: "Productivity",
      description: "Boost your workflow and efficiency",
      color: "from-purple-400 to-pink-400"
    },
    {
      icon: Users,
      title: "Community",
      description: "Built for creators and innovators",
      color: "from-green-400 to-emerald-400"
    },
    {
      icon: Target,
      title: "Curated",
      description: "Hand-picked quality tools",
      color: "from-orange-400 to-red-400"
    }
  ];

  const stats = [
    { number: "50+", label: "AI Tools", icon: Zap },
    { number: "10k+", label: "Happy Users", icon: Users },
    { number: "99%", label: "Uptime", icon: Shield },
    { number: "24/7", label: "Support", icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
      </div>

      {/* Floating Animation Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <m.div
            key={i}
            className="absolute w-16 h-16 rounded-full border border-white/10"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              scale: Math.random() * 0.5 + 0.3,
            }}
            animate={{
              y: [0, -80, 0],
              x: [0, Math.random() * 60 - 30, 0],
              rotate: 360,
            }}
            transition={{
              duration: 25 + Math.random() * 15,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <m.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        >
          {/* Header Section */}
          <m.div variants={itemVariants} className="text-center mb-16">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <span className="font-black text-3xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">AI</span>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Brain className="text-white w-6 h-6" />
              </div>
              <span className="font-black text-3xl bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">TOOLS HUB</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-6">About Our Mission</h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Empowering creativity and productivity through cutting-edge AI tools, 
              carefully curated for innovators, creators, and dreamers worldwide.
            </p>
          </m.div>

          {/* Stats Section */}
          <m.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <m.div
                key={index}
                className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
                <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </m.div>
            ))}
          </m.div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            {/* Left Column - Story */}
            <m.div variants={itemVariants}>
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl opacity-50" />
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-yellow-400" />
                    Our Story
                  </h2>
                  <div className="space-y-4 text-gray-300 leading-relaxed">
                    <p>
                      <span className="font-semibold text-blue-400">AI Tools Hub</span> began as a passion project 
                      to democratize access to artificial intelligence. We recognized that while AI technology 
                      was advancing rapidly, finding and evaluating quality tools remained a challenge.
                    </p>
                    <p>
                      Our platform bridges this gap by curating, testing, and presenting the most innovative 
                      AI-powered solutions available today. From intelligent chatbots to advanced image 
                      generators, we continuously explore tools that can transform workflows and inspire creativity.
                    </p>
                    <p>
                      Built and maintained by <span className="font-semibold text-purple-400">Veeresh H P</span>, 
                      a passionate technologist dedicated to making AI accessible to everyone. We believe artificial 
                      intelligence should be understandable, beneficial, and available to all.
                    </p>
                  </div>
                </div>
              </div>
            </m.div>

            {/* Right Column - Vision */}
            <m.div variants={itemVariants}>
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl opacity-50" />
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <Target className="w-8 h-8 text-purple-400" />
                    Our Vision
                  </h2>
                  <div className="space-y-4 text-gray-300 leading-relaxed">
                    <p>
                      We envision a world where AI tools are not just accessible, but seamlessly integrated 
                      into creative and professional workflows. Our mission extends beyond simple curation—we 
                      aim to educate, inspire, and empower.
                    </p>
                    <p>
                      Whether you're a developer seeking automation tools, a designer exploring generative AI, 
                      a marketer leveraging data insights, or simply curious about artificial intelligence, 
                      we're here to guide your journey.
                    </p>
                    <p>
                      Join us as we continue expanding our library, sharing insights, and helping navigate 
                      the evolving landscape of AI—one innovative tool at a time. The future is intelligent, 
                      and it starts here.
                    </p>
                  </div>
                </div>
              </div>
            </m.div>
          </div>

          {/* Features Grid */}
          <m.div variants={itemVariants} className="mb-20">
            <h2 className="text-3xl font-bold text-center text-white mb-12">Why Choose AI Tools Hub?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <m.div
                  key={index}
                  className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center cursor-pointer"
                  whileHover={{ y: -8, scale: 1.03 }}
                  onHoverStart={() => setHoveredFeature(index)}
                  onHoverEnd={() => setHoveredFeature(null)}
                  transition={{ duration: 0.3 }}
                >
                  <m.div
                    className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl opacity-0 blur-xl`}
                    animate={{ opacity: hoveredFeature === index ? 0.2 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="relative z-10">
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </m.div>
              ))}
            </div>
          </m.div>

          {/* CTA Section */}
          <m.div variants={itemVariants} className="text-center">
            <div className="relative bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-white/20 rounded-3xl p-12">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl" />
              <div className="relative z-10">
                <h2 className="text-4xl font-bold text-white mb-4">Ready to Explore the Future?</h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Join thousands of creators, developers, and innovators who trust AI Tools Hub 
                  to discover the next generation of intelligent solutions.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  
                  {/* 2. Wrap the button with Link */}
                  <Link to="/">
                    <m.button
                      className="group relative w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 overflow-hidden"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <Rocket className="w-5 h-5" />
                        Explore Tools
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </m.button>
                  </Link>
                  
                  <m.button
                    className="flex items-center gap-2 w-full sm:w-auto justify-center px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-2xl hover:bg-white/5 transition-all duration-300 backdrop-blur-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Code className="w-5 h-5" />
                    View on GitHub
                  </m.button>
                </div>
              </div>
            </div>
          </m.div>

          {/* Footer Quote */}
          <m.div variants={itemVariants} className="text-center mt-16">
            <blockquote className="text-xl italic text-gray-400 max-w-3xl mx-auto">
              "The best way to predict the future is to create it. AI Tools Hub is our contribution 
              to building a more intelligent, creative, and productive tomorrow."
            </blockquote>
            <p className="text-purple-400 font-semibold mt-4">— Veeresh H P, Founder</p>
          </m.div>
        </m.div>
      </div>
    </div>
  );
};

export default About;