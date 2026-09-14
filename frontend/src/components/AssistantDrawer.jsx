import React from "react";
import { useUser } from "../context/UserContext";
import { X, Sparkles, Bot } from "lucide-react";
import AIChatAssistant from "./AIChatAssistant";

export default function AssistantDrawer() {
  const { isAssistantOpen, setIsAssistantOpen } = useUser();

  if (!isAssistantOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-[#E5E7EB] animate-in slide-in-from-right duration-300 relative">
        {/* Drawer Header Close Bar */}
        <div className="p-3 bg-[#0F172A] text-white flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Bot className="w-4 h-4 text-[#1264E8]" />
            <span>Gap2Grow AI Agentic Assistant</span>
          </div>
          <button
            onClick={() => setIsAssistantOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Embedded Full Chat Assistant */}
        <div className="flex-1 overflow-hidden p-2">
          <AIChatAssistant isPage={false} />
        </div>
      </div>
    </div>
  );
}
