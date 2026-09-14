import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { api } from "../services/api";
import {
  ShieldCheck,
  UserPlus,
  Users,
  Briefcase,
  Target,
  BookOpen,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
  Sparkles,
  Plus
} from "lucide-react";

export default function SuperAdminPortal() {
  const { currentUser } = useUser();

  if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
    return (
      <div className="p-8 text-center bg-red-50 border border-red-200 rounded-2xl text-red-700">
        <h2 className="text-lg font-bold">Access Denied</h2>
        <p className="text-sm mt-1">You do not have Super Admin privileges to view this portal.</p>
      </div>
    );
  }
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRoleTab, setActiveRoleTab] = useState("FACULTY"); // FACULTY, REMEDIAL_COORDINATOR, LIBRARY
  const [search, setSearch] = useState("");

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalRole, setModalRole] = useState("FACULTY"); // FACULTY, REMEDIAL_COORDINATOR, LIBRARY
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("+91 9876543210");
  const [department, setDepartment] = useState("CSE");
  const [classTeacherSection, setClassTeacherSection] = useState("Section A");

  // Feedback State
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit User Personal Details Modal State
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editContactNumber, setEditContactNumber] = useState("");
  const [editDepartment, setEditDepartment] = useState("CSE");
  const [editClassTeacherSection, setEditClassTeacherSection] = useState("Section A");

  const departmentsList = [
    "CSE",
    "ECE",
    "EEE",
    "MECH",
    "CIVIL",
    "IT",
    "AI & DS",
    "Remedial Cell",
    "Central Library",
    "Basic Sciences"
  ];

  const sectionsList = [
    "Section A",
    "Section B",
    "Section C",
    "Section D",
    "Section E",
    "Not Assigned"
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await api.adminGetUsers();
      if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch (err) {
      console.warn("Failed to load admin users:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = (role) => {
    setModalRole(role);
    setName("");
    setIdentifier("");
    setEmail("");
    setPassword("");
    setContactNumber("+91 9876543210");
    setDepartment(role === "REMEDIAL_COORDINATOR" ? "Remedial Cell" : role === "LIBRARY" ? "Central Library" : "CSE");
    setClassTeacherSection(role === "LIBRARY" ? "Not Assigned" : "Section A");
    setErrorMsg("");
    setSuccessMsg("");
    setIsAddModalOpen(true);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!name.trim() || !identifier.trim() || !email.trim() || !password.trim()) {
      setErrorMsg("All mandatory fields are required. Please complete the form.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        role: modalRole,
        identifier: identifier.trim(),
        email: email.trim(),
        password: password.trim(),
        contactNumber: contactNumber.trim() || "+91 9876543210",
        department: department.trim() || "CSE",
        classTeacherSection: classTeacherSection || "Section A"
      };

      const res = await api.adminCreateUser(payload);
      setSuccessMsg(res.message || `Created ${modalRole} account successfully.`);
      setIsAddModalOpen(false);
      loadUsers();
    } catch (err) {
      setErrorMsg(err.message || "Failed to create account. Check duplicate identifier or email.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete the account for ${userName}?`)) return;
    try {
      await api.adminDeleteUser(userId);
      setSuccessMsg(`Account for ${userName} deleted successfully.`);
      loadUsers();
    } catch (err) {
      alert("Failed to delete user: " + err.message);
    }
  };

  const handleOpenEditModal = (u) => {
    setEditingUser(u);
    setEditName(u.name || "");
    setEditEmail(u.email || "");
    setEditContactNumber(u.contactNumber || u.contact_number || "+91 9876543210");
    setEditDepartment(u.department || (u.role === "REMEDIAL_COORDINATOR" ? "Remedial Cell" : u.role === "LIBRARY" ? "Central Library" : "CSE"));
    setEditClassTeacherSection(u.classTeacherSection || u.sectionClassTeacher || "Section A");
  };

  const handleUpdateUserDetails = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      const payload = {
        name: editName.trim(),
        email: editEmail.trim(),
        contactNumber: editContactNumber.trim(),
        department: editDepartment.trim(),
        classTeacherSection: editClassTeacherSection
      };
      await api.adminUpdateUser(editingUser.id, payload);
      setSuccessMsg(`Personal details for ${editName} updated successfully.`);
      setEditingUser(null);
      loadUsers();
    } catch (err) {
      alert("Failed to update user details: " + err.message);
    }
  };

  const facultyUsers = users.filter((u) => u.role === "FACULTY");
  const coordinatorUsers = users.filter((u) => u.role === "REMEDIAL_COORDINATOR");
  const libraryUsers = users.filter((u) => u.role === "LIBRARY");

  const displayedUsers = (
    activeRoleTab === "FACULTY"
      ? facultyUsers
      : activeRoleTab === "REMEDIAL_COORDINATOR"
      ? coordinatorUsers
      : libraryUsers
  ).filter((u) => {
    const q = search.toLowerCase();
    return (
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.identifier.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.department && u.department.toLowerCase().includes(q)) ||
      (u.contactNumber && u.contactNumber.toLowerCase().includes(q)) ||
      (u.classTeacherSection && u.classTeacherSection.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded uppercase tracking-wider">
              SUPER ADMIN PORTAL
            </span>
            <span className="text-[11px] font-semibold text-gray-500">
              Role Allocation &amp; Access Control
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mt-1">
            Welcome, {currentUser?.name || "Super Admin"}
          </h2>
          <p className="text-xs text-gray-500">
            Create and manage accounts for Faculty, Remedial Coordinators, and Library staff.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Strict Role Access Active</span>
          </span>
        </div>
      </div>

      {/* Global Alerts */}
      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg("")} className="text-emerald-600 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Section Header: Users */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">Users Management</h3>
            <p className="text-xs text-gray-500">
              Manage personal details for Faculty, Remedial Coordinators, and Library staff.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleOpenAddModal("FACULTY")}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-[#1264E8] hover:bg-[#0E52C2] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Faculty</span>
            </button>
            <button
              onClick={() => handleOpenAddModal("REMEDIAL_COORDINATOR")}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Remedial Coordinator</span>
            </button>
            <button
              onClick={() => handleOpenAddModal("LIBRARY")}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Library</span>
            </button>
          </div>
        </div>

        {/* Role Tabs */}
        <div className="flex items-center justify-between gap-2 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveRoleTab("FACULTY")}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeRoleTab === "FACULTY"
                  ? "border-[#1264E8] text-[#1264E8]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Faculty ({facultyUsers.length})</span>
            </button>
            <button
              onClick={() => setActiveRoleTab("REMEDIAL_COORDINATOR")}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeRoleTab === "REMEDIAL_COORDINATOR"
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Remedial Coordinators ({coordinatorUsers.length})</span>
            </button>
            <button
              onClick={() => setActiveRoleTab("LIBRARY")}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeRoleTab === "LIBRARY"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Library ({libraryUsers.length})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-48 sm:w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, department..."
              className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* User Table with Personal Details */}
        {loading ? (
          <div className="py-12 text-center text-xs text-gray-400">Loading accounts...</div>
        ) : displayedUsers.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-500 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
            No {activeRoleTab.replace("_", " ").toLowerCase()} accounts found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold text-[10px] border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Username / ID</th>
                  <th className="px-4 py-3">Email ID</th>
                  <th className="px-4 py-3">Contact Number</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Section Class Teacher</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                {displayedUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-900">{u.name}</td>
                    <td className="px-4 py-3 font-mono text-blue-700 bg-blue-50/50 px-2 py-0.5 rounded w-max">
                      {u.identifier}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3 text-gray-700 font-mono">{u.contactNumber || u.contact_number || "+91 9876543210"}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-800 border border-gray-200">
                        {u.department || "CSE"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                        {u.classTeacherSection || u.sectionClassTeacher || "Section A"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === "FACULTY"
                          ? "bg-blue-100 text-blue-800"
                          : u.role === "REMEDIAL_COORDINATOR"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-purple-100 text-purple-800"
                      }`}>
                        {u.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(u)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Personal Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE USER MODAL WITH PERSONAL DETAILS */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#1264E8]" />
                <span>
                  Add {modalRole === "FACULTY" ? "Faculty" : modalRole === "REMEDIAL_COORDINATOR" ? "Remedial Coordinator" : "Library Staff"} Account
                </span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="mt-3 p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={modalRole === "LIBRARY" ? "e.g. VIGNAN's NTR LIBRARY" : "e.g. SAI ESWARI"}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Username / Identifier *
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    modalRole === "FACULTY"
                      ? "e.g. sai.eswari"
                      : modalRole === "REMEDIAL_COORDINATOR"
                      ? "e.g. bhargavi"
                      : "e.g. library"
                  }
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. user@vignan.ac.in"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Contact Number *
                </label>
                <input
                  type="text"
                  required
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Department *
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {departmentsList.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Section Class Teacher *
                  </label>
                  <select
                    value={classTeacherSection}
                    onChange={(e) => setClassTeacherSection(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {sectionsList.map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter login password"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#1264E8] hover:bg-[#0E52C2] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-60"
                >
                  {submitting ? "Creating..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER PERSONAL DETAILS MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#1264E8]" />
                <span>Edit Personal Details ({editingUser.role.replace("_", " ")})</span>
              </h3>
              <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateUserDetails} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  required
                  value={editContactNumber}
                  onChange={(e) => setEditContactNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    value={editDepartment}
                    onChange={(e) => setEditDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {departmentsList.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Section Class Teacher
                  </label>
                  <select
                    value={editClassTeacherSection}
                    onChange={(e) => setEditClassTeacherSection(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {sectionsList.map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-3.5 py-1.5 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#1264E8] hover:bg-[#0E52C2] text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Save Personal Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
