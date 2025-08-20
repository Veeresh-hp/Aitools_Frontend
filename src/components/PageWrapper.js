import React from 'react';

/**
 * The PageWrapper component.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child elements.
 * @param {string} [props.maxWidth='max-w-4xl'] - The max-width utility class.
 * @param {string} [props.className=''] - Additional class names.
 * @param {any} props.jsx - This prop is destructured to prevent it from being passed to the <main> element.
 * @param {object} props.rest - Any other props to be passed to the main element.
 */
const PageWrapper = ({ children, maxWidth = 'max-w-4xl', className = '', jsx, ...rest }) => {
  return (
    <main
      // We spread the 'rest' of the props here, allowing any other valid HTML attributes to be passed.
      {...rest}
      className={`relative pt-24 px-15 ${maxWidth} mx-auto bg-white dark:bg-gray-900 mt-0 md:mt-[-2cm] ${className}`}
    >
      {children}
    </main>
  );
};

export default PageWrapper;