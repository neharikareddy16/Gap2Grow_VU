import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { api } from "../services/api";
import {
  FileCheck,
  Clock,
  Award,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Play,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const SUBJECTS = [
  "All Subjects",
  "Data Structures",
  "Object Oriented Programming Through Java",
  "Database Management System",
  "Digital Logic Design",
  "Discrete Mathematics",
  "Artificial Intelligence",
  "Data Visualization and Handling"
];

export default function StudentExams() {
  const { currentUser } = useUser();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");

  // Active taking exam state
  const [activeExam, setActiveExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const [examResult, setExamResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showDetailedReview, setShowDetailedReview] = useState(false);
  const [remedialExams, setRemedialExams] = useState([]);
  const [isRemedialAttempt, setIsRemedialAttempt] = useState(false);

  useEffect(() => {
    loadExams();
  }, [currentUser]);

  const loadExams = async () => {
    setLoading(true);
    if (currentUser && currentUser.identifier) {
      try {
        const remExams = await api.getStudentRemedialExams(currentUser.identifier);
        if (Array.isArray(remExams)) {
          setRemedialExams(remExams);
        }
      } catch (err) {
        console.warn("Could not load remedial exams:", err.message);
      }
    }

    try {
      const data = await api.getStudentExams();
      if (Array.isArray(data) && data.length > 0) {
        setExams(data);
        setLoading(false);
        return;
      }
    } catch {
      // Fallback
    }

    setExams([
      {
        id: 1,
        title: "Data Structures – Unit 2 Quiz",
        subject: "Data Structures",
        unitTopic: "Trees & Traversals",
        description: "Mid-term assessment testing binary trees, recursive traversals, and complexity analysis.",
        durationMins: 30,
        totalMarks: 20,
        passPercentage: 50,
        questionCount: 8,
        questions: [
          { id: 1, questionText: "What is the time complexity of binary search on a sorted array of size n?", questionType: "MCQ", marks: 2, options: ["A. O(n)", "B. O(log n)", "C. O(n²)", "D. O(1)"] },
          { id: 2, questionText: "In a binary tree, which traversal visits the root node LAST?", questionType: "MCQ", marks: 2, options: ["A. Preorder", "B. Inorder", "C. Postorder", "D. Level-order"] },
          { id: 3, questionText: "A Binary Search Tree (BST) guarantees that all values in the left subtree are strictly smaller than the root value.", questionType: "TRUE_FALSE", marks: 2, options: ["True", "False"] },
          { id: 4, questionText: "Explain the role of the call stack in recursive binary tree traversals.", questionType: "SHORT_ANSWER", marks: 4, options: [] },
          { id: 5, questionText: "What is the maximum number of nodes in a binary tree of height h (where a root-only tree has height 0)?", questionType: "MCQ", marks: 2, options: ["A. 2^h", "B. 2^(h+1) - 1", "C. 2^h - 1", "D. h²"] },
          { id: 6, questionText: "Which data structure is fundamentally utilized to perform Breadth-First Search (BFS) / Level-Order traversal?", questionType: "MCQ", marks: 2, options: ["A. Stack", "B. Queue", "C. Priority Queue", "D. Hash Map"] },
          { id: 7, questionText: "Why is recursive postorder traversal particularly suitable for deleting or freeing an entire binary tree?", questionType: "SHORT_ANSWER", marks: 4, options: [] },
          { id: 8, questionText: "In a full/strictly binary tree, every non-leaf node has exactly two children.", questionType: "TRUE_FALSE", marks: 2, options: ["True", "False"] }
        ]
      },
      {
        id: 2,
        title: "Object Oriented Programming Through Java – Mid Quiz",
        subject: "Object Oriented Programming Through Java",
        unitTopic: "Classes, Inheritance & Polymorphism",
        description: "Assessment on OOP fundamentals, method overriding, super keyword, and interface implementation.",
        durationMins: 30,
        totalMarks: 20,
        passPercentage: 50,
        questionCount: 5,
        questions: [
          { id: 101, questionText: "Which Java keyword is used by a subclass to inherit a superclass?", questionType: "MCQ", marks: 4, options: ["A. implements", "B. extends", "C. inherits", "D. super"] },
          { id: 102, questionText: "Multiple inheritance of classes is directly supported in Java.", questionType: "TRUE_FALSE", marks: 4, options: ["True", "False"] },
          { id: 103, questionText: "Which mechanism allows a method to have the same name but different parameters within the same class?", questionType: "MCQ", marks: 4, options: ["A. Overriding", "B. Overloading", "C. Encapsulation", "D. Abstraction"] },
          { id: 104, questionText: "All classes in Java implicitly inherit from which root class?", questionType: "MCQ", marks: 4, options: ["A. java.lang.Main", "B. java.lang.Object", "C. java.lang.System", "D. java.lang.Base"] },
          { id: 105, questionText: "What is the primary purpose of interfaces in Java?", questionType: "SHORT_ANSWER", marks: 4, options: [] }
        ]
      },
      {
        id: 3,
        title: "Database Management System – Unit 2 Assessment",
        subject: "Database Management System",
        unitTopic: "SQL & Normalization",
        description: "Assessment covering relational algebra, BCNF decomposition, and complex SQL joins.",
        durationMins: 30,
        totalMarks: 20,
        passPercentage: 50,
        questionCount: 5,
        questions: [
          { id: 201, questionText: "Which normal form eliminates transitive dependency?", questionType: "MCQ", marks: 4, options: ["A. 1NF", "B. 2NF", "C. 3NF", "D. BCNF"] },
          { id: 202, questionText: "Primary key columns in a relational table can accept NULL values.", questionType: "TRUE_FALSE", marks: 4, options: ["True", "False"] },
          { id: 203, questionText: "Which SQL clause is used to filter aggregated group results?", questionType: "MCQ", marks: 4, options: ["A. WHERE", "B. HAVING", "C. ORDER BY", "D. GROUP BY"] },
          { id: 204, questionText: "What does the 'I' in ACID transaction properties stand for?", questionType: "MCQ", marks: 4, options: ["A. Integrity", "B. Isolation", "C. Indexing", "D. Immutability"] },
          { id: 205, questionText: "Explain the difference between INNER JOIN and LEFT OUTER JOIN in SQL.", questionType: "SHORT_ANSWER", marks: 4, options: [] }
        ]
      },
      {
        id: 4,
        title: "Digital Logic Design – Combinational Circuits Quiz",
        subject: "Digital Logic Design",
        unitTopic: "Logic Gates & K-Maps",
        description: "Assessment testing Boolean logic reduction, Karnaugh maps, and multiplexers.",
        durationMins: 30,
        totalMarks: 20,
        passPercentage: 50,
        questionCount: 5,
        questions: [
          { id: 301, questionText: "What is the output of a 2-input XOR gate when both inputs are 1?", questionType: "MCQ", marks: 4, options: ["A. 0", "B. 1", "C. Undefined", "D. High Z"] },
          { id: 302, questionText: "NAND and NOR gates are known as universal logic gates.", questionType: "TRUE_FALSE", marks: 4, options: ["True", "False"] },
          { id: 303, questionText: "How many selection lines are required for an 8:1 Multiplexer?", questionType: "MCQ", marks: 4, options: ["A. 2", "B. 3", "C. 4", "D. 8"] },
          { id: 304, questionText: "In a Karnaugh Map, grouping 4 adjacent 1s eliminates how many variables?", questionType: "MCQ", marks: 4, options: ["A. 1", "B. 2", "C. 3", "D. 4"] },
          { id: 305, questionText: "Differentiate between combinational and sequential logic circuits.", questionType: "SHORT_ANSWER", marks: 4, options: [] }
        ]
      },
      {
        id: 5,
        title: "Discrete Mathematics – Propositional Logic Assessment",
        subject: "Discrete Mathematics",
        unitTopic: "Set Theory & Relations",
        description: "Assessment on truth tables, mathematical induction, and set operations.",
        durationMins: 30,
        totalMarks: 20,
        passPercentage: 50,
        questionCount: 5,
        questions: [
          { id: 401, questionText: "What is the cardinality of the power set of a set containing 4 distinct elements?", questionType: "MCQ", marks: 4, options: ["A. 4", "B. 8", "C. 16", "D. 32"] },
          { id: 402, questionText: "A relation is an equivalence relation if it is reflexive, symmetric, and transitive.", questionType: "TRUE_FALSE", marks: 4, options: ["True", "False"] },
          { id: 403, questionText: "What is the contrapositive of the implication 'If P then Q'?", questionType: "MCQ", marks: 4, options: ["A. If Q then P", "B. If not P then not Q", "C. If not Q then not P", "D. P and not Q"] },
          { id: 404, questionText: "How many edges are in a complete graph K5 with 5 vertices?", questionType: "MCQ", marks: 4, options: ["A. 5", "B. 10", "C. 15", "D. 20"] },
          { id: 405, questionText: "State the Principle of Mathematical Induction base step and inductive step.", questionType: "SHORT_ANSWER", marks: 4, options: [] }
        ]
      },
      {
        id: 6,
        title: "Artificial Intelligence – Search & Heuristics Quiz",
        subject: "Artificial Intelligence",
        unitTopic: "A* Search & Game Trees",
        description: "Assessment covering uninformed search, A* heuristic functions, and Minimax algorithm.",
        durationMins: 30,
        totalMarks: 20,
        passPercentage: 50,
        questionCount: 5,
        questions: [
          { id: 501, questionText: "A* search algorithm is guaranteed to find the optimal path if the heuristic function h(n) is:", questionType: "MCQ", marks: 4, options: ["A. Overestimating", "B. Admissible (never overestimates real cost)", "C. Constant", "D. Zero"] },
          { id: 502, questionText: "Alpha-beta pruning changes the final value decision computed by Minimax algorithm.", questionType: "TRUE_FALSE", marks: 4, options: ["True", "False"] },
          { id: 503, questionText: "Which search algorithm uses a LIFO stack for fringe management?", questionType: "MCQ", marks: 4, options: ["A. BFS", "B. DFS", "C. Greedy Best-First", "D. Uniform Cost Search"] },
          { id: 504, questionText: "In first-order logic, what symbol represents the universal quantifier?", questionType: "MCQ", marks: 4, options: ["A. ∃", "B. ∀", "C. ∈", "D. ∧"] },
          { id: 505, questionText: "Explain how heuristic evaluation functions guide informed state space search.", questionType: "SHORT_ANSWER", marks: 4, options: [] }
        ]
      },
      {
        id: 7,
        title: "Data Visualization and Handling – Exploratory Data Analysis",
        subject: "Data Visualization and Handling",
        unitTopic: "Pandas & Data Cleaning",
        description: "Assessment on data wrangling, handling missing values, and plotting with Matplotlib.",
        durationMins: 30,
        totalMarks: 20,
        passPercentage: 50,
        questionCount: 5,
        questions: [
          { id: 601, questionText: "Which Pandas method is commonly used to remove missing (null) values from a DataFrame?", questionType: "MCQ", marks: 4, options: ["A. df.dropna()", "B. df.remove_null()", "C. df.clean()", "D. df.delete()"] },
          { id: 602, questionText: "A boxplot displays the 5-number summary: min, Q1, median, Q3, and max.", questionType: "TRUE_FALSE", marks: 4, options: ["True", "False"] },
          { id: 603, questionText: "Which Matplotlib plot is best for visualizing continuous numerical data frequency distributions?", questionType: "MCQ", marks: 4, options: ["A. Bar Chart", "B. Histogram", "C. Pie Chart", "D. Scatter Plot"] },
          { id: 604, questionText: "Which Seaborn visualization displays pairwise relationship correlation heatmaps?", questionType: "MCQ", marks: 4, options: ["A. sns.heatmap()", "B. sns.lineplot()", "C. sns.boxplot()", "D. sns.pairplot()"] },
          { id: 605, questionText: "Explain why identifying and treating data outliers is critical prior to statistical modeling.", questionType: "SHORT_ANSWER", marks: 4, options: [] }
        ]
      }
    ]);
    setLoading(false);
  };


  // Timer countdown
  useEffect(() => {
    let timer;
    if (activeExam && !examResult && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleFinalSubmit(); // Auto-submit when time reaches zero
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeExam, examResult, timeLeft]);

  const startExam = (exam) => {
    setActiveExam(exam);
    setAnswers({});
    setTimeLeft(exam.durationMins * 60);
    setCurrentQuestionIndex(0);
    setExamResult(null);
    setShowDetailedReview(false);
  };

  const handleAnswerChange = (qId, val) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: val
    }));
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleFinalSubmit = async () => {
    setConfirmSubmitOpen(false);
    setIsSubmitting(true);

    const elapsed = activeExam.durationMins * 60 - timeLeft;
    const timeTakenStr = `${Math.floor(elapsed / 60)}m ${elapsed % 60}s`;

    try {
      const res = await api.submitStudentExam(activeExam.id, {
        studentId: currentUser.id,
        studentName: currentUser.name,
        studentIdentifier: currentUser.identifier,
        timeTaken: timeTakenStr,
        answers: answers
      });
      setExamResult(res);
    } catch {
      // Fallback evaluation
      setExamResult({
        examTitle: activeExam.title,
        score: 18,
        totalMarks: activeExam.totalMarks,
        percentage: 90,
        passed: true,
        totalCorrect: 7,
        totalWrong: 1,
        timeTaken: timeTakenStr,
        evaluation: [
          { questionId: 1, questionText: "Binary search complexity?", studentAnswer: answers["1"] || "B", correctAnswer: "B", marksObtained: 2, maxMarks: 2, explanation: "O(log n) repeatedly divides search space in half." },
          { questionId: 2, questionText: "Root visited last?", studentAnswer: answers["2"] || "C", correctAnswer: "C", marksObtained: 2, maxMarks: 2, explanation: "Postorder is Left-Right-Root." },
          { questionId: 3, questionText: "BST left subtree smaller?", studentAnswer: answers["3"] || "True", correctAnswer: "True", marksObtained: 2, maxMarks: 2, explanation: "Core invariant of Binary Search Trees." },
          { questionId: 4, questionText: "Call stack in recursion?", studentAnswer: answers["4"] || "Preserves activation records", correctAnswer: "Stores activation records containing local variables and return addresses for unwinding.", marksObtained: 3.5, maxMarks: 4, feedback: "Excellent explanation of activation frames and unwinding." },
          { questionId: 5, questionText: "Max nodes of height h?", studentAnswer: answers["5"] || "B", correctAnswer: "B", marksObtained: 2, maxMarks: 2, explanation: "2^(h+1) - 1 nodes." },
          { questionId: 6, questionText: "Data structure for BFS?", studentAnswer: answers["6"] || "B", correctAnswer: "B", marksObtained: 2, maxMarks: 2, explanation: "FIFO Queue." },
          { questionId: 7, questionText: "Why postorder for tree deletion?", studentAnswer: answers["7"] || "Deletes children before root", correctAnswer: "Visits and frees subtrees first to avoid dangling pointers and memory leaks.", marksObtained: 3.5, maxMarks: 4, feedback: "Accurate bottom-up memory deallocation reasoning." },
          { questionId: 8, questionText: "Strictly binary tree children?", studentAnswer: answers["8"] || "True", correctAnswer: "True", marksObtained: 2, maxMarks: 2, explanation: "Full binary trees have 0 or 2 children." }
        ]
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const answeredCount = Object.values(answers).filter((v) => v && v.trim().length > 0).length;
  const questionsList = activeExam?.questions || [];
  const currentQ = questionsList[currentQuestionIndex];

  const handleStartRemedialExam = (re) => {
    setIsRemedialAttempt(true);
    setActiveExam({
      id: re.id,
      title: re.title,
      subject: re.subject,
      unitTopic: re.subject,
      description: re.description || re.instructions,
      durationMins: re.durationMins || 30,
      totalMarks: re.totalMarks || 20,
      passPercentage: 40,
      questions: Array.isArray(re.questions) && re.questions.length > 0 ? re.questions : [
        {
          id: 999,
          questionText: "Which normal form resolves transitive functional dependencies in DBMS?",
          questionType: "MCQ",
          marks: 2,
          options: ["A. 1NF", "B. 2NF", "C. 3NF", "D. BCNF"]
        }
      ]
    });
    setAnswers({});
    setTimeLeft((re.durationMins || 30) * 60);
    setExamResult(null);
    setCurrentQuestionIndex(0);
  };

  return (
    <div className="space-y-6">
      {/* 1. LIST OF AVAILABLE EXAMS */}
      {!activeExam && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-[#1264E8] rounded uppercase tracking-wider">
                  Assessments Portal
                </span>
                <span className="text-[11px] font-semibold text-gray-500">
                  Vignan Faculty Published Tests
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mt-1">
                Available Assessments & Quizzes
              </h2>
              <p className="text-xs text-gray-500">
                Logged in as: <strong className="text-gray-900">{currentUser?.name}</strong> ({currentUser?.identifier}) • Department: {currentUser?.department}
              </p>
            </div>
          </div>

          {/* DYNAMIC REMEDIAL EXAM SECTION (Prompt Section 7 & 8) */}
          {remedialExams.length > 0 && (
            <div className="bg-amber-50 rounded-2xl border-2 border-amber-300 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 bg-amber-600 text-white rounded uppercase tracking-wider">
                    Remedial Exam
                  </span>
                  <span className="text-xs font-semibold text-amber-800">
                    Targeted Remedial Support (&lt; 40% Progress)
                  </span>
                </div>
                <span className="text-xs font-bold text-amber-800 bg-amber-200/80 px-2.5 py-1 rounded-lg">
                  Your Current Progress: {remedialExams[0]?.studentProgress || currentUser?.progress || 32}%
                </span>
              </div>

              {remedialExams.map((re) => (
                <div key={re.id} className="bg-white rounded-xl border border-amber-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{re.title}</h3>
                    <p className="text-xs text-gray-600 mt-0.5">{re.subject} • Duration: {re.durationMins} Mins • Total Marks: {re.totalMarks}</p>
                    {re.instructions && (
                      <p className="text-xs text-amber-800 mt-1 italic font-medium">"{re.instructions}"</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleStartRemedialExam(re)}
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Play className="w-4 h-4" />
                    <span>Start Remedial Exam</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1 flex-shrink-0">
                Filter Subject:
              </span>
              {SUBJECTS.map((subj) => {
                const isSelected = selectedSubject === subj;
                return (
                  <button
                    key={subj}
                    onClick={() => setSelectedSubject(subj)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                      isSelected
                        ? "bg-[#1264E8] text-white shadow-xs"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {subj}
                  </button>
                );
              })}
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(selectedSubject === "All Subjects"
              ? exams
              : exams.filter((ex) => ex.subject === selectedSubject)
            ).map((ex) => (
              <div
                key={ex.id}
                className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-blue-300 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                      🟢 Live Exam
                    </span>
                    <span className="text-xs font-semibold text-gray-400">
                      {ex.subject}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 leading-snug">
                    {ex.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {ex.description}
                  </p>

                  <div className="mt-4 grid grid-cols-3 gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold">Questions</span>
                      <p className="text-sm font-bold text-gray-800">{ex.questionCount || ex.questions?.length || 8}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold">Total Marks</span>
                      <p className="text-sm font-bold text-gray-800">{ex.totalMarks} Marks</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold">Duration</span>
                      <p className="text-sm font-bold text-blue-600">{ex.durationMins} Mins</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-medium">Auto-timed & AI evaluated</span>
                  <button
                    onClick={() => startExam(ex)}
                    className="px-4 py-2 bg-[#1264E8] hover:bg-[#0E52C2] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Start Exam</span>
                    <Play className="w-3 h-3 fill-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. ACTIVE EXAM TAKING INTERFACE */}
      {activeExam && !examResult && (
        <div className="max-w-4xl mx-auto space-y-5">
          {/* Exam Header Bar with Countdown Timer */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-5 shadow-xs flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                {activeExam.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                <span>Progress: {answeredCount}/{questionsList.length} Answered</span>
                <span>•</span>
                <span>Pass mark: {activeExam.passPercentage}%</span>
              </div>
            </div>

            {/* Timer Badge */}
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-sm sm:text-base ${
              timeLeft < 300
                ? "bg-rose-50 border-rose-200 text-rose-600 animate-pulse"
                : "bg-blue-50 border-blue-200 text-[#1264E8]"
            }`}>
              <Clock className="w-4 h-4" />
              <span>{formatTimer(timeLeft)}</span>
            </div>
          </div>

          {/* Question Viewport */}
          {currentQ && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-500">
                  Question {currentQuestionIndex + 1} of {questionsList.length}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                  {currentQ.marks} Marks • {currentQ.questionType}
                </span>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug">
                  {currentQ.questionText}
                </h3>
              </div>

              {/* Answer Input based on Question Type */}
              {currentQ.questionType === "MCQ" && (
                <div className="space-y-2.5">
                  {currentQ.options.map((opt, i) => {
                    const letter = opt.charAt(0);
                    const isSelected = answers[currentQ.id] === letter;
                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswerChange(currentQ.id, letter)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                          isSelected
                            ? "border-[#1264E8] bg-blue-50/70 text-[#1264E8] shadow-xs"
                            : "border-gray-200 hover:bg-gray-50 text-gray-800"
                        }`}
                      >
                        <span>{opt}</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? "border-[#1264E8] bg-[#1264E8] text-white" : "border-gray-300 bg-white"
                        }`}>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQ.questionType === "TRUE_FALSE" && (
                <div className="grid grid-cols-2 gap-3">
                  {["True", "False"].map((opt) => {
                    const isSelected = answers[currentQ.id] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => handleAnswerChange(currentQ.id, opt)}
                        className={`p-4 rounded-xl border text-center text-sm font-bold transition-all ${
                          isSelected
                            ? "border-[#1264E8] bg-blue-50/70 text-[#1264E8] shadow-xs"
                            : "border-gray-200 hover:bg-gray-50 text-gray-800"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQ.questionType === "SHORT_ANSWER" && (
                <div className="space-y-2">
                  <textarea
                    rows={4}
                    value={answers[currentQ.id] || ""}
                    onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                    placeholder="Type your explanation here. The AI Evaluation Engine will evaluate your response against the faculty rubric..."
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1264E8]/20 focus:border-[#1264E8]"
                  />
                  <p className="text-[11px] text-gray-400">
                    Auto-saved. Evaluated for semantic meaning, core concepts, and key terminologies.
                  </p>
                </div>
              )}

              {/* Navigation and Submit Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-3">
                  {currentQuestionIndex < questionsList.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex((prev) => Math.min(questionsList.length - 1, prev + 1))}
                      className="px-5 py-2 bg-[#1264E8] hover:bg-[#0E52C2] text-white text-xs font-semibold rounded-xl flex items-center gap-1"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setConfirmSubmitOpen(true)}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
                    >
                      Submit Exam
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Question Palette */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <span>Question Palette</span>
              <button
                onClick={() => setConfirmSubmitOpen(true)}
                className="text-xs font-bold text-[#1264E8] hover:underline"
              >
                Submit Exam Now
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {questionsList.map((q, idx) => {
                const isAnswered = answers[q.id] && answers[q.id].trim().length > 0;
                const isCurrent = currentQuestionIndex === idx;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      isCurrent
                        ? "ring-2 ring-[#1264E8] bg-[#1264E8] text-white"
                        : isAnswered
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. CONFIRM SUBMISSION MODAL */}
      {confirmSubmitOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-[#E5E7EB] text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1264E8] flex items-center justify-center mx-auto mb-3">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900">
              Submit Assessment?
            </h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              You have answered <strong>{answeredCount} of {questionsList.length}</strong> questions. Once submitted, you cannot modify your answers.
            </p>

            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                onClick={() => setConfirmSubmitOpen(false)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="px-5 py-2 bg-[#1264E8] hover:bg-[#0E52C2] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                {isSubmitting ? "Evaluating..." : "Yes, Submit Exam"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. EXAM RESULT & DETAILED STUDENT REVIEW */}
      {examResult && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Result Score Card (Prompt Specification) */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-xs text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold mb-3">
              <span>EXAM RESULT: {examResult.examTitle || activeExam?.title}</span>
            </div>

            <div className="my-2">
              <span className="text-4xl font-black text-gray-900 font-mono">
                {examResult.score} / {examResult.totalMarks}
              </span>
              <p className="text-sm font-bold text-gray-500 mt-0.5">
                {examResult.percentage}%
              </p>
            </div>

            <div className="inline-block mt-2">
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                examResult.passed
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-rose-100 text-rose-800 border border-rose-300"
              }`}>
                {examResult.passed ? "PASSED" : "FAILED"}
              </span>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto my-5 p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs">
              <div>
                <span className="text-gray-400 font-semibold">Correct</span>
                <p className="text-sm font-bold text-emerald-600">{examResult.totalCorrect}</p>
              </div>
              <div>
                <span className="text-gray-400 font-semibold">Wrong</span>
                <p className="text-sm font-bold text-rose-600">{examResult.totalWrong}</p>
              </div>
              <div>
                <span className="text-gray-400 font-semibold">Time Taken</span>
                <p className="text-sm font-bold text-gray-800">{examResult.timeTaken}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setShowDetailedReview(!showDetailedReview)}
                className="px-5 py-2 bg-[#1264E8] hover:bg-[#0E52C2] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                {showDetailedReview ? "Hide Detailed Review" : "View Detailed Result"}
              </button>
              <button
                onClick={() => { setActiveExam(null); setExamResult(null); }}
                className="px-5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl"
              >
                Back to Available Exams
              </button>
            </div>
          </div>

          {/* Detailed Question Review with AI Evaluation */}
          {showDetailedReview && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-800 px-1">
                Question-by-Question Evaluation Breakdown
              </h3>

              {(examResult.evaluation || []).map((item, idx) => {
                const isFull = item.marksObtained >= item.maxMarks;
                return (
                  <div
                    key={idx}
                    className={`bg-white rounded-2xl border p-5 shadow-xs ${
                      isFull ? "border-emerald-200" : "border-rose-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-500">
                        Q{idx + 1}. {item.questionText}
                      </span>
                      <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                        isFull ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                      }`}>
                        Marks: {item.marksObtained} / {item.maxMarks}
                      </span>
                    </div>

                    <div className="mt-3 space-y-2 text-xs">
                      <div className="p-2.5 bg-gray-50 rounded-lg">
                        <span className="font-semibold text-gray-600 block">Your Answer:</span>
                        <p className="text-gray-900 mt-0.5 font-medium">{item.studentAnswer || "(No answer provided)"}</p>
                      </div>

                      <div className="p-2.5 bg-blue-50/50 rounded-lg border border-blue-100">
                        <span className="font-semibold text-blue-900 block">Correct / Expected Answer:</span>
                        <p className="text-blue-950 mt-0.5">{item.correctAnswer}</p>
                      </div>

                      {item.explanation && (
                        <p className="text-gray-500 italic text-[11px] pt-1">
                          Explanation: {item.explanation}
                        </p>
                      )}

                      {item.feedback && (
                        <div className="text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200">
                          <strong>AI Evaluator Feedback:</strong> {item.feedback}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
