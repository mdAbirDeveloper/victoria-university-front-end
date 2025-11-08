"use client";
import React, { useState, useEffect } from "react";
import {
  departments,
  departmentSubjects,
  sessions,
  subjects,
} from "../../../../../data";
import TeacherNavbar from "../navber/page";

const Attendance = () => {
  const [department, setDepartment] = useState("");
  const [session, setSession] = useState("");
  const [subject, setSubject] = useState("");
  const [classNumber, setClassNumber] = useState("");
  const [token, setToken] = useState("");
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("filter"); // 'filter' | 'token'
  const [summary, setSummary] = useState({ total: 0, present: 0, absent: 0 });
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [message, setMessage] = useState({ type: "", text: "" }); // UI message
  const [teacherData, setTeacherData] = useState(null);
  const [approved, setApproved] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

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

  // যখন department change হবে তখন subject list আপডেট হবে
  useEffect(() => {
    if (department && departmentSubjects[department]) {
      setAvailableSubjects(departmentSubjects[department]);
      setSubject(""); // নতুন department নিলে পুরনো subject reset
    } else {
      setAvailableSubjects([]);
    }
  }, [department]);

  // ✅ Restore previous page state (filter, data, scroll)
  useEffect(() => {
    const savedState = localStorage.getItem("teacherPageState");
    if (savedState) {
      const state = JSON.parse(savedState);
      setDepartment(state.department); // 1. Department restore
      // 2. wait for availableSubjects update, then set subject
      setTimeout(() => {
        setSubject(state.subject);
        setSession(state.session);
        setStudents(state.students);
        setApproved(state.approved);
        setPage(state.page);
        setTotal(state.total);
        setClassNumber(state.classNumber);
        setToken(state.token);
        setMode(state.mode)

        window.scrollTo({ top: localStorage.getItem("scrollY") || 0 });

        localStorage.removeItem("teacherPageState");
        localStorage.removeItem("scrollY");
      }, 50); // small delay to ensure availableSubjects updated
    }
  }, []);

  // ✅ Save scroll position before navigating
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("scrollY", window.scrollY);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // ✅ Recalculate summary
  useEffect(() => {
    if (students.length === 0) {
      setSummary({ total: 0, present: 0, absent: 0 });
      return;
    }

    let total = 0;
    let presentCount = 0;

    students.forEach((student) => {
      const attendance = student.present.find((p) =>
        mode === "token"
          ? p.token === token
          : p.subject?.trim() === subject?.trim() &&
            String(p.classNumber).trim() === String(classNumber).trim()
      );
      if (attendance) {
        total += 1;
        if (attendance.isPresent) presentCount += 1;
      }
    });

    setSummary({ total, present: presentCount, absent: total - presentCount });
  }, [students, token, subject, classNumber, mode]);

  // Message auto-hide effect
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 2000); // 2 seconds

      return () => clearTimeout(timer); // clean up on unmount or new message
    }
  }, [message]);

  // ✅ Fetch students (Filter)
  const fetchStudents = async () => {
    if (!department || !session || !subject || !classNumber) {
      setMessage({ type: "error", text: "Please fill all fields!" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch(
        `https://victoria-university-back-end.vercel.app/api/student/find?department=${department}&session=${session}&subject=${subject}&classNumber=${classNumber}&date=${date}`
      );
      const data = await res.json();
      if (data.success) {
        const sorted = data.students.sort(
          (a, b) => parseInt(a.roll.slice(-3)) - parseInt(b.roll.slice(-3))
        );
        setStudents(sorted);
        setMessage({
          type: "success",
          text: `${sorted.length} students found!`,
        });
      } else {
        setStudents([]);
        setMessage({ type: "info", text: "No students found!" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Error fetching students" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch students (Token)
  const fetchByToken = async () => {
    if (!token.trim()) {
      setMessage({ type: "error", text: "Please enter a token!" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch(
        `https://victoria-university-back-end.vercel.app/api/student/find-by-token?token=${token}`
      );
      const data = await res.json();
      if (data.success) {
        setStudents(data.students);
        setMessage({
          type: "success",
          text: `${data.students.length} students found!`,
        });
      } else {
        setStudents([]);
        setMessage({ type: "info", text: "No students found for this token!" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Error fetching by token" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle Present/Absent
  const togglePresent = async (studentId, currentStatus, token) => {
    try {
      const res = await fetch(
        "https://victoria-university-back-end.vercel.app/api/student/toggle-attendance",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId,
            subject,
            classNumber,
            token,
            isPresent: !currentStatus,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setStudents((prev) =>
          prev.map((s) =>
            s._id === studentId
              ? {
                  ...s,
                  present: s.present.map((p) =>
                    p.token === token ? { ...p, isPresent: !currentStatus } : p
                  ),
                }
              : s
          )
        );
        setMessage({
          type: "success",
          text: "Attendance updated successfully!",
        });
        // if (mode === "token") await fetchByToken();
        // else await fetchStudents();
      } else setMessage({ type: "error", text: data.message });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Update failed" });
    }
  };

  // ✅ Filter logic
  const filteredStudents = students
    .filter((s) => {
      const record = s.present.find((p) =>
        mode === "token"
          ? p.token === token
          : p.subject === subject && p.classNumber === classNumber
      );
      if (!record) return false;
      if (filter === "present") return record.isPresent === true;
      if (filter === "absent") return record.isPresent === false;
      return true;
    })
    .filter((s) => s.roll.slice(-3).includes(search.trim()));

  return (
    <div className="bg-linear-to-br from-green-800 via-teal-700 to-blue-700 min-h-screen text-white">
      <TeacherNavbar />
      <div className="min-h-screen md:p-6">
        <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl animate-fadeIn text-white">
          <h2 className="text-3xl font-bold text-center mb-6 text-white">
            🎓 Attendance Management
          </h2>

          {/* Message Box */}
          {/* {message.text && (
            <div
              className={`my-4 p-3 rounded-lg text-center font-medium ${
                message.type === "error"
                  ? "bg-red-500 text-white"
                  : message.type === "success"
                  ? "bg-green-500 text-white"
                  : "bg-blue-500 text-white"
              }`}
            >
              {message.text}
            </div>
          )} */}

          {/* Mode Switch */}
          <div className="flex justify-center gap-3 mb-6">
            <button
              onClick={() => setMode("filter")}
              className={`px-4 py-2 rounded-lg font-medium w-48 ${
                mode === "filter"
                  ? "bg-blue-500 text-white"
                  : "bg-white/30 text-white"
              }`}
            >
              Filter by Class Info
            </button>
            <button
              onClick={() => setMode("token")}
              className={`px-4 py-2 rounded-lg font-medium w-36 ${
                mode === "token"
                  ? "bg-blue-500 text-white"
                  : "bg-white/30 text-white"
              }`}
            >
              Find by Token
            </button>
          </div>

          {/* Filter Form */}
          {mode === "filter" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="p-3 rounded-lg bg-linear-to-br from-green-800 via-teal-700 text-white w-full md:w-auto focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">Select Department</option>
                {departments.map((dept, i) => (
                  <option key={i} value={dept} className="bg-teal-600">
                    {dept}
                  </option>
                ))}
              </select>

              <select
                value={session}
                onChange={(e) => setSession(e.target.value)}
                className="border border-gray-300 p-2 rounded-lg text-white"
              >
                <option value="">Select Session</option>
                {sessions.map((ses) => (
                  <option className="bg-teal-600" key={ses} value={ses}>
                    {ses}
                  </option>
                ))}
              </select>

              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="border border-gray-300 p-2 rounded-lg text-white"
              >
                <option value="">Select Subject</option>
                {availableSubjects.map((sub) => (
                  <option className="bg-teal-600" key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Class Number"
                value={classNumber}
                onChange={(e) => setClassNumber(e.target.value)}
                className="border border-gray-300 p-2 rounded-lg text-white placeholder-white"
              />

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border border-gray-300 p-2 rounded-lg text-white"
              />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <input
                type="text"
                placeholder="Enter Token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="border border-gray-300 p-2 rounded-lg text-white placeholder-white w-full md:w-48"
              />
              <button
                onClick={fetchByToken}
                disabled={loading}
                className="md:w-36 w-full bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition"
              >
                {loading ? "Loading..." : "Search Students"}
              </button>
            </div>
          )}

          {/* Fetch Button for Filter */}
          {mode === "filter" && (
            <button
              onClick={fetchStudents}
              disabled={loading}
              className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition w-full sm:w-auto"
            >
              {loading ? "Loading..." : "Search Students"}
            </button>
          )}

          {/* Summary */}
          {students.length > 0 && (
            <div className="bg-white/20 p-4 rounded-lg mt-6 text-center text-white">
              <p className="font-semibold">
                Total Students: {summary.total} | Present:{" "}
                <span className="text-green-300">{summary.present}</span> |
                Absent: <span className="text-red-300">{summary.absent}</span>
              </p>
            </div>
          )}

          {/* Filter & Search */}
          {students.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3 mt-5">
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1 rounded-md font-medium ${
                    filter === "all"
                      ? "bg-blue-500 text-white"
                      : "bg-white/30 text-white"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("present")}
                  className={`px-3 py-1 rounded-md font-medium ${
                    filter === "present"
                      ? "bg-green-500 text-white"
                      : "bg-white/30 text-white"
                  }`}
                >
                  Present
                </button>
                <button
                  onClick={() => setFilter("absent")}
                  className={`px-3 py-1 rounded-md font-medium ${
                    filter === "absent"
                      ? "bg-red-500 text-white"
                      : "bg-white/30 text-white"
                  }`}
                >
                  Absent
                </button>
              </div>

              <input
                type="text"
                placeholder="Search by last 3 digits"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 p-2 rounded-lg text-white placeholder-white w-48"
              />
            </div>
          )}

          {/* Student Table */}
          {students.length > 0 && (
            <div className="overflow-x-auto shadow-md rounded-lg mt-5">
              <table className="min-w-full divide-y divide-gray-40 text-white rounded-lg">
                <thead className="bg-gray-200 text-gray-900">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold">Name</th>
                    <th className="py-3 px-4 text-left font-semibold">Roll</th>
                    <th className="py-3 px-4 text-center font-semibold">
                      Attendance
                    </th>
                    <th className="py-3 px-4 text-left font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {filteredStudents
                    .sort(
                      (a, b) =>
                        parseInt(a.roll.slice(-3)) - parseInt(b.roll.slice(-3))
                    )
                    .map((student) => {
                      const attendance = student.present.find((p) =>
                        mode === "token"
                          ? p.token === token
                          : p.subject === subject &&
                            p.classNumber === classNumber
                      );
                      const isPresent = attendance?.isPresent;

                      return (
                        <tr key={student._id} className="hover:bg-teal-600">
                          <td className="py-2 px-4">{student.name}</td>
                          <td className="p-3">{student.roll.slice(-3)}</td>
                          <td className="py-2 px-4 text-center">
                            {isPresent ? (
                              <div className="flex justify-center items-center gap-3">
                                <span className="text-white font-medium">
                                  ✅ Present
                                </span>
                                <button
                                  onClick={() =>
                                    togglePresent(
                                      student._id,
                                      isPresent,
                                      attendance?.token
                                    )
                                  }
                                  className="w-36 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                                >
                                  Mark Absent
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() =>
                                  togglePresent(
                                    student._id,
                                    isPresent,
                                    attendance?.token
                                  )
                                }
                                className="w-36 bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600 transition"
                              >
                                Mark Present
                              </button>
                            )}
                          </td>
                          <td className="text-center">
                            <button
                              onClick={() => {
                                localStorage.setItem(
                                  "teacherPageState",
                                  JSON.stringify({
                                    department,
                                    session,
                                    students,
                                    approved,
                                    page,
                                    total,
                                    subject,
                                    classNumber,
                                    token,
                                    mode,
                                  })
                                );
                                localStorage.setItem("scrollY", window.scrollY);
                                window.location.href = `/components/teacher/${student._id}`;
                              }}
                              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
