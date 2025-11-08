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
import {
  ClipboardCheck,
  ClipboardList,
  Search,
  User,
  Users,
} from "lucide-react";

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
          className="flex items-center justify-center gap-2 py-3 hover:text-yellow-400 transition text-center"
          onClick={() => {
            router.push("/components/teacher/profile");
            setMenuOpen(false);
          }}
        >
          <User className="w-5 h-5" /> {/* 👈 Profile icon */}
          <span>Profile</span>
        </button>
        <button
          className="py-3 hover:text-yellow-400 transition text-center flex items-center justify-center gap-2"
          onClick={() => {
            router.push("/components/teacher/ganerateToken");
            setMenuOpen(false);
          }}
        >
          <ClipboardCheck size={20} />
          Take Attendance
        </button>
        <button
          className="hover:text-yellow-400 transition flex items-center gap-2"
          onClick={() => router.push("/components/teacher/allStudents")}
        >
          <Users size={20} />
          All Students
        </button>
        <button
          className="py-3 hover:text-yellow-400 transition text-center flex items-center justify-center gap-2"
          onClick={() => {
            router.push("/components/teacher/attendance");
            setMenuOpen(false);
          }}
        >
          <ClipboardList size={20} />
          Attendance Management
        </button>
        <button
          className="flex items-center gap-2 hover:text-yellow-400 transition"
          onClick={() => router.push("/components/teacher/findStudent")}
        >
          <Search className="w-5 h-5" /> {/* 👈 search icon */}
          <span>Find Student</span>
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
              className="flex items-center justify-center gap-2 py-3 hover:text-yellow-400 transition w-full text-center"
              onClick={() => {
                router.push("/components/teacher/profile");
                setMenuOpen(false);
              }}
            >
              <User className="w-5 h-5" /> {/* 👈 Profile icon */}
              <span>Profile</span>
            </button>
            <button
              className="py-3 hover:text-yellow-400 transition w-full text-center flex items-center justify-center gap-2"
              onClick={() => {
                router.push("/components/teacher/ganerateToken");
                setMenuOpen(false);
              }}
            >
              <ClipboardCheck size={20} />
              Take Attendance
            </button>
            <button
              className="py-3 hover:text-yellow-400 transition flex items-center gap-2"
              onClick={() => router.push("/components/teacher/allStudents")}
            >
              <Users size={20} />
              All Students
            </button>
            <button
              className="py-3 hover:text-yellow-400 transition w-full text-center flex items-center justify-center gap-2"
              onClick={() => {
                router.push("/components/teacher/attendance");
                setMenuOpen(false);
              }}
            >
              <ClipboardList size={20} />
              Attendance Management
            </button>
            <button
              className="py-3 flex items-center gap-2 hover:text-yellow-400 transition"
              onClick={() => router.push("/components/teacher/findStudent")}
            >
              <Search className="w-5 h-5" /> {/* 👈 search icon */}
              <span>Find Student</span>
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
