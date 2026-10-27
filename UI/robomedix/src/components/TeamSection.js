// src/components/TeamSection.js
import React from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLinkedin, FaGithub } from 'react-icons/fa';

const TeamCard = ({ image, name, role, email, linkedin, github, delay }) => (
  <motion.div
    className="relative bg-[#1A1A3D] border border-[#4A4A88] rounded-2xl pt-16 pb-6 px-6 text-white text-center shadow-lg shadow-[#4A4A88]"
    initial={{ opacity: 0, y: 80 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay }}
    viewport={{ once: true }}
  >
    {/* Profile Image */}
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <img
        src={image}
        alt={name}
        className="w-32 h-32 rounded bd-[#4A4A88] object-cover"
      />
    </div>

    {/* Name & Role */}
    <h4 className="text-xl font-semibold mt-6">{name}</h4>
    <p className="text-sm text-gray-300 mb-4">{role}</p>

    {/* Contact Info */}
    <div className="text-left space-y-2 mt-4 pl-3">
      <p className="flex items-center gap-2 text-sm text-gray-300">
        <FaEnvelope /> {email}
      </p>
      <p className="flex items-center gap-2 text-sm text-gray-300">
        <FaLinkedin /> {linkedin}
      </p>
      <p className="flex items-center gap-2 text-sm text-gray-300">
        <FaGithub /> {github}
      </p>
    </div>
  </motion.div>
);

const TeamSection = () => {
  return (
    <section id="team" className="bg-[#0D0D2B] py-20 px-6 md:px-20 relative overflow-hidden">
      
      {/* === Side Decorative PNGs === */}
      <img
        src="/Ellipse 2.png"
        alt="Left Curve"
        className="absolute left-0 top-1/2 transform -translate-y-1/2 w-[300px] z-0 opacity-80"
      />
      <img
        src="/Ellipse 2.png"
        alt="Right Curve"
        className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[300px] rotate-180 z-0 opacity-80"
      />

      {/* === Section Content === */}
      <div className="relative z-10">
        {/* Top Label */}
        <div className="flex justify-center items-center mb-4 relative">
          <div className="hidden sm:block w-16 h-px bg-gray-500 mr-2" />
          <span className="h-2 w-2 bg-white rounded-full shadow-[0_0_8px_2px_rgba(255,255,255,0.5)] mr-2" />
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
            Team
          </div>
          <span className="h-2 w-2 bg-white rounded-full shadow-[0_0_8px_2px_rgba(255,255,255,0.5)] ml-2" />
          <div className="hidden sm:block w-16 h-px bg-gray-500 ml-2" />
        </div>

        {/* Heading */}
        <motion.h3
          className="text-white text-2xl md:text-3xl font-bold text-center mb-2"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          Meet the Team
        </motion.h3>

        {/* Subheading */}
        <motion.p
          className="text-center text-gray-300 mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
        >
          A team of dedicated engineers building the future of AI-powered healthcare.
        </motion.p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 container mx-auto">
          <TeamCard
            image="/Awais1.png"
            name="Awais Bin Mukhtar"
            role="AI Engineer"
            email="awaisbinmukhtar@gmail.com"
            linkedin="linkedin.com/in/awaisbinmukhtar"
            github="github.com/miawais"
            delay={0.2}
          />
          <TeamCard
            image="/Ali1.png"
            name="Ali Hafeez"
            role="AI Engineer"
            email="alihafeez146@gmail.com"
            linkedin="linkedin.com/in/alihaeezai"
            github="github.com/alihaez01"
            delay={0.4}
          />
          <TeamCard
            image="/Musharaf1.png"
            name="Musharaf Hussain"
            role="AI Engineer"
            email="musharaf.h.abid@gmail.com"
            linkedin="linkedin.com/in/musharaf-hussain-abid-633a26241"
            github="github.com/musharafhussainabid"
            delay={0.6}
          />
        </div>
      </div>
    </section>
  );
};


export default TeamSection;
