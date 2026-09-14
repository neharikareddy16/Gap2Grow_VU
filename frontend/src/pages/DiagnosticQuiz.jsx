import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { api } from "../services/api";
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Bot,
  HelpCircle,
  Clock,
  Filter
} from "lucide-react";

const SUBJECTS = [
  "Data Structures",
  "Object Oriented Programming Through Java",
  "Database Management System",
  "Digital Logic Design",
  "Discrete Mathematics",
  "Artificial Intelligence",
  "Data Visualization and Handling"
];

const DIAGNOSTIC_QUESTIONS = {
  "Data Structures": [
    { id: 1, topic: "Arrays", question: "What is the time complexity to access an element in an array by its index?", options: ["A. O(1)", "B. O(n)", "C. O(log n)", "D. O(n²)"], correct: "A", explanation: "Arrays offer O(1) constant time random access." },
    { id: 2, topic: "Arrays", question: "Which operation on an unsorted array of size n takes O(n) time in the worst case?", options: ["A. Index access", "B. Linear search", "C. Appending to end", "D. Reading array length"], correct: "B", explanation: "Linear search checks every element sequentially." },
    { id: 3, topic: "Linked List", question: "In a singly linked list with head pointer only, what is the time complexity of deleting the last node?", options: ["A. O(1)", "B. O(log n)", "C. O(n)", "D. O(n²)"], correct: "C", explanation: "Requires traversal to the second-to-last node." },
    { id: 4, topic: "Linked List", question: "Which algorithm is optimal for detecting a cycle in a linked list with O(1) auxiliary space?", options: ["A. Hash set lookup", "B. Floyd's Tortoise and Hare algorithm", "C. Merge sort", "D. Recursion depth tracking"], correct: "B", explanation: "Floyd's algorithm uses two pointers with O(1) space." },
    { id: 5, topic: "Trees", question: "Which traversal of a Binary Search Tree (BST) produces keys in strictly non-decreasing sorted order?", options: ["A. Preorder", "B. Inorder", "C. Postorder", "D. Level-order"], correct: "B", explanation: "Inorder traversal visits Left, Root, Right in sorted order." },
    { id: 6, topic: "Trees", question: "In recursive postorder tree traversal, when does the function execute logic for the current root node?", options: ["A. Before left and right calls", "B. Between left and right calls", "C. After both left and right recursive calls unwind", "D. Immediately on receiving root"], correct: "C", explanation: "Postorder visits Left, Right, then Root." },
    { id: 7, topic: "Trees", question: "What is the maximum number of nodes in a full binary tree with L leaves?", options: ["A. 2L - 1", "B. 2^L", "C. L²", "D. L + 1"], correct: "A", explanation: "Total nodes = L + (L - 1) = 2L - 1." },
    { id: 8, topic: "Graphs", question: "Which data structure is required to perform Breadth-First Search (BFS) on a graph?", options: ["A. Stack (LIFO)", "B. Queue (FIFO)", "C. Priority Queue", "D. Hash Table"], correct: "B", explanation: "BFS explores level by level using a FIFO Queue." },
    { id: 9, topic: "Graphs", question: "What is the time complexity of Depth-First Search (DFS) on a graph with V vertices and E edges using an adjacency list?", options: ["A. O(V * E)", "B. O(V + E)", "C. O(V²)", "D. O(log V)"], correct: "B", explanation: "DFS visits every vertex and edge once." },
    { id: 10, topic: "Graphs", question: "In cycle detection for a directed graph, which vertex state indicates a back edge in recursive DFS?", options: ["A. White (Unvisited)", "B. Gray (In call stack)", "C. Black (Completed)", "D. Green"], correct: "B", explanation: "A gray node indicates an active stack frame in DFS." }
  ],
  "Object Oriented Programming Through Java": [
    { id: 101, topic: "Classes", question: "Which modifier makes a field accessible only within its own class?", options: ["A. public", "B. protected", "C. private", "D. default"], correct: "C", explanation: "private restricts access exclusively to the defining class." },
    { id: 102, topic: "Inheritance", question: "Subclasses inherit parent fields and methods using which keyword in Java?", options: ["A. implements", "B. extends", "C. inherits", "D. super"], correct: "B", explanation: "extends establishes class inheritance." },
    { id: 103, topic: "Polymorphism", question: "Method overloading in Java is resolved at:", options: ["A. Compile Time", "B. Runtime", "C. Class loading time", "D. Execution unwind time"], correct: "A", explanation: "Overloading is static polymorphism resolved at compile time." },
    { id: 104, topic: "Polymorphism", question: "Method overriding in Java is resolved at:", options: ["A. Compile Time", "B. Runtime", "C. Pre-processing time", "D. Build time"], correct: "B", explanation: "Overriding is dynamic polymorphism resolved at runtime via virtual method dispatch." },
    { id: 105, topic: "Interfaces", question: "Can a Java class implement multiple interfaces?", options: ["A. Yes", "B. No"], correct: "A", explanation: "Java supports multiple inheritance of interface contracts." },
    { id: 106, topic: "Keywords", question: "Which statement calls the immediate superclass constructor?", options: ["A. this()", "B. super()", "C. base()", "D. parent()"], correct: "B", explanation: "super() invokes the parent class constructor." },
    { id: 107, topic: "Exception Handling", question: "Which block in Java exception handling ALWAYS executes regardless of whether an exception occurred?", options: ["A. try", "B. catch", "C. finally", "D. throws"], correct: "C", explanation: "finally guarantees execution for cleanup operations." },
    { id: 108, topic: "Keywords", question: "A class declared as final cannot be:", options: ["A. Instantiated", "B. Subclassed / Inherited", "C. Referenced", "D. Compiled"], correct: "B", explanation: "final classes cannot be inherited." },
    { id: 109, topic: "Memory", question: "In Java, object instances created with the 'new' keyword reside in:", options: ["A. Call Stack", "B. Heap Memory", "C. Registers", "D. Static Segment"], correct: "B", explanation: "All dynamically instantiated objects live in Heap memory." },
    { id: 110, topic: "Collections", question: "Which collection interface implementation guarantees uniqueness of elements?", options: ["A. ArrayList", "B. LinkedList", "C. HashSet", "D. Vector"], correct: "C", explanation: "Set implementations like HashSet enforce element uniqueness." }
  ],
  "Database Management System": [
    { id: 201, topic: "Normalization", question: "Which Normal Form requires table attributes to be atomic (no multi-valued columns)?", options: ["A. 1NF", "B. 2NF", "C. 3NF", "D. BCNF"], correct: "A", explanation: "1NF mandates atomic attribute values." },
    { id: 202, topic: "Normalization", question: "Removing partial functional dependencies on candidate keys achieves:", options: ["A. 1NF", "B. 2NF", "C. 3NF", "D. 4NF"], correct: "B", explanation: "2NF eliminates partial functional dependency." },
    { id: 203, topic: "SQL", question: "Which SQL clause is used to group row sets prior to applying aggregate functions?", options: ["A. ORDER BY", "B. GROUP BY", "C. WHERE", "D. HAVING"], correct: "B", explanation: "GROUP BY summarizes rows with duplicate values." },
    { id: 204, topic: "SQL", question: "Which SQL clause filters records AFTER aggregation has taken place?", options: ["A. WHERE", "B. HAVING", "C. GROUP BY", "D. ORDER BY"], correct: "B", explanation: "HAVING filters aggregated group values." },
    { id: 205, topic: "Transactions", question: "What does the 'A' in ACID transaction properties stand for?", options: ["A. Availability", "B. Atomicity", "C. Access", "D. Authentication"], correct: "B", explanation: "Atomicity ensures all-or-nothing transaction execution." },
    { id: 206, topic: "Transactions", question: "What does Isolation in ACID prevent?", options: ["A. System crashes", "B. Concurrent transaction interference", "C. Disk full errors", "D. Syntax errors"], correct: "B", explanation: "Isolation isolates executing transactions from concurrent updates." },
    { id: 207, topic: "Keys", question: "A primary key constraint in relational databases automatically enforces:", options: ["A. UNIQUE and NOT NULL", "B. NULL values allowed", "C. Foreign keys", "D. Cascade delete"], correct: "A", explanation: "Primary keys are uniquely identifying and non-null." },
    { id: 208, topic: "Relational Algebra", question: "The Cartesian product of relation R (3 rows) and S (4 rows) results in how many tuples?", options: ["A. 7", "B. 12", "C. 1", "D. 0"], correct: "B", explanation: "3 * 4 = 12 tuples." },
    { id: 209, topic: "Indexing", question: "Which data structure is most commonly used for database file indexing to minimize disk I/O?", options: ["A. Binary Tree", "B. B+ Tree", "C. Stack", "D. Hash Table"], correct: "B", explanation: "B+ Trees support efficient range queries and disk block retrieval." },
    { id: 210, topic: "Joins", question: "A CROSS JOIN in SQL produces:", options: ["A. Inner match", "B. Cartesian product", "C. Left outer set", "D. Self join"], correct: "B", explanation: "CROSS JOIN computes the Cartesian product of two tables." }
  ],
  "Digital Logic Design": [
    { id: 301, topic: "Gates", question: "What is the truth table output of an AND gate when inputs are A=1, B=0?", options: ["A. 0", "B. 1"], correct: "A", explanation: "AND requires all inputs to be 1." },
    { id: 302, topic: "Boolean", question: "According to De Morgan's Law, (A + B)' equals:", options: ["A. A' + B'", "B. A' · B'", "C. A · B", "D. A + B"], correct: "B", explanation: "(A + B)' = A' · B'." },
    { id: 303, topic: "K-Maps", question: "A Karnaugh map for 4 Boolean variables contains how many total cells?", options: ["A. 8", "B. 16", "C. 32", "D. 64"], correct: "B", explanation: "2^4 = 16 minterm cells." },
    { id: 304, topic: "Combinational", question: "How many 2:1 Multiplexers are needed to construct a 4:1 Multiplexer?", options: ["A. 2", "B. 3", "C. 4", "D. 8"], correct: "B", explanation: "2 MUXes in stage 1 and 1 MUX in stage 2 = 3 MUXes." },
    { id: 305, topic: "Combinational", question: "A 3-to-8 Decoder has how many select input lines and output lines?", options: ["A. 3 inputs, 8 outputs", "B. 8 inputs, 3 outputs", "C. 3 inputs, 3 outputs", "D. 4 inputs, 16 outputs"], correct: "A", explanation: "n inputs produce 2^n outputs." },
    { id: 306, topic: "Flip-Flops", question: "Which flip-flop toggles its output state when its input is HIGH?", options: ["A. D Flip-Flop", "B. T Flip-Flop", "C. SR Flip-Flop", "D. Latch"], correct: "B", explanation: "T (Toggle) flip-flop toggles on input 1." },
    { id: 307, topic: "Sequential", question: "Which circuit contains memory elements (flip-flops) whose outputs depend on past inputs?", options: ["A. Combinational", "B. Sequential", "C. Multiplexer", "D. Encoder"], correct: "B", explanation: "Sequential circuits store state history." },
    { id: 308, topic: "Number Systems", question: "What is the 2's complement representation of binary number 0101 (+5) in 4 bits?", options: ["A. 1010", "B. 1011", "C. 1100", "D. 1111"], correct: "B", explanation: "1's complement = 1010, add 1 = 1011 (-5)." },
    { id: 309, topic: "Counters", question: "A 4-bit asynchronous MOD-16 ripple counter can count up to what maximum decimal value?", options: ["A. 15", "B. 16", "C. 31", "D. 8"], correct: "A", explanation: "Counts from 0 to 15 (16 states)." },
    { id: 310, topic: "Adders", question: "What is the key difference between a Half Adder and a Full Adder?", options: ["A. Full adder accepts Carry-In input", "B. Half adder has 3 outputs", "C. Full adder has no sum", "D. They are identical"], correct: "A", explanation: "Full adders handle input Carry-In from previous stages." }
  ],
  "Discrete Mathematics": [
    { id: 401, topic: "Sets", question: "If A = {1, 2} and B = {a, b}, what is the number of elements in Cartesian Product A × B?", options: ["A. 2", "B. 4", "C. 8", "D. 16"], correct: "B", explanation: "|A| * |B| = 2 * 2 = 4." },
    { id: 402, topic: "Relations", question: "A relation R on set A where (x,x) ∈ R for all x ∈ A is:", options: ["A. Symmetric", "B. Reflexive", "C. Transitive", "D. Antisymmetric"], correct: "B", explanation: "Reflexivity requires all self-pairs." },
    { id: 403, topic: "Logic", question: "The truth value of P → Q is FALSE only when:", options: ["A. P is True, Q is False", "B. P is False, Q is True", "C. Both are False", "D. Both are True"], correct: "A", explanation: "Implication is false only if true premise yields false conclusion." },
    { id: 404, topic: "Proof Techniques", question: "Which proof strategy assumes the statement is false and derives a logical impossibility?", options: ["A. Direct Proof", "B. Proof by Contradiction", "C. Proof by Case", "D. Induction"], correct: "B", explanation: "Reductio ad absurdum assumes negation to find contradiction." },
    { id: 405, topic: "Graphs", question: "What is the sum of degrees of all vertices in an undirected graph G with E edges?", options: ["A. E", "B. 2E", "C. E²", "D. E / 2"], correct: "B", explanation: "Handshaking Lemma: ∑ deg(v) = 2E." },
    { id: 406, topic: "Combinatorics", question: "In how many ways can 5 distinct books be arranged on a shelf?", options: ["A. 5", "B. 25", "C. 120", "D. 60"], correct: "C", explanation: "5! = 5 * 4 * 3 * 2 * 1 = 120 ways." },
    { id: 407, topic: "Trees", question: "A connected acyclic undirected graph with V vertices has how many edges?", options: ["A. V", "B. V - 1", "C. V + 1", "D. 2V"], correct: "B", explanation: "A tree with V vertices has exactly V - 1 edges." },
    { id: 408, topic: "Functions", question: "A function f: A → B is bijective if it is:", options: ["A. Injective only", "B. Surjective only", "C. Both Injective and Surjective", "D. Neither"], correct: "C", explanation: "Bijection is one-to-one and onto." },
    { id: 409, topic: "Recurrence", question: "The Fibonacci sequence recurrence F(n) = F(n-1) + F(n-2) with F(0)=0, F(1)=1 gives F(5) equal to:", options: ["A. 3", "B. 5", "C. 8", "D. 13"], correct: "B", explanation: "0, 1, 1, 2, 3, 5." },
    { id: 410, topic: "Set Operations", question: "According to Inclusion-Exclusion principle, |A ∪ B| equals:", options: ["A. |A| + |B|", "B. |A| + |B| - |A ∩ B|", "C. |A ∩ B|", "D. |A| * |B|"], correct: "B", explanation: "|A ∪ B| = |A| + |B| - |A ∩ B|." }
  ],
  "Artificial Intelligence": [
    { id: 501, topic: "Search", question: "Which search algorithm expands nodes based on total path cost f(n) = g(n) + h(n)?", options: ["A. BFS", "B. DFS", "C. A* Search", "D. Greedy Search"], correct: "C", explanation: "A* combines path cost g(n) and heuristic h(n)." },
    { id: 502, topic: "Heuristics", question: "An admissible heuristic in A* search:", options: ["A. Always overestimates distance to goal", "B. Never overestimates distance to goal", "C. Is always zero", "D. Is non-monotonic"], correct: "B", explanation: "Admissibility requires h(n) ≤ h*(n)." },
    { id: 503, topic: "Game Playing", question: "Minimax algorithm assumes that the opponent player is trying to:", options: ["A. Maximize your score", "B. Minimize your score / utility", "C. Play randomly", "D. Pass turn"], correct: "B", explanation: "MIN player seeks to minimize MAX player's score." },
    { id: 504, topic: "Game Playing", question: "In Alpha-Beta pruning, Alpha represents the best value for:", options: ["A. MAX layer", "B. MIN layer", "C. Root node only", "D. Random search"], correct: "A", explanation: "Alpha is the best score choice for MAX along the path." },
    { id: 505, topic: "CSP", question: "Which technique reduces search space by enforcing constraint consistency across variable domains?", options: ["A. Arc Consistency (AC-3)", "B. Genetic Mutation", "C. Q-Learning", "D. Simulated Annealing"], correct: "A", explanation: "AC-3 prunes inconsistent values from variable domains." },
    { id: 506, topic: "Logic", question: "Knowledge representation using rules IF condition THEN action is known as:", options: ["A. Neural Network", "B. Production System / Expert System", "C. Decision Tree", "D. Markov Model"], correct: "B", explanation: "Rule-based expert systems use production rules." },
    { id: 507, topic: "Machine Learning", question: "Which AI learning paradigm learns actions by interacting with an environment to maximize cumulative reward?", options: ["A. Supervised Learning", "B. Unsupervised Learning", "C. Reinforcement Learning", "D. Classification"], correct: "C", explanation: "Reinforcement learning uses reward signals." },
    { id: 508, topic: "Agents", question: "A Rational Agent is defined as one that:", options: ["A. Always succeeds", "B. Selects actions that maximize expected performance measure", "C. Thinks like a human", "D. Is omniscient"], correct: "B", explanation: "Rationality maximizes expected performance given percepts." },
    { id: 509, topic: "Planning", question: "STRIPS planning representations decompose states into:", options: ["A. Action Preconditions and Effects", "B. Weights and Biases", "C. Truth tables", "D. Probabilities"], correct: "A", explanation: "STRIPS defines operations with preconditions and add/delete effects." },
    { id: 510, topic: "Probabilistic", question: "Bayesian Networks represent conditional independence relationships using:", options: ["A. Directed Acyclic Graphs (DAG)", "B. Cyclic Graphs", "C. Stacks", "D. Arrays"], correct: "A", explanation: "Bayes Nets structure variables into DAG nodes and conditional tables." }
  ],
  "Data Visualization and Handling": [
    { id: 601, topic: "Pandas", question: "In Pandas, a 1-Dimensional labeled array is called a:", options: ["A. DataFrame", "B. Series", "C. Matrix", "D. Panel"], correct: "B", explanation: "Pandas Series is 1-D; DataFrame is 2-D." },
    { id: 602, topic: "Pandas", question: "Which method returns summary statistical metrics (mean, std, min, max, quartiles) for numeric columns?", options: ["A. df.info()", "B. df.describe()", "C. df.head()", "D. df.summary()"], correct: "B", explanation: "describe() outputs summary statistics." },
    { id: 603, topic: "Data Cleaning", question: "If a column contains 60% missing values, common data handling practice is to:", options: ["A. Fill with 0", "B. Drop the column or perform advanced imputation", "C. Ignore it", "D. Duplicate rows"], correct: "B", explanation: "High missingness requires drop or domain-specific imputation." },
    { id: 604, topic: "Visualization", question: "Which plot is ideal for showing trend changes over a continuous time axis?", options: ["A. Line Chart", "B. Bar Chart", "C. Pie Chart", "D. Heatmap"], correct: "A", explanation: "Line charts visualize continuous temporal trends." },
    { id: 605, topic: "Seaborn", question: "Which Seaborn function plots feature distribution density along with a kernel density estimate (KDE)?", options: ["A. sns.displot()", "B. sns.scatterplot()", "C. sns.boxplot()", "D. sns.barplot()"], correct: "A", explanation: "displot / histplot with kde=True shows density estimation." },
    { id: 606, topic: "Scaling", question: "Min-Max normalization rescales feature values to fall strictly within which range?", options: ["A. [-1, 1]", "B. [0, 1]", "C. [0, 100]", "D. [-∞, +∞]"], correct: "B", explanation: "Min-Max bounds features between 0 and 1." },
    { id: 607, topic: "Categorical Data", question: "Converting categorical variables with N categories into N binary columns is called:", options: ["A. Label Encoding", "B. One-Hot Encoding", "C. Ordinal Scaling", "D. Binning"], correct: "B", explanation: "One-Hot Encoding generates indicator dummy variables." },
    { id: 608, topic: "Outliers", question: "Using the IQR method, values below Q1 - 1.5 * IQR or above Q3 + 1.5 * IQR are flagged as:", options: ["A. Missing values", "B. Outliers", "C. Means", "D. Medians"], correct: "B", explanation: "Tukey's fence rule flags 1.5 * IQR extremes as outliers." },
    { id: 609, topic: "Correlation", question: "A Pearson correlation coefficient value of -0.92 indicates:", options: ["A. Weak positive correlation", "B. Strong negative linear correlation", "C. No relationship", "D. Perfect positive correlation"], correct: "B", explanation: "Close to -1 indicates strong inverse linear correlation." },
    { id: 610, topic: "Visualization", question: "Which Matplotlib method saves the generated chart to a PNG or PDF file on disk?", options: ["A. plt.show()", "B. plt.savefig()", "C. plt.export()", "D. plt.render()"], correct: "B", explanation: "plt.savefig('output.png') exports figures." }
  ]
};

export default function DiagnosticQuiz() {
  const { currentUser, setActiveTab } = useUser();
  const [selectedSubject, setSelectedSubject] = useState("Data Structures");

  const questions = DIAGNOSTIC_QUESTIONS[selectedSubject] || DIAGNOSTIC_QUESTIONS["Data Structures"];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQ = questions[currentIndex] || questions[0];

  const handleSubjectChange = (subj) => {
    setSelectedSubject(subj);
    setSelectedAnswers({});
    setSubmitted(false);
    setAnalysisResult(null);
    setCurrentIndex(0);
  };

  const handleSelectOption = (optIndexLetter) => {
    if (submitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQ.id]: optIndexLetter
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const formattedResponses = questions.map((q) => {
      const userAns = selectedAnswers[q.id] || "";
      const isCorrect = userAns.startsWith(q.correct);
      return {
        questionId: q.id,
        topic: q.topic,
        userAnswer: userAns,
        correctAnswer: q.correct,
        isCorrect
      };
    });

    try {
      const res = await api.submitDiagnostic(formattedResponses);
      setAnalysisResult(res);
      if (res && res.topicBreakdown) {
        const updatedBreakdown = res.topicBreakdown.map((t) => ({
          ...t,
          skillLevel: t.accuracy < 35 || t.skillLevel === "Critical" ? "Critically Weak" : t.skillLevel
        }));
        const cleanSub = selectedSubject.toLowerCase().replace(/[^a-z0-9]/g, "_");
        localStorage.setItem(`gap2grow_diagnostic_${cleanSub}`, JSON.stringify(updatedBreakdown));
        if (selectedSubject.includes("Database")) {
          localStorage.setItem("gap2grow_diagnostic_database_management_systems", JSON.stringify(updatedBreakdown));
          localStorage.setItem("gap2grow_diagnostic_database_management_system", JSON.stringify(updatedBreakdown));
        }
        if (selectedSubject.includes("Object")) {
          localStorage.setItem("gap2grow_diagnostic_object_oriented_programming", JSON.stringify(updatedBreakdown));
          localStorage.setItem("gap2grow_diagnostic_object_oriented_programming_through_java", JSON.stringify(updatedBreakdown));
        }
        if (selectedSubject.includes("Visualization")) {
          localStorage.setItem("gap2grow_diagnostic_data_visualization___handling", JSON.stringify(updatedBreakdown));
          localStorage.setItem("gap2grow_diagnostic_data_visualization_and_handling", JSON.stringify(updatedBreakdown));
        }
      }
      setSubmitted(true);
    } catch {
      // Client-side fallback calculation
      const topicStats = {};
      formattedResponses.forEach((r) => {
        if (!topicStats[r.topic]) topicStats[r.topic] = { total: 0, correct: 0 };
        topicStats[r.topic].total += 1;
        if (r.isCorrect) topicStats[r.topic].correct += 1;
      });

      const topicBreakdown = Object.entries(topicStats).map(([topic, stat]) => {
        const acc = Math.round((stat.correct / stat.total) * 100);
        let skill = "Strong";
        let gap = "Low";
        if (acc < 35) { skill = "Critically Weak"; gap = "Critical"; }
        else if (acc < 55) { skill = "Weak"; gap = "High"; }
        else if (acc < 80) { skill = "Medium"; gap = "Medium"; }
        return { topic, accuracy: acc, skillLevel: skill, gap, correct: stat.correct, total: stat.total };
      });

      const cleanSub = selectedSubject.toLowerCase().replace(/[^a-z0-9]/g, "_");
      localStorage.setItem(`gap2grow_diagnostic_${cleanSub}`, JSON.stringify(topicBreakdown));
      if (selectedSubject.includes("Database")) {
        localStorage.setItem("gap2grow_diagnostic_database_management_systems", JSON.stringify(topicBreakdown));
        localStorage.setItem("gap2grow_diagnostic_database_management_system", JSON.stringify(topicBreakdown));
      }
      if (selectedSubject.includes("Object")) {
        localStorage.setItem("gap2grow_diagnostic_object_oriented_programming", JSON.stringify(topicBreakdown));
        localStorage.setItem("gap2grow_diagnostic_object_oriented_programming_through_java", JSON.stringify(topicBreakdown));
      }
      if (selectedSubject.includes("Visualization")) {
        localStorage.setItem("gap2grow_diagnostic_data_visualization___handling", JSON.stringify(topicBreakdown));
        localStorage.setItem("gap2grow_diagnostic_data_visualization_and_handling", JSON.stringify(topicBreakdown));
      }

      setAnalysisResult({
        topicBreakdown,
        primaryGap: topicBreakdown.find((t) => t.gap === "High" || t.gap === "Critical") || topicBreakdown[0],
        recommendedFocus: `Resolving ${selectedSubject} conceptual gaps via 45-minute daily path`
      });
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setAnalysisResult(null);
    setCurrentIndex(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-[#1264E8] rounded uppercase tracking-wider">
              Diagnostic Assessment
            </span>
            <span className="text-[11px] font-semibold text-gray-500">
              Gap Detection Agent
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mt-1">
            {selectedSubject} Diagnostic Test
          </h2>
          <p className="text-xs text-gray-500">
            Student: <strong className="text-gray-900">{currentUser?.name}</strong> • 10 Questions • Calibration for Adaptive Pathway
          </p>
        </div>

        {!submitted && (
          <div className="flex items-center gap-2 text-xs font-mono text-gray-600 bg-gray-50 px-3 py-1.5 rounded-xl border">
            <Clock className="w-4 h-4 text-[#1264E8]" />
            <span>Untimed Diagnostic</span>
          </div>
        )}
      </div>

      {/* Subject Selector Bar */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-3 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2 flex-shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Select Subject:
          </span>
          {SUBJECTS.map((subj) => {
            const isSelected = selectedSubject === subj;
            return (
              <button
                key={subj}
                onClick={() => handleSubjectChange(subj)}
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
      </div>

      {!submitted ? (
        /* Quiz Interface */
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-xs space-y-6">
          {/* Progress Tracker */}
          <div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span className="font-semibold text-gray-800">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-[11px] font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                Topic: {currentQ.topic}
              </span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#1264E8] h-full transition-all duration-300 rounded-full"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="py-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              const letter = opt.charAt(0);
              const isSelected = selectedAnswers[currentQ.id] === letter;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(letter)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                    isSelected
                      ? "border-[#1264E8] bg-blue-50/70 text-[#1264E8] shadow-xs"
                      : "border-gray-200 hover:bg-gray-50 text-gray-800"
                  }`}
                >
                  <span>{opt}</span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? "border-[#1264E8] bg-[#1264E8] text-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Question Navigator Footer */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="px-5 py-2 bg-[#1264E8] hover:bg-[#0E52C2] text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-xs"
                >
                  {isSubmitting ? "Synthesizing Gaps..." : "Submit Diagnostic Test"}
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Results & Topic Performance Table */
        <div className="space-y-6">
          {/* AI Gap Detection Card */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-100 text-rose-700 rounded uppercase tracking-wider">
                    Most Important Gap Identified
                  </span>
                  <span className="text-xs text-gray-400">Agentic Analysis</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mt-1">
                  Primary Focus: {analysisResult?.primaryGap?.topic || "Core Fundamentals"} ({analysisResult?.primaryGap?.accuracy || 30}% Accuracy)
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                  Hi <strong>{currentUser?.name}</strong>, your diagnostic evaluation for <strong>{selectedSubject}</strong> identifies key area of improvement in <strong>{analysisResult?.primaryGap?.topic || "Core Concepts"}</strong>.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setActiveTab("learning-path")}
                    className="px-4 py-2 bg-[#1264E8] hover:bg-[#0E52C2] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Open Generated 45-Min Path</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={handleRestart}
                    className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Diagnostic</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Topic Performance Table */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs">
            <div className="p-4 sm:p-5 border-b border-[#E5E7EB] bg-gray-50/50">
              <h3 className="text-sm font-bold text-gray-900">
                Diagnostic Topic-Level Breakdown for {selectedSubject}
              </h3>
              <p className="text-xs text-gray-500">
                Performance across core syllabus competencies
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200 text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Topic</th>
                    <th className="py-3 px-4 text-center">Accuracy</th>
                    <th className="py-3 px-4">Skill Level</th>
                    <th className="py-3 px-4">Identified Gap</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-800">
                  {(analysisResult?.topicBreakdown || []).map((row, i) => {
                    const isWeak = row.gap === "High" || row.gap === "Critical";
                    return (
                      <tr key={i} className={isWeak ? "bg-rose-50/30" : "hover:bg-gray-50/60"}>
                        <td className="py-3 px-4 sm:px-6 font-semibold text-gray-900">
                          {row.topic}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`font-bold font-mono ${
                            row.accuracy >= 75 ? "text-emerald-600" : row.accuracy >= 50 ? "text-blue-600" : "text-rose-600"
                          }`}>
                            {row.accuracy}%
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            row.skillLevel === "Strong"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : row.skillLevel === "Needs Improvement"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}>
                            {row.skillLevel}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-xs font-medium flex items-center gap-1 ${
                            isWeak ? "text-rose-600 font-semibold" : "text-gray-500"
                          }`}>
                            {isWeak ? "🔴 " : "🟢 "}
                            {row.gap} Gap
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setActiveTab("topic-gap-map")}
                            className="text-xs font-bold text-[#1264E8] hover:underline"
                          >
                            Explore →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
