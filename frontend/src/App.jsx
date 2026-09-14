import React, { useState } from "react";
import { useUser } from "./context/UserContext";

// Global Layout Components
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import AssistantDrawer from "./components/AssistantDrawer";
import ProfileModal from "./components/ProfileModal";

// Pages
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import DiagnosticQuiz from "./pages/DiagnosticQuiz";
import TopicGapMap from "./pages/TopicGapMap";
import SmartLearningPath from "./pages/SmartLearningPath";
import PracticeMode from "./pages/PracticeMode";
import BeforeAfterVisualizer from "./pages/BeforeAfterVisualizer";
import VerifiedResources from "./pages/VerifiedResources";
import AgentWorkflowPage from "./pages/AgentWorkflowPage";
import StudentExams from "./pages/StudentExams";
import StudentLibrary from "./pages/StudentLibrary";
import StudentDoubtSession from "./pages/StudentDoubtSession";
import AIAssistantPage from "./pages/AIAssistantPage";


// Faculty & Remedial & Library & Super Admin Pages
import SuperAdminPortal from "./pages/SuperAdminPortal";
import FacultyDashboard from "./pages/FacultyDashboard";
import CreateExam from "./pages/CreateExam";
import ManageExams from "./pages/ManageExams";
import FacultyResults from "./pages/FacultyResults";
import ManageResources from "./pages/ManageResources";
import RemedialDashboard from "./pages/RemedialDashboard";
import LibraryDashboard from "./pages/LibraryDashboard";

export default function App() {
  const { currentUser, activeTab } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileModalTab, setProfileModalTab] = useState("profile");

  const handleOpenProfileModal = (tab = "profile") => {
    setProfileModalTab(tab);
    setProfileModalOpen(true);
  };

  // 1. If not authenticated, show modern multi-role Login / Signup Screen
  if (!currentUser) {
    return <Login />;
  }

  // 2. Active Tab Router
  const renderActiveContent = () => {
    switch (activeTab) {
      // Dashboard router based on Role
      case "dashboard":
        return currentUser.role === "SUPER_ADMIN"
          ? <SuperAdminPortal />
          : currentUser.role === "FACULTY"
          ? <FacultyDashboard />
          : currentUser.role === "REMEDIAL_COORDINATOR"
          ? <RemedialDashboard />
          : currentUser.role === "LIBRARY"
          ? <LibraryDashboard />
          : <StudentDashboard />;

      case "superadmin-portal":
        return currentUser?.role === "SUPER_ADMIN" ? <SuperAdminPortal /> : <StudentDashboard />;
      case "diagnostic":
        return <DiagnosticQuiz />;
      case "gap-map":
      case "topic-gap-map":
        return <TopicGapMap />;
      case "learning-path":
      case "smart-learning-path":
        return <SmartLearningPath />;
      case "practice":
        return <PracticeMode />;
      case "before-after":
        return <BeforeAfterVisualizer />;
      case "verified-resources":
        return <VerifiedResources />;
      case "student-library":
        return <StudentLibrary />;
      case "student-exams":
        return <StudentExams />;
      case "doubt-session":
      case "student-doubts":
        return <StudentDoubtSession />;
      case "ai-assistant":
      case "academic-assistant":
        return <AIAssistantPage />;

      case "agent-workflow":
        return <AgentWorkflowPage />;

      // Faculty Routes
      case "faculty-dashboard":
        return <FacultyDashboard />;
      case "create-exam":
        return <CreateExam />;
      case "manage-exams":
        return <ManageExams />;
      case "faculty-results":
        return <FacultyResults />;
      case "manage-resources":
        return <ManageResources />;
      case "faculty-insights":
        return <FacultyDashboard />;

      // Remedial Routes
      case "remedial-dashboard":
      case "remedial-students":
        return <RemedialDashboard />;
      case "remedial-gaps":
        return <TopicGapMap />;
      case "remedial-assessments":
        return <FacultyResults />;
      case "remedial-resources":
        return <VerifiedResources />;
      case "remedial-progress":
        return <BeforeAfterVisualizer />;

      // Library Routes
      case "library-dashboard":
      case "library-inventory":
        return <LibraryDashboard />;

      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#111827] flex">
      {/* Fixed Left Sidebar (250px) */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area (Offset by 250px on desktop) */}
      <div className="flex-1 md:ml-[250px] flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Header */}
        <Header
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          onOpenProfileModal={handleOpenProfileModal}
        />

        {/* Main Content Page Container */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {renderActiveContent()}
        </main>
      </div>

      {/* Global Interactive Slide-Over AI Assistant */}
      <AssistantDrawer />

      {/* Dynamic Profile & Academic Details Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        initialTab={profileModalTab}
        onClose={() => setProfileModalOpen(false)}
      />
    </div>
  );
}
