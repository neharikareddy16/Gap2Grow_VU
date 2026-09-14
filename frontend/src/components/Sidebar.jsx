import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { api } from "../services/api";
import {
  LayoutDashboard,
  ClipboardCheck,
  Map,
  Route,
  Dumbbell,
  GitCompare,
  ShieldCheck,
  Bot,
  BookOpen,
  LogOut,
  ChevronDown,
  User,
  PlusCircle,
  FolderKanban,
  FileCheck,
  BarChart3,
  Users,
  Target,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Library,
  BookMarked,
  HelpCircle,
  Bell,
  X
} from "lucide-react";

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { currentUser, activeTab, setActiveTab, logout, setIsAssistantOpen } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [hasSeenNotifications, setHasSeenNotifications] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.role === "STUDENT") {
      fetchNotifications();
    }
  }, [currentUser]);

  const fetchNotifications = async () => {
    if (!currentUser || !currentUser.identifier) return;
    try {
      const list = await api.getStudentNotifications(currentUser.identifier);
      if (Array.isArray(list)) {
        setNotifications(list);
      }
    } catch (err) {
      console.warn("Could not load notifications:", err.message);
    }
  };

  const handleOpenNotifications = () => {
    setNotifModalOpen(true);
    setHasSeenNotifications(true);
    fetchNotifications();
    setMobileOpen?.(false);
  };

  if (!currentUser) return null;

  const role = currentUser.role;

  // Dynamically formatted subtitle badge
  const getUserBadge = () => {
    if (role === "SUPER_ADMIN") {
      return "Super Admin - Governance";
    } else if (role === "STUDENT") {
      return `Student - ${currentUser.department || "CSE"} ${currentUser.year || "2nd Year"}`;
    } else if (role === "FACULTY") {
      return `Faculty - ${currentUser.department || "CSE"}`;
    } else if (role === "REMEDIAL_COORDINATOR") {
      return `Coordinator - ${currentUser.department || "Remedial Cell"}`;
    } else if (role === "LIBRARY") {
      return `Library Staff - ${currentUser.department || "Central Library"}`;
    }
    return currentUser.department || "Campus Agent";
  };

  const renderStudentNav = () => (
    <>
      <div className="px-3 mb-2 mt-4 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
        Diagnostic & Learning
      </div>
      <nav className="space-y-1">
        <button
          onClick={() => { setActiveTab("dashboard"); setMobileOpen?.(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all text-left ${
            activeTab === "dashboard"
              ? "bg-[#1264E8] text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
          <span>Dashboard</span>
        </button>



        <button
          onClick={() => { setActiveTab("diagnostic"); setMobileOpen?.(false); }}
          className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all text-left ${
            activeTab === "diagnostic"
              ? "bg-[#1264E8] text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <div className="flex items-center gap-3">
            <ClipboardCheck className="w-4 h-4 flex-shrink-0" />
            <span>Diagnostic Test</span>
          </div>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
            activeTab === "diagnostic" ? "bg-blue-700 text-white" : "bg-blue-100 text-blue-700"
          }`}>
            Pre-Test
          </span>
        </button>

        <button
          onClick={() => { setActiveTab("gap-map"); setMobileOpen?.(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all text-left ${
            activeTab === "gap-map"
              ? "bg-[#1264E8] text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Map className="w-4 h-4 flex-shrink-0" />
          <span>Topic Gap Map</span>
        </button>

        <button
          onClick={() => { setActiveTab("learning-path"); setMobileOpen?.(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all text-left ${
            activeTab === "learning-path"
              ? "bg-[#1264E8] text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Route className="w-4 h-4 flex-shrink-0" />
          <span>Smart Learning Path</span>
        </button>

        <button
          onClick={() => { setActiveTab("practice"); setMobileOpen?.(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all text-left ${
            activeTab === "practice"
              ? "bg-[#1264E8] text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Dumbbell className="w-4 h-4 flex-shrink-0" />
          <span>Practice Mode</span>
        </button>

        <button
          onClick={() => { setActiveTab("before-after"); setMobileOpen?.(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all text-left ${
            activeTab === "before-after"
              ? "bg-[#1264E8] text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <GitCompare className="w-4 h-4 flex-shrink-0" />
          <span>Before vs After</span>
        </button>



        {/* Library Addition in Student Sidebar */}
        <button
          onClick={() => { setActiveTab("student-library"); setMobileOpen?.(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all text-left ${
            activeTab === "student-library"
              ? "bg-[#1264E8] text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Library className="w-4 h-4 flex-shrink-0 text-blue-600" />
          <span>📚 Library</span>
        </button>

        <button
          onClick={() => { setActiveTab("student-exams"); setMobileOpen?.(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all text-left ${
            activeTab === "student-exams"
              ? "bg-[#1264E8] text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <FileCheck className="w-4 h-4 flex-shrink-0" />
          <span>Available Exams</span>
        </button>

        <button
          onClick={() => { setActiveTab("ai-assistant"); setMobileOpen?.(false); }}
          className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold rounded-lg transition-all text-left ${
            activeTab === "ai-assistant"
              ? "bg-[#1264E8] text-white shadow-sm"
              : "text-blue-700 bg-blue-50/70 hover:bg-blue-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <Bot className="w-4 h-4 flex-shrink-0 text-[#1264E8]" />
            <span>AI Chat Assistant</span>
          </div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white">
            AI Core
          </span>
        </button>

        <button
          onClick={() => { setActiveTab("doubt-session"); setMobileOpen?.(false); }}
          className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all text-left ${
            activeTab === "doubt-session"
              ? "bg-[#1264E8] text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >

          <div className="flex items-center gap-3">
            <HelpCircle className="w-4 h-4 flex-shrink-0 text-amber-500" />
            <span>Doubt Session</span>
          </div>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
            activeTab === "doubt-session" ? "bg-amber-600 text-white" : "bg-amber-100 text-amber-800"
          }`}>
            Faculty Q&A
          </span>
        </button>
      </nav>

      <div className="px-3 mb-2 mt-6 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
        Agentic Orchestration
      </div>
      <nav className="space-y-1">
        <button
          onClick={() => setIsAssistantOpen(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all text-left"
        >
          <Bot className="w-4 h-4 flex-shrink-0 text-[#1264E8]" />
          <span>Ask Assistant</span>
        </button>

        <button
          onClick={() => { setActiveTab("agent-workflow"); setMobileOpen?.(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all text-left ${
            activeTab === "agent-workflow"
              ? "bg-[#1264E8] text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Sparkles className="w-4 h-4 flex-shrink-0" />
          <span>AI Agent Workflow</span>
        </button>

        {/* Notifications Item at End of Left Navigation Bar */}
        <button
          onClick={handleOpenNotifications}
          className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all text-left mt-1 ${
            notifModalOpen
              ? "bg-[#1264E8] text-white shadow-sm font-bold"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <div className="flex items-center gap-3">
            <Bell className={`w-4 h-4 flex-shrink-0 ${!hasSeenNotifications && notifications.length > 0 ? "text-amber-500 animate-bounce" : "text-gray-500"}`} />
            <span>Notifications</span>
          </div>
          {notifications.length > 0 ? (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${
                !hasSeenNotifications
                  ? "bg-rose-500 text-white animate-pulse"
                  : "bg-gray-100 text-gray-600 border border-gray-200"
              }`}
            >
              {notifications.length}
            </span>
          ) : (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
              0
            </span>
          )}
        </button>
      </nav>
    </>
  );

  const renderFacultyNav = () => (
    <>
      <div className="px-3 mb-2 mt-4 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
        📝 Assessments
      </div>
      <nav className="space-y-1">
        <button
          onClick={() => { setActiveTab("faculty-dashboard"); setMobileOpen?.(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all text-left ${
            activeTab === "faculty-dashboard"
              ? "bg-[#1264E8] text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => { setActiveTab("create-exam"); setMobileOpen?.(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all text-left ${
            activeTab === "create-exam"
              ? "bg-[#1264E8] text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <PlusCircle className="w-4 h-4 flex-shrink-0 text-green-600" />
          <span>Create Exam</span>
        </button>

        <button
          onClick={() => { setActiveTab("manage-exams"); setMobileOpen?.(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all text-left ${
            activeTab === "manage-exams"
              ? "bg-[#1264E8] text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <FolderKanban className="w-4 h-4 flex-shrink-0" />
          <span>Manage Exams</span>
        </button>

        <button
          onClick={() => { setActiveTab("faculty-results"); setMobileOpen?.(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all text-left ${
            activeTab === "faculty-results"
              ? "bg-[#1264E8] text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <BarChart3 className="w-4 h-4 flex-shrink-0" />
          <span>Exam Results</span>
        </button>
      </nav>

      <div className="px-3 mb-2 mt-6 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
        📚 Resources
      </div>
      <nav className="space-y-1">
        <button
          onClick={() => { setActiveTab("manage-resources"); setMobileOpen?.(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all text-left ${
            activeTab === "manage-resources"
              ? "bg-[#1264E8] text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <BookOpen className="w-4 h-4 flex-shrink-0" />
          <span>Manage Resources</span>
        </button>
      </nav>
    </>
  );

  const renderRemedialNav = () => (
    <>
      <div className="px-3 mb-2 mt-4 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
        🎯 Remedial Coordination
      </div>
      <nav className="space-y-1">
        <button
          onClick={() => { setActiveTab("remedial-dashboard"); setMobileOpen?.(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all text-left ${
            activeTab === "remedial-dashboard"
              ? "bg-[#1264E8] text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => { setActiveTab("remedial-assessments"); setMobileOpen?.(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all text-left ${
            activeTab === "remedial-assessments"
              ? "bg-[#1264E8] text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 flex-shrink-0" />
          <span>Assessments</span>
        </button>

        <button
          onClick={() => { setActiveTab("remedial-resources"); setMobileOpen?.(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all text-left ${
            activeTab === "remedial-resources"
              ? "bg-[#1264E8] text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <BookOpen className="w-4 h-4 flex-shrink-0" />
          <span>Teacher Resources</span>
        </button>

        <button
          onClick={() => { setActiveTab("remedial-progress"); setMobileOpen?.(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all text-left ${
            activeTab === "remedial-progress"
              ? "bg-[#1264E8] text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <BarChart3 className="w-4 h-4 flex-shrink-0" />
          <span>Remedial Progress</span>
        </button>
      </nav>
    </>
  );

  const renderLibraryNav = () => (
    <>
      <div className="px-3 mb-2 mt-4 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
        📖 Library Admin
      </div>
      <nav className="space-y-1">
        <button
          onClick={() => { setActiveTab("library-dashboard"); setMobileOpen?.(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all text-left ${
            activeTab === "library-dashboard"
              ? "bg-[#1264E8] text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => { setActiveTab("library-inventory"); setMobileOpen?.(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all text-left ${
            activeTab === "library-inventory"
              ? "bg-[#1264E8] text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <BookMarked className="w-4 h-4 flex-shrink-0" />
          <span>Book Inventory</span>
        </button>
      </nav>
    </>
  );

  const renderSuperAdminNav = () => (
    <>
      <div className="px-3 mb-2 mt-4 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
        🛡️ Governance & Access
      </div>
      <nav className="space-y-1">
        <button
          onClick={() => { setActiveTab("superadmin-portal"); setMobileOpen?.(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all text-left ${
            activeTab === "superadmin-portal" || activeTab === "dashboard"
              ? "bg-[#1264E8] text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
          <span>Super Admin Portal</span>
        </button>
      </nav>
    </>
  );

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 w-[250px] bg-white border-r border-[#E5E7EB] flex flex-col transition-transform duration-200 ease-in-out ${
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      {/* Top of sidebar: Vignan University Logo & Title */}
      <div className="p-4 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2.5">
          <img
            src="/logos/vignan-official.png"
            alt="Vignan's Foundation for Science, Technology & Research"
            className="h-10 w-auto max-w-[100px] object-contain flex-shrink-0"
          />
          <div className="overflow-hidden">
            <h1 className="text-xs font-black tracking-wider text-gray-900 uppercase truncate">
              VIGNAN UNIVERSITY
            </h1>
            <p className="text-[10px] font-medium text-gray-500 truncate">
              Autonomous AI Resource Portal
            </p>
          </div>
        </div>
      </div>

      {/* USER PROFILE SECTION - STRICTLY DYNAMIC */}
      <div className="p-3 border-b border-[#E5E7EB] bg-gray-50/70">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1264E8] flex items-center justify-center font-bold text-xs flex-shrink-0 border border-blue-200">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="truncate">
              <div className="text-xs font-semibold text-gray-900 truncate">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-gray-500 truncate">
                Autonomous learning agent
              </div>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        </div>

        {/* Dynamic student information format: Student - {dept} {year} */}
        <div className="mt-2 text-[11px] font-medium text-blue-700 bg-blue-50/80 px-2 py-1 rounded border border-blue-100 truncate">
          {getUserBadge()}
        </div>

        {/* Live session indicator */}
        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-600 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot" />
          <span>Live Session</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {role === "SUPER_ADMIN" && renderSuperAdminNav()}
        {role === "STUDENT" && renderStudentNav()}
        {role === "FACULTY" && renderFacultyNav()}
        {role === "REMEDIAL_COORDINATOR" && renderRemedialNav()}
        {role === "LIBRARY" && renderLibraryNav()}
      </div>

      {/* Bottom Footer: Sign Out & Status */}
      <div className="p-3 border-t border-[#E5E7EB] bg-gray-50/50">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>

        <div className="mt-2.5 flex items-center gap-2 px-2 text-[10px] text-gray-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
          <span className="truncate">Learning Resource Agent is active</span>
        </div>
      </div>

      {/* Notifications Modal */}
      {notifModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-5 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-600">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-gray-900 tracking-tight">Student Notifications</h3>
                  <p className="text-xs text-gray-500">Remedial support & faculty academic updates</p>
                </div>
              </div>
              <button
                onClick={() => setNotifModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto divide-y divide-gray-100 flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-700">No Notifications</p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    You have no new remedial alerts or faculty messages at this time.
                  </p>
                </div>
              ) : (
                notifications.map((item, idx) => (
                  <div key={item.id || idx} className="py-3.5 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                        <Target className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span>{item.title || "Remedial Support Message"}</span>
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">Just now</span>
                    </div>
                    <p className="text-xs text-gray-800 leading-relaxed bg-amber-50/90 p-3 rounded-xl border border-amber-200 font-medium mt-1">
                      "{item.message}"
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
                      <span>Sender: <strong className="text-gray-800">{item.senderName || item.sentByName || "Remedial Coordinator"}</strong></span>
                      {item.subject && (
                        <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 text-[10px]">
                          {item.subject}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setNotifModalOpen(false)}
                className="px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-xl hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
