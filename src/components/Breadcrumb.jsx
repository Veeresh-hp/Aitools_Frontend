import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-400" aria-label="Breadcrumb">
      <Link 
        to="/" 
        className="flex items-center gap-1.5 hover:text-white transition-colors"
        aria-label="Home"
      >
        <FaHome className="text-xs" />
        <span>Home</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span className="text-gray-600">/</span>
          {item.link ? (
            <Link 
              to={item.link} 
              className="hover:text-white transition-colors capitalize"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-white capitalize">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
