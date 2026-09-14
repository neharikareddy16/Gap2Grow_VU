import React, { useState, useEffect, useRef } from "react";
import { useUser } from "../context/UserContext";
import { api, SERVER_BASE } from "../services/api";
import PptViewerModal from "../components/PptViewerModal";
import {
  Sparkles,
  Upload,
  FileText,
  Search,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Download,
  ExternalLink,
  ChevronRight,
  Layers,
  GraduationCap,
  Route,
  ClipboardCheck,
  Dumbbell,
  Play,
  RotateCcw,
  BookMarked,
  Video
} from "lucide-react";

function YoutubeIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

export default function StudentDashboard() {
  const { currentUser, setActiveTab } = useUser();

  // Simplifier input states
  const [inputMode, setInputMode] = useState("youtube"); // "youtube", "nptel", "file", "text", "topic"
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [topicInput, setTopicInput] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

  // Simplifier execution states
  const [isSimplifying, setIsSimplifying] = useState(false);
  const [loadingStepText, setLoadingStepText] = useState("Reading your learning resource...");
  const [simplifierError, setSimplifierError] = useState("");
  const [simplifiedResult, setSimplifiedResult] = useState(null);
  const [activeResultTab, setActiveResultTab] = useState("overview"); // overview, slides, concepts, formulas, steps, examprep, questions

  // Faculty Learning Resources state
  const [selectedSubject, setSelectedSubject] = useState("Data Structures");
  const [facultyResources, setFacultyResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(false);

  const studentSubjects = [
    "Data Structures",
    "Database Management System",
    "Discrete Mathematics",
    "Object Oriented Programming Through Java",
    "Digital Logical Design",
    "Artificial Intelligence",
    "Data Wrangling And Visualization"
  ];

  // Default Important Notes states
  const [importantNotes, setImportantNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [selectedTopicFilter, setSelectedTopicFilter] = useState("all");

  // Faculty Live Sessions state
  const [liveSessions, setLiveSessions] = useState([]);
  const [loadingLiveSessions, setLoadingLiveSessions] = useState(false);

  // PPT Viewer modal state
  const [selectedPptResource, setSelectedPptResource] = useState(null);
  const [remedialNotifications, setRemedialNotifications] = useState([]);

  const resultsRef = useRef(null);

  useEffect(() => {
    const loadStudentNotifs = async () => {
      const ident = currentUser?.identifier || currentUser?.id || "23CSE101";
      try {
        const notifs = await api.getStudentNotifications(ident);
        setRemedialNotifications(notifs || []);
      } catch (err) {
        console.warn("Could not load notifications:", err.message);
      }
    };
    loadStudentNotifs();
  }, [currentUser]);

  // Dynamic loading step text rotator
  useEffect(() => {
    if (!isSimplifying) return;
    const steps = [
      "Reading your learning resource...",
      "Understanding the topic and structure...",
      "Simplifying technical content...",
      "Preparing exam-ready notes & practice Q&A..."
    ];
    let idx = 0;
    setLoadingStepText(steps[0]);
    const interval = setInterval(() => {
      idx = (idx + 1) % steps.length;
      setLoadingStepText(steps[idx]);
    }, 1500);
    return () => clearInterval(interval);
  }, [isSimplifying]);

  // Fetch faculty resources when selectedSubject changes
  useEffect(() => {
    let isMounted = true;
    const fetchFacultyResources = async () => {
      setLoadingResources(true);
      try {
        const data = await api.getFacultyPdfs({ subject: selectedSubject });
        if (isMounted) {
          const filtered = (data || []).filter(
            r => r.subject && r.subject.toLowerCase().trim() === selectedSubject.toLowerCase().trim()
          );
          setFacultyResources(filtered);
        }
      } catch (err) {
        console.warn("Could not fetch faculty resources:", err.message);
        if (isMounted) setFacultyResources([]);
      } finally {
        if (isMounted) setLoadingResources(false);
      }
    };
    fetchFacultyResources();
    return () => { isMounted = false; };
  }, [selectedSubject]);

  // Load default curriculum notes on mount & live sessions
  useEffect(() => {
    let isMounted = true;
    const fetchNotes = async () => {
      setLoadingNotes(true);
      try {
        const data = await api.getImportantNotes(currentUser?.department || "CSE", currentUser?.year || "2");
        if (isMounted && Array.isArray(data)) {
          setImportantNotes(data);
        }
      } catch (err) {
        console.warn("Could not fetch curriculum notes:", err.message);
      } finally {
        if (isMounted) setLoadingNotes(false);
      }
    };

    const fetchLiveSessions = async () => {
      setLoadingLiveSessions(true);
      try {
        const data = await api.getLiveSessions();
        if (isMounted && Array.isArray(data)) {
          setLiveSessions(data);
        }
      } catch (err) {
        console.warn("Could not fetch live sessions:", err.message);
      } finally {
        if (isMounted) setLoadingLiveSessions(false);
      }
    };

    fetchNotes();
    fetchLiveSessions();
    const interval = setInterval(fetchLiveSessions, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [currentUser]);

  // Handle AI Simplification Submission
  const handleSimplify = async (e) => {
    e?.preventDefault();
    setSimplifierError("");
    setSimplifiedResult(null);

    let payload = null;

    if (inputMode === "youtube" || inputMode === "nptel") {
      if (!urlInput.trim()) {
        setSimplifierError(`Please paste a valid ${inputMode === "youtube" ? "YouTube" : "NPTEL"} URL.`);
        return;
      }
      payload = {
        inputMode: inputMode,
        type: inputMode,
        content: urlInput.trim(),
        url: urlInput.trim(),
        title: inputMode === "youtube" ? "YouTube Video Lecture" : "NPTEL Video Lecture"
      };
    } else if (inputMode === "text") {
      if (!textInput.trim()) {
        setSimplifierError("Please enter or paste your study notes / lecture text.");
        return;
      }
      payload = {
        inputMode: "text",
        type: "text",
        content: textInput.trim(),
        title: "Pasted Lecture Notes"
      };
    } else if (inputMode === "topic") {
      if (!topicInput.trim()) {
        setSimplifierError("Please enter a syllabus topic name (e.g. Binary Trees, Quicksort, BFS).");
        return;
      }
      payload = {
        inputMode: "syllabus",
        type: "syllabus",
        content: topicInput.trim(),
        topic: topicInput.trim(),
        title: topicInput.trim()
      };
    } else if (inputMode === "file") {
      if (!uploadedFile) {
        setSimplifierError("Please select a PDF, PPT, or document file to upload.");
        return;
      }
      const formData = new FormData();
      formData.append("file", uploadedFile);
      if (topicInput.trim()) formData.append("topic", topicInput.trim());

      const fileNameLower = uploadedFile.name.toLowerCase();
      const detectedMode = fileNameLower.endsWith(".ppt") || fileNameLower.endsWith(".pptx") ? "ppt" : "pdf";
      formData.append("inputMode", detectedMode);

      setIsSimplifying(true);
      try {
        const result = await api.simplifyFile(formData);
        setSimplifiedResult(result);
        if (result.slideBySlide?.length > 0) setActiveResultTab("slides");
        else setActiveResultTab("overview");
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      } catch (err) {
        setSimplifierError(err.message || "Failed to process uploaded document. Please check the file format.");
      } finally {
        setIsSimplifying(false);
      }
      return;
    }

    if (!payload) return;

    setIsSimplifying(true);
    try {
      const result = await api.simplifyResource(payload);
      setSimplifiedResult(result);
      if (result.slideBySlide?.length > 0) setActiveResultTab("slides");
      else setActiveResultTab("overview");
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      setSimplifierError(err.message || "Failed to simplify resource. Please verify your connection.");
    } finally {
      setIsSimplifying(false);
    }
  };


  // Quick helper to read a default important note
  const handleReadImportantNote = (note) => {
    if (note.simplification) {
      setSimplifiedResult(note.simplification);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  // Open / View Faculty Resource Handler
  const handleOpenResource = async (res) => {
    if (!res || !res.fileUrl || typeof res.fileUrl !== "string" || !res.fileUrl.trim()) {
      alert("Unable to open this resource. The file is not available.");
      return;
    }

    let fileUrl = res.fileUrl.trim();
    if (fileUrl.startsWith("/uploads")) {
      fileUrl = `${SERVER_BASE}${fileUrl}`;
    }

    const resType = (res.resourceType || "PDF").toUpperCase();
    const ext = (res.fileName || fileUrl).split('.').pop().toLowerCase();
    const isPpt = resType === "PPT" || resType === "PPTX" || ext === "ppt" || ext === "pptx";

    if (isPpt) {
      setSelectedPptResource({
        ...res,
        fileUrl
      });
      return;
    }

    try {
      const win = window.open(fileUrl, "_blank");
      if (!win) {
        alert("Pop-up blocked by browser. Please allow pop-ups to open resources.");
      }
    } catch (err) {
      console.warn("Direct resource open fallback:", err);
      const a = document.createElement("a");
      a.href = fileUrl;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };


  // Download Faculty Resource Handler
  const handleDownloadResource = async (res) => {
    if (!res || !res.fileUrl || typeof res.fileUrl !== "string" || !res.fileUrl.trim()) {
      alert("Unable to download this resource. The file is not available.");
      return;
    }

    let fileUrl = res.fileUrl.trim();
    if (fileUrl.startsWith("/uploads")) {
      fileUrl = `${SERVER_BASE}${fileUrl}`;
    }

    const defaultExt = (res.resourceType || "pdf").toLowerCase();
    const fileName = res.fileName || `${(res.title || "resource").replace(/\s+/g, "_")}.${defaultExt}`;

    try {
      if (fileUrl.startsWith("data:")) {
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        return;
      }

      const resBlob = await fetch(fileUrl);
      if (!resBlob.ok) throw new Error(`Fetch status ${resBlob.status}`);
      const blob = await resBlob.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (err) {
      console.warn("Direct blob download failed, fallback to anchor:", err);
      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = fileName;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const filteredNotes = selectedTopicFilter === "all"
    ? importantNotes
    : importantNotes.filter((n) => n.topic.toLowerCase().includes(selectedTopicFilter.toLowerCase()));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* 1. WELCOME SECTION (AUTHENTICATED STUDENT PROFILE ONLY - NO DEMO CREDENTIALS) */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 border border-blue-200 text-[#1264E8] flex items-center justify-center font-black text-2xl flex-shrink-0 shadow-xs">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "S"}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  Welcome back, {currentUser?.name || "Student"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  AI Learning Mode Active
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Department of {currentUser?.department || "Computer Science and Engineering"} • Vignan University
              </p>
            </div>
          </div>

          {/* Student Profile Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
            <div className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-left">
              <span className="text-[10px] text-gray-400 block font-semibold uppercase tracking-wider">Register No</span>
              <span className="text-xs font-bold text-gray-800">{currentUser?.identifier || "Registered Student"}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-left">
              <span className="text-[10px] text-gray-400 block font-semibold uppercase tracking-wider">Year &amp; Branch</span>
              <span className="text-xs font-bold text-gray-800">{currentUser?.year || "2nd Year"} - {currentUser?.department || "CSE"}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-left">
              <span className="text-[10px] text-gray-400 block font-semibold uppercase tracking-wider">Section</span>
              <span className="text-xs font-bold text-gray-800">{currentUser?.section || "A"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1.5 REMEDIAL COORDINATOR SUGGESTION NOTIFICATION BANNER */}
      {remedialNotifications.length > 0 && (
        <div className="bg-amber-50 rounded-2xl border-2 border-amber-300 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 bg-amber-600 text-white rounded-md uppercase tracking-wider">
                Remedial Coordinator Advice
              </span>
              <span className="text-xs font-semibold text-amber-900">
                Personalized Learning Guidance Received
              </span>
            </div>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
              {remedialNotifications.length} New Message{remedialNotifications.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="space-y-2">
            {remedialNotifications.slice(0, 2).map((notif, idx) => (
              <div key={notif.id || idx} className="bg-white rounded-xl border border-amber-200 p-3 text-xs text-gray-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1264E8]">{notif.title || "Remedial Coordinator Support"}</span>
                  <span className="text-[10px] text-gray-400 font-medium">{notif.senderName || "Remedial Coordinator"} • {notif.subject || "Subject"}</span>
                </div>
                <p className="font-medium text-gray-900">{notif.message || notif.suggestionText}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. MAIN FEATURE: SIMPLIFY ANY LEARNING RESOURCE */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-7 shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1264E8] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Core AI Assistant Feature</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Simplify Any Learning Resource with AI
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Provide a YouTube or NPTEL lecture link, upload your textbook pages or class notes, or enter a difficult topic.
            Gap2Grow AI will convert it into student-friendly study notes, exam points, step-by-step guides, and practice Q&amp;A.
          </p>
        </div>

        {/* Input Mode Selector Tabs */}
        <div className="mt-5 flex flex-wrap gap-2 border-b border-gray-200 pb-3">
          <button
            type="button"
            onClick={() => { setInputMode("youtube"); setSimplifierError(""); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              inputMode === "youtube"
                ? "bg-red-50 text-red-700 border border-red-200 shadow-xs"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent"
            }`}
          >
            <YoutubeIcon className="w-4 h-4 text-red-600" />
            <span>Paste YouTube Link</span>
          </button>

          <button
            type="button"
            onClick={() => { setInputMode("nptel"); setSimplifierError(""); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              inputMode === "nptel"
                ? "bg-purple-50 text-purple-700 border border-purple-200 shadow-xs"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent"
            }`}
          >
            <GraduationCap className="w-4 h-4 text-purple-600" />
            <span>NPTEL Lecture Link</span>
          </button>

          <button
            type="button"
            onClick={() => { setInputMode("file"); setSimplifierError(""); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              inputMode === "file"
                ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-xs"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent"
            }`}
          >
            <Upload className="w-4 h-4 text-[#1264E8]" />
            <span>Upload PDF / Notes</span>
          </button>

          <button
            type="button"
            onClick={() => { setInputMode("text"); setSimplifierError(""); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              inputMode === "text"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent"
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Paste Text</span>
          </button>

          <button
            type="button"
            onClick={() => { setInputMode("topic"); setSimplifierError(""); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              inputMode === "topic"
                ? "bg-amber-50 text-amber-800 border border-amber-200 shadow-xs"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent"
            }`}
          >
            <Search className="w-4 h-4 text-amber-600" />
            <span>Enter Syllabus Topic</span>
          </button>
        </div>

        {/* Input Form Fields */}
        <form onSubmit={handleSimplify} className="mt-4 space-y-3">
          {/* 1. YouTube or NPTEL URL */}
          {(inputMode === "youtube" || inputMode === "nptel") && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {inputMode === "youtube" ? "YouTube Video URL *" : "NPTEL Lecture URL *"}
              </label>
              <div className="relative">
                <input
                  type="url"
                  required
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder={
                    inputMode === "youtube"
                      ? "e.g. https://www.youtube.com/watch?v=gm8DUJJhmY4 (Tree Traversals) or https://youtu.be/..."
                      : "e.g. https://nptel.ac.in/courses/106102064 or YouTube NPTEL link"
                  }
                  className="w-full pl-3.5 pr-28 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1264E8]/20 focus:border-[#1264E8]"
                />
                <button
                  type="button"
                  onClick={() => setUrlInput("https://www.youtube.com/watch?v=gm8DUJJhmY4")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-white border border-gray-200 hover:border-gray-300 text-[11px] font-semibold text-gray-600 rounded-lg"
                >
                  Try Sample URL
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                The AI will extract video metadata and synthesize comprehensive exam-ready notes.
              </p>
            </div>
          )}

          {/* 2. File Upload Dropzone */}
          {inputMode === "file" && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Upload Textbook Chapter / Class Notes / Presentation (PDF, PPT, PPTX, TXT) *
              </label>
              <div className="border-2 border-dashed border-gray-300 hover:border-[#1264E8] rounded-xl p-6 text-center bg-gray-50/50 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-700">
                  {uploadedFile ? uploadedFile.name : "Click to select or drag and drop your document / presentation"}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">Supports PDF, PPT, PPTX, and TXT files</p>
                <input
                  type="file"
                  accept=".pdf,.ppt,.pptx,.txt,.md,.doc,.docx"
                  onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                  className="mt-3 block mx-auto text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#1264E8] file:text-white hover:file:bg-[#0E52C2]"
                />
              </div>
            </div>
          )}

          {/* 3. Text Notes Input */}
          {inputMode === "text" && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Paste Syllabus Content / Class Notes / Textbook Excerpt *
              </label>
              <textarea
                rows={4}
                required
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste paragraph, difficult definition, or syllabus text here..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1264E8]/20 focus:border-[#1264E8]"
              />
            </div>
          )}

          {/* 4. Topic Input */}
          {inputMode === "topic" && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Syllabus Topic Name *
              </label>
              <input
                type="text"
                required
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="e.g. Binary Tree Traversals, Breadth First Search, Quicksort, Circular Queue"
                className="w-full px-3.5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1264E8]/20 focus:border-[#1264E8]"
              />
            </div>
          )}

          {/* Error Message */}
          {simplifierError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>{simplifierError}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-between">
            <button
              type="submit"
              disabled={isSimplifying}
              className="py-3 px-6 bg-[#1264E8] hover:bg-[#0E52C2] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs hover:shadow transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSimplifying ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="animate-pulse">{loadingStepText}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Simplify with AI</span>
                </>
              )}
            </button>

            <span className="text-[11px] text-gray-400 hidden sm:inline">
              Input-type aware AI Learning Resource Agent
            </span>
          </div>
        </form>
      </div>

      {/* 3. SIMPLIFIED AI STUDY NOTES OUTPUT VIEWER (EXPANDED WHEN AVAILABLE) */}
      {simplifiedResult && (
        <div ref={resultsRef} className="bg-white border-2 border-blue-200 rounded-2xl p-5 sm:p-7 shadow-md animate-in fade-in slide-in-from-top-3 duration-300">
          {/* Header of Result */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold px-2.5 py-0.5 bg-blue-100 text-[#1264E8] rounded-full uppercase tracking-wider">
                  Easy Study Notes ({simplifiedResult.inputMode || simplifiedResult.resourceMeta?.type || "AI Simplified"})
                </span>
                {simplifiedResult.resourceMeta?.channel && (
                  <span className="text-xs text-gray-500 font-medium">
                    Source: {simplifiedResult.resourceMeta.channel}
                  </span>
                )}
                {simplifiedResult.resourceMeta?.sourceStatus === "transcript_available" && (
                  <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                    ✓ Video Transcript Grounded
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-black text-gray-900 mt-1">
                {simplifiedResult.topic || simplifiedResult.resourceMeta?.sourceTitle || "Simplified Topic Notes"}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {simplifiedResult.resourceMeta?.youtubeUrl && (
                <a
                  href={simplifiedResult.resourceMeta.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl border border-red-200 flex items-center gap-1.5 transition-colors"
                >
                  <YoutubeIcon className="w-4 h-4 text-red-600" />
                  <span>Watch on YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              <button
                onClick={() => setSimplifiedResult(null)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl"
              >
                Close Notes
              </button>
            </div>
          </div>

          {/* Source Notice Banner */}
          {simplifiedResult.resourceMeta?.notesNotice && (
            <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Source Notice:</span>
                <span>{simplifiedResult.resourceMeta.notesNotice}</span>
              </div>
            </div>
          )}

          {/* Tab Navigation for Notes Sections */}
          <div className="flex items-center gap-1 border-b border-gray-100 py-3 overflow-x-auto text-xs font-bold">
            <button
              onClick={() => setActiveResultTab("overview")}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeResultTab === "overview" ? "bg-[#1264E8] text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              1. Overview &amp; Explanation
            </button>
            {simplifiedResult.slideBySlide?.length > 0 && (
              <button
                onClick={() => setActiveResultTab("slides")}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  activeResultTab === "slides" ? "bg-[#1264E8] text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                2. Slide-by-Slide Notes ({simplifiedResult.slideBySlide.length})
              </button>
            )}
            <button
              onClick={() => setActiveResultTab("concepts")}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeResultTab === "concepts" ? "bg-[#1264E8] text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Key Concepts &amp; Definitions
            </button>
            {simplifiedResult.formulas?.length > 0 && (
              <button
                onClick={() => setActiveResultTab("formulas")}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  activeResultTab === "formulas" ? "bg-[#1264E8] text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Formulas &amp; Equations
              </button>
            )}
            <button
              onClick={() => setActiveResultTab("steps")}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeResultTab === "steps" ? "bg-[#1264E8] text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Step-by-Step &amp; Examples
            </button>
            <button
              onClick={() => setActiveResultTab("examprep")}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeResultTab === "examprep" ? "bg-[#1264E8] text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Exam Points &amp; Revision
            </button>
            <button
              onClick={() => setActiveResultTab("questions")}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeResultTab === "questions" ? "bg-[#1264E8] text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Practice Q&amp;A ({simplifiedResult.practiceQuestions?.length || 5})
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="pt-4 space-y-4">
            {/* Tab 1: Overview & Simple Explanation */}
            {activeResultTab === "overview" && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#1264E8]" />
                    <span>Complete Simplified Explanation</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                    {simplifiedResult.simpleExplanation}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Resource / Topic Overview
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {simplifiedResult.summary}
                  </p>
                </div>

                {simplifiedResult.diagrams?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      Visual Concepts &amp; Diagrams
                    </h4>
                    {simplifiedResult.diagrams.map((d, idx) => (
                      <div key={idx} className="p-3 bg-slate-900 text-slate-100 rounded-xl">
                        <span className="text-xs font-bold text-emerald-400 block mb-1">{d.title}</span>
                        {d.mermaid && (
                          <pre className="text-xs font-mono text-cyan-300 overflow-x-auto p-2 bg-slate-950 rounded">
                            {d.mermaid}
                          </pre>
                        )}
                        <p className="text-xs text-slate-300 mt-2">{d.explanation}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Slide-by-Slide Notes for PPT */}
            {activeResultTab === "slides" && simplifiedResult.slideBySlide && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Slide-by-Slide Simplified Breakdown
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {simplifiedResult.slideBySlide.map((s, idx) => (
                    <div key={idx} className="p-4 bg-purple-50/40 border border-purple-100 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-purple-900">
                          Slide {s.slideNumber || idx + 1}: {s.title}
                        </span>
                        <span className="text-[10px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                          Simplified Slide Note
                        </span>
                      </div>
                      <p className="text-xs text-gray-800 leading-relaxed">{s.simpleExplanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Key Concepts & Definitions */}
            {activeResultTab === "concepts" && (
              <div className="space-y-4">
                {/* Key Concepts */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Key Concepts from Resource
                  </h4>
                  <div className="space-y-2">
                    {simplifiedResult.keyConcepts?.map((c, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Important Definitions */}
                {simplifiedResult.importantDefinitions?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Important Definitions (Plain Language)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {simplifiedResult.importantDefinitions.map((d, idx) => (
                        <div key={idx} className="p-3 bg-purple-50/40 border border-purple-100 rounded-xl">
                          <span className="text-xs font-black text-purple-900 block">{d.term}</span>
                          <span className="text-[11px] text-gray-600 mt-1 block">{d.definition}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Formulas & Equations */}
            {activeResultTab === "formulas" && simplifiedResult.formulas && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Formulas &amp; Equations
                </h4>
                <div className="space-y-2.5">
                  {simplifiedResult.formulas.map((f, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-900 text-slate-100 rounded-xl border border-slate-800">
                      <div className="text-sm font-mono font-bold text-emerald-400 mb-1">{f.formula}</div>
                      <div className="text-xs text-slate-300">{f.explanation}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Step-by-Step & Examples */}
            {activeResultTab === "steps" && (
              <div className="space-y-4">
                {/* Step by step */}
                {simplifiedResult.stepByStep?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Step-by-Step Concept Walkthrough
                    </h4>
                    <div className="space-y-2">
                      {simplifiedResult.stepByStep.map((s, idx) => (
                        <div key={idx} className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-[#1264E8] font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Code / Visual Examples */}
                {simplifiedResult.examples?.map((ex, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-900 text-slate-100 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-300 block">{ex.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ex.source === "ai_created" ? "bg-amber-950 text-amber-300 border border-amber-800" : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                      }`}>
                        {ex.source === "ai_created" ? "Extra AI Example (Supporting)" : "From Provided Material"}
                      </span>
                    </div>
                    <pre className="text-xs font-mono overflow-x-auto text-emerald-400 leading-relaxed">
                      {ex.code}
                    </pre>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 4: Exam Notes & Quick Revision */}
            {activeResultTab === "examprep" && (
              <div className="space-y-4">
                {/* Exam Notes */}
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2">
                    🎯 High-Probability Exam Preparation Points
                  </h4>
                  <ul className="space-y-1.5 text-xs text-amber-950">
                    {simplifiedResult.examNotes?.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Common Mistakes if present */}
                {simplifiedResult.commonMistakes?.length > 0 && (
                  <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 mb-2">
                      ⚠️ Common Student Mistakes &amp; Pitfalls
                    </h4>
                    <ul className="space-y-1.5 text-xs text-rose-950">
                      {simplifiedResult.commonMistakes.map((m, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-rose-600 font-bold">•</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quick Revision Bullets */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    ⚡ 60-Second Quick Revision
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
                    {simplifiedResult.quickRevision?.map((rev, idx) => (
                      <div key={idx} className="p-2 bg-white rounded-lg border border-gray-200">
                        {rev}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Practice Questions & Answers */}
            {activeResultTab === "questions" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Practice Questions with Explanations
                </h4>
                {simplifiedResult.practiceQuestions?.map((q, idx) => (
                  <div key={idx} className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-1.5">
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-black text-[#1264E8]">Q{idx + 1}:</span>
                      <span className="text-xs font-bold text-gray-900">{q.question}</span>
                    </div>
                    <div className="pl-6 pt-1 text-xs text-gray-600 border-t border-gray-200/60 mt-1">
                      <strong className="text-emerald-700 font-semibold">Answer: </strong>
                      <span>{q.answer}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* FACULTY ONLINE LIVE SESSIONS SECTION */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold mb-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span>Real-Time Online Classes &amp; Meetings</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Faculty Online Live Sessions
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Join online live classes, doubt resolution lectures, and interactive sessions conducted by faculty via Google Meet, Microsoft Teams, or Zoom.
            </p>
          </div>
        </div>

        {loadingLiveSessions ? (
          <div className="py-8 text-center text-gray-400 space-y-2">
            <div className="w-6 h-6 border-2 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-medium">Checking live classes...</p>
          </div>
        ) : liveSessions.length === 0 ? (
          <div className="p-8 text-center bg-gray-50/60 rounded-xl border border-dashed border-gray-300 text-gray-500 space-y-2">
            <Video className="w-10 h-10 mx-auto text-gray-300" />
            <p className="text-sm font-bold text-gray-700">
              No online live sessions are currently scheduled by faculty.
            </p>
            <p className="text-xs text-gray-400">
              Live sessions scheduled by your faculty will appear here automatically with direct Google Meet, Teams, or Zoom links.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveSessions.map((session) => {
              const isLive = session.status === "Live" || session.status === "Live Now";
              const link = session.meeting_link || session.meetingLink || "https://meet.google.com";
              const isTeams = link.includes("teams.microsoft.com") || link.includes("teams.live");
              const isZoom = link.includes("zoom.us") || link.includes("zoom");
              const platformName = isTeams ? "Microsoft Teams" : isZoom ? "Zoom Meeting" : "Google Meet";
              const platformBg = isTeams
                ? "bg-purple-50 text-purple-700 border-purple-200"
                : isZoom
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200";

              return (
                <div
                  key={session.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                    isLive
                      ? "bg-gradient-to-br from-rose-50/60 via-white to-rose-50/20 border-rose-200 shadow-sm"
                      : "bg-white border-gray-200 hover:border-blue-300 shadow-xs"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                        isLive ? "bg-rose-500 text-white animate-pulse" : "bg-blue-100 text-blue-800"
                      }`}>
                        {isLive ? "🔴 Live Now" : "📅 Scheduled"}
                      </span>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${platformBg}`}>
                        {platformName}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-gray-900 tracking-tight leading-snug">
                      {session.topic}
                    </h3>

                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800">Faculty:</span>
                        <span>{session.faculty_name || session.facultyName || "Faculty"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800">Subject:</span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium">
                          {session.subject}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800">Time:</span>
                        <span className="text-blue-700 font-bold">{session.scheduled_time || session.scheduledTime}</span>
                        <span>({session.duration_mins || session.durationMins || 45} mins)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => window.open(link, "_blank")}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
                        isLive
                          ? "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200"
                          : "bg-[#1264E8] hover:bg-blue-700 text-white"
                      }`}
                    >
                      <Video className="w-4 h-4" />
                      <span>Join {platformName} Class</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FACULTY LEARNING RESOURCES SECTION */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1264E8] text-xs font-bold mb-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Official Academic Materials</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Faculty Learning Resources
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Select a subject to view educational PPTs, PDFs, Notes, and documents uploaded by faculty.
            </p>
          </div>

          {/* Subject Dropdown Selector */}
          <div className="min-w-[240px]">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Select Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-800 focus:bg-white focus:ring-2 focus:ring-[#1264E8] focus:outline-none shadow-xs"
            >
              {studentSubjects.map((sub, idx) => (
                <option key={idx} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Resources Header Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-800">Subject:</span>
            <span className="text-sm font-extrabold text-[#1264E8] bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
              {selectedSubject}
            </span>
          </div>
          <span className="text-xs text-gray-500 font-semibold">
            {facultyResources.length} {facultyResources.length === 1 ? "Resource" : "Resources"} Available
          </span>
        </div>

        {/* Resource List / Empty State */}
        {loadingResources ? (
          <div className="py-12 text-center text-gray-400 space-y-2">
            <div className="w-6 h-6 border-2 border-[#1264E8] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-medium">Fetching faculty resources for {selectedSubject}...</p>
          </div>
        ) : facultyResources.length === 0 ? (
          <div className="p-8 text-center bg-gray-50/60 rounded-xl border border-dashed border-gray-300 text-gray-500 space-y-2">
            <BookOpen className="w-10 h-10 mx-auto text-gray-300" />
            <p className="text-sm font-bold text-gray-700">
              No learning resources have been uploaded for this subject yet.
            </p>
            <p className="text-xs text-gray-400">
              Please check back later or select another subject from the dropdown.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facultyResources.map((res) => {
              const resType = (res.resourceType || "PDF").toUpperCase();
              const isPpt = resType === "PPT" || resType === "PPTX";
              return (
                <div
                  key={res.id}
                  className="p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50/50 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl font-black ${
                      isPpt
                        ? "bg-amber-100 text-amber-700"
                        : resType === "DOCX" || resType === "NOTES" || resType === "DOC"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-600"
                    }`}>
                      {isPpt ? "📊" : "📄"}
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isPpt
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : resType === "DOCX" || resType === "NOTES" || resType === "DOC"
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}>
                          {resType}
                        </span>
                        {res.fileSize && (
                          <span className="text-xs text-gray-400">• {res.fileSize}</span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 truncate" title={res.title}>
                        {res.title}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">
                        Uploaded by: <strong className="text-gray-700">{res.facultyName || "Faculty"}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => handleOpenResource(res)}
                      className="px-3.5 py-1.5 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#1264E8]" />
                      <span>Open</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadResource(res)}
                      className="px-3.5 py-1.5 bg-[#1264E8] hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedPptResource && (
        <PptViewerModal
          resource={selectedPptResource}
          onClose={() => setSelectedPptResource(null)}
        />
      )}
    </div>
  );
}

