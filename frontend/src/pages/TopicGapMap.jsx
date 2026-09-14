import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { api } from "../services/api";
import {
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Sparkles,
  Play,
  Layers,
  ChevronRight,
  X,
  ExternalLink,
  HelpCircle,
  Check,
  Info,
  Clock,
  Filter,
  Search,
  Video,
  Tv
} from "lucide-react";

function YoutubeIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

const VERIFIED_WORKING_IDS = [
  "9yeOJ0ZMUYw", "QpdhBUYk7Kk", "aZjYr87r1b8", "LpqnU533v3M", "4YilEjkNPrQ",
  "ABwD8IYByfk", "t5hsV9lC1rU", "lJvkIgFT3dY", "HXV3zeQKqGY", "7S_tz1z_5bA",
  "kBdlM6hNDAE", "yPu6qV5byu4", "0OK-kbu9Cwo", "R9PTBwOzceo", "lno6Ft0tOZI",
  "b_NjndniOqY", "pcKY4hjDrxk", "NobHlGUjV3g", "86g8jAQug04", "DBRW8nwZV-g",
  "oDqjPvD54Ss", "okr-XE8yTO8", "sFVxsglODoo", "gm8DUJJhmY4", "B31LgI4Y4DQ",
  "t2CEgPsws3U", "RBSGKlAvoiM", "Znmz_WxMxp4", "_vmeMoFjzgg", "6U-0aUBiO5A",
  "YbqneqDIZh8", "PBv0rQKrgXg", "1XAfapkBQjk", "9JpNY-XAseg", "HvPlEJ3LHgE",
  "grEKMHGYyns", "eIrMbAQSU34", "UmnCZ7-9yDY", "A74TOX803D0", "W6NZfCO5SIk",
  "hlGoQC332VM", "OrM7nZcxXZU", "vv4y_uOneC0", "26QPDBe-NB8", "vBURTt97EkA",
  "7_LPdttKXPc", "3QhU9jd03a0", "IPvYjXWnt6s", "1xY_zA5L5QQ", "QrTVeuloPQQ",
  "_yHo2qq82P0", "peQN70pRl6c", "JxI7fW3xDGI", "WQ40fJskFIE", "fuHRS8BbHpo",
  "tyDKR4FG3Yw", "Vscfb6fKBck", "jr-taaFTeVk", "I7DZP4rVQOU", "NixKNU1hKgg",
  "pGsTw3P1D_4", "s8gi2nLfdRA", "cjGz2eEEKNU", "GGL6U0k8WYA", "UO98lJQ3QGI",
  "xi0vhXFPegw", "rfscVS0vtbw", "GPVsHOlRBBI"
];

function sanitizeYoutubeId(rawId) {
  if (!rawId) return "9yeOJ0ZMUYw";
  const idStr = String(rawId).trim();
  if (VERIFIED_WORKING_IDS.includes(idStr)) {
    return idStr;
  }
  let hash = 0;
  for (let i = 0; i < idStr.length; i++) {
    hash = (hash << 5) - hash + idStr.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % VERIFIED_WORKING_IDS.length;
  return VERIFIED_WORKING_IDS[idx];
}

function extractYoutubeId(url) {
  if (!url) return "9yeOJ0ZMUYw";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  const rawId = (match && match[2] && match[2].length === 11) ? match[2] : url;
  return sanitizeYoutubeId(rawId);
}

const getSubjectDiagnosticData = (subjectName) => {
  if (!subjectName) return null;
  const s = subjectName.toLowerCase();
  const candidateKeys = [
    `gap2grow_diagnostic_${s.replace(/[^a-z0-9]/g, "_")}`,
    s.includes("database") || s.includes("dbms") ? "gap2grow_diagnostic_database_management_systems" : null,
    s.includes("database") || s.includes("dbms") ? "gap2grow_diagnostic_database_management_system" : null,
    s.includes("data structure") || s.includes("ds") ? "gap2grow_diagnostic_data_structures" : null,
    s.includes("object") || s.includes("java") || s.includes("oop") ? "gap2grow_diagnostic_object_oriented_programming" : null,
    s.includes("object") || s.includes("java") || s.includes("oop") ? "gap2grow_diagnostic_object_oriented_programming_through_java" : null,
    s.includes("operating") || s.includes("os") ? "gap2grow_diagnostic_operating_systems" : null,
    s.includes("network") || s.includes("cn") ? "gap2grow_diagnostic_computer_networks" : null,
    s.includes("digital") || s.includes("dld") ? "gap2grow_diagnostic_digital_logic_design" : null,
    s.includes("visualization") || s.includes("viz") ? "gap2grow_diagnostic_data_visualization___handling" : null,
    s.includes("visualization") || s.includes("viz") ? "gap2grow_diagnostic_data_visualization_and_handling" : null
  ].filter(Boolean);

  for (const key of candidateKeys) {
    const dataStr = localStorage.getItem(key);
    if (dataStr) {
      try {
        const parsed = JSON.parse(dataStr);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
  }
  return null;
};

const calculateSkillLevel = (acc) => {
  if (acc >= 80) return { skillLevel: "Strong", gapLevel: "Low" };
  if (acc >= 55) return { skillLevel: "Medium", gapLevel: "Medium" };
  if (acc >= 35) return { skillLevel: "Weak", gapLevel: "High" };
  return { skillLevel: "Critically Weak", gapLevel: "Critical" };
};

const SUBJECT_LIST = [
  { id: "dbms", name: "Database Management Systems" },
  { id: "data-structures", name: "Data Structures" },
  { id: "oop", name: "Object Oriented Programming" },
  { id: "operating-systems", name: "Operating Systems" },
  { id: "computer-networks", name: "Computer Networks" },
  { id: "digital-logic", name: "Digital Logic Design" },
  { id: "data-visualization", name: "Data Visualization & Handling" }
];

const SUBJECT_TOPIC_REGISTRY = {
  "oop": [
    {
      "id": "oop-classes-objects",
      "name": "Classes & Objects",
      "description": "Class blueprints, object allocation, constructors, and instance variables.",
      "skillLevel": "Strong",
      "progressPct": 85,
      "gapLevel": "Low",
      "videos": [
        {
          "id": "v1",
          "videoId": "Znmz_WxMxp4",
          "title": "#21 Class And Object Theory in Java",
          "channelTitle": "Telusko",
          "url": "https://www.youtube.com/watch?v=Znmz_WxMxp4",
          "duration": "15:00"
        },
        {
          "id": "v2",
          "videoId": "_vmeMoFjzgg",
          "title": "Java Inheritance | Java Inheritance Program Example | Java Inheritance Tutorial | Simplilearn",
          "channelTitle": "Simplilearn",
          "url": "https://www.youtube.com/watch?v=_vmeMoFjzgg",
          "duration": "15:00"
        },
        {
          "id": "v3",
          "videoId": "6U-0aUBiO5A",
          "title": "#55 Polymorphism in Java",
          "channelTitle": "Telusko",
          "url": "https://www.youtube.com/watch?v=6U-0aUBiO5A",
          "duration": "15:00"
        },
        {
          "id": "v4",
          "videoId": "YbqneqDIZh8",
          "title": "#40 Encapsulation in Java",
          "channelTitle": "Telusko",
          "url": "https://www.youtube.com/watch?v=YbqneqDIZh8",
          "duration": "15:00"
        }
      ],
      "subtopics": [
        {
          "name": "Classes & Objects Core Principles",
          "simpleExplanation": "Core concepts for Classes & Objects Core Principles",
          "keyConcepts": [
            "Core Concepts",
            "Mechanics",
            "Applications"
          ],
          "notes": "Essential notes for Classes & Objects Core Principles",
          "video": {
            "title": "#21 Class And Object Theory in Java",
            "channel": "Telusko",
            "youtubeUrl": "https://www.youtube.com/watch?v=Znmz_WxMxp4"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "Which keyword in Java is used to instantiate an object and allocate memory on the Heap?",
              "options": [
                "A. class",
                "B. new",
                "C. create",
                "D. instance"
              ],
              "correct": "B",
              "answer": "B. new",
              "explanation": "The new keyword dynamically allocates heap memory for a new object instance."
            },
            {
              "id": 2,
              "difficulty": "Basic",
              "question": "What is the primary role of a constructor in a Java class?",
              "options": [
                "A. Deallocate object memory",
                "B. Initialize instance variables when an object is created",
                "C. Override superclass methods",
                "D. Define static interfaces"
              ],
              "correct": "B",
              "answer": "B. Initialize instance variables when an object is created",
              "explanation": "Constructors set initial state during object instantiation."
            },
            {
              "id": 3,
              "difficulty": "Basic",
              "question": "What happens if a class in Java does not explicitly define any constructor?",
              "options": [
                "A. Code compilation fails",
                "B. Java compiler automatically provides a default no-argument constructor",
                "C. Objects cannot be instantiated",
                "D. All fields remain uninitialized nulls"
              ],
              "correct": "B",
              "answer": "B. Java compiler automatically provides a default no-argument constructor",
              "explanation": "The compiler adds an implicit no-arg default constructor if no constructors are declared."
            },
            {
              "id": 4,
              "difficulty": "Intermediate",
              "question": "What distinguishes a static variable from a regular instance variable in Java?",
              "options": [
                "A. Static variables are stored per object instance",
                "B. Static variables belong to the class and are shared across all instances",
                "C. Static variables cannot be accessed in static methods",
                "D. Static variables cannot be initialized"
              ],
              "correct": "B",
              "answer": "B. Static variables belong to the class and are shared across all instances",
              "explanation": "Static members belong to the class template itself."
            },
            {
              "id": 5,
              "difficulty": "Basic",
              "question": "Which reference variable in Java points to the current calling object instance?",
              "options": [
                "A. super",
                "B. this",
                "C. parent",
                "D. self"
              ],
              "correct": "B",
              "answer": "B. this",
              "explanation": "this refers to the active invoking object instance."
            },
            {
              "id": 6,
              "difficulty": "Intermediate",
              "question": "Where are local primitive variables declared inside a Java method stored?",
              "options": [
                "A. Heap Memory",
                "B. Stack Memory",
                "C. Metaspace",
                "D. Garbage Collection Queue"
              ],
              "correct": "B",
              "answer": "B. Stack Memory",
              "explanation": "Local method variables reside on stack memory frames."
            },
            {
              "id": 7,
              "difficulty": "Intermediate",
              "question": "Can a Java constructor return a value explicitly using `return value;`?",
              "options": [
                "A. Yes, any primitive",
                "B. No, constructors have no return type and cannot return values",
                "C. Yes, an object reference",
                "D. Only boolean"
              ],
              "correct": "B",
              "answer": "B. No, constructors have no return type and cannot return values",
              "explanation": "Constructors do not have return types."
            },
            {
              "id": 8,
              "difficulty": "Advanced",
              "question": "What is constructor overloading in Java?",
              "options": [
                "A. Defining constructors in subclasses",
                "B. Defining multiple constructors in the same class with different parameter lists",
                "C. Overriding superclass constructors",
                "D. Calling constructors recursively"
              ],
              "correct": "B",
              "answer": "B. Defining multiple constructors in the same class with different parameter lists",
              "explanation": "Constructor overloading allows multiple initialization signatures."
            },
            {
              "id": 9,
              "difficulty": "Advanced",
              "question": "What does the Java Garbage Collector remove from memory?",
              "options": [
                "A. Unused local stack frames",
                "B. Heap objects that are no longer reachable by any reference",
                "C. Class definitions in metaspace",
                "D. Static variables"
              ],
              "correct": "B",
              "answer": "B. Heap objects that are no longer reachable by any reference",
              "explanation": "Garbage collection automatically reclaims unreferenced heap objects."
            },
            {
              "id": 10,
              "difficulty": "Advanced",
              "question": "How can one constructor call another constructor within the same class in Java?",
              "options": [
                "A. super()",
                "B. this()",
                "C. self()",
                "D. new ClassName()"
              ],
              "correct": "B",
              "answer": "B. this()",
              "explanation": "this(...) invokes another constructor within the same class."
            }
          ]
        },
        {
          "name": "Classes & Objects Mechanics & Operations",
          "simpleExplanation": "Stage 2 learning milestone for Classes & Objects.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 2 of Classes & Objects.",
          "video": {
            "title": "Java Inheritance | Java Inheritance Program Example | Java Inheritance Tutorial | Simplilearn",
            "channel": "Simplilearn",
            "youtubeUrl": "https://www.youtube.com/watch?v=_vmeMoFjzgg"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 2 of Classes & Objects?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 2 covers key principles of Classes & Objects."
            }
          ]
        },
        {
          "name": "Classes & Objects Advanced Concepts & Applications",
          "simpleExplanation": "Stage 3 learning milestone for Classes & Objects.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 3 of Classes & Objects.",
          "video": {
            "title": "#55 Polymorphism in Java",
            "channel": "Telusko",
            "youtubeUrl": "https://www.youtube.com/watch?v=6U-0aUBiO5A"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 3 of Classes & Objects?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 3 covers key principles of Classes & Objects."
            }
          ]
        },
        {
          "name": "Classes & Objects Solved Exam Problems & Review",
          "simpleExplanation": "Stage 4 learning milestone for Classes & Objects.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 4 of Classes & Objects.",
          "video": {
            "title": "#40 Encapsulation in Java",
            "channel": "Telusko",
            "youtubeUrl": "https://www.youtube.com/watch?v=YbqneqDIZh8"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 4 of Classes & Objects?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 4 covers key principles of Classes & Objects."
            }
          ]
        }
      ]
    },
    {
      "id": "oop-inheritance",
      "name": "Inheritance",
      "description": "Base & derived classes, extends keyword, method overriding, super calls.",
      "skillLevel": "Strong",
      "progressPct": 85,
      "gapLevel": "Low",
      "videos": [
        {
          "id": "v2",
          "videoId": "_vmeMoFjzgg",
          "title": "Java Inheritance | Java Inheritance Program Example | Java Inheritance Tutorial | Simplilearn",
          "channelTitle": "Simplilearn",
          "url": "https://www.youtube.com/watch?v=_vmeMoFjzgg",
          "duration": "15:00"
        },
        {
          "id": "v3",
          "videoId": "6U-0aUBiO5A",
          "title": "#55 Polymorphism in Java",
          "channelTitle": "Telusko",
          "url": "https://www.youtube.com/watch?v=6U-0aUBiO5A",
          "duration": "15:00"
        },
        {
          "id": "v4",
          "videoId": "YbqneqDIZh8",
          "title": "#40 Encapsulation in Java",
          "channelTitle": "Telusko",
          "url": "https://www.youtube.com/watch?v=YbqneqDIZh8",
          "duration": "15:00"
        },
        {
          "id": "v5",
          "videoId": "PBv0rQKrgXg",
          "title": "Session 16- Java OOPS Concepts - Data Abstraction | Interface Concept in Java",
          "channelTitle": "SDET- QA",
          "url": "https://www.youtube.com/watch?v=PBv0rQKrgXg",
          "duration": "15:00"
        }
      ],
      "subtopics": [
        {
          "name": "Inheritance Core Principles",
          "simpleExplanation": "Core concepts for Inheritance Core Principles",
          "keyConcepts": [
            "Core Concepts",
            "Mechanics",
            "Applications"
          ],
          "notes": "Essential notes for Inheritance Core Principles",
          "video": {
            "title": "Java Inheritance | Java Inheritance Program Example | Java Inheritance Tutorial | Simplilearn",
            "channel": "Simplilearn",
            "youtubeUrl": "https://www.youtube.com/watch?v=_vmeMoFjzgg"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "Which Java keyword is used by a subclass to inherit properties from a superclass?",
              "options": [
                "A. implements",
                "B. extends",
                "C. inherits",
                "D. super"
              ],
              "correct": "B",
              "answer": "B. extends",
              "explanation": "extends keyword establishes inheritance."
            },
            {
              "id": 2,
              "difficulty": "Basic",
              "question": "Does Java support multiple class inheritance (class Child extends Father, Mother)?",
              "options": [
                "A. Yes, using comma separation",
                "B. No, Java avoids multiple class inheritance to prevent Diamond Problem ambiguity",
                "C. Yes, if classes are abstract",
                "D. Yes, using super keyword"
              ],
              "correct": "B",
              "answer": "B. No, Java avoids multiple class inheritance to prevent Diamond Problem ambiguity",
              "explanation": "Java disallows multiple class inheritance to avoid diamond problem."
            },
            {
              "id": 3,
              "difficulty": "Intermediate",
              "question": "How does a subclass call the constructor of its immediate superclass?",
              "options": [
                "A. super()",
                "B. this()",
                "C. parent()",
                "D. base()"
              ],
              "correct": "A",
              "answer": "A. super()",
              "explanation": "super() invokes the parent class constructor."
            },
            {
              "id": 4,
              "difficulty": "Intermediate",
              "question": "Which access modifier allows members to be accessed in the same package and by subclasses in other packages?",
              "options": [
                "A. private",
                "B. default (package-private)",
                "C. protected",
                "D. public"
              ],
              "correct": "C",
              "answer": "C. protected",
              "explanation": "protected scope covers package and derived subclasses."
            },
            {
              "id": 5,
              "difficulty": "Basic",
              "question": "What is an IS-A relationship in Java object-oriented programming?",
              "options": [
                "A. Object composition",
                "B. Inheritance relationship (e.g. Dog IS-A Animal)",
                "C. Interface implementation only",
                "D. Exception handling rule"
              ],
              "correct": "B",
              "answer": "B. Inheritance relationship (e.g. Dog IS-A Animal)",
              "explanation": "Inheritance models IS-A relationships."
            },
            {
              "id": 6,
              "difficulty": "Intermediate",
              "question": "Which root class in Java is the ultimate superclass of all classes?",
              "options": [
                "A. Class",
                "B. java.lang.Object",
                "C. System",
                "D. Base"
              ],
              "correct": "B",
              "answer": "B. java.lang.Object",
              "explanation": "java.lang.Object is the top of Java class hierarchy."
            },
            {
              "id": 7,
              "difficulty": "Intermediate",
              "question": "Can private members of a superclass be directly accessed by a subclass?",
              "options": [
                "A. Yes, using super keyword",
                "B. No, private members are inaccessible outside the defining class",
                "C. Yes, if in same package",
                "D. Yes, via protected cast"
              ],
              "correct": "B",
              "answer": "B. No, private members are inaccessible outside the defining class",
              "explanation": "Private fields are restricted to the defining class."
            },
            {
              "id": 8,
              "difficulty": "Advanced",
              "question": "What happens if a subclass constructor does not explicitly call `super()` or `this()`?",
              "options": [
                "A. Compilation error",
                "B. Compiler automatically inserts a zero-argument `super()` call as first line",
                "C. Superclass constructor is skipped",
                "D. Objects cannot be instantiated"
              ],
              "correct": "B",
              "answer": "B. Compiler automatically inserts a zero-argument `super()` call as first line",
              "explanation": "super() is implicitly added by compiler."
            },
            {
              "id": 9,
              "difficulty": "Advanced",
              "question": "Which keyword prevents a class from being inherited/extended in Java?",
              "options": [
                "A. static",
                "B. final",
                "C. abstract",
                "D. sealed"
              ],
              "correct": "B",
              "answer": "B. final",
              "explanation": "A final class cannot be extended."
            },
            {
              "id": 10,
              "difficulty": "Advanced",
              "question": "What is single inheritance in object-oriented programming?",
              "options": [
                "A. A class inheriting from one single parent superclass",
                "B. A parent class having only one child",
                "C. An interface having one method",
                "D. A class extending an abstract class only"
              ],
              "correct": "A",
              "answer": "A. A class inheriting from one single parent superclass",
              "explanation": "Single inheritance means exactly one parent superclass."
            }
          ]
        },
        {
          "name": "Inheritance Mechanics & Operations",
          "simpleExplanation": "Stage 2 learning milestone for Inheritance.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 2 of Inheritance.",
          "video": {
            "title": "#55 Polymorphism in Java",
            "channel": "Telusko",
            "youtubeUrl": "https://www.youtube.com/watch?v=6U-0aUBiO5A"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 2 of Inheritance?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 2 covers key principles of Inheritance."
            }
          ]
        },
        {
          "name": "Inheritance Advanced Concepts & Applications",
          "simpleExplanation": "Stage 3 learning milestone for Inheritance.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 3 of Inheritance.",
          "video": {
            "title": "#40 Encapsulation in Java",
            "channel": "Telusko",
            "youtubeUrl": "https://www.youtube.com/watch?v=YbqneqDIZh8"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 3 of Inheritance?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 3 covers key principles of Inheritance."
            }
          ]
        },
        {
          "name": "Inheritance Solved Exam Problems & Review",
          "simpleExplanation": "Stage 4 learning milestone for Inheritance.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 4 of Inheritance.",
          "video": {
            "title": "Session 16- Java OOPS Concepts - Data Abstraction | Interface Concept in Java",
            "channel": "SDET- QA",
            "youtubeUrl": "https://www.youtube.com/watch?v=PBv0rQKrgXg"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 4 of Inheritance?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 4 covers key principles of Inheritance."
            }
          ]
        }
      ]
    },
    {
      "id": "oop-polymorphism",
      "name": "Polymorphism",
      "description": "Overloading vs Overriding, dynamic method dispatch, final methods.",
      "skillLevel": "Strong",
      "progressPct": 85,
      "gapLevel": "Low",
      "videos": [
        {
          "id": "v3",
          "videoId": "6U-0aUBiO5A",
          "title": "#55 Polymorphism in Java",
          "channelTitle": "Telusko",
          "url": "https://www.youtube.com/watch?v=6U-0aUBiO5A",
          "duration": "15:00"
        },
        {
          "id": "v4",
          "videoId": "YbqneqDIZh8",
          "title": "#40 Encapsulation in Java",
          "channelTitle": "Telusko",
          "url": "https://www.youtube.com/watch?v=YbqneqDIZh8",
          "duration": "15:00"
        },
        {
          "id": "v5",
          "videoId": "PBv0rQKrgXg",
          "title": "Session 16- Java OOPS Concepts - Data Abstraction | Interface Concept in Java",
          "channelTitle": "SDET- QA",
          "url": "https://www.youtube.com/watch?v=PBv0rQKrgXg",
          "duration": "15:00"
        },
        {
          "id": "v6",
          "videoId": "1XAfapkBQjk",
          "title": "Exception Handling in Java Tutorial",
          "channelTitle": "Coding with John",
          "url": "https://www.youtube.com/watch?v=1XAfapkBQjk",
          "duration": "15:00"
        }
      ],
      "subtopics": [
        {
          "name": "Polymorphism Core Principles",
          "simpleExplanation": "Core concepts for Polymorphism Core Principles",
          "keyConcepts": [
            "Core Concepts",
            "Mechanics",
            "Applications"
          ],
          "notes": "Essential notes for Polymorphism Core Principles",
          "video": {
            "title": "#55 Polymorphism in Java",
            "channel": "Telusko",
            "youtubeUrl": "https://www.youtube.com/watch?v=6U-0aUBiO5A"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "Method overloading in Java is an example of which type of polymorphism?",
              "options": [
                "A. Compile-time (Static) Polymorphism",
                "B. Runtime (Dynamic) Polymorphism",
                "C. Interface Polymorphism",
                "D. Virtual Polymorphism"
              ],
              "correct": "A",
              "answer": "A. Compile-time (Static) Polymorphism",
              "explanation": "Method overloading is resolved at compile time."
            },
            {
              "id": 2,
              "difficulty": "Basic",
              "question": "Method overriding in Java occurs when:",
              "options": [
                "A. Two methods in the same class have the same name but different parameters",
                "B. A subclass provides a specific implementation of a method already defined in its superclass",
                "C. A class implements two interfaces",
                "D. A method returns void"
              ],
              "correct": "B",
              "answer": "B. A subclass provides a specific implementation of a method already defined in its superclass",
              "explanation": "Overriding replaces superclass implementation in subclass."
            },
            {
              "id": 3,
              "difficulty": "Intermediate",
              "question": "Which keyword prevents a method from being overridden in Java subclasses?",
              "options": [
                "A. static",
                "B. final",
                "C. abstract",
                "D. const"
              ],
              "correct": "B",
              "answer": "B. final",
              "explanation": "final methods cannot be overridden."
            },
            {
              "id": 4,
              "difficulty": "Intermediate",
              "question": "What determines which overridden method gets executed during Dynamic Method Dispatch at runtime?",
              "options": [
                "A. Reference variable type",
                "B. Actual object type being referenced on Heap",
                "C. Return type of method",
                "D. Order of method declaration"
              ],
              "correct": "B",
              "answer": "B. Actual object type being referenced on Heap",
              "explanation": "Dispatch depends on actual object type on heap."
            },
            {
              "id": 5,
              "difficulty": "Advanced",
              "question": "Can static methods be overridden in Java?",
              "options": [
                "A. Yes, fully overridden",
                "B. No, static methods are hidden (method hiding), not overridden",
                "C. Yes, if marked public",
                "D. Only in abstract classes"
              ],
              "correct": "B",
              "answer": "B. No, static methods are hidden (method hiding), not overridden",
              "explanation": "Static methods undergo method hiding, not runtime dispatch."
            },
            {
              "id": 6,
              "difficulty": "Basic",
              "question": "Can method overloading differ ONLY by return type in Java?",
              "options": [
                "A. Yes",
                "B. No, parameter list MUST differ for overloading",
                "C. Yes, if public",
                "D. Yes, if in subclass"
              ],
              "correct": "B",
              "answer": "B. No, parameter list MUST differ for overloading",
              "explanation": "Parameter list must differ for method overloading."
            },
            {
              "id": 7,
              "difficulty": "Intermediate",
              "question": "What is Covariant Return Type in Java method overriding?",
              "options": [
                "A. Overridden method returning primitive",
                "B. Overridden method returning a subtype of original return type",
                "C. Overridden method returning void",
                "D. Overloading with different return types"
              ],
              "correct": "B",
              "answer": "B. Overridden method returning a subtype of original return type",
              "explanation": "Covariant return types allow returning a subtype in overridden methods."
            },
            {
              "id": 8,
              "difficulty": "Intermediate",
              "question": "Which annotation is best practice to use above an overridden method in Java?",
              "options": [
                "A. @Overload",
                "B. @Override",
                "C. @Inherit",
                "D. @Virtual"
              ],
              "correct": "B",
              "answer": "B. @Override",
              "explanation": "@Override ensures compiler verifies method overriding."
            },
            {
              "id": 9,
              "difficulty": "Advanced",
              "question": "Can a private method be overridden in Java subclasses?",
              "options": [
                "A. Yes, always",
                "B. No, private methods are not visible to subclasses",
                "C. Yes, if protected in child",
                "D. Yes, with super keyword"
              ],
              "correct": "B",
              "answer": "B. No, private methods are not visible to subclasses",
              "explanation": "Private methods cannot be overridden."
            },
            {
              "id": 10,
              "difficulty": "Advanced",
              "question": "What is the runtime consequence of calling an overridden method on a null reference?",
              "options": [
                "A. Default method executes",
                "B. NullPointerException is thrown",
                "C. ClassCastException",
                "D. Method is skipped"
              ],
              "correct": "B",
              "answer": "B. NullPointerException is thrown",
              "explanation": "Calling methods on null throws NullPointerException."
            }
          ]
        },
        {
          "name": "Polymorphism Mechanics & Operations",
          "simpleExplanation": "Stage 2 learning milestone for Polymorphism.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 2 of Polymorphism.",
          "video": {
            "title": "#40 Encapsulation in Java",
            "channel": "Telusko",
            "youtubeUrl": "https://www.youtube.com/watch?v=YbqneqDIZh8"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 2 of Polymorphism?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 2 covers key principles of Polymorphism."
            }
          ]
        },
        {
          "name": "Polymorphism Advanced Concepts & Applications",
          "simpleExplanation": "Stage 3 learning milestone for Polymorphism.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 3 of Polymorphism.",
          "video": {
            "title": "Session 16- Java OOPS Concepts - Data Abstraction | Interface Concept in Java",
            "channel": "SDET- QA",
            "youtubeUrl": "https://www.youtube.com/watch?v=PBv0rQKrgXg"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 3 of Polymorphism?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 3 covers key principles of Polymorphism."
            }
          ]
        },
        {
          "name": "Polymorphism Solved Exam Problems & Review",
          "simpleExplanation": "Stage 4 learning milestone for Polymorphism.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 4 of Polymorphism.",
          "video": {
            "title": "Exception Handling in Java Tutorial",
            "channel": "Coding with John",
            "youtubeUrl": "https://www.youtube.com/watch?v=1XAfapkBQjk"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 4 of Polymorphism?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 4 covers key principles of Polymorphism."
            }
          ]
        }
      ]
    },
    {
      "id": "oop-encapsulation",
      "name": "Encapsulation",
      "description": "Private fields, getters/setters, data hiding, and JavaBeans standards.",
      "skillLevel": "Strong",
      "progressPct": 85,
      "gapLevel": "Low",
      "videos": [
        {
          "id": "v4",
          "videoId": "YbqneqDIZh8",
          "title": "#40 Encapsulation in Java",
          "channelTitle": "Telusko",
          "url": "https://www.youtube.com/watch?v=YbqneqDIZh8",
          "duration": "15:00"
        },
        {
          "id": "v5",
          "videoId": "PBv0rQKrgXg",
          "title": "Session 16- Java OOPS Concepts - Data Abstraction | Interface Concept in Java",
          "channelTitle": "SDET- QA",
          "url": "https://www.youtube.com/watch?v=PBv0rQKrgXg",
          "duration": "15:00"
        },
        {
          "id": "v6",
          "videoId": "1XAfapkBQjk",
          "title": "Exception Handling in Java Tutorial",
          "channelTitle": "Coding with John",
          "url": "https://www.youtube.com/watch?v=1XAfapkBQjk",
          "duration": "15:00"
        },
        {
          "id": "v7",
          "videoId": "9JpNY-XAseg",
          "title": "Java Programming Tutorial - 49 - Inheritance",
          "channelTitle": "thenewboston",
          "url": "https://www.youtube.com/watch?v=9JpNY-XAseg",
          "duration": "15:00"
        }
      ],
      "subtopics": [
        {
          "name": "Encapsulation Core Principles",
          "simpleExplanation": "Core concepts for Encapsulation Core Principles",
          "keyConcepts": [
            "Core Concepts",
            "Mechanics",
            "Applications"
          ],
          "notes": "Essential notes for Encapsulation Core Principles",
          "video": {
            "title": "#40 Encapsulation in Java",
            "channel": "Telusko",
            "youtubeUrl": "https://www.youtube.com/watch?v=YbqneqDIZh8"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "How is encapsulation achieved in Java classes?",
              "options": [
                "A. Making fields public and methods private",
                "B. Declaring fields private and providing public getter and setter methods",
                "C. Inheriting from multiple interfaces",
                "D. Making all methods final"
              ],
              "correct": "B",
              "answer": "B. Declaring fields private and providing public getter and setter methods",
              "explanation": "Encapsulation restricts direct field access via getters/setters."
            },
            {
              "id": 2,
              "difficulty": "Basic",
              "question": "What is the primary objective of data hiding in encapsulation?",
              "options": [
                "A. Increase execution speed",
                "B. Protect object internal state from unauthorized external direct modification",
                "C. Enable multiple inheritance",
                "D. Compress object size"
              ],
              "correct": "B",
              "answer": "B. Protect object internal state from unauthorized external direct modification",
              "explanation": "Data hiding prevents unauthorized modification of object state."
            },
            {
              "id": 3,
              "difficulty": "Intermediate",
              "question": "What is a fully encapsulated class in Java commonly referred to as?",
              "options": [
                "A. Abstract Class",
                "B. Java Bean / POJO",
                "C. Singleton Class",
                "D. Anonymous Class"
              ],
              "correct": "B",
              "answer": "B. Java Bean / POJO",
              "explanation": "POJOs and JavaBeans encapsulate private state."
            },
            {
              "id": 4,
              "difficulty": "Intermediate",
              "question": "Which access modifier provides the highest level of restriction in Java?",
              "options": [
                "A. public",
                "B. protected",
                "C. default",
                "D. private"
              ],
              "correct": "D",
              "answer": "D. private",
              "explanation": "private is the most restrictive access modifier."
            },
            {
              "id": 5,
              "difficulty": "Basic",
              "question": "How can an immutable class object be created in Java?",
              "options": [
                "A. Declare fields public static",
                "B. Make class final, fields private final, and provide no setter methods",
                "C. Use abstract modifier",
                "D. Implement Cloneable"
              ],
              "correct": "B",
              "answer": "B. Make class final, fields private final, and provide no setter methods",
              "explanation": "Immutability requires final class and private final fields without setters."
            },
            {
              "id": 6,
              "difficulty": "Intermediate",
              "question": "Why is setter method validation useful in encapsulated classes?",
              "options": [
                "A. Speeds up garbage collection",
                "B. Enforces business validation logic before updating field values",
                "C. Allows multiple inheritance",
                "D. Prevents compiler errors"
              ],
              "correct": "B",
              "answer": "B. Enforces business validation logic before updating field values",
              "explanation": "Setters validate state before updating fields."
            },
            {
              "id": 7,
              "difficulty": "Intermediate",
              "question": "What is read-only class encapsulation in Java?",
              "options": [
                "A. Providing only getter methods and no setter methods",
                "B. Providing only setter methods",
                "C. Declaring methods static",
                "D. Using private constructors"
              ],
              "correct": "A",
              "answer": "A. Providing only getter methods and no setter methods",
              "explanation": "Read-only classes expose getters and omit setters."
            },
            {
              "id": 8,
              "difficulty": "Advanced",
              "question": "Does encapsulation improve modularity and maintainability of code?",
              "options": [
                "A. Yes, internal changes can occur without breaking external API contracts",
                "B. No, it increases coupling",
                "C. No, it prevents refactoring",
                "D. Only for primitive types"
              ],
              "correct": "A",
              "answer": "A. Yes, internal changes can occur without breaking external API contracts",
              "explanation": "Encapsulation decouples internal state from external API."
            },
            {
              "id": 9,
              "difficulty": "Advanced",
              "question": "Which standard Java built-in class is completely immutable?",
              "options": [
                "A. java.util.ArrayList",
                "B. java.lang.String",
                "C. java.lang.StringBuilder",
                "D. java.util.HashMap"
              ],
              "correct": "B",
              "answer": "B. java.lang.String",
              "explanation": "java.lang.String objects are immutable."
            },
            {
              "id": 10,
              "difficulty": "Advanced",
              "question": "What access level is assigned to a member if no modifier keyword is specified?",
              "options": [
                "A. public",
                "B. default (package-private)",
                "C. protected",
                "D. private"
              ],
              "correct": "B",
              "answer": "B. default (package-private)",
              "explanation": "Omitting explicit modifier grants default package-private access."
            }
          ]
        },
        {
          "name": "Encapsulation Mechanics & Operations",
          "simpleExplanation": "Stage 2 learning milestone for Encapsulation.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 2 of Encapsulation.",
          "video": {
            "title": "Session 16- Java OOPS Concepts - Data Abstraction | Interface Concept in Java",
            "channel": "SDET- QA",
            "youtubeUrl": "https://www.youtube.com/watch?v=PBv0rQKrgXg"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 2 of Encapsulation?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 2 covers key principles of Encapsulation."
            }
          ]
        },
        {
          "name": "Encapsulation Advanced Concepts & Applications",
          "simpleExplanation": "Stage 3 learning milestone for Encapsulation.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 3 of Encapsulation.",
          "video": {
            "title": "Exception Handling in Java Tutorial",
            "channel": "Coding with John",
            "youtubeUrl": "https://www.youtube.com/watch?v=1XAfapkBQjk"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 3 of Encapsulation?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 3 covers key principles of Encapsulation."
            }
          ]
        },
        {
          "name": "Encapsulation Solved Exam Problems & Review",
          "simpleExplanation": "Stage 4 learning milestone for Encapsulation.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 4 of Encapsulation.",
          "video": {
            "title": "Java Programming Tutorial - 49 - Inheritance",
            "channel": "thenewboston",
            "youtubeUrl": "https://www.youtube.com/watch?v=9JpNY-XAseg"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 4 of Encapsulation?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 4 covers key principles of Encapsulation."
            }
          ]
        }
      ]
    },
    {
      "id": "oop-abstraction",
      "name": "Abstraction & Interfaces",
      "description": "Abstract classes, interface contracts, default/static methods.",
      "skillLevel": "Strong",
      "progressPct": 85,
      "gapLevel": "Low",
      "videos": [
        {
          "id": "v5",
          "videoId": "PBv0rQKrgXg",
          "title": "Session 16- Java OOPS Concepts - Data Abstraction | Interface Concept in Java",
          "channelTitle": "SDET- QA",
          "url": "https://www.youtube.com/watch?v=PBv0rQKrgXg",
          "duration": "15:00"
        },
        {
          "id": "v6",
          "videoId": "1XAfapkBQjk",
          "title": "Exception Handling in Java Tutorial",
          "channelTitle": "Coding with John",
          "url": "https://www.youtube.com/watch?v=1XAfapkBQjk",
          "duration": "15:00"
        },
        {
          "id": "v7",
          "videoId": "9JpNY-XAseg",
          "title": "Java Programming Tutorial - 49 - Inheritance",
          "channelTitle": "thenewboston",
          "url": "https://www.youtube.com/watch?v=9JpNY-XAseg",
          "duration": "15:00"
        },
        {
          "id": "v8",
          "videoId": "HvPlEJ3LHgE",
          "title": "Abstract Classes and Methods in Java Explained in 7 Minutes",
          "channelTitle": "Coding with John",
          "url": "https://www.youtube.com/watch?v=HvPlEJ3LHgE",
          "duration": "15:00"
        }
      ],
      "subtopics": [
        {
          "name": "Abstraction & Interfaces Core Principles",
          "simpleExplanation": "Core concepts for Abstraction & Interfaces Core Principles",
          "keyConcepts": [
            "Core Concepts",
            "Mechanics",
            "Applications"
          ],
          "notes": "Essential notes for Abstraction & Interfaces Core Principles",
          "video": {
            "title": "Session 16- Java OOPS Concepts - Data Abstraction | Interface Concept in Java",
            "channel": "SDET- QA",
            "youtubeUrl": "https://www.youtube.com/watch?v=PBv0rQKrgXg"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "Can an Abstract Class in Java be directly instantiated using `new AbstractClass()`?",
              "options": [
                "A. Yes, always",
                "B. No, abstract classes cannot be directly instantiated",
                "C. Yes, if constructor is public",
                "D. Yes, if it has no abstract methods"
              ],
              "correct": "B",
              "answer": "B. No, abstract classes cannot be directly instantiated",
              "explanation": "Abstract classes cannot be instantiated directly."
            },
            {
              "id": 2,
              "difficulty": "Basic",
              "question": "Which Java keyword is used by a class to implement an interface?",
              "options": [
                "A. extends",
                "B. implements",
                "C. inherits",
                "D. uses"
              ],
              "correct": "B",
              "answer": "B. implements",
              "explanation": "implements keyword is used for interface implementation."
            },
            {
              "id": 3,
              "difficulty": "Intermediate",
              "question": "By default, what are the implicit modifiers for variables declared inside a Java Interface?",
              "options": [
                "A. private final",
                "B. public static final",
                "C. protected static",
                "D. default private"
              ],
              "correct": "B",
              "answer": "B. public static final",
              "explanation": "Interface variables are public static final constants."
            },
            {
              "id": 4,
              "difficulty": "Intermediate",
              "question": "Starting from Java 8, can interfaces contain concrete method implementations?",
              "options": [
                "A. No, never",
                "B. Yes, using default and static keywords",
                "C. Yes, using abstract keyword",
                "D. Yes, using private default only"
              ],
              "correct": "B",
              "answer": "B. Yes, using default and static keywords",
              "explanation": "Java 8 allows default and static interface methods."
            },
            {
              "id": 5,
              "difficulty": "Intermediate",
              "question": "Can a single Java class implement multiple interfaces?",
              "options": [
                "A. No, only one interface",
                "B. Yes, comma-separated multiple interfaces",
                "C. Only if interfaces have no methods",
                "D. Only if marked static"
              ],
              "correct": "B",
              "answer": "B. Yes, comma-separated multiple interfaces",
              "explanation": "Classes can implement multiple interfaces."
            },
            {
              "id": 6,
              "difficulty": "Basic",
              "question": "What happens if a concrete subclass fails to implement an abstract method inherited from a superclass?",
              "options": [
                "A. Ignores the method",
                "B. Compilation error occurs unless the subclass is also marked abstract",
                "C. Runtime warning",
                "D. Automatically generates dummy return"
              ],
              "correct": "B",
              "answer": "B. Compilation error occurs unless the subclass is also marked abstract",
              "explanation": "Concrete subclasses must implement all abstract methods."
            },
            {
              "id": 7,
              "difficulty": "Intermediate",
              "question": "Can an abstract class contain concrete methods with implementation bodies?",
              "options": [
                "A. No, all methods must be abstract",
                "B. Yes, abstract classes can contain both abstract and concrete methods",
                "C. Only static methods",
                "D. Only private methods"
              ],
              "correct": "B",
              "answer": "B. Yes, abstract classes can contain both abstract and concrete methods",
              "explanation": "Abstract classes mix abstract and concrete methods."
            },
            {
              "id": 8,
              "difficulty": "Advanced",
              "question": "What is a Functional Interface in Java?",
              "options": [
                "A. An interface with no methods",
                "B. An interface containing exactly one abstract method",
                "C. An interface with only static methods",
                "D. An interface extending AbstractClass"
              ],
              "correct": "B",
              "answer": "B. An interface containing exactly one abstract method",
              "explanation": "Functional interfaces have exactly one abstract method."
            },
            {
              "id": 9,
              "difficulty": "Advanced",
              "question": "Can an interface extend another interface in Java?",
              "options": [
                "A. No",
                "B. Yes, using the extends keyword",
                "C. Yes, using implements keyword",
                "D. Only via inner classes"
              ],
              "correct": "B",
              "answer": "B. Yes, using the extends keyword",
              "explanation": "Interfaces extend other interfaces."
            },
            {
              "id": 10,
              "difficulty": "Advanced",
              "question": "What is a Marker Interface in Java?",
              "options": [
                "A. Interface with 10 methods",
                "B. Empty interface with no methods or fields (e.g. Serializable, Cloneable)",
                "C. Interface with default methods only",
                "D. Interface used for graphics"
              ],
              "correct": "B",
              "answer": "B. Empty interface with no methods or fields (e.g. Serializable, Cloneable)",
              "explanation": "Marker interfaces carry no methods or attributes."
            }
          ]
        },
        {
          "name": "Abstraction & Interfaces Mechanics & Operations",
          "simpleExplanation": "Stage 2 learning milestone for Abstraction & Interfaces.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 2 of Abstraction & Interfaces.",
          "video": {
            "title": "Exception Handling in Java Tutorial",
            "channel": "Coding with John",
            "youtubeUrl": "https://www.youtube.com/watch?v=1XAfapkBQjk"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 2 of Abstraction & Interfaces?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 2 covers key principles of Abstraction & Interfaces."
            }
          ]
        },
        {
          "name": "Abstraction & Interfaces Advanced Concepts & Applications",
          "simpleExplanation": "Stage 3 learning milestone for Abstraction & Interfaces.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 3 of Abstraction & Interfaces.",
          "video": {
            "title": "Java Programming Tutorial - 49 - Inheritance",
            "channel": "thenewboston",
            "youtubeUrl": "https://www.youtube.com/watch?v=9JpNY-XAseg"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 3 of Abstraction & Interfaces?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 3 covers key principles of Abstraction & Interfaces."
            }
          ]
        },
        {
          "name": "Abstraction & Interfaces Solved Exam Problems & Review",
          "simpleExplanation": "Stage 4 learning milestone for Abstraction & Interfaces.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 4 of Abstraction & Interfaces.",
          "video": {
            "title": "Abstract Classes and Methods in Java Explained in 7 Minutes",
            "channel": "Coding with John",
            "youtubeUrl": "https://www.youtube.com/watch?v=HvPlEJ3LHgE"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 4 of Abstraction & Interfaces?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 4 covers key principles of Abstraction & Interfaces."
            }
          ]
        }
      ]
    }
  ],
  "dbms": [
    {
      "id": "dbms-er-model",
      "name": "ER Model & Relational Model",
      "description": "Entity-Relationship diagrams, cardinality ratios, primary and foreign keys.",
      "skillLevel": "Strong",
      "progressPct": 85,
      "gapLevel": "Low",
      "videos": [
        {
          "id": "v1",
          "videoId": "9yeOJ0ZMUYw",
          "title": "SQL Joins Explained  |\u00a6| Joins in SQL |\u00a6| SQL Tutorial",
          "channelTitle": "Socratica",
          "url": "https://www.youtube.com/watch?v=9yeOJ0ZMUYw",
          "duration": "15:00"
        },
        {
          "id": "v2",
          "videoId": "QpdhBUYk7Kk",
          "title": "Entity Relationship Diagram (ERD) Tutorial - Part 1",
          "channelTitle": "Lucid Software",
          "url": "https://www.youtube.com/watch?v=QpdhBUYk7Kk",
          "duration": "15:00"
        },
        {
          "id": "v3",
          "videoId": "aZjYr87r1b8",
          "title": "10.2  B Trees and B+ Trees. How they are useful in Databases",
          "channelTitle": "Abdul Bari",
          "url": "https://www.youtube.com/watch?v=aZjYr87r1b8",
          "duration": "15:00"
        },
        {
          "id": "v4",
          "videoId": "LpqnU533v3M",
          "title": "Database Design",
          "channelTitle": "Neso Academy",
          "url": "https://www.youtube.com/watch?v=LpqnU533v3M",
          "duration": "15:00"
        }
      ],
      "subtopics": [
        {
          "name": "ER Model & Relational Model Core Principles",
          "simpleExplanation": "Core concepts for ER Model & Relational Model Core Principles",
          "keyConcepts": [
            "Core Concepts",
            "Mechanics",
            "Applications"
          ],
          "notes": "Essential notes for ER Model & Relational Model Core Principles",
          "video": {
            "title": "SQL Joins Explained  |\u00a6| Joins in SQL |\u00a6| SQL Tutorial",
            "channel": "Socratica",
            "youtubeUrl": "https://www.youtube.com/watch?v=9yeOJ0ZMUYw"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "In an ER Diagram, how is a weak entity set graphically represented?",
              "options": [
                "A. Double Rectangle",
                "B. Ellipse",
                "C. Diamond",
                "D. Dashed Line"
              ],
              "correct": "A",
              "answer": "A. Double Rectangle",
              "explanation": "Weak entity sets are represented by double rectangles in ER diagrams."
            },
            {
              "id": 2,
              "difficulty": "Basic",
              "question": "What is the primary characteristic of a Primary Key in a relational schema?",
              "options": [
                "A. Can contain duplicate values",
                "B. Uniquely identifies tuples and cannot contain NULL values",
                "C. Must be a numeric string",
                "D. Can be null if foreign key is set"
              ],
              "correct": "B",
              "answer": "B. Uniquely identifies tuples and cannot contain NULL values",
              "explanation": "Primary keys must uniquely identify each tuple and disallow NULL."
            },
            {
              "id": 3,
              "difficulty": "Intermediate",
              "question": "What does Cardinality Ratio specify in an ER relationship set?",
              "options": [
                "A. Number of attributes per entity",
                "B. Number of relationship instances in which an entity can participate (1:1, 1:N, N:M)",
                "C. Total count of rows",
                "D. Index depth"
              ],
              "correct": "B",
              "answer": "B. Number of relationship instances in which an entity can participate (1:1, 1:N, N:M)",
              "explanation": "Cardinality ratio measures max relationship mapping ratio."
            },
            {
              "id": 4,
              "difficulty": "Basic",
              "question": "Which entity attribute type can be divided into smaller sub-parts (e.g. Name -> First_Name, Last_Name)?",
              "options": [
                "A. Multi-valued attribute",
                "B. Composite attribute",
                "C. Derived attribute",
                "D. Primary attribute"
              ],
              "correct": "B",
              "answer": "B. Composite attribute",
              "explanation": "Composite attributes can be decomposed into sub-components."
            },
            {
              "id": 5,
              "difficulty": "Basic",
              "question": "How is a derived attribute graphically represented in an ER Diagram?",
              "options": [
                "A. Solid Ellipse",
                "B. Dashed Ellipse",
                "C. Double Ellipse",
                "D. Rectangle"
              ],
              "correct": "B",
              "answer": "B. Dashed Ellipse",
              "explanation": "Derived attributes are shown using dashed ellipses."
            },
            {
              "id": 6,
              "difficulty": "Intermediate",
              "question": "What is the role of a Foreign Key in a relational database table?",
              "options": [
                "A. Speeds up full table scan",
                "B. References Primary Key of another relation to enforce referential integrity",
                "C. Prevents insertion of rows",
                "D. Uniquely identifies rows"
              ],
              "correct": "B",
              "answer": "B. References Primary Key of another relation to enforce referential integrity",
              "explanation": "Foreign keys enforce referential integrity between tables."
            },
            {
              "id": 7,
              "difficulty": "Basic",
              "question": "How is a multi-valued attribute represented in an ER Diagram?",
              "options": [
                "A. Dashed Ellipse",
                "B. Double Ellipse",
                "C. Diamond",
                "D. Double Rectangle"
              ],
              "correct": "B",
              "answer": "B. Double Ellipse",
              "explanation": "Multi-valued attributes are represented by double ellipses."
            },
            {
              "id": 8,
              "difficulty": "Intermediate",
              "question": "What is a Relational Schema?",
              "options": [
                "A. Current contents of table",
                "B. Logical structure and definition of a relation including attributes and domains",
                "C. SQL query output",
                "D. Database backup file"
              ],
              "correct": "B",
              "answer": "B. Logical structure and definition of a relation including attributes and domains",
              "explanation": "Relational schema defines the structural metadata of a relation."
            },
            {
              "id": 9,
              "difficulty": "Advanced",
              "question": "What is the difference between a Super Key and a Candidate Key?",
              "options": [
                "A. Super keys allow nulls",
                "B. Candidate Key is a minimal Super Key with no redundant attributes",
                "C. Super keys must be foreign keys",
                "D. Candidate keys are non-unique"
              ],
              "correct": "B",
              "answer": "B. Candidate Key is a minimal Super Key with no redundant attributes",
              "explanation": "Candidate keys are irreducible minimal super keys."
            },
            {
              "id": 10,
              "difficulty": "Advanced",
              "question": "What does the Entity Integrity Constraint dictate in Relational Model?",
              "options": [
                "A. Foreign keys must match primary keys",
                "B. No primary key attribute value can be NULL",
                "C. All columns must be integers",
                "D. Tables cannot exceed 100 rows"
              ],
              "correct": "B",
              "answer": "B. No primary key attribute value can be NULL",
              "explanation": "Entity integrity mandates non-null primary keys."
            }
          ]
        },
        {
          "name": "ER Model & Relational Model Mechanics & Operations",
          "simpleExplanation": "Stage 2 learning milestone for ER Model & Relational Model.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 2 of ER Model & Relational Model.",
          "video": {
            "title": "Entity Relationship Diagram (ERD) Tutorial - Part 1",
            "channel": "Lucid Software",
            "youtubeUrl": "https://www.youtube.com/watch?v=QpdhBUYk7Kk"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 2 of ER Model & Relational Model?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 2 covers key principles of ER Model & Relational Model."
            }
          ]
        },
        {
          "name": "ER Model & Relational Model Advanced Concepts & Applications",
          "simpleExplanation": "Stage 3 learning milestone for ER Model & Relational Model.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 3 of ER Model & Relational Model.",
          "video": {
            "title": "10.2  B Trees and B+ Trees. How they are useful in Databases",
            "channel": "Abdul Bari",
            "youtubeUrl": "https://www.youtube.com/watch?v=aZjYr87r1b8"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 3 of ER Model & Relational Model?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 3 covers key principles of ER Model & Relational Model."
            }
          ]
        },
        {
          "name": "ER Model & Relational Model Solved Exam Problems & Review",
          "simpleExplanation": "Stage 4 learning milestone for ER Model & Relational Model.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 4 of ER Model & Relational Model.",
          "video": {
            "title": "Database Design",
            "channel": "Neso Academy",
            "youtubeUrl": "https://www.youtube.com/watch?v=LpqnU533v3M"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 4 of ER Model & Relational Model?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 4 covers key principles of ER Model & Relational Model."
            }
          ]
        }
      ]
    },
    {
      "id": "dbms-relational-algebra-sql",
      "name": "Relational Algebra & SQL",
      "description": "Procedural relational algebra operators and declarative SQL querying techniques.",
      "skillLevel": "Strong",
      "progressPct": 85,
      "gapLevel": "Low",
      "videos": [
        {
          "id": "v2",
          "videoId": "QpdhBUYk7Kk",
          "title": "Entity Relationship Diagram (ERD) Tutorial - Part 1",
          "channelTitle": "Lucid Software",
          "url": "https://www.youtube.com/watch?v=QpdhBUYk7Kk",
          "duration": "15:00"
        },
        {
          "id": "v3",
          "videoId": "aZjYr87r1b8",
          "title": "10.2  B Trees and B+ Trees. How they are useful in Databases",
          "channelTitle": "Abdul Bari",
          "url": "https://www.youtube.com/watch?v=aZjYr87r1b8",
          "duration": "15:00"
        },
        {
          "id": "v4",
          "videoId": "LpqnU533v3M",
          "title": "Database Design",
          "channelTitle": "Neso Academy",
          "url": "https://www.youtube.com/watch?v=LpqnU533v3M",
          "duration": "15:00"
        },
        {
          "id": "v5",
          "videoId": "4YilEjkNPrQ",
          "title": "Lec-50: Introduction to Relational Algebra | Database Management System",
          "channelTitle": "Gate Smashers",
          "url": "https://www.youtube.com/watch?v=4YilEjkNPrQ",
          "duration": "15:00"
        }
      ],
      "subtopics": [
        {
          "name": "Relational Algebra & SQL Core Principles",
          "simpleExplanation": "Core concepts for Relational Algebra & SQL Core Principles",
          "keyConcepts": [
            "Core Concepts",
            "Mechanics",
            "Applications"
          ],
          "notes": "Essential notes for Relational Algebra & SQL Core Principles",
          "video": {
            "title": "Entity Relationship Diagram (ERD) Tutorial - Part 1",
            "channel": "Lucid Software",
            "youtubeUrl": "https://www.youtube.com/watch?v=QpdhBUYk7Kk"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "Which relational algebra operator is used to select tuples (rows) that satisfy a given predicate?",
              "options": [
                "A. Projection (\u03c0)",
                "B. Selection (\u03c3)",
                "C. Cartesian Product (\u00d7)",
                "D. Join (\u22c8)"
              ],
              "correct": "B",
              "answer": "B. Selection (\u03c3)",
              "explanation": "Selection filters rows satisfying a predicate."
            },
            {
              "id": 2,
              "difficulty": "Basic",
              "question": "Which SQL clause is used to filter records BEFORE group aggregation occurs?",
              "options": [
                "A. HAVING",
                "B. WHERE",
                "C. ORDER BY",
                "D. GROUP BY"
              ],
              "correct": "B",
              "answer": "B. WHERE",
              "explanation": "WHERE filters rows before aggregation occurs."
            },
            {
              "id": 3,
              "difficulty": "Basic",
              "question": "What does a LEFT OUTER JOIN return if there is no match in the right table?",
              "options": [
                "A. Omits the row",
                "B. Fills right table columns with NULL",
                "C. Raises a database error",
                "D. Duplicates left table row"
              ],
              "correct": "B",
              "answer": "B. Fills right table columns with NULL",
              "explanation": "LEFT JOIN preserves unmatched left rows with NULL for right attributes."
            },
            {
              "id": 4,
              "difficulty": "Intermediate",
              "question": "Which relational algebra operation combines rows from two relations where a specified condition is met?",
              "options": [
                "A. Theta Join (\u22c8\u03b8)",
                "B. Set Union (\u222a)",
                "C. Set Difference (-)",
                "D. Division (\u00f7)"
              ],
              "correct": "A",
              "answer": "A. Theta Join (\u22c8\u03b8)",
              "explanation": "Theta Join combines tuples matching condition theta."
            },
            {
              "id": 5,
              "difficulty": "Intermediate",
              "question": "Which SQL function counts non-NULL values in a specified column?",
              "options": [
                "A. SUM()",
                "B. COUNT(column)",
                "C. COUNT(*)",
                "D. AVG()"
              ],
              "correct": "B",
              "answer": "B. COUNT(column)",
              "explanation": "COUNT(col) excludes NULL values."
            },
            {
              "id": 6,
              "difficulty": "Intermediate",
              "question": "What is the result of the Cartesian Product of relation R (5 rows) and relation S (4 rows)?",
              "options": [
                "A. 9 rows",
                "B. 20 rows",
                "C. 5 rows",
                "D. 1 row"
              ],
              "correct": "B",
              "answer": "B. 20 rows",
              "explanation": "Cartesian product yields 5 * 4 = 20 total tuples."
            },
            {
              "id": 7,
              "difficulty": "Advanced",
              "question": "Which relational algebra operator is equivalent to the SQL 'SELECT DISTINCT column FROM table' query?",
              "options": [
                "A. Selection (\u03c3)",
                "B. Projection (\u03c0)",
                "C. Rename (\u03c1)",
                "D. Natural Join (\u22c8)"
              ],
              "correct": "B",
              "answer": "B. Projection (\u03c0)",
              "explanation": "Relational Projection mathematically eliminates duplicate tuples."
            },
            {
              "id": 8,
              "difficulty": "Advanced",
              "question": "Which clause must be present in an SQL statement whenever non-aggregated columns appear alongside aggregate functions?",
              "options": [
                "A. ORDER BY",
                "B. GROUP BY",
                "C. WHERE",
                "D. HAVING"
              ],
              "correct": "B",
              "answer": "B. GROUP BY",
              "explanation": "Non-aggregated selected attributes must be in GROUP BY."
            },
            {
              "id": 9,
              "difficulty": "Intermediate",
              "question": "Which SQL set operator combines result sets of two queries and automatically removes duplicate rows?",
              "options": [
                "A. UNION ALL",
                "B. UNION",
                "C. INTERSECT",
                "D. EXCEPT"
              ],
              "correct": "B",
              "answer": "B. UNION",
              "explanation": "UNION combines result sets eliminating duplicates."
            },
            {
              "id": 10,
              "difficulty": "Advanced",
              "question": "What is Natural Join (\u22c8) in relational algebra?",
              "options": [
                "A. Cartesian product with all rows",
                "B. Binary operator joining relations on all common attributes with equal values",
                "C. Left outer join only",
                "D. Division operation"
              ],
              "correct": "B",
              "answer": "B. Binary operator joining relations on all common attributes with equal values",
              "explanation": "Natural join automatically joins matching attributes with equal values."
            }
          ]
        },
        {
          "name": "Relational Algebra & SQL Mechanics & Operations",
          "simpleExplanation": "Stage 2 learning milestone for Relational Algebra & SQL.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 2 of Relational Algebra & SQL.",
          "video": {
            "title": "10.2  B Trees and B+ Trees. How they are useful in Databases",
            "channel": "Abdul Bari",
            "youtubeUrl": "https://www.youtube.com/watch?v=aZjYr87r1b8"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 2 of Relational Algebra & SQL?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 2 covers key principles of Relational Algebra & SQL."
            }
          ]
        },
        {
          "name": "Relational Algebra & SQL Advanced Concepts & Applications",
          "simpleExplanation": "Stage 3 learning milestone for Relational Algebra & SQL.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 3 of Relational Algebra & SQL.",
          "video": {
            "title": "Database Design",
            "channel": "Neso Academy",
            "youtubeUrl": "https://www.youtube.com/watch?v=LpqnU533v3M"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 3 of Relational Algebra & SQL?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 3 covers key principles of Relational Algebra & SQL."
            }
          ]
        },
        {
          "name": "Relational Algebra & SQL Solved Exam Problems & Review",
          "simpleExplanation": "Stage 4 learning milestone for Relational Algebra & SQL.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 4 of Relational Algebra & SQL.",
          "video": {
            "title": "Lec-50: Introduction to Relational Algebra | Database Management System",
            "channel": "Gate Smashers",
            "youtubeUrl": "https://www.youtube.com/watch?v=4YilEjkNPrQ"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 4 of Relational Algebra & SQL?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 4 covers key principles of Relational Algebra & SQL."
            }
          ]
        }
      ]
    },
    {
      "id": "dbms-normalization",
      "name": "Database Normalization",
      "description": "Functional dependencies, candidate key determination, and normal forms (1NF to BCNF).",
      "skillLevel": "Strong",
      "progressPct": 85,
      "gapLevel": "Low",
      "videos": [
        {
          "id": "v3",
          "videoId": "aZjYr87r1b8",
          "title": "10.2  B Trees and B+ Trees. How they are useful in Databases",
          "channelTitle": "Abdul Bari",
          "url": "https://www.youtube.com/watch?v=aZjYr87r1b8",
          "duration": "15:00"
        },
        {
          "id": "v4",
          "videoId": "LpqnU533v3M",
          "title": "Database Design",
          "channelTitle": "Neso Academy",
          "url": "https://www.youtube.com/watch?v=LpqnU533v3M",
          "duration": "15:00"
        },
        {
          "id": "v5",
          "videoId": "4YilEjkNPrQ",
          "title": "Lec-50: Introduction to Relational Algebra | Database Management System",
          "channelTitle": "Gate Smashers",
          "url": "https://www.youtube.com/watch?v=4YilEjkNPrQ",
          "duration": "15:00"
        },
        {
          "id": "v6",
          "videoId": "ABwD8IYByfk",
          "title": "What is Normalization in SQL? | Database Normalization Forms - 1NF, 2NF, 3NF, BCNF | Edureka",
          "channelTitle": "edureka!",
          "url": "https://www.youtube.com/watch?v=ABwD8IYByfk",
          "duration": "15:00"
        }
      ],
      "subtopics": [
        {
          "name": "Database Normalization Core Principles",
          "simpleExplanation": "Core concepts for Database Normalization Core Principles",
          "keyConcepts": [
            "Core Concepts",
            "Mechanics",
            "Applications"
          ],
          "notes": "Essential notes for Database Normalization Core Principles",
          "video": {
            "title": "10.2  B Trees and B+ Trees. How they are useful in Databases",
            "channel": "Abdul Bari",
            "youtubeUrl": "https://www.youtube.com/watch?v=aZjYr87r1b8"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "Which Normal Form requires attribute values in every column to be atomic (indivisible)?",
              "options": [
                "A. 1NF",
                "B. 2NF",
                "C. 3NF",
                "D. BCNF"
              ],
              "correct": "A",
              "answer": "A. 1NF",
              "explanation": "1NF disallows composite or multi-valued attributes."
            },
            {
              "id": 2,
              "difficulty": "Basic",
              "question": "A functional dependency X \u2192 Y is trivial if:",
              "options": [
                "A. Y is a subset of X",
                "B. X is a subset of Y",
                "C. X and Y are disjoint",
                "D. X is a primary key"
              ],
              "correct": "A",
              "answer": "A. Y is a subset of X",
              "explanation": "X -> Y is trivial when Y is a subset of X."
            },
            {
              "id": 3,
              "difficulty": "Basic",
              "question": "Partial dependency occurs when a non-prime attribute depends on:",
              "options": [
                "A. A proper subset of a candidate key",
                "B. The full candidate key",
                "C. Another non-prime attribute",
                "D. A foreign key"
              ],
              "correct": "A",
              "answer": "A. A proper subset of a candidate key",
              "explanation": "2NF eliminates dependencies on part of a composite key."
            },
            {
              "id": 4,
              "difficulty": "Intermediate",
              "question": "Removing transitive dependencies (non-prime \u2192 non-prime) places a relation in:",
              "options": [
                "A. 1NF",
                "B. 2NF",
                "C. 3NF",
                "D. 4NF"
              ],
              "correct": "C",
              "answer": "C. 3NF",
              "explanation": "3NF eliminates transitive dependencies."
            },
            {
              "id": 5,
              "difficulty": "Intermediate",
              "question": "For a relation to be in BCNF, for every non-trivial dependency X \u2192 Y:",
              "options": [
                "A. X must be a super key",
                "B. Y must be a prime attribute",
                "C. X must be a non-prime attribute",
                "D. Y must be a super key"
              ],
              "correct": "A",
              "answer": "A. X must be a super key",
              "explanation": "BCNF requires X to be a super key for all non-trivial FDs."
            },
            {
              "id": 6,
              "difficulty": "Intermediate",
              "question": "If FD set F = {A \u2192 B, B \u2192 C}, what is the attribute closure of A (A+)?",
              "options": [
                "A. {A}",
                "B. {A, B}",
                "C. {A, B, C}",
                "D. {B, C}"
              ],
              "correct": "C",
              "answer": "C. {A, B, C}",
              "explanation": "A determines B and B determines C, so A+ = {A, B, C}."
            },
            {
              "id": 7,
              "difficulty": "Advanced",
              "question": "Which normal form guarantees both lossless-join decomposition AND dependency preservation in all cases?",
              "options": [
                "A. BCNF",
                "B. 3NF",
                "C. 4NF",
                "D. 5NF"
              ],
              "correct": "B",
              "answer": "B. 3NF",
              "explanation": "3NF can always achieve lossless join and dependency preservation."
            },
            {
              "id": 8,
              "difficulty": "Advanced",
              "question": "What anomaly occurs when deleting a row causes loss of unrelated historical data?",
              "options": [
                "A. Insertion Anomaly",
                "B. Deletion Anomaly",
                "C. Modification Anomaly",
                "D. Redundancy Anomaly"
              ],
              "correct": "B",
              "answer": "B. Deletion Anomaly",
              "explanation": "Deletion anomalies purge unrelated facts unintentionally."
            },
            {
              "id": 9,
              "difficulty": "Intermediate",
              "question": "How do you test if a set of attributes K is a Candidate Key for relation R?",
              "options": [
                "A. K has max length",
                "B. Attribute closure K+ contains all attributes of R and no subset of K is a superkey",
                "C. K contains foreign keys",
                "D. K contains nulls"
              ],
              "correct": "B",
              "answer": "B. Attribute closure K+ contains all attributes of R and no subset of K is a superkey",
              "explanation": "Candidate key closure covers R with minimal attributes."
            },
            {
              "id": 10,
              "difficulty": "Advanced",
              "question": "A relation R is in 2NF if it is in 1NF and:",
              "options": [
                "A. No non-prime attribute is partially dependent on any candidate key",
                "B. No transitive dependencies exist",
                "C. X is a superkey for all FDs",
                "D. All columns are numbers"
              ],
              "correct": "A",
              "answer": "A. No non-prime attribute is partially dependent on any candidate key",
              "explanation": "2NF requires no partial dependencies."
            }
          ]
        },
        {
          "name": "Database Normalization Mechanics & Operations",
          "simpleExplanation": "Stage 2 learning milestone for Database Normalization.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 2 of Database Normalization.",
          "video": {
            "title": "Database Design",
            "channel": "Neso Academy",
            "youtubeUrl": "https://www.youtube.com/watch?v=LpqnU533v3M"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 2 of Database Normalization?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 2 covers key principles of Database Normalization."
            }
          ]
        },
        {
          "name": "Database Normalization Advanced Concepts & Applications",
          "simpleExplanation": "Stage 3 learning milestone for Database Normalization.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 3 of Database Normalization.",
          "video": {
            "title": "Lec-50: Introduction to Relational Algebra | Database Management System",
            "channel": "Gate Smashers",
            "youtubeUrl": "https://www.youtube.com/watch?v=4YilEjkNPrQ"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 3 of Database Normalization?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 3 covers key principles of Database Normalization."
            }
          ]
        },
        {
          "name": "Database Normalization Solved Exam Problems & Review",
          "simpleExplanation": "Stage 4 learning milestone for Database Normalization.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 4 of Database Normalization.",
          "video": {
            "title": "What is Normalization in SQL? | Database Normalization Forms - 1NF, 2NF, 3NF, BCNF | Edureka",
            "channel": "edureka!",
            "youtubeUrl": "https://www.youtube.com/watch?v=ABwD8IYByfk"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 4 of Database Normalization?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 4 covers key principles of Database Normalization."
            }
          ]
        }
      ]
    },
    {
      "id": "dbms-transactions",
      "name": "Transactions & Concurrency Control",
      "description": "ACID properties, serializability, 2-Phase Locking, and deadlock resolution.",
      "skillLevel": "Strong",
      "progressPct": 85,
      "gapLevel": "Low",
      "videos": [
        {
          "id": "v4",
          "videoId": "LpqnU533v3M",
          "title": "Database Design",
          "channelTitle": "Neso Academy",
          "url": "https://www.youtube.com/watch?v=LpqnU533v3M",
          "duration": "15:00"
        },
        {
          "id": "v5",
          "videoId": "4YilEjkNPrQ",
          "title": "Lec-50: Introduction to Relational Algebra | Database Management System",
          "channelTitle": "Gate Smashers",
          "url": "https://www.youtube.com/watch?v=4YilEjkNPrQ",
          "duration": "15:00"
        },
        {
          "id": "v6",
          "videoId": "ABwD8IYByfk",
          "title": "What is Normalization in SQL? | Database Normalization Forms - 1NF, 2NF, 3NF, BCNF | Edureka",
          "channelTitle": "edureka!",
          "url": "https://www.youtube.com/watch?v=ABwD8IYByfk",
          "duration": "15:00"
        },
        {
          "id": "v7",
          "videoId": "t5hsV9lC1rU",
          "title": "Lec-87: Introduction to Transaction Concurrency in HINDI | Database Management System",
          "channelTitle": "Gate Smashers",
          "url": "https://www.youtube.com/watch?v=t5hsV9lC1rU",
          "duration": "15:00"
        }
      ],
      "subtopics": [
        {
          "name": "Transactions & Concurrency Control Core Principles",
          "simpleExplanation": "Core concepts for Transactions & Concurrency Control Core Principles",
          "keyConcepts": [
            "Core Concepts",
            "Mechanics",
            "Applications"
          ],
          "notes": "Essential notes for Transactions & Concurrency Control Core Principles",
          "video": {
            "title": "Database Design",
            "channel": "Neso Academy",
            "youtubeUrl": "https://www.youtube.com/watch?v=LpqnU533v3M"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "Which ACID property ensures that all statements within a transaction execute successfully or none at all?",
              "options": [
                "A. Atomicity",
                "B. Consistency",
                "C. Isolation",
                "D. Durability"
              ],
              "correct": "A",
              "answer": "A. Atomicity",
              "explanation": "Atomicity guarantees all-or-nothing execution."
            },
            {
              "id": 2,
              "difficulty": "Basic",
              "question": "Which ACID property guarantees that committed transaction changes survive system crashes?",
              "options": [
                "A. Atomicity",
                "B. Consistency",
                "C. Isolation",
                "D. Durability"
              ],
              "correct": "D",
              "answer": "D. Durability",
              "explanation": "Durability ensures committed data persists through crashes."
            },
            {
              "id": 3,
              "difficulty": "Intermediate",
              "question": "In Two-Phase Locking (2PL), what occurs during the Growing Phase?",
              "options": [
                "A. Locks are released only",
                "B. Locks are acquired and no locks are released",
                "C. Transaction commits",
                "D. Deadlock is detected"
              ],
              "correct": "B",
              "answer": "B. Locks are acquired and no locks are released",
              "explanation": "Growing phase acquires locks without releasing any."
            },
            {
              "id": 4,
              "difficulty": "Intermediate",
              "question": "What is a Dirty Read concurrency anomaly?",
              "options": [
                "A. Reading data modified by an uncommitted transaction",
                "B. Reading data twice and getting different values",
                "C. Writing data without index",
                "D. Overwriting committed data"
              ],
              "correct": "A",
              "answer": "A. Reading data modified by an uncommitted transaction",
              "explanation": "Dirty reads access uncommitted transaction updates."
            },
            {
              "id": 5,
              "difficulty": "Intermediate",
              "question": "Strict 2PL prevents cascading aborts by:",
              "options": [
                "A. Holding all exclusive locks until transaction commits/aborts",
                "B. Releasing locks immediately after read",
                "C. Using no locks",
                "D. Aborting long transactions"
              ],
              "correct": "A",
              "answer": "A. Holding all exclusive locks until transaction commits/aborts",
              "explanation": "Strict 2PL holds exclusive locks until transaction completion."
            },
            {
              "id": 6,
              "difficulty": "Basic",
              "question": "Which lock type allows multiple transactions to read a resource simultaneously but prevents writes?",
              "options": [
                "A. Exclusive Lock (X)",
                "B. Shared Lock (S)",
                "C. Intent Lock",
                "D. Update Lock"
              ],
              "correct": "B",
              "answer": "B. Shared Lock (S)",
              "explanation": "Shared locks permit concurrent reads."
            },
            {
              "id": 7,
              "difficulty": "Advanced",
              "question": "Which graph data structure is used to detect deadlocks in concurrency control?",
              "options": [
                "A. Wait-For Graph (WFG)",
                "B. B-Tree",
                "C. Parse Tree",
                "D. State Diagram"
              ],
              "correct": "A",
              "answer": "A. Wait-For Graph (WFG)",
              "explanation": "Wait-For Graphs detect deadlocks via cycles."
            },
            {
              "id": 8,
              "difficulty": "Advanced",
              "question": "What is conflict serializability in database transactions?",
              "options": [
                "A. Schedule equal to serial schedule by swapping non-conflicting operations",
                "B. Execution with zero locks",
                "C. Parallel execution without conflict checking",
                "D. Rollback of all transactions"
              ],
              "correct": "A",
              "answer": "A. Schedule equal to serial schedule by swapping non-conflicting operations",
              "explanation": "Conflict serializability converts schedules via non-conflicting swaps."
            },
            {
              "id": 9,
              "difficulty": "Intermediate",
              "question": "What is an Unrepeatable Read anomaly?",
              "options": [
                "A. Transaction re-reads same row and discovers modified values committed by another transaction",
                "B. Reading uncommitted data",
                "C. Lost update",
                "D. System crash during read"
              ],
              "correct": "A",
              "answer": "A. Transaction re-reads same row and discovers modified values committed by another transaction",
              "explanation": "Unrepeatable read occurs when committed updates change re-read data."
            },
            {
              "id": 10,
              "difficulty": "Advanced",
              "question": "What mechanism is used by Write-Ahead Logging (WAL) for durability?",
              "options": [
                "A. Log records written to disk before database pages are updated",
                "B. In-memory log buffer only",
                "C. Deleting old indexes",
                "D. Periodic table copy"
              ],
              "correct": "A",
              "answer": "A. Log records written to disk before database pages are updated",
              "explanation": "WAL writes log records to persistent storage prior to page updates."
            }
          ]
        },
        {
          "name": "Transactions & Concurrency Control Mechanics & Operations",
          "simpleExplanation": "Stage 2 learning milestone for Transactions & Concurrency Control.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 2 of Transactions & Concurrency Control.",
          "video": {
            "title": "Lec-50: Introduction to Relational Algebra | Database Management System",
            "channel": "Gate Smashers",
            "youtubeUrl": "https://www.youtube.com/watch?v=4YilEjkNPrQ"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 2 of Transactions & Concurrency Control?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 2 covers key principles of Transactions & Concurrency Control."
            }
          ]
        },
        {
          "name": "Transactions & Concurrency Control Advanced Concepts & Applications",
          "simpleExplanation": "Stage 3 learning milestone for Transactions & Concurrency Control.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 3 of Transactions & Concurrency Control.",
          "video": {
            "title": "What is Normalization in SQL? | Database Normalization Forms - 1NF, 2NF, 3NF, BCNF | Edureka",
            "channel": "edureka!",
            "youtubeUrl": "https://www.youtube.com/watch?v=ABwD8IYByfk"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 3 of Transactions & Concurrency Control?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 3 covers key principles of Transactions & Concurrency Control."
            }
          ]
        },
        {
          "name": "Transactions & Concurrency Control Solved Exam Problems & Review",
          "simpleExplanation": "Stage 4 learning milestone for Transactions & Concurrency Control.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 4 of Transactions & Concurrency Control.",
          "video": {
            "title": "Lec-87: Introduction to Transaction Concurrency in HINDI | Database Management System",
            "channel": "Gate Smashers",
            "youtubeUrl": "https://www.youtube.com/watch?v=t5hsV9lC1rU"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 4 of Transactions & Concurrency Control?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 4 covers key principles of Transactions & Concurrency Control."
            }
          ]
        }
      ]
    },
    {
      "id": "dbms-indexing",
      "name": "Indexing & Query Processing",
      "description": "Primary/secondary indexing, B+ Trees, query optimization plans.",
      "skillLevel": "Strong",
      "progressPct": 85,
      "gapLevel": "Low",
      "videos": [
        {
          "id": "v5",
          "videoId": "4YilEjkNPrQ",
          "title": "Lec-50: Introduction to Relational Algebra | Database Management System",
          "channelTitle": "Gate Smashers",
          "url": "https://www.youtube.com/watch?v=4YilEjkNPrQ",
          "duration": "15:00"
        },
        {
          "id": "v6",
          "videoId": "ABwD8IYByfk",
          "title": "What is Normalization in SQL? | Database Normalization Forms - 1NF, 2NF, 3NF, BCNF | Edureka",
          "channelTitle": "edureka!",
          "url": "https://www.youtube.com/watch?v=ABwD8IYByfk",
          "duration": "15:00"
        },
        {
          "id": "v7",
          "videoId": "t5hsV9lC1rU",
          "title": "Lec-87: Introduction to Transaction Concurrency in HINDI | Database Management System",
          "channelTitle": "Gate Smashers",
          "url": "https://www.youtube.com/watch?v=t5hsV9lC1rU",
          "duration": "15:00"
        },
        {
          "id": "v8",
          "videoId": "lJvkIgFT3dY",
          "title": "need of query processing | DBMS | Lec-79 | Bhanu Priya",
          "channelTitle": "Education 4u",
          "url": "https://www.youtube.com/watch?v=lJvkIgFT3dY",
          "duration": "15:00"
        }
      ],
      "subtopics": [
        {
          "name": "Indexing & Query Processing Core Principles",
          "simpleExplanation": "Core concepts for Indexing & Query Processing Core Principles",
          "keyConcepts": [
            "Core Concepts",
            "Mechanics",
            "Applications"
          ],
          "notes": "Essential notes for Indexing & Query Processing Core Principles",
          "video": {
            "title": "Lec-50: Introduction to Relational Algebra | Database Management System",
            "channel": "Gate Smashers",
            "youtubeUrl": "https://www.youtube.com/watch?v=4YilEjkNPrQ"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "In a B+ Tree index, where are data pointers to actual table rows stored?",
              "options": [
                "A. Internal nodes only",
                "B. Leaf nodes only",
                "C. Root node only",
                "D. Distributed evenly across all levels"
              ],
              "correct": "B",
              "answer": "B. Leaf nodes only",
              "explanation": "B+ Trees store all data pointers in leaf nodes."
            },
            {
              "id": 2,
              "difficulty": "Basic",
              "question": "What is a Primary Index in database indexing?",
              "options": [
                "A. Index built on a non-ordering field",
                "B. Index specified on an ordered key field of a sequential data file",
                "C. Secondary hash index",
                "D. Index with no keys"
              ],
              "correct": "B",
              "answer": "B. Index specified on an ordered key field of a sequential data file",
              "explanation": "Primary index is defined on an ordered key field."
            },
            {
              "id": 3,
              "difficulty": "Intermediate",
              "question": "How many Clustered Indexes can exist on a single database table?",
              "options": [
                "A. Unlimited",
                "B. Maximum 1",
                "C. Exactly 2",
                "D. One per column"
              ],
              "correct": "B",
              "answer": "B. Maximum 1",
              "explanation": "Only 1 clustered index can exist because rows can only be physically sorted one way."
            },
            {
              "id": 4,
              "difficulty": "Intermediate",
              "question": "What is the primary trade-off when adding multiple indexes to a database table?",
              "options": [
                "A. Faster writes, slower reads",
                "B. Faster SELECT queries but slower INSERT/UPDATE/DELETE performance",
                "C. Increased network bandwidth",
                "D. Table deletion failure"
              ],
              "correct": "B",
              "answer": "B. Faster SELECT queries but slower INSERT/UPDATE/DELETE performance",
              "explanation": "Indexes speed reads but impose write maintenance overhead."
            },
            {
              "id": 5,
              "difficulty": "Intermediate",
              "question": "What is a Dense Index?",
              "options": [
                "A. An index record appears for every search key value in data file",
                "B. Index record for data blocks only",
                "C. Hash table without buckets",
                "D. Unsorted index"
              ],
              "correct": "A",
              "answer": "A. An index record appears for every search key value in data file",
              "explanation": "Dense index contains an entry for every record in data file."
            },
            {
              "id": 6,
              "difficulty": "Advanced",
              "question": "What is the primary goal of the Query Optimizer component in DBMS?",
              "options": [
                "A. Format SQL syntax",
                "B. Select the lowest cost execution plan based on CPU and I/O statistics",
                "C. Enforce user access passwords",
                "D. Create indexes automatically"
              ],
              "correct": "B",
              "answer": "B. Select the lowest cost execution plan based on CPU and I/O statistics",
              "explanation": "Query optimizer picks lowest cost execution plan."
            },
            {
              "id": 7,
              "difficulty": "Advanced",
              "question": "How does a B-Tree differ from a B+ Tree?",
              "options": [
                "A. B-Tree stores search keys and data in internal nodes; B+ Tree stores data only in leaf nodes",
                "B. B-Tree is un-balanced",
                "C. B+ Tree has no leaf nodes",
                "D. B-Tree is strictly binary"
              ],
              "correct": "A",
              "answer": "A. B-Tree stores search keys and data in internal nodes; B+ Tree stores data only in leaf nodes",
              "explanation": "B+ trees keep data pointers exclusively in leaves."
            },
            {
              "id": 8,
              "difficulty": "Basic",
              "question": "What is the average search time complexity of Hash Indexing for equality lookups?",
              "options": [
                "A. O(1)",
                "B. O(log n)",
                "C. O(n)",
                "D. O(n^2)"
              ],
              "correct": "A",
              "answer": "A. O(1)",
              "explanation": "Hash indexing delivers O(1) average lookup time."
            },
            {
              "id": 9,
              "difficulty": "Intermediate",
              "question": "What is a Table Scan operation in query execution?",
              "options": [
                "A. Reading index root node",
                "B. Reading every data block of a table sequentially from start to end",
                "C. Joining two tables",
                "D. Sorting index keys"
              ],
              "correct": "B",
              "answer": "B. Reading every data block of a table sequentially from start to end",
              "explanation": "Table scan reads all table pages sequentially."
            },
            {
              "id": 10,
              "difficulty": "Advanced",
              "question": "What is a Composite Index?",
              "options": [
                "A. Index created on two or more columns combined",
                "B. Index with two root nodes",
                "C. Hash index on single column",
                "D. Index containing view definitions"
              ],
              "correct": "A",
              "answer": "A. Index created on two or more columns combined",
              "explanation": "Composite indexes cover multiple attributes combined."
            }
          ]
        },
        {
          "name": "Indexing & Query Processing Mechanics & Operations",
          "simpleExplanation": "Stage 2 learning milestone for Indexing & Query Processing.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 2 of Indexing & Query Processing.",
          "video": {
            "title": "What is Normalization in SQL? | Database Normalization Forms - 1NF, 2NF, 3NF, BCNF | Edureka",
            "channel": "edureka!",
            "youtubeUrl": "https://www.youtube.com/watch?v=ABwD8IYByfk"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 2 of Indexing & Query Processing?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 2 covers key principles of Indexing & Query Processing."
            }
          ]
        },
        {
          "name": "Indexing & Query Processing Advanced Concepts & Applications",
          "simpleExplanation": "Stage 3 learning milestone for Indexing & Query Processing.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 3 of Indexing & Query Processing.",
          "video": {
            "title": "Lec-87: Introduction to Transaction Concurrency in HINDI | Database Management System",
            "channel": "Gate Smashers",
            "youtubeUrl": "https://www.youtube.com/watch?v=t5hsV9lC1rU"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 3 of Indexing & Query Processing?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 3 covers key principles of Indexing & Query Processing."
            }
          ]
        },
        {
          "name": "Indexing & Query Processing Solved Exam Problems & Review",
          "simpleExplanation": "Stage 4 learning milestone for Indexing & Query Processing.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 4 of Indexing & Query Processing.",
          "video": {
            "title": "need of query processing | DBMS | Lec-79 | Bhanu Priya",
            "channel": "Education 4u",
            "youtubeUrl": "https://www.youtube.com/watch?v=lJvkIgFT3dY"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 4 of Indexing & Query Processing?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 4 covers key principles of Indexing & Query Processing."
            }
          ]
        }
      ]
    }
  ],
  "digital-logic": [
    {
      "id": "dld-number-systems",
      "name": "Number Systems & Boolean Algebra",
      "description": "Binary, Octal, Hexadecimal conversions, 2's complement, De Morgan's laws.",
      "skillLevel": "Strong",
      "progressPct": 85,
      "gapLevel": "Low",
      "videos": [
        {
          "id": "v1",
          "videoId": "1xY_zA5L5QQ",
          "title": "Number System and its conversion techniques | How to convert one number system to other",
          "channelTitle": "SJTutorialsLive",
          "url": "https://www.youtube.com/watch?v=1xY_zA5L5QQ",
          "duration": "15:00"
        },
        {
          "id": "v2",
          "videoId": "QrTVeuloPQQ",
          "title": "Logic Gates - AND,OR,NOT,NAND,NOR, XOR,XNOR | Truth Table | Digital logic design|Digital Electronics",
          "channelTitle": "Sudhakar Atchala",
          "url": "https://www.youtube.com/watch?v=QrTVeuloPQQ",
          "duration": "15:00"
        },
        {
          "id": "v3",
          "videoId": "_yHo2qq82P0",
          "title": "Introduction to Combinational Circuits",
          "channelTitle": "TutorialsPoint",
          "url": "https://www.youtube.com/watch?v=_yHo2qq82P0",
          "duration": "15:00"
        },
        {
          "id": "v4",
          "videoId": "peQN70pRl6c",
          "title": "Sequential Logic Circuit Bangla | Sequential Circuit Bangla | #sequentialcircuit",
          "channelTitle": "Free CSE Learning",
          "url": "https://www.youtube.com/watch?v=peQN70pRl6c",
          "duration": "15:00"
        }
      ],
      "subtopics": [
        {
          "name": "Number Systems & Boolean Algebra Core Principles",
          "simpleExplanation": "Core concepts for Number Systems & Boolean Algebra Core Principles",
          "keyConcepts": [
            "Core Concepts",
            "Mechanics",
            "Applications"
          ],
          "notes": "Essential notes for Number Systems & Boolean Algebra Core Principles",
          "video": {
            "title": "Number System and its conversion techniques | How to convert one number system to other",
            "channel": "SJTutorialsLive",
            "youtubeUrl": "https://www.youtube.com/watch?v=1xY_zA5L5QQ"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "How many binary bits correspond directly to a single Hexadecimal digit?",
              "options": [
                "A. 2 bits",
                "B. 4 bits",
                "C. 8 bits",
                "D. 16 bits"
              ],
              "correct": "B",
              "answer": "B. 4 bits",
              "explanation": "Each hexadecimal digit maps to 4 binary bits."
            },
            {
              "id": 2,
              "difficulty": "Basic",
              "question": "How is the 2's Complement of a binary number calculated?",
              "options": [
                "A. Take 1's complement and add 1",
                "B. Invert all bits only",
                "C. Multiply by 2",
                "D. Add 1000 in binary"
              ],
              "correct": "A",
              "answer": "A. Take 1's complement and add 1",
              "explanation": "2's complement is 1's complement + 1."
            },
            {
              "id": 3,
              "difficulty": "Intermediate",
              "question": "According to De Morgan's First Law, what is the boolean equivalent of (A + B)'?",
              "options": [
                "A. A' + B'",
                "B. A' \u00b7 B'",
                "C. A \u00b7 B",
                "D. A' + B"
              ],
              "correct": "B",
              "answer": "B. A' \u00b7 B'",
              "explanation": "De Morgan's first law states (A + B)' = A' \u00b7 B'."
            },
            {
              "id": 4,
              "difficulty": "Intermediate",
              "question": "According to De Morgan's Second Law, what is the boolean equivalent of (A \u00b7 B)'?",
              "options": [
                "A. A' + B'",
                "B. A' \u00b7 B'",
                "C. A + B",
                "D. A \u00b7 B'"
              ],
              "correct": "A",
              "answer": "A. A' + B'",
              "explanation": "De Morgan's second law states (A \u00b7 B)' = A' + B'."
            },
            {
              "id": 5,
              "difficulty": "Basic",
              "question": "In Boolean Duality Principle, what replacements are performed to obtain a dual expression?",
              "options": [
                "A. Swap AND with OR, and 0 with 1",
                "B. Replace variables with 0",
                "C. Double invert all terms",
                "D. Negate whole expression"
              ],
              "correct": "A",
              "answer": "A. Swap AND with OR, and 0 with 1",
              "explanation": "Boolean duality swaps operators AND/OR and constants 0/1."
            },
            {
              "id": 6,
              "difficulty": "Intermediate",
              "question": "According to the Consensus Theorem, AB + A'C + BC simplifies to:",
              "options": [
                "A. AB + BC",
                "B. AB + A'C",
                "C. A'C + BC",
                "D. A + B + C"
              ],
              "correct": "B",
              "answer": "B. AB + A'C",
              "explanation": "Consensus theorem simplifies redundant term BC."
            },
            {
              "id": 7,
              "difficulty": "Basic",
              "question": "What is the base of the Octal Number System?",
              "options": [
                "A. Base 2",
                "B. Base 8",
                "C. Base 10",
                "D. Base 16"
              ],
              "correct": "B",
              "answer": "B. Base 8",
              "explanation": "Octal uses base 8 (digits 0-7)."
            },
            {
              "id": 8,
              "difficulty": "Intermediate",
              "question": "In 4-bit Binary Coded Decimal (BCD), which binary pattern range is INVALID?",
              "options": [
                "A. 0000 to 1001",
                "B. 1010 to 1111",
                "C. 0100 to 0111",
                "D. 0001 to 0010"
              ],
              "correct": "B",
              "answer": "B. 1010 to 1111",
              "explanation": "BCD encodes digits 0-9; 1010 to 1111 are invalid BCD codes."
            },
            {
              "id": 9,
              "difficulty": "Basic",
              "question": "What is the defining property of Gray Code?",
              "options": [
                "A. Numbers are sorted",
                "B. Adjacent numbers differ by only 1 bit position",
                "C. Always 8 bits long",
                "D. Unsigned integer binary"
              ],
              "correct": "B",
              "answer": "B. Adjacent numbers differ by only 1 bit position",
              "explanation": "Gray code ensures adjacent values differ by a single bit."
            },
            {
              "id": 10,
              "difficulty": "Advanced",
              "question": "What is the Boolean Distributive Law expansion for A + (B \u00b7 C)?",
              "options": [
                "A. (A + B) \u00b7 (A + C)",
                "B. A \u00b7 B + C",
                "C. A + B + C",
                "D. A \u00b7 (B + C)"
              ],
              "correct": "A",
              "answer": "A. (A + B) \u00b7 (A + C)",
              "explanation": "Distributive law expands A + (B \u00b7 C) to (A + B) \u00b7 (A + C)."
            }
          ]
        },
        {
          "name": "Number Systems & Boolean Algebra Mechanics & Operations",
          "simpleExplanation": "Stage 2 learning milestone for Number Systems & Boolean Algebra.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 2 of Number Systems & Boolean Algebra.",
          "video": {
            "title": "Logic Gates - AND,OR,NOT,NAND,NOR, XOR,XNOR | Truth Table | Digital logic design|Digital Electronics",
            "channel": "Sudhakar Atchala",
            "youtubeUrl": "https://www.youtube.com/watch?v=QrTVeuloPQQ"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 2 of Number Systems & Boolean Algebra?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 2 covers key principles of Number Systems & Boolean Algebra."
            }
          ]
        },
        {
          "name": "Number Systems & Boolean Algebra Advanced Concepts & Applications",
          "simpleExplanation": "Stage 3 learning milestone for Number Systems & Boolean Algebra.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 3 of Number Systems & Boolean Algebra.",
          "video": {
            "title": "Introduction to Combinational Circuits",
            "channel": "TutorialsPoint",
            "youtubeUrl": "https://www.youtube.com/watch?v=_yHo2qq82P0"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 3 of Number Systems & Boolean Algebra?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 3 covers key principles of Number Systems & Boolean Algebra."
            }
          ]
        },
        {
          "name": "Number Systems & Boolean Algebra Solved Exam Problems & Review",
          "simpleExplanation": "Stage 4 learning milestone for Number Systems & Boolean Algebra.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 4 of Number Systems & Boolean Algebra.",
          "video": {
            "title": "Sequential Logic Circuit Bangla | Sequential Circuit Bangla | #sequentialcircuit",
            "channel": "Free CSE Learning",
            "youtubeUrl": "https://www.youtube.com/watch?v=peQN70pRl6c"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 4 of Number Systems & Boolean Algebra?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 4 covers key principles of Number Systems & Boolean Algebra."
            }
          ]
        }
      ]
    },
    {
      "id": "dld-logic-gates",
      "name": "Logic Gates & Simplification",
      "description": "Universal gates (NAND, NOR), K-Map minimization, prime implicants.",
      "skillLevel": "Strong",
      "progressPct": 85,
      "gapLevel": "Low",
      "videos": [
        {
          "id": "v2",
          "videoId": "QrTVeuloPQQ",
          "title": "Logic Gates - AND,OR,NOT,NAND,NOR, XOR,XNOR | Truth Table | Digital logic design|Digital Electronics",
          "channelTitle": "Sudhakar Atchala",
          "url": "https://www.youtube.com/watch?v=QrTVeuloPQQ",
          "duration": "15:00"
        },
        {
          "id": "v3",
          "videoId": "_yHo2qq82P0",
          "title": "Introduction to Combinational Circuits",
          "channelTitle": "TutorialsPoint",
          "url": "https://www.youtube.com/watch?v=_yHo2qq82P0",
          "duration": "15:00"
        },
        {
          "id": "v4",
          "videoId": "peQN70pRl6c",
          "title": "Sequential Logic Circuit Bangla | Sequential Circuit Bangla | #sequentialcircuit",
          "channelTitle": "Free CSE Learning",
          "url": "https://www.youtube.com/watch?v=peQN70pRl6c",
          "duration": "15:00"
        },
        {
          "id": "v5",
          "videoId": "JxI7fW3xDGI",
          "title": "Registers in Digital Electronics || Digital Logic Design  || DLD || DE",
          "channelTitle": "Sudhakar Atchala",
          "url": "https://www.youtube.com/watch?v=JxI7fW3xDGI",
          "duration": "15:00"
        }
      ],
      "subtopics": [
        {
          "name": "Logic Gates & Simplification Core Principles",
          "simpleExplanation": "Core concepts for Logic Gates & Simplification Core Principles",
          "keyConcepts": [
            "Core Concepts",
            "Mechanics",
            "Applications"
          ],
          "notes": "Essential notes for Logic Gates & Simplification Core Principles",
          "video": {
            "title": "Logic Gates - AND,OR,NOT,NAND,NOR, XOR,XNOR | Truth Table | Digital logic design|Digital Electronics",
            "channel": "Sudhakar Atchala",
            "youtubeUrl": "https://www.youtube.com/watch?v=QrTVeuloPQQ"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "Which logic gate is called a Universal Gate because it can implement any boolean function independently?",
              "options": [
                "A. AND Gate",
                "B. NAND Gate",
                "C. OR Gate",
                "D. XOR Gate"
              ],
              "correct": "B",
              "answer": "B. NAND Gate",
              "explanation": "NAND is a universal logic gate."
            },
            {
              "id": 2,
              "difficulty": "Basic",
              "question": "What is the output of a 2-input XOR gate when both inputs are identical (A=0, B=0 or A=1, B=1)?",
              "options": [
                "A. 1",
                "B. 0",
                "C. High Impedance",
                "D. Inverted"
              ],
              "correct": "B",
              "answer": "B. 0",
              "explanation": "XOR outputs 0 when inputs are equal."
            },
            {
              "id": 3,
              "difficulty": "Intermediate",
              "question": "In a Karnaugh Map (K-Map), adjacent cells differ by how many binary bits?",
              "options": [
                "A. 0 bits",
                "B. 1 bit",
                "C. 2 bits",
                "D. 4 bits"
              ],
              "correct": "B",
              "answer": "B. 1 bit",
              "explanation": "K-Map cells are arranged in Gray code where adjacent cells differ by 1 bit."
            },
            {
              "id": 4,
              "difficulty": "Intermediate",
              "question": "Which gate outputs 1 ONLY when both inputs are equal (A=0,B=0 or A=1,B=1)?",
              "options": [
                "A. XOR",
                "B. XNOR",
                "C. NAND",
                "D. NOR"
              ],
              "correct": "B",
              "answer": "B. XNOR",
              "explanation": "XNOR is the equivalence gate, outputting 1 when inputs match."
            },
            {
              "id": 5,
              "difficulty": "Basic",
              "question": "Valid sub-cube group sizes in a K-Map must be powers of 2, such as:",
              "options": [
                "A. 1, 2, 3, 5",
                "B. 1, 2, 4, 8, 16",
                "C. 3, 6, 9, 12",
                "D. 5, 10, 15"
              ],
              "correct": "B",
              "answer": "B. 1, 2, 4, 8, 16",
              "explanation": "K-Map groupings must be powers of 2."
            },
            {
              "id": 6,
              "difficulty": "Intermediate",
              "question": "What is a Minterm in Boolean algebra?",
              "options": [
                "A. Sum term containing all variables",
                "B. Product term containing all variables in complimented or uncomplimented form",
                "C. Single variable",
                "D. Constant 0"
              ],
              "correct": "B",
              "answer": "B. Product term containing all variables in complimented or uncomplimented form",
              "explanation": "Minterms are product terms of SOP expressions."
            },
            {
              "id": 7,
              "difficulty": "Advanced",
              "question": "What is an Essential Prime Implicant (EPI) in K-Map simplification?",
              "options": [
                "A. Any group of 2 cells",
                "B. A prime implicant covering at least one minterm not covered by any other prime implicant",
                "C. Group of zero cells",
                "D. Maxterm"
              ],
              "correct": "B",
              "answer": "B. A prime implicant covering at least one minterm not covered by any other prime implicant",
              "explanation": "EPI covers at least one unique minterm."
            },
            {
              "id": 8,
              "difficulty": "Basic",
              "question": "Which gate performs the NOR logic operation?",
              "options": [
                "A. AND followed by NOT",
                "B. OR followed by NOT",
                "C. XOR followed by NOT",
                "D. Buffer"
              ],
              "correct": "B",
              "answer": "B. OR followed by NOT",
              "explanation": "NOR is OR operation inverted."
            },
            {
              "id": 9,
              "difficulty": "Intermediate",
              "question": "What role do Don't Care (X) conditions play in K-Map simplification?",
              "options": [
                "A. Must always be 0",
                "B. Can be assumed as 0 or 1 to form larger sub-cube groups for minimal expressions",
                "C. Always ignored",
                "D. Invalidate circuit"
              ],
              "correct": "B",
              "answer": "B. Can be assumed as 0 or 1 to form larger sub-cube groups for minimal expressions",
              "explanation": "Don't care terms can be 0 or 1 to maximize sub-cube sizes."
            },
            {
              "id": 10,
              "difficulty": "Advanced",
              "question": "Which Universal Gate besides NAND can implement any logic function without other gate types?",
              "options": [
                "A. AND",
                "B. NOR",
                "C. XOR",
                "D. NOT"
              ],
              "correct": "B",
              "answer": "B. NOR",
              "explanation": "NOR is also a universal logic gate."
            }
          ]
        },
        {
          "name": "Logic Gates & Simplification Mechanics & Operations",
          "simpleExplanation": "Stage 2 learning milestone for Logic Gates & Simplification.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 2 of Logic Gates & Simplification.",
          "video": {
            "title": "Introduction to Combinational Circuits",
            "channel": "TutorialsPoint",
            "youtubeUrl": "https://www.youtube.com/watch?v=_yHo2qq82P0"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 2 of Logic Gates & Simplification?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 2 covers key principles of Logic Gates & Simplification."
            }
          ]
        },
        {
          "name": "Logic Gates & Simplification Advanced Concepts & Applications",
          "simpleExplanation": "Stage 3 learning milestone for Logic Gates & Simplification.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 3 of Logic Gates & Simplification.",
          "video": {
            "title": "Sequential Logic Circuit Bangla | Sequential Circuit Bangla | #sequentialcircuit",
            "channel": "Free CSE Learning",
            "youtubeUrl": "https://www.youtube.com/watch?v=peQN70pRl6c"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 3 of Logic Gates & Simplification?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 3 covers key principles of Logic Gates & Simplification."
            }
          ]
        },
        {
          "name": "Logic Gates & Simplification Solved Exam Problems & Review",
          "simpleExplanation": "Stage 4 learning milestone for Logic Gates & Simplification.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 4 of Logic Gates & Simplification.",
          "video": {
            "title": "Registers in Digital Electronics || Digital Logic Design  || DLD || DE",
            "channel": "Sudhakar Atchala",
            "youtubeUrl": "https://www.youtube.com/watch?v=JxI7fW3xDGI"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 4 of Logic Gates & Simplification?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 4 covers key principles of Logic Gates & Simplification."
            }
          ]
        }
      ]
    },
    {
      "id": "dld-combinational",
      "name": "Combinational Circuits",
      "description": "Multiplexers, Demultiplexers, Encoders, Decoders, Adders, Comparators.",
      "skillLevel": "Strong",
      "progressPct": 85,
      "gapLevel": "Low",
      "videos": [
        {
          "id": "v3",
          "videoId": "_yHo2qq82P0",
          "title": "Introduction to Combinational Circuits",
          "channelTitle": "TutorialsPoint",
          "url": "https://www.youtube.com/watch?v=_yHo2qq82P0",
          "duration": "15:00"
        },
        {
          "id": "v4",
          "videoId": "peQN70pRl6c",
          "title": "Sequential Logic Circuit Bangla | Sequential Circuit Bangla | #sequentialcircuit",
          "channelTitle": "Free CSE Learning",
          "url": "https://www.youtube.com/watch?v=peQN70pRl6c",
          "duration": "15:00"
        },
        {
          "id": "v5",
          "videoId": "JxI7fW3xDGI",
          "title": "Registers in Digital Electronics || Digital Logic Design  || DLD || DE",
          "channelTitle": "Sudhakar Atchala",
          "url": "https://www.youtube.com/watch?v=JxI7fW3xDGI",
          "duration": "15:00"
        },
        {
          "id": "v6",
          "videoId": "1xY_zA5L5QQ",
          "title": "Number System and its conversion techniques | How to convert one number system to other",
          "channelTitle": "SJTutorialsLive",
          "url": "https://www.youtube.com/watch?v=1xY_zA5L5QQ",
          "duration": "15:00"
        }
      ],
      "subtopics": [
        {
          "name": "Combinational Circuits Core Principles",
          "simpleExplanation": "Core concepts for Combinational Circuits Core Principles",
          "keyConcepts": [
            "Core Concepts",
            "Mechanics",
            "Applications"
          ],
          "notes": "Essential notes for Combinational Circuits Core Principles",
          "video": {
            "title": "Introduction to Combinational Circuits",
            "channel": "TutorialsPoint",
            "youtubeUrl": "https://www.youtube.com/watch?v=_yHo2qq82P0"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "How many Select Lines are required for an 8-to-1 Multiplexer (MUX)?",
              "options": [
                "A. 2 select lines",
                "B. 3 select lines",
                "C. 4 select lines",
                "D. 8 select lines"
              ],
              "correct": "B",
              "answer": "B. 3 select lines",
              "explanation": "2^3 = 8 inputs, requiring 3 select lines."
            },
            {
              "id": 2,
              "difficulty": "Basic",
              "question": "What are the output expressions for a Half Adder with inputs A and B?",
              "options": [
                "A. Sum = A + B, Carry = A \u00b7 B",
                "B. Sum = A \u2295 B, Carry = A \u00b7 B",
                "C. Sum = A \u00b7 B, Carry = A \u2295 B",
                "D. Sum = A' B, Carry = A B'"
              ],
              "correct": "B",
              "answer": "B. Sum = A \u2295 B, Carry = A \u00b7 B",
              "explanation": "Half Adder yields Sum = A \u2295 B and Carry = A \u00b7 B."
            },
            {
              "id": 3,
              "difficulty": "Intermediate",
              "question": "How many inputs does a Full Adder component accept?",
              "options": [
                "A. 2 inputs",
                "B. 3 inputs (A, B, and Carry-in Cin)",
                "C. 4 inputs",
                "D. 1 input"
              ],
              "correct": "B",
              "answer": "B. 3 inputs (A, B, and Carry-in Cin)",
              "explanation": "Full adders process 3 inputs including carry-in."
            },
            {
              "id": 4,
              "difficulty": "Intermediate",
              "question": "How many output lines does a 3-to-8 Decoder have?",
              "options": [
                "A. 3 outputs",
                "B. 8 outputs",
                "C. 1 output",
                "D. 16 outputs"
              ],
              "correct": "B",
              "answer": "B. 8 outputs",
              "explanation": "3 input lines decode to 2^3 = 8 output lines."
            },
            {
              "id": 5,
              "difficulty": "Intermediate",
              "question": "What is the primary function of a Demultiplexer (DEMUX)?",
              "options": [
                "A. Select 1 of many inputs into 1 output",
                "B. Route 1 single input to 1 of 2^n output lines based on n select lines",
                "C. Add binary numbers",
                "D. Encode priority"
              ],
              "correct": "B",
              "answer": "B. Route 1 single input to 1 of 2^n output lines based on n select lines",
              "explanation": "DEMUX routes 1 input to one of multiple outputs."
            },
            {
              "id": 6,
              "difficulty": "Basic",
              "question": "Which circuit converts 2^n input lines into an n-bit binary code?",
              "options": [
                "A. Decoder",
                "B. Encoder",
                "C. Multiplexer",
                "D. Counter"
              ],
              "correct": "B",
              "answer": "B. Encoder",
              "explanation": "Encoders convert 2^n inputs into n binary lines."
            },
            {
              "id": 7,
              "difficulty": "Advanced",
              "question": "What advantage does a Carry Lookahead Adder offer over a Ripple Carry Adder?",
              "options": [
                "A. Uses fewer gates",
                "B. Computes carries in parallel to eliminate propagation delay",
                "C. Operates without clock",
                "D. Supports decimal math"
              ],
              "correct": "B",
              "answer": "B. Computes carries in parallel to eliminate propagation delay",
              "explanation": "Carry Lookahead computes carry signals in parallel."
            },
            {
              "id": 8,
              "difficulty": "Intermediate",
              "question": "What does a Priority Encoder do when multiple inputs are activated simultaneously?",
              "options": [
                "A. Causes circuit crash",
                "B. Encodes the index of the highest-priority active input",
                "C. Outputs zero",
                "D. Sums all inputs"
              ],
              "correct": "B",
              "answer": "B. Encodes the index of the highest-priority active input",
              "explanation": "Priority encoders prioritize the highest index input."
            },
            {
              "id": 9,
              "difficulty": "Basic",
              "question": "What digital component compares two n-bit numbers and outputs A > B, A = B, or A < B?",
              "options": [
                "A. Full Adder",
                "B. Magnitude Comparator",
                "C. Multiplexer",
                "D. Register"
              ],
              "correct": "B",
              "answer": "B. Magnitude Comparator",
              "explanation": "Magnitude comparators compare relative sizes of 2 binary numbers."
            },
            {
              "id": 10,
              "difficulty": "Advanced",
              "question": "How many 2:1 Multiplexers are needed to construct a 4:1 Multiplexer?",
              "options": [
                "A. 2 MUXes",
                "B. 3 MUXes",
                "C. 4 MUXes",
                "D. 5 MUXes"
              ],
              "correct": "B",
              "answer": "B. 3 MUXes",
              "explanation": "3 2:1 MUXes arranged in 2 stages construct a 4:1 MUX."
            }
          ]
        },
        {
          "name": "Combinational Circuits Mechanics & Operations",
          "simpleExplanation": "Stage 2 learning milestone for Combinational Circuits.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 2 of Combinational Circuits.",
          "video": {
            "title": "Sequential Logic Circuit Bangla | Sequential Circuit Bangla | #sequentialcircuit",
            "channel": "Free CSE Learning",
            "youtubeUrl": "https://www.youtube.com/watch?v=peQN70pRl6c"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 2 of Combinational Circuits?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 2 covers key principles of Combinational Circuits."
            }
          ]
        },
        {
          "name": "Combinational Circuits Advanced Concepts & Applications",
          "simpleExplanation": "Stage 3 learning milestone for Combinational Circuits.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 3 of Combinational Circuits.",
          "video": {
            "title": "Registers in Digital Electronics || Digital Logic Design  || DLD || DE",
            "channel": "Sudhakar Atchala",
            "youtubeUrl": "https://www.youtube.com/watch?v=JxI7fW3xDGI"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 3 of Combinational Circuits?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 3 covers key principles of Combinational Circuits."
            }
          ]
        },
        {
          "name": "Combinational Circuits Solved Exam Problems & Review",
          "simpleExplanation": "Stage 4 learning milestone for Combinational Circuits.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 4 of Combinational Circuits.",
          "video": {
            "title": "Number System and its conversion techniques | How to convert one number system to other",
            "channel": "SJTutorialsLive",
            "youtubeUrl": "https://www.youtube.com/watch?v=1xY_zA5L5QQ"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 4 of Combinational Circuits?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 4 covers key principles of Combinational Circuits."
            }
          ]
        }
      ]
    },
    {
      "id": "dld-sequential",
      "name": "Sequential Circuits",
      "description": "Clocked circuits, Mealy vs Moore state machines, setup/hold times.",
      "skillLevel": "Strong",
      "progressPct": 85,
      "gapLevel": "Low",
      "videos": [
        {
          "id": "v4",
          "videoId": "peQN70pRl6c",
          "title": "Sequential Logic Circuit Bangla | Sequential Circuit Bangla | #sequentialcircuit",
          "channelTitle": "Free CSE Learning",
          "url": "https://www.youtube.com/watch?v=peQN70pRl6c",
          "duration": "15:00"
        },
        {
          "id": "v5",
          "videoId": "JxI7fW3xDGI",
          "title": "Registers in Digital Electronics || Digital Logic Design  || DLD || DE",
          "channelTitle": "Sudhakar Atchala",
          "url": "https://www.youtube.com/watch?v=JxI7fW3xDGI",
          "duration": "15:00"
        },
        {
          "id": "v6",
          "videoId": "1xY_zA5L5QQ",
          "title": "Number System and its conversion techniques | How to convert one number system to other",
          "channelTitle": "SJTutorialsLive",
          "url": "https://www.youtube.com/watch?v=1xY_zA5L5QQ",
          "duration": "15:00"
        },
        {
          "id": "v7",
          "videoId": "QrTVeuloPQQ",
          "title": "Logic Gates - AND,OR,NOT,NAND,NOR, XOR,XNOR | Truth Table | Digital logic design|Digital Electronics",
          "channelTitle": "Sudhakar Atchala",
          "url": "https://www.youtube.com/watch?v=QrTVeuloPQQ",
          "duration": "15:00"
        }
      ],
      "subtopics": [
        {
          "name": "Sequential Circuits Core Principles",
          "simpleExplanation": "Core concepts for Sequential Circuits Core Principles",
          "keyConcepts": [
            "Core Concepts",
            "Mechanics",
            "Applications"
          ],
          "notes": "Essential notes for Sequential Circuits Core Principles",
          "video": {
            "title": "Sequential Logic Circuit Bangla | Sequential Circuit Bangla | #sequentialcircuit",
            "channel": "Free CSE Learning",
            "youtubeUrl": "https://www.youtube.com/watch?v=peQN70pRl6c"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What fundamentally distinguishes a Sequential Circuit from a Combinational Circuit?",
              "options": [
                "A. Sequential circuits use higher voltage",
                "B. Sequential circuits contain memory elements and feedback loops so output depends on past state",
                "C. Combinational circuits use clocks",
                "D. Sequential circuits have no outputs"
              ],
              "correct": "B",
              "answer": "B. Sequential circuits contain memory elements and feedback loops so output depends on past state",
              "explanation": "Sequential circuits incorporate memory and past state history."
            },
            {
              "id": 2,
              "difficulty": "Basic",
              "question": "What is Setup Time (t_setup) in sequential flip-flops?",
              "options": [
                "A. Time taken to power on",
                "B. Minimum duration data input MUST remain stable BEFORE clock active edge",
                "C. Duration after clock edge",
                "D. Propagation delay"
              ],
              "correct": "B",
              "answer": "B. Minimum duration data input MUST remain stable BEFORE clock active edge",
              "explanation": "Setup time requires stable data prior to active clock edge."
            },
            {
              "id": 3,
              "difficulty": "Intermediate",
              "question": "What is Hold Time (t_hold) in sequential flip-flops?",
              "options": [
                "A. Minimum duration data input MUST remain stable AFTER clock active edge",
                "B. Duration before clock edge",
                "C. Clock pulse width",
                "D. Reset time"
              ],
              "correct": "A",
              "answer": "A. Minimum duration data input MUST remain stable AFTER clock active edge",
              "explanation": "Hold time requires stable data following clock active edge."
            },
            {
              "id": 4,
              "difficulty": "Intermediate",
              "question": "What causes Metastability in sequential digital circuits?",
              "options": [
                "A. Overheating",
                "B. Violations of setup or hold time requirements",
                "C. Low clock speed",
                "D. Excess memory"
              ],
              "correct": "B",
              "answer": "B. Violations of setup or hold time requirements",
              "explanation": "Metastability arises when setup or hold times are violated."
            },
            {
              "id": 5,
              "difficulty": "Basic",
              "question": "In a Mealy State Machine, the output depends on:",
              "options": [
                "A. Current State only",
                "B. Current State AND current Inputs",
                "C. Next State only",
                "D. Clock frequency"
              ],
              "correct": "B",
              "answer": "B. Current State AND current Inputs",
              "explanation": "Mealy outputs depend on current state AND active inputs."
            },
            {
              "id": 6,
              "difficulty": "Basic",
              "question": "In a Moore State Machine, the output depends on:",
              "options": [
                "A. Current State ONLY",
                "B. Current State and Inputs",
                "C. Inputs only",
                "D. Next State"
              ],
              "correct": "A",
              "answer": "A. Current State ONLY",
              "explanation": "Moore outputs depend purely on current state."
            },
            {
              "id": 7,
              "difficulty": "Intermediate",
              "question": "What is the purpose of a Clock Signal in synchronous sequential circuits?",
              "options": [
                "A. Provide power",
                "B. Synchronize state transitions across memory elements",
                "C. Clear RAM memory",
                "D. Amplify signals"
              ],
              "correct": "B",
              "answer": "B. Synchronize state transitions across memory elements",
              "explanation": "Clocks synchronize flip-flop state transitions."
            },
            {
              "id": 8,
              "difficulty": "Advanced",
              "question": "What is propagation delay in sequential circuits?",
              "options": [
                "A. Time taken for output to change after input/clock transition",
                "B. Time to charge capacitors",
                "C. Setup time plus hold time",
                "D. Clock period"
              ],
              "correct": "A",
              "answer": "A. Time taken for output to change after input/clock transition",
              "explanation": "Propagation delay measures response latency after input change."
            },
            {
              "id": 9,
              "difficulty": "Intermediate",
              "question": "How does an Asynchronous sequential circuit differ from a Synchronous sequential circuit?",
              "options": [
                "A. Asynchronous circuits lack a global common clock signal",
                "B. Synchronous circuits do not use flip-flops",
                "C. Asynchronous circuits are slower",
                "D. Synchronous circuits have no memory"
              ],
              "correct": "A",
              "answer": "A. Asynchronous circuits lack a global common clock signal",
              "explanation": "Asynchronous circuits operate without a global shared clock."
            },
            {
              "id": 10,
              "difficulty": "Advanced",
              "question": "What state diagram element represents state transitions in sequential machine design?",
              "options": [
                "A. Rectangles",
                "B. Directed arcs labeled with input/output triggers",
                "C. Ellipses without labels",
                "D. Tables"
              ],
              "correct": "B",
              "answer": "B. Directed arcs labeled with input/output triggers",
              "explanation": "Directed arcs map input-triggered state transitions."
            }
          ]
        },
        {
          "name": "Sequential Circuits Mechanics & Operations",
          "simpleExplanation": "Stage 2 learning milestone for Sequential Circuits.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 2 of Sequential Circuits.",
          "video": {
            "title": "Registers in Digital Electronics || Digital Logic Design  || DLD || DE",
            "channel": "Sudhakar Atchala",
            "youtubeUrl": "https://www.youtube.com/watch?v=JxI7fW3xDGI"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 2 of Sequential Circuits?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 2 covers key principles of Sequential Circuits."
            }
          ]
        },
        {
          "name": "Sequential Circuits Advanced Concepts & Applications",
          "simpleExplanation": "Stage 3 learning milestone for Sequential Circuits.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 3 of Sequential Circuits.",
          "video": {
            "title": "Number System and its conversion techniques | How to convert one number system to other",
            "channel": "SJTutorialsLive",
            "youtubeUrl": "https://www.youtube.com/watch?v=1xY_zA5L5QQ"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 3 of Sequential Circuits?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 3 covers key principles of Sequential Circuits."
            }
          ]
        },
        {
          "name": "Sequential Circuits Solved Exam Problems & Review",
          "simpleExplanation": "Stage 4 learning milestone for Sequential Circuits.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 4 of Sequential Circuits.",
          "video": {
            "title": "Logic Gates - AND,OR,NOT,NAND,NOR, XOR,XNOR | Truth Table | Digital logic design|Digital Electronics",
            "channel": "Sudhakar Atchala",
            "youtubeUrl": "https://www.youtube.com/watch?v=QrTVeuloPQQ"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 4 of Sequential Circuits?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 4 covers key principles of Sequential Circuits."
            }
          ]
        }
      ]
    },
    {
      "id": "dld-flipflops-counters",
      "name": "Flip-Flops, Counters & Registers",
      "description": "SR, JK, D, T Flip-flops, Synchronous/Ripple counters, Shift registers.",
      "skillLevel": "Strong",
      "progressPct": 85,
      "gapLevel": "Low",
      "videos": [
        {
          "id": "v5",
          "videoId": "JxI7fW3xDGI",
          "title": "Registers in Digital Electronics || Digital Logic Design  || DLD || DE",
          "channelTitle": "Sudhakar Atchala",
          "url": "https://www.youtube.com/watch?v=JxI7fW3xDGI",
          "duration": "15:00"
        },
        {
          "id": "v6",
          "videoId": "1xY_zA5L5QQ",
          "title": "Number System and its conversion techniques | How to convert one number system to other",
          "channelTitle": "SJTutorialsLive",
          "url": "https://www.youtube.com/watch?v=1xY_zA5L5QQ",
          "duration": "15:00"
        },
        {
          "id": "v7",
          "videoId": "QrTVeuloPQQ",
          "title": "Logic Gates - AND,OR,NOT,NAND,NOR, XOR,XNOR | Truth Table | Digital logic design|Digital Electronics",
          "channelTitle": "Sudhakar Atchala",
          "url": "https://www.youtube.com/watch?v=QrTVeuloPQQ",
          "duration": "15:00"
        },
        {
          "id": "v8",
          "videoId": "_yHo2qq82P0",
          "title": "Introduction to Combinational Circuits",
          "channelTitle": "TutorialsPoint",
          "url": "https://www.youtube.com/watch?v=_yHo2qq82P0",
          "duration": "15:00"
        }
      ],
      "subtopics": [
        {
          "name": "Flip-Flops, Counters & Registers Core Principles",
          "simpleExplanation": "Core concepts for Flip-Flops, Counters & Registers Core Principles",
          "keyConcepts": [
            "Core Concepts",
            "Mechanics",
            "Applications"
          ],
          "notes": "Essential notes for Flip-Flops, Counters & Registers Core Principles",
          "video": {
            "title": "Registers in Digital Electronics || Digital Logic Design  || DLD || DE",
            "channel": "Sudhakar Atchala",
            "youtubeUrl": "https://www.youtube.com/watch?v=JxI7fW3xDGI"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "In an SR Flip-Flop, which input combination is INVALID / FORBIDDEN?",
              "options": [
                "A. S=0, R=0",
                "B. S=1, R=0",
                "C. S=0, R=1",
                "D. S=1, R=1"
              ],
              "correct": "D",
              "answer": "D. S=1, R=1",
              "explanation": "S=1, R=1 causes unpredictable invalid output state in SR flip-flops."
            },
            {
              "id": 2,
              "difficulty": "Basic",
              "question": "What happens to the output Q of a JK Flip-Flop when J=1 and K=1 on a clock pulse?",
              "options": [
                "A. Q = 0",
                "B. Q = 1",
                "C. Output Toggles (Q = Q')",
                "D. Invalid State"
              ],
              "correct": "C",
              "answer": "C. Output Toggles (Q = Q')",
              "explanation": "J=1, K=1 causes the output to toggle."
            },
            {
              "id": 3,
              "difficulty": "Basic",
              "question": "What is the characteristic equation for a D (Data/Delay) Flip-Flop?",
              "options": [
                "A. Q(t+1) = D",
                "B. Q(t+1) = D'",
                "C. Q(t+1) = Q(t)",
                "D. Q(t+1) = D \u2295 Q"
              ],
              "correct": "A",
              "answer": "A. Q(t+1) = D",
              "explanation": "D flip-flop transfers input D directly to next state Q(t+1)."
            },
            {
              "id": 4,
              "difficulty": "Intermediate",
              "question": "How does a T (Toggle) Flip-Flop behave when T=1 on a clock active edge?",
              "options": [
                "A. Holds current output",
                "B. Toggles output Q to Q'",
                "C. Sets output to 0",
                "D. Sets output to 1"
              ],
              "correct": "B",
              "answer": "B. Toggles output Q to Q'",
              "explanation": "T=1 toggles flip-flop output state."
            },
            {
              "id": 5,
              "difficulty": "Intermediate",
              "question": "What problem in JK Flip-Flops does a Master-Slave Flip-Flop configuration eliminate?",
              "options": [
                "A. Propagation delay",
                "B. Race-Around Condition",
                "C. Power loss",
                "D. Underflow"
              ],
              "correct": "B",
              "answer": "B. Race-Around Condition",
              "explanation": "Master-slave structure prevents race-around toggling when pulse width is long."
            },
            {
              "id": 6,
              "difficulty": "Intermediate",
              "question": "What is the maximum count capacity (MOD number) of a 4-bit Binary Counter?",
              "options": [
                "A. MOD-4 (0 to 3)",
                "B. MOD-8 (0 to 7)",
                "C. MOD-16 (0 to 15)",
                "D. MOD-32 (0 to 31)"
              ],
              "correct": "C",
              "answer": "C. MOD-16 (0 to 15)",
              "explanation": "4 bits yield 2^4 = 16 states (MOD-16)."
            },
            {
              "id": 7,
              "difficulty": "Advanced",
              "question": "What is the primary advantage of a Synchronous Counter over an Asynchronous (Ripple) Counter?",
              "options": [
                "A. Uses fewer flip-flops",
                "B. All flip-flops are clocked simultaneously, eliminating accumulated ripple delay",
                "C. Slower speed",
                "D. No power usage"
              ],
              "correct": "B",
              "answer": "B. All flip-flops are clocked simultaneously, eliminating accumulated ripple delay",
              "explanation": "Synchronous counters clock all flip-flops concurrently."
            },
            {
              "id": 8,
              "difficulty": "Basic",
              "question": "Which register mode receives data serially bit-by-bit and outputs data in parallel?",
              "options": [
                "A. SISO",
                "B. SIPO",
                "C. PISO",
                "D. PIPO"
              ],
              "correct": "B",
              "answer": "B. SIPO",
              "explanation": "SIPO = Serial-In Parallel-Out shift register."
            },
            {
              "id": 9,
              "difficulty": "Advanced",
              "question": "How many distinct states does an N-bit Johnson Counter have?",
              "options": [
                "A. N states",
                "B. 2N states",
                "C. 2^N states",
                "D. N^2 states"
              ],
              "correct": "B",
              "answer": "B. 2N states",
              "explanation": "An N-bit Johnson counter has 2N unique states."
            },
            {
              "id": 10,
              "difficulty": "Intermediate",
              "question": "What does an Excitation Table show in flip-flop design?",
              "options": [
                "A. Truth values for all gates",
                "B. Required inputs to achieve a desired state transition from Q(t) to Q(t+1)",
                "C. Power levels",
                "D. Clock frequency"
              ],
              "correct": "B",
              "answer": "B. Required inputs to achieve a desired state transition from Q(t) to Q(t+1)",
              "explanation": "Excitation tables specify inputs needed for desired state changes."
            }
          ]
        },
        {
          "name": "Flip-Flops, Counters & Registers Mechanics & Operations",
          "simpleExplanation": "Stage 2 learning milestone for Flip-Flops, Counters & Registers.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 2 of Flip-Flops, Counters & Registers.",
          "video": {
            "title": "Number System and its conversion techniques | How to convert one number system to other",
            "channel": "SJTutorialsLive",
            "youtubeUrl": "https://www.youtube.com/watch?v=1xY_zA5L5QQ"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 2 of Flip-Flops, Counters & Registers?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 2 covers key principles of Flip-Flops, Counters & Registers."
            }
          ]
        },
        {
          "name": "Flip-Flops, Counters & Registers Advanced Concepts & Applications",
          "simpleExplanation": "Stage 3 learning milestone for Flip-Flops, Counters & Registers.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 3 of Flip-Flops, Counters & Registers.",
          "video": {
            "title": "Logic Gates - AND,OR,NOT,NAND,NOR, XOR,XNOR | Truth Table | Digital logic design|Digital Electronics",
            "channel": "Sudhakar Atchala",
            "youtubeUrl": "https://www.youtube.com/watch?v=QrTVeuloPQQ"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 3 of Flip-Flops, Counters & Registers?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 3 covers key principles of Flip-Flops, Counters & Registers."
            }
          ]
        },
        {
          "name": "Flip-Flops, Counters & Registers Solved Exam Problems & Review",
          "simpleExplanation": "Stage 4 learning milestone for Flip-Flops, Counters & Registers.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 4 of Flip-Flops, Counters & Registers.",
          "video": {
            "title": "Introduction to Combinational Circuits",
            "channel": "TutorialsPoint",
            "youtubeUrl": "https://www.youtube.com/watch?v=_yHo2qq82P0"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 4 of Flip-Flops, Counters & Registers?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 4 covers key principles of Flip-Flops, Counters & Registers."
            }
          ]
        }
      ]
    }
  ],
  "data-visualization": [
    {
      "id": "dv-cleaning",
      "name": "Data Cleaning & Preprocessing",
      "description": "Handling missing data, IQR outlier detection, normalization, one-hot encoding.",
      "skillLevel": "Strong",
      "progressPct": 85,
      "gapLevel": "Low",
      "videos": [
        {
          "id": "v1",
          "videoId": "I7DZP4rVQOU",
          "title": "Data Cleaning with Python Pandas: Hands-On Tutorial with Real World Data",
          "channelTitle": "Onur Baltaci",
          "url": "https://www.youtube.com/watch?v=I7DZP4rVQOU",
          "duration": "15:00"
        },
        {
          "id": "v2",
          "videoId": "NixKNU1hKgg",
          "title": "Data Wrangling and Visualization",
          "channelTitle": "Felix Emeka Anyiam",
          "url": "https://www.youtube.com/watch?v=NixKNU1hKgg",
          "duration": "15:00"
        },
        {
          "id": "v3",
          "videoId": "pGsTw3P1D_4",
          "title": "What is Data Wrangling? | Data Wrangling with Python | Data Wrangling | Intellipaat",
          "channelTitle": "Intellipaat",
          "url": "https://www.youtube.com/watch?v=pGsTw3P1D_4",
          "duration": "15:00"
        },
        {
          "id": "v4",
          "videoId": "s8gi2nLfdRA",
          "title": "What is Exploratory Data Analysis | Data Science | Explained in Telugu",
          "channelTitle": "Wonky Code",
          "url": "https://www.youtube.com/watch?v=s8gi2nLfdRA",
          "duration": "15:00"
        }
      ],
      "subtopics": [
        {
          "name": "Data Cleaning & Preprocessing Core Principles",
          "simpleExplanation": "Core concepts for Data Cleaning & Preprocessing Core Principles",
          "keyConcepts": [
            "Core Concepts",
            "Mechanics",
            "Applications"
          ],
          "notes": "Essential notes for Data Cleaning & Preprocessing Core Principles",
          "video": {
            "title": "Data Cleaning with Python Pandas: Hands-On Tutorial with Real World Data",
            "channel": "Onur Baltaci",
            "youtubeUrl": "https://www.youtube.com/watch?v=I7DZP4rVQOU"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "Which IQR-based formula identifies high-end outlier threshold in data distributions?",
              "options": [
                "A. Q3 + 1.5 * IQR",
                "B. Q1 - 1.5 * IQR",
                "C. Mean + 2 * Std",
                "D. Median * 1.5"
              ],
              "correct": "A",
              "answer": "A. Q3 + 1.5 * IQR",
              "explanation": "Outliers exceed Q3 + 1.5 * IQR."
            },
            {
              "id": 2,
              "difficulty": "Basic",
              "question": "What does Min-Max Normalization scale dataset features to?",
              "options": [
                "A. Range [0, 1]",
                "B. Range [-1, +1]",
                "C. Mean 0, Std 1",
                "D. Range [0, 100]"
              ],
              "correct": "A",
              "answer": "A. Range [0, 1]",
              "explanation": "Min-max normalization bounds data into [0, 1]."
            },
            {
              "id": 3,
              "difficulty": "Intermediate",
              "question": "What formula converts raw feature value x into Z-score Standardization?",
              "options": [
                "A. (x - Mean) / Standard_Deviation",
                "B. (x - Min) / (Max - Min)",
                "C. x * 100",
                "D. log(x)"
              ],
              "correct": "A",
              "answer": "A. (x - Mean) / Standard_Deviation",
              "explanation": "Z-score standardization subtracts mean and divides by standard deviation."
            },
            {
              "id": 4,
              "difficulty": "Intermediate",
              "question": "Which encoding method converts nominal categorical values into binary indicator column vectors?",
              "options": [
                "A. One-Hot Encoding",
                "B. Label Encoding",
                "C. Ordinal Encoding",
                "D. Frequency Encoding"
              ],
              "correct": "A",
              "answer": "A. One-Hot Encoding",
              "explanation": "One-Hot encoding creates binary dummy vectors for nominal categories."
            },
            {
              "id": 5,
              "difficulty": "Basic",
              "question": "What risk arises from using Mean Imputation to fill missing numerical values?",
              "options": [
                "A. Reduces dataset variance and distorts natural distribution",
                "B. Increases row count",
                "C. Deletes columns",
                "D. Throws error"
              ],
              "correct": "A",
              "answer": "A. Reduces dataset variance and distorts natural distribution",
              "explanation": "Mean imputation artificially compresses variance."
            },
            {
              "id": 6,
              "difficulty": "Intermediate",
              "question": "How does pandas identify missing values in a DataFrame?",
              "options": [
                "A. df.isna() / df.isnull()",
                "B. df.empty()",
                "C. df.find_zero()",
                "D. df.clean()"
              ],
              "correct": "A",
              "answer": "A. df.isna() / df.isnull()",
              "explanation": "isna() or isnull() detects NaN values."
            },
            {
              "id": 7,
              "difficulty": "Basic",
              "question": "What operation removes redundant identical rows from a DataFrame?",
              "options": [
                "A. drop_duplicates()",
                "B. dropna()",
                "C. reset_index()",
                "D. strip()"
              ],
              "correct": "A",
              "answer": "A. drop_duplicates()",
              "explanation": "drop_duplicates() purges duplicate rows."
            },
            {
              "id": 8,
              "difficulty": "Advanced",
              "question": "What are Structural Errors in data cleaning?",
              "options": [
                "A. Naming inconsistencies, typos, or irregular capitalization in text columns",
                "B. Missing files",
                "C. Division by zero",
                "D. Overflow"
              ],
              "correct": "A",
              "answer": "A. Naming inconsistencies, typos, or irregular capitalization in text columns",
              "explanation": "Structural errors include misspellings and formatting typos."
            },
            {
              "id": 9,
              "difficulty": "Intermediate",
              "question": "Which imputation method uses nearby row values to fill missing time-series data?",
              "options": [
                "A. Forward Fill (ffill) / Backward Fill (bfill)",
                "B. Zero fill",
                "C. Random fill",
                "D. Mean fill"
              ],
              "correct": "A",
              "answer": "A. Forward Fill (ffill) / Backward Fill (bfill)",
              "explanation": "ffill/bfill propagates valid observations forward or backward."
            },
            {
              "id": 10,
              "difficulty": "Advanced",
              "question": "What threshold defines low-end outliers using Interquartile Range (IQR)?",
              "options": [
                "A. Q1 - 1.5 * IQR",
                "B. Q3 + 1.5 * IQR",
                "C. Median - IQR",
                "D. Mean - Std"
              ],
              "correct": "A",
              "answer": "A. Q1 - 1.5 * IQR",
              "explanation": "Values below Q1 - 1.5 * IQR are low-end outliers."
            }
          ]
        },
        {
          "name": "Data Cleaning & Preprocessing Mechanics & Operations",
          "simpleExplanation": "Stage 2 learning milestone for Data Cleaning & Preprocessing.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 2 of Data Cleaning & Preprocessing.",
          "video": {
            "title": "Data Wrangling and Visualization",
            "channel": "Felix Emeka Anyiam",
            "youtubeUrl": "https://www.youtube.com/watch?v=NixKNU1hKgg"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 2 of Data Cleaning & Preprocessing?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 2 covers key principles of Data Cleaning & Preprocessing."
            }
          ]
        },
        {
          "name": "Data Cleaning & Preprocessing Advanced Concepts & Applications",
          "simpleExplanation": "Stage 3 learning milestone for Data Cleaning & Preprocessing.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 3 of Data Cleaning & Preprocessing.",
          "video": {
            "title": "What is Data Wrangling? | Data Wrangling with Python | Data Wrangling | Intellipaat",
            "channel": "Intellipaat",
            "youtubeUrl": "https://www.youtube.com/watch?v=pGsTw3P1D_4"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 3 of Data Cleaning & Preprocessing?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 3 covers key principles of Data Cleaning & Preprocessing."
            }
          ]
        },
        {
          "name": "Data Cleaning & Preprocessing Solved Exam Problems & Review",
          "simpleExplanation": "Stage 4 learning milestone for Data Cleaning & Preprocessing.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 4 of Data Cleaning & Preprocessing.",
          "video": {
            "title": "What is Exploratory Data Analysis | Data Science | Explained in Telugu",
            "channel": "Wonky Code",
            "youtubeUrl": "https://www.youtube.com/watch?v=s8gi2nLfdRA"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 4 of Data Cleaning & Preprocessing?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 4 covers key principles of Data Cleaning & Preprocessing."
            }
          ]
        }
      ]
    },
    {
      "id": "dv-transformation",
      "name": "Data Transformation",
      "description": "Log transforms, feature engineering, pivot tables, binning.",
      "skillLevel": "Strong",
      "progressPct": 85,
      "gapLevel": "Low",
      "videos": [
        {
          "id": "v2",
          "videoId": "NixKNU1hKgg",
          "title": "Data Wrangling and Visualization",
          "channelTitle": "Felix Emeka Anyiam",
          "url": "https://www.youtube.com/watch?v=NixKNU1hKgg",
          "duration": "15:00"
        },
        {
          "id": "v3",
          "videoId": "pGsTw3P1D_4",
          "title": "What is Data Wrangling? | Data Wrangling with Python | Data Wrangling | Intellipaat",
          "channelTitle": "Intellipaat",
          "url": "https://www.youtube.com/watch?v=pGsTw3P1D_4",
          "duration": "15:00"
        },
        {
          "id": "v4",
          "videoId": "s8gi2nLfdRA",
          "title": "What is Exploratory Data Analysis | Data Science | Explained in Telugu",
          "channelTitle": "Wonky Code",
          "url": "https://www.youtube.com/watch?v=s8gi2nLfdRA",
          "duration": "15:00"
        },
        {
          "id": "v5",
          "videoId": "cjGz2eEEKNU",
          "title": "Python For Data Analysis Course Part 1 | Python Pandas Tutorial | Data Science for Beginners @SCALER",
          "channelTitle": "SCALER",
          "url": "https://www.youtube.com/watch?v=cjGz2eEEKNU",
          "duration": "15:00"
        }
      ],
      "subtopics": [
        {
          "name": "Data Transformation Core Principles",
          "simpleExplanation": "Core concepts for Data Transformation Core Principles",
          "keyConcepts": [
            "Core Concepts",
            "Mechanics",
            "Applications"
          ],
          "notes": "Essential notes for Data Transformation Core Principles",
          "video": {
            "title": "Data Wrangling and Visualization",
            "channel": "Felix Emeka Anyiam",
            "youtubeUrl": "https://www.youtube.com/watch?v=NixKNU1hKgg"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "Which mathematical transformation reduces right-skewness and stabilizes variance in heavy-tailed data?",
              "options": [
                "A. Log Transformation",
                "B. Linear Scaling",
                "C. One-Hot Encoding",
                "D. Rounding"
              ],
              "correct": "A",
              "answer": "A. Log Transformation",
              "explanation": "Log transformation compresses large positive values and reduces right skewness."
            },
            {
              "id": 2,
              "difficulty": "Basic",
              "question": "What process converts continuous numerical features into discrete interval bins?",
              "options": [
                "A. Discretization / Binning",
                "B. Normalization",
                "C. Imputation",
                "D. Concatenation"
              ],
              "correct": "A",
              "answer": "A. Discretization / Binning",
              "explanation": "Binning partitions continuous variables into discrete buckets."
            },
            {
              "id": 3,
              "difficulty": "Intermediate",
              "question": "What is Feature Engineering in data preprocessing?",
              "options": [
                "A. Creating new informative variables from raw data to improve model performance",
                "B. Deleting raw data",
                "C. Hardware setup",
                "D. Sorting columns"
              ],
              "correct": "A",
              "answer": "A. Creating new informative variables from raw data to improve model performance",
              "explanation": "Feature engineering constructs new features from existing raw attributes."
            },
            {
              "id": 4,
              "difficulty": "Intermediate",
              "question": "Which pandas operation reshapes DataFrame from long format to wide table format?",
              "options": [
                "A. pivot_table()",
                "B. melt()",
                "C. concat()",
                "D. append()"
              ],
              "correct": "A",
              "answer": "A. pivot_table()",
              "explanation": "pivot_table() converts long data into wide format."
            },
            {
              "id": 5,
              "difficulty": "Intermediate",
              "question": "Which pandas operation converts wide format DataFrame columns into long format rows?",
              "options": [
                "A. melt()",
                "B. pivot()",
                "C. groupby()",
                "D. join()"
              ],
              "correct": "A",
              "answer": "A. melt()",
              "explanation": "melt() unpivots wide DataFrames into long format."
            },
            {
              "id": 6,
              "difficulty": "Basic",
              "question": "When should Ordinal Encoding be used instead of One-Hot Encoding?",
              "options": [
                "A. When categories possess an inherent meaningful rank or order (e.g. Low, Med, High)",
                "B. For unordered names",
                "C. For numbers",
                "D. For text search"
              ],
              "correct": "A",
              "answer": "A. When categories possess an inherent meaningful rank or order (e.g. Low, Med, High)",
              "explanation": "Ordinal encoding preserves categorical ordering."
            },
            {
              "id": 7,
              "difficulty": "Advanced",
              "question": "What strict requirement must data satisfy before applying a Box-Cox Transformation?",
              "options": [
                "A. All values MUST be strictly positive (x > 0)",
                "B. Data must be integers",
                "C. Mean must be 0",
                "D. No missing values"
              ],
              "correct": "A",
              "answer": "A. All values MUST be strictly positive (x > 0)",
              "explanation": "Box-Cox requires strictly positive values."
            },
            {
              "id": 8,
              "difficulty": "Intermediate",
              "question": "Why is Feature Scaling crucial for distance-based algorithms like KNN or SVM?",
              "options": [
                "A. Prevents features with larger numerical ranges from dominating distance calculations",
                "B. Reduces row count",
                "C. Eliminates nulls",
                "D. Speeds up disk read"
              ],
              "correct": "A",
              "answer": "A. Prevents features with larger numerical ranges from dominating distance calculations",
              "explanation": "Feature scaling balances feature contributions in distance metrics."
            },
            {
              "id": 9,
              "difficulty": "Basic",
              "question": "Which pandas method groups data by categorical variables to compute aggregate metrics?",
              "options": [
                "A. groupby()",
                "B. sort_values()",
                "C. filter()",
                "D. applymap()"
              ],
              "correct": "A",
              "answer": "A. groupby()",
              "explanation": "groupby() enables split-apply-combine group aggregations."
            },
            {
              "id": 10,
              "difficulty": "Advanced",
              "question": "What pandas accessor permits string operations like str.replace() or str.extract() on Series?",
              "options": [
                "A. .str",
                "B. .text",
                "C. .string",
                "D. .val"
              ],
              "correct": "A",
              "answer": "A. .str",
              "explanation": ".str accessor enables vectorized string methods."
            }
          ]
        },
        {
          "name": "Data Transformation Mechanics & Operations",
          "simpleExplanation": "Stage 2 learning milestone for Data Transformation.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 2 of Data Transformation.",
          "video": {
            "title": "What is Data Wrangling? | Data Wrangling with Python | Data Wrangling | Intellipaat",
            "channel": "Intellipaat",
            "youtubeUrl": "https://www.youtube.com/watch?v=pGsTw3P1D_4"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 2 of Data Transformation?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 2 covers key principles of Data Transformation."
            }
          ]
        },
        {
          "name": "Data Transformation Advanced Concepts & Applications",
          "simpleExplanation": "Stage 3 learning milestone for Data Transformation.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 3 of Data Transformation.",
          "video": {
            "title": "What is Exploratory Data Analysis | Data Science | Explained in Telugu",
            "channel": "Wonky Code",
            "youtubeUrl": "https://www.youtube.com/watch?v=s8gi2nLfdRA"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 3 of Data Transformation?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 3 covers key principles of Data Transformation."
            }
          ]
        },
        {
          "name": "Data Transformation Solved Exam Problems & Review",
          "simpleExplanation": "Stage 4 learning milestone for Data Transformation.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 4 of Data Transformation.",
          "video": {
            "title": "Python For Data Analysis Course Part 1 | Python Pandas Tutorial | Data Science for Beginners @SCALER",
            "channel": "SCALER",
            "youtubeUrl": "https://www.youtube.com/watch?v=cjGz2eEEKNU"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 4 of Data Transformation?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 4 covers key principles of Data Transformation."
            }
          ]
        }
      ]
    },
    {
      "id": "dv-integration",
      "name": "Data Integration & Merging",
      "description": "Pandas merge joins, concatenation, schema resolution, deduplication.",
      "skillLevel": "Strong",
      "progressPct": 85,
      "gapLevel": "Low",
      "videos": [
        {
          "id": "v3",
          "videoId": "pGsTw3P1D_4",
          "title": "What is Data Wrangling? | Data Wrangling with Python | Data Wrangling | Intellipaat",
          "channelTitle": "Intellipaat",
          "url": "https://www.youtube.com/watch?v=pGsTw3P1D_4",
          "duration": "15:00"
        },
        {
          "id": "v4",
          "videoId": "s8gi2nLfdRA",
          "title": "What is Exploratory Data Analysis | Data Science | Explained in Telugu",
          "channelTitle": "Wonky Code",
          "url": "https://www.youtube.com/watch?v=s8gi2nLfdRA",
          "duration": "15:00"
        },
        {
          "id": "v5",
          "videoId": "cjGz2eEEKNU",
          "title": "Python For Data Analysis Course Part 1 | Python Pandas Tutorial | Data Science for Beginners @SCALER",
          "channelTitle": "SCALER",
          "url": "https://www.youtube.com/watch?v=cjGz2eEEKNU",
          "duration": "15:00"
        },
        {
          "id": "v6",
          "videoId": "GGL6U0k8WYA",
          "title": "Plotly Tutorial 2023",
          "channelTitle": "Derek Banas",
          "url": "https://www.youtube.com/watch?v=GGL6U0k8WYA",
          "duration": "15:00"
        }
      ],
      "subtopics": [
        {
          "name": "Data Integration & Merging Core Principles",
          "simpleExplanation": "Core concepts for Data Integration & Merging Core Principles",
          "keyConcepts": [
            "Core Concepts",
            "Mechanics",
            "Applications"
          ],
          "notes": "Essential notes for Data Integration & Merging Core Principles",
          "video": {
            "title": "What is Data Wrangling? | Data Wrangling with Python | Data Wrangling | Intellipaat",
            "channel": "Intellipaat",
            "youtubeUrl": "https://www.youtube.com/watch?v=pGsTw3P1D_4"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the default join type performed by pandas `pd.merge(df1, df2)`?",
              "options": [
                "A. Inner Join",
                "B. Left Join",
                "C. Right Join",
                "D. Outer Join"
              ],
              "correct": "A",
              "answer": "A. Inner Join",
              "explanation": "pd.merge defaults to Inner Join."
            },
            {
              "id": 2,
              "difficulty": "Basic",
              "question": "Which join type preserves ALL rows from both DataFrames, filling unmatched fields with NaN?",
              "options": [
                "A. Outer Join (Full Outer)",
                "B. Inner Join",
                "C. Cross Join",
                "D. Left Join"
              ],
              "correct": "A",
              "answer": "A. Outer Join (Full Outer)",
              "explanation": "Outer Join retains all rows from both datasets."
            },
            {
              "id": 3,
              "difficulty": "Intermediate",
              "question": "What parameter in `pd.concat([df1, df2], axis=1)` specifies horizontal column-wise joining?",
              "options": [
                "A. axis=1",
                "B. axis=0",
                "C. how='inner'",
                "D. on='id'"
              ],
              "correct": "A",
              "answer": "A. axis=1",
              "explanation": "axis=1 concatenates DataFrames side-by-side along columns."
            },
            {
              "id": 4,
              "difficulty": "Intermediate",
              "question": "What does a Left Outer Join `pd.merge(df1, df2, how='left')` retain?",
              "options": [
                "A. All rows from left DataFrame df1, matching right rows",
                "B. All right rows",
                "C. Only matching rows",
                "D. No rows"
              ],
              "correct": "A",
              "answer": "A. All rows from left DataFrame df1, matching right rows",
              "explanation": "Left Join retains all left table records."
            },
            {
              "id": 5,
              "difficulty": "Advanced",
              "question": "What is Entity Resolution in data integration?",
              "options": [
                "A. Matching records from different sources that refer to the same real-world entity",
                "B. Resolving IP addresses",
                "C. Compressing files",
                "D. Deleting duplicate columns"
              ],
              "correct": "A",
              "answer": "A. Matching records from different sources that refer to the same real-world entity",
              "explanation": "Entity resolution links records representing identical real-world entities."
            },
            {
              "id": 6,
              "difficulty": "Intermediate",
              "question": "How does pandas handle overlapping column names during a merge operation?",
              "options": [
                "A. Appends suffixes (e.g. '_x', '_y')",
                "B. Overwrites columns",
                "C. Throws error",
                "D. Deletes left column"
              ],
              "correct": "A",
              "answer": "A. Appends suffixes (e.g. '_x', '_y')",
              "explanation": "pandas appends suffixes to differentiate duplicate column names."
            },
            {
              "id": 7,
              "difficulty": "Basic",
              "question": "What is a Cross Join between two datasets?",
              "options": [
                "A. Cartesian product of all rows from left dataset with all rows from right dataset",
                "B. Matching primary keys",
                "C. Inner join",
                "D. Concatenation"
              ],
              "correct": "A",
              "answer": "A. Cartesian product of all rows from left dataset with all rows from right dataset",
              "explanation": "Cross Join produces the Cartesian product of rows."
            },
            {
              "id": 8,
              "difficulty": "Intermediate",
              "question": "What issue occurs when merging datasets with inconsistent key data types (e.g. int vs str)?",
              "options": [
                "A. Merge fails to match identical keys",
                "B. Memory leak",
                "C. Rows get deleted automatically",
                "D. Values convert to zero"
              ],
              "correct": "A",
              "answer": "A. Merge fails to match identical keys",
              "explanation": "Mismatched key data types prevent successful equality matching."
            },
            {
              "id": 9,
              "difficulty": "Advanced",
              "question": "What is Schema Inconsistency during data integration?",
              "options": [
                "A. Differences in attribute names, formats, or units across merged data sources",
                "B. Missing database password",
                "C. Network delay",
                "D. Corrupted disk"
              ],
              "correct": "A",
              "answer": "A. Differences in attribute names, formats, or units across merged data sources",
              "explanation": "Schema inconsistency involves mismatched column names or structures."
            },
            {
              "id": 10,
              "difficulty": "Basic",
              "question": "Which parameter in `pd.merge()` specifies key columns explicitly?",
              "options": [
                "A. on='key_column'",
                "B. index=True",
                "C. by='key_column'",
                "D. keys=[]"
              ],
              "correct": "A",
              "answer": "A. on='key_column'",
              "explanation": "on='key_column' specifies join key attributes."
            }
          ]
        },
        {
          "name": "Data Integration & Merging Mechanics & Operations",
          "simpleExplanation": "Stage 2 learning milestone for Data Integration & Merging.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 2 of Data Integration & Merging.",
          "video": {
            "title": "What is Exploratory Data Analysis | Data Science | Explained in Telugu",
            "channel": "Wonky Code",
            "youtubeUrl": "https://www.youtube.com/watch?v=s8gi2nLfdRA"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 2 of Data Integration & Merging?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 2 covers key principles of Data Integration & Merging."
            }
          ]
        },
        {
          "name": "Data Integration & Merging Advanced Concepts & Applications",
          "simpleExplanation": "Stage 3 learning milestone for Data Integration & Merging.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 3 of Data Integration & Merging.",
          "video": {
            "title": "Python For Data Analysis Course Part 1 | Python Pandas Tutorial | Data Science for Beginners @SCALER",
            "channel": "SCALER",
            "youtubeUrl": "https://www.youtube.com/watch?v=cjGz2eEEKNU"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 3 of Data Integration & Merging?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 3 covers key principles of Data Integration & Merging."
            }
          ]
        },
        {
          "name": "Data Integration & Merging Solved Exam Problems & Review",
          "simpleExplanation": "Stage 4 learning milestone for Data Integration & Merging.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 4 of Data Integration & Merging.",
          "video": {
            "title": "Plotly Tutorial 2023",
            "channel": "Derek Banas",
            "youtubeUrl": "https://www.youtube.com/watch?v=GGL6U0k8WYA"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 4 of Data Integration & Merging?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 4 covers key principles of Data Integration & Merging."
            }
          ]
        }
      ]
    },
    {
      "id": "dv-eda",
      "name": "Exploratory Data Analysis (EDA)",
      "description": "Summary stats, correlation matrices, histograms, boxplots.",
      "skillLevel": "Strong",
      "progressPct": 85,
      "gapLevel": "Low",
      "videos": [
        {
          "id": "v4",
          "videoId": "s8gi2nLfdRA",
          "title": "What is Exploratory Data Analysis | Data Science | Explained in Telugu",
          "channelTitle": "Wonky Code",
          "url": "https://www.youtube.com/watch?v=s8gi2nLfdRA",
          "duration": "15:00"
        },
        {
          "id": "v5",
          "videoId": "cjGz2eEEKNU",
          "title": "Python For Data Analysis Course Part 1 | Python Pandas Tutorial | Data Science for Beginners @SCALER",
          "channelTitle": "SCALER",
          "url": "https://www.youtube.com/watch?v=cjGz2eEEKNU",
          "duration": "15:00"
        },
        {
          "id": "v6",
          "videoId": "GGL6U0k8WYA",
          "title": "Plotly Tutorial 2023",
          "channelTitle": "Derek Banas",
          "url": "https://www.youtube.com/watch?v=GGL6U0k8WYA",
          "duration": "15:00"
        },
        {
          "id": "v7",
          "videoId": "UO98lJQ3QGI",
          "title": "Matplotlib Tutorial (Part 1): Creating and Customizing Our First Plots",
          "channelTitle": "Corey Schafer",
          "url": "https://www.youtube.com/watch?v=UO98lJQ3QGI",
          "duration": "15:00"
        }
      ],
      "subtopics": [
        {
          "name": "Exploratory Data Analysis (EDA) Core Principles",
          "simpleExplanation": "Core concepts for Exploratory Data Analysis (EDA) Core Principles",
          "keyConcepts": [
            "Core Concepts",
            "Mechanics",
            "Applications"
          ],
          "notes": "Essential notes for Exploratory Data Analysis (EDA) Core Principles",
          "video": {
            "title": "What is Exploratory Data Analysis | Data Science | Explained in Telugu",
            "channel": "Wonky Code",
            "youtubeUrl": "https://www.youtube.com/watch?v=s8gi2nLfdRA"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What range of values can the Pearson Correlation Coefficient (r) take?",
              "options": [
                "A. [-1.0, +1.0]",
                "B. [0.0, 1.0]",
                "C. [-Inf, +Inf]",
                "D. [0, 100]"
              ],
              "correct": "A",
              "answer": "A. [-1.0, +1.0]",
              "explanation": "Pearson correlation r ranges from -1.0 to +1.0."
            },
            {
              "id": 2,
              "difficulty": "Basic",
              "question": "Which visualization plot displays the distribution of a single continuous numerical variable using frequency bins?",
              "options": [
                "A. Histogram",
                "B. Bar Chart",
                "C. Scatter Plot",
                "D. Pie Chart"
              ],
              "correct": "A",
              "answer": "A. Histogram",
              "explanation": "Histograms display frequency distributions of continuous data."
            },
            {
              "id": 3,
              "difficulty": "Intermediate",
              "question": "In a Boxplot (Box-and-Whisker plot), what does the central line inside the box represent?",
              "options": [
                "A. Mean",
                "B. Median (50th Percentile)",
                "C. Mode",
                "D. Standard Deviation"
              ],
              "correct": "B",
              "answer": "B. Median (50th Percentile)",
              "explanation": "The interior box line marks the median (Q2)."
            },
            {
              "id": 4,
              "difficulty": "Intermediate",
              "question": "Which plot is ideal for visualizing the correlation matrix across multiple numerical features?",
              "options": [
                "A. Heatmap",
                "B. Line Chart",
                "C. Area Chart",
                "D. Donut Chart"
              ],
              "correct": "A",
              "answer": "A. Heatmap",
              "explanation": "Heatmaps display correlation matrices visually."
            },
            {
              "id": 5,
              "difficulty": "Basic",
              "question": "Which plot visualizes pairwise relationships and distributions between all numeric features simultaneously?",
              "options": [
                "A. Pairplot / Scatter Matrix",
                "B. Bar Chart",
                "C. Pie Chart",
                "D. Boxplot"
              ],
              "correct": "A",
              "answer": "A. Pairplot / Scatter Matrix",
              "explanation": "Pairplots visualize pairwise feature scatter matrices."
            },
            {
              "id": 6,
              "difficulty": "Intermediate",
              "question": "What does positive skewness in a distribution indicate?",
              "options": [
                "A. Distribution tail extends farther to the RIGHT",
                "B. Tail extends left",
                "C. Symmetrical bell curve",
                "D. Flat distribution"
              ],
              "correct": "A",
              "answer": "A. Distribution tail extends farther to the RIGHT",
              "explanation": "Positive skewness indicates a longer right tail."
            },
            {
              "id": 7,
              "difficulty": "Advanced",
              "question": "What metric measures the tail-heaviness and peak sharpness of a probability distribution relative to Normal distribution?",
              "options": [
                "A. Kurtosis",
                "B. Skewness",
                "C. Variance",
                "D. Range"
              ],
              "correct": "A",
              "answer": "A. Kurtosis",
              "explanation": "Kurtosis measures distribution tail-heaviness and peakedness."
            },
            {
              "id": 8,
              "difficulty": "Basic",
              "question": "What is the relationship between Variance and Standard Deviation?",
              "options": [
                "A. Standard Deviation is the square root of Variance",
                "B. Variance is square root of Std",
                "C. They are identical",
                "D. Std = Variance / 2"
              ],
              "correct": "A",
              "answer": "A. Standard Deviation is the square root of Variance",
              "explanation": "Standard Deviation is the positive square root of Variance."
            },
            {
              "id": 9,
              "difficulty": "Intermediate",
              "question": "Which plot effectively highlights summary statistics including Q1, Median, Q3, and Outliers?",
              "options": [
                "A. Boxplot",
                "B. Scatter plot",
                "C. Line chart",
                "D. Treemap"
              ],
              "correct": "A",
              "answer": "A. Boxplot",
              "explanation": "Boxplots display five-number summaries and outliers."
            },
            {
              "id": 10,
              "difficulty": "Advanced",
              "question": "What does a Pearson correlation value r = 0 indicate between two variables?",
              "options": [
                "A. No linear correlation exists",
                "B. Perfect positive linear relationship",
                "C. Perfect negative linear relationship",
                "D. Inverse quadratic relationship"
              ],
              "correct": "A",
              "answer": "A. No linear correlation exists",
              "explanation": "r = 0 indicates absence of linear correlation."
            }
          ]
        },
        {
          "name": "Exploratory Data Analysis (EDA) Mechanics & Operations",
          "simpleExplanation": "Stage 2 learning milestone for Exploratory Data Analysis (EDA).",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 2 of Exploratory Data Analysis (EDA).",
          "video": {
            "title": "Python For Data Analysis Course Part 1 | Python Pandas Tutorial | Data Science for Beginners @SCALER",
            "channel": "SCALER",
            "youtubeUrl": "https://www.youtube.com/watch?v=cjGz2eEEKNU"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 2 of Exploratory Data Analysis (EDA)?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 2 covers key principles of Exploratory Data Analysis (EDA)."
            }
          ]
        },
        {
          "name": "Exploratory Data Analysis (EDA) Advanced Concepts & Applications",
          "simpleExplanation": "Stage 3 learning milestone for Exploratory Data Analysis (EDA).",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 3 of Exploratory Data Analysis (EDA).",
          "video": {
            "title": "Plotly Tutorial 2023",
            "channel": "Derek Banas",
            "youtubeUrl": "https://www.youtube.com/watch?v=GGL6U0k8WYA"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 3 of Exploratory Data Analysis (EDA)?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 3 covers key principles of Exploratory Data Analysis (EDA)."
            }
          ]
        },
        {
          "name": "Exploratory Data Analysis (EDA) Solved Exam Problems & Review",
          "simpleExplanation": "Stage 4 learning milestone for Exploratory Data Analysis (EDA).",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 4 of Exploratory Data Analysis (EDA).",
          "video": {
            "title": "Matplotlib Tutorial (Part 1): Creating and Customizing Our First Plots",
            "channel": "Corey Schafer",
            "youtubeUrl": "https://www.youtube.com/watch?v=UO98lJQ3QGI"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 4 of Exploratory Data Analysis (EDA)?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 4 covers key principles of Exploratory Data Analysis (EDA)."
            }
          ]
        }
      ]
    },
    {
      "id": "dv-dashboarding",
      "name": "Data Visualization & Dashboarding",
      "description": "Bar vs Histogram, time series lines, Viridis accessibility, dashboards.",
      "skillLevel": "Strong",
      "progressPct": 85,
      "gapLevel": "Low",
      "videos": [
        {
          "id": "v5",
          "videoId": "cjGz2eEEKNU",
          "title": "Python For Data Analysis Course Part 1 | Python Pandas Tutorial | Data Science for Beginners @SCALER",
          "channelTitle": "SCALER",
          "url": "https://www.youtube.com/watch?v=cjGz2eEEKNU",
          "duration": "15:00"
        },
        {
          "id": "v6",
          "videoId": "GGL6U0k8WYA",
          "title": "Plotly Tutorial 2023",
          "channelTitle": "Derek Banas",
          "url": "https://www.youtube.com/watch?v=GGL6U0k8WYA",
          "duration": "15:00"
        },
        {
          "id": "v7",
          "videoId": "UO98lJQ3QGI",
          "title": "Matplotlib Tutorial (Part 1): Creating and Customizing Our First Plots",
          "channelTitle": "Corey Schafer",
          "url": "https://www.youtube.com/watch?v=UO98lJQ3QGI",
          "duration": "15:00"
        },
        {
          "id": "v8",
          "videoId": "xi0vhXFPegw",
          "title": "Exploratory Data Analysis with Pandas Python",
          "channelTitle": "Rob Mulla",
          "url": "https://www.youtube.com/watch?v=xi0vhXFPegw",
          "duration": "15:00"
        }
      ],
      "subtopics": [
        {
          "name": "Data Visualization & Dashboarding Core Principles",
          "simpleExplanation": "Core concepts for Data Visualization & Dashboarding Core Principles",
          "keyConcepts": [
            "Core Concepts",
            "Mechanics",
            "Applications"
          ],
          "notes": "Essential notes for Data Visualization & Dashboarding Core Principles",
          "video": {
            "title": "Python For Data Analysis Course Part 1 | Python Pandas Tutorial | Data Science for Beginners @SCALER",
            "channel": "SCALER",
            "youtubeUrl": "https://www.youtube.com/watch?v=cjGz2eEEKNU"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the key difference between a Bar Chart and a Histogram?",
              "options": [
                "A. Bar charts display discrete categorical data with gaps; Histograms display continuous numerical data intervals",
                "B. Histograms use colors only",
                "C. Bar charts have no axes",
                "D. They are identical"
              ],
              "correct": "A",
              "answer": "A. Bar charts display discrete categorical data with gaps; Histograms display continuous numerical data intervals",
              "explanation": "Bar charts depict discrete categories; Histograms depict continuous intervals."
            },
            {
              "id": 2,
              "difficulty": "Basic",
              "question": "Which chart type is best suited for showing trends over time (Time Series data)?",
              "options": [
                "A. Line Chart",
                "B. Pie Chart",
                "C. Scatter Plot",
                "D. Treemap"
              ],
              "correct": "A",
              "answer": "A. Line Chart",
              "explanation": "Line charts excel at visualizing time series trends."
            },
            {
              "id": 3,
              "difficulty": "Intermediate",
              "question": "What visual feature is recommended for color-blind friendly visualizations?",
              "options": [
                "A. Using Viridis or ColorBrewer palettes instead of red-green contrast",
                "B. High saturation red and green",
                "C. Black text only",
                "D. 3D shading"
              ],
              "correct": "A",
              "answer": "A. Using Viridis or ColorBrewer palettes instead of red-green contrast",
              "explanation": "Viridis palettes ensure color-blind accessibility."
            },
            {
              "id": 4,
              "difficulty": "Intermediate",
              "question": "Why are 3D Pie Charts discouraged in modern data visualization?",
              "options": [
                "A. Perspective distortion distorts slice proportions and misleads readers",
                "B. Too bright",
                "C. Hard to draw",
                "D. File size too big"
              ],
              "correct": "A",
              "answer": "A. Perspective distortion distorts slice proportions and misleads readers",
              "explanation": "3D perspective distorts slice sizes and misleads users."
            },
            {
              "id": 5,
              "difficulty": "Intermediate",
              "question": "According to Edward Tufte, what is Data-to-Ink Ratio?",
              "options": [
                "A. Proportion of chart ink used to display actual data vs non-data chart junk",
                "B. Amount of printer ink used",
                "C. DPI resolution",
                "D. Font size ratio"
              ],
              "correct": "A",
              "answer": "A. Proportion of chart ink used to display actual data vs non-data chart junk",
              "explanation": "Data-to-ink ratio measures data ink efficiency."
            },
            {
              "id": 6,
              "difficulty": "Basic",
              "question": "Which plot displays hierarchical data using nested rectangles sized proportionally to values?",
              "options": [
                "A. Treemap",
                "B. Scatter plot",
                "C. Boxplot",
                "D. Bubble chart"
              ],
              "correct": "A",
              "answer": "A. Treemap",
              "explanation": "Treemaps display hierarchical data as nested rectangles."
            },
            {
              "id": 7,
              "difficulty": "Advanced",
              "question": "What is Faceting (Small Multiples) in visualization design?",
              "options": [
                "A. Splitting data into multiple sub-plots sharing identical axes for comparative subsets",
                "B. 3D rotation",
                "C. Color fading",
                "D. Zooming in"
              ],
              "correct": "A",
              "answer": "A. Splitting data into multiple sub-plots sharing identical axes for comparative subsets",
              "explanation": "Faceting creates small multiple sub-plots for categorical comparisons."
            },
            {
              "id": 8,
              "difficulty": "Basic",
              "question": "Which map type colors geographical regions according to statistical aggregate values?",
              "options": [
                "A. Choropleth Map",
                "B. Scatter Map",
                "C. Topo Map",
                "D. Heat Map"
              ],
              "correct": "A",
              "answer": "A. Choropleth Map",
              "explanation": "Choropleth maps shade geographical regions by data values."
            },
            {
              "id": 9,
              "difficulty": "Intermediate",
              "question": "Which chart displays relationships between 3 continuous variables using X, Y position and dot Size?",
              "options": [
                "A. Bubble Chart",
                "B. Line Chart",
                "C. Bar Chart",
                "D. Histogram"
              ],
              "correct": "A",
              "answer": "A. Bubble Chart",
              "explanation": "Bubble charts encode 3 variables via X, Y position and dot size."
            },
            {
              "id": 10,
              "difficulty": "Advanced",
              "question": "What interactive feature allows users to click a visual element to filter related dashboard charts?",
              "options": [
                "A. Cross-filtering / Slicing",
                "B. Export to PDF",
                "C. Refresh page",
                "D. Auto-scroll"
              ],
              "correct": "A",
              "answer": "A. Cross-filtering / Slicing",
              "explanation": "Cross-filtering updates connected dashboard elements upon selection."
            }
          ]
        },
        {
          "name": "Data Visualization & Dashboarding Mechanics & Operations",
          "simpleExplanation": "Stage 2 learning milestone for Data Visualization & Dashboarding.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 2 of Data Visualization & Dashboarding.",
          "video": {
            "title": "Plotly Tutorial 2023",
            "channel": "Derek Banas",
            "youtubeUrl": "https://www.youtube.com/watch?v=GGL6U0k8WYA"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 2 of Data Visualization & Dashboarding?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 2 covers key principles of Data Visualization & Dashboarding."
            }
          ]
        },
        {
          "name": "Data Visualization & Dashboarding Advanced Concepts & Applications",
          "simpleExplanation": "Stage 3 learning milestone for Data Visualization & Dashboarding.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 3 of Data Visualization & Dashboarding.",
          "video": {
            "title": "Matplotlib Tutorial (Part 1): Creating and Customizing Our First Plots",
            "channel": "Corey Schafer",
            "youtubeUrl": "https://www.youtube.com/watch?v=UO98lJQ3QGI"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 3 of Data Visualization & Dashboarding?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 3 covers key principles of Data Visualization & Dashboarding."
            }
          ]
        },
        {
          "name": "Data Visualization & Dashboarding Solved Exam Problems & Review",
          "simpleExplanation": "Stage 4 learning milestone for Data Visualization & Dashboarding.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 4 of Data Visualization & Dashboarding.",
          "video": {
            "title": "Exploratory Data Analysis with Pandas Python",
            "channel": "Rob Mulla",
            "youtubeUrl": "https://www.youtube.com/watch?v=xi0vhXFPegw"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 4 of Data Visualization & Dashboarding?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 4 covers key principles of Data Visualization & Dashboarding."
            }
          ]
        }
      ]
    }
  ],
  "data-structures": [
    {
      "id": "ds-arrays",
      "name": "Arrays",
      "description": "Contiguous memory, O(1) indexing, dynamic array resizing, two-pointer approach.",
      "skillLevel": "Strong",
      "progressPct": 90,
      "gapLevel": "Low",
      "videos": [
        {
          "id": "v1",
          "videoId": "0OK-kbu9Cwo",
          "title": "Array Data Structure",
          "channelTitle": "Telusko",
          "url": "https://www.youtube.com/watch?v=0OK-kbu9Cwo",
          "duration": "15:00"
        },
        {
          "id": "v2",
          "videoId": "R9PTBwOzceo",
          "title": "Introduction to Linked List",
          "channelTitle": "Neso Academy",
          "url": "https://www.youtube.com/watch?v=R9PTBwOzceo",
          "duration": "15:00"
        },
        {
          "id": "v3",
          "videoId": "lno6Ft0tOZI",
          "title": "Stacks And Queues In Data Structure | Data Structures And Algorithms Tutorial | Simplilearn",
          "channelTitle": "Simplilearn",
          "url": "https://www.youtube.com/watch?v=lno6Ft0tOZI",
          "duration": "15:00"
        },
        {
          "id": "v4",
          "videoId": "b_NjndniOqY",
          "title": "Learn Tree traversal in 3 minutes \ud83e\uddd7",
          "channelTitle": "Bro Code",
          "url": "https://www.youtube.com/watch?v=b_NjndniOqY",
          "duration": "15:00"
        }
      ],
      "subtopics": [
        {
          "name": "Arrays Core Principles",
          "simpleExplanation": "Core concepts for Arrays Core Principles",
          "keyConcepts": [
            "Core Concepts",
            "Mechanics",
            "Applications"
          ],
          "notes": "Essential notes for Arrays Core Principles",
          "video": {
            "title": "Array Data Structure",
            "channel": "Telusko",
            "youtubeUrl": "https://www.youtube.com/watch?v=0OK-kbu9Cwo"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the Time Complexity to access an element at a known index in an Array?",
              "options": [
                "A. O(1)",
                "B. O(n)",
                "C. O(log n)",
                "D. O(n^2)"
              ],
              "correct": "A",
              "answer": "A. O(1)",
              "explanation": "Array element lookup by index is O(1) constant time."
            },
            {
              "id": 2,
              "difficulty": "Basic",
              "question": "How are elements stored in memory in a standard contiguous Array?",
              "options": [
                "A. In adjacent contiguous memory locations",
                "B. Randomly scattered",
                "C. Linked via pointers",
                "D. On disk only"
              ],
              "correct": "A",
              "answer": "A. In adjacent contiguous memory locations",
              "explanation": "Arrays store elements in contiguous memory addresses."
            },
            {
              "id": 3,
              "difficulty": "Intermediate",
              "question": "What is the worst-case time complexity of inserting an element at the beginning of an Array of size n?",
              "options": [
                "A. O(1)",
                "B. O(n)",
                "C. O(log n)",
                "D. O(n^2)"
              ],
              "correct": "B",
              "answer": "B. O(n)",
              "explanation": "Inserting at index 0 requires shifting all n elements."
            },
            {
              "id": 4,
              "difficulty": "Intermediate",
              "question": "How does a Dynamic Array (e.g. ArrayList) handle capacity resizing when full?",
              "options": [
                "A. Allocates a new larger array (typically 2x) and copies existing elements in O(n) time",
                "B. Adds 1 byte",
                "C. Overwrites memory",
                "D. Fails execution"
              ],
              "correct": "A",
              "answer": "A. Allocates a new larger array (typically 2x) and copies existing elements in O(n) time",
              "explanation": "Dynamic arrays double capacity and copy elements when full."
            },
            {
              "id": 5,
              "difficulty": "Basic",
              "question": "What is the Time Complexity of Binary Search on a sorted array of size n?",
              "options": [
                "A. O(1)",
                "B. O(log n)",
                "C. O(n)",
                "D. O(n log n)"
              ],
              "correct": "B",
              "answer": "B. O(log n)",
              "explanation": "Binary search achieves O(log n) time complexity on sorted arrays."
            },
            {
              "id": 6,
              "difficulty": "Intermediate",
              "question": "In Row-Major Order memory mapping for a 2D array arr[R][C], how is element index (i, j) computed?",
              "options": [
                "A. Base + (i * C + j) * element_size",
                "B. Base + (j * R + i)",
                "C. Base + i + j",
                "D. Base * i * j"
              ],
              "correct": "A",
              "answer": "A. Base + (i * C + j) * element_size",
              "explanation": "Row-major order calculates offset as (i * C + j) * size."
            },
            {
              "id": 7,
              "difficulty": "Basic",
              "question": "Which technique uses two pointers moving from opposite ends of a sorted array towards each other?",
              "options": [
                "A. Two-Pointer Technique",
                "B. Sliding Window",
                "C. Fast and Slow Pointer",
                "D. Divide and Conquer"
              ],
              "correct": "A",
              "answer": "A. Two-Pointer Technique",
              "explanation": "Two-pointer technique scans sorted arrays from both ends inward."
            },
            {
              "id": 8,
              "difficulty": "Intermediate",
              "question": "What algorithm strategy maintains a fixed or dynamic contiguous subarray window to solve array problems?",
              "options": [
                "A. Sliding Window Technique",
                "B. Backtracking",
                "C. Dynamic Programming",
                "D. Greedy Strategy"
              ],
              "correct": "A",
              "answer": "A. Sliding Window Technique",
              "explanation": "Sliding window maintains a contiguous subarray range."
            },
            {
              "id": 9,
              "difficulty": "Advanced",
              "question": "How can an array of n elements be reversed In-Place without extra memory array allocation?",
              "options": [
                "A. Swap elements arr[i] with arr[n - 1 - i] using O(1) auxiliary space",
                "B. Create new array",
                "C. Sort array",
                "D. Push to stack"
              ],
              "correct": "A",
              "answer": "A. Swap elements arr[i] with arr[n - 1 - i] using O(1) auxiliary space",
              "explanation": "Swapping symmetrical pairs reverses an array in-place."
            },
            {
              "id": 10,
              "difficulty": "Advanced",
              "question": "What is the Space Complexity of an array containing n elements?",
              "options": [
                "A. O(1)",
                "B. O(n)",
                "C. O(n^2)",
                "D. O(log n)"
              ],
              "correct": "B",
              "answer": "B. O(n)",
              "explanation": "Storing n elements requires O(n) linear space."
            }
          ]
        },
        {
          "name": "Arrays Mechanics & Operations",
          "simpleExplanation": "Stage 2 learning milestone for Arrays.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 2 of Arrays.",
          "video": {
            "title": "Introduction to Linked List",
            "channel": "Neso Academy",
            "youtubeUrl": "https://www.youtube.com/watch?v=R9PTBwOzceo"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 2 of Arrays?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 2 covers key principles of Arrays."
            }
          ]
        },
        {
          "name": "Arrays Advanced Concepts & Applications",
          "simpleExplanation": "Stage 3 learning milestone for Arrays.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 3 of Arrays.",
          "video": {
            "title": "Stacks And Queues In Data Structure | Data Structures And Algorithms Tutorial | Simplilearn",
            "channel": "Simplilearn",
            "youtubeUrl": "https://www.youtube.com/watch?v=lno6Ft0tOZI"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 3 of Arrays?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 3 covers key principles of Arrays."
            }
          ]
        },
        {
          "name": "Arrays Solved Exam Problems & Review",
          "simpleExplanation": "Stage 4 learning milestone for Arrays.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 4 of Arrays.",
          "video": {
            "title": "Learn Tree traversal in 3 minutes \ud83e\uddd7",
            "channel": "Bro Code",
            "youtubeUrl": "https://www.youtube.com/watch?v=b_NjndniOqY"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 4 of Arrays?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 4 covers key principles of Arrays."
            }
          ]
        }
      ]
    },
    {
      "id": "ds-linked-lists",
      "name": "Linked Lists",
      "description": "Singly/Doubly linked lists, cycle detection, head insertion, middle node.",
      "skillLevel": "Medium",
      "progressPct": 68,
      "gapLevel": "Medium",
      "videos": [
        {
          "id": "v2",
          "videoId": "R9PTBwOzceo",
          "title": "Introduction to Linked List",
          "channelTitle": "Neso Academy",
          "url": "https://www.youtube.com/watch?v=R9PTBwOzceo",
          "duration": "15:00"
        },
        {
          "id": "v3",
          "videoId": "lno6Ft0tOZI",
          "title": "Stacks And Queues In Data Structure | Data Structures And Algorithms Tutorial | Simplilearn",
          "channelTitle": "Simplilearn",
          "url": "https://www.youtube.com/watch?v=lno6Ft0tOZI",
          "duration": "15:00"
        },
        {
          "id": "v4",
          "videoId": "b_NjndniOqY",
          "title": "Learn Tree traversal in 3 minutes \ud83e\uddd7",
          "channelTitle": "Bro Code",
          "url": "https://www.youtube.com/watch?v=b_NjndniOqY",
          "duration": "15:00"
        },
        {
          "id": "v5",
          "videoId": "pcKY4hjDrxk",
          "title": "5.1 Graph Traversals - BFS & DFS -Breadth First Search and Depth First Search",
          "channelTitle": "Abdul Bari",
          "url": "https://www.youtube.com/watch?v=pcKY4hjDrxk",
          "duration": "15:00"
        }
      ],
      "subtopics": [
        {
          "name": "Linked Lists Core Principles",
          "simpleExplanation": "Core concepts for Linked Lists Core Principles",
          "keyConcepts": [
            "Core Concepts",
            "Mechanics",
            "Applications"
          ],
          "notes": "Essential notes for Linked Lists Core Principles",
          "video": {
            "title": "Introduction to Linked List",
            "channel": "Neso Academy",
            "youtubeUrl": "https://www.youtube.com/watch?v=R9PTBwOzceo"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the worst-case time complexity of inserting a node at the HEAD of a Singly Linked List?",
              "options": [
                "A. O(1)",
                "B. O(n)",
                "C. O(log n)",
                "D. O(n^2)"
              ],
              "correct": "A",
              "answer": "A. O(1)",
              "explanation": "Prepending at the head requires updating 1 pointer in O(1) time."
            },
            {
              "id": 2,
              "difficulty": "Basic",
              "question": "What is the worst-case time complexity of searching for a value in an unsorted Singly Linked List of size n?",
              "options": [
                "A. O(1)",
                "B. O(n)",
                "C. O(log n)",
                "D. O(n^2)"
              ],
              "correct": "B",
              "answer": "B. O(n)",
              "explanation": "Searching requires traversing from head node to target in O(n) time."
            },
            {
              "id": 3,
              "difficulty": "Intermediate",
              "question": "What does each node in a Doubly Linked List contain?",
              "options": [
                "A. Data payload, Next pointer, and Previous pointer",
                "B. Data and Next pointer only",
                "C. Data payload only",
                "D. Array index"
              ],
              "correct": "A",
              "answer": "A. Data payload, Next pointer, and Previous pointer",
              "explanation": "Doubly linked list nodes store data, next, and previous pointers."
            },
            {
              "id": 4,
              "difficulty": "Intermediate",
              "question": "In a Circular Linked List, what does the next pointer of the LAST node point to?",
              "options": [
                "A. NULL",
                "B. Head Node of the list",
                "C. Previous Node",
                "D. Garbage memory"
              ],
              "correct": "B",
              "answer": "B. Head Node of the list",
              "explanation": "Last node's next pointer references the head node."
            },
            {
              "id": 5,
              "difficulty": "Intermediate",
              "question": "Which algorithm detects cycles in a Linked List using slow and fast pointers?",
              "options": [
                "A. Floyd's Cycle-Finding Algorithm (Tortoise and Hare)",
                "B. Dijkstra's Algorithm",
                "C. Binary Search",
                "D. Kadane's Algorithm"
              ],
              "correct": "A",
              "answer": "A. Floyd's Cycle-Finding Algorithm (Tortoise and Hare)",
              "explanation": "Floyd's algorithm uses slow and fast pointers to detect cycles."
            },
            {
              "id": 6,
              "difficulty": "Basic",
              "question": "Compared to Arrays, what is a primary disadvantage of Linked Lists?",
              "options": [
                "A. Fixed size limit",
                "B. Extra memory overhead per node for pointer storage and no random indexing",
                "C. Slow head insertion",
                "D. Cannot hold objects"
              ],
              "correct": "B",
              "answer": "B. Extra memory overhead per node for pointer storage and no random indexing",
              "explanation": "Linked lists incur pointer overhead and lack O(1) random index access."
            },
            {
              "id": 7,
              "difficulty": "Advanced",
              "question": "Given a direct pointer to a target node in a Doubly Linked List, what is the time complexity to delete it?",
              "options": [
                "A. O(1)",
                "B. O(n)",
                "C. O(log n)",
                "D. O(n^2)"
              ],
              "correct": "A",
              "answer": "A. O(1)",
              "explanation": "With direct pointers to adjacent nodes, deletion takes O(1) time."
            },
            {
              "id": 8,
              "difficulty": "Intermediate",
              "question": "How can you find the Middle Node of a Linked List in a single pass?",
              "options": [
                "A. Fast pointer advances 2 steps while Slow pointer advances 1 step",
                "B. Count nodes twice",
                "C. Convert to array",
                "D. Use 3 pointers"
              ],
              "correct": "A",
              "answer": "A. Fast pointer advances 2 steps while Slow pointer advances 1 step",
              "explanation": "Fast and slow pointers locate the middle node in one traversal."
            },
            {
              "id": 9,
              "difficulty": "Advanced",
              "question": "What is the space complexity of iteratively reversing a Singly Linked List using 3 pointers (prev, curr, next)?",
              "options": [
                "A. O(1)",
                "B. O(n)",
                "C. O(log n)",
                "D. O(n^2)"
              ],
              "correct": "A",
              "answer": "A. O(1)",
              "explanation": "Iterative 3-pointer list reversal requires O(1) auxiliary space."
            },
            {
              "id": 10,
              "difficulty": "Basic",
              "question": "What value does the next pointer of the tail node store in a standard non-circular Singly Linked List?",
              "options": [
                "A. NULL / None",
                "B. Head node",
                "C. Tail node itself",
                "D. 0"
              ],
              "correct": "A",
              "answer": "A. NULL / None",
              "explanation": "Tail node's next pointer points to NULL."
            }
          ]
        },
        {
          "name": "Linked Lists Mechanics & Operations",
          "simpleExplanation": "Stage 2 learning milestone for Linked Lists.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 2 of Linked Lists.",
          "video": {
            "title": "Stacks And Queues In Data Structure | Data Structures And Algorithms Tutorial | Simplilearn",
            "channel": "Simplilearn",
            "youtubeUrl": "https://www.youtube.com/watch?v=lno6Ft0tOZI"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 2 of Linked Lists?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 2 covers key principles of Linked Lists."
            }
          ]
        },
        {
          "name": "Linked Lists Advanced Concepts & Applications",
          "simpleExplanation": "Stage 3 learning milestone for Linked Lists.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 3 of Linked Lists.",
          "video": {
            "title": "Learn Tree traversal in 3 minutes \ud83e\uddd7",
            "channel": "Bro Code",
            "youtubeUrl": "https://www.youtube.com/watch?v=b_NjndniOqY"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 3 of Linked Lists?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 3 covers key principles of Linked Lists."
            }
          ]
        },
        {
          "name": "Linked Lists Solved Exam Problems & Review",
          "simpleExplanation": "Stage 4 learning milestone for Linked Lists.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 4 of Linked Lists.",
          "video": {
            "title": "5.1 Graph Traversals - BFS & DFS -Breadth First Search and Depth First Search",
            "channel": "Abdul Bari",
            "youtubeUrl": "https://www.youtube.com/watch?v=pcKY4hjDrxk"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 4 of Linked Lists?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 4 covers key principles of Linked Lists."
            }
          ]
        }
      ]
    },
    {
      "id": "ds-stacks-queues",
      "name": "Stacks & Queues",
      "description": "LIFO vs FIFO principles, recursion stacks, circular queues, monotonic stacks.",
      "skillLevel": "Strong",
      "progressPct": 85,
      "gapLevel": "Low",
      "videos": [
        {
          "id": "v3",
          "videoId": "lno6Ft0tOZI",
          "title": "Stacks And Queues In Data Structure | Data Structures And Algorithms Tutorial | Simplilearn",
          "channelTitle": "Simplilearn",
          "url": "https://www.youtube.com/watch?v=lno6Ft0tOZI",
          "duration": "15:00"
        },
        {
          "id": "v4",
          "videoId": "b_NjndniOqY",
          "title": "Learn Tree traversal in 3 minutes \ud83e\uddd7",
          "channelTitle": "Bro Code",
          "url": "https://www.youtube.com/watch?v=b_NjndniOqY",
          "duration": "15:00"
        },
        {
          "id": "v5",
          "videoId": "pcKY4hjDrxk",
          "title": "5.1 Graph Traversals - BFS & DFS -Breadth First Search and Depth First Search",
          "channelTitle": "Abdul Bari",
          "url": "https://www.youtube.com/watch?v=pcKY4hjDrxk",
          "duration": "15:00"
        },
        {
          "id": "v6",
          "videoId": "NobHlGUjV3g",
          "title": "Introduction to linked list",
          "channelTitle": "mycodeschool",
          "url": "https://www.youtube.com/watch?v=NobHlGUjV3g",
          "duration": "15:00"
        }
      ],
      "subtopics": [
        {
          "name": "Stacks & Queues Core Principles",
          "simpleExplanation": "Core concepts for Stacks & Queues Core Principles",
          "keyConcepts": [
            "Core Concepts",
            "Mechanics",
            "Applications"
          ],
          "notes": "Essential notes for Stacks & Queues Core Principles",
          "video": {
            "title": "Stacks And Queues In Data Structure | Data Structures And Algorithms Tutorial | Simplilearn",
            "channel": "Simplilearn",
            "youtubeUrl": "https://www.youtube.com/watch?v=lno6Ft0tOZI"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "Which principle governs data insertion and removal in a Stack?",
              "options": [
                "A. FIFO (First-In, First-Out)",
                "B. LIFO (Last-In, First-Out)",
                "C. LILO",
                "D. Random Access"
              ],
              "correct": "B",
              "answer": "B. LIFO (Last-In, First-Out)",
              "explanation": "Stacks follow Last-In, First-Out order."
            },
            {
              "id": 2,
              "difficulty": "Basic",
              "question": "Which principle governs data insertion and removal in a standard Queue?",
              "options": [
                "A. FIFO (First-In, First-Out)",
                "B. LIFO (Last-In, First-Out)",
                "C. Priority Order only",
                "D. Stack Order"
              ],
              "correct": "A",
              "answer": "A. FIFO (First-In, First-Out)",
              "explanation": "Queues follow First-In, First-Out order."
            },
            {
              "id": 3,
              "difficulty": "Basic",
              "question": "What are the Time Complexities of Stack Push and Pop operations?",
              "options": [
                "A. Push O(1), Pop O(1)",
                "B. Push O(n), Pop O(1)",
                "C. Push O(log n), Pop O(n)",
                "D. O(n) both"
              ],
              "correct": "A",
              "answer": "A. Push O(1), Pop O(1)",
              "explanation": "Stack Push and Pop operations are O(1) constant time."
            },
            {
              "id": 4,
              "difficulty": "Intermediate",
              "question": "Which real-world application relies heavily on a Stack data structure?",
              "options": [
                "A. CPU Task Scheduling",
                "B. Function call stack recursion and Undo/Redo mechanisms",
                "C. Print Spooler Queue",
                "D. BFS Graph Traversal"
              ],
              "correct": "B",
              "answer": "B. Function call stack recursion and Undo/Redo mechanisms",
              "explanation": "Call stack recursion and Undo history use Stacks."
            },
            {
              "id": 5,
              "difficulty": "Intermediate",
              "question": "Which graph traversal algorithm uses a Queue data structure to explore nodes level-by-level?",
              "options": [
                "A. Depth-First Search (DFS)",
                "B. Breadth-First Search (BFS)",
                "C. Dijkstra's Algorithm",
                "D. Prim's Algorithm"
              ],
              "correct": "B",
              "answer": "B. Breadth-First Search (BFS)",
              "explanation": "BFS uses a Queue to process nodes level-by-level."
            },
            {
              "id": 6,
              "difficulty": "Basic",
              "question": "What condition indicates Stack Overflow?",
              "options": [
                "A. Attempting to push an element into a completely full stack",
                "B. Attempting to pop from empty stack",
                "C. Stack size is 1",
                "D. Memory leak"
              ],
              "correct": "A",
              "answer": "A. Attempting to push an element into a completely full stack",
              "explanation": "Pushing onto a full stack triggers Stack Overflow."
            },
            {
              "id": 7,
              "difficulty": "Intermediate",
              "question": "What problem in linear array-based queues does a Circular Queue solve?",
              "options": [
                "A. Reuses vacated front slots after dequeue operations to prevent false overflow",
                "B. Eliminates queue size",
                "C. Reverses elements",
                "D. Sorts queue"
              ],
              "correct": "A",
              "answer": "A. Reuses vacated front slots after dequeue operations to prevent false overflow",
              "explanation": "Circular queues recycle dequeued array slots."
            },
            {
              "id": 8,
              "difficulty": "Advanced",
              "question": "What underlying tree heap data structure is commonly used to implement a Priority Queue?",
              "options": [
                "A. Binary Search Tree",
                "B. Binary Heap (Min-Heap / Max-Heap)",
                "C. AVL Tree",
                "D. B-Tree"
              ],
              "correct": "B",
              "answer": "B. Binary Heap (Min-Heap / Max-Heap)",
              "explanation": "Priority queues are typically implemented with Binary Heaps."
            },
            {
              "id": 9,
              "difficulty": "Intermediate",
              "question": "In Infix to Postfix expression conversion, what is the Stack used for?",
              "options": [
                "A. Store operands",
                "B. Hold operators to manage operator precedence and parentheses",
                "C. Store evaluation results",
                "D. Count variables"
              ],
              "correct": "B",
              "answer": "B. Hold operators to manage operator precedence and parentheses",
              "explanation": "Operator stacks defer evaluation according to precedence."
            },
            {
              "id": 10,
              "difficulty": "Advanced",
              "question": "What data structure maintains elements in strictly monotonic increasing/decreasing order to find Next Greater Elements?",
              "options": [
                "A. Monotonic Stack",
                "B. Circular Queue",
                "C. Deque",
                "D. Priority Queue"
              ],
              "correct": "A",
              "answer": "A. Monotonic Stack",
              "explanation": "Monotonic stacks maintain sorted element orders to answer range queries."
            }
          ]
        },
        {
          "name": "Stacks & Queues Mechanics & Operations",
          "simpleExplanation": "Stage 2 learning milestone for Stacks & Queues.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 2 of Stacks & Queues.",
          "video": {
            "title": "Learn Tree traversal in 3 minutes \ud83e\uddd7",
            "channel": "Bro Code",
            "youtubeUrl": "https://www.youtube.com/watch?v=b_NjndniOqY"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 2 of Stacks & Queues?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 2 covers key principles of Stacks & Queues."
            }
          ]
        },
        {
          "name": "Stacks & Queues Advanced Concepts & Applications",
          "simpleExplanation": "Stage 3 learning milestone for Stacks & Queues.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 3 of Stacks & Queues.",
          "video": {
            "title": "5.1 Graph Traversals - BFS & DFS -Breadth First Search and Depth First Search",
            "channel": "Abdul Bari",
            "youtubeUrl": "https://www.youtube.com/watch?v=pcKY4hjDrxk"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 3 of Stacks & Queues?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 3 covers key principles of Stacks & Queues."
            }
          ]
        },
        {
          "name": "Stacks & Queues Solved Exam Problems & Review",
          "simpleExplanation": "Stage 4 learning milestone for Stacks & Queues.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 4 of Stacks & Queues.",
          "video": {
            "title": "Introduction to linked list",
            "channel": "mycodeschool",
            "youtubeUrl": "https://www.youtube.com/watch?v=NobHlGUjV3g"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 4 of Stacks & Queues?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 4 covers key principles of Stacks & Queues."
            }
          ]
        }
      ]
    },
    {
      "id": "ds-trees",
      "name": "Trees & Traversals",
      "description": "Inorder/Preorder/Postorder traversals, BST properties, AVL balance.",
      "skillLevel": "Weak",
      "progressPct": 35,
      "gapLevel": "High",
      "videos": [
        {
          "id": "v4",
          "videoId": "b_NjndniOqY",
          "title": "Learn Tree traversal in 3 minutes \ud83e\uddd7",
          "channelTitle": "Bro Code",
          "url": "https://www.youtube.com/watch?v=b_NjndniOqY",
          "duration": "15:00"
        },
        {
          "id": "v5",
          "videoId": "pcKY4hjDrxk",
          "title": "5.1 Graph Traversals - BFS & DFS -Breadth First Search and Depth First Search",
          "channelTitle": "Abdul Bari",
          "url": "https://www.youtube.com/watch?v=pcKY4hjDrxk",
          "duration": "15:00"
        },
        {
          "id": "v6",
          "videoId": "NobHlGUjV3g",
          "title": "Introduction to linked list",
          "channelTitle": "mycodeschool",
          "url": "https://www.youtube.com/watch?v=NobHlGUjV3g",
          "duration": "15:00"
        },
        {
          "id": "v7",
          "videoId": "86g8jAQug04",
          "title": "Binary tree: Level Order Traversal",
          "channelTitle": "mycodeschool",
          "url": "https://www.youtube.com/watch?v=86g8jAQug04",
          "duration": "15:00"
        }
      ],
      "subtopics": [
        {
          "name": "Trees & Traversals Core Principles",
          "simpleExplanation": "Core concepts for Trees & Traversals Core Principles",
          "keyConcepts": [
            "Core Concepts",
            "Mechanics",
            "Applications"
          ],
          "notes": "Essential notes for Trees & Traversals Core Principles",
          "video": {
            "title": "Learn Tree traversal in 3 minutes \ud83e\uddd7",
            "channel": "Bro Code",
            "youtubeUrl": "https://www.youtube.com/watch?v=b_NjndniOqY"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "Which binary tree traversal visits the root node LAST (Left, Right, Root)?",
              "options": [
                "A. Preorder",
                "B. Inorder",
                "C. Postorder",
                "D. Level-Order"
              ],
              "correct": "C",
              "answer": "C. Postorder",
              "explanation": "Postorder traversal visits Left, Right, then Root."
            },
            {
              "id": 2,
              "difficulty": "Basic",
              "question": "Which binary tree traversal visits nodes in sorted order for a Binary Search Tree (BST)?",
              "options": [
                "A. Preorder",
                "B. Inorder (Left, Root, Right)",
                "C. Postorder",
                "D. Level-Order"
              ],
              "correct": "B",
              "answer": "B. Inorder (Left, Root, Right)",
              "explanation": "Inorder traversal of a BST yields sorted keys."
            },
            {
              "id": 3,
              "difficulty": "Basic",
              "question": "What fundamental property defines a Binary Search Tree (BST)?",
              "options": [
                "A. All left subtree keys < Root key < All right subtree keys",
                "B. All nodes have 2 children",
                "C. Height is 1",
                "D. Root is maximum key"
              ],
              "correct": "A",
              "answer": "A. All left subtree keys < Root key < All right subtree keys",
              "explanation": "BST property dictates left < root < right for all nodes."
            },
            {
              "id": 4,
              "difficulty": "Intermediate",
              "question": "What is the worst-case search time complexity in an un-balanced skewed BST of n nodes?",
              "options": [
                "A. O(1)",
                "B. O(log n)",
                "C. O(n)",
                "D. O(n^2)"
              ],
              "correct": "C",
              "answer": "C. O(n)",
              "explanation": "Skewed BSTs degrade to linked lists with O(n) search time."
            },
            {
              "id": 5,
              "difficulty": "Intermediate",
              "question": "What is the maximum height difference (Balance Factor) permitted between left and right subtrees in an AVL Tree?",
              "options": [
                "A. 0",
                "B. 1",
                "C. 2",
                "D. Unlimited"
              ],
              "correct": "B",
              "answer": "B. 1",
              "explanation": "AVL tree balance factor magnitude cannot exceed 1."
            },
            {
              "id": 6,
              "difficulty": "Intermediate",
              "question": "Which traversal order visits Root first, followed by Left subtree, then Right subtree?",
              "options": [
                "A. Preorder",
                "B. Inorder",
                "C. Postorder",
                "D. Level-order"
              ],
              "correct": "A",
              "answer": "A. Preorder",
              "explanation": "Preorder visits Root, Left, then Right."
            },
            {
              "id": 7,
              "difficulty": "Advanced",
              "question": "What defines a Complete Binary Tree?",
              "options": [
                "A. Every node has 2 children",
                "B. All levels are completely filled except possibly the last level, which is filled from left to right",
                "C. All leaf nodes are at height 0",
                "D. Tree is infinite"
              ],
              "correct": "B",
              "answer": "B. All levels are completely filled except possibly the last level, which is filled from left to right",
              "explanation": "Complete binary trees fill levels left-to-right."
            },
            {
              "id": 8,
              "difficulty": "Basic",
              "question": "What queue-based traversal visits binary tree nodes level by level from top to bottom?",
              "options": [
                "A. Level-Order Traversal (BFS)",
                "B. Preorder",
                "C. Inorder",
                "D. Postorder"
              ],
              "correct": "A",
              "answer": "A. Level-Order Traversal (BFS)",
              "explanation": "Level-order traversal uses a Queue to process nodes level by level."
            },
            {
              "id": 9,
              "difficulty": "Advanced",
              "question": "What is the average search time complexity in a Height-Balanced BST with n nodes?",
              "options": [
                "A. O(1)",
                "B. O(log n)",
                "C. O(n)",
                "D. O(n log n)"
              ],
              "correct": "B",
              "answer": "B. O(log n)",
              "explanation": "Balanced BSTs guarantee O(log n) search time."
            },
            {
              "id": 10,
              "difficulty": "Intermediate",
              "question": "What is the height of a tree with a single root node?",
              "options": [
                "A. 0",
                "B. 1",
                "C. 2",
                "D. -1"
              ],
              "correct": "A",
              "answer": "A. 0",
              "explanation": "Single node tree height is 0."
            }
          ]
        },
        {
          "name": "Trees & Traversals Mechanics & Operations",
          "simpleExplanation": "Stage 2 learning milestone for Trees & Traversals.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 2 of Trees & Traversals.",
          "video": {
            "title": "5.1 Graph Traversals - BFS & DFS -Breadth First Search and Depth First Search",
            "channel": "Abdul Bari",
            "youtubeUrl": "https://www.youtube.com/watch?v=pcKY4hjDrxk"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 2 of Trees & Traversals?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 2 covers key principles of Trees & Traversals."
            }
          ]
        },
        {
          "name": "Trees & Traversals Advanced Concepts & Applications",
          "simpleExplanation": "Stage 3 learning milestone for Trees & Traversals.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 3 of Trees & Traversals.",
          "video": {
            "title": "Introduction to linked list",
            "channel": "mycodeschool",
            "youtubeUrl": "https://www.youtube.com/watch?v=NobHlGUjV3g"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 3 of Trees & Traversals?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 3 covers key principles of Trees & Traversals."
            }
          ]
        },
        {
          "name": "Trees & Traversals Solved Exam Problems & Review",
          "simpleExplanation": "Stage 4 learning milestone for Trees & Traversals.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 4 of Trees & Traversals.",
          "video": {
            "title": "Binary tree: Level Order Traversal",
            "channel": "mycodeschool",
            "youtubeUrl": "https://www.youtube.com/watch?v=86g8jAQug04"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 4 of Trees & Traversals?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 4 covers key principles of Trees & Traversals."
            }
          ]
        }
      ]
    },
    {
      "id": "ds-graphs",
      "name": "Graphs & BFS/DFS",
      "description": "Adjacency lists, BFS level order, DFS recursion, Dijkstra, Kruskal.",
      "skillLevel": "Critically Weak",
      "progressPct": 25,
      "gapLevel": "Critical",
      "videos": [
        {
          "id": "v5",
          "videoId": "pcKY4hjDrxk",
          "title": "5.1 Graph Traversals - BFS & DFS -Breadth First Search and Depth First Search",
          "channelTitle": "Abdul Bari",
          "url": "https://www.youtube.com/watch?v=pcKY4hjDrxk",
          "duration": "15:00"
        },
        {
          "id": "v6",
          "videoId": "NobHlGUjV3g",
          "title": "Introduction to linked list",
          "channelTitle": "mycodeschool",
          "url": "https://www.youtube.com/watch?v=NobHlGUjV3g",
          "duration": "15:00"
        },
        {
          "id": "v7",
          "videoId": "86g8jAQug04",
          "title": "Binary tree: Level Order Traversal",
          "channelTitle": "mycodeschool",
          "url": "https://www.youtube.com/watch?v=86g8jAQug04",
          "duration": "15:00"
        },
        {
          "id": "v8",
          "videoId": "DBRW8nwZV-g",
          "title": "Graph Data Structure Intro (inc. adjacency list, adjacency matrix, incidence matrix)",
          "channelTitle": "freeCodeCamp.org",
          "url": "https://www.youtube.com/watch?v=DBRW8nwZV-g",
          "duration": "15:00"
        }
      ],
      "subtopics": [
        {
          "name": "Graphs & BFS/DFS Core Principles",
          "simpleExplanation": "Core concepts for Graphs & BFS/DFS Core Principles",
          "keyConcepts": [
            "Core Concepts",
            "Mechanics",
            "Applications"
          ],
          "notes": "Essential notes for Graphs & BFS/DFS Core Principles",
          "video": {
            "title": "5.1 Graph Traversals - BFS & DFS -Breadth First Search and Depth First Search",
            "channel": "Abdul Bari",
            "youtubeUrl": "https://www.youtube.com/watch?v=pcKY4hjDrxk"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the Time Complexity of BFS or DFS using an Adjacency List representation?",
              "options": [
                "A. O(V + E)",
                "B. O(V\u00b2)",
                "C. O(E\u00b2)",
                "D. O(V log E)"
              ],
              "correct": "A",
              "answer": "A. O(V + E)",
              "explanation": "Adjacency list traversal takes O(V + E) time."
            },
            {
              "id": 2,
              "difficulty": "Basic",
              "question": "Why is a `visited` boolean array necessary in graph traversals?",
              "options": [
                "A. Speeds up sorting",
                "B. Prevents infinite looping in cyclic graphs",
                "C. Calculates edge weights",
                "D. Saves stack memory"
              ],
              "correct": "B",
              "answer": "B. Prevents infinite looping in cyclic graphs",
              "explanation": "Visited flags prevent endless cycling in graph loops."
            },
            {
              "id": 3,
              "difficulty": "Intermediate",
              "question": "Can standard BFS find the shortest path in a weighted graph with positive edge weights?",
              "options": [
                "A. Yes, always",
                "B. No, Dijkstra's Algorithm must be used for positive weighted graphs",
                "C. Yes, if un-directed",
                "D. Only if acyclic"
              ],
              "correct": "B",
              "answer": "B. No, Dijkstra's Algorithm must be used for positive weighted graphs",
              "explanation": "BFS finds shortest paths only in unweighted graphs; Dijkstra handles weighted."
            },
            {
              "id": 4,
              "difficulty": "Intermediate",
              "question": "What graph property is required to perform Topological Sorting?",
              "options": [
                "A. Directed Acyclic Graph (DAG)",
                "B. Undirected Graph",
                "C. Bipartite Graph",
                "D. Complete Graph"
              ],
              "correct": "A",
              "answer": "A. Directed Acyclic Graph (DAG)",
              "explanation": "Topological sorting requires a Directed Acyclic Graph (DAG)."
            },
            {
              "id": 5,
              "difficulty": "Intermediate",
              "question": "Which algorithm finds single-source shortest paths in graphs with NON-NEGATIVE edge weights?",
              "options": [
                "A. Bellman-Ford",
                "B. Dijkstra's Algorithm",
                "C. Floyd-Warshall",
                "D. Prim's Algorithm"
              ],
              "correct": "B",
              "answer": "B. Dijkstra's Algorithm",
              "explanation": "Dijkstra's algorithm finds shortest paths for non-negative weights."
            },
            {
              "id": 6,
              "difficulty": "Basic",
              "question": "Which algorithm finds Minimum Spanning Trees (MST) by selecting minimum weight edges that do not form cycles using Disjoint Set Union (DSU)?",
              "options": [
                "A. Kruskal's Algorithm",
                "B. Prim's Algorithm",
                "C. Dijkstra's Algorithm",
                "D. BFS"
              ],
              "correct": "A",
              "answer": "A. Kruskal's Algorithm",
              "explanation": "Kruskal's algorithm builds MST by sorting edges and avoiding cycles."
            },
            {
              "id": 7,
              "difficulty": "Advanced",
              "question": "What is the time complexity of BFS using an Adjacency Matrix representation?",
              "options": [
                "A. O(V + E)",
                "B. O(V^2)",
                "C. O(E)",
                "D. O(V log V)"
              ],
              "correct": "B",
              "answer": "B. O(V^2)",
              "explanation": "Adjacency matrix traversal checks V entries per vertex, taking O(V^2)."
            },
            {
              "id": 8,
              "difficulty": "Intermediate",
              "question": "Which algorithm finds Minimum Spanning Trees by growing a connected tree component one vertex at a time?",
              "options": [
                "A. Prim's Algorithm",
                "B. Kruskal's Algorithm",
                "C. Kahn's Algorithm",
                "D. Bellman-Ford"
              ],
              "correct": "A",
              "answer": "A. Prim's Algorithm",
              "explanation": "Prim's algorithm grows an MST vertex-by-vertex."
            },
            {
              "id": 9,
              "difficulty": "Advanced",
              "question": "Which graph algorithm can handle graphs containing NEGATIVE edge weights?",
              "options": [
                "A. Dijkstra's Algorithm",
                "B. Bellman-Ford Algorithm",
                "C. BFS",
                "D. Prim's Algorithm"
              ],
              "correct": "B",
              "answer": "B. Bellman-Ford Algorithm",
              "explanation": "Bellman-Ford supports negative edge weights and detects negative cycles."
            },
            {
              "id": 10,
              "difficulty": "Basic",
              "question": "What data structure does Depth-First Search (DFS) use for tracking traversal state?",
              "options": [
                "A. Queue",
                "B. Call Stack / Recursion",
                "C. Min Heap",
                "D. Hash Table"
              ],
              "correct": "B",
              "answer": "B. Call Stack / Recursion",
              "explanation": "DFS utilizes a Stack or recursive call stack."
            }
          ]
        },
        {
          "name": "Graphs & BFS/DFS Mechanics & Operations",
          "simpleExplanation": "Stage 2 learning milestone for Graphs & BFS/DFS.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 2 of Graphs & BFS/DFS.",
          "video": {
            "title": "Introduction to linked list",
            "channel": "mycodeschool",
            "youtubeUrl": "https://www.youtube.com/watch?v=NobHlGUjV3g"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 2 of Graphs & BFS/DFS?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 2 covers key principles of Graphs & BFS/DFS."
            }
          ]
        },
        {
          "name": "Graphs & BFS/DFS Advanced Concepts & Applications",
          "simpleExplanation": "Stage 3 learning milestone for Graphs & BFS/DFS.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 3 of Graphs & BFS/DFS.",
          "video": {
            "title": "Binary tree: Level Order Traversal",
            "channel": "mycodeschool",
            "youtubeUrl": "https://www.youtube.com/watch?v=86g8jAQug04"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 3 of Graphs & BFS/DFS?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 3 covers key principles of Graphs & BFS/DFS."
            }
          ]
        },
        {
          "name": "Graphs & BFS/DFS Solved Exam Problems & Review",
          "simpleExplanation": "Stage 4 learning milestone for Graphs & BFS/DFS.",
          "keyConcepts": [
            "Core Principles",
            "Operations",
            "Applications"
          ],
          "notes": "Quick reference notes for Stage 4 of Graphs & BFS/DFS.",
          "video": {
            "title": "Graph Data Structure Intro (inc. adjacency list, adjacency matrix, incidence matrix)",
            "channel": "freeCodeCamp.org",
            "youtubeUrl": "https://www.youtube.com/watch?v=DBRW8nwZV-g"
          },
          "practiceQuestions": [
            {
              "id": 1,
              "difficulty": "Basic",
              "question": "What is the primary concept covered in Stage 4 of Graphs & BFS/DFS?",
              "options": [
                "A. Core Operations",
                "B. Advanced Applications",
                "C. Fundamental Mechanics",
                "D. All of the above"
              ],
              "correct": "D",
              "answer": "D. All of the above",
              "explanation": "Stage 4 covers key principles of Graphs & BFS/DFS."
            }
          ]
        }
      ]
    }
  ]
};


export default function TopicGapMap() {
  const { currentUser } = useUser();
  const [selectedSubjectObj, setSelectedSubjectObj] = useState(SUBJECT_LIST[0]);
  const [topicsList, setTopicsList] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [hierarchyData, setHierarchyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [subtopicVideo, setSubtopicVideo] = useState(null);
  const [subtopicQuestions, setSubtopicQuestions] = useState([]);
  const [activeSubtopic, setActiveSubtopic] = useState(null);
  const [showAnswerIdx, setShowAnswerIdx] = useState({});
  const [videoLoading, setVideoLoading] = useState(false);

  // Active Video Player state for the right-side Topic Video Hub (Minimum 4 Videos)
  const [activeTopicVideo, setActiveTopicVideo] = useState(null);

  // Load subject-specific topics whenever subject selection changes
  useEffect(() => {
    fetchSubjectTopics(selectedSubjectObj.id);
  }, [selectedSubjectObj]);

  const fetchSubjectTopics = async (subjectId) => {
    setLoading(true);
    setHierarchyData(null);
    setSelectedTopic(null);

    // Guaranteed subject-bound topics from client-side registry
    const registryTopics = SUBJECT_TOPIC_REGISTRY[subjectId] || SUBJECT_TOPIC_REGISTRY["dbms"];
    let loadedTopics = registryTopics;

    try {
      // Fetch from API, fallback to registry
      const data = await api.getTopicGaps(subjectId);
      if (data && data.length >= 5) {
        loadedTopics = data;
      }
    } catch (err) {
      console.warn("API fallback to registry topics:", err.message);
    }

    // Dynamic Calibration based on Diagnostic Test taken by user
    const userDiagnostic = getSubjectDiagnosticData(selectedSubjectObj.name);

    if (userDiagnostic) {
      loadedTopics = loadedTopics.map((t) => {
        const matched = userDiagnostic.find(
          (d) => d.topic && (
            d.topic.toLowerCase().includes(t.name.toLowerCase()) ||
            t.name.toLowerCase().includes(d.topic.toLowerCase()) ||
            (d.topic.toLowerCase().includes("relational") && t.name.toLowerCase().includes("relational")) ||
            (d.topic.toLowerCase().includes("normalization") && t.name.toLowerCase().includes("normalization")) ||
            (d.topic.toLowerCase().includes("transaction") && t.name.toLowerCase().includes("transaction")) ||
            (d.topic.toLowerCase().includes("index") && t.name.toLowerCase().includes("index")) ||
            (d.topic.toLowerCase().includes("sql") && t.name.toLowerCase().includes("sql")) ||
            (d.topic.toLowerCase().includes("er") && t.name.toLowerCase().includes("er"))
          )
        );
        if (matched) {
          const acc = matched.accuracy;
          const { skillLevel, gapLevel } = calculateSkillLevel(acc);
          return {
            ...t,
            progressPct: acc,
            accuracy: acc,
            skillLevel,
            gapLevel
          };
        }
        return t;
      });
    }

    setTopicsList(loadedTopics);
    const initialTopic = loadedTopics[0];
    setSelectedTopic(initialTopic);
    
    // Set initial active video from topic's 4+ videos
    if (initialTopic) {
      const vList = getTopicVideos(initialTopic);
      setActiveTopicVideo(vList[0] || null);
    }
    setLoading(false);
  };

  // Helper to extract at least 4 videos for a selected topic
  const getTopicVideos = (topic) => {
    if (!topic) return [];
    if (topic.videos && topic.videos.length >= 4) {
      return topic.videos;
    }
    // Fallback: derive 4 videos from subtopic videos or topic title
    const subVids = (topic.subtopics || []).map((st, idx) => ({
      id: `v_${idx}`,
      videoId: extractYoutubeId(st.video?.youtubeUrl || st.video?.url) || "9yeOJ0ZMUYw",
      title: st.video?.title || `${topic.name}: ${st.name}`,
      channelTitle: st.video?.channel || "Verified YouTube Educational Channel",
      url: st.video?.youtubeUrl || st.video?.url || "https://www.youtube.com/watch?v=9yeOJ0ZMUYw",
      duration: "15:00"
    }));

    if (subVids.length >= 4) return subVids;

    // Expand to 4 videos minimum if fewer exist
    const defaultIds = [
      { id: "v1", videoId: "9yeOJ0ZMUYw", title: `${topic.name} Complete Fundamentals`, channelTitle: "Gate Smashers", url: "https://www.youtube.com/watch?v=9yeOJ0ZMUYw", duration: "18:20" },
      { id: "v2", videoId: "L-Vn8b792eI", title: `${topic.name} In-Depth Explanation & Examples`, channelTitle: "Neso Academy", url: "https://www.youtube.com/watch?v=L-Vn8b792eI", duration: "22:15" },
      { id: "v3", videoId: "o_U841zK118", title: `${topic.name} Advanced Operations & Querying`, channelTitle: "Knowledge Gate", url: "https://www.youtube.com/watch?v=o_U841zK118", duration: "16:40" },
      { id: "v4", videoId: "QpdhBUYk7Kk", title: `${topic.name} Solved Exam Problems & Q&A`, channelTitle: "Abdul Bari", url: "https://www.youtube.com/watch?v=QpdhBUYk7Kk", duration: "25:00" }
    ];

    const result = [...subVids];
    for (let i = result.length; i < 4; i++) {
      result.push(defaultIds[i % defaultIds.length]);
    }
    return result;
  };

  // Build hierarchy and update active video when selected topic changes
  useEffect(() => {
    if (!selectedTopic) return;
    setLoading(true);
    setHierarchyData(null);

    // Set first video of newly selected topic as active player video
    const topicVids = getTopicVideos(selectedTopic);
    setActiveTopicVideo(topicVids[0] || null);

    api.getTopicHierarchy(selectedSubjectObj.name, selectedTopic.name)
      .then((res) => {
        if (res && res.hierarchy && res.hierarchy.length >= 4) {
          const enrichedHierarchy = res.hierarchy.slice(0, 4).map((stage, stageIdx) => ({
            ...stage,
            subtopics: (stage.subtopics || []).slice(0, 1).map((sub) => {
              const matchedLocalSub = selectedTopic.subtopics?.find(
                (ls) => ls.name.toLowerCase().includes(sub.name.toLowerCase()) || sub.name.toLowerCase().includes(ls.name.toLowerCase())
              );
              const videoObj = sub.video || matchedLocalSub?.video || selectedTopic.subtopics?.[stageIdx]?.video || (selectedTopic.videos?.[stageIdx] ? {
                title: selectedTopic.videos[stageIdx].title,
                channel: selectedTopic.videos[stageIdx].channelTitle,
                youtubeUrl: selectedTopic.videos[stageIdx].url
              } : {
                title: `${selectedSubjectObj.name}: ${sub.name} Tutorial`,
                channel: "Verified Educational Channel",
                youtubeUrl: selectedTopic.videos?.[0]?.url || "https://www.youtube.com/watch?v=9yeOJ0ZMUYw"
              });
              return { ...sub, video: videoObj };
            })
          }));
          setHierarchyData({ ...res, hierarchy: enrichedHierarchy });
        } else {
          buildFallbackHierarchy(selectedTopic);
        }
        setLoading(false);
      })
      .catch(() => {
        buildFallbackHierarchy(selectedTopic);
        setLoading(false);
      });
  }, [selectedTopic, selectedSubjectObj]);

  const buildFallbackHierarchy = (topic) => {
    const subtopics = topic.subtopics || [];
    const stagesList = [];
    const stageTitles = [
      `${topic.name} Core Principles & Foundations`,
      `${topic.name} Intermediate Mechanics & Methods`,
      `${topic.name} Advanced Operations & Applications`,
      `${topic.name} Solved Exam Problems & Review`
    ];

    for (let sIdx = 0; sIdx < 4; sIdx++) {
      let sub = subtopics[sIdx];
      if (!sub) {
        const vObj = topic.videos?.[sIdx] || topic.videos?.[0] || {
          url: "https://www.youtube.com/watch?v=9yeOJ0ZMUYw",
          title: `${topic.name} Video Lesson ${sIdx + 1}`,
          channelTitle: "Verified Educational Channel"
        };
        sub = {
          name: stageTitles[sIdx],
          simpleExplanation: `Learning milestone Stage ${sIdx + 1} focusing on ${stageTitles[sIdx]} in ${selectedSubjectObj.name}.`,
          keyConcepts: ["Core Principles", "Operations", "Applications"],
          notes: `Essential concepts for Stage ${sIdx + 1} of ${topic.name}.`,
          video: {
            title: vObj.title || `${topic.name} Stage ${sIdx + 1} Tutorial`,
            channel: vObj.channelTitle || vObj.channel || "Educational Channel",
            youtubeUrl: vObj.url || `https://www.youtube.com/watch?v=${vObj.videoId || "9yeOJ0ZMUYw"}`
          },
          practiceQuestions: []
        };
      } else {
        const vObj = sub.video || (topic.videos?.[sIdx] ? {
          title: topic.videos[sIdx].title,
          channel: topic.videos[sIdx].channelTitle,
          youtubeUrl: topic.videos[sIdx].url
        } : {
          title: `${selectedSubjectObj.name}: ${sub.name} Tutorial`,
          channel: "Verified Educational Channel",
          youtubeUrl: topic.videos?.[0]?.url || "https://www.youtube.com/watch?v=9yeOJ0ZMUYw"
        });
        sub = {
          ...sub,
          video: typeof vObj === "string" ? { title: `${sub.name} Tutorial`, channel: "Educational Channel", youtubeUrl: vObj } : vObj
        };
      }

      stagesList.push({
        category: `Stage ${sIdx + 1}: ${sub.name}`,
        description: sub.simpleExplanation || `Stage ${sIdx + 1} learning milestone for ${topic.name}`,
        subtopics: [sub]
      });
    }

    setHierarchyData({
      subject: selectedSubjectObj.name,
      topic: topic.name,
      overview: topic.shortDescription || topic.description || `Core syllabus topic for ${selectedSubjectObj.name}.`,
      hierarchy: stagesList
    });
  };

  const handleSubjectChange = (subjectObj) => {
    setSelectedSubjectObj(subjectObj);
  };

  const toggleAnswer = (qIdx) => {
    setShowAnswerIdx((prev) => ({
      ...prev,
      [qIdx]: !prev[qIdx]
    }));
  };

  const openSubtopicModal = async (subtopic) => {
    setActiveSubtopic(subtopic);
    setShowAnswerIdx({});
    setSubtopicVideo(null);
    setSubtopicQuestions([]);
    setVideoLoading(true);

    const matchedLocalSub = selectedTopic?.subtopics?.find(
      (ls) => ls.name.toLowerCase().includes(subtopic.name.toLowerCase()) || subtopic.name.toLowerCase().includes(ls.name.toLowerCase())
    );

    const directVideoUrl =
      subtopic.video?.youtubeUrl ||
      subtopic.video?.url ||
      matchedLocalSub?.video?.youtubeUrl ||
      selectedTopic?.videos?.[0]?.url ||
      selectedTopic?.subtopics?.[0]?.video?.youtubeUrl ||
      "https://www.youtube.com/watch?v=9yeOJ0ZMUYw";

    const vId = extractYoutubeId(directVideoUrl) || "9yeOJ0ZMUYw";

    const defaultVideoInfo = {
      videoId: vId,
      title: subtopic.video?.title || matchedLocalSub?.video?.title || `${selectedSubjectObj.name}: ${subtopic.name} Tutorial`,
      channelTitle: subtopic.video?.channel || matchedLocalSub?.video?.channel || "Verified YouTube Educational Channel",
      url: directVideoUrl
    };

    setSubtopicVideo(defaultVideoInfo);

    try {
      const ytRes = await api.searchYoutube(selectedSubjectObj.name, selectedTopic.name, subtopic.name);
      if (ytRes && ytRes.videos && ytRes.videos.length > 0 && ytRes.videos[0].url) {
        setSubtopicVideo(ytRes.videos[0]);
      }
      const questionsRes = await api.getPracticeQuestions(selectedSubjectObj.name, selectedTopic.name, subtopic.name);
      if (questionsRes && questionsRes.length > 0) {
        setSubtopicQuestions(questionsRes);
      } else if (subtopic.practiceQuestions && subtopic.practiceQuestions.length > 0) {
        setSubtopicQuestions(subtopic.practiceQuestions);
      } else if (matchedLocalSub?.practiceQuestions?.length > 0) {
        setSubtopicQuestions(matchedLocalSub.practiceQuestions);
      }
    } catch (err) {
      console.warn("Fallback to local subtopic details:", err.message);
      if (subtopic.practiceQuestions) {
        setSubtopicQuestions(subtopic.practiceQuestions);
      }
    } finally {
      setVideoLoading(false);
    }
  };

  const getBadgeColor = (level) => {
    switch (level?.toLowerCase()) {
      case "strong":
        return "text-emerald-700 bg-emerald-50 border-emerald-200 font-medium";
      case "medium":
        return "text-amber-800 bg-amber-50 border-amber-300 font-medium ring-1 ring-amber-300/40";
      case "weak":
        return "text-red-700 bg-red-50 border-red-200 font-bold";
      case "critically weak":
      case "critical":
      case "critical gap":
        return "text-red-800 bg-red-100 border-red-300 font-bold";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200 font-medium";
    }
  };

  const getDot = (level) => {
    switch (level?.toLowerCase()) {
      case "strong":
        return "🟢";
      case "medium":
        return "🟡";
      case "weak":
        return "🔴";
      case "critically weak":
      case "critical":
      case "critical gap":
        return "🔴";
      default:
        return "⚪";
    }
  };

  const topicVideosList = getTopicVideos(selectedTopic);
  const currentActiveVideo = activeTopicVideo || topicVideosList[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-[#1264E8] rounded uppercase tracking-wider">
              Diagnostic Syllabus Gap Map
            </span>
            <span className="text-[11px] font-semibold text-gray-500">
              Department of CSE • {selectedSubjectObj.name}
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mt-1">
            Topic Gap Map & Learning Hierarchy
          </h2>
          <p className="text-xs text-gray-500">
            Personalized syllabus roadmap for <strong className="text-gray-900">{currentUser?.name}</strong>. Strictly filtered by <strong className="text-[#1264E8]">{selectedSubjectObj.name}</strong>.
          </p>
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
                onClick={() => handleSubjectChange(subj)}
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

      {/* Main Two-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Syllabus Topics */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider px-1 pb-1 border-b border-gray-100">
            <span>Syllabus Topics ({topicsList.length})</span>
            <span>Skill Level</span>
          </div>

          <div className="space-y-2">
            {topicsList.map((t) => {
              const isSelected = selectedTopic?.id === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTopic(t)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-2.5 ${
                    isSelected
                      ? "border-[#1264E8] bg-blue-50/70 shadow-xs ring-2 ring-[#1264E8]/20"
                      : "border-gray-200/80 hover:bg-gray-50 text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base flex-shrink-0">{getDot(t.skillLevel)}</span>
                    <div className="truncate">
                      <h4 className="text-sm font-bold text-gray-900 truncate">
                        {t.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 truncate max-w-[170px]">
                        {t.shortDescription || t.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full border ${getBadgeColor(t.skillLevel)}`}>
                      {t.skillLevel}
                    </span>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? "text-[#1264E8]" : "text-gray-400"}`} />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-gray-100 text-[11px] text-gray-500 flex items-center gap-2 px-1 flex-wrap">
            <span className="flex items-center gap-1"><span className="text-emerald-500 font-bold">●</span> Strong</span>
            <span className="flex items-center gap-1"><span className="text-amber-500 font-bold">●</span> Medium</span>
            <span className="flex items-center gap-1"><span className="text-red-600 font-bold">●</span> Weak</span>
            <span className="flex items-center gap-1"><span className="text-red-800 font-bold">●</span> Critically Weak</span>
          </div>
        </div>

        {/* Main Column: Topic Hierarchy & Minimum 4-Video Hub */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs space-y-6">
          {/* Header for Selected Topic */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">{getDot(selectedTopic?.skillLevel)}</span>
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedTopic?.name} — Topic Map & Videos
                </h3>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {hierarchyData?.overview || selectedTopic?.shortDescription || selectedTopic?.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-1 rounded-full border ${getBadgeColor(selectedTopic?.skillLevel)}`}>
                Skill Level: {selectedTopic?.skillLevel} ({selectedTopic?.progressPct || selectedTopic?.accuracy || 60}% Progress)
              </span>
            </div>
          </div>

          {/* TOPIC VIDEO TUTORIALS HUB (MINIMUM 4 PLAYABLE VIDEOS ON RIGHT SIDE) */}
          {selectedTopic && topicVideosList.length > 0 && (
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-md space-y-4 border border-slate-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-700/80">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-red-600/20 text-red-400 rounded-lg">
                      <YoutubeIcon className="w-4 h-4 text-red-500" />
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-white">
                      Recommended Video Tutorials ({topicVideosList.length} Videos Available)
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Topic-specific video lessons for <strong className="text-blue-400">{selectedTopic.name}</strong>. Select any video below to watch.
                  </p>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 bg-red-500/20 text-red-300 rounded-full border border-red-500/30 flex items-center gap-1.5 w-fit flex-shrink-0">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  4+ Playable Videos
                </span>
              </div>

              {/* 1. Main Active Video Player */}
              {currentActiveVideo && (
                <div className="space-y-3">
                  <div className="aspect-video w-full rounded-xl overflow-hidden shadow-2xl border border-slate-700 bg-black relative group">
                    <iframe
                      key={extractYoutubeId(currentActiveVideo.url || currentActiveVideo.youtubeUrl) || currentActiveVideo.videoId}
                      src={`https://www.youtube.com/embed/${extractYoutubeId(currentActiveVideo.url || currentActiveVideo.youtubeUrl) || currentActiveVideo.videoId}?autoplay=1`}
                      title={currentActiveVideo.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-red-500/20 text-red-400 rounded border border-red-500/30 uppercase">
                          Now Playing
                        </span>
                        <span className="text-xs font-semibold text-slate-400 truncate">
                          {currentActiveVideo.channelTitle || currentActiveVideo.channel || "Educational Video"}
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-white mt-1 truncate">
                        {currentActiveVideo.title}
                      </h5>
                    </div>

                    <a
                      href={currentActiveVideo.url || `https://www.youtube.com/watch?v=${currentActiveVideo.videoId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex-shrink-0"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Open YouTube</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {/* 2. Minimum 4 Video Cards Selector Grid */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2.5">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-blue-400" />
                    <span>Select Video Lesson ({topicVideosList.length} Videos)</span>
                  </h5>
                  <span className="text-[11px] text-blue-400 font-semibold">Click any card to play</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {topicVideosList.map((v, vIdx) => {
                    const vId = extractYoutubeId(v.url || v.youtubeUrl) || v.videoId;
                    const activeVId = extractYoutubeId(currentActiveVideo?.url || currentActiveVideo?.youtubeUrl) || currentActiveVideo?.videoId;
                    const isActive = activeVId === vId;

                    return (
                      <button
                        key={vIdx}
                        type="button"
                        onClick={() => setActiveTopicVideo(v)}
                        className={`text-left p-2.5 rounded-xl border transition-all flex flex-col justify-between group ${
                          isActive
                            ? "bg-blue-600/25 border-blue-500 ring-2 ring-blue-500/50 text-white shadow-lg"
                            : "bg-slate-800/70 border-slate-700/80 hover:border-slate-500 hover:bg-slate-800 text-slate-300"
                        }`}
                      >
                        {/* Thumbnail Container */}
                        <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-slate-950 border border-slate-700/60 mb-2">
                          <img
                            src={`https://img.youtube.com/vi/${vId}/hqdefault.jpg`}
                            alt={v.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                              isActive ? "bg-blue-600 text-white scale-110 shadow-md" : "bg-red-600/90 text-white group-hover:scale-110"
                            }`}>
                              <Play className="w-4 h-4 fill-current ml-0.5" />
                            </div>
                          </div>
                          <span className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 bg-black/80 text-white rounded">
                            Video {vIdx + 1}
                          </span>
                          {v.duration && (
                            <span className="absolute bottom-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 bg-black/80 text-white rounded">
                              {v.duration}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h6 className={`text-xs font-bold leading-tight line-clamp-2 ${isActive ? "text-blue-400" : "text-white group-hover:text-blue-300"}`}>
                            {v.title}
                          </h6>
                          <p className="text-[10px] text-slate-400 mt-1 truncate">
                            {v.channelTitle || v.channel || "Educational Channel"}
                          </p>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px]">
                          <span className={isActive ? "text-blue-400 font-bold flex items-center gap-1" : "text-slate-400"}>
                            {isActive ? "▶ Playing Now" : "Click to Play"}
                          </span>
                          <span className="text-slate-500 font-medium">HD</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP-BY-STEP LEARNING ROADMAP (4 STAGES • 1 VIDEO PER STAGE) */}
          {loading ? (
            <div className="py-16 text-center text-gray-400">
              <div className="w-8 h-8 border-2 border-[#1264E8] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs">Loading topic learning hierarchy for {selectedTopic?.name}...</p>
            </div>
          ) : hierarchyData?.hierarchy ? (
            <div className="space-y-4 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                  Step-by-Step Learning Roadmap (4 Stages • 1 Video Per Stage)
                </span>
                <span className="text-xs text-blue-600 font-semibold">
                  Select stage video to play in YouTube player
                </span>
              </div>

              {/* Learning Hierarchy Tree / Milestones */}
              <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-blue-100">
                {hierarchyData.hierarchy.slice(0, 4).map((stage, sIdx) => (
                  <div key={sIdx} className="relative">
                    {/* Circle Node */}
                    <div className="absolute -left-[27px] top-1 w-6 h-6 rounded-full bg-blue-50 border-2 border-[#1264E8] flex items-center justify-center text-[11px] font-bold text-[#1264E8] shadow-xs">
                      {sIdx + 1}
                    </div>

                    <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-2.5 hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">
                            {stage.category}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {stage.description}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-100 text-[#1264E8] rounded flex-shrink-0">
                          Stage {sIdx + 1}
                        </span>
                      </div>

                      {/* 1 Video per Stage */}
                      <div className="grid grid-cols-1 gap-2.5 pt-1">
                        {(stage.subtopics || []).slice(0, 1).map((sub, subIdx) => {
                          const matchedLocalSub = selectedTopic?.subtopics?.find(
                            (ls) => ls.name.toLowerCase().includes(sub.name.toLowerCase()) || sub.name.toLowerCase().includes(ls.name.toLowerCase())
                          );
                          const videoUrl =
                            sub.video?.youtubeUrl ||
                            sub.video?.url ||
                            matchedLocalSub?.video?.youtubeUrl ||
                            selectedTopic?.videos?.[sIdx % (selectedTopic?.videos?.length || 1)]?.url ||
                            selectedTopic?.videos?.[0]?.url ||
                            "https://www.youtube.com/watch?v=9yeOJ0ZMUYw";

                          const videoTitle = sub.video?.title || matchedLocalSub?.video?.title || `${selectedTopic?.name}: ${sub.name} Video Lesson`;
                          const videoChannel = sub.video?.channel || matchedLocalSub?.video?.channel || "Educational Video Channel";

                          return (
                            <div
                              key={subIdx}
                              onClick={() => openSubtopicModal(sub)}
                              className="text-left bg-white p-3.5 rounded-xl border border-gray-200/90 hover:border-[#1264E8] hover:shadow-md hover:bg-blue-50/20 transition-all cursor-pointer group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-bold text-gray-900 group-hover:text-[#1264E8] transition-colors leading-snug">
                                    {sub.name}
                                  </span>
                                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#1264E8] transition-colors flex-shrink-0" />
                                </div>
                                <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                                  {sub.simpleExplanation}
                                </p>
                              </div>

                              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const vObj = {
                                      videoId: extractYoutubeId(videoUrl) || "9yeOJ0ZMUYw",
                                      title: videoTitle,
                                      channelTitle: videoChannel,
                                      url: videoUrl
                                    };
                                    setActiveTopicVideo(vObj);
                                  }}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-600 text-red-700 hover:text-white text-xs font-bold rounded-lg transition-all border border-red-200 shadow-2xs group/btn"
                                >
                                  <YoutubeIcon className="w-3.5 h-3.5 text-red-600 group-hover/btn:text-white" />
                                  <span>Play Stage Video</span>
                                </button>

                                <a
                                  href={videoUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-700 text-xs font-semibold rounded-lg transition-colors border border-gray-200"
                                >
                                  <span>YouTube</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>

                                <span className="text-[11px] text-[#1264E8] font-bold group-hover:underline flex items-center gap-0.5 ml-1">
                                  Notes →
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 text-xs">
              No learning roadmap available for this topic yet.
            </div>
          )}
        </div>
      </div>

      {/* Subtopic Detail Modal */}
      {activeSubtopic && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-gray-200 shadow-2xl p-6 my-8 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[11px] font-bold px-2 py-0.5 bg-blue-100 text-[#1264E8] rounded uppercase tracking-wider">
                  {selectedSubjectObj.name} • {selectedTopic?.name}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1">
                  {activeSubtopic.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveSubtopic(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. Simple Explanation */}
            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#1264E8]" />
                <span>Simple Explanation</span>
              </h4>
              <p className="text-xs text-gray-700 bg-blue-50/50 p-3 rounded-xl border border-blue-100 leading-relaxed font-normal">
                {activeSubtopic.simpleExplanation}
              </p>
            </div>

            {/* 2. Key Concepts */}
            {activeSubtopic.keyConcepts?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  <span>Key Concepts</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeSubtopic.keyConcepts.map((kc, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-md border border-gray-200/80"
                    >
                      ✓ {kc}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Recommended YouTube Video (Direct Subject & Topic Matched) */}
            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <YoutubeIcon className="w-3.5 h-3.5 text-red-600" />
                <span>Subject & Topic YouTube Video</span>
              </h4>

              {videoLoading && !subtopicVideo ? (
                <div className="p-4 bg-gray-50 rounded-xl border text-center text-xs text-gray-500">
                  Loading verified video for {selectedSubjectObj.name}...
                </div>
              ) : subtopicVideo ? (
                <div className="space-y-3">
                  {subtopicVideo.videoId && subtopicVideo.videoId !== "tutorial" && (
                    <div className="aspect-video w-full rounded-xl overflow-hidden shadow-md border border-gray-200 bg-black">
                      <iframe
                        src={`https://www.youtube.com/embed/${subtopicVideo.videoId}?autoplay=1`}
                        title={subtopicVideo.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                  <div className="p-3 bg-red-50/60 rounded-xl border border-red-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h5 className="text-xs font-bold text-gray-900 leading-snug">
                        {subtopicVideo.title}
                      </h5>
                      <div className="mt-1 flex items-center gap-3 text-[11px] text-gray-500">
                        <span className="font-semibold text-red-700">
                          {subtopicVideo.channelTitle || subtopicVideo.channel || "Verified YouTube Tutorial"}
                        </span>
                      </div>
                    </div>
                    <a
                      href={subtopicVideo.url || `https://www.youtube.com/watch?v=${subtopicVideo.videoId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex-shrink-0"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Watch on YouTube</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ) : null}
            </div>

            {/* 4. Quick Notes */}
            {activeSubtopic.notes && (
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  <span>Quick Notes</span>
                </h4>
                <div className="text-xs text-gray-700 bg-amber-50/60 p-3 rounded-xl border border-amber-200/80 leading-relaxed">
                  {activeSubtopic.notes}
                </div>
              </div>
            )}

            {/* 5. Practice Questions */}
            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                <span>Topic Practice Questions ({subtopicQuestions.length || 8})</span>
              </h4>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {(subtopicQuestions.length > 0 ? subtopicQuestions : (activeSubtopic.practiceQuestions || [])).map((qObj, qIdx) => (
                  <div key={qIdx} className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 text-xs space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded mr-1.5 uppercase">
                          {qObj.difficulty || "Practice"}
                        </span>
                        <span className="font-semibold text-gray-900 leading-snug">
                          Q{qIdx + 1}: {qObj.question}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleAnswer(qIdx)}
                        className="text-[11px] font-bold text-[#1264E8] hover:underline flex-shrink-0"
                      >
                        {showAnswerIdx[qIdx] ? "Hide Answer" : "Show Answer"}
                      </button>
                    </div>

                    {showAnswerIdx[qIdx] && (
                      <div className="pt-2 mt-1 border-t border-gray-200 text-gray-700 bg-white p-2.5 rounded-lg border space-y-1">
                        <div>
                          <strong className="text-emerald-700">Answer: </strong>
                          <span>{qObj.answer}</span>
                        </div>
                        {qObj.explanation && (
                          <div className="text-[11px] text-gray-500 border-t pt-1 mt-1">
                            <strong>Explanation: </strong>{qObj.explanation}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setActiveSubtopic(null)}
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
