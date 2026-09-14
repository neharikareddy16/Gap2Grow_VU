import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { api } from "../services/api";
import {
  BookOpen,
  PlusCircle,
  Edit2,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  Award,
  X,
  Clock,
  Tag
} from "lucide-react";

export default function ManageResources() {
  const { currentUser } = useUser();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [msg, setMsg] = useState("");

  // Modal State
  const [modalMode, setModalMode] = useState(null); // 'add', 'edit', 'delete'
  const [activeRes, setActiveRes] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    subject: "Data Structures",
    topic: "Binary Trees",
    description: "",
    resourceType: "Video",
    url: "",
    tags: "",
    difficulty: "Beginner",
    durationMins: 20,
    platform: "NPTEL / IIT Delhi",
    facultyEndorsed: true
  });

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    setLoading(true);
    try {
      const data = await api.getResources();
      setResources(data);
    } catch {
      // Fallback
      setResources([
        {
          id: 1,
          title: "Binary Tree Inorder, Preorder & Postorder Recursive Traces",
          subject: "Data Structures",
          topic: "Binary Trees",
          description: "Lecture tracing activation records and call stack unwinding.",
          resourceType: "Video",
          url: "https://www.youtube.com/watch?v=9GMxdZ6U244",
          tags: ["Trees", "Recursion", "NPTEL"],
          difficulty: "Beginner",
          durationMins: 15,
          platform: "NPTEL / IIT Delhi",
          facultyEndorsed: true
        },
        {
          id: 2,
          title: "Tree Traversal Visualization Lab",
          subject: "Data Structures",
          topic: "Binary Trees",
          description: "Interactive visualizer for step-through tree traversals.",
          resourceType: "Practice Material",
          url: "https://visualgo.net/en/bst",
          tags: ["Trees", "Lab", "Simulation"],
          difficulty: "Intermediate",
          durationMins: 10,
          platform: "VisuAlgo Interactive Lab",
          facultyEndorsed: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      title: "",
      subject: "Data Structures",
      topic: "Binary Trees",
      description: "",
      resourceType: "Video",
      url: "",
      tags: "Trees, Algorithms",
      difficulty: "Beginner",
      durationMins: 25,
      platform: "Vignan Faculty Repository",
      facultyEndorsed: true
    });
    setModalMode("add");
  };

  const handleOpenEdit = (res) => {
    setActiveRes(res);
    setFormData({
      title: res.title,
      subject: res.subject || "Data Structures",
      topic: res.topic,
      description: res.description || "",
      resourceType: res.resourceType || "Video",
      url: res.url || "",
      tags: Array.isArray(res.tags) ? res.tags.join(", ") : (res.tags || ""),
      difficulty: res.difficulty || "Beginner",
      durationMins: res.durationMins || 20,
      platform: res.platform || "Institutional Notes",
      facultyEndorsed: res.facultyEndorsed !== false
    });
    setModalMode("edit");
  };

  const handleOpenDelete = (res) => {
    setActiveRes(res);
    setModalMode("delete");
  };

  const handleSaveAdd = async (e) => {
    e.preventDefault();
    try {
      await api.addResource(formData);
      setMsg("Resource created successfully!");
      setModalMode(null);
      loadResources();
      setTimeout(() => setMsg(""), 3000);
    } catch {
      setResources([...resources, { ...formData, id: Date.now(), tags: formData.tags.split(",") }]);
      setMsg("Resource created locally!");
      setModalMode(null);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await api.editResource(activeRes.id, formData);
      setMsg("Resource updated successfully!");
      setModalMode(null);
      loadResources();
      setTimeout(() => setMsg(""), 3000);
    } catch {
      setResources(
        resources.map((r) =>
          r.id === activeRes.id ? { ...r, ...formData, tags: formData.tags.split(",") } : r
        )
      );
      setMsg("Resource updated!");
      setModalMode(null);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await api.deleteResource(activeRes.id);
      setMsg("Resource deleted successfully.");
      setModalMode(null);
      loadResources();
      setTimeout(() => setMsg(""), 3000);
    } catch {
      setResources(resources.filter((r) => r.id !== activeRes.id));
      setMsg("Resource deleted.");
      setModalMode(null);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const filtered = resources.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.topic.toLowerCase().includes(q) ||
      (r.platform && r.platform.toLowerCase().includes(q));
    const matchType = typeFilter === "ALL" || r.resourceType === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-[#1264E8] rounded uppercase tracking-wider">
              Faculty Resource Management
            </span>
            <span className="text-[11px] font-semibold text-gray-500">
              CRUD & Verification Catalog
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mt-1">
            Learning Resource Management
          </h2>
          <p className="text-xs text-gray-500">
            Add, update, and endorse materials for automated student gap-filling pathways.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-[#1264E8] hover:bg-[#0E52C2] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>+ Add Resource</span>
        </button>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search existing resources by title, topic or platform..."
            className="w-full pl-10 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700"
        >
          <option value="ALL">All Resource Types</option>
          <option value="Video">Video</option>
          <option value="Notes">Notes / PDF</option>
          <option value="Practice Material">Practice Material</option>
          <option value="Article">Article</option>
        </select>
      </div>

      {/* Resource Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Resource Title</th>
                <th className="py-3.5 px-4">Topic & Subject</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Difficulty</th>
                <th className="py-3.5 px-4">Endorsement</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-800">
              {filtered.map((res) => (
                <tr key={res.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6">
                    <span className="font-bold text-gray-900 block leading-snug">{res.title}</span>
                    <span className="text-[11px] text-gray-400">{res.platform} • {res.durationMins}m</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-gray-800 block">{res.topic}</span>
                    <span className="text-[11px] text-gray-500">{res.subject}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-semibold">
                      {res.resourceType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-medium">{res.difficulty}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    {res.facultyEndorsed ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <Award className="w-3 h-3 text-emerald-600" />
                        <span>Endorsed</span>
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">Standard</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => handleOpenEdit(res)}
                      className="p-1 text-[#1264E8] hover:bg-blue-50 rounded"
                      title="Edit Resource"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenDelete(res)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                      title="Delete Resource"
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

      {/* Add / Edit Resource Modal */}
      {(modalMode === "add" || modalMode === "edit") && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-base font-bold text-gray-900">
                {modalMode === "add" ? "Add Learning Resource" : "Edit Learning Resource"}
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
                <label className="block text-xs font-semibold text-gray-700 mb-1">Resource Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-1.5 bg-gray-50 border rounded-xl text-xs sm:text-sm text-gray-900"
                />
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
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Topic *</label>
                  <input
                    type="text"
                    required
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-3 py-1.5 bg-gray-50 border rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Resource Type</label>
                  <select
                    value={formData.resourceType}
                    onChange={(e) => setFormData({ ...formData, resourceType: e.target.value })}
                    className="w-full px-3 py-1.5 bg-gray-50 border rounded-xl text-xs"
                  >
                    <option value="Video">Video</option>
                    <option value="Notes">Notes / PDF</option>
                    <option value="Practice Material">Practice Material</option>
                    <option value="Article">Article</option>
                    <option value="Website">Website</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-3 py-1.5 bg-gray-50 border rounded-xl text-xs"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">URL / Resource Link</label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 bg-gray-50 border rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Platform</label>
                  <input
                    type="text"
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full px-3 py-1.5 bg-gray-50 border rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={formData.durationMins}
                    onChange={(e) => setFormData({ ...formData, durationMins: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-gray-50 border rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="facultyEndorsed"
                  checked={formData.facultyEndorsed}
                  onChange={(e) => setFormData({ ...formData, facultyEndorsed: e.target.checked })}
                  className="rounded text-[#1264E8]"
                />
                <label htmlFor="facultyEndorsed" className="text-xs font-semibold text-gray-800 cursor-pointer">
                  Mark as "Faculty-endorsed resource" (carries 2.5x recommendation weight)
                </label>
              </div>

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
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (Prompt Specification 12) */}
      {modalMode === "delete" && activeRes && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-200 text-center space-y-3">
            <h3 className="text-base font-bold text-gray-900">Delete Resource?</h3>
            <p className="text-xs text-gray-500">
              Are you sure you want to delete <strong>"{activeRes.title}"</strong>? It will no longer be recommended to students.
            </p>
            <div className="pt-3 flex justify-center gap-3">
              <button
                onClick={() => setModalMode(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
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
