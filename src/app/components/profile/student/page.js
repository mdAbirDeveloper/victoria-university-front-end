"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUserGraduate, FaEdit, FaEye, FaEyeSlash } from "react-icons/fa";
import StudentNavbar from "../../navber/student/page";

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // Load student data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("studentData");
    if (stored) {
      const data = JSON.parse(stored);
      setStudent(data);
      setFormData({ name: data.name, phone: data.phone, password: "" });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("https://victoria-university-back-end.vercel.app/api/student/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: student.phone,
          name: formData.name,
          newPhone: formData.phone,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Update failed");
        return;
      }
      localStorage.setItem("studentData", JSON.stringify(data.student));
      setStudent(data.student);
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      alert("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!student) return null;

  return (
    <div className="">
      <div className="min-h-screen bg-linear-to-br from-blue-900 via-purple-800 to-indigo-900 text-white relative">
        {/* Navbar */}
        <StudentNavbar />

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto mt-10 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20"
        >
          <div className="flex flex-col items-center text-center">
            <FaUserGraduate className="text-6xl text-yellow-400 mb-4" />
            <h1 className="text-2xl font-semibold mb-1">{student.name}</h1>
            <p className="text-gray-300 text-sm mb-2">{student.email}</p>
            <p className="text-gray-300 text-sm">Roll: {student.roll}</p>
            <p className="text-gray-300 text-sm">Phone: {student.phone}</p>
            <p
              className={`mt-3 px-4 py-1 rounded-full text-sm ${
                student.approved
                  ? "bg-green-500/30 text-green-200"
                  : "bg-yellow-500/30 text-yellow-200"
              }`}
            >
              {student.approved ? "Approved Student" : "Pending Approval"}
            </p>

            {/* Edit Button */}
            <button
              onClick={() => setEditing(!editing)}
              className="mt-5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-5 py-2 rounded-lg flex items-center gap-2 transition-all duration-300"
            >
              <FaEdit /> {editing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {/* Edit Form */}
          {editing && (
            <motion.form
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onSubmit={handleUpdate}
              className="mt-6 space-y-4 text-left"
            >
              <div>
                <label className="block text-sm mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div className="relative">
                <label className="block text-sm mb-2">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-gray-300 hover:text-yellow-400"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-lg shadow-md transition-all duration-300 mt-2 disabled:opacity-60"
              >
                {loading ? "Updating..." : "Save Changes"}
              </button>
            </motion.form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default StudentProfile;
