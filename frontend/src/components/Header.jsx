import React, { useState, useRef, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { Menu, X, LogOut, TrendingUp, Shield, Settings, KeyRound } from "lucide-react";

export default function Header({ mobileOpen, setMobileOpen, onOpenProfileModal }) {
  const { currentUser, logout } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!currentUser) return null;

  const initial = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "S";
  const progressPercentage = currentUser?.progress || (currentUser?.role === "STUDENT" ? 68 : 100);

  const accreditationBadges = [
    { name: "NAAC Grade A+", src: "/logos/ranking-naac.png", title: "NAAC Accredited A+ Grade (3.49 CGPA)" },
    { name: "NIRF Ranking", src: "/logos/ranking-nirf.png", title: "NIRF Ranked 75 (2023 University Level)" },
    { name: "NBA Accredited", src: "/logos/ranking-nba.png", title: "NBA Accredited (CSE, ECE, EEE, Mechanical & Biotech for 3 Years)" },
    { name: "AICTE Approved", src: "/logos/ranking-aicte.png", title: "Approved by AICTE" },
    { name: "UGC 12(B)", src: "/logos/ranking-ugc.png", title: "UGC 12(B) Status" },
    { name: "DSIR Certified", src: "/logos/ranking-dsir.png", title: "DSIR Certified Institute (Dept. of Science & Industrial Research)" },
  ];

  return (
    <header className="sticky top-0 z-30 min-h-[64px] bg-white border-b border-[#E5E7EB] shadow-xs px-3 sm:px-6 py-2">
      <div className="flex items-center justify-between gap-2 sm:gap-4 w-full">
        {/* 1. LEFT: Mobile Toggle */}
        <div className="flex items-center flex-shrink-0">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 md:hidden flex-shrink-0"
            aria-label="Toggle Navigation"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* 2. CENTER: Institution / Website Title & Academic Branding */}
        <div className="flex flex-col items-center justify-center text-center px-1 sm:px-3 flex-1 min-w-0">
          <span className="text-[9px] sm:text-[10px] font-black tracking-widest text-gray-400 uppercase">
            DEPARTMENT OF CSE PRESENTS
          </span>
          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
            <h1 className="text-sm sm:text-base md:text-lg font-black tracking-tight text-gray-900 whitespace-nowrap">
              GAP2<span className="text-[#1264E8]">GROW</span> LEARNING PORTAL
            </h1>
          </div>
          <p className="hidden lg:block text-[10px] font-medium text-gray-400 tracking-wide">
            Autonomous Diagnostic, Resource Simplifier &amp; Exam Preparation Agent
          </p>
        </div>

        {/* 3. RIGHT: 6 Official Ranking Logos + Student/Faculty Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
          {/* Official Ranking Logos from Vignan Accreditation */}
          <div className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            {accreditationBadges.map((b) => (
              <img
                key={b.name}
                src={b.src}
                alt={b.name}
                title={b.title}
                className="h-10 w-10 sm:h-11 sm:w-11 object-contain hover:scale-110 transition-transform cursor-pointer"
              />
            ))}
          </div>

          {/* User Profile Avatar with Dropdown - Sleek Small Pill Avatar */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1264E8] hover:bg-blue-100 transition-all shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 cursor-pointer"
              title={`${currentUser.name} (${currentUser.role})`}
            >
              <div className="w-7 h-7 rounded-full bg-[#1264E8] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {initial}
              </div>
              <span className="text-xs font-bold text-gray-800 hidden sm:inline max-w-[100px] truncate">
                {currentUser.name ? currentUser.name.split(" ")[0] : "User"}
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-[#E5E7EB] py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-4 py-2.5 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-900 truncate">{currentUser.name}</p>
                  <p className="text-[11px] text-gray-500 truncate">{currentUser.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {currentUser.role} • {currentUser.identifier}
                  </span>
                </div>

                <div className="py-1">
                  {/* Show Learning Progress ONLY for Students. For Faculty, Remedial, Library replace with Settings header */}
                  {currentUser.role === "STUDENT" ? (
                    <div className="px-4 py-2.5 bg-blue-50/60 border-b border-gray-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-[#1264E8]" />
                          <span>Learning Progress</span>
                        </span>
                        <span className="text-xs font-black text-[#1264E8] bg-blue-100 px-2 py-0.5 rounded-md">
                          {progressPercentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#1264E8] h-full rounded-full transition-all duration-500"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-2 bg-gradient-to-r from-gray-50 to-blue-50/40 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                          <Settings className="w-3.5 h-3.5 text-[#1264E8]" />
                          <span>Portal Settings</span>
                        </span>
                        <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md uppercase">
                          {currentUser.role.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => { setDropdownOpen(false); onOpenProfileModal?.("profile"); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 text-left cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5 text-gray-400" />
                    <span>{currentUser?.role === "STUDENT" ? "Academic Profile" : "Personal Details"}</span>
                  </button>

                  <button
                    onClick={() => { setDropdownOpen(false); onOpenProfileModal?.("security"); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 text-left cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                    <span>Settings &amp; Change Password</span>
                  </button>
                </div>

                <div className="border-t border-gray-100 pt-1">
                  <button
                    onClick={() => { setDropdownOpen(false); logout(); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
