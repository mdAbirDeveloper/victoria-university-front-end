/* eslint-disable @next/next/no-html-link-for-pages */
"use client";
import { useEffect, useState } from "react";

// Simple Lucide-style File Warning icon
const FileWarning = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-red-500 animate-pulse"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="12" y1="11" x2="12" y2="15" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const NotFoundPage = () => {
  const [count, setCount] = useState(4);

  useEffect(() => {
    if (count === 0) {
      window.location.href = "/";
      return;
    }
    const timer = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white overflow-hidden relative p-4">
      {/* Floating glowing circles for animation */}
      <div className="absolute w-64 h-64 bg-white/10 rounded-full blur-3xl top-16 left-20 animate-float-slow"></div>
      <div className="absolute w-80 h-80 bg-white/10 rounded-full blur-3xl bottom-16 right-20 animate-float-reverse"></div>

      {/* Main Card */}
      <div className="text-center bg-white/10 backdrop-blur-md p-8 sm:p-12 rounded-2xl shadow-2xl max-w-lg w-full border border-white/20 animate-fade-in">
        {/* Icon & Heading */}
        <div className="flex flex-col items-center mb-6">
          <FileWarning />
          <h1 className="text-8xl font-extrabold text-yellow-300 mt-4 tracking-tighter animate-bounce">
            404
          </h1>
          <h2 className="text-3xl font-bold text-white mt-2">
            Page Not Found
          </h2>
        </div>

        {/* Description */}
        <p className="text-lg text-white/80 mb-8">
          Sorry, the page you’re looking for doesn’t exist or may have been moved.
        </p>

        {/* Countdown */}
        <p className="text-sm text-white/60 mb-6">
          Redirecting to homepage in <span className="font-semibold text-yellow-300">{count}</span> seconds...
        </p>

        {/* Button */}
        <a
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg bg-white text-purple-700 hover:bg-purple-100 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none"
        >
          Go back to Homepage
        </a>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-sm text-white/60 animate-fade-in">
        This is a custom animated 404 page.
      </footer>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(20px); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(20px) translateX(-20px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
        .animate-float-reverse { animation: float-reverse 12s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 1s ease-out; }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
