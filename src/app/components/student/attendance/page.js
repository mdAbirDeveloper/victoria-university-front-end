/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import StudentNavbar from "../navber/page";

const COLORS = ["#4ade80", "#f87171"]; // green = present, red = absent

export default function StudentAttendance() {
  const [studentData, setStudentData] = useState(null);
  const [tokenInput, setTokenInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Fetch and update student data from backend
  const refetchStudentData = async (id) => {
    try {
      const res = await fetch(`https://victoria-university-back-end.vercel.app/api/students/${id}`);
      if (!res.ok) throw new Error("Failed to fetch updated student data");
      const newData = await res.json();
      localStorage.setItem("studentData", JSON.stringify(newData));
      setStudentData(newData);
    } catch (error) {
      console.error("Refetch failed:", error);
    }
  };

  // Load student from localStorage initially and refresh
  useEffect(() => {
    const data = localStorage.getItem("studentData");
    if (data) {
      const parsed = JSON.parse(data);
      setStudentData(parsed);
      refetchStudentData(parsed._id);
    } else {
      alert("You must be logged in as a student!");
      window.location.href = "/";
    }
  }, []);

  // Filter logic
  useEffect(() => {
    if (!studentData) return;
    let filtered = studentData.present || [];

    if (selectedSubject) filtered = filtered.filter((p) => p.subject === selectedSubject);
    if (selectedYear) filtered = filtered.filter((p) => p.date.startsWith(selectedYear));
    if (selectedMonth) filtered = filtered.filter((p) => {
      const year = selectedYear || p.date.slice(0, 4);
      return p.date.startsWith(`${year}-${selectedMonth}`);
    });
    if (selectedStatus) filtered = filtered.filter((p) => selectedStatus === "present" ? p.isPresent : !p.isPresent);

    setAttendanceData(filtered);
  }, [selectedSubject, selectedYear, selectedMonth, selectedStatus, studentData]);

  // Submit attendance
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tokenInput.trim()) return setMessage("Enter token to submit.");

    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("https://victoria-university-back-end.vercel.app/api/student/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenInput.trim(), studentId: studentData._id }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Attendance recorded — refreshed.");
        await refetchStudentData(studentData._id);
      } else {
        setMessage(data?.message || "Unable to record attendance.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error — try again later.");
    } finally {
      setLoading(false);
      setTokenInput("");
    }
  };

  // Chart data
  const totalPresent = attendanceData.filter((a) => a.isPresent).length;
  const totalAbsent = attendanceData.length - totalPresent;
  const chartData = [{ name: "Present", value: totalPresent }, { name: "Absent", value: totalAbsent }];

  const uniqueYears = [...new Set(studentData?.present.map((p) => p.date.slice(0, 4)) || [])];
  const uniqueSubjects = [...new Set(studentData?.present.map((p) => p.subject) || [])];

  const resetFilters = () => {
    setSelectedSubject("");
    setSelectedYear("");
    setSelectedMonth("");
    setSelectedStatus("");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-800 to-indigo-900 text-slate-50">
      <StudentNavbar />

      <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <motion.header initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-yellow-400">Attendance</h1>
          <p className="text-sm text-slate-300 text-center mt-2">Quickly submit today's token & explore your attendance report.</p>
        </motion.header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: submit card */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 backdrop-blur rounded-xl p-4 sm:p-6 shadow-md">
            <h2 className="text-lg font-semibold text-white mb-3">Submit Attendance</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Attendance token" value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} className="w-full p-3 rounded-lg bg-white/10 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              <button type="submit" disabled={loading} className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold py-2 rounded-lg transition disabled:opacity-60">
                {loading ? 'Submitting...' : 'Submit token'}
              </button>
            </form>
            {message && <div className={`mt-3 text-sm ${message.includes('Unable') || message.includes('Server') ? 'text-red-400' : 'text-green-400'}`}>{message}</div>}

            <hr className="my-4 border-white/6" />
            <div className="text-xs text-slate-300">Tip: Tokens are single-use. If submission fails, check token and try again.</div>
          </motion.div>

          {/* Middle & Right: chart + filters + table */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Filters card */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 backdrop-blur rounded-xl p-4 shadow-md">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Filters</h3>
                <div className="flex items-center gap-2">
                  <button onClick={() => setFiltersOpen((s) => !s)} className="text-sm text-slate-200 underline">{filtersOpen ? 'Hide' : 'Show'}</button>
                  <button onClick={resetFilters} className="text-sm text-red-400">Reset</button>
                </div>
              </div>

              <div className={`${filtersOpen ? 'mt-4 grid' : 'mt-4 grid'} grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3`}> 
                <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="p-3 rounded-lg bg-slate-800 text-white">
                  <option value="">All Subjects</option>
                  {uniqueSubjects.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>

                <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="p-3 rounded-lg bg-slate-800 text-white">
                  <option value="">All Years</option>
                  {uniqueYears.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>

                <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="p-3 rounded-lg bg-slate-800 text-white">
                  <option value="">All Months</option>
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = String(i + 1).padStart(2, '0');
                    return <option key={month} value={month}>{month}</option>
                  })}
                </select>

                <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="p-3 rounded-lg bg-slate-800 text-white">
                  <option value="">All Status</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                </select>
              </div>
            </motion.div>

            {/* Chart + summary card */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 backdrop-blur rounded-xl p-4 sm:p-6 shadow-md flex flex-col md:flex-row items-center gap-4">
              <div className="w-full md:w-1/2 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {chartData.map((entry, index) => <Cell key={`c-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full md:w-1/2 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-300">Total Records</div>
                    <div className="text-lg font-semibold">{attendanceData.length}</div>
                  </div>

                  <div>
                    <div className="text-sm text-slate-300">Present</div>
                    <div className="text-lg font-semibold text-green-400">{totalPresent}</div>
                  </div>

                  <div>
                    <div className="text-sm text-slate-300">Absent</div>
                    <div className="text-lg font-semibold text-red-400">{totalAbsent}</div>
                  </div>
                </div>

                <div className="text-xs text-slate-300">Tip: Use filters to narrow results. Chart reflects filtered data.</div>
              </div>
            </motion.div>

            {/* Table card */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 backdrop-blur rounded-xl p-4 shadow-md overflow-auto">
              <table className="w-full min-w-[640px] table-auto text-sm">
                <thead className="text-left border-b border-white/10">
                  <tr>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Subject</th>
                    <th className="py-2 px-3 text-center">Class</th>
                    <th className="py-2 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.length > 0 ? (
                    attendanceData.map((a, i) => (
                      <tr key={i} className="border-b border-white/6 hover:bg-white/2">
                        <td className="py-2 px-3">{a.date}</td>
                        <td className="py-2 px-3">{a.subject}</td>
                        <td className="py-2 px-3 text-center">{a.classNumber}</td>
                        <td className={`py-2 px-3 text-center font-semibold ${a.isPresent ? 'text-green-400' : 'text-red-400'}`}>{a.isPresent ? 'Present' : 'Absent'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-300 italic">No records found for selected filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
