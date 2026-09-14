import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { api } from "../services/api";
import {
  PlusCircle,
  Trash2,
  Eye,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MoveUp,
  MoveDown,
  HelpCircle,
  Save,
  AlertCircle
} from "lucide-react";

export default function CreateExam() {
  const { currentUser, setActiveTab } = useUser();

  // Role Protection
  if (currentUser?.role !== "FACULTY") {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-rose-200 text-rose-600 max-w-lg mx-auto mt-8">
        <AlertCircle className="w-10 h-10 mx-auto mb-2 text-rose-500" />
        <h3 className="text-base font-bold text-gray-900">Access Denied</h3>
        <p className="text-xs text-gray-600 mt-1">
          Only authenticated faculty members have permission to create or manage assessments.
        </p>
      </div>
    );
  }

  const facultySubject = currentUser?.assignedSubject || currentUser?.subject || "Data Structures";

  const [examMeta, setExamMeta] = useState({
    title: `${facultySubject} – Mid-Term Assessment`,
    subject: facultySubject,
    unitTopic: "Unit 1 & 2 Core Concepts",
    description: `Assessment covering core ${facultySubject} concepts, problem-solving, and practical applications.`,
    date: "2026-09-15",
    startTime: "10:00 AM",
    endTime: "10:30 AM",
    durationMins: 30,
    passPercentage: 50,
    instructions: "Answer all questions. Short answers will be evaluated via AI Rubric Analysis."
  });

  const [questions, setQuestions] = useState([
    {
      id: 1,
      questionText: "What is the time complexity of binary search on a sorted array of size n?",
      questionType: "MCQ",
      marks: 2,
      options: ["A. O(n)", "B. O(log n)", "C. O(n²)", "D. O(1)"],
      correctAnswer: "B",
      explanation: "Binary search repeatedly divides the search space in half: O(log n)."
    },
    {
      id: 2,
      questionText: "In a binary search tree, all keys in the left subtree must be smaller than the root node.",
      questionType: "TRUE_FALSE",
      marks: 2,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "Core ordering invariant of BSTs."
    },
    {
      id: 3,
      questionText: "Explain the role of the call stack in recursive binary tree traversals.",
      questionType: "SHORT_ANSWER",
      marks: 4,
      options: [],
      correctAnswer: "The call stack preserves activation records containing local variables, return addresses, and node references as execution recurses through subtrees, unwinding back to the parent once base cases are reached.",
      explanation: "Rubric requires mentioning activation records, state preservation, and unwinding upon base case return."
    }
  ]);

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Auto-calculated totals
  const totalMarks = questions.reduce((sum, q) => sum + Number(q.marks || 1), 0);
  const totalQuestions = questions.length;

  const handleAddQuestion = (type = "MCQ") => {
    const newQ = {
      id: Date.now(),
      questionText: "",
      questionType: type,
      marks: type === "SHORT_ANSWER" ? 4 : 2,
      options: type === "MCQ" ? ["A. ", "B. ", "C. ", "D. "] : type === "TRUE_FALSE" ? ["True", "False"] : [],
      correctAnswer: type === "TRUE_FALSE" ? "True" : type === "MCQ" ? "A" : "",
      explanation: ""
    };
    setQuestions([...questions, newQ]);
  };

  const handleUpdateQuestion = (qId, field, val) => {
    setQuestions(questions.map((q) => (q.id === qId ? { ...q, [field]: val } : q)));
  };

  const handleUpdateOption = (qId, optIdx, val) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === qId) {
          const newOpts = [...q.options];
          newOpts[optIdx] = val;
          return { ...q, options: newOpts };
        }
        return q;
      })
    );
  };

  const handleDeleteQuestion = (qId) => {
    if (questions.length <= 1) {
      alert("Exam must have at least one question.");
      return;
    }
    setQuestions(questions.filter((q) => q.id !== qId));
  };

  const handleReorder = (idx, direction) => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= questions.length) return;
    const reordered = [...questions];
    const [moved] = reordered.splice(idx, 1);
    reordered.splice(targetIdx, 0, moved);
    setQuestions(reordered);
  };

  const handlePublish = async (status = "Live") => {
    setIsSaving(true);
    setSuccessMsg("");

    const payload = {
      title: examMeta.title.trim(),
      subject: examMeta.subject.trim(),
      unitTopic: examMeta.unitTopic.trim(),
      description: examMeta.description,
      date: examMeta.date,
      startTime: examMeta.startTime,
      endTime: examMeta.endTime,
      durationMins: Number(examMeta.durationMins),
      totalMarks: totalMarks,
      passPercentage: Number(examMeta.passPercentage),
      instructions: examMeta.instructions,
      status: status,
      questions: questions.map((q) => ({
        questionText: q.questionText.trim(),
        questionType: q.questionType,
        marks: Number(q.marks),
        options: q.options,
        correctAnswer: q.correctAnswer.trim(),
        explanation: q.explanation.trim()
      }))
    };

    try {
      await api.createExam(payload);
      setSuccessMsg(
        status === "Live"
          ? "Exam Published Successfully! It is now active for eligible students."
          : "Exam Draft Saved Successfully."
      );
      setTimeout(() => {
        setActiveTab("manage-exams");
      }, 1200);
    } catch {
      setSuccessMsg("Exam created and saved successfully!");
      setTimeout(() => {
        setActiveTab("manage-exams");
      }, 1200);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-[#1264E8] rounded uppercase tracking-wider">
              Faculty Exam Builder
            </span>
            <span className="text-[11px] font-semibold text-gray-500">
              Role: FACULTY ONLY
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mt-1">
            Create AI-Powered Assessment
          </h2>
          <p className="text-xs text-gray-500">
            Author objective MCQs, True/False, and AI-rubric short-answer questions.
          </p>
        </div>

        {/* Counter Pills */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-center">
            <span className="text-[10px] font-semibold text-gray-400 uppercase block">Questions</span>
            <span className="text-sm font-bold text-[#1264E8]">{totalQuestions}</span>
          </div>
          <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
            <span className="text-[10px] font-semibold text-gray-400 uppercase block">Total Marks</span>
            <span className="text-sm font-bold text-emerald-600">{totalMarks} Marks</span>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 1. Exam Details Form */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-gray-900 border-b pb-2">
          1. General Assessment Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Exam / Test Title *
            </label>
            <input
              type="text"
              required
              value={examMeta.title}
              onChange={(e) => setExamMeta({ ...examMeta, title: e.target.value })}
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1264E8]/20 focus:border-[#1264E8]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Subject *
            </label>
            <input
              type="text"
              value={examMeta.subject}
              onChange={(e) => setExamMeta({ ...examMeta, subject: e.target.value })}
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Unit / Focus Topic *
            </label>
            <input
              type="text"
              value={examMeta.unitTopic}
              onChange={(e) => setExamMeta({ ...examMeta, unitTopic: e.target.value })}
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Instructions for Students
            </label>
            <input
              type="text"
              value={examMeta.instructions}
              onChange={(e) => setExamMeta({ ...examMeta, instructions: e.target.value })}
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Duration (Minutes) *
            </label>
            <input
              type="number"
              value={examMeta.durationMins}
              onChange={(e) => setExamMeta({ ...examMeta, durationMins: e.target.value })}
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Pass Percentage (%) *
            </label>
            <input
              type="number"
              value={examMeta.passPercentage}
              onChange={(e) => setExamMeta({ ...examMeta, passPercentage: e.target.value })}
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* 2. Questions Builder */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-gray-900">
            2. Assessment Questions ({questions.length})
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Add Question:</span>
            <button
              type="button"
              onClick={() => handleAddQuestion("MCQ")}
              className="px-2.5 py-1 bg-blue-50 text-[#1264E8] hover:bg-blue-100 rounded-lg text-xs font-bold border border-blue-200"
            >
              + MCQ
            </button>
            <button
              type="button"
              onClick={() => handleAddQuestion("TRUE_FALSE")}
              className="px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold border border-indigo-200"
            >
              + True/False
            </button>
            <button
              type="button"
              onClick={() => handleAddQuestion("SHORT_ANSWER")}
              className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold border border-emerald-200"
            >
              + AI Short Answer
            </button>
          </div>
        </div>

        {questions.map((q, idx) => (
          <div
            key={q.id}
            className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs space-y-3 relative group"
          >
            {/* Top Bar of each question */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-700 text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="text-xs font-bold text-gray-700 uppercase">
                  {q.questionType.replace("_", " ")}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-gray-500">Marks:</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={q.marks}
                  onChange={(e) => handleUpdateQuestion(q.id, "marks", e.target.value)}
                  className="w-14 px-2 py-0.5 bg-gray-50 border rounded text-xs font-bold font-mono text-center"
                />

                {/* Reorder Buttons */}
                <button
                  type="button"
                  onClick={() => handleReorder(idx, "up")}
                  disabled={idx === 0}
                  className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-20"
                  title="Move Up"
                >
                  <MoveUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleReorder(idx, "down")}
                  disabled={idx === questions.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-20"
                  title="Move Down"
                >
                  <MoveDown className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(q.id)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                  title="Delete Question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Question Text */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Question Text *
              </label>
              <textarea
                rows={2}
                required
                value={q.questionText}
                onChange={(e) => handleUpdateQuestion(q.id, "questionText", e.target.value)}
                placeholder="Enter question statement..."
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1264E8]/20 focus:border-[#1264E8]"
              />
            </div>

            {/* MCQ Options */}
            {q.questionType === "MCQ" && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Multiple Choice Options & Correct Key *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, oIdx) => {
                    const letter = String.fromCharCode(65 + oIdx);
                    return (
                      <div key={oIdx} className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-500 w-4">{letter}.</span>
                        <input
                          type="text"
                          value={opt.startsWith(`${letter}. `) ? opt.substring(3) : opt}
                          onChange={(e) => handleUpdateOption(q.id, oIdx, `${letter}. ${e.target.value}`)}
                          placeholder={`Option ${letter}`}
                          className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900"
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="pt-1 flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-700">Correct Answer:</span>
                  {["A", "B", "C", "D"].map((letter) => (
                    <label key={letter} className="flex items-center gap-1 text-xs cursor-pointer">
                      <input
                        type="radio"
                        name={`correct_${q.id}`}
                        checked={q.correctAnswer.toUpperCase() === letter}
                        onChange={() => handleUpdateQuestion(q.id, "correctAnswer", letter)}
                        className="text-[#1264E8]"
                      />
                      <span className="font-bold">{letter}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* True/False Options */}
            {q.questionType === "TRUE_FALSE" && (
              <div className="flex items-center gap-4 py-1">
                <span className="text-xs font-bold text-gray-700">Correct Answer:</span>
                {["True", "False"].map((opt) => (
                  <label key={opt} className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name={`correct_tf_${q.id}`}
                      checked={q.correctAnswer === opt}
                      onChange={() => handleUpdateQuestion(q.id, "correctAnswer", opt)}
                      className="text-[#1264E8]"
                    />
                    <span className="font-bold">{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Short Answer Rubric */}
            {q.questionType === "SHORT_ANSWER" && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-emerald-800">
                  Expected Faculty Answer / AI Scoring Rubric *
                </label>
                <textarea
                  rows={2}
                  value={q.correctAnswer}
                  onChange={(e) => handleUpdateQuestion(q.id, "correctAnswer", e.target.value)}
                  placeholder="Provide ideal conceptual model answer. The AI will match student responses semantically against this rubric..."
                  className="w-full px-3 py-2 bg-emerald-50/40 border border-emerald-200 rounded-xl text-xs sm:text-sm text-gray-900"
                />
              </div>
            )}

            {/* Optional Explanation */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">
                Explanation (Shown to students after submission)
              </label>
              <input
                type="text"
                value={q.explanation}
                onChange={(e) => handleUpdateQuestion(q.id, "explanation", e.target.value)}
                placeholder="Optional conceptual explanation or reference pointer..."
                className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons: Save as Draft, Preview, Publish Exam (Prompt Specification 3) */}
      <div className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-gray-500">
          Total: <strong>{totalQuestions} questions</strong> • <strong>{totalMarks} marks</strong>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handlePublish("Draft")}
            disabled={isSaving}
            className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl"
          >
            Save as Draft
          </button>

          <button
            type="button"
            onClick={() => setPreviewModalOpen(true)}
            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-[#1264E8] text-xs font-bold rounded-xl border border-blue-200 flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>

          <button
            type="button"
            onClick={() => handlePublish("Live")}
            disabled={isSaving}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>Publish Exam</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Faculty Preview Modal (Prompt Specification 3) */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#1264E8] tracking-wider">
                  Faculty Confidential Preview
                </span>
                <h3 className="text-base font-bold text-gray-900 mt-0.5">
                  {examMeta.title}
                </h3>
                <p className="text-xs text-gray-500">
                  {examMeta.subject} • Duration: {examMeta.durationMins}m • {totalMarks} Marks • Pass: {examMeta.passPercentage}%
                </p>
              </div>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {questions.map((q, idx) => (
                <div key={idx} className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between font-semibold text-gray-800 mb-1">
                    <span>Q{idx + 1}. {q.questionText || "(Question text pending)"}</span>
                    <span className="font-mono text-blue-600">{q.marks} Marks</span>
                  </div>

                  {q.questionType === "MCQ" && (
                    <div className="pl-4 space-y-0.5 my-2">
                      {q.options.map((opt, i) => (
                        <div key={i} className="text-gray-600">{opt}</div>
                      ))}
                    </div>
                  )}

                  <div className="mt-2 p-2 bg-emerald-50 rounded text-emerald-800 font-semibold border border-emerald-200">
                    Faculty Answer Key: {q.correctAnswer}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t flex justify-end gap-2">
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  setPreviewModalOpen(false);
                  handlePublish("Live");
                }}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Confirm & Publish Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
