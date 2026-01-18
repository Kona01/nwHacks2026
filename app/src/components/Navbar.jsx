import React, { useState } from 'react';
import { NavLink, Link } from "react-router-dom";
import LuckyButton from './LuckyButton';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Helper to manage active link styling
  const navLinkStyles = ({ isActive }) =>
    `text-gray-700 hover:text-blue-600 transition-colors ${isActive ? "text-blue-600 font-semibold" : ""}`;

  const mobileNavLinkStyles = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-base font-medium ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              UBC Club Finder
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink title="Home" to="/" className={navLinkStyles}>
              Home
            </NavLink>
            <NavLink title="Chat" to="/chat" className={navLinkStyles}>
              Chat
            </NavLink>
            <LuckyButton />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink
              to="/"
              onClick={() => setIsOpen(false)}
              className={mobileNavLinkStyles}
            >
              Home
            </NavLink>
            <NavLink
              to="/chat"
              onClick={() => setIsOpen(false)}
              className={mobileNavLinkStyles}
            >
              Chat
            </NavLink>
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 text-blue-600 font-medium hover:bg-blue-50"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;