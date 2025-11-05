"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import StudentNavbar from "../navber/page";

const COLORS = ["#4ade80", "#f87171"]; // green = present, red = absent

const StudentAttendance = () => {
  const [studentData, setStudentData] = useState(null);
  const [tokenInput, setTokenInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);

  // ✅ Function to fetch and update student data from backend
  const refetchStudentData = async (id) => {
    try {
      const res = await fetch(
        `https://victoria-university-back-end.vercel.app/api/students/${id}`
      );
      if (!res.ok) throw new Error("Failed to fetch updated student data");

      const newData = await res.json();
      localStorage.setItem("studentData", JSON.stringify(newData));
      setStudentData(newData);
    } catch (error) {
      console.error("❌ Refetch failed:", error);
    }
  };

  // ✅ Load student from localStorage initially and refresh
  useEffect(() => {
    const data = localStorage.getItem("studentData");
    if (data) {
      const parsed = JSON.parse(data);
      setStudentData(parsed);
      refetchStudentData(parsed._id); // Always refresh from server on mount
    } else {
      alert("You must be logged in as a student!");
      window.location.href = "/";
    }
  }, []);

  // ✅ Filter logic
  useEffect(() => {
    if (!selectedSubject || !studentData) return;
    let filtered = studentData.present.filter(
      (p) => p.subject === selectedSubject
    );

    if (selectedYear)
      filtered = filtered.filter((p) =>
        p.date.startsWith(selectedYear.toString())
      );

    if (selectedMonth)
      filtered = filtered.filter((p) =>
        p.date.startsWith(
          `${selectedYear || p.date.slice(0, 4)}-${selectedMonth}`
        )
      );

    if (selectedStatus) {
      filtered = filtered.filter((p) =>
        selectedStatus === "present" ? p.isPresent : !p.isPresent
      );
    }

    setAttendanceData(filtered);
  }, [
    selectedSubject,
    selectedYear,
    selectedMonth,
    selectedStatus,
    studentData,
  ]);

  // ✅ Handle attendance submission + refetch data
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tokenInput.trim()) return alert("Please enter a token!");

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        "https://victoria-university-back-end.vercel.app/api/student/attendance",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: tokenInput.trim(),
            studentId: studentData._id,
          }),
        }
      );

      const data = await res.json();
      console.log(res)
      if (res.ok) {
        setMessage("✅ Attendance recorded successfully!");
        await refetchStudentData(studentData._id); // refresh latest data
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error");
    } finally {
      setLoading(false);
      setTokenInput("");
    }
  };

  // ✅ Count and chart
  const totalPresent = attendanceData.filter((a) => a.isPresent).length;
  const totalAbsent = attendanceData.length - totalPresent;
  const chartData = [
    { name: "Present", value: totalPresent },
    { name: "Absent", value: totalAbsent },
  ];

  const uniqueYears = [
    ...new Set(studentData?.present.map((p) => p.date.slice(0, 4)) || []),
  ];

  // ✅ Reset filters
  const resetFilters = () => {
    setSelectedSubject("");
    setSelectedYear("");
    setSelectedMonth("");
    setSelectedStatus("");
    setAttendanceData([]);
  };

  return (
    <div className="bg-linear-to-br from-blue-900 via-purple-800 to-indigo-900 min-h-screen">
      <StudentNavbar />
      <div className="min-h-screen flex flex-col items-center p-4 space-y-6">
        {/* ✅ Attendance Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md text-white"
        >
          <h1 className="text-2xl font-bold mb-6 text-center text-yellow-400">
            Student Attendance
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Enter your attendance token"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-lg shadow-md transition-all disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>

          {message && (
            <p
              className={`mt-4 text-center ${
                message.includes("❌") ? "text-red-400" : "text-green-400"
              }`}
            >
              {message}
            </p>
          )}
        </motion.div>

        {/* ✅ Subject & Chart Section */}
        {studentData && (
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl w-full md:max-w-5xl text-white">
            <h2 className="text-xl font-semibold mb-4 text-yellow-400 text-center">
              View Attendance Report
            </h2>

            {/* ✅ Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 w-full max-w-4xl mx-auto mb-6">
              {/* Subject */}
              <select
                className="w-full max-w-full p-3 rounded-lg bg-white/20 text-white focus:outline-none"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option className="bg-purple-700" value="">
                  Select Subject
                </option>
                {[...new Set(studentData.present.map((p) => p.subject))].map(
                  (subject) => (
                    <option
                      key={subject}
                      value={subject}
                      className="bg-purple-700"
                    >
                      {subject}
                    </option>
                  )
                )}
              </select>

              {/* Year */}
              <select
                className="w-full max-w-full p-3 rounded-lg bg-white/20 text-white focus:outline-none"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option className="bg-purple-700" value="">
                  Select Year
                </option>
                {uniqueYears.map((year) => (
                  <option key={year} value={year} className="bg-purple-700">
                    {year}
                  </option>
                ))}
              </select>

              {/* Month */}
              <select
                className="w-full max-w-full p-3 rounded-lg bg-white/20 text-white focus:outline-none"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option className="bg-purple-700" value="">
                  Select Month
                </option>
                {Array.from({ length: 12 }, (_, i) => {
                  const month = String(i + 1).padStart(2, "0");
                  return (
                    <option key={month} value={month} className="bg-purple-700">
                      {month}
                    </option>
                  );
                })}
              </select>

              {/* Status */}
              <select
                className="w-full max-w-full p-3 rounded-lg bg-white/20 text-white focus:outline-none"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option className="bg-purple-700" value="">
                  All Status
                </option>
                <option className="bg-purple-700" value="present">
                  Present Only
                </option>
                <option className="bg-purple-700" value="absent">
                  Absent Only
                </option>
              </select>

              {/* Reset */}
              <button
                onClick={resetFilters}
                className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Reset Filters
              </button>
            </div>

            {/* Chart + Table */}
            {selectedSubject && (
              <div className="mt-6 flex flex-col items-center w-full">
                <PieChart width={320} height={320}>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>

                <table className="w-full mt-6 text-sm border border-white/20">
                  <thead className="bg-white/20">
                    <tr>
                      <th className="py-2 px-3 text-left">Date</th>
                      <th className="py-2 px-3 text-center">Class</th>
                      <th className="py-2 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.length > 0 ? (
                      attendanceData.map((a, i) => (
                        <tr key={i} className="border-t border-white/10">
                          <td className="py-2 px-3">{a.date}</td>
                          <td className="py-2 px-3 text-center">
                            {a.classNumber}
                          </td>
                          <td
                            className={`py-2 px-3 text-center font-semibold ${
                              a.isPresent ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {a.isPresent ? "Present" : "Absent"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="text-center py-3 text-gray-300 italic"
                        >
                          No records found for selected filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAttendance;
