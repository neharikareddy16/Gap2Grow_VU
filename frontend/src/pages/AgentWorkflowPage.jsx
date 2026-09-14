import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import {
  Sparkles,
  Bot,
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Play,
  Layers,
  Search,
  Filter,
  Sliders,
  Route,
  ClipboardCheck,
  TrendingUp,
  RotateCcw,
  ShieldCheck,
  Check
} from "lucide-react";

export default function AgentWorkflowPage() {
  const { currentUser, setActiveTab } = useUser();

  const [activeStep, setActiveStep] = useState(4); // default step highlighted
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);

  const agents = [
    {
      id: "gap",
      letter: "A",
      name: "Gap Detection Agent",
      icon: Search,
      role: "Cognitive Assessment Analysis",
      color: "bg-blue-50 border-blue-200 text-[#1264E8]",
      actions: [
        "Analyzes raw diagnostic & exam submissions",
        "Identifies weak concepts at fine-grained topic level (Binary Trees: 32%)",
        "Traces cognitive prerequisites (Recursion stack frame unwinding)"
      ],
      output: "Critical Topic Gap: Binary Tree Postorder Traversal"
    },
    {
      id: "discovery",
      letter: "B",
      name: "Resource Discovery Agent",
      icon: Layers,
      role: "Verified Repository Crawling",
      color: "bg-indigo-50 border-indigo-200 text-indigo-700",
      actions: [
        "Searches verified institute resource catalog & library",
        "Indexes NPTEL, SWAYAM, Faculty notes, VisuAlgo, and textbooks",
        "Discards unverified clickbait & low-quality content"
      ],
      output: "18 Verified Materials found matching 'Binary Trees'"
    },
    {
      id: "classification",
      letter: "C",
      name: "Resource Classification Agent",
      icon: Filter,
      role: "Multi-Attribute Categorization",
      color: "bg-purple-50 border-purple-200 text-purple-700",
      actions: [
        "Tags topic, difficulty level (Beginner/Intermediate/Advanced)",
        "Measures duration (10m, 15m, 40m) & format (Video, PDF, Lab)",
        "Labels faculty endorsements & license validity"
      ],
      output: "Multi-dimensional feature vector per resource"
    },
    {
      id: "matching",
      letter: "D",
      name: "Resource Matching Agent",
      icon: Sliders,
      role: "Personalized Ranking Engine",
      color: "bg-amber-50 border-amber-200 text-amber-700",
      actions: [
        "Calculates cosine similarity with student's current 32% skill level",
        "Matches daily time availability (45 minutes maximum)",
        "Weights Faculty-endorsed materials 2.5x higher than generic items"
      ],
      output: "Top 4 optimal resources selected with match %"
    },
    {
      id: "path",
      letter: "E",
      name: "Learning Path Agent",
      icon: Route,
      role: "Pedagogical Sequence Synthesis",
      color: "bg-emerald-50 border-emerald-200 text-emerald-700",
      actions: [
        "Converts isolated resources into a pedagogical sequence",
        "Orders: Step 1 Prerequisite → Step 2 Concept → Step 3 Lab → Step 4 Quiz",
        "Prevents cognitive fatigue with micro-durations"
      ],
      output: "Today's 45-Minute Daily Schedule generated"
    },
    {
      id: "assessment",
      letter: "F",
      name: "Assessment Agent",
      icon: ClipboardCheck,
      role: "Adaptive Evaluation Generator",
      color: "bg-cyan-50 border-cyan-200 text-cyan-700",
      actions: [
        "Generates targeted 5-question micro-quiz on weak concept",
        "Evaluates short answers against faculty rubric via AI service",
        "Prevents question repetition across attempts"
      ],
      output: "5-Question Diagnostic Micro-Quiz ready"
    },
    {
      id: "progress",
      letter: "G",
      name: "Progress Agent",
      icon: TrendingUp,
      role: "Competency Delta Tracking",
      color: "bg-teal-50 border-teal-200 text-teal-700",
      actions: [
        "Monitors completion checkpoints and test scores",
        "Quantifies before vs after improvement (+46% gap closure)",
        "Logs telemetry for Faculty and Remedial Coordinator view"
      ],
      output: "Updated mastery score: 32% → 78%"
    },
    {
      id: "adaptation",
      letter: "H",
      name: "Adaptation Agent",
      icon: RotateCcw,
      role: "Dynamic Pipeline Branching",
      color: "bg-rose-50 border-rose-200 text-rose-700",
      actions: [
        "If score < 60%: recommends foundational prerequisite revision",
        "If score > 80%: flags gap closed and unlocks next topic (BST)",
        "Maintains continuous closed-loop learning optimization"
      ],
      output: "Decision: Gap Closed (78%) → Transitioning to BST"
    }
  ];

  const runSimulation = () => {
    setIsRunningPipeline(true);
    let step = 0;
    const interval = setInterval(() => {
      setActiveStep(step);
      step++;
      if (step >= agents.length) {
        clearInterval(interval);
        setIsRunningPipeline(false);
      }
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-[#1264E8] rounded uppercase tracking-wider">
              Agentic Orchestration Architecture
            </span>
            <span className="text-[11px] font-semibold text-gray-500">
              Multi-Agent Collaboration Engine
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mt-1">
            Autonomous AI Agent Pipeline
          </h2>
          <p className="text-xs text-gray-500">
            Visual breakdown of 8 logical agents continuously collaborating for <strong className="text-gray-900">{currentUser?.name}</strong>.
          </p>
        </div>

        <button
          onClick={runSimulation}
          disabled={isRunningPipeline}
          className="px-4 py-2 bg-[#1264E8] hover:bg-[#0E52C2] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {isRunningPipeline ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Simulating Pipeline Execution...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Simulate Pipeline Trace</span>
            </>
          )}
        </button>
      </div>

      {/* Visual Pipeline Flow Chart (Prompt Specification) */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-xs">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
          Pipeline Flow Architecture
        </h3>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-2 text-xs font-semibold text-gray-700">
          <div className="px-3 py-1.5 bg-gray-100 rounded-lg border border-gray-200">Student Data</div>
          <ArrowRight className="w-4 h-4 text-gray-400" />
          <div className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">Diagnostic Agent</div>
          <ArrowRight className="w-4 h-4 text-gray-400" />
          <div className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200">Gap Detection Agent</div>
          <ArrowRight className="w-4 h-4 text-gray-400" />
          <div className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg border border-purple-200">Resource Discovery</div>
          <ArrowRight className="w-4 h-4 text-gray-400" />
          <div className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-200">Resource Matching</div>
          <ArrowRight className="w-4 h-4 text-gray-400" />
          <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">Learning Path Agent</div>
          <ArrowRight className="w-4 h-4 text-gray-400" />
          <div className="px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-lg border border-cyan-200">Practice & Assessment</div>
          <ArrowRight className="w-4 h-4 text-gray-400" />
          <div className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg border border-teal-200">Progress Analysis</div>
        </div>

        {/* Adaptive Branching Flow: Gap Closed? Yes / No */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
          <div className="text-center">
            <span className="text-xs font-bold px-3 py-1 bg-gray-100 rounded-full text-gray-700 border border-gray-200">
              Gap Closed?
            </span>
          </div>

          <div className="flex items-center gap-8 text-xs">
            <div className="flex items-center gap-2 p-2 bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
              <span className="font-bold">↙ NO</span>
              <span>Adapt Path (Prerequisite Revision)</span>
            </div>

            <div className="flex items-center gap-2 p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
              <span className="font-bold">↘ YES</span>
              <span>Next Topic (Binary Search Trees)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of All 8 Specialized Logical Agents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent, index) => {
          const Icon = agent.icon;
          const isActive = activeStep === index;
          return (
            <div
              key={agent.id}
              onClick={() => setActiveStep(index)}
              className={`rounded-2xl border p-5 transition-all cursor-pointer ${
                isActive
                  ? "bg-white border-[#1264E8] shadow-md ring-2 ring-[#1264E8]/20"
                  : "bg-white border-[#E5E7EB] hover:border-gray-300 shadow-xs"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border ${agent.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Agent {agent.letter}
                    </span>
                    <h4 className="text-sm font-bold text-gray-900 leading-snug">
                      {agent.name}
                    </h4>
                    <p className="text-[11px] text-gray-500 font-medium">
                      {agent.role}
                    </p>
                  </div>
                </div>

                {isActive && (
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 animate-pulse">
                    Live Active
                  </span>
                )}
              </div>

              {/* Responsibilities list */}
              <ul className="space-y-1.5 text-xs text-gray-600 mb-3 pl-1">
                {agent.actions.map((act, i) => (
                  <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                    <span className="text-[#1264E8] mt-0.5 font-bold">✓</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>

              {/* Live Output */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                <span className="font-medium text-gray-400">Current Trace Output:</span>
                <span className="font-semibold text-gray-900 truncate max-w-[65%] text-right">
                  {agent.output}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
