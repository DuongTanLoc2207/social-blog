import React from 'react';
import Header from './Header';

const Layout = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-gray-100 font-sans ${className}`}>
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default Layout;