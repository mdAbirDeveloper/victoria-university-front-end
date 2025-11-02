"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaChalkboardTeacher, FaEye, FaEyeSlash, FaArrowRight } from "react-icons/fa";
import Link from "next/link";

const TeacherSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const departments = [
    "Computer Science and Engineering",
    "Electrical and Electronic Engineering",
    "Civil Engineering",
    "Mechanical Engineering",
    "Business Administration",
    "Law",
    "English",
    "Economics",
    "Accounting",
    "Finance and Banking",
    "Marketing",
    "Sociology",
    "Political Science",
    "Pharmacy",
    "Public Health",
    "Mathematics",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/teacher/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to register. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-800 via-teal-700 to-blue-700 text-white relative overflow-hidden">
      {/* Animated Background Circles */}
      <motion.div
        className="absolute w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
        initial={{ x: -200, y: -100 }}
        animate={{ x: 200, y: 200 }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", repeatType: "mirror" }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
        initial={{ x: 200, y: 100 }}
        animate={{ x: -200, y: -200 }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", repeatType: "mirror" }}
      />

      {/* Teacher Signup Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-white/20 relative z-10"
      >
        <div className="flex flex-col items-center mb-6">
          <FaChalkboardTeacher className="text-5xl text-yellow-400 mb-3" />
          <h1 className="text-2xl font-semibold text-center text-white">
            Victoria University — Teacher Sign Up
          </h1>
          <p className="text-sm text-gray-300 mt-2">
            Please fill in your information carefully
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name */}
          <div className="md:col-span-2">
            <label className="block text-sm mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter full name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter email"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm mb-2">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter phone number"
            />
          </div>

          {/* Department */}
          <div className="md:col-span-2">
            <label className="block text-sm mb-2">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Select Department</option>
              {departments.map((d, i) => (
                <option key={i} className="bg-gray-600" value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div className="relative md:col-span-2">
            <label className="block text-sm mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-gray-300 hover:text-yellow-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Login link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex items-center justify-center gap-2 text-gray-200 text-sm md:col-span-2"
          >
            <p>Already registered?</p>
            <Link
              href="/components/teacher/login"
              className="inline-flex items-center gap-1 text-yellow-400 font-medium hover:text-yellow-300 transition-colors duration-300"
            >
              <span>Login</span>
              <FaArrowRight className="text-xs mt-px" />
            </Link>
          </motion.div>

          {/* Submit Button */}
          <div className="md:col-span-2 mt-4">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-lg shadow-md transition-all duration-300 disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Sign Up"}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Success Modal */}
      {submitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-md bg-white/10 backdrop-blur-lg p-8 sm:p-10 rounded-2xl shadow-2xl border border-white/20 text-center"
          >
            <FaChalkboardTeacher className="text-6xl text-yellow-400 mb-4 mx-auto" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-white">
              Registration Successful 🎉
            </h2>
            <p className="text-gray-200 leading-relaxed text-sm sm:text-base">
              Thank you for signing up! Please wait until your account is approved
              by the Admin.
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TeacherSignup;
