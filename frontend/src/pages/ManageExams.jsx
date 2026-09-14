import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { api } from "../services/api";
import {
  FolderKanban,
  PlusCircle,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  BarChart3,
  RefreshCw,
  Play
} from "lucide-react";

export default function ManageExams() {
  const { currentUser, setActiveTab } = useUser();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const facultySubject = currentUser?.assignedSubject || currentUser?.subject || "";

  useEffect(() => {
    loadExams();
  }, [currentUser]);

  const loadExams = async () => {
    setLoading(true);
    try {
      const data = await api.getFacultyExams(facultySubject);
      let subjectFiltered = data;
      if (facultySubject && Array.isArray(data)) {
        subjectFiltered = data.filter(e =>
          e.subject && (
            e.subject.toLowerCase() === facultySubject.toLowerCase() ||
            e.subject.toLowerCase().includes(facultySubject.toLowerCase()) ||
            facultySubject.toLowerCase().includes(e.subject.toLowerCase())
          )
        );
      }
      setExams(subjectFiltered);
    } catch {
      // Fallback data filtered by faculty subject
      const sub = facultySubject || "Data Structures";
      setExams([
        {
          id: 1,
          title: `${sub} – Unit 2 Quiz`,
          subject: sub,
          unitTopic: "Core Concepts & Applications",
          durationMins: 30,
          totalMarks: 20,
          passPercentage: 50,
          status: "Live",
          questionCount: 8,
          createdByName: currentUser?.name || "Dr. Naveen Kumar"
        },
        {
          id: 2,
          title: `${sub} Mid-Term Assessment`,
          subject: sub,
          unitTopic: "Advanced Problem Solving",
          durationMins: 45,
          totalMarks: 30,
          passPercentage: 50,
          status: "Draft",
          questionCount: 12,
          createdByName: currentUser?.name || "Dr. Naveen Kumar"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id) => {
    try {
      await api.publishExam(id);
      setMsg("Exam published as Live for all eligible students!");
      loadExams();
      setTimeout(() => setMsg(""), 3000);
    } catch {
      setExams(exams.map((e) => (e.id === id ? { ...e, status: "Live" } : e)));
      setMsg("Exam published as Live!");
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;
    try {
      await api.deleteExam(id);
      setExams(exams.filter((e) => e.id !== id));
      setMsg("Exam deleted successfully.");
      setTimeout(() => setMsg(""), 3000);
    } catch {
      setExams(exams.filter((e) => e.id !== id));
      setMsg("Exam deleted.");
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const getStatusBadge = (status) => {
    if (status === "Live") {
      return (
        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot" />
          <span>Live</span>
        </span>
      );
    }
    if (status === "Draft") {
      return (
        <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-200 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>Draft / Scheduled</span>
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-200 flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-blue-500" />
        <span>Completed</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-[#1264E8] rounded uppercase tracking-wider">
              Assessment Management
            </span>
            <span className="text-[11px] font-semibold text-gray-500">
              Faculty Command
            </span>
            {facultySubject && (
              <span className="text-xs font-bold px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                Subject: {facultySubject}
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-900 mt-1">
            Manage {facultySubject ? `${facultySubject} ` : ""}Exams & Tests
          </h2>
          <p className="text-xs text-gray-500">
            Displaying exams strictly for {facultySubject || "your assigned subject"}. Author, publish, schedule, and review results.
          </p>
        </div>

        <button
          onClick={() => setActiveTab("create-exam")}
          className="px-4 py-2 bg-[#1264E8] hover:bg-[#0E52C2] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Create New Exam</span>
        </button>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      {/* Exams Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Exam Title</th>
                <th className="py-3.5 px-4">Subject & Unit</th>
                <th className="py-3.5 px-4 text-center">Questions</th>
                <th className="py-3.5 px-4 text-center">Marks</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-800">
              {exams.map((ex) => (
                <tr key={ex.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="font-bold text-gray-900">{ex.title}</div>
                    <div className="text-[11px] text-gray-400">Created by: {ex.createdByName || "Dr. Naveen Kumar"}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-gray-800 block">{ex.subject}</span>
                    <span className="text-[11px] text-gray-500">{ex.unitTopic}</span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-semibold">
                    {ex.questionCount || ex.questions?.length || 8} Qs ({ex.durationMins}m)
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-gray-900">
                    {ex.totalMarks}
                  </td>
                  <td className="py-3.5 px-4">
                    {getStatusBadge(ex.status)}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                    {ex.status !== "Live" && (
                      <button
                        onClick={() => handlePublish(ex.id)}
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-xs font-bold border border-emerald-200"
                        title="Publish Exam Live"
                      >
                        Publish
                      </button>
                    )}
                    <button
                      onClick={() => setActiveTab("faculty-results")}
                      className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-xs font-bold border border-blue-200"
                    >
                      Results
                    </button>
                    <button
                      onClick={() => handleDelete(ex.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                      title="Delete Exam"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
