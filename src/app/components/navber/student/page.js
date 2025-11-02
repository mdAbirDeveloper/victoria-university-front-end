"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaUserGraduate, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";

const StudentNavbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("studentData");
    router.push("/components/login");
  };

  return (
    <nav className="bg-white/10 backdrop-blur-md p-4 flex justify-between items-center border-b border-white/20 relative z-50">
      {/* Logo */}
      <div className="flex items-center gap-2 text-yellow-400 text-xl font-bold">
        <FaUserGraduate /> Victoria University
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-5 text-sm sm:text-base">
        <button
          className="hover:text-yellow-400 transition"
          onClick={() => router.push("/components/profile")}
        >
          Profile
        </button>
        <button
          className="hover:text-yellow-400 transition"
          onClick={() => router.push("/components/attendance")}
        >
          Attendance
        </button>
        <button
          className="hover:text-yellow-400 transition"
          onClick={() => alert("More features coming soon!")}
        >
          Results
        </button>
        <button
          onClick={handleLogout}
          className="text-red-400 hover:text-red-500 flex items-center gap-1"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-yellow-400 text-2xl focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 w-full bg-linear-to-br from-blue-900 via-purple-800 to-indigo-900 backdrop-blur-md border-t border-white/20 flex flex-col items-center md:hidden"
          >
            <button
              className="py-3 hover:text-yellow-400 transition w-full text-center"
              onClick={() => {
                router.push("/components/profile");
                setMenuOpen(false);
              }}
            >
              Profile
            </button>
            <button
              className="py-3 hover:text-yellow-400 transition w-full text-center"
              onClick={() => {
                router.push("/components/attendance");
                setMenuOpen(false);
              }}
            >
              Attendance
            </button>
            <button
              className="py-3 hover:text-yellow-400 transition w-full text-center"
              onClick={() => {
                alert("More features coming soon!");
                setMenuOpen(false);
              }}
            >
              Results
            </button>
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="py-3 text-red-400 hover:text-red-500 flex items-center justify-center gap-2 w-full"
            >
              <FaSignOutAlt /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default StudentNavbar;
