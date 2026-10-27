import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <div className="relative bg-[#0D0D2B] min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-10 overflow-hidden">

      {/* Left PNG (rotated normally) */}
      <img
        src="/Ellipse 2.png"
        alt="Decorative Left"
        className="absolute left-0 top-0 h-full object-cover z-0"
      />

      {/* Right PNG (rotated 180 degrees) */}
      <img
        src="/Ellipse 2.png"
        alt="Decorative Right"
        className="absolute right-0 top-0 h-full object-cover rotate-180 z-0"
      />

      {/* Main content wrapper (should appear above background PNGs) */}
      <motion.div
        className="text-white max-w-xl z-10"
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <h1 className="text-5xl font-bold mb-4 relative inline-block">
          RoboMedi
          <span className="inline-block relative">
            <span className="inline-block">x</span>
            <motion.img
              src="/x-icon.png"
              alt="Icon"
              className="absolute top-[-20px] left-[20px] w-10 h-8"
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: 'linear'
              }}
            />
          </span>
        </h1>

        <p className="text-xl text-[#AAAAFF] mb-2">Your Personal AI Doctor 24/7</p>
        <p className="text-lg text-gray-300 mb-6">
          Get instant health insights, vitals monitoring, <br />
          and expert consultations — all in one place.
        </p>

        <Link
          to="/chatbot"
          className="bg-gray-400 hover:bg-gray-500 text-[#0D0D2B] font-semibold px-6 py-2 rounded transition duration-300"
        >
          Start Chatting
        </Link>
      </motion.div>

      {/* Right side image */}
      <div className="mt-10 md:mt-0 z-10">
        <img
          src="/robot.gif"
          alt="Robot"
          className="w-[300px] md:w-[400px] h-auto"
        />
      </div>
    </div>
  );
};

export default HeroSection;
