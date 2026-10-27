// src/components/Navbar.js
import React, { useState, useEffect  } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // ⬅️ Used for logout redirection

  useEffect(() => {
    const customerId = localStorage.getItem('customer_id');
    setIsLoggedIn(!!customerId);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('customer_id');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="bg-[#0D0D2B] px-6 py-4 flex justify-between items-center shadow-lg">
      <div className="flex justify-between items-center shadow-lg container">
      {/* Logo */}
      <div className="flex items-center space-x-2 cursor-pointer">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="Logo" className="h-12 w-15" />
        </Link>
      </div>

      {/* Hamburger Menu Toggle (for mobile) */}
      <div className="flex items-center sm:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white hover:text-gray-300 focus:outline-none"
        >
          {isMenuOpen ? (
            <FontAwesomeIcon icon={faTimes} size="lg" />
          ) : (
            <FontAwesomeIcon icon={faBars} size="lg" />
          )}
        </button>
      </div>

      {/* Navigation Links (visible on desktop/tablet) */}
      <ul className="hidden sm:flex space-x-6 bg-[#1A1A50] px-3 py-2 rounded text-white uppercase font-semibold">

        <li>
          <Link to="/" className="hover:text-gray-300 transition duration-200">
            Home
          </Link>
        </li>
        <li>
          <a href="#features" className="hover:text-gray-300 transition duration-200">
          Features
          </a>
        </li>
        <li>
          <a href="#team" className="hover:text-gray-300 transition duration-200">
            Team
          </a>
        </li>
        <li>
          <Link to="/contact" className="hover:text-gray-300 transition duration-200">
            Contact
          </Link>
        </li>
      </ul>

      {/* Buttons */}
      <div className="flex space-x-1">
        {isLoggedIn ? (
    <button
      onClick={handleLogout}
      className="bg-[#1A1A50] text-white px-5 py-2 rounded transition duration-200"
    >
      Logout
    </button>
  ) : (
    <>
      <Link
        to="/login"
        className="text-white hover:text-white px-5 py-2 rounded-full transition duration-200"
      >
        Login
      </Link>
      <Link
        to="/signup"
        className="bg-[#0D0D2B] text-white bg-[#1A1A50] px-5 py-2 rounded transition duration-200"
      >
        Sign Up
      </Link>
    </>
  )}
      </div>

      {/* Responsive Navigation Menu (for mobile) */}
      {isMenuOpen && (
        <div className="sm:hidden absolute top-16 left-0 right-0 bg-[#1A1A50] p-4 z-50">
          <ul className="space-y-4">
            <li>
              <Link
                to="/"
                className="block text-white hover:text-gray-300 transition duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <a
              href="#features"
              className="block text-white hover:text-gray-300 transition duration-200">
              Features
            </a>
            </li>
            <li>
              <a href="#team" className="block text-white hover:text-gray-300 transition duration-200">
                Team
              </a>
            </li>
            <li>
              <Link
                to="/contact"
                className="block text-white hover:text-gray-300 transition duration-200"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      )}
      </div>
    </nav>
  );
};

export default Navbar;