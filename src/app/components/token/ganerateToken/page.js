"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { departments } from "../../../../../data";

const TeacherTokenPage = () => {
  const [department, setDepartment] = useState("");
  const [subject, setSubject] = useState("");
  const [classNumber, setClassNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  // Dummy teacher info (normally fetched from login/session)
  const teacherInfo = {
    name: "John Doe",
    phone: "0123456789",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!department || !subject || !classNumber) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/teacher/token/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherName: teacherInfo.name,
          phone: teacherInfo.phone,
          departments,
          subject,
          classNumber,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      setToken(data.token); // API থেকে token response
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-800 via-teal-700 to-blue-700 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md text-white"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-yellow-400">
          Generate Attendance Token
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Department */}
          <div>
            <label className="block text-sm mb-2">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-3 rounded-lg bg-amber-950 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Select Department</option>
              {departments.map((d, i) => (
                <option key={i} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block mb-2 text-sm">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-3 rounded-lg bg-amber-950 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Select Subject</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Programming">Programming</option>
              <option value="Economics">Economics</option>
            </select>
          </div>

          {/* Class Number */}
          <div>
            <label className="block mb-2 text-sm">Class Number</label>
            <select
              value={classNumber}
              onChange={(e) => setClassNumber(e.target.value)}
              className="w-full p-3 rounded-lg bg-amber-950 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Select Class</option>
              <option value="1">Class 1</option>
              <option value="2">Class 2</option>
              <option value="3">Class 3</option>
              <option value="4">Class 4</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-lg shadow-md transition-all duration-300 disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate Token"}
          </button>
        </form>

        {/* Show Token */}
        {token && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 bg-green-500/30 rounded-lg text-center text-white font-semibold"
          >
            Attendance Token: <span className="text-yellow-400">{token}</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default TeacherTokenPage;
