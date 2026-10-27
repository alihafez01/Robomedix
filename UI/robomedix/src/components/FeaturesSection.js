// src/components/FeaturesSection.js
import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ iconPath, title, description, delay }) => (
  <motion.div
    className="bg-[#1A1A3D] border border-[#4A4A88] rounded-2xl p-6 text-white text-center shadow-lg shadow-[#4A4A88]"
    initial={{ opacity: 0, y: 80 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay }}
    viewport={{ once: true }}
  >
    <img
      src={iconPath}
      alt={title}
      className="w-24 h-24 mx-auto mb-4"
    />
    <h4 className="text-xl font-semibold mb-2">{title}</h4>
    <p className="text-sm text-gray-300">{description}</p>
  </motion.div>
);

const FeaturesSection = () => {
  return (
    <section id="features" className="bg-[#0D0D2B] py-20 px-6 md:px-20">
      {/* Top Label */}
      <div className="flex justify-center items-center mb-4 relative">
        {/* Left Line */}
        <div className="hidden sm:block w-16 h-px bg-gray-500 mr-2" />

        {/* Glowing Dot Left */}
        <span className="h-2 w-2 bg-white rounded-full shadow-[0_0_8px_2px_rgba(255,255,255,0.5)] mr-2"></span>

        {/* Rotating X Icon and Label */}
        <div className="flex items-center bg-purple-600 text-white px-4 py-1 rounded-full relative text-sm font-semibold">
          <motion.img
            src="/x-icon.png"
            alt="X"
            className="w-4 h-4 mr-2"
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: 'linear'
            }}
          />
          Features
        </div>

        {/* Glowing Dot Right */}
        <span className="h-2 w-2 bg-white rounded-full shadow-[0_0_8px_2px_rgba(255,255,255,0.5)] ml-2"></span>

        {/* Right Line */}
        <div className="hidden sm:block w-16 h-px bg-gray-500 ml-2" />
      </div>

      {/* Heading */}
      <motion.h3
        className="text-white text-2xl md:text-3xl font-bold text-center mb-12 leading-snug"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        Powerful features to simplify your<br />
        health experience
      </motion.h3>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 container mx-auto ">
        <FeatureCard
          iconPath="/heart-attack.png"
          title="Vitals Monitor"
          description="Sync wearables to monitor heart rate, BP, oxygen, and more in real time"
          delay={0.2}
        />
        <FeatureCard
          iconPath="/Disease.png"
          title="Disease Diagnosis"
          description="AI detects and explains possible health conditions."
          delay={0.4}
        />
        <FeatureCard
          iconPath="/medicine.png"
          title="Medications"
          description="Get AI-recommended medications based on your diagnosis."
          delay={0.6}
        />
      </div>
    </section>
  );
};

export default FeaturesSection;
