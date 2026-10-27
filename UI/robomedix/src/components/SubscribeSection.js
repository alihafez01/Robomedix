import React from 'react';
import { motion } from 'framer-motion';

const SubscribeSection = () => {
  return (
    <section className="bg-[#0D0D2B] text-white px-6 py-20 md:px-32 text-center">
      {/* Top Heading */}
      <motion.h3
        className="text-2xl md:text-3xl font-bold mb-4"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        Step into the AI Power Medical Assistance
      </motion.h3>

      {/* Subheading */}
      <motion.p
        className="text-sm md:text-base text-gray-300"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        Smart, fast, and reliable support for better, more efficient healthcare decisions.
      </motion.p>

      {/* Arched Background with PNG Layers */}
       <motion.div
  className="relative w-full max-w-4xl mx-auto h-[280px] mb-20"
  initial={{ opacity: 0, y: 80 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.4 }}
  viewport={{ once: true }}
>
  <div className="absolute inset-0 flex items-center justify-center">
    <img
      src="/Mask group.png"
      alt="Arched Background"
      className="w-[80%] max-w-[500px] object-contain"
    />
  </div>
</motion.div>




      {/* Subscribe Input and Button */}
      <motion.div
        className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
      >
        <input
          type="email"
          placeholder="Type Your email here….."
          className="px-6 py-3 w-full sm:w-96 rounded bg-[#1A1A50] text-white placeholder-gray-400 focus:outline-none shadow-md"
        />
        <button className="px-8 py-3 rounded bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold shadow-lg hover:opacity-90 transition duration-300">
          Subscribe
        </button>
      </motion.div>

      {/* Footer - Not animated */}
      <div className="border-t border-gray-700 pt-6 mt-6 text-sm flex flex-col md:flex-row justify-between items-center text-gray-400">
        <p className="mb-2 md:mb-0">
          <span className="text-white font-semibold">RoboMedic</span> App, All Rights Reserved
        </p>
        <div className="flex space-x-4">
          <a href="#" className="hover:underline">Terms & Conditions</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
        </div>
      </div>
    </section>
  );
};

export default SubscribeSection;
