import React, { useState, useRef, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { api } from "../services/api";
import {
  Bot,
  Send,
  Sparkles,
  Trash2,
  RotateCcw,
  Copy,
  Check,
  BookOpen,
  Code,
  Calendar,
  Search,
  HelpCircle,
  AlertCircle,
  Languages,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

export default function AIChatAssistant({ isPage = false }) {
  const { currentUser } = useUser();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [lastFailedMessage, setLastFailedMessage] = useState(null);
  const [sessionId] = useState(() => "session_" + Math.random().toString(36).substring(2, 9));
  const messagesEndRef = useRef(null);

  const defaultGreeting = {
    id: "g_1",
    sender: "assistant",
    text: `Hello ${currentUser?.name || "Student"}! I am your Gap2Grow Academic AI Assistant for ${currentUser?.department || "CSE"}. Ask me any subject question, coding problem, 2/5/10 mark exam question, study plan, or search for verified Vignan resources.`,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    intent: "GENERAL_STUDENT_QUERY"
  };

  useEffect(() => {
    const saved = localStorage.getItem(`gap2grow_chat_${currentUser?.id || "guest"}`);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        setMessages([defaultGreeting]);
      }
    } else {
      setMessages([defaultGreeting]);
    }
  }, [currentUser]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`gap2grow_chat_${currentUser?.id || "guest"}`, JSON.stringify(messages));
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    setErrorMsg(null);
    setLastFailedMessage(null);

    const userMsg = {
      id: "u_" + Date.now(),
      sender: "user",
      text: query.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const userContext = {
        name: currentUser?.name || "Student",
        department: currentUser?.department || "CSE",
        year: currentUser?.year || "2nd Year",
        branch: currentUser?.branch || "CSE"
      };

      const res = await api.chat(query.trim(), userContext, newMessages, sessionId);

      const aiMsg = {
        id: "a_" + Date.now(),
        sender: "assistant",
        text: res.reply || "No response received.",
        intent: res.intent || "GENERAL_STUDENT_QUERY",
        mode: res.mode || "AI_AGENT",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Chat Error:", err);
      setLastFailedMessage(query.trim());
      setErrorMsg("AI service is temporarily unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastFailedMessage) {
      handleSend(lastFailedMessage);
    }
  };

  const handleClearChat = () => {
    setMessages([defaultGreeting]);
    localStorage.removeItem(`gap2grow_chat_${currentUser?.id || "guest"}`);
    setErrorMsg(null);
  };

  const copyToClipboard = (codeText, id) => {
    navigator.clipboard.writeText(codeText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Quick Prompt Chips
  const promptCategories = [
    {
      title: "Exam Answers",
      icon: <HelpCircle className="w-3.5 h-3.5 text-blue-600" />,
      prompts: [
        "Explain Binary Tree in 2 marks",
        "Explain Queue vs Stack in 5 marks",
        "Detailed 10-mark breakdown for BFS and DFS"
      ]
    },
    {
      title: "Coding",
      icon: <Code className="w-3.5 h-3.5 text-[#1264E8]" />,
      prompts: [
        "Write Python code for Inorder Traversal",
        "Fix C++ code: missing pointer check",
        "Write Java program for Binary Search"
      ]
    },
    {
      title: "Resources & Plans",
      icon: <Search className="w-3.5 h-3.5 text-amber-600" />,
      prompts: [
        "Search resources for Binary Trees",
        "Give me a 3-day exam study plan for Data Structures",
        "Binary trees ante enti?"
      ]
    }
  ];

  // Markdown & Code Renderer helper
  const renderFormattedMessage = (text, msgId) => {
    if (!text) return null;

    // Check code blocks ```lang ... ```
    const codeBlockRegex = /```([a-zA-Z]*)\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: "text", content: text.substring(lastIndex, match.index) });
      }
      parts.push({
        type: "code",
        lang: match[1] || "code",
        code: match[2].trim()
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({ type: "text", content: text.substring(lastIndex) });
    }

    return (
      <div className="space-y-2">
        {parts.map((part, index) => {
          if (part.type === "code") {
            const blockId = `${msgId}_code_${index}`;
            return (
              <div key={index} className="my-2 rounded-xl bg-slate-900 text-slate-100 overflow-hidden border border-slate-800 shadow-md">
                <div className="flex items-center justify-between px-4 py-1.5 bg-slate-800/80 text-xs text-slate-300 font-mono border-b border-slate-700">
                  <span className="font-semibold uppercase tracking-wider">{part.lang}</span>
                  <button
                    onClick={() => copyToClipboard(part.code, blockId)}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    {copiedId === blockId ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 text-xs sm:text-sm font-mono overflow-x-auto leading-relaxed">
                  <code>{part.code}</code>
                </pre>
              </div>
            );
          }

          // Format lines with bold / bullet / headers
          const lines = part.content.split("\n");
          return (
            <div key={index} className="space-y-1.5 whitespace-pre-line">
              {lines.map((line, idx) => {
                if (line.startsWith("### ")) {
                  return (
                    <h4 key={idx} className="font-bold text-sm sm:text-base text-slate-900 mt-2 mb-1">
                      {line.replace("### ", "")}
                    </h4>
                  );
                }
                if (line.startsWith("## ")) {
                  return (
                    <h3 key={idx} className="font-extrabold text-base sm:text-lg text-[#1264E8] mt-2 mb-1">
                      {line.replace("## ", "")}
                    </h3>
                  );
                }
                if (line.startsWith("- ") || line.startsWith("* ")) {
                  return (
                    <div key={idx} className="flex items-start gap-2 ml-2 my-0.5">
                      <span className="text-[#1264E8] font-bold">•</span>
                      <span>{line.substring(2)}</span>
                    </div>
                  );
                }
                return <p key={idx} className="leading-relaxed">{line}</p>;
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`flex flex-col bg-white border border-[#E5E7EB] rounded-2xl shadow-sm ${isPage ? "h-[calc(100vh-140px)] min-h-[550px]" : "h-full"}`}>
      {/* Top Header */}
      <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between bg-gradient-to-r from-blue-50/60 via-white to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1264E8] to-[#0E4CB5] text-white flex items-center justify-center shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Academic AI Assistant
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Direct Answer Mode
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Vignan University AI Core • Intent-Aware & Zero Filler
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearChat}
            title="Clear Chat History"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#F8FAFC]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-xs ${
                msg.sender === "user"
                  ? "bg-[#1264E8] text-white"
                  : "bg-gradient-to-br from-blue-600 to-indigo-700 text-white"
              }`}
            >
              {msg.sender === "user" ? currentUser?.name?.charAt(0) || "U" : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm shadow-xs ${
              msg.sender === "user"
                ? "bg-[#1264E8] text-white rounded-tr-none"
                : "bg-white text-slate-800 border border-slate-200/90 rounded-tl-none"
            }`}>
              {msg.sender === "assistant" ? (
                renderFormattedMessage(msg.text, msg.id)
              ) : (
                <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>
              )}
              <div className={`text-[10px] mt-2 text-right ${msg.sender === "user" ? "text-blue-100" : "text-slate-400"}`}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 w-max shadow-xs animate-pulse">
            <div className="w-5 h-5 rounded-full border-2 border-[#1264E8] border-t-transparent animate-spin"></div>
            <span>Reasoning intent & validating answer...</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
            {lastFailedMessage && (
              <button
                onClick={handleRetry}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <RotateCcw className="w-3 h-3" />
                Retry
              </button>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="p-3 border-t border-slate-100 bg-white space-y-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          {promptCategories.map((cat, idx) => (
            <div key={idx} className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mr-1">
                {cat.icon}
                {cat.title}:
              </span>
              {cat.prompts.map((p, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => handleSend(p)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-[#1264E8] hover:border-blue-200 border border-transparent rounded-lg text-slate-700 whitespace-nowrap text-xs transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-3 sm:p-4 border-t border-[#E5E7EB] bg-white rounded-b-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask academic question, code doubt, 2/5/10 mark answer, or study plan..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1264E8]/20 focus:border-[#1264E8] transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="h-10 px-4 rounded-xl bg-[#1264E8] text-white flex items-center justify-center font-medium hover:bg-[#0E4CB5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
