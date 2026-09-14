import React from "react";
import { useUser } from "../context/UserContext";
import { Search, Bot, Sparkles } from "lucide-react";

export default function SearchBar({ onSearchSubmit }) {
  const { globalSearch, setGlobalSearch, setIsAssistantOpen } = useUser();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && globalSearch.trim()) {
      if (onSearchSubmit) {
        onSearchSubmit(globalSearch.trim());
      } else {
        setIsAssistantOpen(true);
      }
    }
  };

  return (
    <div className="w-full mb-6">
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search DSA topics (Binary Trees, Graphs), faculty notes, or prompt AI (e.g. '30 min path on Trees')..."
          className="w-full pl-10 pr-36 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#1264E8]/20 focus:border-[#1264E8] transition-all"
        />
        <div className="absolute inset-y-1 right-1 flex items-center pr-1">
          <button
            type="button"
            onClick={() => setIsAssistantOpen(true)}
            className="h-8 px-3 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg border border-[#E5E7EB] flex items-center gap-1.5 shadow-2xs hover:border-gray-300 transition-all"
          >
            <Bot className="w-3.5 h-3.5 text-[#1264E8]" />
            <span className="hidden sm:inline">Ask Assistant</span>
          </button>
        </div>
      </div>
    </div>
  );
}
