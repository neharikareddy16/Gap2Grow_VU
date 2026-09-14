import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { api } from "../services/api";
import PptViewerModal from "../components/PptViewerModal";
import {
  Video,
  FileText,
  UploadCloud,
  MessageSquare,
  CheckCircle2,
  Clock,
  User,
  Users,
  ExternalLink,
  Plus,
  Send,
  Trash2,
  Eye,
  Download,
  AlertCircle,
  Sparkles,
  Radio,
  Calendar,
  Share2,
  BookOpen,
  HelpCircle,
  Copy,
  Check
} from "lucide-react";

export default function FacultyDashboard() {
  const { currentUser, updateProfile } = useUser();

  const handleSectionClassTeacherChange = async (newSection) => {
    try {
      await api.updateProfile({ classTeacherSection: newSection }, { identifier: currentUser?.identifier, user_id: currentUser?.id });
    } catch (err) {
      console.warn("Failed backend section update, updating locally:", err.message);
    }
    updateProfile({ classTeacherSection: newSection, sectionClassTeacher: newSection });
  };

  // Active view tab: 'live-sessions', 'upload-pdf', or 'student-doubts'
  const [activeOption, setActiveOption] = useState("live-sessions");
  const [selectedPptResource, setSelectedPptResource] = useState(null);


  // Data states
  const [liveSessions, setLiveSessions] = useState([]);
  const [facultyPdfs, setFacultyPdfs] = useState([]);
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);

  const assignedSub = currentUser?.assignedSubject || currentUser?.subject || "Database Management System";

  // Live Session Form State
  const [sessionTopic, setSessionTopic] = useState("");
  const [sessionSubject, setSessionSubject] = useState(assignedSub);
  const [sessionDuration, setSessionDuration] = useState("45");
  const [sessionTimeType, setSessionTimeType] = useState("now"); // 'now' or 'scheduled'
  const [scheduledDateTime, setScheduledDateTime] = useState("");
  const [customMeetLink, setCustomMeetLink] = useState("");
  const [creatingSession, setCreatingSession] = useState(false);
  const [copiedLink, setCopiedLink] = useState(null);

  // PDF & Learning Resource Upload Form State
  const [pdfTitle, setPdfTitle] = useState("");
  const [pdfSubject, setPdfSubject] = useState(assignedSub);
  const [pdfUnit, setPdfUnit] = useState("Unit 1");
  const [pdfDescription, setPdfDescription] = useState("");
  const [resourceType, setResourceType] = useState("PDF"); // PPT, PDF, DOCX, Notes
  const [selectedPdfFile, setSelectedPdfFile] = useState(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [pdfUploadSuccess, setPdfUploadSuccess] = useState("");

  useEffect(() => {
    if (currentUser?.assignedSubject || currentUser?.subject) {
      const sub = currentUser.assignedSubject || currentUser.subject;
      setSessionSubject(sub);
      setPdfSubject(sub);
    }
  }, [currentUser]);

  // Doubt Answering State: mapping of doubtId -> answer text being drafted
  const [draftAnswers, setDraftAnswers] = useState({});
  const [answeringDoubtId, setAnsweringDoubtId] = useState(null);
  const [doubtsFilter, setDoubtsFilter] = useState("pending"); // 'all', 'pending', 'answered'

  const subjects = [
    "Data Structures",
    "Database Management System",
    "Discrete Mathematics",
    "Object Oriented Programming Through Java",
    "Digital Logical Design",
    "Artificial Intelligence",
    "Data Wrangling And Visualization"
  ];

  const units = ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5", "Supplementary Notes"];

  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, 8000);
    return () => clearInterval(interval);
  }, []);

  const loadAllData = async () => {
    try {
      const [sessionsData, pdfsData, doubtsData] = await Promise.all([
        api.getLiveSessions(),
        api.getFacultyPdfs(),
        api.getDoubts()
      ]);
      setLiveSessions(sessionsData || []);
      setFacultyPdfs(pdfsData || []);
      setDoubts(doubtsData || []);
    } catch (err) {
      console.error("Error loading faculty portal data:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Live Session Handlers ---
  const handleStartLiveSession = async (e) => {
    e.preventDefault();
    if (!sessionTopic.trim()) return;

    setCreatingSession(true);
    try {
      const generatedLink = customMeetLink.trim()
        ? customMeetLink.trim()
        : `https://meet.google.com/gap-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;

      const payload = {
        facultyName: currentUser?.name || "Dr. Naveen Kumar",
        facultyId: currentUser?.identifier || "FAC701",
        subject: sessionSubject,
        topic: sessionTopic.trim(),
        scheduledTime: sessionTimeType === "now" ? "Live Now" : (scheduledDateTime || "Tomorrow at 10:00 AM"),
        durationMins: parseInt(sessionDuration, 10) || 45,
        meetingLink: generatedLink,
        status: sessionTimeType === "now" ? "Live" : "Scheduled"
      };

      const newSession = await api.createLiveSession(payload);
      setLiveSessions(prev => [newSession, ...prev]);
      setSessionTopic("");
      setCustomMeetLink("");
    } catch (err) {
      console.error("Failed to create live session:", err);
    } finally {
      setCreatingSession(false);
    }
  };

  const handleEndSession = async (sessionId) => {
    try {
      await api.endLiveSession(sessionId);
      setLiveSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: "Completed" } : s));
    } catch (err) {
      console.error("Failed to end session:", err);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  // --- Resource Upload Handlers ---
  const detectResourceType = (fileName) => {
    if (!fileName) return "PDF";
    const ext = fileName.toLowerCase().split('.').pop();
    if (ext === 'ppt' || ext === 'pptx') return 'PPT';
    if (ext === 'pdf') return 'PDF';
    if (ext === 'doc' || ext === 'docx') return 'DOCX';
    if (ext === 'txt' || ext === 'md' || ext === 'notes') return 'Notes';
    return 'PDF';
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedPdfFile(file);
      if (!pdfTitle) {
        setPdfTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
      setResourceType(detectResourceType(file.name));
    }
  };

  const handleUploadPdf = async (e) => {
    e.preventDefault();
    if (!pdfTitle.trim()) return;

    setUploadingPdf(true);
    try {
      let newPdf;
      if (selectedPdfFile) {
        const formData = new FormData();
        formData.append("file", selectedPdfFile);
        formData.append("facultyName", currentUser?.name || "Dr. Naveen Kumar");
        formData.append("subject", pdfSubject);
        formData.append("title", pdfTitle.trim());
        formData.append("unit", pdfUnit || "Unit 1");
        formData.append("description", pdfDescription.trim() || `Official faculty ${resourceType} for ${pdfSubject}`);
        formData.append("resourceType", resourceType || detectResourceType(selectedPdfFile.name));
        newPdf = await api.uploadFacultyPdf(formData);
      } else {
        const fileSize = "2.5 MB";
        const fileUrl = "https://raw.githubusercontent.com/kalya/sample/main/notes_sample.pdf";
        const payload = {
          facultyName: currentUser?.name || "Dr. Naveen Kumar",
          subject: pdfSubject,
          title: pdfTitle.trim(),
          unit: pdfUnit,
          description: pdfDescription.trim() || `Official faculty ${resourceType} for ${pdfSubject}`,
          fileName: `${pdfTitle.replace(/\s+/g, "_")}.${resourceType.toLowerCase()}`,
          fileUrl,
          fileSize,
          resourceType
        };
        newPdf = await api.uploadFacultyPdf(payload);
      }

      setFacultyPdfs(prev => [newPdf, ...prev]);
      setPdfTitle("");
      setPdfDescription("");
      setSelectedPdfFile(null);
      setPdfUploadSuccess(`Resource "${pdfTitle.trim()}" uploaded successfully for ${pdfSubject}!`);
      setTimeout(() => setPdfUploadSuccess(""), 4000);
    } catch (err) {
      console.error("Failed to upload resource:", err);
    } finally {
      setUploadingPdf(false);
    }
  };

  // --- Doubt Resolution Handlers ---
  const handleAnswerChange = (doubtId, text) => {
    setDraftAnswers(prev => ({ ...prev, [doubtId]: text }));
  };

  const handleSubmitAnswer = async (doubtId) => {
    const answer = draftAnswers[doubtId]?.trim();
    if (!answer) return;

    setAnsweringDoubtId(doubtId);
    try {
      const updated = await api.answerDoubt(doubtId, {
        answer,
        answeredBy: currentUser?.name || "Dr. Naveen Kumar"
      });

      setDoubts(prev => prev.map(d => d.id === doubtId ? updated : d));
      setDraftAnswers(prev => {
        const next = { ...prev };
        delete next[doubtId];
        return next;
      });
    } catch (err) {
      console.error("Failed to answer doubt:", err);
    } finally {
      setAnsweringDoubtId(null);
    }
  };

  const pendingDoubts = doubts.filter(d => d.status === "Pending");
  const answeredDoubts = doubts.filter(d => d.status === "Answered");
  const activeLiveSessions = liveSessions.filter(s => s.status === "Live");

  const filteredDoubts = doubts.filter(d => {
    if (doubtsFilter === "pending") return d.status === "Pending";
    if (doubtsFilter === "answered") return d.status === "Answered";
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Welcome Header */}
      <div className="bg-gradient-to-r from-[#1264E8] via-[#0E4CB5] to-[#1E3A8A] text-white p-6 sm:p-8 rounded-2xl shadow-lg border border-blue-400/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Vignan Faculty Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome, {currentUser?.name || "Dr. Naveen Kumar"}
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Conduct live classes on your subject, upload subject study materials & notes, and resolve student doubts directly.
            </p>

            {/* Personal Details & Section Class Teacher Selector */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15">
              <div className="flex items-center gap-1.5 text-blue-100 font-medium">
                <span className="text-white font-bold">Dept:</span> {currentUser?.department || "CSE"}
              </div>
              <div className="w-px h-3.5 bg-white/20"></div>
              <div className="flex items-center gap-1.5 text-blue-100 font-medium">
                <span className="text-white font-bold">Contact:</span> {currentUser?.contactNumber || currentUser?.contact_number || "+91 9876543210"}
              </div>
              <div className="w-px h-3.5 bg-white/20"></div>
              <div className="flex items-center gap-1.5 text-blue-100 font-medium">
                <span className="text-white font-bold">Email:</span> {currentUser?.email || "faculty@vignan.ac.in"}
              </div>
              <div className="w-px h-3.5 bg-white/20"></div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold">Class Teacher:</span>
                <select
                  value={currentUser?.classTeacherSection || currentUser?.sectionClassTeacher || "Section A"}
                  onChange={(e) => handleSectionClassTeacherChange(e.target.value)}
                  className="bg-white/20 text-white font-bold px-2 py-0.5 rounded-lg border border-white/30 text-xs focus:outline-none focus:ring-1 focus:ring-amber-300 cursor-pointer"
                >
                  <option value="Section A" className="text-gray-900">Section A</option>
                  <option value="Section B" className="text-gray-900">Section B</option>
                  <option value="Section C" className="text-gray-900">Section C</option>
                  <option value="Section D" className="text-gray-900">Section D</option>
                  <option value="Section E" className="text-gray-900">Section E</option>
                  <option value="Not Assigned" className="text-gray-900">Not Assigned</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Status Badges */}
          <div className="flex flex-wrap gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/15 min-w-[120px] text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-blue-100 font-semibold mb-1">
                <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                <span>Live Status</span>
              </div>
              <div className="text-lg font-bold text-white">
                {activeLiveSessions.length > 0 ? "Class in Session" : "Standby"}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/15 min-w-[120px] text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-blue-100 font-semibold mb-1">
                <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
                <span>Pending Doubts</span>
              </div>
              <div className="text-lg font-bold text-amber-300">
                {pendingDoubts.length} Unresolved
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two Options Navigation Switcher + Student Doubts */}
      <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 gap-2 overflow-x-auto">
        {/* Option 1: Conduct Live Sessions */}
        <button
          onClick={() => setActiveOption("live-sessions")}
          className={`flex-1 min-w-[180px] flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl text-sm font-bold transition-all ${
            activeOption === "live-sessions"
              ? "bg-[#1264E8] text-white shadow-md"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Conduct Live Sessions</span>
          {activeLiveSessions.length > 0 && (
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping"></span>
          )}
        </button>

        {/* Option 2: Upload Learning Resources */}
        <button
          onClick={() => setActiveOption("upload-pdf")}
          className={`flex-1 min-w-[180px] flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl text-sm font-bold transition-all ${
            activeOption === "upload-pdf"
              ? "bg-[#1264E8] text-white shadow-md"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Learning Resources</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">
            {facultyPdfs.length} Resources
          </span>
        </button>

        {/* Interactive Doubts Hub */}
        <button
          onClick={() => setActiveOption("student-doubts")}
          className={`flex-1 min-w-[180px] flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl text-sm font-bold transition-all ${
            activeOption === "student-doubts"
              ? "bg-[#1264E8] text-white shadow-md"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Student Doubts Hub</span>
          {pendingDoubts.length > 0 && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              activeOption === "student-doubts" ? "bg-amber-400 text-gray-900" : "bg-amber-100 text-amber-800"
            }`}>
              {pendingDoubts.length}
            </span>
          )}
        </button>
      </div>

      {/* =========================================================================
          SECTION 1: CONDUCT LIVE SESSIONS ON SUBJECT
          ========================================================================= */}
      {activeOption === "live-sessions" && (
        <div className="space-y-6">
          {/* Active Live Session Alert Banner if Live */}
          {activeLiveSessions.length > 0 && (
            <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-5 rounded-2xl shadow-md border border-red-400 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 animate-pulse">
                  <Radio className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-200">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                    <span>Live Class In Progress</span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-0.5">
                    {activeLiveSessions[0].topic}
                  </h2>
                  <p className="text-xs text-red-100">
                    Subject: {activeLiveSessions[0].subject} • {activeLiveSessions[0].joinedCount || 1} Students Connected
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={activeLiveSessions[0].meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-white text-red-700 hover:bg-red-50 text-sm font-bold rounded-xl shadow transition-all flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Join Live Classroom</span>
                </a>
                <button
                  onClick={() => handleEndSession(activeLiveSessions[0].id)}
                  className="px-4 py-2 bg-red-800/80 hover:bg-red-900 text-white text-sm font-semibold rounded-xl border border-red-400 transition-all"
                >
                  End Session
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Launch / Schedule Live Class Card */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1264E8] flex items-center justify-center font-bold">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Conduct Live Session</h2>
                  <p className="text-xs text-gray-500">Host interactive audio/video lecture for students</p>
                </div>
              </div>

              <form onSubmit={handleStartLiveSession} className="space-y-4">
                {/* Subject */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Subject
                  </label>
                  <select
                    value={sessionSubject}
                    onChange={(e) => setSessionSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-800 focus:bg-white focus:ring-2 focus:ring-[#1264E8] focus:outline-none"
                  >
                    {subjects.map((s, idx) => (
                      <option key={idx} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Session Topic */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Session Topic / Agenda
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Live Code Lab: AVL Tree Balancing & Red-Black Invariants"
                    value={sessionTopic}
                    onChange={(e) => setSessionTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-[#1264E8] focus:outline-none"
                  />
                </div>

                {/* Duration & Timing */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Duration (Mins)
                    </label>
                    <select
                      value={sessionDuration}
                      onChange={(e) => setSessionDuration(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-800 focus:bg-white focus:ring-2 focus:ring-[#1264E8] focus:outline-none"
                    >
                      <option value="30">30 Minutes</option>
                      <option value="45">45 Minutes</option>
                      <option value="60">60 Minutes</option>
                      <option value="90">90 Minutes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Schedule
                    </label>
                    <select
                      value={sessionTimeType}
                      onChange={(e) => setSessionTimeType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-800 focus:bg-white focus:ring-2 focus:ring-[#1264E8] focus:outline-none"
                    >
                      <option value="now">Start Immediately (Now)</option>
                      <option value="scheduled">Schedule for Later</option>
                    </select>
                  </div>
                </div>

                {sessionTimeType === "scheduled" && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Scheduled Date & Time
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tomorrow at 4:30 PM"
                      value={scheduledDateTime}
                      onChange={(e) => setScheduledDateTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-[#1264E8] focus:outline-none"
                    />
                  </div>
                )}

                {/* Custom Meeting Link (Optional) */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Meeting Link (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="Auto-generated if left blank (Google Meet / Vignan Class)"
                    value={customMeetLink}
                    onChange={(e) => setCustomMeetLink(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-[#1264E8] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={creatingSession}
                  className={`w-full py-3 px-4 font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm text-white ${
                    sessionTimeType === "now"
                      ? "bg-red-600 hover:bg-red-700 active:bg-red-800"
                      : "bg-[#1264E8] hover:bg-blue-700 active:bg-blue-800"
                  }`}
                >
                  {creatingSession ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Initializing Classroom...</span>
                    </>
                  ) : sessionTimeType === "now" ? (
                    <>
                      <Radio className="w-4 h-4 animate-pulse" />
                      <span>Launch Live Class Now</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      <span>Schedule Live Session</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Live & Scheduled Sessions List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Your Live & Upcoming Classes</h2>
                    <p className="text-xs text-gray-500">Live sessions available to enrolled students</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                    {liveSessions.length} Total
                  </span>
                </div>

                {liveSessions.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 space-y-2">
                    <Video className="w-10 h-10 mx-auto text-gray-300" />
                    <p className="text-sm font-medium">No live sessions conducted yet.</p>
                    <p className="text-xs text-gray-500">Start your first live lecture using the form on the left.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {liveSessions.map((session) => {
                      const isLive = session.status === "Live";
                      const isScheduled = session.status === "Scheduled";

                      return (
                        <div
                          key={session.id}
                          className={`p-4 rounded-xl border transition-all ${
                            isLive
                              ? "bg-red-50/50 border-red-200"
                              : isScheduled
                              ? "bg-blue-50/40 border-blue-200"
                              : "bg-gray-50 border-gray-200 opacity-80"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-800">
                                  {session.subject}
                                </span>
                                <span
                                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                    isLive
                                      ? "bg-red-600 text-white animate-pulse"
                                      : isScheduled
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-200 text-gray-700"
                                  }`}
                                >
                                  {isLive && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                                  {session.status}
                                </span>
                                <span className="text-xs text-gray-500">
                                  • {session.durationMins || 45} mins
                                </span>
                              </div>
                              <h3 className="text-sm font-bold text-gray-900">{session.topic}</h3>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                <span>{session.scheduledTime}</span>
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button
                                onClick={() => copyToClipboard(session.meetingLink, session.id)}
                                className="px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 flex items-center gap-1 shadow-sm"
                                title="Copy Meeting Link for Students"
                              >
                                {copiedLink === session.id ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="text-emerald-600">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copy Link</span>
                                  </>
                                )}
                              </button>

                              <a
                                href={session.meetingLink}
                                target="_blank"
                                rel="noreferrer"
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 shadow-sm transition-all ${
                                  isLive ? "bg-red-600 hover:bg-red-700" : "bg-[#1264E8] hover:bg-blue-700"
                                }`}
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Join Meet</span>
                              </a>

                              {isLive && (
                                <button
                                  onClick={() => handleEndSession(session.id)}
                                  className="px-2.5 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium rounded-lg"
                                >
                                  End
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 2: UPLOAD LEARNING RESOURCES
          ========================================================================= */}
      {activeOption === "upload-pdf" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Upload Learning Resources Form */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1264E8] flex items-center justify-center font-bold">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Upload Learning Resources</h2>
                  <p className="text-xs text-gray-500">Upload educational PPTs, PDFs, Notes & Documents for students</p>
                </div>
              </div>

              {pdfUploadSuccess && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{pdfUploadSuccess}</span>
                </div>
              )}

              <form onSubmit={handleUploadPdf} className="space-y-4">
                {/* Subject Selection Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Subject *
                  </label>
                  <select
                    value={pdfSubject}
                    onChange={(e) => setPdfSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-800 focus:bg-white focus:ring-2 focus:ring-[#1264E8] focus:outline-none"
                  >
                    {subjects.map((s, idx) => (
                      <option key={idx} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Resource Title */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Resource Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter resource title (e.g. Unit 1 Data Structures Notes)"
                    value={pdfTitle}
                    onChange={(e) => setPdfTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-[#1264E8] focus:outline-none"
                  />
                </div>

                {/* Resource Type (Auto Detected / Select) */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Resource Type</span>
                    {selectedPdfFile && (
                      <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
                        Auto-detected from file
                      </span>
                    )}
                  </label>
                  <select
                    value={resourceType}
                    onChange={(e) => setResourceType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-800 focus:bg-white focus:ring-2 focus:ring-[#1264E8] focus:outline-none"
                  >
                    <option value="PPT">PPT / PPTX Presentation</option>
                    <option value="PDF">PDF Document</option>
                    <option value="DOCX">Notes / DOC / DOCX</option>
                    <option value="Notes">Study Notes / Text File</option>
                  </select>
                </div>

                {/* File Upload Button */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Upload File
                  </label>
                  <label className="border-2 border-dashed border-gray-300 hover:border-[#1264E8] bg-gray-50/50 hover:bg-blue-50/30 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all">
                    <FileText className="w-8 h-8 text-[#1264E8] mb-2" />
                    <span className="text-xs font-bold text-gray-700 text-center">
                      {selectedPdfFile ? selectedPdfFile.name : "Choose PPT / PDF / Notes File"}
                    </span>
                    <span className="text-[11px] text-gray-400 mt-0.5 text-center">
                      {selectedPdfFile
                        ? `${(selectedPdfFile.size / (1024 * 1024)).toFixed(1)} MB selected`
                        : "Supports PPT, PPTX, PDF, DOC, DOCX, TXT"}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.notes"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Upload Button */}
                <button
                  type="submit"
                  disabled={uploadingPdf}
                  className="w-full py-3 px-4 bg-[#1264E8] hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  {uploadingPdf ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Uploading Resource...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      <span>Upload Resource</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Uploaded Resources Repository */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Your Uploaded Faculty Resources</h2>
                    <p className="text-xs text-gray-500">Learning materials accessible to your students by subject</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                    {facultyPdfs.length} Resources
                  </span>
                </div>

                {facultyPdfs.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 space-y-2">
                    <FileText className="w-10 h-10 mx-auto text-gray-300" />
                    <p className="text-sm font-medium">No learning resources uploaded yet.</p>
                    <p className="text-xs text-gray-500">Upload PPTs, PDFs, or Notes for your subjects using the form on the left.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {facultyPdfs.map((res) => {
                      const resType = res.resourceType || "PDF";
                      return (
                        <div
                          key={res.id}
                          className="p-4 bg-gray-50/70 hover:bg-gray-50 rounded-xl border border-gray-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold ${
                              resType === "PPT"
                                ? "bg-amber-100 text-amber-700"
                                : resType === "DOCX" || resType === "Notes"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-red-100 text-red-600"
                            }`}>
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[11px] font-bold bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-800">
                                  {res.subject}
                                </span>
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                  resType === "PPT"
                                    ? "bg-amber-100 text-amber-800"
                                    : resType === "DOCX" || resType === "Notes"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-red-100 text-red-800"
                                }`}>
                                  {resType}
                                </span>
                                <span className="text-xs text-gray-400">
                                  • {res.fileSize || "2.5 MB"}
                                </span>
                              </div>
                              <h3 className="text-sm font-bold text-gray-900">{res.title}</h3>
                              <p className="text-xs text-gray-500 flex items-center gap-2">
                                <span>File: {res.fileName}</span>
                                {res.createdAt && (
                                  <span>• Uploaded {new Date(res.createdAt).toLocaleDateString()}</span>
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <button
                              type="button"
                              onClick={() => {
                                const SERVER_BASE = "http://localhost:8000";
                                let url = res.fileUrl || "";
                                if (url.startsWith("/uploads")) url = `${SERVER_BASE}${url}`;
                                const ext = (res.fileName || url).split(".").pop().toLowerCase();
                                if (resType === "PPT" || ext === "ppt" || ext === "pptx") {
                                  setSelectedPptResource({ ...res, fileUrl: url });
                                } else {
                                  window.open(url, "_blank");
                                }
                              }}
                              className="px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 flex items-center gap-1.5 shadow-sm cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#1264E8]" />
                              <span>View</span>
                            </button>
                            <a
                              href={res.fileUrl?.startsWith("/uploads") ? `http://localhost:8000${res.fileUrl}` : res.fileUrl}
                              download={res.fileName || `${res.title}.${resType.toLowerCase()}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 bg-[#1264E8] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download</span>
                            </a>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 3: STUDENT DOUBTS RESOLUTION HUB
          ========================================================================= */}
      {activeOption === "student-doubts" && (
        <div className="space-y-6">
          {/* Doubts Control Header */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Student Doubts Resolution Hub</h2>
              <p className="text-xs text-gray-500">
                Answer conceptual questions asked by students. Your replies appear directly in the student's Doubt Session view.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-xl gap-1 text-xs font-semibold self-start sm:self-center">
              <button
                onClick={() => setDoubtsFilter("pending")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  doubtsFilter === "pending" ? "bg-white text-amber-800 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Needs Answer ({pendingDoubts.length})
              </button>
              <button
                onClick={() => setDoubtsFilter("answered")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  doubtsFilter === "answered" ? "bg-white text-emerald-800 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Resolved ({answeredDoubts.length})
              </button>
              <button
                onClick={() => setDoubtsFilter("all")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  doubtsFilter === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                All ({doubts.length})
              </button>
            </div>
          </div>

          {/* Doubts Feed */}
          {filteredDoubts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-400 space-y-3 border border-gray-200">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-gray-700">All Clear!</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                {doubtsFilter === "pending"
                  ? "No pending student doubts at this time. All questions have been resolved!"
                  : "No doubts found in this category."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDoubts.map((doubt) => {
                const isAnswered = doubt.status === "Answered";
                const draft = draftAnswers[doubt.id] ?? "";
                const isSubmitting = answeringDoubtId === doubt.id;

                return (
                  <div
                    key={doubt.id}
                    className={`bg-white rounded-2xl p-6 shadow-sm border transition-all ${
                      isAnswered ? "border-emerald-200/80" : "border-amber-200/80 shadow-md ring-1 ring-amber-100"
                    }`}
                  >
                    {/* Doubt Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-gray-100">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-800">
                            {doubt.subject}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-blue-600" />
                            <strong>{doubt.studentName}</strong> ({doubt.studentIdentifier || "Student"})
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-gray-900">{doubt.topic}</h3>
                      </div>

                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 self-start sm:self-center ${
                          isAnswered
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800 animate-pulse"
                        }`}
                      >
                        {isAnswered ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Answered</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5 text-amber-700" />
                            <span>Awaiting Faculty Response</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Student Question */}
                    <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-800 leading-relaxed mb-4 border border-gray-100">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                        Student Question:
                      </div>
                      <p className="whitespace-pre-line">{doubt.question}</p>
                    </div>

                    {/* Answer Area */}
                    {isAnswered ? (
                      <div className="bg-gradient-to-br from-emerald-50 to-green-50/50 border border-emerald-200 rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between text-xs border-b border-emerald-200/60 pb-2">
                          <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Your Answered Response:</span>
                          </span>
                          {doubt.answeredAt && (
                            <span className="text-emerald-700">
                              {new Date(doubt.answeredAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-emerald-950 whitespace-pre-line leading-relaxed font-normal">
                          {doubt.answer}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 pt-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Write Response / Explanation:
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Explain clearly with formulas, algorithm logic, or code steps for the student..."
                          value={draft}
                          onChange={(e) => handleAnswerChange(doubt.id, e.target.value)}
                          className="w-full p-3.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1264E8]"
                        />
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleSubmitAnswer(doubt.id)}
                            disabled={!draft.trim() || isSubmitting}
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                          >
                            {isSubmitting ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Submitting...</span>
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4" />
                                <span>Submit Answer to Student</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {selectedPptResource && (
        <PptViewerModal
          resource={selectedPptResource}
          onClose={() => setSelectedPptResource(null)}
        />
      )}
    </div>
  );
}

