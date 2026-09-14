const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

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
  getDemoUsers: () => request("/auth/demo-users"),
  login: (credentials) => request("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  register: (userData) => request("/auth/register", { method: "POST", body: JSON.stringify(userData) }),
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
  chat: (message, userContext, history = [], sessionId = "default") => 
    request("/ai/chat", { method: "POST", body: JSON.stringify({ message, userContext, history, sessionId }) }),

  simplifyResource: (payload) => request("/ai/simplify", { method: "POST", body: JSON.stringify(payload) }),
  simplifyFile: async (formData) => {
    const res = await fetch(`${API_BASE_URL}/ai/simplify-file`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || `HTTP error ${res.status}`);
    }
    return await res.json();
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
  adminCreateUser: (userData) => request("/admin/create-user", { method: "POST", body: JSON.stringify(userData) }),
  adminGetUsers: () => request("/admin/users"),
  adminUpdateUser: (userId, userData) => request(`/admin/users/${userId}`, { method: "PUT", body: JSON.stringify(userData) }),
  adminUpdateUserSubject: (userId, subject) => request(`/admin/users/${userId}/subject`, { method: "PUT", body: JSON.stringify({ subject }) }),
  adminDeleteUser: (userId) => request(`/admin/users/${userId}`, { method: "DELETE" }),
  updateProfile: (userData, params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/user/profile${q ? `?${q}` : ""}`, { method: "PUT", body: JSON.stringify(userData) });
  },

  // Remedial Coordinator & Student Notifications API
  sendRemedialSuggestion: (suggestionData) => request("/remedial/suggestions", { method: "POST", body: JSON.stringify(suggestionData) }),
  getStudentNotifications: (studentIdentifier) => request(`/student/notifications?student_identifier=${encodeURIComponent(studentIdentifier)}`),
  createRemedialExam: (examData) => request("/remedial/exams", { method: "POST", body: JSON.stringify(examData) }),
  getRemedialExams: () => request("/remedial/exams"),
  getStudentRemedialExams: (studentIdentifier) => request(`/student/remedial-exams?student_identifier=${encodeURIComponent(studentIdentifier)}`),
  submitRemedialExam: (examId, data) => request(`/student/remedial-exams/${examId}/submit`, { method: "POST", body: JSON.stringify(data) }),
};


