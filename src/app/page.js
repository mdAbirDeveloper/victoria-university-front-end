"use client";
import { useEffect, useState } from "react";
import Login from "./components/student/login/page";
import StudentProfile from "./components/student/profile/page";
import TeacherProfileComponent from "./components/teacher/profile/page";

export default function Home() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const studentData = localStorage.getItem("studentData");
    const teacherData = localStorage.getItem("teacherData");

    if (studentData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRole("student");
    } else if (teacherData) {
      setRole("teacher");
    } else {
      setRole("none");
    }
  }, []);

  if (role === null) {
    return (
      <div className="text-center text-gray-600 mt-20">Checking login...</div>
    );
  }

  return (
    <div>
      {role === "student" ? (
        <StudentProfile />
      ) : role === "teacher" ? (
        <TeacherProfileComponent />
      ) : (
        <Login />
      )}
    </div>
  );
}
