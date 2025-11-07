/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState } from "react";
import Head from "next/head"; // SEO এর জন্য
import Login from "./components/student/login/page";
import StudentProfile from "./components/student/profile/page";
import TeacherProfileComponent from "./components/teacher/profile/page";

export default function Home() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const studentData = localStorage.getItem("studentData");
    const teacherData = localStorage.getItem("teacherData");

    if (studentData) {
      setRole("student");
    } else if (teacherData) {
      setRole("teacher");
    } else {
      setRole("none");
    }
  }, []);

  if (role === null) {
    return (
      <div className="text-center text-gray-600 mt-20">
        Checking login... / লগইন যাচাই করা হচ্ছে...
      </div>
    );
  }

  return (
    <>
      {/* SEO Section */}
      <Head>
        <title>Victoria University Attendance | হাজিরা</title>
        <meta name="google-site-verification" content="7dO-1SEFmXZjBNg-3rEe4X-5fDPyQf_dCV45rNlP9PU" />
        <meta
          name="description"
          content="Victoria University Student and Teacher Portal. Check and manage attendance data (Hajira) for students and teachers. / ভিক্টোরিয়া ইউনিভার্সিটি ছাত্র ও শিক্ষক পোর্টাল। ছাত্র ও শিক্ষকদের হাজিরা ডেটা দেখুন ও ম্যানেজ করুন।"
        />
        <meta property="og:title" content="Victoria University Attendance | হাজিরা" />
        <meta
          property="og:description"
          content="Student and Teacher Portal for managing attendance data. / ছাত্র ও শিক্ষক হাজিরা ব্যবস্থাপনার পোর্টাল।"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://victoria-university.vercel.app" />
        <meta property="og:image" content="/og-image.png" />
      </Head>

      <div>
        {role === "student" ? (
          <StudentProfile /> // এখানে হাজিরা দেখার component
        ) : role === "teacher" ? (
          <TeacherProfileComponent /> // teacher হাজিরা ম্যানেজমেন্ট component
        ) : (
          <Login />
        )}
      </div>
    </>
  );
}
