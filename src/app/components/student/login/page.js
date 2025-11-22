/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaUniversity, FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);
  const router = useRouter();
  const phoneRef = useRef(null);

  const validate = () => {
    if (!phone.trim()) return "Please enter your phone number.";
    if (!password) return "Please enter your password.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) return setError(v);

    setLoading(true);
    try {
      const res = await fetch("https://victoria-university-back-end.vercel.app/api/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || "Invalid credentials");
        return;
      }

      // Save to localStorage (remember me optional)
      if (remember) localStorage.setItem("studentData", JSON.stringify(data.student));
      else localStorage.setItem("studentData", JSON.stringify(data.student));

      router.push("/components/student/profile");
    } catch (err) {
      console.error("Login Error:", err);
      setError("Something went wrong — try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-900 via-purple-800 to-indigo-900 text-slate-50 p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Illustration / Brand */}
        <div className="hidden md:flex flex-col justify-center items-start rounded-2xl bg-white/5 p-8 backdrop-blur border border-white/6">
          <div className="flex items-center gap-3 mb-4 mt-36">
            <div className="p-3 rounded-lg bg-yellow-400 text-slate-900">
              <FaUniversity className="text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Victoria University</h2>
              <p className="text-sm text-slate-300">Student portal — secure access</p>
            </div>
          </div>

          <div className="mt-4 text-slate-200">
            <h3 className="font-semibold mb-2">Why sign in?</h3>
            <ul className="text-sm list-disc ml-5 space-y-1">
              <li>Check attendance and grades</li>
              <li>Manage your profile and documents</li>
              <li>Access course materials and notices</li>
            </ul>
          </div>

          <div className="mt-auto text-xs text-slate-400">© {new Date().getFullYear()} Victoria University</div>
        </div>

        {/* Right: Form card */}
        <div className="rounded-2xl bg-white/6 backdrop-blur p-6 border border-white/8 shadow-md">
          <h1 className="text-2xl font-semibold text-center text-yellow-400 mb-3">Student Login</h1>
          <p className="text-sm text-center text-slate-300 mb-5">Enter phone and password to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4" aria-label="Student login form">
            <div>
              <label className="block text-sm text-slate-200 mb-2">Phone</label>
              <input
                ref={phoneRef}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                inputMode="tel"
                placeholder="e.g. +8801XXXXXXXXX"
                className="w-full p-3 rounded-lg bg-white/8 text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-200 mb-2">Password</label>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  className="w-full p-3 pr-12 rounded-lg bg-white/8 text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
                <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-yellow-400">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {error && <div className="text-sm text-red-400">{error}</div>}

            <div className="flex items-center justify-between gap-4">
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-yellow-400" />
                <span className="text-slate-200">Remember me</span>
              </label>

              <Link href="/components/student/forgot" className="text-sm text-yellow-400 hover:text-yellow-300">Forgot password?</Link>
            </div>

            <button type="submit" disabled={loading} className={`w-full py-3 rounded-lg font-semibold text-slate-900 bg-yellow-400 shadow-md ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-yellow-500'}`}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="flex items-center gap-3 justify-center text-sm text-slate-300">
              <span>Don't have an account?</span>
              <Link href="/components/student/signup" className="text-yellow-400 hover:text-yellow-300">Sign up <FaArrowRight className="inline-block ml-1" /></Link>
            </div>

            <div className="flex items-center gap-3 justify-center text-sm text-slate-300">
              <Link href="/components/teacher/login" className="text-yellow-400 hover:text-yellow-300">Teacher's Login <FaArrowRight className="inline-block ml-1" /></Link>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">Secure — we never share your password. Use your university phone number.</div>
        </div>
      </motion.div>
    </div>
  );
}
