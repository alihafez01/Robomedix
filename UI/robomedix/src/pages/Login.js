import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/login/', {
        email,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem('customer_id', response.data.customer_id);
        alert('Login successful');
        navigate('/'); // Redirect to home page
        window.location.reload(); // ⬅️ Force reload so Navbar updates
      }
    } catch (error) {
      alert('Login failed. Invalid email or password.');
      console.error(error);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen py-6 bg-[#0D0D2B] overflow-hidden">

      {/* === Side Decorative PNGs === */}
      <img
        src="/Ellipse 2.png"
        alt="Left Curve"
        className="absolute left-0 top-1/2 transform -translate-y-1/2 w-[280px] z-0 opacity-80"
      />
      <img
        src="/Ellipse 2.png"
        alt="Right Curve"
        className="absolute right-0 top-1/2 transform -translate-y-1/2 rotate-180 w-[280px] z-0 opacity-80"
      />

      {/* === Login Card === */}
      <div className="relative z-10 bg-[#4A4A88] bg-opacity-20 border border-[#4A4A88] rounded-lg shadow-lg shadow-[#4A4A88] p-6 sm:p-8 w-full max-w-md mx-4 sm:mx-auto">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="Logo" className="h-20 w-20" />
        </div>

        {/* Title */}
        <h2 className="text-white text-center text-xl sm:text-2xl mb-2 break-words">
          WELCOME BACK TO ROBOMEDIX
        </h2>
        <p className="text-[#4A4A88] text-center text-sm sm:text-base mb-6">
          Your Personal AI Doctor 24/7
        </p>

        {/* Input Fields */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4 relative">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="absolute left-0 top-1/2 bg-purple-600 text-white px-2.5 py-2.5 rounded transform -translate-y-1/2 text-[#4A4A88]"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 pl-9 rounded-lg bg-transparent border border-[#4A4A88] focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FontAwesomeIcon
              icon={faLock}
              className="absolute left-0 top-1/2 bg-purple-600 text-white px-2.5 py-2.5 rounded transform -translate-y-1/2 text-[#4A4A88]"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 pl-9 rounded-lg bg-transparent border border-[#4A4A88] focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Forgot Password */}
          <div className="mt-2 text-right text-[#4A4A88]">
            <Link
              to="/forgot-password"
              className="font-semibold hover:text-purple-600 transition duration-200"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="mt-6 w-full px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition duration-200"
          >
            Sign In
          </button>
        </form>

        {/* Sign Up Section */}
        <div className="mt-4 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <p className="text-[#4A4A88]">Don't have an account?</p>
            <Link
              to="/signup"
              className="bg-purple-600 text-white px-5 py-2 rounded font-semibold hover:bg-purple-700 transition duration-200"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
