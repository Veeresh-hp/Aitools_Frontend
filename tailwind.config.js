// tailwind.config.js
module.exports = {
  darkMode: 'class', // <--- Ensure this exact line is present
  content: [
    "./public/index.html",
    // This path is crucial. It tells Tailwind where to scan for classes.
    // Ensure it covers all your .js, .jsx, .ts, .tsx files in the src directory and its subdirectories.
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};