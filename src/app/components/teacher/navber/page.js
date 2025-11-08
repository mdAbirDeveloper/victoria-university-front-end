"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  FaChalkboardTeacher,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const TeacherNavbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    // Teacher data মুছে দাও
    localStorage.removeItem("teacherData");

    // Attendance বা page state সম্পর্কিত সব data মুছে দাও
    localStorage.removeItem("attendanceStudents");
    localStorage.removeItem("teacherToken");
    localStorage.removeItem("teacherPageState");
    localStorage.removeItem("scrollY");

    // যদি আরও কিছু save থাকে, সেটা মুছে দিতে চাইলে এখানে add করো
    // localStorage.clear(); // ⚠️ এটি সব data মুছে দেবে

    // Login page এ redirect
    router.push("/components/teacher/login");
  };

  return (
    <nav className="backdrop-blur-md p-4 flex justify-between items-center border-b border-white/20 relative z-50">
      {/* Logo */}
      <div className="flex items-center gap-2 text-yellow-400 text-xl font-bold">
        <FaChalkboardTeacher /> University Portal
      </div>

      {/* Desktop Menu */}
      <div className="hidden text-white font-bold md:flex gap-5 text-sm sm:text-base">
        <button
          className="hover:text-yellow-400 transition"
          onClick={() => router.push("/components/teacher/profile")}
        >
          Profile
        </button>
        <button
          className="hover:text-yellow-400 transition"
          onClick={() => router.push("/components/teacher/ganerateToken")}
        >
          Take Attendance
        </button>
        <button
          className="hover:text-yellow-400 transition"
          onClick={() => router.push("/components/teacher/allStudents")}
        >
          All Students
        </button>
        <button
          className="hover:text-yellow-400 transition"
          onClick={() => router.push("/components/teacher/attendance")}
        >
          Attendance Correction
        </button>
        <button
          className="hover:text-yellow-400 transition"
          onClick={() => router.push("/components/teacher/findStudent")}
        >
          Find Student
        </button>
        {/* <button
          className="hover:text-yellow-400 transition"
          onClick={() => router.push("/components/teacher/results")}
        >
          Results
        </button> */}
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
            className="absolute text-white font-bold top-full left-0 w-full bg-linear-to-br from-green-800 via-teal-700 to-blue-700  backdrop-blur-md border-t border-white/20 flex flex-col items-center md:hidden"
          >
            <button
              className="py-3 hover:text-yellow-400 transition w-full text-center"
              onClick={() => {
                router.push("/components/teacher/profile");
                setMenuOpen(false);
              }}
            >
              Profile
            </button>
            <button
              className="py-3 hover:text-yellow-400 transition w-full text-center"
              onClick={() => {
                router.push("/components/teacher/ganerateToken");
                setMenuOpen(false);
              }}
            >
              Take Attendance
            </button>
            <button
              className="py-3 hover:text-yellow-400 transition w-full text-center"
              onClick={() => {
                router.push("/components/teacher/allStudents");
                setMenuOpen(false);
              }}
            >
              All Students
            </button>
            <button
              className="py-3 hover:text-yellow-400 transition w-full text-center"
              onClick={() => {
                router.push("/components/teacher/attendance");
                setMenuOpen(false);
              }}
            >
              Attendance Correction
            </button>
            <button
              className="py-3 hover:text-yellow-400 transition"
              onClick={() => router.push("/components/teacher/findStudent")}
            >
              Find Student
            </button>
            {/* <button
              className="py-3 hover:text-yellow-400 transition w-full text-center"
              onClick={() => {
                router.push("/components/teacher/results");
                setMenuOpen(false);
              }}
            >
              Results
            </button> */}
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

export default TeacherNavbar;
