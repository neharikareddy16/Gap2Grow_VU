import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { api } from "../services/api";
import {
  Library,
  BookOpen,
  PlusCircle,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ArrowDownCircle,
  ArrowUpCircle,
  RefreshCw,
  BookMarked,
  Filter
} from "lucide-react";

export default function LibraryDashboard() {
  const { currentUser } = useUser();
  const [stats, setStats] = useState({
    totalBooks: 6,
    availableCopies: 12,
    issuedCopies: 11,
    withSoftcopy: 5,
    withoutSoftcopy: 1,
    recentlyAdded: 6
  });
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  // Modals
  const [modalMode, setModalMode] = useState(null); // 'add', 'edit', 'delete'
  const [activeBook, setActiveBook] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    author: "",
    isbn: "",
    subject: "Computer Science",
    department: "CSE",
    category: "Core Computer Science",
    publisher: "Pearson / MIT Press",
    edition: "3rd Edition",
    totalCopies: 5,
    shelfNumber: "CS-Rack-1A",
    softcopyAvailable: true,
    softcopyUrl: ""
  });

  useEffect(() => {
    loadLibraryData();
  }, []);

  const loadLibraryData = async () => {
    setLoading(true);
    try {
      const s = await api.getLibraryStats();
      setStats(s);
      const b = await api.getLibraryBooks();
      setBooks(b);
    } catch {
      // Fallback
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
          softcopyAvailable: false,
          softcopyUrl: null
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      author: "",
      isbn: "",
      subject: "Computer Science",
      department: "CSE",
      category: "Algorithms & Data Structures",
      publisher: "McGraw-Hill",
      edition: "2nd Edition",
      totalCopies: 5,
      shelfNumber: "CS-Rack-2A",
      softcopyAvailable: true,
      softcopyUrl: "https://vignan.ac.in/library/digital-copy.pdf"
    });
    setModalMode("add");
  };

  const handleOpenEdit = (b) => {
    setActiveBook(b);
    setFormData({
      name: b.name,
      author: b.author,
      isbn: b.isbn,
      subject: b.subject || "Computer Science",
      department: b.department || "CSE",
      category: b.category || "Core",
      publisher: b.publisher || "",
      edition: b.edition || "1st Edition",
      totalCopies: b.totalCopies || 5,
      shelfNumber: b.shelfNumber || "CS-1A",
      softcopyAvailable: b.softcopyAvailable,
      softcopyUrl: b.softcopyUrl || ""
    });
    setModalMode("edit");
  };

  const handleSaveAdd = async (e) => {
    e.preventDefault();
    try {
      await api.addBook(formData);
      setMsg("New book successfully cataloged!");
      setModalMode(null);
      loadLibraryData();
      setTimeout(() => setMsg(""), 3000);
    } catch {
      setBooks([...books, { ...formData, id: Date.now(), availableCopies: formData.totalCopies, issuedCopies: 0 }]);
      setMsg("New book cataloged locally!");
      setModalMode(null);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await api.editBook(activeBook.id, formData);
      setMsg("Book details updated successfully!");
      setModalMode(null);
      loadLibraryData();
      setTimeout(() => setMsg(""), 3000);
    } catch {
      setBooks(books.map((b) => (b.id === activeBook.id ? { ...b, ...formData } : b)));
      setMsg("Book details updated!");
      setModalMode(null);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const handleDeleteBook = async () => {
    try {
      await api.deleteBook(activeBook.id);
      setMsg("Book removed from library catalogue.");
      setModalMode(null);
      loadLibraryData();
      setTimeout(() => setMsg(""), 3000);
    } catch {
      setBooks(books.filter((b) => b.id !== activeBook.id));
      setMsg("Book removed.");
      setModalMode(null);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const handleIssueCopy = async (bookId) => {
    try {
      await api.issueBook(bookId);
      loadLibraryData();
      setMsg("Physical copy issued! Available count decreased.");
      setTimeout(() => setMsg(""), 2500);
    } catch (err) {
      alert(err.message || "Failed to issue copy. Check available count.");
    }
  };

  const handleReturnCopy = async (bookId) => {
    try {
      await api.returnBook(bookId);
      loadLibraryData();
      setMsg("Physical copy returned! Available count increased.");
      setTimeout(() => setMsg(""), 2500);
    } catch (err) {
      alert(err.message || "Failed to return copy.");
    }
  };

  const filtered = books.filter((b) => {
    const q = search.toLowerCase();
    return (
      !q ||
      b.name.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.isbn.toLowerCase().includes(q) ||
      b.subject.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 bg-purple-100 text-purple-800 rounded uppercase tracking-wider">
              Library Administration
            </span>
            <span className="text-[11px] font-semibold text-gray-500">
              Vignan Central Repositories
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mt-1">
            Library Management Dashboard
          </h2>
          <p className="text-xs text-gray-500">
            Catalog physical textbook inventory, track live issued copies, and manage digital softcopy access.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-[#1264E8] hover:bg-[#0E52C2] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>+ Add Book</span>
        </button>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      {/* Library KPI Summary Cards (Prompt Specification 1) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs text-center">
          <span className="text-[10px] text-gray-400 font-bold uppercase block">Total Titles</span>
          <p className="text-2xl font-black text-gray-900 font-mono mt-0.5">{stats.totalBooks}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs text-center">
          <span className="text-[10px] text-emerald-600 font-bold uppercase block">Available Copies</span>
          <p className="text-2xl font-black text-emerald-600 font-mono mt-0.5">{stats.availableCopies}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs text-center">
          <span className="text-[10px] text-rose-600 font-bold uppercase block">Issued Copies</span>
          <p className="text-2xl font-black text-rose-600 font-mono mt-0.5">{stats.issuedCopies}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs text-center">
          <span className="text-[10px] text-blue-600 font-bold uppercase block">With Softcopy</span>
          <p className="text-2xl font-black text-blue-600 font-mono mt-0.5">{stats.withSoftcopy}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs text-center">
          <span className="text-[10px] text-amber-600 font-bold uppercase block">No Softcopy</span>
          <p className="text-2xl font-black text-amber-600 font-mono mt-0.5">{stats.withoutSoftcopy}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs text-center">
          <span className="text-[10px] text-purple-600 font-bold uppercase block">Recently Added</span>
          <p className="text-2xl font-black text-purple-600 font-mono mt-0.5">{stats.recentlyAdded}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search library records by book name, author, subject or ISBN..."
            className="w-full pl-10 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none"
          />
        </div>
      </div>

      {/* Book Inventory Management Table (Prompt Specification 2, 11, 12) */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-[#E5E7EB] bg-gray-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              Active Book Inventory & Live Circulation Status
            </h3>
            <p className="text-xs text-gray-500">
              Issuing or returning physical copies directly syncs student library availability.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Book Title & Author</th>
                <th className="py-3.5 px-4">Subject & Shelf</th>
                <th className="py-3.5 px-4 text-center">Total</th>
                <th className="py-3.5 px-4 text-center">Available</th>
                <th className="py-3.5 px-4 text-center">Issued</th>
                <th className="py-3.5 px-4">Digital Softcopy</th>
                <th className="py-3.5 px-4 text-center">Issue / Return</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-800">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6">
                    <span className="font-bold text-gray-900 block leading-snug">{b.name}</span>
                    <span className="text-[11px] text-gray-500 font-medium">By {b.author} • ISBN: {b.isbn}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-gray-800 block">{b.subject}</span>
                    <span className="text-[11px] text-blue-700 font-mono font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                      {b.shelfNumber}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-gray-800">
                    {b.totalCopies}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold">
                    <span className={b.availableCopies > 0 ? "text-emerald-600" : "text-rose-600"}>
                      {b.availableCopies}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-rose-600">
                    {b.issuedCopies}
                  </td>
                  <td className="py-3.5 px-4">
                    {b.softcopyAvailable ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        <CheckCircle2 className="w-3 h-3 text-blue-600" />
                        <span>Available</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                        <XCircle className="w-3 h-3 text-gray-400" />
                        <span>No Softcopy</span>
                      </span>
                    )}
                  </td>

                  {/* Quick Issue / Return Copy (Prompt Specification 12) */}
                  <td className="py-3.5 px-4 text-center space-x-1 whitespace-nowrap">
                    <button
                      onClick={() => handleIssueCopy(b.id)}
                      disabled={b.availableCopies <= 0}
                      className="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 disabled:opacity-30 rounded text-[11px] font-bold border border-amber-200 cursor-pointer"
                      title="Issue 1 Copy to Student"
                    >
                      Issue -1
                    </button>
                    <button
                      onClick={() => handleReturnCopy(b.id)}
                      disabled={b.issuedCopies <= 0}
                      className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-30 rounded text-[11px] font-bold border border-emerald-200 cursor-pointer"
                      title="Return 1 Copy to Shelf"
                    >
                      Return +1
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                    <button
                      onClick={() => handleOpenEdit(b)}
                      className="p-1 text-[#1264E8] hover:bg-blue-50 rounded"
                      title="Edit Book Details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setActiveBook(b); setModalMode("delete"); }}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                      title="Delete Book"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Book Modal */}
      {(modalMode === "add" || modalMode === "edit") && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-base font-bold text-gray-900">
                {modalMode === "add" ? "Add New Library Book" : "Edit Book Details"}
              </h3>
              <button
                onClick={() => setModalMode(null)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={modalMode === "add" ? handleSaveAdd : handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Book Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-1.5 bg-gray-50 border rounded-xl text-xs sm:text-sm text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Author *</label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-1.5 bg-gray-50 border rounded-xl text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">ISBN *</label>
                  <input
                    type="text"
                    required
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    className="w-full px-3 py-1.5 bg-gray-50 border rounded-xl text-xs sm:text-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-1.5 bg-gray-50 border rounded-xl text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Shelf Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.shelfNumber}
                    onChange={(e) => setFormData({ ...formData, shelfNumber: e.target.value })}
                    placeholder="e.g. CS-Rack-3A"
                    className="w-full px-3 py-1.5 bg-gray-50 border rounded-xl text-xs sm:text-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Total Physical Copies</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.totalCopies}
                    onChange={(e) => setFormData({ ...formData, totalCopies: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-gray-50 border rounded-xl text-xs sm:text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-1.5 bg-gray-50 border rounded-xl text-xs"
                  >
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="AIML">AIML</option>
                    <option value="IT">IT</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="softcopyToggle"
                  checked={formData.softcopyAvailable}
                  onChange={(e) => setFormData({ ...formData, softcopyAvailable: e.target.checked })}
                  className="rounded text-[#1264E8]"
                />
                <label htmlFor="softcopyToggle" className="text-xs font-semibold text-gray-800 cursor-pointer">
                  Softcopy Available: Yes (Permit digital reading access)
                </label>
              </div>

              {formData.softcopyAvailable && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Softcopy File URL / Repository Link</label>
                  <input
                    type="text"
                    value={formData.softcopyUrl}
                    onChange={(e) => setFormData({ ...formData, softcopyUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 bg-gray-50 border rounded-xl text-xs"
                  />
                </div>
              )}

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1264E8] text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {modalMode === "delete" && activeBook && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-200 text-center space-y-3">
            <h3 className="text-base font-bold text-gray-900">Remove Book from Catalogue?</h3>
            <p className="text-xs text-gray-500">
              Are you sure you want to remove <strong>"{activeBook.name}"</strong>? Students will no longer find this book in search results.
            </p>
            <div className="pt-3 flex justify-center gap-3">
              <button
                onClick={() => setModalMode(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBook}
                className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
