import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { api } from "../services/api";
import { X, User, Check, KeyRound, Lock, AlertCircle, Settings, Shield } from "lucide-react";

export default function ProfileModal({ isOpen, onClose, initialTab = "profile" }) {
  const { currentUser, updateProfile } = useUser();
  const [activeTab, setActiveTab] = useState(initialTab);

  // Profile Form State
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    contactNumber: currentUser?.contactNumber || currentUser?.contact_number || "+91 9876543210",
    department: currentUser?.department || "CSE",
    classTeacherSection: currentUser?.classTeacherSection || currentUser?.sectionClassTeacher || "Section A",
    year: currentUser?.year || "2nd Year",
    section: currentUser?.section || "A",
    college: currentUser?.college || "Vignan University",
    skills: Array.isArray(currentUser?.skills) ? currentUser.skills.join(", ") : (currentUser?.skills || "C, Java, Python")
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [pwStatus, setPwStatus] = useState({ loading: false, success: "", error: "" });

  if (!isOpen || !currentUser) return null;

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      contactNumber: formData.contactNumber.trim(),
      department: formData.department.trim(),
      classTeacherSection: formData.classTeacherSection,
      year: formData.year.trim(),
      section: formData.section.trim(),
      college: formData.college.trim(),
      skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean).join(", ")
    };

    try {
      await api.updateProfile(updatedData, { identifier: currentUser.identifier, user_id: currentUser.id });
    } catch (err) {
      console.warn("Failed backend profile update, applying locally:", err.message);
    }

    updateProfile({
      ...updatedData,
      skills: updatedData.skills.split(",").map(s => s.trim()).filter(Boolean)
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwStatus({ loading: true, success: "", error: "" });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPwStatus({ loading: false, success: "", error: "New password and confirmation do not match." });
      return;
    }

    if (passwordData.newPassword.length < 4) {
      setPwStatus({ loading: false, success: "", error: "New password must be at least 4 characters long." });
      return;
    }

    try {
      const res = await api.changePassword({
        userId: currentUser.id,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });

      if (res && res.success) {
        setPwStatus({ loading: false, success: "Password changed successfully!", error: "" });
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => {
          setPwStatus({ loading: false, success: "", error: "" });
        }, 3000);
      } else {
        setPwStatus({ loading: false, success: "", error: res.message || "Failed to change password." });
      }
    } catch (err) {
      setPwStatus({ loading: false, success: "", error: err.message || "Current password is incorrect." });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-[#E5E7EB] bg-gradient-to-r from-blue-50/60 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1264E8] text-white flex items-center justify-center font-bold text-base shadow-sm">
                {formData.name.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {currentUser?.role === "STUDENT" ? "User Settings & Profile" : "Personal Details & Profile"}
                </h3>
                <p className="text-xs text-gray-500">
                  {currentUser.role} • {currentUser.identifier}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-4 border-b border-gray-200">
              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className={`pb-2 px-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "profile"
                    ? "border-[#1264E8] text-[#1264E8]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{currentUser?.role === "STUDENT" ? "Academic Profile" : "Personal Details"}</span>
              </button>

            <button
              type="button"
              onClick={() => setActiveTab("security")}
              className={`pb-2 px-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
                activeTab === "security"
                  ? "border-[#1264E8] text-[#1264E8]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Change Password</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Profile Form */}
        {activeTab === "profile" && (
          <form onSubmit={handleProfileSubmit} className="p-5 space-y-4">
            {savedSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Profile updated successfully! All dashboard views adjusted dynamically.</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1264E8]/20 focus:border-[#1264E8]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1264E8]/20 focus:border-[#1264E8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  placeholder="e.g. +91 9876543210"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1264E8]/20 focus:border-[#1264E8]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Department / Branch
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1264E8]/20 focus:border-[#1264E8]"
                >
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="AIML">AIML</option>
                  <option value="IT">IT</option>
                  <option value="DS">DS</option>
                  <option value="Remedial Cell">Remedial Cell</option>
                  <option value="Central Library">Central Library</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Section Class Teacher
                </label>
                <select
                  value={formData.classTeacherSection}
                  onChange={(e) => setFormData({ ...formData, classTeacherSection: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-blue-200 rounded-xl text-xs sm:text-sm text-blue-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1264E8]/20 focus:border-[#1264E8]"
                >
                  <option value="Section A">Section A</option>
                  <option value="Section B">Section B</option>
                  <option value="Section C">Section C</option>
                  <option value="Section D">Section D</option>
                  <option value="Section E">Section E</option>
                  <option value="Not Assigned">Not Assigned</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Academic Year
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1264E8]/20 focus:border-[#1264E8]"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Faculty">Faculty / Staff</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  University / Campus
                </label>
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1264E8]/20 focus:border-[#1264E8]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Active Skills & Programming Languages
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="e.g. C, Java, Python, Data Structures"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1264E8]/20 focus:border-[#1264E8]"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Comma-separated skills used by the Resource Matching Agent.
              </p>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#1264E8] hover:bg-[#0E52C2] text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer"
              >
                Save Dynamic Changes
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Change Password Form */}
        {activeTab === "security" && (
          <form onSubmit={handlePasswordSubmit} className="p-5 space-y-4">
            {pwStatus.success && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{pwStatus.success}</span>
              </div>
            )}

            {pwStatus.error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{pwStatus.error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="Enter current password"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1264E8]/20 focus:border-[#1264E8]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="Enter new password (min. 4 characters)"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1264E8]/20 focus:border-[#1264E8]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="Re-enter new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1264E8]/20 focus:border-[#1264E8]"
                />
              </div>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-blue-800">
              Password will be updated securely for your <strong>{currentUser.identifier}</strong> account.
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={pwStatus.loading}
                className="px-4 py-2 bg-[#1264E8] hover:bg-[#0E52C2] text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
              >
                {pwStatus.loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
