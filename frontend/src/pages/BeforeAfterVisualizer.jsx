import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { api } from "../services/api";
import {
  TrendingUp,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  BookOpen
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

const SUBJECT_OPTIONS = [
  { id: "", name: "All Subjects" },
  { id: "dbms", name: "Database Management Systems" },
  { id: "data-structures", name: "Data Structures" },
  { id: "oop", name: "Object Oriented Programming" },
  { id: "operating-systems", name: "Operating Systems" },
  { id: "computer-networks", name: "Computer Networks" },
  { id: "digital-logic", name: "Digital Logic Design" },
  { id: "data-visualization", name: "Data Visualization & Handling" }
];

export default function BeforeAfterVisualizer() {
  const { currentUser } = useUser();
  const [selectedSubject, setSelectedSubject] = useState("");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData(selectedSubject);
  }, [selectedSubject]);

  const fetchData = async (subjectKey) => {
    setLoading(true);
    try {
      const data = await api.getBeforeAfter(subjectKey);
      setAnalyticsData(data);
    } catch (err) {
      console.error("Failed to fetch before-after data:", err);
    } finally {
      setLoading(false);
    }
  };

  const summary = analyticsData?.summary || { beforeAvg: 40, afterAvg: 80, overallGain: 40 };
  const topics = analyticsData?.topics || [];

  return (
    <div className="space-y-6">
      {/* Header with Subject Selector */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-[#1264E8] rounded uppercase tracking-wider">
              Subject-Wise Analytics
            </span>
            <span className="text-[11px] font-semibold text-gray-500">
              Adaptation & Progress Agent
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mt-1">
            Before vs After Personalized Learning Path
          </h2>
          <p className="text-xs text-gray-500">
            Empirical improvement tracking for <strong className="text-gray-900">{currentUser?.name}</strong> filtered strictly by selected subject.
          </p>
        </div>

        {/* Subject Filter Dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-bold text-gray-700">Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#1264E8] focus:outline-none cursor-pointer"
            >
              {SUBJECT_OPTIONS.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 text-xs font-bold">
            <TrendingUp className="w-4 h-4" />
            <span>Average Gain: +{summary.overallGain}%</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {topics.slice(0, 3).map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-[#1264E8]" />
              {item.topic}
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-rose-600 font-mono">{item.before}%</span>
              <span className="text-sm font-bold text-gray-400">→</span>
              <span className="text-3xl font-black text-emerald-600 font-mono">{item.after}%</span>
            </div>
            <p className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+{item.gain}% Competency Gain</span>
            </p>
          </div>
        ))}
      </div>

      {/* Comparative Charts: Side-by-Side Bar Chart and Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Subject-Specific Competency Growth
              </h3>
              <p className="text-[11px] text-gray-500">
                Diagnostic baseline (Before) vs Post-Remediation accuracy (After)
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1 text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Before AI
              </span>
              <span className="flex items-center gap-1 text-[#1264E8]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1264E8]" /> After Path
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topics} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="topic" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ borderRadius: 10, fontSize: 12, border: "1px solid #E5E7EB" }}
                  formatter={(val, name) => [`${val}%`, name === "before" ? "Before AI Path" : "After AI Path"]}
                />
                <Bar dataKey="before" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="after" fill="#1264E8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Topic Coverage Footprint
              </h3>
              <p className="text-[11px] text-gray-500">
                Proficiency polygon for {selectedSubject ? SUBJECT_OPTIONS.find(s => s.id === selectedSubject)?.name : "All Subjects"}
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={topics} outerRadius="70%">
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis dataKey="topic" tick={{ fontSize: 10, fill: "#4B5563" }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar name="Before" dataKey="before" stroke="#94A3B8" fill="#94A3B8" fillOpacity={0.3} />
                <Radar name="After" dataKey="after" stroke="#1264E8" fill="#1264E8" fillOpacity={0.5} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
