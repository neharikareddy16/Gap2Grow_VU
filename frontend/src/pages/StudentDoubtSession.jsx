import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { api } from "../services/api";
import {
  HelpCircle,
  Send,
  CheckCircle2,
  Clock,
  User,
  BookOpen,
  MessageSquare,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  Info,
  Check
} from "lucide-react";

export default function StudentDoubtSession() {
  const { currentUser } = useUser();
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'answered', 'pending'
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [subject, setSubject] = useState("Database Management System");
  const [facultyName, setFacultyName] = useState("Ms.Y.Sai Eswari(DBMS)");
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");

  const facultyOptions = [
    { name: "Ms.Y.Sai Eswari(DBMS)", subject: "Database Management System" },
    { name: "Dr.R.Prathap Kumar(DS)", subject: "Data Structures" },
    { name: "Dr.N.Santhosh(DMS)", subject: "Discrete Mathematics" },
    { name: "Mr.T.Latesh Babu(OOPSTJ)", subject: "Object Oriented Programming Through Java" },
    { name: "Mrs.M.Sumalatha(DLDES)", subject: "Digital Logical Design" },
    { name: "Dr.M.Sunil Babu(AI)", subject: "Artificial Intelligence" },
    { name: "Mr.M.Anil(DWAV)", subject: "Data Wrangling And Visualization" }
  ];

  const subjects = [
    "Database Management System",
    "Data Structures",
    "Discrete Mathematics",
    "Object Oriented Programming Through Java",
    "Digital Logical Design",
    "Artificial Intelligence",
    "Data Wrangling And Visualization"
  ];

  useEffect(() => {
    loadDoubts();
    // Auto-sync every 8 seconds in background
    const interval = setInterval(loadDoubts, 8000);
    return () => clearInterval(interval);
  }, []);

  const loadDoubts = async () => {
    try {
      const data = await api.getDoubts();
      setDoubts(data || []);
    } catch (err) {
      console.error("Error loading doubts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFacultyChange = (e) => {
    const selectedName = e.target.value;
    setFacultyName(selectedName);
    const matched = facultyOptions.find(f => f.name === selectedName);
    if (matched) {
      setSubject(matched.subject);
    }
  };

  const handleSubjectChange = (e) => {
    const selectedSub = e.target.value;
    setSubject(selectedSub);
    const matched = facultyOptions.find(f => f.subject === selectedSub);
    if (matched) {
      setFacultyName(matched.name);
    }
  };

  const handleSubmitDoubt = async (e) => {
    e.preventDefault();
    if (!topic.trim() || !question.trim()) return;

    setSubmitting(true);
    try {
      const payload = {
        studentId: currentUser?.id || 1,
        studentName: currentUser?.name || "Rahul Kumar",
        studentIdentifier: currentUser?.identifier || "23CSE101",
        facultyName,
        subject,
        topic: topic.trim(),
        question: question.trim()
      };

      const newDoubt = await api.askDoubt(payload);
      setDoubts(prev => [newDoubt, ...prev]);
      setTopic("");
      setQuestion("");
      setSuccessMsg("Your doubt has been submitted to " + facultyName + "! You will see their answer here once resolved.");
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (err) {
      console.error("Failed to submit doubt:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDoubts = doubts.filter(d => {
    if (activeFilter === "answered" && d.status !== "Answered") return false;
    if (activeFilter === "pending" && d.status !== "Pending") return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTopic = d.topic?.toLowerCase().includes(q);
      const matchQuestion = d.question?.toLowerCase().includes(q);
      const matchSubject = d.subject?.toLowerCase().includes(q);
      const matchFaculty = d.facultyName?.toLowerCase().includes(q);
      const matchAnswer = d.answer?.toLowerCase().includes(q);
      return matchTopic || matchQuestion || matchSubject || matchFaculty || matchAnswer;
    }
    return true;
  });

  const answeredCount = doubts.filter(d => d.status === "Answered").length;
  const pendingCount = doubts.filter(d => d.status === "Pending").length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1264E8] via-[#0E4CB5] to-[#1E3A8A] text-white p-6 sm:p-8 rounded-2xl shadow-lg border border-blue-400/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-semibold backdrop-blur-md">
              <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
              <span>Vignan Academic Doubt Clearance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Student Doubt Session
            </h1>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Ask your subject-specific conceptual doubts directly to your designated faculty members. Answers submitted by faculty in their portal are displayed here instantly.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 text-center min-w-[110px]">
              <div className="text-2xl font-black text-emerald-300">{answeredCount}</div>
              <div className="text-xs text-blue-100 font-medium">Answered</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 text-center min-w-[110px]">
              <div className="text-2xl font-black text-amber-300">{pendingCount}</div>
              <div className="text-xs text-blue-100 font-medium">Under Review</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Ask Doubt Form (Left) & Doubts Feed (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Ask Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 pb-4 mb-5 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1264E8] flex items-center justify-center font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Ask a Question</h2>
                <p className="text-xs text-gray-500">Sent directly to faculty portal for resolution</p>
              </div>
            </div>

            {successMsg && (
              <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p>{successMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmitDoubt} className="space-y-4">
              {/* Select Faculty */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Select Faculty Member
                </label>
                <select
                  value={facultyName}
                  onChange={handleFacultyChange}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1264E8]"
                >
                  {facultyOptions.map((f, idx) => (
                    <option key={idx} value={f.name}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={handleSubjectChange}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1264E8]"
                >
                  {subjects.map((sub, idx) => (
                    <option key={idx} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              {/* Topic */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Topic / Concept Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AVL Tree Double Rotation, Bellman-Ford..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1264E8]"
                />
              </div>

              {/* Question */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Detailed Doubt / Question
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Explain clearly what step or concept you are stuck on..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1264E8]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 bg-[#1264E8] hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending Doubt...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Post Doubt to Faculty</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Guidelines Note */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 text-xs text-blue-900 flex items-start gap-3">
            <Info className="w-4 h-4 text-[#1264E8] flex-shrink-0 mt-0.5" />
            <p>
              Faculty members review doubts submitted through this portal during designated office hours and live remedial sessions. Check the answered tab for step-by-step solutions.
            </p>
          </div>
        </div>

        {/* Right: Doubts List */}
        <div className="lg:col-span-7 space-y-5">
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Filter Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-xl gap-1 text-xs font-semibold">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeFilter === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                All Doubts ({doubts.length})
              </button>
              <button
                onClick={() => setActiveFilter("answered")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeFilter === "answered" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Answered ({answeredCount})
              </button>
              <button
                onClick={() => setActiveFilter("pending")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeFilter === "pending" ? "bg-white text-amber-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Pending ({pendingCount})
              </button>
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search doubts or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1264E8]"
              />
            </div>
          </div>

          {/* Doubts Feed */}
          {loading ? (
            <div className="py-16 text-center text-gray-400 space-y-3 bg-white rounded-2xl border border-gray-200">
              <div className="w-8 h-8 border-2 border-[#1264E8] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm">Loading questions and faculty answers...</p>
            </div>
          ) : filteredDoubts.length === 0 ? (
            <div className="py-16 text-center text-gray-400 space-y-3 bg-white rounded-2xl border border-gray-200 p-8">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-gray-700">No Doubts Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                {activeFilter === "answered"
                  ? "No doubts have been answered yet in this filter."
                  : activeFilter === "pending"
                  ? "No pending doubts at this time."
                  : "Submit your first conceptual doubt using the form on the left!"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDoubts.map((doubt) => {
                const isAnswered = doubt.status === "Answered";

                return (
                  <div
                    key={doubt.id}
                    className={`bg-white rounded-2xl p-5 shadow-sm border transition-all ${
                      isAnswered ? "border-emerald-200/80 hover:border-emerald-400" : "border-amber-200/80 hover:border-amber-400"
                    }`}
                  >
                    {/* Doubt Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">
                            {doubt.subject}
                          </span>
                          <span className="text-xs text-gray-500">
                            • Assigned to: <strong className="text-gray-700">{doubt.facultyName}</strong>
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-gray-900">{doubt.topic}</h3>
                      </div>

                      {/* Status Pill */}
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 flex-shrink-0 ${
                          isAnswered
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {isAnswered ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Faculty Answered</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                            <span>Awaiting Faculty</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Student's Question */}
                    <div className="bg-gray-50/80 rounded-xl p-3.5 text-sm text-gray-700 mb-3 border border-gray-100">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{doubt.studentName} ({doubt.studentIdentifier || "Student"})</span>
                      </div>
                      <p className="whitespace-pre-line leading-relaxed">{doubt.question}</p>
                    </div>

                    {/* Faculty Answer Section */}
                    {isAnswered ? (
                      <div className="mt-4 bg-gradient-to-br from-emerald-50/80 to-green-50/40 border border-emerald-200 rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between text-xs border-b border-emerald-200/60 pb-2">
                          <div className="flex items-center gap-2 text-emerald-900 font-bold">
                            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                              ✓
                            </span>
                            <span>Answer from {doubt.answeredBy || doubt.facultyName}</span>
                          </div>
                          {doubt.answeredAt && (
                            <span className="text-[11px] text-emerald-700">
                              {new Date(doubt.answeredAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-emerald-950 whitespace-pre-line leading-relaxed pt-1 font-normal">
                          {doubt.answer}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-3 bg-amber-50/50 border border-amber-200/60 rounded-xl p-3 text-xs text-amber-800 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span>
                          Pending response from <strong>{doubt.facultyName}</strong>. Once submitted in their faculty portal, the explanation will display here.
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
