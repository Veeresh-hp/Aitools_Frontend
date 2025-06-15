import React from 'react';

const About = () => {
  return (
    <section className="px-4 sm:px-6 md:px-12 lg:px-16 py-14 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        About AI Tools Hub 🤖
      </h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          <span className="font-semibold">AI Tools Hub</span> is a curated platform dedicated to showcasing the most innovative and practical AI-powered tools available today. Whether you're a developer, designer, marketer, or simply curious about artificial intelligence, our mission is to connect you with cutting-edge solutions that enhance productivity and creativity.
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          From intelligent chatbots to advanced image generators and productivity boosters, we continuously explore, evaluate, and present tools that can transform your workflow and inspire new possibilities.
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          AI Tools Hub is built and maintained by <b>Veeresh H P</b>, a passionate technologist focused on simplifying AI adoption for everyone. We believe that artificial intelligence should be accessible, understandable, and beneficial to all.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          Stay connected as we expand our library, share insights, and help you navigate the evolving world of AI links in one tool at a time.
        </p>
      </div>
    </section>
  );
};

export default About;
