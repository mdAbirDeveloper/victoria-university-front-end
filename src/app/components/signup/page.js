"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaUserGraduate, FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    fatherName: "",
    motherName: "",
    fatherPhone: "",
    motherPhone: "",
    session: "",
    department: "",
    roll: "",
    address: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const sessions = ["2020-2021","2021-2022","2022-2023","2023-2024","2024-2025","2025-2026"];
  const departments = [
    "Computer Science and Engineering","Electrical and Electronic Engineering","Civil Engineering","Mechanical Engineering",
    "Business Administration","Law","English","Economics","Accounting","Finance and Banking","Marketing",
    "Sociology","Political Science","Pharmacy","Public Health","Mathematics"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);

  try {
    const res = await fetch("https://victoria-university-back-end.vercel.app/api/student/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      // If success, show success overlay
      setSubmitted(true);
      // setFormData({
      //   name: "",
      //   email: "",
      //   phone: "",
      //   fatherName: "",
      //   motherName: "",
      //   fatherPhone: "",
      //   motherPhone: "",
      //   session: "",
      //   department: "",
      //   roll: "",
      //   address: "",
      //   password: "",
      // });
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
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-900 via-purple-800 to-indigo-900 text-white relative overflow-hidden">

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

      {/* Signup Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-white/20 relative z-10"
      >
        <div className="flex flex-col items-center mb-6">
          <FaUserGraduate className="text-5xl text-yellow-400 mb-3" />
          <h1 className="text-2xl font-semibold text-center text-white">
            Victoria University — Student Sign Up
          </h1>
          <p className="text-sm text-gray-300 mt-2">
            Please fill in your information carefully
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Input Fields */}
          {[
            { label: "Full Name", name: "name", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Phone Number", name: "phone", type: "text" },
            { label: "Father's Name", name: "fatherName", type: "text" },
            { label: "Father's Phone", name: "fatherPhone", type: "text" },
            { label: "Mother's Name", name: "motherName", type: "text" },
            { label: "Mother's Phone", name: "motherPhone", type: "text" },
            { label: "Roll", name: "roll", type: "text" },
            { label: "Address", name: "address", type: "text" },
          ].map((field, idx) => (
            <div key={idx}>
              <label className="block text-sm mb-2">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required
                className={`w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 ${
                  errors[field.name] ? "focus:ring-red-400 border border-red-400" : "focus:ring-yellow-400"
                }`}
                placeholder={field.label}
              />
              {errors[field.name] && (
                <p className="text-red-400 text-xs mt-1">{errors[field.name]}</p>
              )}
            </div>
          ))}

          {/* Password Field */}
          <div className="relative">
            <label className="block text-sm mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={`w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 ${
                errors.password ? "focus:ring-red-400 border border-red-400" : "focus:ring-yellow-400"
              }`}
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 mt-4 text-gray-300 hover:text-yellow-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Session */}
          <div>
            <label className="block text-sm mb-2">Session</label>
            <select
              name="session"
              value={formData.session}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Select Session</option>
              {sessions.map((s, i) => <option key={i} className="bg-gray-600" value={s}>{s}</option>)}
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm mb-2">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Select Department</option>
              {departments.map((d, i) => <option key={i} className="bg-gray-600" value={d}>{d}</option>)}
            </select>
          </div>

          {/* Login link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex items-center justify-center gap-2 text-gray-200 text-sm md:col-span-2"
          >
            <p>Already have an account?</p>
            <Link href="/components/login" className="inline-flex items-center gap-1 text-yellow-400 font-medium hover:text-yellow-300 transition-colors duration-300">
              <span>Login</span>
              <FaArrowRight className="text-xs mt-px" />
            </Link>
          </motion.div>

          {/* Teachers signup link link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-2 flex items-center justify-center gap-2 text-gray-200 text-sm md:col-span-2"
          >
            <Link href="/components/teacher/signup" className="inline-flex items-center gap-1 text-yellow-400 font-medium hover:text-yellow-300 transition-colors duration-300">
              <span>Teacher Signup</span>
              <FaArrowRight className="text-xs mt-px" />
            </Link>
          </motion.div>

          {/* Submit Button */}
          <div className="md:col-span-2">
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
            <FaUserGraduate className="text-6xl text-yellow-400 mb-4 mx-auto" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-white">
              Registration Successful 🎉
            </h2>
            <p className="text-gray-200 leading-relaxed text-sm sm:text-base">
              Thank you for signing up! Please wait until your account is approved
              by the university authority. Once approved, you can log in to your
              account.
            </p>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default Signup;
