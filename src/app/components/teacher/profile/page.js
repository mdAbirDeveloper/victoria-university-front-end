"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaChalkboardTeacher, FaEdit, FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import TeacherNavbar from "../navber/page";

const TeacherProfileComponent = () => {
  const [teacher, setTeacher] = useState(null);
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    department: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const departments = [
    "Computer Science and Engineering",
    "Electrical and Electronic Engineering",
    "Civil Engineering",
    "Mechanical Engineering",
    "Business Administration",
    "Law",
    "English",
    "Economics",
    "Accounting",
    "Finance and Banking",
    "Marketing",
    "Sociology",
    "Political Science",
    "Pharmacy",
    "Public Health",
    "Mathematics",
  ];

  useEffect(() => {
    const stored = localStorage.getItem("teacherData");
    if (stored) {
      const data = JSON.parse(stored);
      setTeacher(data);
      setFormData({
        name: data.name,
        email: data.email,
        phone: data.phone,
        department: data.department,
        password: "",
      });
    } else {
      router.push("/components/teacher/login");
    }
  }, [router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("https://victoria-university-back-end.vercel.app/api/teacher/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Update failed");
        return;
      }
      localStorage.setItem("teacherData", JSON.stringify(data.teacher));
      setTeacher(data.teacher);
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!teacher) return null;

  return (
    <div className=" bg-linear-to-br from-green-800 via-teal-700 to-blue-700 ">
      <TeacherNavbar />
      <div className="min-h-screen text-white relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto mt-10 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20"
        >
          <div className="flex flex-col items-center text-center">
            <FaChalkboardTeacher className="text-6xl text-yellow-400 mb-4" />
            <h1 className="text-2xl font-semibold mb-1">{teacher.name}</h1>
            <p className="text-gray-300 text-sm mb-2">{teacher.email}</p>
            <p className="text-gray-300 text-sm">Phone: {teacher.phone}</p>
            <p className="text-gray-300 text-sm">
              Department: {teacher.department}
            </p>

            <button
              onClick={() => setEditing(!editing)}
              className="mt-5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-5 py-2 rounded-lg flex items-center gap-2 transition-all duration-300"
            >
              <FaEdit /> {editing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

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
                <label className="block text-sm mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
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
              <div>
                <label className="block text-sm mb-2">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="">Select Department</option>
                  {departments.map((d, i) => (
                    <option key={i} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <label className="block text-sm mb-2">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-lg shadow-md mt-2 disabled:opacity-60"
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

export default TeacherProfileComponent;
