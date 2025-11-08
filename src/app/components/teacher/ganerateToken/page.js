"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { departments, sessions, departmentSubjects } from "../../../../../data";
import TeacherNavbar from "../navber/page";

const TeacherTokenPage = () => {
  const [department, setDepartment] = useState("");
  const [session, setSession] = useState("");
  const [subject, setSubject] = useState("");
  const [classNumber, setClassNumber] = useState("");
  const [subjects, setSubjects] = useState([]); // ✅ dynamic subjects
  const [loading, setLoading] = useState(false);
  const [tokenData, setTokenData] = useState(null);
  const [teacherData, setTeacherData] = useState(null);
  const [todayTokens, setTodayTokens] = useState([]);
  const [usedByList, setUsedByList] = useState([]);
  const [showUsedBy, setShowUsedBy] = useState(false);

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

  // Update subjects dynamically when department changes
  useEffect(() => {
    if (department) {
      setSubjects(departmentSubjects[department] || []);
      setSubject(""); // reset subject when department changes
    } else {
      setSubjects([]);
    }
  }, [department]);

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
      const res = await fetch(
        "https://victoria-university-back-end.vercel.app/api/teacher/token/create",
        {
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
        }
      );

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      setTokenData(data.tokenData);
      localStorage.setItem("teacherToken", JSON.stringify(data.tokenData));
      fetchTodayTokens(department, session); // refresh table
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

  // Show used-by modal
  const handleSeeUsedBy = (token) => {
    if (token.usedBy && token.usedBy.length > 0) {
      setUsedByList(token.usedBy);
      setShowUsedBy(true);
    } else {
      alert("No students have used this token yet.");
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
      <div className="min-h-screen flex flex-col items-center justify-start px-4 py-10 space-y-8 text-white">
        {/* Token generation card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md"
        >
          <h1 className="text-2xl font-bold mb-6 text-center text-yellow-400">
            Generate Attendance Token
          </h1>

          {/* form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <SelectBox
              label="Department"
              value={department}
              setValue={setDepartment}
              options={departments}
            />
            <SelectBox
              label="Session"
              value={session}
              setValue={setSession}
              options={sessions}
            />
            <SelectBox
              label="Subject"
              value={subject}
              setValue={setSubject}
              options={subjects}
            />
            <SelectBox
              label="Class Number"
              value={classNumber}
              setValue={setClassNumber}
              options={["1", "2", "3", "4"]}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-lg shadow-md transition-all duration-300 disabled:opacity-60"
            >
              {loading ? "Generating..." : "Generate Token"}
            </button>
          </form>

          {/* Current token card */}
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
                <span className="text-yellow-400">
                  {tokenData.totalUseBy || 0}
                </span>{" "}
                students
              </p>

              <div className="mt-4 flex justify-center gap-3">
                {tokenData.isActive && (
                  <button
                    onClick={() => handleTimeout(tokenData._id)}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md"
                  >
                    Timeout
                  </button>
                )}
                <button
                  onClick={() => handleSeeUsedBy(tokenData)}
                  className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md"
                >
                  See Used By
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Refresh */}
        <button
          onClick={handleRefresh}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-semibold"
        >
          Refresh Tokens
        </button>

        {/* Active & Inactive Tokens */}
        <TokenTable
          title="Active Tokens"
          tokens={activeTokens}
          handleTimeout={handleTimeout}
          handleSeeUsedBy={handleSeeUsedBy}
          showAction
        />
        <TokenTable
          title="Inactive Tokens"
          tokens={inactiveTokens}
          handleSeeUsedBy={handleSeeUsedBy}
          showAction={false}
        />
      </div>

      {/* Used By Modal */}
      {showUsedBy && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-xl max-w-lg w-full text-white">
            <h2 className="text-xl text-yellow-400 font-semibold mb-4 text-center">
              Used By Students
            </h2>
            {usedByList.length > 0 ? (
              <table className="w-full border border-white/20 text-sm">
                <thead className="bg-white/10">
                  <tr>
                    <th className="py-2 px-3 text-left">Name</th>
                    <th className="py-2 px-3 text-left">Roll</th>
                  </tr>
                </thead>
                <tbody>
                  {usedByList
                    .slice()
                    .sort((a, b) => {
                      const rollA = parseInt(a.roll.slice(-3), 10);
                      const rollB = parseInt(b.roll.slice(-3), 10);
                      return rollA - rollB;
                    })
                    .map((s, idx) => (
                      <tr key={idx} className="border-t border-white/10">
                        <td className="py-2 px-3">{s.name}</td>
                        <td className="py-2 px-3">{s.roll.slice(-3)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-300">No students found.</p>
            )}
            <div className="text-center mt-4">
              <button
                onClick={() => setShowUsedBy(false)}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Select component
const SelectBox = ({ label, value, setValue, options }) => (
  <div>
    <label className="block text-sm mb-2">{label}</label>
    <select
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="p-3 rounded-lg bg-linear-to-br from-green-800 via-teal-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
    >
      <option value="">Select {label}</option>
      {options.map((opt, index) => (
        <option key={index} value={opt} className="bg-teal-600">
          {opt}
        </option>
      ))}
    </select>
  </div>
);

// Reusable TokenTable
const TokenTable = ({
  title,
  tokens,
  showAction,
  handleTimeout,
  handleSeeUsedBy,
}) => (
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
              <th className="py-2 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {[...tokens].reverse().map((t) => (
              <tr key={t._id} className="border-t border-white/10">
                <td className="py-2 px-3">{t.teacherName}</td>
                <td className="py-2 px-3">{t.tokenForDepartment}</td>
                <td className="py-2 px-3">{t.tokenForSession}</td>
                <td className="py-2 px-3">{t.tokenForSubject}</td>
                <td className="py-2 px-3 text-center">
                  {t.tokenForClassNumber}
                </td>
                <td className="py-2 px-3 text-yellow-400 text-center font-bold">
                  {t.token}
                </td>
                <td className="py-2 px-3 text-center">{t.totalUseBy || 0}</td>
                <td className="py-2 px-3 text-center flex justify-center md:mt-0 mt-3 gap-2">
                  {showAction && (
                    <button
                      onClick={() => handleTimeout(t._id)}
                      className="w-20 bg-red-500 hover:bg-red-600 px-2.5 py-1 rounded-md"
                    >
                      Timeout
                    </button>
                  )}
                  <button
                    onClick={() => handleSeeUsedBy(t)}
                    className="w-32 bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md"
                  >
                    See Used By
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </motion.div>
);

export default TeacherTokenPage;
