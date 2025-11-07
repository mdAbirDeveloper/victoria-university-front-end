// app/sitemap.js

const BASE_URL = "https://cumilla-victoria.vercel.app/"; // **আপনার ডোমেইন দিয়ে পরিবর্তন করুন**

export default function sitemap() {
  return [
    {
      url: BASE_URL, // হোমপেজ
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/components/teacher/ganerateToken`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/components/teacher/allStudents`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/components/teacher/attendance`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/components/student/profile`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/components/student/attendance`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // আপনার অন্য স্ট্যাটিক পেজগুলি এখানে যোগ করুন
  ];
}
