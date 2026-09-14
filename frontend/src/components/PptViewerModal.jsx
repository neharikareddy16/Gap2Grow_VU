import React, { useState, useEffect } from "react";
import { SERVER_BASE } from "../services/api";
import {
  X,
  Presentation,
  Download,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  BookOpen,
  Sparkles,
  FileText
} from "lucide-react";

export default function PptViewerModal({ resource, onClose }) {
  const [activeSlide, setActiveSlide] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState("presentation"); // 'presentation' or 'notes'

  // Extract resource details safely
  let rawUrl = resource?.fileUrl || resource?.url || "";
  if (typeof rawUrl === "string" && rawUrl.startsWith("/uploads")) {
    rawUrl = `${SERVER_BASE}${rawUrl}`;
  }

  const title = resource?.title || resource?.fileName || "Faculty PowerPoint Presentation";
  const facultyName = resource?.facultyName || resource?.uploadedBy || "Faculty Member";
  const subject = resource?.subject || "Academic Subject";
  const unit = resource?.unit || "Unit 1";
  const description = resource?.description || "Official course presentation slides provided by faculty.";
  const fileName = resource?.fileName || `${title.replace(/\s+/g, "_")}.pptx`;
  const fileSize = resource?.fileSize || "4.5 MB";

  const [dynamicSlides, setDynamicSlides] = useState(resource?.slides || null);

  useEffect(() => {
    let isMounted = true;
    const fetchSlides = async () => {
      if (resource?.slides && resource.slides.length > 0) return;
      try {
        let endpoint = "";
        if (resource?.id) {
          endpoint = `${SERVER_BASE}/api/faculty/ppt-slides/${resource.id}`;
        } else if (rawUrl) {
          endpoint = `${SERVER_BASE}/api/faculty/ppt-slides-by-url?file_url=${encodeURIComponent(rawUrl)}`;
        }
        if (!endpoint) return;
        const res = await fetch(endpoint);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.slides && data.slides.length > 0) {
            setDynamicSlides(data.slides);
          }
        }
      } catch (err) {
        console.warn("Could not fetch extracted slides, using fallback:", err);
      }
    };
    fetchSlides();
    return () => { isMounted = false; };
  }, [resource, rawUrl]);

  // Slide deck data for interactive presentation view
  const defaultSlides = [
    {
      id: 1,
      title: `${title} — Overview & Core Objectives`,
      subtitle: `${subject} • ${unit}`,
      bullets: [
        `Fundamental concepts and mathematical/theoretical foundation of ${title}.`,
        "Key design tradeoffs, time and space complexity invariants.",
        "Practical implementation patterns used in modern enterprise software.",
        "Step-by-step examination of core algorithms and architectural structures."
      ],
      speakerNotes: `Welcome class. In today's presentation, we review ${title}. Pay close attention to the structural guarantees discussed in this unit.`
    },
    {
      id: 2,
      title: "Key Theoretical Invariants & Operations",
      subtitle: "Detailed Analysis & Algorithmic Mechanics",
      bullets: [
        "Invariant 1: Property maintenance across insertions and deletions.",
        "Invariant 2: Operational bounds ensuring deterministic latency.",
        "Invariant 3: Structural re-balancing upon node or data state transformation.",
        "Edge Case Handling: Null-pointer checks, rotational pivots, and memory alignment."
      ],
      codeSnippet: `// Representation of Core Operation\nfunction executeOperation(node) {\n  if (!node) return null;\n  node.balanceFactor = getDepth(node.left) - getDepth(node.right);\n  if (node.balanceFactor > 1) return rotateRight(node);\n  return node;\n}`,
      speakerNotes: "Notice how node rotation preserves in-order traversal invariants while restoring structural balance in O(1) time."
    },
    {
      id: 3,
      title: "Step-by-Step Execution Trace & Visual Breakdown",
      subtitle: "Worked Examples & State Transitions",
      bullets: [
        "Step A: Initialize data structures and set root pointers.",
        "Step B: Traversal down the left subtree identifying target key space.",
        "Step C: Apply structural transformations (single / double rotations).",
        "Step D: Verify post-condition invariants before returning control to caller."
      ],
      speakerNotes: "Walk through this trace step-by-step before answering practice examination questions."
    },
    {
      id: 4,
      title: "Performance Comparison & Complexity Bounds",
      subtitle: "Time Complexity & Memory Overhead",
      metrics: [
        { label: "Average Lookup", value: "O(log n)", status: "Optimal" },
        { label: "Worst Case Insertion", value: "O(log n)", status: "Guaranteed" },
        { label: "Space Complexity", value: "O(n)", status: "Linear" },
        { label: "Rebalancing Cost", value: "O(1)", status: "Constant" }
      ],
      bullets: [
        "Comparison with standard linear data structures.",
        "Memory overhead per node pointer & metadata storage.",
        "Cache locality considerations in modern hardware memory architecture."
      ],
      speakerNotes: "Compare these bounds with B-Trees and Hash maps used in high-throughput database systems."
    },
    {
      id: 5,
      title: "Exam Preparation & Summary Points",
      subtitle: "Expected Questions & High-Yield Topics",
      bullets: [
        "1. Be prepared to draw tree state after sequence insertions.",
        "2. Differentiate clearly between height balancing vs black-height invariants.",
        "3. Prove maximum height bounds mathematically for logarithmic structures.",
        "4. Review faculty notes provided in Unit resources for lab test scenarios."
      ],
      speakerNotes: "Focus on question #2 for the upcoming examination. All formulas are covered in the attached notes."
    }
  ];

  const slides = dynamicSlides || defaultSlides;

  const totalSlides = slides.length;
  const currentSlideData = slides[activeSlide - 1] || slides[0];


  // Keyboard arrow keys slide navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        setActiveSlide((prev) => Math.min(totalSlides, prev + 1));
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        setActiveSlide((prev) => Math.max(1, prev - 1));
      } else if (e.key === "Escape") {
        if (isFullscreen) setIsFullscreen(false);
        else onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [totalSlides, isFullscreen, onClose]);

  // Handle Download PPT File
  const handleDownload = async () => {
    try {
      if (rawUrl.startsWith("data:")) {
        const response = await fetch(rawUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        return;
      }

      const downloadUrl = rawUrl.includes("?") ? `${rawUrl}&download=true` : `${rawUrl}?download=true`;
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = fileName;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download error:", err);
      window.open(rawUrl, "_blank");
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md flex items-center justify-center ${
        isFullscreen ? "p-0" : "p-2 sm:p-5"
      } animate-in fade-in duration-200`}
    >
      <div
        className={`bg-slate-900 rounded-2xl w-full ${
          isFullscreen ? "h-screen rounded-none" : "max-w-6xl h-[92vh]"
        } flex flex-col shadow-2xl border border-slate-800 text-white overflow-hidden`}
      >
        {/* Top Header */}
        <div className="p-3.5 sm:p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-black shadow-lg shadow-orange-950/50">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                  PowerPoint Presentation
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {subject} • {unit}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-100 line-clamp-1 mt-0.5">
                {title}
              </h3>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Tabs */}
            <div className="bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 flex items-center gap-1 text-xs">
              <button
                onClick={() => setActiveTab("presentation")}
                className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "presentation"
                    ? "bg-amber-500 text-slate-950 shadow"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <Presentation className="w-3.5 h-3.5" />
                <span>Slides Deck</span>
              </button>
              <button
                onClick={() => setActiveTab("notes")}
                className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "notes"
                    ? "bg-amber-500 text-slate-950 shadow"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Notes &amp; Guide</span>
              </button>
            </div>

            {/* Slide Navigation Header Controls */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-xl border border-slate-700/60 text-xs">
              <button
                onClick={() => setActiveSlide((p) => Math.max(1, p - 1))}
                disabled={activeSlide === 1}
                className="p-1 rounded-lg text-slate-300 hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                title="Previous Slide (Left Arrow)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono font-bold text-amber-400 min-w-[60px] text-center">
                {activeSlide} / {totalSlides}
              </span>
              <button
                onClick={() => setActiveSlide((p) => Math.min(totalSlides, p + 1))}
                disabled={activeSlide === totalSlides}
                className="p-1 rounded-lg text-slate-300 hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                title="Next Slide (Right Arrow)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Slideshow"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Download PPT */}
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-950/40 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PPT</span>
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="flex-1 flex overflow-hidden bg-slate-950">
          {/* Left Sidebar: Slide Thumbnails */}
          {activeTab === "presentation" && (
            <div className="w-48 sm:w-60 bg-slate-900/90 border-r border-slate-800/80 p-3 overflow-y-auto space-y-2.5 hidden md:block">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 flex items-center justify-between">
                <span>Slide Thumbnails</span>
                <span className="text-amber-400">{totalSlides} Slides</span>
              </div>

              {slides.map((slide, idx) => {
                const isActive = slide.id === activeSlide;
                return (
                  <button
                    key={slide.id}
                    onClick={() => setActiveSlide(slide.id)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? "bg-slate-800 border-amber-500/80 shadow-md ring-1 ring-amber-500/50"
                        : "bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                          isActive ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        Slide {idx + 1}
                      </span>
                      {isActive && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>}
                    </div>
                    <p className="text-xs font-bold line-clamp-2 text-slate-200 leading-snug">
                      {slide.title}
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          {/* Main Slide Canvas */}
          <div className="flex-1 flex flex-col justify-between overflow-y-auto p-4 sm:p-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            {activeTab === "presentation" && (
              <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-between space-y-6">
                {/* Slide Card Frame */}
                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden">
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

                  {/* Slide Top Banner */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
                        {currentSlideData.subtitle || `${subject} • Faculty Lecture`}
                      </span>
                      <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                        {currentSlideData.title}
                      </h1>
                    </div>

                    <div className="text-right hidden sm:block">
                      <span className="text-[11px] font-mono text-slate-500 block">VIGNAN LMS</span>
                      <span className="text-xs font-bold text-slate-400">{facultyName}</span>
                    </div>
                  </div>

                  {/* Slide Bullets */}
                  {currentSlideData.bullets?.length > 0 && (
                    <ul className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {currentSlideData.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-500/30">
                            {idx + 1}
                          </span>
                          <span className="pt-0.5">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Optional Code Snippet on Slide */}
                  {currentSlideData.codeSnippet && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-sans font-bold">
                        Demonstration Code / Algorithm Trace:
                      </div>
                      <pre>{currentSlideData.codeSnippet}</pre>
                    </div>
                  )}

                  {/* Optional Key Metrics Grid */}
                  {currentSlideData.metrics?.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      {currentSlideData.metrics.map((m, idx) => (
                        <div key={idx} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-center">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">{m.label}</span>
                          <span className="text-sm sm:text-base font-black text-amber-400 mt-1 block">{m.value}</span>
                          <span className="text-[9px] font-bold text-emerald-400 block mt-0.5">{m.status}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Speaker Notes Overlay Drawer */}
                  {currentSlideData.speakerNotes && (
                    <div className="p-3.5 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-200 space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-amber-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Faculty Speaker Notes &amp; Guidance</span>
                      </div>
                      <p className="text-slate-300 leading-snug">{currentSlideData.speakerNotes}</p>
                    </div>
                  )}

                  {/* Slide Footer */}
                  <div className="border-t border-slate-800/80 pt-4 flex items-center justify-between text-xs text-slate-500">
                    <span>Faculty Presentation Deck • {fileName}</span>
                    <span className="font-mono text-amber-400">Slide {activeSlide} of {totalSlides}</span>
                  </div>
                </div>

                {/* Bottom Interactive Control Bar */}
                <div className="flex items-center justify-between gap-4 pt-2">
                  <button
                    onClick={() => setActiveSlide((p) => Math.max(1, p - 1))}
                    disabled={activeSlide === 1}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-xs font-bold flex items-center gap-2 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Slide</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {slides.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setActiveSlide(s.id)}
                        className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                          s.id === activeSlide ? "bg-amber-400 w-6" : "bg-slate-700 hover:bg-slate-600"
                        }`}
                        title={`Go to slide ${s.id}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setActiveSlide((p) => Math.min(totalSlides, p + 1))}
                    disabled={activeSlide === totalSlides}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-2 disabled:opacity-40 transition-colors shadow-md shadow-amber-950/30 cursor-pointer"
                  >
                    <span>Next Slide</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Notes & Guide View */}
            {activeTab === "notes" && (
              <div className="max-w-3xl mx-auto w-full space-y-6">
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-5">
                  <div className="border-b border-slate-800 pb-4">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                      Course Material Overview
                    </span>
                    <h2 className="text-xl font-bold text-white mt-1">{title}</h2>
                    <p className="text-xs text-slate-400 mt-1">{description}</p>
                  </div>

                  <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      <span>Presentation Summary &amp; Key Takeaways</span>
                    </h3>
                    <p>
                      This presentation deck was prepared by <strong>{facultyName}</strong> for the subject <strong>{subject}</strong>.
                      It covers essential topics for unit tests and semester examinations.
                    </p>

                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                      <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                        File Metadata &amp; Format Information
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                        <div>File Name: <strong className="text-slate-200">{fileName}</strong></div>
                        <div>File Size: <strong className="text-slate-200">{fileSize}</strong></div>
                        <div>Faculty Author: <strong className="text-slate-200">{facultyName}</strong></div>
                        <div>Total Slides: <strong className="text-amber-400">{totalSlides} Slides</strong></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={handleDownload}
                        className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-colors cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Full PPT File ({fileSize})</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
