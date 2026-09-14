import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { api } from "../services/api";
import {
  Dumbbell,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Award,
  AlertCircle,
  Filter,
  Check,
  HelpCircle,
  BookOpen
} from "lucide-react";

// Official 7 Subjects List
const SUBJECT_LIST = [
  { id: "oop", name: "Object Oriented Programming Through Java" },
  { id: "dbms", name: "Database Management Systems" },
  { id: "ai", name: "Artificial Intelligence" },
  { id: "digital-logic", name: "Digital Logic Design" },
  { id: "discrete-math", name: "Discrete Mathematics" },
  { id: "data-visualization", name: "Data Wrangling & Visualization" },
  { id: "data-structures", name: "Data Structures" }
];

// Fallback Topics for all 7 subjects (5 topics per subject)
const SUBJECT_TOPICS_REGISTRY = {
  "oop": [
    { id: "oop-1", name: "Classes & Objects" },
    { id: "oop-2", name: "Inheritance" },
    { id: "oop-3", name: "Polymorphism" },
    { id: "oop-4", name: "Encapsulation" },
    { id: "oop-5", name: "Abstraction & Interfaces" }
  ],
  "dbms": [
    { id: "dbms-1", name: "ER Model & Relational Model" },
    { id: "dbms-2", name: "Relational Algebra & SQL" },
    { id: "dbms-3", name: "Database Normalization" },
    { id: "dbms-4", name: "Transactions & Concurrency Control" },
    { id: "dbms-5", name: "Indexing & Query Processing" }
  ],
  "ai": [
    { id: "ai-1", name: "Intelligent Agents & Problem Solving" },
    { id: "ai-2", name: "Search Algorithms" },
    { id: "ai-3", name: "Knowledge Representation" },
    { id: "ai-4", name: "Machine Learning Basics" },
    { id: "ai-5", name: "Neural Networks & Deep Learning" }
  ],
  "digital-logic": [
    { id: "dld-1", name: "Number Systems & Boolean Algebra" },
    { id: "dld-2", name: "Logic Gates & Simplification" },
    { id: "dld-3", name: "Combinational Circuits" },
    { id: "dld-4", name: "Sequential Circuits" },
    { id: "dld-5", name: "Flip-Flops, Counters & Registers" }
  ],
  "discrete-math": [
    { id: "dm-1", name: "Set Theory & Relations" },
    { id: "dm-2", name: "Logic & Propositional Calculus" },
    { id: "dm-3", name: "Functions & Mathematical Proofs" },
    { id: "dm-4", name: "Graph Theory" },
    { id: "dm-5", name: "Combinatorics & Probability" }
  ],
  "data-visualization": [
    { id: "dv-1", name: "Data Cleaning & Preprocessing" },
    { id: "dv-2", name: "Data Transformation" },
    { id: "dv-3", name: "Data Integration & Merging" },
    { id: "dv-4", name: "Exploratory Data Analysis (EDA)" },
    { id: "dv-5", name: "Data Visualization & Dashboarding" }
  ],
  "data-structures": [
    { id: "ds-1", name: "Arrays" },
    { id: "ds-2", name: "Linked Lists" },
    { id: "ds-3", name: "Stacks & Queues" },
    { id: "ds-4", name: "Trees & Traversals" },
    { id: "ds-5", name: "Graphs & BFS/DFS" }
  ]
};

// Rich practice question dataset per subject & topic
const PRACTICE_QUESTIONS_REGISTRY = {
  "Classes & Objects": [
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
  ],
  "Inheritance": [
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
  ],
  "Polymorphism": [
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
  ],
  "Encapsulation": [
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
  ],
  "Abstraction & Interfaces": [
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
  ],
  "ER Model & Relational Model": [
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
  ],
  "Relational Algebra & SQL": [
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
  ],
  "Database Normalization": [
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
  ],
  "Transactions & Concurrency Control": [
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
  ],
  "Indexing & Query Processing": [
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
  ],
  "Intelligent Agents & Problem Solving": [
    {
      "id": 1,
      "difficulty": "Basic",
      "question": "What does the PEAS framework in Artificial Intelligence stand for?",
      "options": [
        "A. Performance, Environment, Actuators, Sensors",
        "B. Perception, Entity, Action, System",
        "C. Process, Evaluation, Agent, State",
        "D. Program, Engine, Algorithm, Search"
      ],
      "correct": "A",
      "answer": "A. Performance, Environment, Actuators, Sensors",
      "explanation": "PEAS defines Performance measure, Environment, Actuators, Sensors."
    },
    {
      "id": 2,
      "difficulty": "Basic",
      "question": "Which agent component observes or perceives inputs from the environment?",
      "options": [
        "A. Actuator",
        "B. Sensor",
        "C. Utility Engine",
        "D. Transition Model"
      ],
      "correct": "B",
      "answer": "B. Sensor",
      "explanation": "Sensors perceive environment inputs."
    },
    {
      "id": 3,
      "difficulty": "Intermediate",
      "question": "What characterizes a Rational Agent in AI?",
      "options": [
        "A. Always succeeds without failure",
        "B. Selects actions that maximize expected performance measure given current evidence",
        "C. Never changes state",
        "D. Operates without sensors"
      ],
      "correct": "B",
      "answer": "B. Selects actions that maximize expected performance measure given current evidence",
      "explanation": "Rational agents maximize expected performance."
    },
    {
      "id": 4,
      "difficulty": "Basic",
      "question": "Which environment type allows an agent to observe the complete state of the environment at any given time?",
      "options": [
        "A. Partially Observable",
        "B. Fully Observable",
        "C. Stochastic",
        "D. Continuous"
      ],
      "correct": "B",
      "answer": "B. Fully Observable",
      "explanation": "Fully observable environments reveal complete state."
    },
    {
      "id": 5,
      "difficulty": "Intermediate",
      "question": "An agent that maintains an internal state to keep track of unobserved aspects of the environment is a:",
      "options": [
        "A. Simple Reflex Agent",
        "B. Model-based Reflex Agent",
        "C. Goal-based Agent",
        "D. Random Agent"
      ],
      "correct": "B",
      "answer": "B. Model-based Reflex Agent",
      "explanation": "Model-based agents track unobserved state internally."
    },
    {
      "id": 6,
      "difficulty": "Basic",
      "question": "Which problem formulation component checks whether a candidate state satisfies the goal criteria?",
      "options": [
        "A. Initial State",
        "B. Transition Model",
        "C. Goal Test",
        "D. Path Cost"
      ],
      "correct": "C",
      "answer": "C. Goal Test",
      "explanation": "Goal Test verifies if current state satisfies goal conditions."
    },
    {
      "id": 7,
      "difficulty": "Intermediate",
      "question": "What is the State Space in search problem formulation?",
      "options": [
        "A. Memory heap size",
        "B. Set of all possible states reachable from initial state by any action sequence",
        "C. Final goal node only",
        "D. Set of heuristic values"
      ],
      "correct": "B",
      "answer": "B. Set of all possible states reachable from initial state by any action sequence",
      "explanation": "State space encompasses all reachable states."
    },
    {
      "id": 8,
      "difficulty": "Advanced",
      "question": "What distinguishes a Utility-based Agent from a Goal-based Agent?",
      "options": [
        "A. Uses search algorithms",
        "B. Uses a utility function to measure trade-offs and degree of happiness between competing goals",
        "C. Has no actuators",
        "D. Operates in static environment only"
      ],
      "correct": "B",
      "answer": "B. Uses a utility function to measure trade-offs and degree of happiness between competing goals",
      "explanation": "Utility-based agents evaluate degree of goal achievement."
    },
    {
      "id": 9,
      "difficulty": "Intermediate",
      "question": "Which component executes physical or virtual actions altering the environment state?",
      "options": [
        "A. Sensor",
        "B. Actuator",
        "C. Heuristic",
        "D. State Evaluator"
      ],
      "correct": "B",
      "answer": "B. Actuator",
      "explanation": "Actuators perform actions in the environment."
    },
    {
      "id": 10,
      "difficulty": "Advanced",
      "question": "What is a Deterministic Environment in AI?",
      "options": [
        "A. Next state is completely determined by current state and executed action",
        "B. Next state involves random chance",
        "C. Environment changes while agent deliberates",
        "D. Multiple agents compete"
      ],
      "correct": "A",
      "answer": "A. Next state is completely determined by current state and executed action",
      "explanation": "Deterministic environments have predictable state transitions."
    }
  ],
  "Search Algorithms": [
    {
      "id": 1,
      "difficulty": "Basic",
      "question": "Which search algorithm expands nodes in order of depth, going as deep as possible before backtracking?",
      "options": [
        "A. Breadth-First Search (BFS)",
        "B. Depth-First Search (DFS)",
        "C. Uniform Cost Search (UCS)",
        "D. A* Search"
      ],
      "correct": "B",
      "answer": "B. Depth-First Search (DFS)",
      "explanation": "DFS explores deepest unvisited nodes first."
    },
    {
      "id": 2,
      "difficulty": "Basic",
      "question": "What is the Space Complexity of Breadth-First Search (BFS) with branching factor b and depth d?",
      "options": [
        "A. O(b * d)",
        "B. O(b^d)",
        "C. O(d)",
        "D. O(log b)"
      ],
      "correct": "B",
      "answer": "B. O(b^d)",
      "explanation": "BFS space complexity is exponential O(b^d)."
    },
    {
      "id": 3,
      "difficulty": "Intermediate",
      "question": "A heuristic function h(n) in A* Search is defined as Admissible if:",
      "options": [
        "A. h(n) overestimates optimal cost to goal",
        "B. h(n) NEVER overestimates true optimal cost to reach goal node",
        "C. h(n) is always 0",
        "D. h(n) equals path cost g(n)"
      ],
      "correct": "B",
      "answer": "B. h(n) NEVER overestimates true optimal cost to reach goal node",
      "explanation": "Admissible heuristics never overestimate cost to goal."
    },
    {
      "id": 4,
      "difficulty": "Intermediate",
      "question": "Which uninformed search algorithm is guaranteed to find the optimal path when step costs are unequal?",
      "options": [
        "A. Depth-First Search",
        "B. Uniform Cost Search (UCS)",
        "C. Greedy Best-First Search",
        "D. Depth-Limited Search"
      ],
      "correct": "B",
      "answer": "B. Uniform Cost Search (UCS)",
      "explanation": "UCS expands lowest path cost g(n) node."
    },
    {
      "id": 5,
      "difficulty": "Intermediate",
      "question": "Greedy Best-First Search evaluates nodes using which evaluation function?",
      "options": [
        "A. f(n) = g(n)",
        "B. f(n) = h(n)",
        "C. f(n) = g(n) + h(n)",
        "D. f(n) = g(n) - h(n)"
      ],
      "correct": "B",
      "answer": "B. f(n) = h(n)",
      "explanation": "Greedy search evaluates nodes purely on heuristic h(n)."
    },
    {
      "id": 6,
      "difficulty": "Advanced",
      "question": "What is the evaluation function f(n) used in A* Search algorithm?",
      "options": [
        "A. f(n) = g(n) + h(n)",
        "B. f(n) = g(n) * h(n)",
        "C. f(n) = h(n)",
        "D. f(n) = g(n)"
      ],
      "correct": "A",
      "answer": "A. f(n) = g(n) + h(n)",
      "explanation": "A* evaluates total cost f(n) = g(n) + h(n)."
    },
    {
      "id": 7,
      "difficulty": "Intermediate",
      "question": "Iterative Deepening Search (IDS) combines the advantages of which two algorithms?",
      "options": [
        "A. Space efficiency of DFS and completeness/optimality of BFS",
        "B. A* and Minimax",
        "C. Greedy Search and Hill Climbing",
        "D. Genetic Algorithm and Simulated Annealing"
      ],
      "correct": "A",
      "answer": "A. Space efficiency of DFS and completeness/optimality of BFS",
      "explanation": "IDS offers DFS space bounds with BFS completeness."
    },
    {
      "id": 8,
      "difficulty": "Advanced",
      "question": "Which game-playing algorithm uses Minimax decision rule with tree pruning to minimize search space?",
      "options": [
        "A. Alpha-Beta Pruning",
        "B. A* Search",
        "C. Beam Search",
        "D. Hill Climbing"
      ],
      "correct": "A",
      "answer": "A. Alpha-Beta Pruning",
      "explanation": "Alpha-Beta prunes redundant Minimax tree branches."
    },
    {
      "id": 9,
      "difficulty": "Advanced",
      "question": "What is the optimal time complexity of Minimax search with ideal Alpha-Beta Pruning?",
      "options": [
        "A. O(b^d)",
        "B. O(b^(d/2))",
        "C. O(d)",
        "D. O(b * d)"
      ],
      "correct": "B",
      "answer": "B. O(b^(d/2))",
      "explanation": "Optimal Alpha-Beta pruning cuts effective depth in half."
    },
    {
      "id": 10,
      "difficulty": "Intermediate",
      "question": "A heuristic is Consistent (Monotonic) if for every node n and successor n' with step cost c:",
      "options": [
        "A. h(n) <= c(n, a, n') + h(n')",
        "B. h(n) >= g(n)",
        "C. h(n) = 0",
        "D. h(n) > h(n')"
      ],
      "correct": "A",
      "answer": "A. h(n) <= c(n, a, n') + h(n')",
      "explanation": "Consistent heuristics satisfy triangle inequality."
    }
  ],
  "Knowledge Representation": [
    {
      "id": 1,
      "difficulty": "Basic",
      "question": "Which logic representation extends Propositional Logic by adding Objects, Relations, and Quantifiers?",
      "options": [
        "A. Boolean Algebra",
        "B. First-Order Logic (FOL)",
        "C. Modal Logic",
        "D. Fuzzy Logic"
      ],
      "correct": "B",
      "answer": "B. First-Order Logic (FOL)",
      "explanation": "First-Order Logic incorporates objects, relations, and quantifiers."
    },
    {
      "id": 2,
      "difficulty": "Basic",
      "question": "What does the Universal Quantifier symbol (\u2200) denote in logic?",
      "options": [
        "A. There exists at least one element",
        "B. For all / for every element in domain",
        "C. Not true",
        "D. Implies"
      ],
      "correct": "B",
      "answer": "B. For all / for every element in domain",
      "explanation": "Universal quantifier \u2200 means 'for all' elements."
    },
    {
      "id": 3,
      "difficulty": "Intermediate",
      "question": "Which inference rule states: Given proposition P and P \u2192 Q, infer Q?",
      "options": [
        "A. Modus Ponens",
        "B. Modus Tollens",
        "C. Resolution",
        "D. Syllogism"
      ],
      "correct": "A",
      "answer": "A. Modus Ponens",
      "explanation": "Modus Ponens derives Q from P and P -> Q."
    },
    {
      "id": 4,
      "difficulty": "Intermediate",
      "question": "In First-Order Logic, what does a Horn Clause contain?",
      "options": [
        "A. Unlimited positive literals",
        "B. At most ONE positive literal",
        "C. No negative literals",
        "D. Only quantifiers"
      ],
      "correct": "B",
      "answer": "B. At most ONE positive literal",
      "explanation": "Horn clauses contain at most one positive literal."
    },
    {
      "id": 5,
      "difficulty": "Intermediate",
      "question": "What is Resolution Refutation in automated theorem proving?",
      "options": [
        "A. Proving statement by demonstrating that its negation leads to a contradiction (empty clause \u25a1)",
        "B. Forward search only",
        "C. Truth table expansion",
        "D. Heuristic expansion"
      ],
      "correct": "A",
      "answer": "A. Proving statement by demonstrating that its negation leads to a contradiction (empty clause \u25a1)",
      "explanation": "Resolution refutation proves queries by deriving empty clause contradiction."
    },
    {
      "id": 6,
      "difficulty": "Basic",
      "question": "Which knowledge structure uses nodes for concepts and directed labeled arcs for semantic relationships?",
      "options": [
        "A. Semantic Network",
        "B. Decision Tree",
        "C. Binary Heap",
        "D. Hash Table"
      ],
      "correct": "A",
      "answer": "A. Semantic Network",
      "explanation": "Semantic networks represent concepts and relations as graphs."
    },
    {
      "id": 7,
      "difficulty": "Intermediate",
      "question": "What is a Frame structure in AI knowledge representation?",
      "options": [
        "A. Array of integers",
        "B. Data structure with slots and fillers for representing structured domain knowledge",
        "C. Hardware circuit",
        "D. Neural network layer"
      ],
      "correct": "B",
      "answer": "B. Data structure with slots and fillers for representing structured domain knowledge",
      "explanation": "Frames store domain objects using slots and fillers."
    },
    {
      "id": 8,
      "difficulty": "Advanced",
      "question": "What is the key difference between Forward Chaining and Backward Chaining?",
      "options": [
        "A. Forward is data-driven starting from known facts; Backward is goal-driven starting from query",
        "B. Forward is slower",
        "C. Backward uses no rules",
        "D. Both are identical"
      ],
      "correct": "A",
      "answer": "A. Forward is data-driven starting from known facts; Backward is goal-driven starting from query",
      "explanation": "Forward chaining starts from facts; Backward chaining starts from goals."
    },
    {
      "id": 9,
      "difficulty": "Basic",
      "question": "What does the Existential Quantifier symbol (\u2203) denote in logic?",
      "options": [
        "A. For all elements",
        "B. There exists at least one element in domain",
        "C. Equal to",
        "D. Negation"
      ],
      "correct": "B",
      "answer": "B. There exists at least one element in domain",
      "explanation": "Existential quantifier \u2203 means 'there exists at least one'."
    },
    {
      "id": 10,
      "difficulty": "Advanced",
      "question": "What is an Ontology in Artificial Intelligence?",
      "options": [
        "A. Database index file",
        "B. Formal explicit specification of a shared conceptualization and domain vocabulary",
        "C. Robot movement trajectory",
        "D. Search algorithm heuristic"
      ],
      "correct": "B",
      "answer": "B. Formal explicit specification of a shared conceptualization and domain vocabulary",
      "explanation": "Ontologies formalize domain concepts, terms, and relationships."
    }
  ],
  "Machine Learning Basics": [
    {
      "id": 1,
      "difficulty": "Basic",
      "question": "Which machine learning paradigm uses labeled training datasets containing known target outputs?",
      "options": [
        "A. Supervised Learning",
        "B. Unsupervised Learning",
        "C. Reinforcement Learning",
        "D. Clustering"
      ],
      "correct": "A",
      "answer": "A. Supervised Learning",
      "explanation": "Supervised learning relies on labeled training pairs."
    },
    {
      "id": 2,
      "difficulty": "Basic",
      "question": "What occurs when a machine learning model fits training data noise perfectly but fails to generalize to test data?",
      "options": [
        "A. Underfitting",
        "B. Overfitting",
        "C. Optimal Convergence",
        "D. High Bias"
      ],
      "correct": "B",
      "answer": "B. Overfitting",
      "explanation": "Overfitting captures noise and fails to generalize."
    },
    {
      "id": 3,
      "difficulty": "Intermediate",
      "question": "Which metric evaluates classification accuracy as True Positives divided by total predicted Positives (TP / (TP + FP))?",
      "options": [
        "A. Recall",
        "B. Precision",
        "C. F1-Score",
        "D. Specificity"
      ],
      "correct": "B",
      "answer": "B. Precision",
      "explanation": "Precision measures TP / (TP + FP)."
    },
    {
      "id": 4,
      "difficulty": "Intermediate",
      "question": "What type of problem is predicted when output values are continuous numerical quantities (e.g. House Prices)?",
      "options": [
        "A. Classification",
        "B. Regression",
        "C. Clustering",
        "D. Association Rule"
      ],
      "correct": "B",
      "answer": "B. Regression",
      "explanation": "Regression models predict continuous numerical values."
    },
    {
      "id": 5,
      "difficulty": "Intermediate",
      "question": "Which algorithm is a non-parametric instance-based classifier using distance metrics like Euclidean distance?",
      "options": [
        "A. Linear Regression",
        "B. K-Nearest Neighbors (KNN)",
        "C. Naive Bayes",
        "D. K-Means"
      ],
      "correct": "B",
      "answer": "B. K-Nearest Neighbors (KNN)",
      "explanation": "KNN classifies instances based on distance to nearest neighbors."
    },
    {
      "id": 6,
      "difficulty": "Basic",
      "question": "What is the primary objective of Unsupervised Learning algorithms like K-Means?",
      "options": [
        "A. Predict target labels",
        "B. Discover hidden patterns or clusters in unlabeled data",
        "C. Reward agent actions",
        "D. Minimize MSE on labels"
      ],
      "correct": "B",
      "answer": "B. Discover hidden patterns or clusters in unlabeled data",
      "explanation": "Unsupervised learning discovers structure in unlabeled datasets."
    },
    {
      "id": 7,
      "difficulty": "Intermediate",
      "question": "Which metric measures the proportion of actual positive instances correctly identified (TP / (TP + FN))?",
      "options": [
        "A. Precision",
        "B. Recall (Sensitivity)",
        "C. Accuracy",
        "D. Fall-out"
      ],
      "correct": "B",
      "answer": "B. Recall (Sensitivity)",
      "explanation": "Recall calculates TP / (TP + FN)."
    },
    {
      "id": 8,
      "difficulty": "Advanced",
      "question": "What does K-Fold Cross-Validation do to prevent performance evaluation bias?",
      "options": [
        "A. Splits data into K random folds, training K times on K-1 folds and validating on 1 fold",
        "B. Removes 50% of data",
        "C. Runs model K times without splitting",
        "D. Multiplies weights by K"
      ],
      "correct": "A",
      "answer": "A. Splits data into K random folds, training K times on K-1 folds and validating on 1 fold",
      "explanation": "K-Fold cross validation rotates validation across K dataset partitions."
    },
    {
      "id": 9,
      "difficulty": "Advanced",
      "question": "In the Bias-Variance Trade-off, high bias typically leads to what model behavior?",
      "options": [
        "A. Overfitting",
        "B. Underfitting",
        "C. Zero error",
        "D. High variance"
      ],
      "correct": "B",
      "answer": "B. Underfitting",
      "explanation": "High bias causes underfitting due to overly simplistic assumptions."
    },
    {
      "id": 10,
      "difficulty": "Intermediate",
      "question": "Which matrix layout summarizes True Positives, False Positives, True Negatives, and False Negatives for classification?",
      "options": [
        "A. Adjacency Matrix",
        "B. Confusion Matrix",
        "C. Covariance Matrix",
        "D. Transition Matrix"
      ],
      "correct": "B",
      "answer": "B. Confusion Matrix",
      "explanation": "Confusion matrices tabulate classification prediction outcomes."
    }
  ],
  "Neural Networks & Deep Learning": [
    {
      "id": 1,
      "difficulty": "Basic",
      "question": "What is the primary purpose of an Activation Function in an artificial neural network?",
      "options": [
        "A. Store weights",
        "B. Introduce non-linearity so the network can learn complex non-linear functions",
        "C. Normalize input images",
        "D. Prevent backpropagation"
      ],
      "correct": "B",
      "answer": "B. Introduce non-linearity so the network can learn complex non-linear functions",
      "explanation": "Activation functions add non-linearity to neural models."
    },
    {
      "id": 2,
      "difficulty": "Basic",
      "question": "Which algorithm is used to calculate weight gradients across neural network layers using the chain rule?",
      "options": [
        "A. Gradient Descent",
        "B. Backpropagation",
        "C. Convolution",
        "D. Forward Pass"
      ],
      "correct": "B",
      "answer": "B. Backpropagation",
      "explanation": "Backpropagation computes error gradients via chain rule."
    },
    {
      "id": 3,
      "difficulty": "Intermediate",
      "question": "Which neural network architecture is specifically designed for processing grid data like Images?",
      "options": [
        "A. Recurrent Neural Network (RNN)",
        "B. Convolutional Neural Network (CNN)",
        "C. Autoencoder",
        "D. Perceptron"
      ],
      "correct": "B",
      "answer": "B. Convolutional Neural Network (CNN)",
      "explanation": "CNNs process spatial grid structures like images."
    },
    {
      "id": 4,
      "difficulty": "Intermediate",
      "question": "Which architecture specializes in handling sequential data like time-series and natural language?",
      "options": [
        "A. CNN",
        "B. Recurrent Neural Network (RNN / LSTM)",
        "C. Decision Forest",
        "D. Multilayer Perceptron"
      ],
      "correct": "B",
      "answer": "B. Recurrent Neural Network (RNN / LSTM)",
      "explanation": "RNNs process sequential time-series and text data."
    },
    {
      "id": 5,
      "difficulty": "Intermediate",
      "question": "What problem occurs in deep networks when gradients shrink exponentially towards zero during backpropagation?",
      "options": [
        "A. Exploding Gradients",
        "B. Vanishing Gradient Problem",
        "C. Overfitting",
        "D. Deadlock"
      ],
      "correct": "B",
      "answer": "B. Vanishing Gradient Problem",
      "explanation": "Vanishing gradients hinder early layer weight updates in deep nets."
    },
    {
      "id": 6,
      "difficulty": "Basic",
      "question": "What is the function of a Loss Function in neural network training?",
      "options": [
        "A. Measure discrepancy between network predictions and true target values",
        "B. Multiply inputs by 2",
        "C. Count hidden layers",
        "D. Store training images"
      ],
      "correct": "A",
      "answer": "A. Measure discrepancy between network predictions and true target values",
      "explanation": "Loss functions measure prediction error against ground truth."
    },
    {
      "id": 7,
      "difficulty": "Intermediate",
      "question": "Which regularization technique randomly deactivates a subset of neurons during training to prevent co-adaptation?",
      "options": [
        "A. Batch Normalization",
        "B. Dropout",
        "C. Early Stopping",
        "D. L2 Weight Decay"
      ],
      "correct": "B",
      "answer": "B. Dropout",
      "explanation": "Dropout randomly zeroes neuron activations during training."
    },
    {
      "id": 8,
      "difficulty": "Advanced",
      "question": "Which activation function outputs values in range [0, 1] and is commonly used in binary classification output layers?",
      "options": [
        "A. ReLU",
        "B. Sigmoid",
        "C. Softmax",
        "D. Leaky ReLU"
      ],
      "correct": "B",
      "answer": "B. Sigmoid",
      "explanation": "Sigmoid maps real values into [0, 1] range."
    },
    {
      "id": 9,
      "difficulty": "Advanced",
      "question": "What core mechanism powers Transformer architectures (e.g. GPT, BERT) for processing sequence contexts in parallel?",
      "options": [
        "A. Recurrent Feedback",
        "B. Self-Attention Mechanism",
        "C. Pooling Layers",
        "D. Max-Unpooling"
      ],
      "correct": "B",
      "answer": "B. Self-Attention Mechanism",
      "explanation": "Self-Attention enables parallel contextual representation."
    },
    {
      "id": 10,
      "difficulty": "Intermediate",
      "question": "What does Gradient Descent do during neural network optimization?",
      "options": [
        "A. Increases loss function",
        "B. Updates network weights in the opposite direction of the loss gradient to minimize error",
        "C. Deletes unneeded layers",
        "D. Randomizes inputs"
      ],
      "correct": "B",
      "answer": "B. Updates network weights in the opposite direction of the loss gradient to minimize error",
      "explanation": "Gradient descent adjusts weights opposite to loss gradient to minimize error."
    }
  ],
  "Number Systems & Boolean Algebra": [
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
  ],
  "Logic Gates & Simplification": [
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
  ],
  "Combinational Circuits": [
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
  ],
  "Sequential Circuits": [
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
  ],
  "Flip-Flops, Counters & Registers": [
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
  ],
  "Set Theory & Relations": [
    {
      "id": 1,
      "difficulty": "Basic",
      "question": "If set A has n elements, how many elements are in its Power Set P(A)?",
      "options": [
        "A. n^2",
        "B. 2^n",
        "C. 2n",
        "D. n!"
      ],
      "correct": "B",
      "answer": "B. 2^n",
      "explanation": "Power set cardinality is 2^n."
    },
    {
      "id": 2,
      "difficulty": "Basic",
      "question": "A binary relation R on set A is Reflexive if:",
      "options": [
        "A. (a, a) \u2208 R for all a \u2208 A",
        "B. (a, b) \u2208 R implies (b, a) \u2208 R",
        "C. (a, a) \u2209 R",
        "D. (a, b) \u2208 R and (b, c) \u2208 R implies (a, c) \u2208 R"
      ],
      "correct": "A",
      "answer": "A. (a, a) \u2208 R for all a \u2208 A",
      "explanation": "Reflexivity requires every element to relate to itself."
    },
    {
      "id": 3,
      "difficulty": "Intermediate",
      "question": "Which three properties MUST a relation satisfy to be classified as an Equivalence Relation?",
      "options": [
        "A. Reflexive, Symmetric, and Transitive",
        "B. Reflexive, Antisymmetric, and Transitive",
        "C. Irreflexive, Symmetric, and Transitive",
        "D. Symmetric, Asymmetric, Transitive"
      ],
      "correct": "A",
      "answer": "A. Reflexive, Symmetric, and Transitive",
      "explanation": "Equivalence relations are Reflexive, Symmetric, and Transitive."
    },
    {
      "id": 4,
      "difficulty": "Intermediate",
      "question": "A Partial Order Relation (Poset) MUST satisfy which three properties?",
      "options": [
        "A. Reflexive, Symmetric, Transitive",
        "B. Reflexive, Antisymmetric, Transitive",
        "C. Irreflexive, Antisymmetric, Transitive",
        "D. Symmetric, Asymmetric, Transitive"
      ],
      "correct": "B",
      "answer": "B. Reflexive, Antisymmetric, Transitive",
      "explanation": "Posets are Reflexive, Antisymmetric, and Transitive."
    },
    {
      "id": 5,
      "difficulty": "Basic",
      "question": "If |A| = 4 and |B| = 3, what is the cardinality of the Cartesian Product |A \u00d7 B|?",
      "options": [
        "A. 7",
        "B. 12",
        "C. 64",
        "D. 81"
      ],
      "correct": "B",
      "answer": "B. 12",
      "explanation": "|A x B| = 4 * 3 = 12."
    },
    {
      "id": 6,
      "difficulty": "Intermediate",
      "question": "According to De Morgan's Set Laws, what is the complement of (A \u222a B)'?",
      "options": [
        "A. A' \u222a B'",
        "B. A' \u2229 B'",
        "C. A \u2229 B",
        "D. A \u222a B"
      ],
      "correct": "B",
      "answer": "B. A' \u2229 B'",
      "explanation": "(A \u222a B)' = A' \u2229 B'."
    },
    {
      "id": 7,
      "difficulty": "Basic",
      "question": "What does the Set Difference (A - B) contain?",
      "options": [
        "A. Elements in both A and B",
        "B. Elements in A that do NOT belong to B",
        "C. Elements in B not in A",
        "D. All elements in universe"
      ],
      "correct": "B",
      "answer": "B. Elements in A that do NOT belong to B",
      "explanation": "Set difference A - B contains elements in A excluded from B."
    },
    {
      "id": 8,
      "difficulty": "Advanced",
      "question": "If relation R is Symmetric, what can be concluded about its inverse relation R^(-1)?",
      "options": [
        "A. R^(-1) = R",
        "B. R^(-1) is Empty",
        "C. R^(-1) is Transitive only",
        "D. R^(-1) is Antisymmetric"
      ],
      "correct": "A",
      "answer": "A. R^(-1) = R",
      "explanation": "For symmetric relations, R^(-1) = R."
    },
    {
      "id": 9,
      "difficulty": "Intermediate",
      "question": "What is an Antisymmetric Relation condition?",
      "options": [
        "A. If (a, b) \u2208 R and (b, a) \u2208 R, then a = b",
        "B. (a, b) \u2208 R implies (b, a) \u2208 R",
        "C. (a, a) \u2209 R",
        "D. Always empty"
      ],
      "correct": "A",
      "answer": "A. If (a, b) \u2208 R and (b, a) \u2208 R, then a = b",
      "explanation": "Antisymmetry holds if (a,b) and (b,a) in R implies a = b."
    },
    {
      "id": 10,
      "difficulty": "Advanced",
      "question": "What is the cardinality of the empty set's power set P(\u2205)?",
      "options": [
        "A. 0",
        "B. 1",
        "C. 2",
        "D. Undefined"
      ],
      "correct": "B",
      "answer": "B. 1",
      "explanation": "P(\u2205) = { \u2205 } which has cardinality 1."
    }
  ],
  "Logic & Propositional Calculus": [
    {
      "id": 1,
      "difficulty": "Basic",
      "question": "A compound proposition that is ALWAYS TRUE for all possible truth value assignments is called a:",
      "options": [
        "A. Contradiction",
        "B. Tautology",
        "C. Contingency",
        "D. Fallacy"
      ],
      "correct": "B",
      "answer": "B. Tautology",
      "explanation": "Tautologies are unconditionally true."
    },
    {
      "id": 2,
      "difficulty": "Basic",
      "question": "A compound proposition that is ALWAYS FALSE for all truth assignments is called a:",
      "options": [
        "A. Tautology",
        "B. Contradiction",
        "C. Satisfiable formula",
        "D. Implication"
      ],
      "correct": "B",
      "answer": "B. Contradiction",
      "explanation": "Contradictions are unconditionally false."
    },
    {
      "id": 3,
      "difficulty": "Intermediate",
      "question": "The implication P \u2192 Q is logically equivalent to which disjunction?",
      "options": [
        "A. \u00acP \u2228 Q",
        "B. P \u2228 \u00acQ",
        "C. \u00acP \u2227 Q",
        "D. P \u2227 Q"
      ],
      "correct": "A",
      "answer": "A. \u00acP \u2228 Q",
      "explanation": "P -> Q is logically equivalent to \u00acP \u2228 Q."
    },
    {
      "id": 4,
      "difficulty": "Intermediate",
      "question": "What is the Contrapositive of the conditional statement P \u2192 Q?",
      "options": [
        "A. Q \u2192 P",
        "B. \u00acQ \u2192 \u00acP",
        "C. \u00acP \u2192 \u00acQ",
        "D. \u00acP \u2228 Q"
      ],
      "correct": "B",
      "answer": "B. \u00acQ \u2192 \u00acP",
      "explanation": "Contrapositive of P -> Q is \u00acQ -> \u00acP (logically equivalent)."
    },
    {
      "id": 5,
      "difficulty": "Basic",
      "question": "What is the Converse of the conditional statement P \u2192 Q?",
      "options": [
        "A. Q \u2192 P",
        "B. \u00acQ \u2192 \u00acP",
        "C. \u00acP \u2192 \u00acQ",
        "D. P \u2227 Q"
      ],
      "correct": "A",
      "answer": "A. Q \u2192 P",
      "explanation": "Converse of P -> Q is Q -> P."
    },
    {
      "id": 6,
      "difficulty": "Basic",
      "question": "What is the Inverse of the conditional statement P \u2192 Q?",
      "options": [
        "A. Q \u2192 P",
        "B. \u00acP \u2192 \u00acQ",
        "C. \u00acQ \u2192 \u00acP",
        "D. P \u2228 Q"
      ],
      "correct": "B",
      "answer": "B. \u00acP \u2192 \u00acQ",
      "explanation": "Inverse of P -> Q is \u00acP -> \u00acQ."
    },
    {
      "id": 7,
      "difficulty": "Intermediate",
      "question": "Which inference rule states: Given P \u2192 Q and \u00acQ, infer \u00acP?",
      "options": [
        "A. Modus Ponens",
        "B. Modus Tollens",
        "C. Hypothetical Syllogism",
        "D. Disjunctive Syllogism"
      ],
      "correct": "B",
      "answer": "B. Modus Tollens",
      "explanation": "Modus Tollens derives \u00acP from P -> Q and \u00acQ."
    },
    {
      "id": 8,
      "difficulty": "Intermediate",
      "question": "Which inference rule states: Given P \u2192 Q and Q \u2192 R, infer P \u2192 R?",
      "options": [
        "A. Hypothetical Syllogism",
        "B. Modus Ponens",
        "C. Resolution",
        "D. Addition"
      ],
      "correct": "A",
      "answer": "A. Hypothetical Syllogism",
      "explanation": "Hypothetical Syllogism chains implications P -> Q and Q -> R to get P -> R."
    },
    {
      "id": 9,
      "difficulty": "Advanced",
      "question": "What is the Satisfiability (SAT) Problem in propositional logic?",
      "options": [
        "A. Checking if at least one truth assignment makes the formula TRUE",
        "B. Checking if formula is a tautology",
        "C. Counting variables",
        "D. Inverting clauses"
      ],
      "correct": "A",
      "answer": "A. Checking if at least one truth assignment makes the formula TRUE",
      "explanation": "SAT checks if any truth assignment satisfies a formula."
    },
    {
      "id": 10,
      "difficulty": "Advanced",
      "question": "What is the truth value of P \u2194 Q when P and Q have DIFFERENT truth values?",
      "options": [
        "A. True",
        "B. False",
        "C. Unknown",
        "D. Null"
      ],
      "correct": "B",
      "answer": "B. False",
      "explanation": "Biconditional P \u2194 Q is false when truth values differ."
    }
  ],
  "Functions & Mathematical Proofs": [
    {
      "id": 1,
      "difficulty": "Basic",
      "question": "A function f: A \u2192 B is defined as Injective (One-to-One) if:",
      "options": [
        "A. f(a) = f(b) implies a = b",
        "B. Range equals Codomain",
        "C. Every element in B maps to 2 elements",
        "D. f is linear"
      ],
      "correct": "A",
      "answer": "A. f(a) = f(b) implies a = b",
      "explanation": "Injective functions map distinct domain elements to distinct codomain elements."
    },
    {
      "id": 2,
      "difficulty": "Basic",
      "question": "A function f: A \u2192 B is defined as Surjective (Onto) if:",
      "options": [
        "A. Every element in codomain B has at least one pre-image in domain A (Range = Codomain)",
        "B. Distinct inputs map to distinct outputs",
        "C. Domain has fewer elements than codomain",
        "D. f is constant"
      ],
      "correct": "A",
      "answer": "A. Every element in codomain B has at least one pre-image in domain A (Range = Codomain)",
      "explanation": "Surjective functions cover the entire codomain."
    },
    {
      "id": 3,
      "difficulty": "Intermediate",
      "question": "A function that is BOTH Injective and Surjective is called a:",
      "options": [
        "A. Bijective Function",
        "B. Constant Function",
        "C. Inverse Function",
        "D. Partial Function"
      ],
      "correct": "A",
      "answer": "A. Bijective Function",
      "explanation": "Bijective functions are both 1-to-1 and onto."
    },
    {
      "id": 4,
      "difficulty": "Intermediate",
      "question": "What is the Base Step in a Proof by Mathematical Induction for property P(n)?",
      "options": [
        "A. Assume P(k) is true",
        "B. Prove P(n) holds for initial base case (e.g. n = 1)",
        "C. Prove P(k+1)",
        "D. Disprove P(0)"
      ],
      "correct": "B",
      "answer": "B. Prove P(n) holds for initial base case (e.g. n = 1)",
      "explanation": "Base step verifies property for initial value."
    },
    {
      "id": 5,
      "difficulty": "Intermediate",
      "question": "What does the Pigeonhole Principle state?",
      "options": [
        "A. If n items are put into m containers where n > m, at least one container must contain > 1 item",
        "B. Items cannot exceed containers",
        "C. n items need n^2 containers",
        "D. Containers are empty"
      ],
      "correct": "A",
      "answer": "A. If n items are put into m containers where n > m, at least one container must contain > 1 item",
      "explanation": "Pigeonhole principle guarantees container overlap when items > containers."
    },
    {
      "id": 6,
      "difficulty": "Advanced",
      "question": "In a Proof by Contradiction, how do you prove proposition P?",
      "options": [
        "A. Assume P is true",
        "B. Assume \u00acP is true and derive a logical impossibility / contradiction",
        "C. Test 10 numbers",
        "D. Use mathematical induction"
      ],
      "correct": "B",
      "answer": "B. Assume \u00acP is true and derive a logical impossibility / contradiction",
      "explanation": "Proof by contradiction assumes \u00acP and derives a contradiction."
    },
    {
      "id": 7,
      "difficulty": "Basic",
      "question": "How do you disprove a universal statement \u2200x P(x)?",
      "options": [
        "A. By finding a single Counterexample where P(x) is false",
        "B. By induction",
        "C. By testing all x",
        "D. Cannot be disproved"
      ],
      "correct": "A",
      "answer": "A. By finding a single Counterexample where P(x) is false",
      "explanation": "A single counterexample disproves a universal claim."
    },
    {
      "id": 8,
      "difficulty": "Intermediate",
      "question": "What is the Floor Function \u230a3.7\u230b?",
      "options": [
        "A. 3",
        "B. 4",
        "C. 3.7",
        "D. 0"
      ],
      "correct": "A",
      "answer": "A. 3",
      "explanation": "Floor function rounds down to nearest integer <= x."
    },
    {
      "id": 9,
      "difficulty": "Intermediate",
      "question": "What is the Ceiling Function \u23083.2\u2309?",
      "options": [
        "A. 3",
        "B. 4",
        "C. 3.2",
        "D. 5"
      ],
      "correct": "B",
      "answer": "B. 4",
      "explanation": "Ceiling function rounds up to nearest integer >= x."
    },
    {
      "id": 10,
      "difficulty": "Advanced",
      "question": "If f: A \u2192 B is a Bijective Function, what property does its inverse f^(-1): B \u2192 A possess?",
      "options": [
        "A. f^(-1) is also Bijective",
        "B. f^(-1) is not a function",
        "C. f^(-1) is constant",
        "D. f^(-1) has no domain"
      ],
      "correct": "A",
      "answer": "A. f^(-1) is also Bijective",
      "explanation": "The inverse of a bijective function is also bijective."
    }
  ],
  "Graph Theory": [
    {
      "id": 1,
      "difficulty": "Basic",
      "question": "According to the Handshaking Lemma, the sum of degrees of all vertices in an undirected graph equals:",
      "options": [
        "A. Number of edges |E|",
        "B. 2 * Number of edges (2|E|)",
        "C. Number of vertices |V|",
        "D. |V|^2"
      ],
      "correct": "B",
      "answer": "B. 2 * Number of edges (2|E|)",
      "explanation": "Sum of vertex degrees = 2 * |E|."
    },
    {
      "id": 2,
      "difficulty": "Basic",
      "question": "An Eulerian Circuit exists in a connected graph if and only if:",
      "options": [
        "A. Every vertex has an EVEN degree",
        "B. Every vertex has an odd degree",
        "C. Graph is a tree",
        "D. Graph has no edges"
      ],
      "correct": "A",
      "answer": "A. Every vertex has an EVEN degree",
      "explanation": "Eulerian circuits require all vertices to have even degree."
    },
    {
      "id": 3,
      "difficulty": "Intermediate",
      "question": "What is a Hamiltonian Path in graph theory?",
      "options": [
        "A. Path visiting every EDGE exactly once",
        "B. Path visiting every VERTEX in the graph exactly once",
        "C. Shortest path",
        "D. Path with no cycles"
      ],
      "correct": "B",
      "answer": "B. Path visiting every VERTEX in the graph exactly once",
      "explanation": "Hamiltonian path visits every vertex exactly once."
    },
    {
      "id": 4,
      "difficulty": "Intermediate",
      "question": "How many edges are in a Complete Graph K_n with n vertices?",
      "options": [
        "A. n * (n - 1) / 2",
        "B. n^2",
        "C. n - 1",
        "D. 2n"
      ],
      "correct": "A",
      "answer": "A. n * (n - 1) / 2",
      "explanation": "Complete graph Kn has n(n-1)/2 edges."
    },
    {
      "id": 5,
      "difficulty": "Intermediate",
      "question": "According to Euler's Planar Graph Formula, for any connected planar graph with V vertices, E edges, and F faces:",
      "options": [
        "A. V - E + F = 2",
        "B. V + E + F = 0",
        "C. V * E = F",
        "D. V - F = E"
      ],
      "correct": "A",
      "answer": "A. V - E + F = 2",
      "explanation": "Euler formula states V - E + F = 2 for planar graphs."
    },
    {
      "id": 6,
      "difficulty": "Basic",
      "question": "A Bipartite Graph can have its vertices partitioned into 2 sets V1 and V2 such that:",
      "options": [
        "A. Every edge connects a vertex in V1 to a vertex in V2",
        "B. Edges only connect vertices within V1",
        "C. All vertices have degree 2",
        "D. Graph contains odd cycles"
      ],
      "correct": "A",
      "answer": "A. Every edge connects a vertex in V1 to a vertex in V2",
      "explanation": "Bipartite graph edges strictly connect set V1 to V2."
    },
    {
      "id": 7,
      "difficulty": "Basic",
      "question": "How many edges does an undirected Tree with n vertices contain?",
      "options": [
        "A. n edges",
        "B. n - 1 edges",
        "C. n + 1 edges",
        "D. 2n edges"
      ],
      "correct": "B",
      "answer": "B. n - 1 edges",
      "explanation": "A tree with n vertices has n - 1 edges."
    },
    {
      "id": 8,
      "difficulty": "Intermediate",
      "question": "What is the Chromatic Number \u03c7(G) of a graph G?",
      "options": [
        "A. Total count of vertices",
        "B. Minimum number of colors needed to color vertices so no adjacent vertices share a color",
        "C. Max degree",
        "D. Number of faces"
      ],
      "correct": "B",
      "answer": "B. Minimum number of colors needed to color vertices so no adjacent vertices share a color",
      "explanation": "Chromatic number is the min vertex coloring count."
    },
    {
      "id": 9,
      "difficulty": "Advanced",
      "question": "What is an Isomorphic Graph pair?",
      "options": [
        "A. Graphs with identical vertex counts and edge adjacencies under a bijective mapping",
        "B. Graphs with same number of faces",
        "C. Trees only",
        "D. Disconnected graphs"
      ],
      "correct": "A",
      "answer": "A. Graphs with identical vertex counts and edge adjacencies under a bijective mapping",
      "explanation": "Isomorphic graphs share identical topological structure."
    },
    {
      "id": 10,
      "difficulty": "Advanced",
      "question": "In an Adjacency Matrix representation of an unweighted graph, entry A[i][j] = 1 indicates:",
      "options": [
        "A. An edge exists between vertex i and vertex j",
        "B. Distance is 0",
        "C. Vertex i is isolated",
        "D. Degree is 1"
      ],
      "correct": "A",
      "answer": "A. An edge exists between vertex i and vertex j",
      "explanation": "Adjacency matrix entry 1 indicates edge presence."
    }
  ],
  "Combinatorics & Probability": [
    {
      "id": 1,
      "difficulty": "Basic",
      "question": "What is the formula for Permutations P(n, r) of selecting r items from n distinct items where order matters?",
      "options": [
        "A. n! / (n - r)!",
        "B. n! / (r! * (n - r)!)",
        "C. n! * r!",
        "D. (n - r)!"
      ],
      "correct": "A",
      "answer": "A. n! / (n - r)!",
      "explanation": "P(n, r) = n! / (n - r)!."
    },
    {
      "id": 2,
      "difficulty": "Basic",
      "question": "What is the formula for Combinations C(n, r) of selecting r items from n distinct items where order does NOT matter?",
      "options": [
        "A. n! / (n - r)!",
        "B. n! / (r! * (n - r)!)",
        "C. n^r",
        "D. r! / n!"
      ],
      "correct": "B",
      "answer": "B. n! / (r! * (n - r)!)",
      "explanation": "C(n, r) = n! / (r! * (n - r)!)."
    },
    {
      "id": 3,
      "difficulty": "Intermediate",
      "question": "According to the Inclusion-Exclusion Principle for two sets A and B, |A \u222a B| equals:",
      "options": [
        "A. |A| + |B|",
        "B. |A| + |B| - |A \u2229 B|",
        "C. |A| * |B|",
        "D. |A \u2229 B|"
      ],
      "correct": "B",
      "answer": "B. |A| + |B| - |A \u2229 B|",
      "explanation": "|A \u222a B| = |A| + |B| - |A \u2229 B|."
    },
    {
      "id": 4,
      "difficulty": "Basic",
      "question": "What is the combination symmetry identity C(n, r)?",
      "options": [
        "A. C(n, r) = C(n, n - r)",
        "B. C(n, r) = C(n, r + 1)",
        "C. C(n, r) = n * r",
        "D. C(n, r) = 1"
      ],
      "correct": "A",
      "answer": "A. C(n, r) = C(n, n - r)",
      "explanation": "C(n, r) equals C(n, n-r)."
    },
    {
      "id": 5,
      "difficulty": "Intermediate",
      "question": "What is the formula for Conditional Probability P(A|B) of event A given event B has occurred?",
      "options": [
        "A. P(A \u2229 B) / P(B)",
        "B. P(A) * P(B)",
        "C. P(A \u222a B)",
        "D. P(A) / P(B)"
      ],
      "correct": "A",
      "answer": "A. P(A \u2229 B) / P(B)",
      "explanation": "P(A|B) = P(A \u2229 B) / P(B)."
    },
    {
      "id": 6,
      "difficulty": "Intermediate",
      "question": "Two events A and B are Independent if and only if:",
      "options": [
        "A. P(A \u2229 B) = P(A) * P(B)",
        "B. P(A \u222a B) = 0",
        "C. P(A|B) = 0",
        "D. P(A) + P(B) = 1"
      ],
      "correct": "A",
      "answer": "A. P(A \u2229 B) = P(A) * P(B)",
      "explanation": "Independent events satisfy P(A \u2229 B) = P(A) * P(B)."
    },
    {
      "id": 7,
      "difficulty": "Advanced",
      "question": "What does Bayes' Theorem state for updating probability P(A|B)?",
      "options": [
        "A. P(A|B) = P(B|A) * P(A) / P(B)",
        "B. P(A|B) = P(A) + P(B)",
        "C. P(A|B) = P(A) * P(B)",
        "D. P(A|B) = P(B) / P(A)"
      ],
      "correct": "A",
      "answer": "A. P(A|B) = P(B|A) * P(A) / P(B)",
      "explanation": "Bayes theorem calculates P(A|B) = P(B|A) * P(A) / P(B)."
    },
    {
      "id": 8,
      "difficulty": "Intermediate",
      "question": "How many ways can n distinct objects be arranged in a Circle (Circular Permutations)?",
      "options": [
        "A. n!",
        "B. (n - 1)!",
        "C. 2^n",
        "D. n^2"
      ],
      "correct": "B",
      "answer": "B. (n - 1)!",
      "explanation": "Circular permutation count is (n - 1)!."
    },
    {
      "id": 9,
      "difficulty": "Advanced",
      "question": "What is the Expected Value E[X] of a discrete random variable X?",
      "options": [
        "A. Sum of x_i * P(X = x_i)",
        "B. Max value of x_i",
        "C. 1 / N",
        "D. Variance squared"
      ],
      "correct": "A",
      "answer": "A. Sum of x_i * P(X = x_i)",
      "explanation": "Expected value is the probability-weighted sum."
    },
    {
      "id": 10,
      "difficulty": "Basic",
      "question": "What is the Binomial Coefficient in expansion of (x + y)^n for term x^(n-k) y^k?",
      "options": [
        "A. C(n, k)",
        "B. P(n, k)",
        "C. n * k",
        "D. k!"
      ],
      "correct": "A",
      "answer": "A. C(n, k)",
      "explanation": "Binomial expansion term coefficient is C(n, k)."
    }
  ],
  "Data Cleaning & Preprocessing": [
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
  ],
  "Data Transformation": [
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
  ],
  "Data Integration & Merging": [
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
  ],
  "Exploratory Data Analysis (EDA)": [
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
  ],
  "Data Visualization & Dashboarding": [
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
  ],
  "Arrays": [
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
  ],
  "Linked Lists": [
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
  ],
  "Stacks & Queues": [
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
  ],
  "Trees & Traversals": [
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
  ],
  "Graphs & BFS/DFS": [
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
};

export default function PracticeMode() {
  const { currentUser, setActiveTab } = useUser();
  const [selectedSubjectObj, setSelectedSubjectObj] = useState(SUBJECT_LIST[0]);
  const [topicsList, setTopicsList] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // 1. When selected subject changes, load topic list for that subject
  useEffect(() => {
    fetchSubjectTopics(selectedSubjectObj);
  }, [selectedSubjectObj]);

  const fetchSubjectTopics = async (subjObj) => {
    setLoading(true);
    try {
      const apiData = await api.getTopicGaps(subjObj.id || subjObj.name);
      if (apiData && Array.isArray(apiData) && apiData.length > 0) {
        setTopicsList(apiData);
        setSelectedTopic(apiData[0]);
      } else {
        // Fallback to local topic registry
        const fallbackTopics = SUBJECT_TOPICS_REGISTRY[subjObj.id] || SUBJECT_TOPICS_REGISTRY["oop"];
        setTopicsList(fallbackTopics);
        setSelectedTopic(fallbackTopics[0]);
      }
    } catch (err) {
      console.warn("Using fallback topics for practice mode:", err);
      const fallbackTopics = SUBJECT_TOPICS_REGISTRY[subjObj.id] || SUBJECT_TOPICS_REGISTRY["oop"];
      setTopicsList(fallbackTopics);
      setSelectedTopic(fallbackTopics[0]);
    } finally {
      setLoading(false);
    }
  };

  // 2. When selected topic changes, load topic-specific practice questions
  useEffect(() => {
    if (!selectedTopic) return;
    setLoading(true);
    setAnswers({});
    setSubmitted(false);
    setResult(null);

    const topicName = selectedTopic.name || selectedTopic;

    api.getPracticeQuestions(selectedSubjectObj.name, topicName)
      .then((res) => {
        if (res && Array.isArray(res) && res.length > 0) {
          setQuestions(res);
        } else {
          // Use client registry questions for exact subject & topic
          const localQuestions = PRACTICE_QUESTIONS_REGISTRY[topicName] || PRACTICE_QUESTIONS_REGISTRY["Classes & Objects"];
          setQuestions(localQuestions);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Using local practice question dataset:", err);
        const localQuestions = PRACTICE_QUESTIONS_REGISTRY[topicName] || PRACTICE_QUESTIONS_REGISTRY["Classes & Objects"];
        setQuestions(localQuestions);
        setLoading(false);
      });
  }, [selectedTopic, selectedSubjectObj]);

  const handleSelect = (qIdx, optionChoice) => {
    if (submitted) return;
    setAnswers({ ...answers, [qIdx]: optionChoice });
  };

  const handleSubjectChange = (subjObj) => {
    setSelectedSubjectObj(subjObj);
    setAnswers({});
    setSubmitted(false);
    setResult(null);
  };

  const handleFinish = async () => {
    setIsEvaluating(true);
    let correctCount = 0;

    questions.forEach((q, idx) => {
      const selected = answers[idx];
      if (!selected) return;

      const selClean = selected.trim().toLowerCase();
      const ansClean = (q.answer || q.correct || "").trim().toLowerCase();

      if (
        selClean === ansClean ||
        ansClean.startsWith(selClean) ||
        selClean.startsWith(ansClean)
      ) {
        correctCount++;
      }
    });

    const totalQ = questions.length || 1;
    const pct = Math.round((correctCount / totalQ) * 100);

    try {
      const res = await api.submitPractice(correctCount, totalQ);
      setResult({
        score: correctCount,
        total: totalQ,
        percentage: pct,
        beforeAccuracy: 35,
        afterAccuracy: pct,
        gapReduction: Math.max(10, pct - 35),
        feedback: pct >= 80 ? `Excellent mastery of ${selectedTopic?.name}! Concept gaps are closed.` : `Keep practicing ${selectedTopic?.name} to reinforce core principles.`,
        status: pct >= 80 ? "Gap Closed" : "Improving"
      });
      setSubmitted(true);
    } catch {
      setResult({
        score: correctCount,
        total: totalQ,
        percentage: pct,
        beforeAccuracy: 35,
        afterAccuracy: pct,
        gapReduction: Math.max(10, pct - 35),
        feedback: pct >= 80 ? `Great job! You demonstrated strong understanding of ${selectedTopic?.name}.` : `Continue reviewing ${selectedTopic?.name} to achieve zero gaps.`,
        status: pct >= 80 ? "Gap Closed" : "Improving"
      });
      setSubmitted(true);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 bg-blue-100 text-[#1264E8] rounded-md uppercase tracking-wider flex items-center gap-1">
              <Dumbbell className="w-3.5 h-3.5" />
              Practice Mode Agent
            </span>
            <span className="text-[11px] font-semibold text-gray-500">
              Subject & Topic-Wise Evaluation
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mt-1">
            {selectedSubjectObj.name}
          </h2>
          <p className="text-xs text-gray-500">
            Targeted self-assessment for <strong className="text-gray-900">{currentUser?.name}</strong> • Active Topic: <strong className="text-[#1264E8]">{selectedTopic?.name || "Select Topic"}</strong>
          </p>
        </div>
      </div>

      {/* Subject Selector Bar */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-3 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2 flex-shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#1264E8]" /> Subject:
          </span>
          {SUBJECT_LIST.map((subj) => {
            const isSelected = selectedSubjectObj.id === subj.id;
            return (
              <button
                key={subj.id}
                onClick={() => handleSubjectChange(subj)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
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

      {/* Topic Sub-filter */}
      {topicsList.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-3 shadow-xs flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2 flex-shrink-0 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Topic:
          </span>
          {topicsList.map((topic) => {
            const isSelected = selectedTopic?.name === topic.name || selectedTopic?.id === topic.id;
            return (
              <button
                key={topic.id || topic.name}
                onClick={() => setSelectedTopic(topic)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {topic.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div className="py-16 text-center text-gray-400 bg-white rounded-2xl border border-gray-200 shadow-xs">
          <div className="w-8 h-8 border-2 border-[#1264E8] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs font-semibold">Loading practice questions for {selectedTopic?.name}...</p>
        </div>
      ) : !submitted ? (
        <div className="space-y-4">
          {questions.map((q, qIndex) => {
            const optionsList = q.options || [
              `A. ${q.answer}`,
              "B. Alternative concept",
              "C. Opposite property",
              "D. None of the above"
            ];

            return (
              <div key={qIndex} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500">
                      Question {qIndex + 1} of {questions.length}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded uppercase">
                      {q.difficulty || "Practice"}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-md border border-blue-100">
                    Topic: {selectedTopic?.name}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-semibold text-gray-900 leading-snug">
                  {q.question}
                </h3>

                <div className="space-y-2 pt-1">
                  {optionsList.map((opt, i) => {
                    const letter = opt.charAt(0);
                    const isSelected = answers[qIndex] === letter || answers[qIndex] === opt;
                    return (
                      <button
                        key={i}
                        onClick={() => handleSelect(qIndex, letter)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? "border-[#1264E8] bg-blue-50/70 text-[#1264E8] shadow-xs font-semibold"
                            : "border-gray-200 hover:bg-gray-50 text-gray-800"
                        }`}
                      >
                        <span>{opt}</span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
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
              </div>
            );
          })}

          <div className="flex justify-end pt-2">
            <button
              onClick={handleFinish}
              disabled={Object.keys(answers).length < questions.length || isEvaluating}
              className="px-6 py-2.5 bg-[#1264E8] hover:bg-[#0E52C2] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs hover:shadow transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
            >
              {isEvaluating ? "Evaluating Topic Answers..." : "Submit Practice Answers"}
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Results Card */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded uppercase tracking-wider">
                  Topic Practice Evaluation Complete
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-1">
                  Practice Score: {result?.score} / {result?.total} ({result?.percentage}%)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Subject: <strong className="text-gray-900">{selectedSubjectObj.name}</strong> • Topic: <strong className="text-[#1264E8]">{selectedTopic?.name}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className="text-2xl font-black text-emerald-600 font-mono">
                  +{result?.gapReduction || 40}%
                </span>
                <span className="text-xs text-gray-500 font-medium">Topic Mastery Gain</span>
              </div>
            </div>

            {/* AI Adaptive Feedback Alert */}
            <div className="p-4 rounded-xl border bg-blue-50/50 border-blue-200 flex items-start gap-3 my-5">
              <Sparkles className="w-5 h-5 text-[#1264E8] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-gray-900">
                  Adaptive Insight for {selectedTopic?.name}
                </h4>
                <p className="text-xs text-gray-700 mt-0.5 leading-relaxed">
                  "{result?.feedback}"
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab("before-after")}
                className="px-4 py-2 bg-[#1264E8] hover:bg-[#0E52C2] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Before vs After Analytics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => { setSubmitted(false); setAnswers({}); setResult(null); }}
                className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Topic Practice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
