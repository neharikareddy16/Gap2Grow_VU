export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
export const SERVER_BASE = API_BASE_URL.replace(/\/api\/?$/, "");

export const DEMO_USERS_FALLBACK = [
  {
    id: 1,
    name: "Super Admin",
    role: "SUPER_ADMIN",
    identifier: "superadmin",
    email: "superadmin@vignan.ac.in",
    password: "SuperAdmin@123",
    department: "Administration",
    college: "Vignan University"
  },
  {
    id: 2,
    name: "SAI ESWARI",
    role: "FACULTY",
    identifier: "sai.eswari",
    email: "sai.eswari@vignan.ac.in",
    password: "Faculty@123",
    department: "CSE",
    classTeacherSection: "Section A",
    assignedSubject: "Database Management System",
    college: "Vignan University"
  },
  {
    id: 3,
    name: "BHARGAVI",
    role: "REMEDIAL_COORDINATOR",
    identifier: "bhargavi",
    email: "bhargavi@vignan.ac.in",
    password: "Remedial@123",
    department: "Remedial Cell",
    classTeacherSection: "Section C",
    college: "Vignan University"
  },
  {
    id: 4,
    name: "VIGNAN's NTR LIBRARY",
    role: "LIBRARY",
    identifier: "library",
    email: "library@vignan.ac.in",
    password: "Library@123",
    department: "Central Library",
    college: "Vignan University"
  },
  {
    id: 5,
    name: "Rahul Kumar",
    role: "STUDENT",
    identifier: "23CSE001",
    email: "rahul@vignan.ac.in",
    password: "password123",
    department: "CSE",
    branch: "CSE",
    year: "2nd Year",
    section: "A",
    progress: 32.0,
    college: "Vignan University"
  }
];

async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || `HTTP error ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`Backend API fallback for ${endpoint}:`, err.message);
    throw err;
  }
}

export const api = {
  // Auth
  getDemoUsers: async () => {
    try {
      return await request("/auth/demo-users");
    } catch {
      return DEMO_USERS_FALLBACK.map(({ password, ...u }) => u);
    }
  },
  login: async (credentials) => {
    try {
      return await request("/auth/login", { method: "POST", body: JSON.stringify(credentials) });
    } catch (err) {
      const msg = err.message || "";
      if (
        msg &&
        !msg.toLowerCase().includes("failed to fetch") &&
        !msg.toLowerCase().includes("networkerror") &&
        !msg.toLowerCase().includes("load failed")
      ) {
        throw err;
      }

      // Offline / Static deployment fallback authentication
      const role = (credentials.role || "").toUpperCase().trim();
      const ident = (credentials.identifier || "").trim().toLowerCase();
      const pw = credentials.password || "";

      const localUsers = JSON.parse(localStorage.getItem("gap2grow_registered_users") || "[]");
      const allUsers = [...DEMO_USERS_FALLBACK, ...localUsers];

      const found = allUsers.find(
        (u) =>
          u.role.toUpperCase().trim() === role &&
          ((u.identifier && u.identifier.toLowerCase() === ident) || (u.email && u.email.toLowerCase() === ident))
      );

      if (!found) {
        throw new Error("Invalid Credentials. Account not found for selected role.");
      }

      if (found.password && found.password !== pw) {
        throw new Error("Invalid Credentials. Password does not match.");
      }

      const { password, ...userObj } = found;
      return {
        success: true,
        message: "Login Successful (Offline Fallback)",
        token: `gap2grow_token_${found.id}_offline`,
        user: userObj
      };
    }
  },
  register: async (userData) => {
    try {
      return await request("/auth/register", { method: "POST", body: JSON.stringify(userData) });
    } catch (err) {
      const msg = err.message || "";
      if (
        msg &&
        !msg.toLowerCase().includes("failed to fetch") &&
        !msg.toLowerCase().includes("networkerror") &&
        !msg.toLowerCase().includes("load failed")
      ) {
        throw err;
      }

      const localUsers = JSON.parse(localStorage.getItem("gap2grow_registered_users") || "[]");
      const emailLower = (userData.email || "").trim().toLowerCase();
      const ident = (userData.identifier || "").trim();

      if (
        localUsers.some(
          (u) => (u.email && u.email.toLowerCase() === emailLower) || (u.identifier && u.identifier === ident)
        ) ||
        DEMO_USERS_FALLBACK.some(
          (u) => (u.email && u.email.toLowerCase() === emailLower) || (u.identifier && u.identifier === ident)
        )
      ) {
        throw new Error("Registration failed. Register Number or Email ID is already registered.");
      }

      const newUser = {
        id: Date.now(),
        name: (userData.name || "").trim(),
        role: "STUDENT",
        identifier: ident,
        email: emailLower,
        password: userData.password,
        department: userData.branch || userData.department || "CSE",
        branch: userData.branch || "CSE",
        year: userData.year ? (userData.year.includes("Year") ? userData.year : `${userData.year} Year`) : "2nd Year",
        section: "A",
        progress: 35.0,
        college: "Vignan University"
      };

      localUsers.push(newUser);
      localStorage.setItem("gap2grow_registered_users", JSON.stringify(localUsers));

      const { password, ...userObj } = newUser;
      return {
        success: true,
        message: "Registration Successful (Offline Mode)",
        user: userObj
      };
    }
  },
  changePassword: (data) => request("/auth/change-password", { method: "POST", body: JSON.stringify(data) }),

  // Student & Subject services
  getStudentSubjects: () => request("/student/subjects"),
  searchYoutube: (subject, topic, subtopic = "") => {
    const q = new URLSearchParams();
    if (subject) q.append("subject", subject);
    if (topic) q.append("topic", topic);
    if (subtopic) q.append("subtopic", subtopic);
    return request(`/youtube/search?${q.toString()}`);
  },
  getTopicGaps: (subject = "", name = "") => {
    const q = new URLSearchParams();
    if (subject) q.append("subject", subject);
    if (name) q.append("student_name", name);
    return request(`/student/topic-gaps?${q.toString()}`);
  },
  getLearningPath: (subject = "", name = "", topic = "") => {
    const q = new URLSearchParams();
    if (subject) q.append("subject", subject);
    if (name) q.append("student_name", name);
    if (topic) q.append("gap_topic", topic);
    return request(`/student/learning-path?${q.toString()}`);
  },
  getPracticeQuestions: (subject = "", topic = "", subtopic = "") => {
    const q = new URLSearchParams();
    if (subject) q.append("subject", subject);
    if (topic) q.append("topic", topic);
    if (subtopic) q.append("subtopic", subtopic);
    return request(`/student/practice-questions?${q.toString()}`);
  },
  submitDiagnostic: (responses) => request("/student/diagnostic/submit", { method: "POST", body: JSON.stringify({ responses }) }),
  submitPractice: (score, total) => request("/student/practice/submit", { method: "POST", body: JSON.stringify({ score, total }) }),
  getBeforeAfter: (subject = "") => {
    const q = new URLSearchParams();
    if (subject) q.append("subject", subject);
    return request(`/student/before-after${q.toString() ? `?${q.toString()}` : ""}`);
  },
  getStudentExams: () => request("/student/exams"),
  submitStudentExam: (examId, data) => request(`/student/exams/${examId}/submit`, { method: "POST", body: JSON.stringify(data) }),

  // Faculty
  getFacultyStats: () => request("/faculty/dashboard-stats"),
  getFacultyExams: (subject = "") => request(`/faculty/exams${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`),

  createExam: (examData) => request("/faculty/exams", { method: "POST", body: JSON.stringify(examData) }),
  updateExam: (examId, examData) => request(`/faculty/exams/${examId}`, { method: "PUT", body: JSON.stringify(examData) }),
  deleteExam: (examId) => request(`/faculty/exams/${examId}`, { method: "DELETE" }),
  publishExam: (examId) => request(`/faculty/exams/${examId}/publish`, { method: "POST" }),
  getExamResults: (examId) => request(`/faculty/exams/${examId}/results`),
  getFacultyInsights: () => request("/faculty/ai-insights"),
  approveInsight: (id) => request(`/faculty/ai-insights/${id}/approve`, { method: "POST" }),

  // Resources
  getResources: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/resources${q ? `?${q}` : ""}`);
  },
  addResource: (resData) => request("/resources", { method: "POST", body: JSON.stringify(resData) }),
  editResource: (id, resData) => request(`/resources/${id}`, { method: "PUT", body: JSON.stringify(resData) }),
  deleteResource: (id) => request(`/resources/${id}`, { method: "DELETE" }),

  // Remedial Coordinator
  getRemedialStats: () => request("/remedial/dashboard-stats"),
  getRemedialStudents: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/remedial/students${q ? `?${q}` : ""}`);
  },
  getRemedialStudentProfile: (studentId) => request(`/remedial/students/${studentId}/profile`),
  getClassGaps: () => request("/remedial/class-gaps"),
  getRemedialProgress: () => request("/remedial/progress"),

  // Library
  getLibraryStats: () => request("/library/stats"),
  getLibraryBooks: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/library/books${q ? `?${q}` : ""}`);
  },
  addBook: (bookData) => request("/library/books", { method: "POST", body: JSON.stringify(bookData) }),
  editBook: (id, bookData) => request(`/library/books/${id}`, { method: "PUT", body: JSON.stringify(bookData) }),
  deleteBook: (id) => request(`/library/books/${id}`, { method: "DELETE" }),
  issueBook: (id) => request(`/library/books/${id}/issue`, { method: "POST" }),
  returnBook: (id) => request(`/library/books/${id}/return`, { method: "POST" }),

  // AI Assistant Chat & Simplifier
  chat: async (message, userContext, history = [], sessionId = "default") => {
    try {
      return await request("/ai/chat", { method: "POST", body: JSON.stringify({ message, userContext, history, sessionId }) });
    } catch (err) {
      const cleanMsg = (message || "").trim();
      const qLower = cleanMsg.toLowerCase();
      const name = userContext?.name || "Student";
      
      let reply = "";
      if (qLower.includes("bubble sort")) {
        reply = "```python\ndef bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr\n```\n**Bubble Sort Analysis:**\n- **Time Complexity:** O(N²) worst/average case, O(N) best case.\n- **Space Complexity:** O(1) in-place auxiliary memory.";
      } else if (qLower.includes("binary search")) {
        reply = "```python\ndef binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: low = mid + 1\n        else: high = mid - 1\n    return -1\n```\n**Binary Search Analysis:**\n- **Prerequisite:** Array must be sorted.\n- **Time Complexity:** O(log N).";
      } else if (qLower.includes("2 mark") || qLower.includes("2 marks")) {
        reply = `**2-Mark Exam Definition for ${cleanMsg.replace(/for 2 marks|in 2 marks/gi, '').trim()}:**\nA core fundamental concept in computer science used for structured computation, deterministic memory management, and efficient algorithmic processing.\n\n**Key Formula / Property:** Time Complexity O(1) / O(log N).`;
      } else if (qLower.includes("5 mark") || qLower.includes("5 marks")) {
        reply = `**5-Mark Answer for ${cleanMsg.replace(/for 5 marks|in 5 marks/gi, '').trim()}:**\n\n### 1. Conceptual Overview\nThis concept forms the structural foundation for syllabus problem solving and computational efficiency.\n\n### 2. Primary Characteristics\n- Enables deterministic state transitions.\n- Manages memory frames cleanly.\n- Applied in system software & data structures.`;
      } else if (qLower.includes("10 mark") || qLower.includes("10 marks")) {
        reply = `**10-Mark Detailed Answer for ${cleanMsg.replace(/for 10 marks|in 10 marks/gi, '').trim()}:**\n\n### 1. Introduction & Definition\nComprehensive structural breakdown covering algorithmic principles and core execution steps.\n\n### 2. Step-by-Step Execution\n1. Initialize memory structures.\n2. Iterate through input frames.\n3. Return finalized state.\n\n### 3. Practical Code Implementation\n\`\`\`python\ndef execute_solution(data):\n    return [item for item in data if item is not None]\n\`\`\``;
      } else {
        reply = `**Academic Assistant Overview for "${cleanMsg}":**\n\n**${cleanMsg}** is an essential subject concept at Vignan University. It plays a critical role in data structuring, system design, algorithm optimization, and university examination problem solving.`;
      }

      return {
        reply,
        intent: "GENERAL_STUDENT_QUERY",
        mode: "DYNAMIC_CLIENT_FALLBACK",
        language: "ENGLISH",
        sender: "Gap2Grow AI Learning Assistant",
        timestamp: "Just now"
      };
    }
  },

  simplifyResource: async (payload) => {
    try {
      return await request("/ai/simplify", { method: "POST", body: JSON.stringify(payload) });
    } catch (err) {
      const topicName = payload.topic || payload.title || payload.content || "Selected Subject Resource";
      return {
        resourceMeta: {
          type: payload.type || payload.inputMode || "syllabus",
          inputMode: payload.inputMode || "syllabus",
          sourceTitle: topicName,
          sourceStatus: "normal"
        },
        onePageSummary: `Simplified learning guide for ${topicName}. Covers core concepts, step-by-step mechanisms, memory models, and exam problem solving strategies tailored for Vignan University students.`,
        examPrepSummary: [
          `Key Definition: Clear 1-sentence technical definition of ${topicName}.`,
          "Core Formula / Complexity: Time O(N log N) / O(1) space auxiliary bound.",
          "Common Traps: Avoid off-by-one errors and unhandled null pointer boundary conditions.",
          "5-Mark Exam Question: Step-by-step algorithmic breakdown with call stack tracing.",
          "10-Mark Exam Question: Full program code implementation with sample input/output."
        ],
        coreConcepts: [
          { concept: `${topicName} Fundamentals`, explanation: `Basic building blocks and initialization parameters for ${topicName}.` },
          { concept: "Operational Mechanics", explanation: "How state transitions and memory pointers mutate during execution." },
          { concept: "Optimization Strategy", explanation: "Minimizing space and time bounds under high workload conditions." }
        ],
        stepByStepBreakdown: [
          "Step 1: Parse and validate input data structures.",
          "Step 2: Initialize control variables and pointers.",
          "Step 3: Execute core algorithmic transformation loop.",
          "Step 4: Return finalized result or cleaned memory pointers."
        ],
        examAnswers: {
          twoMarks: `**2 Marks Answer:** ${topicName} is a fundamental computer science concept operating within deterministic space-time bounds.`,
          fiveMarks: `**5 Marks Answer:**\n1. Definition & Core Principles of ${topicName}.\n2. Architectural Diagram & Memory Layout.\n3. Primary Algorithmic Steps and Complexity.`,
          tenMarks: `**10 Marks Answer:**\nDetailed architectural breakdown, code implementation, step-by-step trace diagram, edge case handling, and comparative performance analysis.`
        },
        practiceQuestions: [
          { question: `What is the primary function of ${topicName}?`, answer: "Option B. Efficient computational processing.", explanation: "Provides optimal time complexity bounds." },
          { question: `Which data structure is fundamentally used in ${topicName}?`, answer: "Option A. Stack / Queue / Array", explanation: "Standard memory representation." }
        ]
      };
    }
  },

  simplifyFile: async (formData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/simplify-file`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `HTTP error ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      const fileObj = formData.get ? formData.get("file") : null;
      const fileName = fileObj ? fileObj.name : "Uploaded Faculty Resource Document";
      const topicName = formData.get ? (formData.get("topic") || fileName) : fileName;

      return {
        resourceMeta: {
          type: "file",
          inputMode: "pdf",
          sourceTitle: fileName,
          sourceStatus: "normal"
        },
        onePageSummary: `Simplified document guide for ${fileName}. Extracted key definitions, architectural diagrams, memory models, and exam problem solving strategies for Vignan University students.`,
        examPrepSummary: [
          `Key Definition: Essential summary of ${fileName}.`,
          "Core Formula / Principle: Standard academic formulation and time complexity.",
          "Exam 5-Mark Problem: Algorithmic trace and memory stack unwinding.",
          "Exam 10-Mark Problem: Comprehensive architectural design & C++/Python code implementation."
        ],
        coreConcepts: [
          { concept: "Document Core Concept 1", explanation: `Fundamental principles extracted from ${fileName}.` },
          { concept: "Document Core Concept 2", explanation: "Detailed operational mechanics and structural properties." }
        ],
        stepByStepBreakdown: [
          "Step 1: Review document prerequisite definitions.",
          "Step 2: Trace input execution flow and memory stack frames.",
          "Step 3: Verify output state against university exam criteria."
        ],
        examAnswers: {
          twoMarks: `**2 Marks Answer:** Concise summary of ${fileName} definitions.`,
          fiveMarks: `**5 Marks Answer:** Medium structured explanation derived from ${fileName}.`,
          tenMarks: `**10 Marks Answer:** Full technical breakdown and code implementation for ${fileName}.`
        },
        practiceQuestions: [
          { question: `What is the main topic covered in ${fileName}?`, answer: "Option A. Academic Core Subject Material", explanation: "Directly matches document contents." }
        ]
      };
    }
  },
  getTopicHierarchy: (subject = "", topic = "", subtopic = "") => {
    const q = new URLSearchParams();
    if (subject) q.append("subject", subject);
    if (topic) q.append("topic", topic);
    if (subtopic) q.append("subtopic", subtopic);
    return request(`/student/topic-hierarchy?${q.toString()}`);
  },
  getImportantNotes: (department = "CSE", year = "2") => request(`/student/important-notes?department=${encodeURIComponent(department)}&year=${encodeURIComponent(year)}`),

  // Doubts Session & Faculty Q&A
  getDoubts: async (params = {}) => {
    const q = new URLSearchParams(params).toString();
    try {
      const data = await request(`/doubts${q ? `?${q}` : ""}`);
      localStorage.setItem("gap2grow_doubts_cache", JSON.stringify(data));
      return data;
    } catch (err) {
      const cached = localStorage.getItem("gap2grow_doubts_cache");
      return cached ? JSON.parse(cached) : [];
    }
  },
  askDoubt: async (doubtData) => {
    try {
      const created = await request("/doubts", { method: "POST", body: JSON.stringify(doubtData) });
      const cached = JSON.parse(localStorage.getItem("gap2grow_doubts_cache") || "[]");
      localStorage.setItem("gap2grow_doubts_cache", JSON.stringify([created, ...cached]));
      return created;
    } catch (err) {
      const cached = JSON.parse(localStorage.getItem("gap2grow_doubts_cache") || "[]");
      const fallback = {
        id: Date.now(),
        ...doubtData,
        status: "Pending",
        answer: null,
        answeredBy: null,
        answeredAt: null,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem("gap2grow_doubts_cache", JSON.stringify([fallback, ...cached]));
      return fallback;
    }
  },
  answerDoubt: async (doubtId, answerData) => {
    try {
      const updated = await request(`/doubts/${doubtId}/answer`, { method: "POST", body: JSON.stringify(answerData) });
      const cached = JSON.parse(localStorage.getItem("gap2grow_doubts_cache") || "[]");
      const newCache = cached.map(d => d.id === doubtId ? updated : d);
      localStorage.setItem("gap2grow_doubts_cache", JSON.stringify(newCache));
      return updated;
    } catch (err) {
      const cached = JSON.parse(localStorage.getItem("gap2grow_doubts_cache") || "[]");
      const newCache = cached.map(d => d.id === doubtId ? {
        ...d,
        status: "Answered",
        answer: answerData.answer,
        answeredBy: answerData.answeredBy,
        answeredAt: new Date().toISOString()
      } : d);
      localStorage.setItem("gap2grow_doubts_cache", JSON.stringify(newCache));
      return newCache.find(d => d.id === doubtId);
    }
  },

  // Faculty Live Sessions
  getLiveSessions: async (params = {}) => {
    const q = new URLSearchParams(params).toString();
    try {
      const data = await request(`/faculty/live-sessions${q ? `?${q}` : ""}`);
      localStorage.setItem("gap2grow_live_sessions_cache", JSON.stringify(data));
      return data;
    } catch (err) {
      const cached = localStorage.getItem("gap2grow_live_sessions_cache");
      return cached ? JSON.parse(cached) : [];
    }
  },
  createLiveSession: async (sessionData) => {
    try {
      const created = await request("/faculty/live-sessions", { method: "POST", body: JSON.stringify(sessionData) });
      const cached = JSON.parse(localStorage.getItem("gap2grow_live_sessions_cache") || "[]");
      localStorage.setItem("gap2grow_live_sessions_cache", JSON.stringify([created, ...cached]));
      return created;
    } catch (err) {
      const cached = JSON.parse(localStorage.getItem("gap2grow_live_sessions_cache") || "[]");
      const fallback = {
        id: Date.now(),
        ...sessionData,
        status: sessionData.status || "Live",
        meetingLink: sessionData.meetingLink || `https://meet.google.com/session-${Date.now().toString().slice(-6)}`,
        joinedCount: 1,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem("gap2grow_live_sessions_cache", JSON.stringify([fallback, ...cached]));
      return fallback;
    }
  },
  endLiveSession: async (sessionId) => {
    try {
      const updated = await request(`/faculty/live-sessions/${sessionId}/end`, { method: "POST" });
      const cached = JSON.parse(localStorage.getItem("gap2grow_live_sessions_cache") || "[]");
      const newCache = cached.map(s => s.id === sessionId ? updated : s);
      localStorage.setItem("gap2grow_live_sessions_cache", JSON.stringify(newCache));
      return updated;
    } catch (err) {
      const cached = JSON.parse(localStorage.getItem("gap2grow_live_sessions_cache") || "[]");
      const newCache = cached.map(s => s.id === sessionId ? { ...s, status: "Completed" } : s);
      localStorage.setItem("gap2grow_live_sessions_cache", JSON.stringify(newCache));
      return newCache.find(s => s.id === sessionId);
    }
  },

  // Faculty Subject Resources / PDFs
  getFacultyPdfs: async (params = {}) => {
    const SERVER_BASE = API_BASE_URL.replace(/\/api\/?$/, "");
    const normalizeResourceUrl = (item) => {
      if (!item || !item.fileUrl) return item;
      let url = item.fileUrl;
      if (url.startsWith("/uploads")) {
        url = `${SERVER_BASE}${url}`;
      }
      return { ...item, fileUrl: url };
    };

    const q = new URLSearchParams(params).toString();
    try {
      const data = await request(`/faculty/pdfs${q ? `?${q}` : ""}`);
      if (Array.isArray(data) && data.length > 0) {
        const normalizedData = data.map(normalizeResourceUrl);
        const existingCached = JSON.parse(localStorage.getItem("gap2grow_faculty_pdfs_cache") || "[]");
        const backendIds = new Set(normalizedData.map(d => d.id));
        const merged = [...normalizedData, ...existingCached.filter(c => !backendIds.has(c.id)).map(normalizeResourceUrl)];
        localStorage.setItem("gap2grow_faculty_pdfs_cache", JSON.stringify(merged));
        return params.subject
          ? merged.filter(item => item.subject && item.subject.toLowerCase().trim() === params.subject.toLowerCase().trim())
          : merged;
      }
      const cached = localStorage.getItem("gap2grow_faculty_pdfs_cache");
      let list = cached ? JSON.parse(cached).map(normalizeResourceUrl) : [];
      if (params.subject) {
        list = list.filter(item => item.subject && item.subject.toLowerCase().trim() === params.subject.toLowerCase().trim());
      }
      return list;
    } catch (err) {
      const cached = localStorage.getItem("gap2grow_faculty_pdfs_cache");
      let list = cached ? JSON.parse(cached).map(normalizeResourceUrl) : [];
      if (params.subject) {
        list = list.filter(item => item.subject && item.subject.toLowerCase().trim() === params.subject.toLowerCase().trim());
      }
      return list;
    }
  },
  uploadFacultyPdf: async (pdfData) => {
    const SERVER_BASE = API_BASE_URL.replace(/\/api\/?$/, "");
    const normalizeResourceUrl = (item) => {
      if (!item || !item.fileUrl) return item;
      let url = item.fileUrl;
      if (url.startsWith("/uploads")) {
        url = `${SERVER_BASE}${url}`;
      }
      return { ...item, fileUrl: url };
    };

    try {
      let created;
      if (pdfData instanceof FormData) {
        const res = await fetch(`${API_BASE_URL}/faculty/upload-file`, {
          method: "POST",
          body: pdfData
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || `HTTP error ${res.status}`);
        }
        created = await res.json();
      } else {
        created = await request("/faculty/upload-pdf", { method: "POST", body: JSON.stringify(pdfData) });
      }
      created = normalizeResourceUrl(created);
      const cached = JSON.parse(localStorage.getItem("gap2grow_faculty_pdfs_cache") || "[]");
      const updated = [created, ...cached.filter(c => c.id !== created.id)];
      localStorage.setItem("gap2grow_faculty_pdfs_cache", JSON.stringify(updated));
      return created;
    } catch (err) {
      console.error("Upload error:", err);
      if (pdfData instanceof FormData) {
        throw err;
      }
      const cached = JSON.parse(localStorage.getItem("gap2grow_faculty_pdfs_cache") || "[]");
      const fallback = {
        id: Date.now(),
        ...pdfData,
        resourceType: pdfData.resourceType || "PDF",
        downloadsCount: 0,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem("gap2grow_faculty_pdfs_cache", JSON.stringify([fallback, ...cached]));
      return fallback;
    }
  },

  // Super Admin & User Profile API
  adminCreateUser: async (userData) => {
    try {
      return await request("/admin/create-user", { method: "POST", body: JSON.stringify(userData) });
    } catch {
      const localUsers = JSON.parse(localStorage.getItem("gap2grow_registered_users") || "[]");
      const newUser = {
        id: Date.now(),
        name: userData.name,
        role: userData.role,
        identifier: userData.identifier,
        email: userData.email,
        password: userData.password,
        department: userData.department || "CSE",
        classTeacherSection: userData.classTeacherSection || "Section A",
        assignedSubject: userData.assignedSubject || "",
        contactNumber: userData.contactNumber || "+91 9876543210",
        college: "Vignan University"
      };
      localUsers.push(newUser);
      localStorage.setItem("gap2grow_registered_users", JSON.stringify(localUsers));
      const { password, ...userObj } = newUser;
      return userObj;
    }
  },
  adminGetUsers: async () => {
    try {
      return await request("/admin/users");
    } catch {
      const localUsers = JSON.parse(localStorage.getItem("gap2grow_registered_users") || "[]");
      const baseList = DEMO_USERS_FALLBACK.map(({ password, ...u }) => u);
      const merged = [...baseList];
      for (const u of localUsers) {
        if (!merged.some(m => m.id === u.id || m.identifier === u.identifier)) {
          const { password, ...cleaned } = u;
          merged.push(cleaned);
        }
      }
      return merged;
    }
  },
  adminUpdateUser: async (userId, userData) => {
    try {
      return await request(`/admin/users/${userId}`, { method: "PUT", body: JSON.stringify(userData) });
    } catch {
      const localUsers = JSON.parse(localStorage.getItem("gap2grow_registered_users") || "[]");
      const updated = localUsers.map(u => u.id === userId ? { ...u, ...userData } : u);
      localStorage.setItem("gap2grow_registered_users", JSON.stringify(updated));
      return { success: true };
    }
  },
  adminUpdateUserSubject: async (userId, subject) => {
    try {
      return await request(`/admin/users/${userId}/subject`, { method: "PUT", body: JSON.stringify({ subject }) });
    } catch {
      const localUsers = JSON.parse(localStorage.getItem("gap2grow_registered_users") || "[]");
      const updated = localUsers.map(u => u.id === userId ? { ...u, assignedSubject: subject } : u);
      localStorage.setItem("gap2grow_registered_users", JSON.stringify(updated));
      return { success: true };
    }
  },
  adminDeleteUser: async (userId) => {
    try {
      return await request(`/admin/users/${userId}`, { method: "DELETE" });
    } catch {
      const localUsers = JSON.parse(localStorage.getItem("gap2grow_registered_users") || "[]");
      const updated = localUsers.filter(u => u.id !== userId);
      localStorage.setItem("gap2grow_registered_users", JSON.stringify(updated));
      return { success: true };
    }
  },
  updateProfile: (userData, params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/user/profile${q ? `?${q}` : ""}`, { method: "PUT", body: JSON.stringify(userData) });
  },

  // Remedial Coordinator & Student Notifications API
  sendRemedialSuggestion: async (suggestionData) => {
    const ident = suggestionData.studentIdentifier || suggestionData.studentId || "23CSE101";
    const notifItem = {
      id: `sugg_${Date.now()}`,
      studentIdentifier: ident,
      title: "Remedial Coordinator Support",
      message: suggestionData.suggestionText,
      type: "remedial_suggestion",
      senderName: suggestionData.sentByName || "Remedial Coordinator",
      subject: suggestionData.subject || "Database Management System",
      createdAt: new Date().toISOString(),
      isRead: false
    };

    // Store in global notifications store as well as student-specific keys
    const globalKey = "gap2grow_global_notifications";
    const globalCached = JSON.parse(localStorage.getItem(globalKey) || "[]");
    localStorage.setItem(globalKey, JSON.stringify([notifItem, ...globalCached.filter(c => c.message !== notifItem.message)]));

    const keysToUpdate = [
      `gap2grow_notifications_${ident}`,
      "gap2grow_notifications_23CSE001",
      "gap2grow_notifications_23CSE101",
      "gap2grow_notifications_23CSE014",
      "gap2grow_notifications_rahul@vignan.ac.in"
    ];

    keysToUpdate.forEach(k => {
      const cached = JSON.parse(localStorage.getItem(k) || "[]");
      localStorage.setItem(k, JSON.stringify([notifItem, ...cached.filter(c => c.message !== notifItem.message)]));
    });

    try {
      const res = await request("/remedial/suggestions", { method: "POST", body: JSON.stringify(suggestionData) });
      return res;
    } catch (err) {
      return { success: true, message: "Suggestion saved locally and notification logged." };
    }
  },

  getStudentNotifications: async (studentIdentifier) => {
    const ident = studentIdentifier || "23CSE001";
    const globalNotifs = JSON.parse(localStorage.getItem("gap2grow_global_notifications") || "[]");
    const localNotifs = JSON.parse(localStorage.getItem(`gap2grow_notifications_${ident}`) || "[]");
    const fallbackNotifs = JSON.parse(localStorage.getItem("gap2grow_notifications_23CSE101") || "[]");

    let combinedLocal = [...localNotifs, ...fallbackNotifs, ...globalNotifs];
    const seenMsgs = new Set();
    combinedLocal = combinedLocal.filter(n => {
      if (seenMsgs.has(n.message)) return false;
      seenMsgs.add(n.message);
      return true;
    });

    try {
      const data = await request(`/student/notifications?student_identifier=${encodeURIComponent(ident)}`);
      if (Array.isArray(data)) {
        const existingMsgs = new Set(data.map(d => d.message));
        const merged = [...data, ...combinedLocal.filter(l => !existingMsgs.has(l.message))];
        return merged;
      }
      return combinedLocal;
    } catch {
      return combinedLocal;
    }
  },
  createRemedialExam: (examData) => request("/remedial/exams", { method: "POST", body: JSON.stringify(examData) }),
  getRemedialExams: () => request("/remedial/exams"),
  getStudentRemedialExams: (studentIdentifier) => request(`/student/remedial-exams?student_identifier=${encodeURIComponent(studentIdentifier)}`),
  submitRemedialExam: (examId, data) => request(`/student/remedial-exams/${examId}/submit`, { method: "POST", body: JSON.stringify(data) })
};

