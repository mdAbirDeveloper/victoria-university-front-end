"use client";
import React, { useEffect, useState } from "react";
import { departments, sessions } from "../../../../../data";
import { motion } from "framer-motion";
import TeacherNavbar from "../navber/page";

const BATCH_SIZE = 500;

const AllStudent = () => {
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [department, setDepartment] = useState("");
  const [session, setSession] = useState("");
  const [students, setStudents] = useState([]);
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchRoll, setSearchRoll] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // ✅ Restore previous page state (filter, data, scroll)
  useEffect(() => {
    const savedState = localStorage.getItem("teacherPageState");
    if (savedState) {
      const state = JSON.parse(savedState);
      setDepartment(state.department);
      setSession(state.session);
      setStudents(state.students);
      setApproved(state.approved);
      setPage(state.page);
      setTotal(state.total);
      setTimeout(() => {
        window.scrollTo({ top: localStorage.getItem("scrollY") || 0 });
      }, 100);
      localStorage.removeItem("teacherPageState");
      localStorage.removeItem("scrollY");
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

  // ✅ Check teacher login
  useEffect(() => {
    const data = localStorage.getItem("teacherData");
    if (!data) {
      alert("Access denied! Only teachers can view this page.");
      window.location.href = "/";
    } else {
      setTeacherInfo(JSON.parse(data));
    }
  }, []);

  // ✅ Fetch students batch-wise
  const fetchStudents = async (newPage = 1) => {
    if (!department || !session) {
      alert("Please select department and session");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://victoria-university-back-end.vercel.app/api/students?department=${department}&session=${session}&page=${newPage}&limit=${BATCH_SIZE}`
      );
      const data = await res.json();

      if (res.ok) {
        const approvedStudents = data.students.filter((s) => s.approved);
        const pendingStudents = data.students.filter((s) => !s.approved);

        if (newPage === 1) {
          setApproved(approvedStudents);
          setStudents(pendingStudents);
        } else {
          setApproved((prev) => [...prev, ...approvedStudents]);
          setStudents((prev) => [...prev, ...pendingStudents]);
        }

        setTotal(data.total);
        setPage(newPage);
      } else {
        alert(data.message || "Failed to fetch students");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Approve student
  const handleApprove = async (id) => {
    try {
      const res = await fetch(
        `https://victoria-university-back-end.vercel.app/api/student/approve/${id}`,
        { method: "PUT" }
      );
      const data = await res.json();
      if (res.ok) {
        setStudents((prev) => prev.filter((s) => s._id !== id));
        setApproved((prev) => [...prev, data.student]);
      } else alert(data.message);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Unapprove student
  const handleUnapprove = async (id) => {
    try {
      const res = await fetch(
        `https://victoria-university-back-end.vercel.app/api/student/unapprove/${id}`,
        { method: "PUT" }
      );
      const data = await res.json();
      if (res.ok) {
        setApproved((prev) => prev.filter((s) => s._id !== id));
        setStudents((prev) => [...prev, data.student]);
      } else alert(data.message);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Delete student
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;

    try {
      const res = await fetch(
        `https://victoria-university-back-end.vercel.app/api/student/delete/${id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (res.ok) {
        setApproved((prev) => prev.filter((s) => s._id !== id));
        setStudents((prev) => prev.filter((s) => s._id !== id));
      } else alert(data.message);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Roll filter (last 3 digits)
  const filterByRoll = (list) => {
    if (!searchRoll.trim()) return list;
    return list.filter((student) =>
      student.roll.slice(-3).includes(searchRoll.trim())
    );
  };

  const filteredPending = filterByRoll(students);
  const filteredApproved = filterByRoll(approved);

  return (
    <div className="min-h-screen bg-linear-to-br from-green-800 via-teal-700 to-blue-700 text-white">
      <TeacherNavbar />

      <div className="p-5 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">All Students</h1>

        {/* Filter section */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg max-w-[680px] mx-auto mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-3">
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
              className="p-3 rounded-lg bg-linear-to-br from-green-800 via-teal-700 text-white w-full md:w-auto focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Select Session</option>
              {sessions.map((sess, i) => (
                <option key={i} value={sess} className="bg-teal-600">
                  {sess}
                </option>
              ))}
            </select>

            <button
              onClick={() => fetchStudents(1)}
              disabled={loading}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-12 py-3 rounded-lg transition-all disabled:opacity-60 w-full md:w-auto"
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </div>
        </div>

        
        {/* Search */}
        {(students.length > 0 || approved.length > 0) && (
          <div className="text-center mb-6">
            <input
              type="text"
              placeholder="Search by last 3 digits of roll..."
              value={searchRoll}
              onChange={(e) => setSearchRoll(e.target.value)}
              className="p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-yellow-400 w-full md:w-1/2"
            />
          </div>
        )}

        {/* No Student Found Message */}
        {filteredApproved.length === 0 &&
          filteredPending.length === 0 &&
          !loading && (
            <div className="flex justify-center items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-lg text-center max-w-md"
              >
                <h2 className="text-2xl font-semibold mb-2 text-yellow-300">
                  No Students Found
                </h2>
                <p className="text-white/80">
                  It looks like there are no students available for your
                  selected department and session.
                </p>
                <p className="mt-3 text-sm text-white/60">
                  Try selecting a different department or session to see
                  results.
                </p>
              </motion.div>
            </div>
          )}


        {/* Approved Students */}
        {filteredApproved.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl shadow-lg overflow-x-auto mb-4">
            <h2 className="text-xl font-semibold mb-4">Approved Students</h2>
            <table className="w-full min-w-[600px] text-white border-separate border-spacing-0">
              <thead className="bg-white/20">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Roll</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApproved.map((student) => (
                  <tr
                    key={student._id}
                    className="odd:bg-white/5 even:bg-white/10"
                  >
                    <td className="p-3">{student.name}</td>
                    <td className="p-3">{student.roll.slice(-3)}</td>
                    <td className="p-3 text-center space-x-2">
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
                            })
                          );
                          localStorage.setItem("scrollY", window.scrollY);
                          window.location.href = `/components/teacher/${student._id}`;
                        }}
                        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition"
                      >
                        Details
                      </button>

                      <button
                        onClick={() => handleUnapprove(student._id)}
                        className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded-lg transition"
                      >
                        Unapprove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pending Students */}
        {filteredPending.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl shadow-lg mb-8 overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4">Pending Students</h2>
            <table className="w-full min-w-[600px] text-white border-separate border-spacing-0">
              <thead className="bg-white/20">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Roll</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPending.map((student) => (
                  <tr
                    key={student._id}
                    className="odd:bg-white/5 even:bg-white/10"
                  >
                    <td className="p-3">{student.name}</td>
                    <td className="p-3">{student.roll.slice(-3)}</td>

                    <td className="p-3 text-center space-x-2">
                      <button
                        onClick={() => handleApprove(student._id)}
                        className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition"
                      >
                        Approve
                      </button>

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
                            })
                          );
                          localStorage.setItem("scrollY", window.scrollY);
                          window.location.href = `/components/teacher/${student._id}`;
                        }}
                        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllStudent;
