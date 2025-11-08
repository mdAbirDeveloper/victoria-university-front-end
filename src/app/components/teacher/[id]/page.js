"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import TeacherNavbar from "../navber/page";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const StudentDetails = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [filters, setFilters] = useState({
    year: "",
    month: "",
    subject: "",
    status: "",
  });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(
          `https://victoria-university-back-end.vercel.app/api/student/${id}`
        );
        const data = await res.json();
        if (res.ok) setStudent(data.student);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  const handleBack = () => {
    const prevPage = localStorage.getItem("teacherPrevPage");
    if (prevPage) {
      window.location.href = prevPage; // je page theke esheche shei page e pathabe
      localStorage.removeItem("teacherPrevPage"); // optional cleanup
    } else {
      // Fallback, jodi kono previous page na thake
      window.history.back();
    }
  };

  // Filtered Attendance
  const filteredAttendance =
    student?.present?.filter((p) => {
      const dateObj = new Date(p.date);
      const yearMatch = filters.year
        ? dateObj.getFullYear() === Number(filters.year)
        : true;
      const monthMatch = filters.month
        ? dateObj.getMonth() + 1 === Number(filters.month)
        : true;
      const subjectMatch = filters.subject
        ? p.subject === filters.subject
        : true;
      const statusMatch = filters.status
        ? filters.status === "present"
          ? p.isPresent
          : !p.isPresent
        : true;
      return yearMatch && monthMatch && subjectMatch && statusMatch;
    }) || [];

  // Visible Attendance for Show More / Show Less
  const visibleAttendance = showAll
    ? filteredAttendance
    : filteredAttendance.slice(0, 6);

  // Chart Data
  const chartData = student?.present
    ? Object.values(
        student.present.reduce((acc, p) => {
          if (!acc[p.subject])
            acc[p.subject] = { subject: p.subject, present: 0, absent: 0 };
          if (p.isPresent) acc[p.subject].present++;
          else acc[p.subject].absent++;
          return acc;
        }, {})
      )
    : [];

  const totalPresent = student?.present?.filter((p) => p.isPresent).length || 0;
  const totalAbsent = student?.present?.length - totalPresent;

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-linear-to-br from-teal-700 via-green-700 to-blue-700">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full"
        ></motion.div>
      </div>
    );

  if (!student)
    return (
      <div className="bg-linear-to-br from-green-800 via-teal-700 to-blue-700">
        <TeacherNavbar />
        <div className="text-center text-white min-h-screen flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold mb-4">Student Not Found</h2>
          <button
            onClick={handleBack}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-2 rounded-lg transition"
          >
            Back
          </button>
        </div>
      </div>
    );

  return (
    <div className="bg-linear-to-br from-green-800 via-teal-700 to-blue-700 min-h-screen text-white relative">
      <TeacherNavbar />
      <div className="p-4 sm:p-6 mt-20">
        <motion.div
          initial={{ rotateY: 360, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl w-full mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/20"
        >
          <div className="mb-6 text-center">
            <button
              onClick={handleBack}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-2 rounded-lg transition font-semibold shadow-md"
            >
              ← Back
            </button>
          </div>

          <h1 className="text-3xl font-bold mb-4 text-center text-yellow-300">
            Student Details
          </h1>

          {/* Student Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <p>
              <strong>Name:</strong> {student.name}
            </p>
            <p>
              <strong>Roll:</strong> {student.roll}
            </p>
            <p>
              <strong>Department:</strong> {student.department}
            </p>
            <p>
              <strong>Session:</strong> {student.session}
            </p>
            <p>
              <strong>Email:</strong> {student.email}
            </p>
            <p>
              <strong>Phone:</strong> {student.phone}
            </p>
            <p>
              <strong>Father:</strong> {student.fatherName}
            </p>
            <p>
              <strong>Mother:</strong> {student.motherName}
            </p>
            <p>
              <strong>Address:</strong> {student.address}
            </p>
          </div>

          {/* Chart Section */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-3 text-yellow-300 text-center">
              Attendance Summary
            </h2>

            {chartData.length > 0 ? (
              <div className="w-full bg-white rounded-lg p-3 md:p-4 shadow">
                <div className="h-72 sm:h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      layout="vertical"
                      margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        type="number"
                        stroke="#334155"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        dataKey="subject"
                        type="category"
                        stroke="#334155"
                        tick={{ fontSize: 12 }}
                        width={90}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#023B03",
                          border: "none",
                          color: "#f8fafc",
                        }}
                      />
                      <Legend wrapperStyle={{ color: "#334155" }} />
                      <Bar
                        dataKey="present"
                        fill="#0841FF"
                        name="Present"
                        barSize={22}
                        radius={[4, 4, 4, 4]}
                      />
                      <Bar
                        dataKey="absent"
                        fill="#FF0025"
                        name="Absent"
                        barSize={22}
                        radius={[4, 4, 4, 4]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 text-center">
                No attendance data available.
              </p>
            )}

            <p className="text-center mt-3 text-sm text-gray-200">
              ✅ Total Present: <b>{totalPresent}</b> | ❌ Total Absent:{" "}
              <b>{totalAbsent}</b>
            </p>
          </div>

          {/* Attendance Table */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2 text-yellow-300">
              Attendance Records
            </h2>

            {/* Filters */}
            <div className="grid md:grid-cols-5 grid-cols-2 gap-3 mb-4">
              <select
                style={{ backgroundColor: "teal", color: "white" }}
                className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                value={filters.year}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, year: e.target.value }))
                }
              >
                <option value="">All Years</option>
                {[
                  ...new Set(
                    student.present.map((p) => new Date(p.date).getFullYear())
                  ),
                ].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <select
                style={{ backgroundColor: "teal", color: "white" }}
                className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                value={filters.month}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, month: e.target.value }))
                }
              >
                <option value="">All Months</option>
                {[...Array(12).keys()].map((m) => (
                  <option key={m + 1} value={m + 1}>
                    {new Date(0, m).toLocaleString("default", {
                      month: "long",
                    })}
                  </option>
                ))}
              </select>

              <select
                style={{ backgroundColor: "teal", color: "white" }}
                className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                value={filters.subject}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, subject: e.target.value }))
                }
              >
                <option value="">All Subjects</option>
                {[...new Set(student.present.map((p) => p.subject))].map(
                  (sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  )
                )}
              </select>

              <select
                style={{ backgroundColor: "teal", color: "white" }}
                className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                <option value="">All Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
              </select>

              <button
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-3 py-1 rounded-lg transition"
                onClick={() =>
                  setFilters({ year: "", month: "", subject: "", status: "" })
                }
              >
                Reset Filters
              </button>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-sm bg-white/10 rounded-lg border border-white/20">
                <thead className="bg-white/20">
                  <tr>
                    <th className="p-2">Subject</th>
                    <th className="p-2">Class</th>
                    <th className="p-2">Date</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleAttendance.map((p, index) => (
                    <tr key={index} className="odd:bg-white/5 even:bg-white/10">
                      <td className="p-2">{p.subject}</td>
                      <td className="p-2 text-center">{p.classNumber}</td>
                      <td className="p-2 text-center">{p.date}</td>
                      <td
                        className={`p-2 text-center ${
                          p.isPresent ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {p.isPresent ? "Present" : "Absent"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredAttendance.length > 6 && (
              <div className="text-center mt-4">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-5 py-2 rounded-lg transition"
                >
                  {showAll ? "Show Less" : "Show More"}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDetails;
