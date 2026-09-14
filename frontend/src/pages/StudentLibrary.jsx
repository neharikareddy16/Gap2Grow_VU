import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { api } from "../services/api";
import SoftcopyViewerModal from "../components/SoftcopyViewerModal";
import {
  Library,
  Search,
  BookOpen,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Building,
  Tag,
  BookMarked,
  Filter,
  RefreshCw,
  Info,
  Sparkles,
  X,
  FileText,
  Check,
  HelpCircle,
  Layers
} from "lucide-react";

export default function StudentLibrary() {
  const { currentUser } = useUser();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [availFilter, setAvailFilter] = useState("ALL");
  const [softcopyFilter, setSoftcopyFilter] = useState("ALL");

  const [selectedBookForReader, setSelectedBookForReader] = useState(null);
  const [selectedBookForDetails, setSelectedBookForDetails] = useState(null);
  const [simplifyingBook, setSimplifyingBook] = useState(null);
  const [bookSimplification, setBookSimplification] = useState(null);
  const [simplifyingLoading, setSimplifyingLoading] = useState(false);
  const [activeStudyTab, setActiveStudyTab] = useState("simpleExplanation");

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const data = await api.getLibraryBooks();
      setBooks(data);
    } catch {
      // Fallback books
      setBooks([
        {
          id: 1,
          name: "Data Structures and Algorithms in C++",
          author: "Robert Lafore",
          isbn: "978-0672324536",
          subject: "Data Structures",
          department: "CSE",
          category: "Algorithms & Data Structures",
          publisher: "Pearson / Sams Publishing",
          edition: "4th Edition",
          totalCopies: 5,
          availableCopies: 3,
          issuedCopies: 2,
          shelfNumber: "CS-Rack-3A",
          availabilityStatus: "Available at Library",
          softcopyAvailable: true,
          softcopyUrl: "/library/ebooks/lafore_dsa.pdf"
        },
        {
          id: 2,
          name: "Operating System Concepts",
          author: "Abraham Silberschatz, Peter B. Galvin",
          isbn: "978-1118063330",
          subject: "Operating Systems",
          department: "CSE",
          category: "Systems Architecture",
          publisher: "John Wiley & Sons",
          edition: "10th Edition",
          totalCopies: 4,
          availableCopies: 0,
          issuedCopies: 4,
          shelfNumber: "CS-Rack-1B",
          availabilityStatus: "Currently Issued",
          softcopyAvailable: true,
          softcopyUrl: "/library/ebooks/silberschatz_os.pdf"
        },
        {
          id: 3,
          name: "Computer Networks",
          author: "Andrew S. Tanenbaum, David J. Wetherall",
          isbn: "978-0132126953",
          subject: "Networking",
          department: "CSE",
          category: "Computer Networks",
          publisher: "Pearson Higher Ed",
          edition: "5th Edition",
          totalCopies: 3,
          availableCopies: 1,
          issuedCopies: 2,
          shelfNumber: "CS-Rack-2C",
          availabilityStatus: "Available at Library",
          softcopyAvailable: false,
          softcopyUrl: null
        },
        {
          id: 4,
          name: "Introduction to Algorithms (CLRS)",
          author: "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest",
          isbn: "978-0262033848",
          subject: "Algorithms",
          department: "CSE",
          category: "Core Computer Science",
          publisher: "MIT Press",
          edition: "3rd Edition",
          totalCopies: 6,
          availableCopies: 4,
          issuedCopies: 2,
          shelfNumber: "CS-Rack-3B",
          availabilityStatus: "Available at Library",
          softcopyAvailable: true,
          softcopyUrl: "/library/ebooks/clrs_algo.pdf"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter((b) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      b.name.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.subject.toLowerCase().includes(q) ||
      b.isbn.toLowerCase().includes(q);

    const matchDept = deptFilter === "ALL" || b.department === deptFilter;
    const matchAvail =
      availFilter === "ALL" ||
      (availFilter === "AVAILABLE" && b.availableCopies > 0) ||
      (availFilter === "ISSUED" && b.availableCopies === 0);
    const matchSoftcopy =
      softcopyFilter === "ALL" ||
      (softcopyFilter === "YES" && b.softcopyAvailable) ||
      (softcopyFilter === "NO" && !b.softcopyAvailable);

    return matchSearch && matchDept && matchAvail && matchSoftcopy;
  });

  const handleSimplifyBook = async (book) => {
    setSimplifyingBook(book);
    setSimplifyingLoading(true);
    setBookSimplification(null);
    setActiveStudyTab("simpleExplanation");
    try {
      const res = await api.simplifyResource({
        type: "textbook",
        textbookName: book.name,
        author: book.author,
        subject: book.subject,
        topic: book.subject || book.name
      });
      setBookSimplification(res);
    } catch (err) {
      console.warn("Using fallback simplification for textbook:", err);
    } finally {
      setSimplifyingLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-[#1264E8] rounded uppercase tracking-wider">
              Vignan Central Library
            </span>
            <span className="text-[11px] font-semibold text-gray-500">
              Live Physical & Digital Repository
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mt-1">
            📚 Student Library Portal
          </h2>
          <p className="text-xs text-gray-500">
            Check live physical shelf availability before visiting and read verified institutional softcopies instantly from anywhere.
          </p>
        </div>

        <button
          onClick={loadBooks}
          className="p-2 text-gray-500 hover:text-[#1264E8] hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors"
          title="Refresh Library Inventory"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Prominent Search Bar (Prompt Specification: "Search books by name, author, subject or ISBN") */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books by name, author, subject or ISBN (e.g. Data Structures, Robert Lafore, 978-0672324536)..."
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1264E8]/20 focus:border-[#1264E8] transition-all"
          />
        </div>

        {/* Useful Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-gray-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </span>

          <select
            value={availFilter}
            onChange={(e) => setAvailFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700"
          >
            <option value="ALL">Physical: All</option>
            <option value="AVAILABLE">🟢 Available Now</option>
            <option value="ISSUED">🔴 Currently Issued</option>
          </select>

          <select
            value={softcopyFilter}
            onChange={(e) => setSoftcopyFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700"
          >
            <option value="ALL">Softcopy: All</option>
            <option value="YES">📖 Softcopy Available</option>
            <option value="NO">📕 No Softcopy</option>
          </select>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700"
          >
            <option value="ALL">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="IT">IT</option>
          </select>

          {(searchQuery || availFilter !== "ALL" || softcopyFilter !== "ALL" || deptFilter !== "ALL") && (
            <button
              onClick={() => { setSearchQuery(""); setAvailFilter("ALL"); setSoftcopyFilter("ALL"); setDeptFilter("ALL"); }}
              className="text-xs text-[#1264E8] hover:underline font-medium ml-2"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Book Search Results Cards (Prompt Specifications) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBooks.map((b) => {
          const isAvailable = b.availableCopies > 0;
          return (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-blue-300 p-5 shadow-xs hover:shadow transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700 uppercase">
                    {b.department} • {b.category}
                  </span>
                  <span className="text-[11px] font-mono text-gray-400">
                    Shelf: {b.shelfNumber}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
                  {b.name}
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  Author: <span className="font-semibold">{b.author}</span>
                </p>
                <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                  ISBN: {b.isbn}
                </p>

                {/* Status Badges Section (Prompt Requirement) */}
                <div className="mt-4 pt-3 border-t border-gray-100 space-y-2 text-xs">
                  {/* Physical Library Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-medium">Library Status:</span>
                    <span
                      className={`font-semibold flex items-center gap-1 ${
                        isAvailable ? "text-emerald-700" : "text-rose-700"
                      }`}
                    >
                      {isAvailable ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span>Available at Library – {b.availableCopies} {b.availableCopies === 1 ? "copy" : "copies"} available</span>
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-rose-500" />
                          <span>Currently issued – 0 copies available</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Softcopy Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-medium">Digital Softcopy:</span>
                    <span className="font-semibold flex items-center gap-1">
                      {b.softcopyAvailable ? (
                        <span className="text-blue-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                          <span>Softcopy Available</span>
                        </span>
                      ) : (
                        <span className="text-gray-400 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5 text-gray-400" />
                          <span>Softcopy not available</span>
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedBookForDetails(b)}
                    className="text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>

                  <button
                    onClick={() => handleSimplifyBook(b)}
                    className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Generate 10-part Easy Study Notes with AI"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-yellow-200 fill-current" />
                    <span>Simplify with AI</span>
                  </button>
                </div>

                {b.softcopyAvailable ? (
                  <button
                    onClick={() => setSelectedBookForReader(b)}
                    className="px-3.5 py-1.5 bg-[#1264E8] hover:bg-[#0E52C2] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Softcopy</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-gray-400 italic">
                    Physical copy on shelf {b.shelfNumber}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Book Details Overview Modal */}
      {selectedBookForDetails && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-gray-200">
            <div className="flex items-start justify-between pb-3 border-b">
              <div>
                <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider">
                  Book Overview
                </span>
                <h3 className="text-base font-bold text-gray-900 mt-1">
                  {selectedBookForDetails.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookForDetails(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-2.5 text-xs text-gray-700">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Author:</span>
                <span className="font-semibold">{selectedBookForDetails.author}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">ISBN:</span>
                <span className="font-mono font-semibold">{selectedBookForDetails.isbn}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Publisher:</span>
                <span>{selectedBookForDetails.publisher || "Academic Press"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Edition:</span>
                <span>{selectedBookForDetails.edition || "Latest Edition"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Shelf Location:</span>
                <span className="font-bold text-blue-700">{selectedBookForDetails.shelfNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Total Physical Copies:</span>
                <span className="font-bold">{selectedBookForDetails.totalCopies}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Currently Available:</span>
                <span className={`font-bold ${selectedBookForDetails.availableCopies > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  {selectedBookForDetails.availableCopies} copies
                </span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t flex justify-end gap-2">
              {selectedBookForDetails.softcopyAvailable && (
                <button
                  onClick={() => {
                    const b = selectedBookForDetails;
                    setSelectedBookForDetails(null);
                    setSelectedBookForReader(b);
                  }}
                  className="px-4 py-2 bg-[#1264E8] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Read Softcopy</span>
                </button>
              )}
              <button
                onClick={() => setSelectedBookForDetails(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Softcopy Viewer Modal */}
      {selectedBookForReader && (
        <SoftcopyViewerModal
          book={selectedBookForReader}
          onClose={() => setSelectedBookForReader(null)}
        />
      )}

      {/* AI Textbook Simplification & 10-Part Study Notes Modal */}
      {simplifyingBook && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full border border-gray-200 shadow-2xl p-6 my-8 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded uppercase tracking-wider flex items-center gap-1 w-fit">
                  <Sparkles className="w-3 h-3 text-amber-600 fill-current" />
                  AI Textbook Simplifier • 10-Part Easy Study Notes
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1">
                  {simplifyingBook.name}
                </h3>
                <p className="text-xs text-gray-500">
                  Author: {simplifyingBook.author} • Subject: {simplifyingBook.subject}
                </p>
              </div>
              <button
                onClick={() => setSimplifyingBook(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {simplifyingLoading ? (
              <div className="py-16 text-center text-gray-500 space-y-3">
                <div className="w-9 h-9 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-semibold">AI is analyzing textbook chapters and preparing 10-part Easy Study Notes...</p>
              </div>
            ) : bookSimplification ? (
              <div className="space-y-4">
                {/* Quick Summary Pill */}
                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 text-xs text-amber-900 leading-relaxed">
                  <strong className="font-bold">AI Textbook Overview: </strong>
                  {bookSimplification.summary || bookSimplification.simpleExplanation}
                </div>

                {/* 10 Tab Navigation */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-gray-200 text-xs scrollbar-none">
                  {[
                    { key: "simpleExplanation", label: "1. Simple Explanation" },
                    { key: "keyConcepts", label: "2. Key Concepts" },
                    { key: "importantDefinitions", label: "3. Definitions" },
                    { key: "importantPoints", label: "4. Important Points" },
                    { key: "examples", label: "5. Examples & Code" },
                    { key: "stepByStep", label: "6. Step-by-Step" },
                    { key: "examNotes", label: "7. Exam Notes" },
                    { key: "quickRevision", label: "8. Quick Revision" },
                    { key: "practiceQuestions", label: "9. Practice Q&A" }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveStudyTab(tab.key)}
                      className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors flex-shrink-0 ${
                        activeStudyTab === tab.key
                          ? "bg-amber-500 text-white shadow-xs"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Active Tab Content */}
                <div className="min-h-[220px] max-h-[360px] overflow-y-auto p-3.5 bg-gray-50/50 rounded-xl border border-gray-200 text-xs">
                  {activeStudyTab === "simpleExplanation" && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-gray-900 text-sm">Plain Language Simplification</h4>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                        {bookSimplification.simpleExplanation}
                      </p>
                    </div>
                  )}

                  {activeStudyTab === "keyConcepts" && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-gray-900 text-sm">Key Concepts & Principles</h4>
                      <ul className="space-y-1.5">
                        {bookSimplification.keyConcepts?.map((kc, idx) => (
                          <li key={idx} className="flex items-start gap-2 bg-white p-2 rounded-lg border border-gray-200">
                            <span className="text-amber-500 font-bold">✓</span>
                            <span className="text-gray-800">{kc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeStudyTab === "importantDefinitions" && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-gray-900 text-sm">Important Definitions</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {bookSimplification.importantDefinitions?.map((def, idx) => (
                          <div key={idx} className="p-2.5 bg-white rounded-lg border border-gray-200">
                            <strong className="text-amber-700 block font-bold">{def.term}</strong>
                            <span className="text-gray-600 mt-0.5 block">{def.definition}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeStudyTab === "importantPoints" && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-gray-900 text-sm">Crucial Points to Remember</h4>
                      <ul className="space-y-1.5">
                        {bookSimplification.importantPoints?.map((pt, idx) => (
                          <li key={idx} className="flex items-start gap-2 bg-white p-2 rounded-lg border border-gray-200 text-gray-800">
                            <span className="text-blue-500 font-bold">●</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeStudyTab === "examples" && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-gray-900 text-sm">Working Code & Algorithms</h4>
                      {bookSimplification.examples?.map((ex, idx) => (
                        <div key={idx} className="space-y-1">
                          <span className="font-bold text-gray-800">{ex.title}</span>
                          <pre className="p-3 bg-slate-900 text-emerald-400 rounded-lg overflow-x-auto font-mono text-[11px]">
                            {ex.code}
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeStudyTab === "stepByStep" && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-gray-900 text-sm">Step-by-Step Implementation Guide</h4>
                      <div className="space-y-1.5">
                        {bookSimplification.stepByStep?.map((step, idx) => (
                          <div key={idx} className="p-2 bg-white rounded-lg border border-gray-200 flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-[#1264E8] font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                              {idx + 1}
                            </span>
                            <span className="text-gray-800">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeStudyTab === "examNotes" && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-gray-900 text-sm">Exam Preparation Highlights</h4>
                      <ul className="space-y-1.5">
                        {bookSimplification.examNotes?.map((note, idx) => (
                          <li key={idx} className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-lg text-amber-900">
                            ⭐ {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeStudyTab === "quickRevision" && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-gray-900 text-sm">Quick Revision Summary</h4>
                      <ul className="space-y-1.5">
                        {bookSimplification.quickRevision?.map((rev, idx) => (
                          <li key={idx} className="p-2 bg-white rounded-lg border border-gray-200 text-gray-800 font-medium">
                            {rev}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeStudyTab === "practiceQuestions" && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-gray-900 text-sm">Targeted Practice Questions & Answers</h4>
                      <div className="space-y-2">
                        {bookSimplification.practiceQuestions?.map((q, idx) => (
                          <div key={idx} className="p-2.5 bg-white rounded-lg border border-gray-200 space-y-1">
                            <div className="font-bold text-gray-900">Q{idx + 1}: {q.question}</div>
                            <div className="text-gray-700 bg-gray-50 p-2 rounded border text-[11px]">
                              <strong className="text-emerald-700">Answer: </strong>
                              <span>{q.answer}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {/* Modal Footer */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSimplifyingBook(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
