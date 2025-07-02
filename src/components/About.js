import React from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim'; // ✅ use slim version, lighter and compatible

const About = () => {
  const particlesInit = async (main) => {
    await loadSlim(main); // ✅ fixed: use loadSlim not loadFull
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-pink-100 via-blue-100 to-emerald-100 dark:from-gray-800 dark:via-gray-900 dark:to-black">
      {/* Animated Particles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        className="absolute inset-0 z-0"
        options={{
          background: {
            color: { value: 'transparent' },
          },
          fpsLimit: 60,
          particles: {
            number: {
              value: 30,
              density: {
                enable: true,
                area: 800,
              },
            },
            color: {
              value: ['#ec4899', '#3b82f6', '#10b981'], // pink, blue, green
            },
            shape: {
              type: 'circle',
            },
            opacity: {
              value: 0.2,
            },
            size: {
              value: { min: 20, max: 40 },
              animation: {
                enable: true,
                speed: 2,
                minimumValue: 10,
                sync: false,
              },
            },
            move: {
              enable: true,
              speed: 1,
              direction: 'none',
              random: true,
              straight: false,
              outModes: {
                default: 'bounce',
              },
            },
          },
          detectRetina: true,
        }}
      />

      {/* Main About Content */}
      <section className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-16 py-24 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          About AI Tools Hub 🤖
        </h1>
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300">
          <p className="text-gray-800 dark:text-gray-200 mb-4">
            <span className="font-semibold">AI Tools Hub</span> is a curated platform dedicated to showcasing the most innovative and practical AI-powered tools available today. Whether you're a developer, designer, marketer, or simply curious about artificial intelligence, our mission is to connect you with cutting-edge solutions that enhance productivity and creativity.
          </p>
          <p className="text-gray-800 dark:text-gray-200 mb-4">
            From intelligent chatbots to advanced image generators and productivity boosters, we continuously explore, evaluate, and present tools that can transform your workflow and inspire new possibilities.
          </p>
          <p className="text-gray-800 dark:text-gray-200 mb-4">
            AI Tools Hub is built and maintained by <b>Veeresh H P</b>, a passionate technologist focused on simplifying AI adoption for everyone. We believe that artificial intelligence should be accessible, understandable, and beneficial to all.
          </p>
          <p className="text-gray-800 dark:text-gray-200">
            Stay connected as we expand our library, share insights, and help you navigate the evolving world of AI links in one tool at a time.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
