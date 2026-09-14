import React from "react";
import { useUser } from "../context/UserContext";
import AIChatAssistant from "../components/AIChatAssistant";
import { Bot, Sparkles, BookOpen, ShieldCheck, Zap } from "lucide-react";

export default function AIAssistantPage() {
  const { currentUser } = useUser();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#1264E8] via-[#0E4CB5] to-[#1E3A8A] text-white p-6 sm:p-8 rounded-2xl shadow-md border border-blue-400/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-semibold backdrop-blur-md">
              <Bot className="w-3.5 h-3.5 text-amber-300" />
              <span>Vignan Student AI Agent</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              AI Academic Chat Assistant
            </h1>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Ask direct questions for concept explanations, coding doubts, 2/5/10 mark exam questions, custom study plans, and Vignan resource retrieval.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15">
              <div className="font-bold text-emerald-300 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> Direct Answers
              </div>
              <div className="text-blue-100 text-[11px] mt-0.5">No greetings or fluff</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15">
              <div className="font-bold text-amber-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> High Precision
              </div>
              <div className="text-blue-100 text-[11px] mt-0.5">Primary & Backup AI Fallback</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Full Page Chat Assistant Container */}
      <AIChatAssistant isPage={true} />
    </div>
  );
}
