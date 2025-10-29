"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaUniversity, FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Login Successful!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-800 to-indigo-900 text-white relative overflow-hidden">
      {/* Animated background circles */}
      <motion.div
        className="absolute w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
        initial={{ x: -200, y: -100 }}
        animate={{ x: 200, y: 200 }}
        transition={{
          repeat: Infinity,
          duration: 8,
          ease: "easeInOut",
          repeatType: "mirror",
        }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
        initial={{ x: 200, y: 100 }}
        animate={{ x: -200, y: -200 }}
        transition={{
          repeat: Infinity,
          duration: 8,
          ease: "easeInOut",
          repeatType: "mirror",
        }}
      />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20"
      >
        <div className="flex flex-col items-center mb-6">
          <FaUniversity className="text-5xl text-yellow-400 mb-3" />
          <h1 className="text-2xl font-semibold text-center text-white">
            Victoria University Login
          </h1>
          <p className="text-sm text-gray-300 mt-2">
            Please enter your credentials to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Phone Field */}
          <div>
            <label className="block text-sm mb-2">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-3 pr-12 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-300 hover:text-yellow-400 transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Signup Redirect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 flex items-center justify-center gap-2 text-gray-200 text-sm"
          >
            <p>Don’t have an account?</p>
            <Link
              href="/components/signup"
              className="inline-flex items-center gap-1 text-yellow-400 font-medium hover:text-yellow-300 transition-colors duration-300"
            >
              <span>Sign up</span>
              <FaArrowRight className="text-xs mt-[1px]" />
            </Link>
          </motion.div>

          {/* Submit Button */}
          {phone && password && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-lg shadow-md transition-all duration-300 mt-4"
              >
                Login
              </button>
            </motion.div>
          )}
        </form>

        <p className="text-center text-sm text-gray-300 mt-6">
          © {new Date().getFullYear()} Victoria University — All Rights Reserved
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
