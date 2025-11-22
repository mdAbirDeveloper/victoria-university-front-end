/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FaEdit,
  FaEye,
  FaEyeSlash,
  FaPhoneAlt,
  FaEnvelope,
  FaCamera,
  FaTimes,
} from "react-icons/fa";
import StudentNavbar from "../navber/page";
import { useRouter } from "next/navigation";

export default function StudentProfile() {
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    avatar: "",
  });
  const [localImagePreview, setLocalImagePreview] = useState(null); // can be blob URL or remote url
  const panelRef = useRef(null);
  // add this with your other useState hooks
  const [selectedFile, setSelectedFile] = useState(null); // store file until uploaded

  const IMGBB_KEY = "09c06385569f3c94e5ea849e371108bc"; // fall back to empty string in client bundle
  const MAX_IMAGE_MB = 5;

  // load student from localStorage
  useEffect(() => {
    const raw = localStorage.getItem("studentData");
    if (!raw) {
      router.push("/components/student/login");
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setStudent(parsed);
      setFormData({
        name: parsed.name || "",
        phone: parsed.phone || "",
        password: "",
        avatar: parsed.avatar || parsed.image || "",
      });
      setLocalImagePreview(parsed.avatar || parsed.image || null);
    } catch (err) {
      console.error("Failed to parse studentData from localStorage", err);
      router.push("/components/student/login");
    }
  }, [router]);

  // close on Escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setEditing(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleChange = (e) =>
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));

  // utility: read file -> base64 (without data: prefix)
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const result = reader.result;
          const base64 =
            typeof result === "string" ? result.split(",")[1] : null;
          resolve(base64);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // upload to imgbb (returns url or null)
  const uploadToImgbb = async (file) => {
    if (!file) return null;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file (png/jpg/webp). ");
      return null;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      alert(`Please choose an image smaller than ${MAX_IMAGE_MB} MB`);
      return null;
    }

    if (!IMGBB_KEY) {
      // no API key: we allow local preview but can't upload
      console.warn(
        "No IMGBB key set: skipping upload, only showing local preview."
      );
      return null;
    }

    try {
      setUploadingImage(true);
      const base64 = await fileToBase64(file);
      const form = new FormData();
      form.append("image", base64);
      form.append("key", IMGBB_KEY);

      const res = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: form,
      });
      const json = await res.json();
      if (!res.ok) {
        console.error("imgbb error", res.status, json);
        alert(
          json?.error?.message ||
            "Image upload failed. See console for details."
        );
        return null;
      }
      return json?.data?.url || null;
    } catch (err) {
      console.error("uploadToImgbb failed", err);
      alert("Upload failed (network error). See console.");
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // local preview only (do NOT set formData.avatar to blob)
    const blobUrl = URL.createObjectURL(file);
    setLocalImagePreview(blobUrl);

    // keep the File around so handleUpdate can upload it if needed
    setSelectedFile(file);

    // try to upload right away (best-effort). If it succeeds, set real remote URL.
    // If not, selectedFile remains so handleUpdate can attempt again.
    const remote = await uploadToImgbb(file);
    if (remote) {
      setFormData((f) => ({ ...f, avatar: remote }));
      setStudent((s) => (s ? { ...s, avatar: remote } : s));
      const updated = { ...(student || {}), avatar: remote };
      localStorage.setItem("studentData", JSON.stringify(updated));
      setStudent(updated);
      setSelectedFile(null); // uploaded, no need to keep file
      // revoke blob soon to free memory
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
    } else {
      // upload failed for now — keep selectedFile so handleUpdate can retry
      console.warn("Immediate upload failed — saved file to retry on save.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    // Block saving while image upload is in progress
    if (uploadingImage) {
      alert("Please wait until the image upload completes.");
      return;
    }
    setLoading(true);
    try {
      // If user has a selectedFile (upload still in progress or earlier failed),
      // upload it now and set formData.avatar to the returned remote URL.
      if (!formData.avatar && selectedFile) {
        const remote = await uploadToImgbb(selectedFile);
        if (remote) {
          setFormData((f) => ({ ...f, avatar: remote }));
          // update local student and localStorage with proper remote url (optimistic)
          const updated = { ...(student || {}), avatar: remote };
          localStorage.setItem("studentData", JSON.stringify(updated));
          setStudent(updated);
          setSelectedFile(null);
        } else {
          // if upload failed, inform user and stop save so no blob gets sent
          alert(
            "Image upload failed. Please try again or remove the selected image before saving."
          );
          setLoading(false);
          return;
        }
      }

      const body = {
        phone: student?.phone,
        name: formData.name,
        newPhone: formData.phone,
        password: formData.password,
      };

      // only include avatar if it's a real remote URL (not a blob)
      if (formData.avatar && !formData.avatar.startsWith("blob:")) {
        body.avatar = formData.avatar;
      }

      // optimistic UI: update local student object so app feels fast
      const optimistic = {
        ...(student || {}),
        name: formData.name,
        phone: formData.phone || student.phone,
        avatar:
          formData.avatar && !formData.avatar.startsWith("blob:")
            ? formData.avatar
            : student.avatar,
      };
      localStorage.setItem("studentData", JSON.stringify(optimistic));
      setStudent(optimistic);

      const res = await fetch(
        "https://victoria-university-back-end.vercel.app/api/student/update",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        console.error("Update failed", res.status, data);
        alert(
          data?.message || "Update failed on server. Changes saved locally."
        );
      } else {
        const updatedStudent = data.student || optimistic;
        localStorage.setItem("studentData", JSON.stringify(updatedStudent));
        setStudent(updatedStudent);
        setEditing(false);
        alert("Profile updated successfully");
      }
    } catch (err) {
      console.error("Update error", err);
      alert("Could not reach server. Changes saved locally only.");
    } finally {
      setLoading(false);
    }
  };

  if (!student) return null; // or a loader if you prefer

  // compact stat pill
  const StatPill = ({ label, value }) => (
    <div className="flex flex-col">
      <span className="text-xs text-slate-300">{label}</span>
      <span className="mt-1 font-medium text-slate-100">{value || "—"}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-indigo-800 text-slate-50">
      <StudentNavbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="bg-white/5 backdrop-blur border border-white/6 rounded-2xl p-4 sm:p-6 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-start"
          aria-labelledby="profile-heading"
        >
          {/* Header row: on small screens it stacks, on md+ it's a single row with buttons on right */}
          <div className="col-span-1 md:col-span-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-3 text-sm">
                <FaEnvelope className="text-yellow-400" />
                <span className="font-medium truncate max-w-[220px]">
                  {student.email}
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <FaPhoneAlt className="text-yellow-400" />
                <span className="font-medium">
                  {student.phone || "Not set"}
                </span>
              </div>
            </div>

            {/* Buttons: stack on xs, inline on sm+ */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mt-2 sm:mt-0">
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center justify-center gap-2 bg-yellow-400 text-slate-900 px-4 py-2 rounded-lg font-semibold hover:scale-[1.02] transition-transform shadow w-full sm:w-auto"
                aria-label="Edit profile"
              >
                <FaEdit /> <span className="hidden sm:inline">Edit</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText(student.email);
                  alert("Email copied to clipboard");
                }}
                className="mt-2 sm:mt-0 inline-flex items-center justify-center gap-2 border border-white/10 px-4 py-2 rounded-lg text-sm text-slate-200 hover:bg-white/5 w-full sm:w-auto"
                aria-label="Copy email"
              >
                Copy Email
              </button>
            </div>
          </div>

          {/* Avatar */}
          <div className="col-span-1 flex flex-col items-center gap-4">
            <div className="relative">
              <div className="h-28 w-28 sm:h-36 sm:w-36 md:h-40 md:w-40 rounded-full bg-linear-to-tr from-yellow-400 to-orange-300 p-1 overflow-hidden shadow-inner">
                {student.avatar || student.image ? (
                  <img
                    src={student.avatar || student.image}
                    alt={`${student.name} avatar`}
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <div className="h-full w-full rounded-full bg-slate-800 flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-200">
                    {student.name?.split(" ")[0]?.[0] || "S"}
                  </div>
                )}
              </div>

              <span
                className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-slate-900 ${
                  student.approved ? "bg-green-400" : "bg-yellow-400"
                }`}
                title={
                  student.approved ? "Approved student" : "Pending approval"
                }
                aria-hidden
              />
            </div>

            <div className="text-center">
              <h2
                id="profile-heading"
                className="text-lg sm:text-2xl font-semibold truncate max-w-[170px]"
              >
                {student.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {student.department || "Department not set"}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="col-span-2 p-1 sm:p-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <StatPill
                label="Status"
                value={student.approved ? "Approved" : "Pending"}
              />
              <StatPill label="Department" value={student.department || "—"} />
              <StatPill
                label="Joined"
                value={
                  student.createdAt
                    ? new Date(student.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "—"
                }
              />
            </div>

            <div className="mt-3 text-slate-300 text-sm">
              <p>
                Click Edit to update name, phone, or upload an image. Local
                preview shows instantly.
              </p>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <div className="font-medium text-slate-200">Roll</div>
                <div className="mt-1 font-mono">{student.roll || "—"}</div>
              </div>

              <div>
                <div className="font-medium text-slate-200">Email</div>
                <div className="mt-1 truncate max-w-[320px]">
                  {student.email}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Slide-over edit panel */}
        {editing && (
          <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setEditing(false)}
            />

            <motion.aside
              ref={panelRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 h-full w-full sm:w-[560px] bg-white/6 backdrop-blur-lg border-l border-white/10 p-4 sm:p-6 flex flex-col"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-semibold">
                  Edit profile
                </h3>
                <button
                  onClick={() => setEditing(false)}
                  aria-label="Close"
                  className="text-slate-300 hover:text-white"
                >
                  <FaTimes />
                </button>
              </div>

              <form
                onSubmit={handleUpdate}
                className="mt-4 flex-1 flex flex-col"
                aria-label="Edit profile form"
              >
                <label className="text-sm text-slate-300">Profile image</label>
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center">
                    {localImagePreview ? (
                      <img
                        src={localImagePreview}
                        alt="preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-slate-200 font-semibold">
                        {student.name?.split(" ")[0]?.[0] || "S"}
                      </div>
                    )}
                  </div>

                  <label
                    className="inline-flex items-center gap-2 px-3 py-2 bg-white/8 rounded-md cursor-pointer text-sm"
                    aria-hidden
                  >
                    <FaCamera />
                    <span>Choose image</span>
                    <input
                      onChange={handleImageSelect}
                      accept="image/*"
                      type="file"
                      className="sr-only"
                      aria-label="Choose profile image"
                    />
                  </label>

                  <div className="text-xs text-slate-300">
                    {uploadingImage
                      ? "Uploading..."
                      : `PNG/JPG up to ${MAX_IMAGE_MB}MB`}
                  </div>
                </div>

                <label className="text-sm text-slate-300 mt-4">Full name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-2 p-3 rounded-lg bg-white/8 text-slate-50 focus:ring-2 focus:ring-yellow-400 outline-none"
                />

                <label className="text-sm text-slate-300 mt-4">Phone</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-2 p-3 rounded-lg bg-white/8 text-slate-50"
                />

                <label className="text-sm text-slate-300 mt-4">
                  Confirm password
                </label>
                <div className="relative mt-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg bg-white/8 text-slate-50 pr-12"
                    placeholder="Enter current password to confirm changes"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    type="submit"
                    disabled={loading || uploadingImage}
                    className={`inline-flex items-center gap-2 bg-yellow-400 text-slate-900 px-4 py-2 rounded-md font-semibold shadow w-full sm:w-auto justify-center
                    ${
                      loading || uploadingImage
                        ? "opacity-60 cursor-not-allowed"
                        : "hover:scale-[1.02] transition-transform"
                    }`}
                    aria-disabled={loading || uploadingImage}
                    title={
                      uploadingImage ? "Please wait — image is uploading" : ""
                    }
                  >
                    {uploadingImage
                      ? "Uploading image..."
                      : loading
                      ? "Saving..."
                      : "Save changes"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        name: student.name || "",
                        phone: student.phone || "",
                        password: "",
                        avatar: student.avatar || student.image || "",
                      });
                      setLocalImagePreview(
                        student.avatar || student.image || null
                      );
                    }}
                    className="text-sm text-slate-300 hover:underline w-full sm:w-auto"
                  >
                    Reset
                  </button>

                  <div className="ml-auto text-xs text-slate-400 text-right hidden sm:block">
                    {IMGBB_KEY
                      ? "Uploads use imgbb client-side."
                      : "No IMGBB key set — uploader will only show local preview."}
                  </div>
                </div>

                <div className="mt-4 text-xs text-slate-400">
                  Tip: Square images work best. I can switch to server-side or
                  other hosts if you want.
                </div>
              </form>
            </motion.aside>
          </div>
        )}
      </main>
    </div>
  );
}
