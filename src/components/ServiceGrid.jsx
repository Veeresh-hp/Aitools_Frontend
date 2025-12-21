import React from 'react';
import { motion } from 'framer-motion';

const ServiceGrid = () => {
  const services = [
    {
      id: "01",
      title: "Discover & Explore",
      description: "Browsing through thousands of AI tools is overwhelming. We curate the best ones so you don't have to.",
      linkText: "Start Exploring"
    },
    {
      id: "02",
      title: "Compare & Audit",
      description: "Not all AI models are equal. Compare features, pricing, and performance to find your perfect match.",
      linkText: "See Comparisons"
    },
    {
      id: "03",
      title: "Track & Integrate",
      description: "Fast integration guides and tracking for usage. getting your team up to speed with AI in record time.",
      linkText: "View Integrations"
    }
  ];

  return (
    <section className="py-24 px-6 sm:px-12 lg:px-24 bg-black relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Design Solutions That <br />
            <span className="text-gray-500">Elevate Your Workflow</span>
          </h2>
          <p className="text-gray-400 max-w-xl text-lg">
            From strategy to execution, we provide tailored AI resource discovery that helps you stand out and create meaningful work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="group relative p-8 rounded-2xl bg-[#050505] border border-white/5 hover:border-white/10 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              
              <div className="relative z-10">
                <span className="block text-5xl font-bold text-[#FF6B00] mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
                  {service.id}
                </span>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-gray-200">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-8">
                  {service.description}
                </p>
                
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider cursor-pointer group/link">
                  <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
                  {service.linkText}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceGrid;
