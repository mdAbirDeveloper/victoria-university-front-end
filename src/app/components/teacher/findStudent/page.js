"use client";
import React, { useState, useEffect } from "react";
import TeacherNavbar from "../navber/page";
import StudentCards from "../../student/page";

const FindStudents = () => {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [teacherData, setTeacherData] = useState(null);

  // Load teacher info only
  useEffect(() => {
    const storedTeacher = localStorage.getItem("teacherData");
    if (storedTeacher) {
      const parsed = JSON.parse(storedTeacher);
      setTeacherData(parsed);
    } else {
      alert("You must be logged in as a teacher to access this page!");
      window.location.href = "/components/teacher/login";
      return;
    }
  }, []);

  // Fetch students based on search
  useEffect(() => {
    if (!search.trim()) {
      setStudents([]);
      setMessage("");
      return;
    }

    const fetchStudents = async () => {
      if (!search.trim()) return; // prevent empty query
      setLoading(true);
      setMessage("");
      console.log(search);
      try {
        const res = await fetch(
          `https://victoria-university-back-end.vercel.app/api/search/student?query=${search}`
        );
        const data = await res.json();
        if (data.success) {
          setStudents(data.students);
          if (data.students.length === 0) setMessage("No students found!");
        } else {
          setStudents([]);
          setMessage("No students found!");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setMessage("Error fetching students");
      } finally {
        setLoading(false);
      }
    };

    // debounce 300ms
    const timer = setTimeout(() => fetchStudents(), 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="bg-linear-to-br from-green-800 via-teal-700 to-blue-700">
      <TeacherNavbar />
      <div className="min-h-screen p-6">
        <div className="text-white max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-6 animate-fadeIn">
            🔍 Find Students
          </h1>

          {/* Search Input + Message */}
          <div className="flex justify-center mb-6">
            <input
              type="text"
              placeholder="Enter student roll or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-3 w-full border border-white max-w-md rounded-xl text-white font-medium focus:ring-2 focus:ring-yellow-400 transition-all placeholder:text-white "
            />
          </div>
          {message && (
            <p className="text-center mb-4 text-yellow-200 font-semibold">
              {message}
            </p>
          )}
          {loading && (
            <p className="text-center mb-4 font-semibold animate-pulse">
              Loading...
            </p>
          )}

          {/* Student Cards */}
          <StudentCards students={students} />
        </div>
      </div>
    </div>
  );
};

export default FindStudents;
