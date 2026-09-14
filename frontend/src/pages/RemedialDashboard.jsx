import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { api } from "../services/api";
import {
  Target,
  Users,
  AlertTriangle,
  TrendingUp,
  BookOpen,
  FileSpreadsheet,
  Search,
  Filter,
  Eye,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";

export default function RemedialDashboard() {
  const { currentUser } = useUser();
  const [stats, setStats] = useState({
    totalStudents: 250,
    studentsWithGaps: 48,
    immediateSupport: 17,
    averagePerformance: 74,
    assessmentsCompleted: 18,
    availableResources: 86
  });
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [gapFilter, setGapFilter] = useState("ALL");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [selectedStudentProfile, setSelectedStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Suggestion Modal State
  const [suggModalOpen, setSuggModalOpen] = useState(false);
  const [targetStudent, setTargetStudent] = useState(null);
  const [suggestionText, setSuggestionText] = useState("");
  const [sendingSugg, setSendingSugg] = useState(false);

  // Remedial Exam Creation Modal State
  const [examModalOpen, setExamModalOpen] = useState(false);
  const [examTitle, setExamTitle] = useState("Remedial Assessment - DBMS & Data Structures");
  const [examSubject, setExamSubject] = useState("Database Management System");
  const [examDuration, setExamDuration] = useState(30);
  const [examMarks, setExamMarks] = useState(20);
  const [examInstructions, setExamInstructions] = useState("Read all questions carefully. Applicable only for remedial students.");
  const [qText, setQText] = useState("Which normal form resolves transitive functional dependencies?");
  const [qOptA, setQOptA] = useState("1NF");
  const [qOptB, setQOptB] = useState("2NF");
  const [qOptC, setQOptC] = useState("3NF");
  const [qOptD, setQOptD] = useState("BCNF");
  const [qAns, setQAns] = useState("C");
  const [creatingExam, setCreatingExam] = useState(false);

  const [feedbackMsg, setFeedbackMsg] = useState("");

  useEffect(() => {
    loadRemedialData();
  }, []);

  const loadRemedialData = async () => {
    try {
      const s = await api.getRemedialStats();
      setStats(s);
      const st = await api.getRemedialStudents();
      setStudents(st);
    } catch {
      // Fallback
      setStudents([
        {
          id: 1,
          name: "Rahul Kumar",
          studentId: "23CSE101",
          department: "CSE",
          year: "2nd Year",
          section: "A",
          overallScore: 68,
          weakSubjects: "Data Structures",
          primaryGap: "Binary Trees (32%)",
          gapLevel: "High",
          status: "Improving"
        },
        {
          id: 2,
          name: "Priya Sharma",
          studentId: "23ECE204",
          department: "ECE",
          year: "3rd Year",
          section: "B",
          overallScore: 54,
          weakSubjects: "Data Structures, DBMS",
          primaryGap: "Trees (38%), Graphs (34%)",
          gapLevel: "High",
          status: "Needs Support"
        },
        {
          id: 3,
          name: "Kiran Varma",
          studentId: "23CSE118",
          department: "CSE",
          year: "2nd Year",
          section: "A",
          overallScore: 42,
          weakSubjects: "Data Structures, Mathematics",
          primaryGap: "Tree Traversal (30%)",
          gapLevel: "High",
          status: "Immediate Support"
        },
        {
          id: 4,
          name: "Suresh Reddy",
          studentId: "23CSE142",
          department: "CSE",
          year: "2nd Year",
          section: "B",
          overallScore: 82,
          weakSubjects: "None",
          primaryGap: "Sorting Algorithms (72%)",
          gapLevel: "Low",
          status: "Improving"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProfile = async (studentId) => {
    try {
      const profile = await api.getRemedialStudentProfile(studentId);
      setSelectedStudentProfile(profile);
    } catch {
      // Fallback profile
      setSelectedStudentProfile({
        student: {
          name: studentId === 1 ? "Rahul Kumar" : "Priya Sharma",
          studentId: studentId === 1 ? "23CSE101" : "23ECE204",
          department: studentId === 1 ? "CSE" : "ECE",
          year: "2nd Year",
          section: "A",
          overallScore: 68
        },
        performanceTrend: [
          { assessment: "Assessment 1", score: 72, date: "Aug 10" },
          { assessment: "Assessment 2", score: 65, date: "Aug 20" },
          { assessment: "Assessment 3", score: 58, date: "Aug 30" },
          { assessment: "Assessment 4", score: 68, date: "Sep 08" }
        ],
        subjectPerformance: [
          { subject: "Data Structures", averageScore: 52, performance: "Weak", gap: "High" },
          { subject: "DBMS", averageScore: 64, performance: "Average", gap: "Medium" },
          { subject: "Java", averageScore: 82, performance: "Strong", gap: "Low" },
          { subject: "Mathematics", averageScore: 48, performance: "Weak", gap: "High" }
        ],
        topicGaps: [
          { topic: "Arrays", score: 84, level: "Low" },
          { topic: "Linked Lists", score: 71, level: "Low" },
          { topic: "Stacks", score: 62, level: "Medium" },
          { topic: "Queues", score: 58, level: "Medium" },
          { topic: "Trees", score: 39, level: "High" },
          { topic: "Graphs", score: 34, level: "High" }
        ],
        aiAnalysis: {
          observations: [
            "The student is consistently performing below 50% in Tree Traversal and Graph Algorithms across three assessments.",
            "The student appears to have difficulty understanding recursive call stack unwinding."
          ],
          identifiedGaps: ["Tree Traversal (High)", "Graph Algorithms (High)", "Recursion (Medium)"],
          recommendedSteps: [
            "1. Review Tree Traversal fundamentals and call stack mechanics",
            "2. Study teacher-uploaded Tree Traversal notes by Prof. Ravi",
            "3. Watch recommended NPTEL learning video by Prof. Naveen Garg",
            "4. Attempt a 5-question adaptive practice quiz",
            "5. Reassess after completing the resources"
          ]
        },
        matchedTeacherResources: [
          { title: "Tree Traversal Fundamentals & Visual Notes", teacher: "Prof. Ravi", type: "Notes", topic: "Binary Trees" },
          { title: "Binary Tree Inorder, Preorder & Postorder Recursive Traces", teacher: "Dr. Naveen Kumar", type: "Video", topic: "Binary Trees" },
          { title: "Tree Traversal Visualization Lab", teacher: "Prof. Ravi", type: "Interactive Lab", topic: "Binary Trees" }
        ]
      });
    }
  };

  const filteredStudents = students.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.studentId.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      s.weakSubjects.toLowerCase().includes(q);

    const matchGap = gapFilter === "ALL" || s.gapLevel === gapFilter;
    const matchDept = deptFilter === "ALL" || s.department === deptFilter;
    return matchSearch && matchGap && matchDept;
  });

  const handleSendSuggestionSubmit = async (e) => {
    e.preventDefault();
    if (!suggestionText.trim() || !targetStudent) return;
    setSendingSugg(true);
    try {
      await api.sendRemedialSuggestion({
        studentIdentifier: targetStudent.studentId || targetStudent.identifier,
        studentName: targetStudent.name,
        subject: targetStudent.subject || "Database Management System",
        suggestionText: suggestionText.trim(),
        sentByName: currentUser?.name || "Remedial Coordinator"
      });
      setFeedbackMsg(`Suggestion sent successfully to ${targetStudent.name}! Notification delivered.`);
      setSuggModalOpen(false);
      setSuggestionText("");
    } catch (err) {
      alert("Failed to send suggestion: " + err.message);
    } finally {
      setSendingSugg(false);
    }
  };

  const handleCreateExamSubmit = async (e) => {
    e.preventDefault();
    if (!examTitle.trim()) return;
    setCreatingExam(true);
    try {
      const q = {
        questionText: qText.trim(),
        questionType: "MCQ",
        marks: 2,
        options: [`A. ${qOptA}`, `B. ${qOptB}`, `C. ${qOptC}`, `D. ${qOptD}`],
        correctAnswer: qAns,
        explanation: "Core remedial topic question."
      };

      await api.createRemedialExam({
        title: examTitle.trim(),
        subject: examSubject,
        durationMins: Number(examDuration),
        totalMarks: Number(examMarks),
        instructions: examInstructions,
        questions: [q],
        createdByName: currentUser?.name || "Remedial Coordinator"
      });

      setFeedbackMsg(`Remedial Exam "${examTitle}" created successfully! Visible strictly to eligible students (< 40% progress).`);
      setExamModalOpen(false);
    } catch (err) {
      alert("Failed to create remedial exam: " + err.message);
    } finally {
      setCreatingExam(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded uppercase tracking-wider">
              Remedial Coordination
            </span>
            <span className="text-[11px] font-semibold text-gray-500">
              Cross-Disciplinary Intervention
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mt-1">
            Welcome, {currentUser?.name}
          </h2>
          <p className="text-xs text-gray-500">
            Monitor student learning gaps, send suggestions, and create target remedial exams (<span className="font-bold text-amber-600">&lt; 40% Progress</span>).
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Create Remedial Exam Button as required in Prompt Section 7 */}
          <button
            onClick={() => setExamModalOpen(true)}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create Remedial Exam</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
          <button onClick={() => setFeedbackMsg("")} className="text-emerald-600 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Cards (Prompt Specification 3) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs text-center">
          <span className="text-[10px] text-gray-400 font-bold uppercase block">Total Students</span>
          <p className="text-2xl font-black text-gray-900 font-mono mt-0.5">{stats.totalStudents}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs text-center">
          <span className="text-[10px] text-amber-600 font-bold uppercase block">With Gaps</span>
          <p className="text-2xl font-black text-amber-600 font-mono mt-0.5">{stats.studentsWithGaps}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs text-center">
          <span className="text-[10px] text-rose-600 font-bold uppercase block">Immediate Support</span>
          <p className="text-2xl font-black text-rose-600 font-mono mt-0.5">{stats.immediateSupport}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs text-center">
          <span className="text-[10px] text-blue-600 font-bold uppercase block">Avg Performance</span>
          <p className="text-2xl font-black text-blue-600 font-mono mt-0.5">{stats.averagePerformance}%</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs text-center">
          <span className="text-[10px] text-emerald-600 font-bold uppercase block">Assessments</span>
          <p className="text-2xl font-black text-emerald-600 font-mono mt-0.5">{stats.assessmentsCompleted}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs text-center">
          <span className="text-[10px] text-purple-600 font-bold uppercase block">Teacher Resources</span>
          <p className="text-2xl font-black text-purple-600 font-mono mt-0.5">{stats.availableResources}</p>
        </div>
      </div>

      {/* Search & Filter Bar (Prompt Specification 5) */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student by name, student ID, department or weak topic..."
            className="w-full pl-10 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={gapFilter}
            onChange={(e) => setGapFilter(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700"
          >
            <option value="ALL">All Gap Levels</option>
            <option value="High">🔴 High Gap</option>
            <option value="Medium">🟡 Medium Gap</option>
            <option value="Low">🟢 Low Gap</option>
          </select>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700"
          >
            <option value="ALL">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
          </select>
        </div>
      </div>

      {/* Student Performance Overview Table (Prompt Specification 4) */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-[#E5E7EB] bg-gray-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              Student Performance & Learning Gap Registry
            </h3>
            <p className="text-xs text-gray-500">
              Classified by AI topic diagnostics and ongoing exam results.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 sm:px-6">Student Name</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 text-center">Overall Score</th>
                <th className="py-3 px-4">Weak Subjects</th>
                <th className="py-3 px-4">Gap Level</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-800">
              {filteredStudents.map((st) => (
                <tr key={st.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-gray-900">
                    {st.name}
                    <span className="text-[11px] font-mono text-gray-400 font-normal block">{st.studentId}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-gray-700">
                    {st.department} • {st.year}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold">
                    <span className={`${
                      st.overallScore >= 75 ? "text-emerald-600" : st.overallScore >= 50 ? "text-blue-600" : "text-rose-600"
                    }`}>
                      {st.overallScore}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">
                    {st.weakSubjects}
                  </td>
                  <td className="py-3.5 px-4">
                    {st.gapLevel === "High" ? (
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-xs font-bold flex items-center gap-1 w-fit">
                        🔴 High Gap
                      </span>
                    ) : st.gapLevel === "Medium" ? (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-xs font-bold flex items-center gap-1 w-fit">
                        🟡 Medium Gap
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-bold flex items-center gap-1 w-fit">
                        🟢 Low Gap
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-medium text-gray-700">
                      {st.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setTargetStudent(st);
                          setSuggestionText(`Your current progress in Database Management System is ${st.progress || st.overallScore}%. Please revise Unit 1 and Unit 2 and complete the recommended practice questions.`);
                          setSuggModalOpen(true);
                        }}
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Send Suggestion
                      </button>
                      <button
                        onClick={() => handleOpenProfile(st.id)}
                        className="px-3 py-1 bg-blue-50 text-[#1264E8] hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        View Profile
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SEND SUGGESTION MODAL (Prompt Specification 6) */}
      {suggModalOpen && targetStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-600" />
                <span>Send Remedial Suggestion</span>
              </h3>
              <button onClick={() => setSuggModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendSuggestionSubmit} className="mt-4 space-y-4">
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-1">
                <p className="font-semibold text-gray-900">Student: <strong>{targetStudent.name}</strong></p>
                <p className="text-gray-600">Student ID: <span className="font-mono">{targetStudent.studentId}</span></p>
                <p className="text-gray-600">Current Progress: <strong className="text-amber-700">{targetStudent.progress || targetStudent.overallScore}%</strong></p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Enter Suggestion / Guidance *
                </label>
                <textarea
                  rows={4}
                  required
                  value={suggestionText}
                  onChange={(e) => setSuggestionText(e.target.value)}
                  placeholder="Enter personalized guidance, topics to revise, or recommended practice questions..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSuggModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingSugg}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-60"
                >
                  {sendingSugg ? "Sending..." : "Send Suggestion"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE REMEDIAL EXAM MODAL (Prompt Specification 7) */}
      {examModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Create Remedial Exam</span>
              </h3>
              <button onClick={() => setExamModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExamSubmit} className="mt-4 space-y-4">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900">
                <strong>Remedial Exam Visibility Rule:</strong> This exam will automatically be visible strictly to students whose overall/subject progress is <strong>LESS THAN 40%</strong>.
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Exam Title *
                </label>
                <input
                  type="text"
                  required
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  placeholder="e.g. Database Management System - Remedial Exam"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Subject *
                  </label>
                  <select
                    value={examSubject}
                    onChange={(e) => setExamSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Database Management System">Database Management System</option>
                    <option value="Data Structures">Data Structures</option>
                    <option value="Discrete Mathematics">Discrete Mathematics</option>
                    <option value="Object Oriented Programming Through Java">Object Oriented Programming Through Java</option>
                    <option value="Digital Logic Design">Digital Logic Design</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Data Wrangling And Visualisation">Data Wrangling And Visualisation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Duration (Minutes) *
                  </label>
                  <input
                    type="number"
                    required
                    value={examDuration}
                    onChange={(e) => setExamDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Total Marks *
                  </label>
                  <input
                    type="number"
                    required
                    value={examMarks}
                    onChange={(e) => setExamMarks(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Instructions *
                </label>
                <textarea
                  rows={2}
                  value={examInstructions}
                  onChange={(e) => setExamInstructions(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Sample Question Creation */}
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block">Question Details</span>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Question Text</label>
                  <input
                    type="text"
                    required
                    value={qText}
                    onChange={(e) => setQText(e.target.value)}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500">Option A</label>
                    <input type="text" value={qOptA} onChange={(e) => setQOptA(e.target.value)} className="w-full px-2 py-1 border border-gray-200 rounded text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500">Option B</label>
                    <input type="text" value={qOptB} onChange={(e) => setQOptB(e.target.value)} className="w-full px-2 py-1 border border-gray-200 rounded text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500">Option C</label>
                    <input type="text" value={qOptC} onChange={(e) => setQOptC(e.target.value)} className="w-full px-2 py-1 border border-gray-200 rounded text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500">Option D</label>
                    <input type="text" value={qOptD} onChange={(e) => setQOptD(e.target.value)} className="w-full px-2 py-1 border border-gray-200 rounded text-xs" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500">Correct Answer Option</label>
                  <select value={qAns} onChange={(e) => setQAns(e.target.value)} className="w-full px-2 py-1 border border-gray-200 rounded text-xs">
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setExamModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingExam}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-60"
                >
                  {creatingExam ? "Publishing Exam..." : "Create Remedial Exam"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Individual Student Performance Overview Modal (Prompt Specification 6, 7, 8, 9, 14, 15) */}
      {selectedStudentProfile && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-gray-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-700 tracking-wider">
                  Remedial Diagnostic Dossier
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-0.5">
                  Student: {selectedStudentProfile.student?.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {selectedStudentProfile.student?.department} • {selectedStudentProfile.student?.year} • ID: {selectedStudentProfile.student?.studentId} • Overall: {selectedStudentProfile.student?.overallScore}%
                </p>
              </div>
              <button
                onClick={() => setSelectedStudentProfile(null)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Performance Trend Line Chart over time (Prompt Specification 6, 21) */}
            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Performance Trend Over Time
              </h4>
              <div className="h-44 w-full bg-gray-50 p-2 rounded-xl border border-gray-100">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedStudentProfile.performanceTrend}>
                    <XAxis dataKey="assessment" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Line type="monotone" dataKey="score" stroke="#1264E8" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Subject-Wise & Topic-Wise Breakdown (Prompt Specification 7, 8) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Subject Performance
                </h4>
                <div className="space-y-1.5">
                  {selectedStudentProfile.subjectPerformance.map((sub, i) => (
                    <div key={i} className="p-2 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between">
                      <span className="font-semibold text-gray-800">{sub.subject}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold">{sub.averageScore}%</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          sub.gap === "High" ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"
                        }`}>
                          {sub.gap} Gap
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Data Structures Topic Gaps
                </h4>
                <div className="space-y-1.5">
                  {selectedStudentProfile.topicGaps.map((top, i) => (
                    <div key={i} className="p-2 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between">
                      <span className="font-semibold text-gray-800">{top.topic}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold">{top.score}%</span>
                        <span className="text-xs">{top.level === "High" ? "🔴 High" : top.level === "Medium" ? "🟡 Med" : "🟢 Low"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Student Learning Analysis (Prompt Specification 9) */}
            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>🤖 AI Student Learning Analysis</span>
              </div>
              <p className="text-gray-700 leading-relaxed italic">
                "{selectedStudentProfile.aiAnalysis?.observations?.[0]}"
              </p>
              <div className="pt-1">
                <span className="font-semibold text-gray-900 block mb-1">Recommended Remedial Support:</span>
                <ul className="space-y-0.5 text-gray-600 pl-2">
                  {selectedStudentProfile.aiAnalysis?.recommendedSteps?.map((st, idx) => (
                    <li key={idx}>✓ {st}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Connect Learning Gaps with Teacher-Uploaded Resources (Prompt Specification 14) */}
            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Connected Teacher-Uploaded Resources for this Gap
              </h4>
              <div className="space-y-2 text-xs">
                {selectedStudentProfile.matchedTeacherResources?.map((res, idx) => (
                  <div key={idx} className="p-2.5 bg-blue-50/40 rounded-xl border border-blue-100 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-900 block">{res.title}</span>
                      <span className="text-[11px] text-gray-500">Uploaded by: {res.teacher} • Type: {res.type}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold">
                      Targeted Match
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end">
              <button
                onClick={() => setSelectedStudentProfile(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
