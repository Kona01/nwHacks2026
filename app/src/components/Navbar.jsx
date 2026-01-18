import React, { useState } from 'react';
import { NavLink, Link } from "react-router-dom";
import LuckyButton from './LuckyButton';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Reference Styling: White text with sky-blue (#6EC4E8) hover/active states
  const navLinkStyles = ({ isActive }) =>
    `text-white text-[1rem] font-medium tracking-wide transition-all duration-300 hover:text-[#6EC4E8] ${isActive ? "text-[#6EC4E8]" : ""
    }`;

  const mobileNavLinkStyles = ({ isActive }) =>
    `block px-4 py-3 rounded-md text-base font-semibold transition-colors ${isActive ? "bg-[#0055B7] text-[#6EC4E8]" : "text-white hover:bg-[#0055B7]/50"
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-[#002145]/95 backdrop-blur-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center h-[72px]">

          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-[1.5rem] font-bold text-white tracking-wider">
              UBC <span className="text-[#6EC4E8]">Club Finder</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            <NavLink title="Search" to="/search" className={navLinkStyles}>
              Search
            </NavLink>
            <NavLink title="Home" to="/" className={navLinkStyles}>
              Home
            </NavLink>
            <NavLink title="Chat" to="/chat" className={navLinkStyles}>
              Chat
            </NavLink>
            {/* The LuckyButton should handle its own gradient styling internally 
                based on the reference: linear-gradient(135deg, #6EC4E8, #0055B7) */}
            <LuckyButton />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2 focus:outline-none transition-transform active:scale-90"
              aria-label="Toggle menu"
            >
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content - Styled with the same dark theme */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-[#002145] border-t border-white/10 ${isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className={mobileNavLinkStyles}
          >
            Test
          </NavLink>
          <NavLink
            to="/chat"
            onClick={() => setIsOpen(false)}
            className={mobileNavLinkStyles}
          >
            Chat
          </NavLink>
          <div className="pt-2 px-3">
            <LuckyButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;