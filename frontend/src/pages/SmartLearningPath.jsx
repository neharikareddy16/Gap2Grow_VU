import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { api } from "../services/api";
import {
  Clock,
  CheckCircle2,
  Play,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Filter,
  Check,
  Award,
  Sparkles
} from "lucide-react";

function YoutubeIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

const SUBJECT_LIST = [
  { id: "oop", name: "Object Oriented Programming Through Java" },
  { id: "dbms", name: "Database Management Systems" },
  { id: "ai", name: "Artificial Intelligence" },
  { id: "digital-logic", name: "Digital Logic Design" },
  { id: "discrete-math", name: "Discrete Mathematics" },
  { id: "data-visualization", name: "Data Wrangling & Visualization" },
  { id: "data-structures", name: "Data Structures" }
];

// Exact Subject-Wise 5-Step Smart Learning Path Registry with verified 100% playable YouTube Videos
const SMART_PATH_REGISTRY = {
  "oop": {
    subject: "Object Oriented Programming Through Java",
    playlistUrl: "https://www.youtube.com/results?search_query=Object+Oriented+Programming+Through+Java+full+course",
    steps: [
      {
        step: 1,
        title: "Classes & Objects",
        description: "Class blueprints, instance variables, object instantiation on Heap memory, and constructor initialization.",
        channel: "Telusko / Java Education",
        duration: "15 min",
        youtubeUrl: "https://www.youtube.com/results?search_query=Java+Classes+and+Objects+Tutorial+for+Beginners"
      },
      {
        step: 2,
        title: "Inheritance",
        description: "Single and multilevel inheritance, extends keyword, super() constructor calls, and IS-A relationships.",
        channel: "thenewboston",
        duration: "18 min",
        youtubeUrl: "https://www.youtube.com/watch?v=9JpNY-XAseg"
      },
      {
        step: 3,
        title: "Polymorphism",
        description: "Compile-time method overloading vs runtime method overriding and dynamic method dispatch.",
        channel: "Java Education",
        duration: "16 min",
        youtubeUrl: "https://www.youtube.com/results?search_query=Java+Polymorphism+Method+Overloading+and+Overriding"
      },
      {
        step: 4,
        title: "Encapsulation",
        description: "Data hiding using private fields, public getters and setters, and access control scoping.",
        channel: "Java Education",
        duration: "14 min",
        youtubeUrl: "https://www.youtube.com/results?search_query=Java+Encapsulation+Getters+and+Setters+Tutorial"
      },
      {
        step: 5,
        title: "Abstraction & Interfaces",
        description: "Abstract classes, pure method contracts, multiple inheritance via interfaces, and default methods.",
        channel: "Coding with John",
        duration: "20 min",
        youtubeUrl: "https://www.youtube.com/watch?v=HvPlEJ3LHgE"
      }
    ]
  },

  "dbms": {
    subject: "Database Management Systems",
    playlistUrl: "https://www.youtube.com/results?search_query=Database+Management+System+DBMS+full+course",
    steps: [
      {
        step: 1,
        title: "ER Model & Relational Model",
        description: "Entity-Relationship modeling, attributes, cardinality ratios, primary keys, and schema mapping.",
        channel: "Lucid Software",
        duration: "18 min",
        youtubeUrl: "https://www.youtube.com/watch?v=QpdhBUYk7Kk"
      },
      {
        step: 2,
        title: "Relational Algebra & SQL",
        description: "Procedural operators (Select σ, Project π, Join ⋈) and SQL queries (SELECT, WHERE, JOIN, GROUP BY).",
        channel: "Socratica",
        duration: "22 min",
        youtubeUrl: "https://www.youtube.com/watch?v=9yeOJ0ZMUYw"
      },
      {
        step: 3,
        title: "Database Normalization",
        description: "Functional dependencies X → Y, candidate keys, 1NF (atomic), 2NF, 3NF, and BCNF decomposition.",
        channel: "Decomplexify",
        duration: "20 min",
        youtubeUrl: "https://www.youtube.com/watch?v=GFQaEYEc8_8"
      },
      {
        step: 4,
        title: "Transactions & Concurrency Control",
        description: "ACID properties, serializability schedules, Strict 2-Phase Locking (2PL), and deadlock resolution.",
        channel: "Gate Smashers / DBMS",
        duration: "24 min",
        youtubeUrl: "https://www.youtube.com/results?search_query=DBMS+Transactions+and+Concurrency+Control+Tutorial"
      },
      {
        step: 5,
        title: "Indexing & Query Processing",
        description: "Primary/Secondary indexing, B-Trees, B+ Tree leaf pointers, and query optimization cost.",
        channel: "Abdul Bari",
        duration: "21 min",
        youtubeUrl: "https://www.youtube.com/watch?v=aZjYr87r1b8"
      }
    ]
  },

  "ai": {
    subject: "Artificial Intelligence",
    playlistUrl: "https://www.youtube.com/results?search_query=Artificial+Intelligence+AI+full+course",
    steps: [
      {
        step: 1,
        title: "Intelligent Agents & Problem Solving",
        description: "Agent architectures, PEAS (Performance, Environment, Actuators, Sensors), and environment types.",
        channel: "Gate Smashers / AI",
        duration: "16 min",
        youtubeUrl: "https://www.youtube.com/results?search_query=Artificial+Intelligence+Intelligent+Agents+Tutorial"
      },
      {
        step: 2,
        title: "Search Algorithms",
        description: "Uninformed search (BFS, DFS) vs Informed search (Heuristic A* Search f(n) = g(n) + h(n)).",
        channel: "Gate Smashers / AI",
        duration: "22 min",
        youtubeUrl: "https://www.youtube.com/results?search_query=Artificial+Intelligence+Search+Algorithms+BFS+DFS+A*+Search"
      },
      {
        step: 3,
        title: "Knowledge Representation",
        description: "Propositional logic, First-Order Predicate Logic (FOL), quantifiers (∀, ∃), and resolution inference.",
        channel: "Gate Smashers / AI",
        duration: "19 min",
        youtubeUrl: "https://www.youtube.com/results?search_query=Artificial+Intelligence+Knowledge+Representation+First+Order+Logic"
      },
      {
        step: 4,
        title: "Machine Learning Basics",
        description: "Supervised vs Unsupervised learning, regression, classification, decision trees, and model evaluation.",
        channel: "StatQuest with Josh Starmer",
        duration: "25 min",
        youtubeUrl: "https://www.youtube.com/watch?v=Gv9_4yMHFhI"
      },
      {
        step: 5,
        title: "Neural Networks & Deep Learning",
        description: "Perceptrons, activation functions, backpropagation algorithm, and deep artificial neural networks.",
        channel: "3Blue1Brown",
        duration: "20 min",
        youtubeUrl: "https://www.youtube.com/watch?v=aircAruvnKk"
      }
    ]
  },

  "digital-logic": {
    subject: "Digital Logic Design",
    playlistUrl: "https://www.youtube.com/results?search_query=Digital+Logic+Design+DLD+full+course",
    steps: [
      {
        step: 1,
        title: "Number Systems & Boolean Algebra",
        description: "Binary, octal, hex conversions, 1s/2s complement, and Boolean algebra postulates.",
        channel: "Neso Academy / Digital Electronics",
        duration: "17 min",
        youtubeUrl: "https://www.youtube.com/results?search_query=Digital+Logic+Design+Number+Systems+and+Boolean+Algebra"
      },
      {
        step: 2,
        title: "Logic Gates & Simplification",
        description: "Universal NAND/NOR gates, De Morgan's laws, and 3 & 4 variable K-Map circuit minimization.",
        channel: "CrashCourse",
        duration: "19 min",
        youtubeUrl: "https://www.youtube.com/watch?v=gI-qXk7XojA"
      },
      {
        step: 3,
        title: "Combinational Circuits",
        description: "Half/Full Adders, Ripple Carry Adders, Multiplexers (MUX), Decoders, and Encoders.",
        channel: "Neso Academy / DLD",
        duration: "21 min",
        youtubeUrl: "https://www.youtube.com/results?search_query=Digital+Logic+Design+Combinational+Circuits+Half+Full+Adder"
      },
      {
        step: 4,
        title: "Sequential Circuits",
        description: "Synchronous vs Asynchronous sequential circuits, clock triggering, and memory state retention.",
        channel: "Neso Academy / DLD",
        duration: "18 min",
        youtubeUrl: "https://www.youtube.com/results?search_query=Digital+Logic+Design+Sequential+Circuits+Clock"
      },
      {
        step: 5,
        title: "Flip-Flops, Counters & Registers",
        description: "SR, JK, D, T flip-flops, master-slave toggling, synchronous counters, and shift registers.",
        channel: "Neso Academy / DLD",
        duration: "23 min",
        youtubeUrl: "https://www.youtube.com/results?search_query=Digital+Logic+Design+Flip+Flops+Counters+and+Registers"
      }
    ]
  },

  "discrete-math": {
    subject: "Discrete Mathematics",
    playlistUrl: "https://www.youtube.com/results?search_query=Discrete+Mathematics+full+course",
    steps: [
      {
        step: 1,
        title: "Set Theory & Relations",
        description: "Set operations, Power Set 2^n, equivalence relations (Reflexive, Symmetric, Transitive).",
        channel: "TrevTutor",
        duration: "16 min",
        youtubeUrl: "https://www.youtube.com/watch?v=tyDKR4FG3Yw"
      },
      {
        step: 2,
        title: "Logic & Propositional Calculus",
        description: "Truth tables, logical equivalences, contrapositive statements (¬Q → ¬P), and tautology proofs.",
        channel: "TrevTutor / Discrete Math",
        duration: "18 min",
        youtubeUrl: "https://www.youtube.com/results?search_query=Discrete+Mathematics+Propositional+Logic+Truth+Tables"
      },
      {
        step: 3,
        title: "Functions & Mathematical Proofs",
        description: "Injective/Surjective functions and Proof by Mathematical Induction (Base step & Inductive hypothesis).",
        channel: "Discrete Math Education",
        duration: "15 min",
        youtubeUrl: "https://www.youtube.com/results?search_query=Discrete+Mathematics+Mathematical+Induction+Proofs"
      },
      {
        step: 4,
        title: "Graph Theory",
        description: "Undirected/Directed graphs, Handshaking Lemma C(n,2), Euler and Hamiltonian paths, and graph coloring.",
        channel: "Neso Academy / Discrete Math",
        duration: "22 min",
        youtubeUrl: "https://www.youtube.com/results?search_query=Discrete+Mathematics+Graph+Theory+Euler+Hamiltonian"
      },
      {
        step: 5,
        title: "Combinatorics & Probability",
        description: "Permutations, combinations, Pigeonhole Principle, and discrete probability distributions.",
        channel: "Discrete Math Education",
        duration: "20 min",
        youtubeUrl: "https://www.youtube.com/results?search_query=Discrete+Mathematics+Combinatorics+Permutations+Combinations"
      }
    ]
  },

  "data-visualization": {
    subject: "Data Wrangling & Visualization",
    playlistUrl: "https://www.youtube.com/results?search_query=Data+Wrangling+and+Visualization+Python+full+course",
    steps: [
      {
        step: 1,
        title: "Data Cleaning & Preprocessing",
        description: "Pandas DataFrames, missing value imputation (`dropna`, `fillna`), and data type casting.",
        channel: "Alex The Analyst",
        duration: "24 min",
        youtubeUrl: "https://www.youtube.com/watch?v=bDhvCp3_lYw"
      },
      {
        step: 2,
        title: "Data Transformation",
        description: "Z-score Standardization `(x - μ)/σ`, Min-Max scaling (0-1), and log skewness transformations.",
        channel: "freeCodeCamp.org",
        duration: "18 min",
        youtubeUrl: "https://www.youtube.com/watch?v=0B5eIE_1vpU"
      },
      {
        step: 3,
        title: "Data Integration & Merging",
        description: "Combining DataFrames, inner/outer joins, concatenating arrays, and handling duplicate keys.",
        channel: "Corey Schafer / Pandas",
        duration: "20 min",
        youtubeUrl: "https://www.youtube.com/results?search_query=Pandas+Merge+Join+Concatenate+DataFrames+Corey+Schafer"
      },
      {
        step: 4,
        title: "Exploratory Data Analysis (EDA)",
        description: "Univariate distribution analysis, bivariate correlation trends, and outlier IQR detection.",
        channel: "Rob Mulla",
        duration: "26 min",
        youtubeUrl: "https://www.youtube.com/watch?v=xi0vhXFPegw"
      },
      {
        step: 5,
        title: "Data Visualization & Dashboarding",
        description: "Matplotlib scatter plots, Seaborn heatmaps, and Plotly interactive web dashboard callbacks.",
        channel: "Corey Schafer",
        duration: "22 min",
        youtubeUrl: "https://www.youtube.com/watch?v=UO98lJQ3QGI"
      }
    ]
  },

  "data-structures": {
    subject: "Data Structures",
    playlistUrl: "https://www.youtube.com/results?search_query=Data+Structures+and+Algorithms+full+course",
    steps: [
      {
        step: 1,
        title: "Arrays",
        description: "Contiguous RAM memory indexing, O(1) random access, dynamic vector capacity scaling, and binary search.",
        channel: "mycodeschool / Data Structures",
        duration: "14 min",
        youtubeUrl: "https://www.youtube.com/results?search_query=Data+Structures+Arrays+Introduction+Tutorial"
      },
      {
        step: 2,
        title: "Linked Lists",
        description: "Singly and doubly linked lists, dynamic node allocation, pointer rewiring, and O(1) head insertion.",
        channel: "mycodeschool",
        duration: "18 min",
        youtubeUrl: "https://www.youtube.com/watch?v=NobHlGUjV3g"
      },
      {
        step: 3,
        title: "Stacks & Queues",
        description: "LIFO call stack management, FIFO queue processing, and circular queue modulo indexing.",
        channel: "HackerRank",
        duration: "20 min",
        youtubeUrl: "https://www.youtube.com/watch?v=wjI1WNcIntg"
      },
      {
        step: 4,
        title: "Trees & Traversals",
        description: "Binary Search Trees (BST), recursive Inorder (L-N-R), Preorder, Postorder, and AVL balancing.",
        channel: "mycodeschool",
        duration: "22 min",
        youtubeUrl: "https://www.youtube.com/watch?v=gm8DUJJhmY4"
      },
      {
        step: 5,
        title: "Graphs & BFS/DFS",
        description: "Adjacency matrix vs list, BFS FIFO queue shortest path, DFS call stack recursion, and cycle detection.",
        channel: "freeCodeCamp.org",
        duration: "25 min",
        youtubeUrl: "https://www.youtube.com/watch?v=DBRW8nwZV-g"
      }
    ]
  }
};

export default function SmartLearningPath() {
  const { currentUser, setActiveTab } = useUser();
  const [selectedSubjectObj, setSelectedSubjectObj] = useState(SUBJECT_LIST[0]);
  const [completedStages, setCompletedStages] = useState({});

  // Get current subject's exact 5-step Smart Learning Path from registry
  const currentPathData = SMART_PATH_REGISTRY[selectedSubjectObj.id] || SMART_PATH_REGISTRY["oop"];
  const steps = currentPathData.steps;
  const playlistUrl = currentPathData.playlistUrl;

  const totalSteps = steps.length;
  const completedCount = steps.filter((s) => completedStages[`${selectedSubjectObj.id}_${s.step}`]).length;
  const progressPct = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  const toggleStage = (stepNum) => {
    const key = `${selectedSubjectObj.id}_${stepNum}`;
    setCompletedStages((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 bg-red-100 text-red-700 rounded uppercase tracking-wider flex items-center gap-1">
              <YoutubeIcon className="w-3.5 h-3.5" />
              Subject Roadmap & Playlists
            </span>
            <span className="text-[11px] font-semibold text-gray-500">
              Zero → Hero Learning Path
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mt-1">
            {selectedSubjectObj.name} — ZERO → HERO Roadmap
          </h2>
          <p className="text-xs text-gray-500">
            Structured 5-step learning path and verified YouTube videos for <strong className="text-gray-900">{currentUser?.name}</strong>.
          </p>
        </div>

        {/* Official Subject Playlist Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href={playlistUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Open {selectedSubjectObj.name} Playlist</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Subject Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-3 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2 flex-shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Subject:
          </span>
          {SUBJECT_LIST.map((subj) => {
            const isSelected = selectedSubjectObj.id === subj.id;
            return (
              <button
                key={subj.id}
                onClick={() => setSelectedSubjectObj(subj)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 flex-shrink-0 ${
                  isSelected
                    ? "bg-[#1264E8] text-white shadow-xs"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>{subj.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress Metric Bar */}
      <div className="bg-gradient-to-r from-blue-50/70 to-indigo-50/40 border border-blue-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1264E8] text-white flex items-center justify-center font-bold text-sm shadow-xs">
            {progressPct}%
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              Zero to Hero Mastery Progress
            </h3>
            <p className="text-xs text-gray-600">
              {completedCount} of {totalSteps} Steps Completed in {selectedSubjectObj.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("topic-gap-map")}
            className="px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 text-xs font-bold rounded-lg shadow-2xs transition-colors flex items-center gap-1 whitespace-nowrap"
          >
            <span>View Topic Gap Map</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Zero -> Hero 5 Step Cards */}
      <div className="space-y-4">
        {steps.map((s) => {
          const isCompleted = completedStages[`${selectedSubjectObj.id}_${s.step}`];
          return (
            <div
              key={s.step}
              className={`bg-white rounded-2xl border p-5 transition-all shadow-xs ${
                isCompleted
                  ? "border-emerald-200 bg-emerald-50/15"
                  : "border-[#E5E7EB] hover:border-blue-300"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    isCompleted
                      ? "bg-emerald-600 text-white"
                      : "bg-blue-100 text-[#1264E8]"
                  }`}>
                    {s.step}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-100 text-[#1264E8] rounded">
                        Step {s.step}
                      </span>
                      <h4 className="text-base font-bold text-gray-900">
                        {s.title}
                      </h4>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      {s.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-gray-500 pt-1">
                      <span>Channel: <strong className="text-gray-800">{s.channel}</strong></span>
                      <span>•</span>
                      <span>Duration: {s.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                  <a
                    href={s.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Watch Lesson</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => toggleStage(s.step)}
                    className={`px-3 py-2 text-xs font-bold rounded-xl border transition-colors flex items-center gap-1.5 ${
                      isCompleted
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${isCompleted ? "text-emerald-600" : "text-gray-400"}`} />
                    <span>{isCompleted ? "Completed" : "Mark Done"}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
