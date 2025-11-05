"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { departments, sessions, subjects } from "../../../../../data";
import TeacherNavbar from "../navber/page";

const TeacherTokenPage = () => {
  const [department, setDepartment] = useState("");
  const [session, setSession] = useState("");
  const [subject, setSubject] = useState("");
  const [classNumber, setClassNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenData, setTokenData] = useState(null);
  const [teacherData, setTeacherData] = useState(null);
  const [todayTokens, setTodayTokens] = useState([]);

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

  // Fetch today's tokens whenever department or session changes
  useEffect(() => {
    if (department && session) {
      fetchTodayTokens(department, session);
    }
  }, [department, session]);

  // Fetch today's tokens
  const fetchTodayTokens = async (dept, sess) => {
    try {
      const res = await fetch(
        `https://victoria-university-back-end.vercel.app/api/teacher/token/today?department=${dept}&session=${sess}`
      );
      const data = await res.json();
      if (res.ok) {
        const sortedTokens = (data.tokens || []).sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setTodayTokens(sortedTokens);

        // Update current token if it exists in localStorage
        const storedToken = localStorage.getItem("teacherToken");
        if (storedToken) {
          const localToken = JSON.parse(storedToken);
          const updatedToken = sortedTokens.find(
            (t) => t._id === localToken._id
          );
          if (updatedToken) setTokenData(updatedToken);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Generate token
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!department || !session || !subject || !classNumber) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://victoria-university-back-end.vercel.app/api/teacher/token/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherName: teacherData?.name,
          teacherPhone: teacherData?.phone,
          teacherDepartment: teacherData?.department,
          tokenForDepartment: department,
          tokenForSession: session,
          tokenForSubject: subject,
          tokenForClassNumber: classNumber,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      setTokenData(data.tokenData);
      localStorage.setItem("teacherToken", JSON.stringify(data.tokenData));

      // ✅ Refresh table after creating token
      fetchTodayTokens(department, session);
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  // Timeout (Deactivate token)
  const handleTimeout = async (id) => {
    if (!confirm("Are you sure you want to deactivate this token?")) return;

    try {
      const res = await fetch(
        `https://victoria-university-back-end.vercel.app/api/teacher/token/timeout/${id}`,
        { method: "PUT" }
      );

      const data = await res.json();
      if (res.ok) {
        alert("Token deactivated successfully");
        fetchTodayTokens(department, session);
      } else alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // Refresh all tokens
  const handleRefresh = () => {
    if (department && session) fetchTodayTokens(department, session);
  };

  const activeTokens = todayTokens.filter((t) => t.isActive);
  const inactiveTokens = todayTokens.filter((t) => !t.isActive);

  return (
    <div className="bg-linear-to-br from-green-800 via-teal-700 to-blue-700">
      <TeacherNavbar />
      <div className="min-h-screen flex flex-col items-center justify-start px-4 py-10 space-y-8">
        {/* Token generation card */}
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
                className="p-3 rounded-lg bg-linear-to-br from-green-800 via-teal-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">Select Department</option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept} className="bg-teal-600">
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Session */}
            <div>
              <label className="block text-sm mb-2">Session</label>
              <select
                value={session}
                onChange={(e) => setSession(e.target.value)}
                className="p-3 rounded-lg bg-linear-to-br from-green-800 via-teal-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">Select Session</option>
                {sessions.map((s, index) => (
                  <option key={index} value={s} className="bg-teal-600">
                    {s}
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
                className="p-3 rounded-lg bg-linear-to-br from-green-800 via-teal-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">Select Subject</option>
                {subjects.map((sub, index) => (
                  <option key={index} value={sub} className="bg-teal-600">
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            {/* Class Number */}
            <div>
              <label className="block mb-2 text-sm">Class Number</label>
              <select
                value={classNumber}
                onChange={(e) => setClassNumber(e.target.value)}
                className="p-3 rounded-lg bg-linear-to-br from-green-800 via-teal-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option className="bg-teal-600" value="">
                  Select Class
                </option>
                <option className="bg-teal-600" value="1">
                  Class 1
                </option>
                <option className="bg-teal-600" value="2">
                  Class 2
                </option>
                <option className="bg-teal-600" value="3">
                  Class 3
                </option>
                <option className="bg-teal-600" value="4">
                  Class 4
                </option>
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

          {/* Current token */}
          {tokenData && (
            <div className="mt-6 p-5 bg-white/10 backdrop-blur-md rounded-lg text-center">
              <h2 className="text-lg font-semibold text-yellow-300 mb-2">
                Your Token
              </h2>
              <p className="text-2xl font-bold text-yellow-400 tracking-widest">
                {tokenData.token}
              </p>
              <p className="text-sm mt-2">
                Status:{" "}
                <span
                  className={
                    tokenData.isActive ? "text-green-400" : "text-red-400"
                  }
                >
                  {tokenData.isActive ? "Active" : "Inactive"}
                </span>
              </p>
              <p className="text-sm text-gray-300">
                Used by:{" "}
                <span className="text-yellow-400">{tokenData.totalUseBy}</span>{" "}
                students
              </p>
            </div>
          )}
        </motion.div>

        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white font-semibold"
        >
          Refresh Tokens
        </button>

        {/* Active Tokens Table */}
        <TokenTable
          title="Active Tokens"
          tokens={activeTokens}
          showAction
          handleTimeout={handleTimeout}
        />

        {/* Inactive Tokens Table */}
        <TokenTable
          title="Inactive Tokens"
          tokens={inactiveTokens}
          showAction={false}
        />
      </div>
    </div>
  );
};

// Reusable TokenTable component
const TokenTable = ({ title, tokens, showAction, handleTimeout }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl w-full max-w-6xl text-white"
  >
    <h2 className="text-xl font-semibold mb-4 text-yellow-400 text-center">
      {title}
    </h2>
    {tokens.length === 0 ? (
      <p className="text-center text-gray-300">No tokens.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full border border-white/20 text-sm">
          <thead className="bg-white/20">
            <tr>
              <th className="py-2 px-3 text-left">Teacher</th>
              <th className="py-2 px-3 text-left">Department</th>
              <th className="py-2 px-3 text-left">Session</th>
              <th className="py-2 px-3 text-left">Subject</th>
              <th className="py-2 px-3 text-center">Class</th>
              <th className="py-2 px-3 text-center">Token</th>
              <th className="py-2 px-3 text-center">Used By</th>
              {showAction && <th className="py-2 px-3 text-center">Action</th>}
            </tr>
          </thead>
          <tbody>
            {[...tokens].reverse().map((t) => (
              <tr key={t._id} className="border-t border-white/10">
                <td className="py-2 px-3">{t.teacherName}</td>
                <td className="py-2 px-3">{t.tokenForDepartment}</td>
                <td className="py-2 px-3">{t.tokenForSession}</td>
                <td className="py-2 px-3">{t.tokenForSubject}</td>
                <td className="py-2 px-3 text-center">{t.tokenForClassNumber}</td>
                <td className="py-2 px-3 text-yellow-400 text-center font-bold">
                  {t.token}
                </td>
                <td className="py-2 px-3 text-center">{t.totalUseBy || 0}</td>
                {showAction && (
                  <td className="py-2 px-3 text-center">
                    <button
                      onClick={() => handleTimeout(t._id)}
                      className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-sm"
                    >
                      Timeout
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </motion.div>
);

export default TeacherTokenPage;
