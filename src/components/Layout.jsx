import React from 'react';
import Header from './Header';

const Layout = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-gray-100 font-sans ${className}`}>
      <Header />
      <main className="container mx-auto px-6 sm:px-6 md:px-10">{children}</main>
    </div>
  );
};

export default Layout;