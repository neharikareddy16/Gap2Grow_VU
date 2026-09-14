import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import {
  GraduationCap,
  Briefcase,
  Target,
  BookOpen,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Shield,
  Loader2
} from "lucide-react";

export default function Login() {
  const { login, register } = useUser();

  const [mode, setMode] = useState("signin"); // "signin" or "signup"
  const [selectedRole, setSelectedRole] = useState("STUDENT"); // STUDENT, FACULTY, REMEDIAL_COORDINATOR, LIBRARY

  // Sign In Form State - empty by default (no autofill or demo credentials)
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Sign Up Form State
  const [fullName, setFullName] = useState("");
  const [roleSpecificId, setRoleSpecificId] = useState("");
  const [email, setEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [year, setYear] = useState("2");
  const [branch, setBranch] = useState("CSE");

  // UI Feedback State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const roles = [
    {
      id: "STUDENT",
      label: "Student",
      desc: "Personalized gap diagnosis & paths",
      icon: GraduationCap,
      idLabel: "Email ID or Register Number",
      idPlaceholder: "e.g. 23CSE001 or rahul@vignan.ac.in",
      demoId: "23CSE001",
      demoPassword: "password123",
      demoName: "Rahul Kumar (Student)"
    },
    {
      id: "FACULTY",
      label: "Faculty",
      desc: "Subject & assessment management",
      icon: Briefcase,
      idLabel: "Username or Email ID",
      idPlaceholder: "e.g. sai.eswari or sai.eswari@vignan.ac.in",
      demoId: "sai.eswari",
      demoPassword: "Faculty@123",
      demoName: "SAI ESWARI (Faculty)"
    },
    {
      id: "REMEDIAL_COORDINATOR",
      label: "Remedial Coordinator",
      desc: "Remedial student tracking & exams",
      icon: Target,
      idLabel: "Username or Email ID",
      idPlaceholder: "e.g. bhargavi or bhargavi@vignan.ac.in",
      demoId: "bhargavi",
      demoPassword: "Remedial@123",
      demoName: "BHARGAVI (Coordinator)"
    },
    {
      id: "LIBRARY",
      label: "Library",
      desc: "Library inventory & softcopies",
      icon: BookOpen,
      idLabel: "Username or Email ID",
      idPlaceholder: "e.g. library or library@vignan.ac.in",
      demoId: "library",
      demoPassword: "Library@123",
      demoName: "VIGNAN's NTR LIBRARY"
    },
    {
      id: "SUPER_ADMIN",
      label: "Super Admin",
      desc: "System user creation & role governance",
      icon: Shield,
      idLabel: "Username or Email ID",
      idPlaceholder: "e.g. superadmin or superadmin@vignan.ac.in",
      demoId: "superadmin",
      demoPassword: "SuperAdmin@123",
      demoName: "Super Admin Portal"
    }
  ];

  const currentRoleConfig = roles.find((r) => r.id === selectedRole) || roles[0];

  const handleRoleChange = (roleId) => {
    setSelectedRole(roleId);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const fillDemoCredentials = (roleId) => {
    const roleObj = roles.find((r) => r.id === roleId);
    if (roleObj) {
      setSelectedRole(roleObj.id);
      setIdentifier(roleObj.demoId);
      setPassword(roleObj.demoPassword);
      setErrorMsg("");
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!identifier.trim() || !password.trim()) {
      setErrorMsg("Please fill in all mandatory fields.");
      return;
    }

    setLoading(true);
    try {
      await login(selectedRole, identifier.trim(), password.trim());
      setSuccessMsg("Login Successful! Redirecting to your dashboard...");
    } catch (err) {
      setErrorMsg(err.message || "Invalid Credentials. Please check your role, ID, and password.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!fullName.trim() || !email.trim() || !regPassword.trim() || !roleSpecificId.trim()) {
      setErrorMsg("All fields are mandatory. Please fill them completely.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg("Please enter a valid Email ID format.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: fullName.trim(),
        role: "STUDENT",
        identifier: roleSpecificId.trim(),
        email: email.trim(),
        password: regPassword.trim(),
        branch: branch,
        department: branch,
        year: year
      };

      const res = await register(payload);
      setSuccessMsg("Registration Successful! Redirecting to Sign In...");
      setTimeout(() => {
        setMode("signin");
        setIdentifier(roleSpecificId.trim());
        setPassword("");
        setSuccessMsg("Account created successfully! Please enter your password to sign in.");
      }, 1400);
    } catch (err) {
      setErrorMsg(err.message || "Registration failed. Duplicate identifier or email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        {/* Official Vignan Branding Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <img
              src="/logos/vignan-main-logo.png"
              alt="Vignan's Foundation for Science, Technology & Research"
              className="h-16 sm:h-20 w-auto object-contain"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            GAP2<span className="text-[#1264E8]">GROW</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-600 font-medium">
            Academic Diagnostic &amp; Learning Resource Portal
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-6 px-6 sm:px-8 border border-[#E5E7EB] shadow-sm rounded-2xl">
          {/* Sign In vs Sign Up Tabs */}
          <div className="flex border-b border-gray-200 mb-5">
            <button
              type="button"
              onClick={() => { setMode("signin"); setErrorMsg(""); setSuccessMsg(""); }}
              className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-all ${
                mode === "signin"
                  ? "border-[#1264E8] text-[#1264E8]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode("signup"); setSelectedRole("STUDENT"); setErrorMsg(""); setSuccessMsg(""); }}
              className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-all ${
                mode === "signup"
                  ? "border-[#1264E8] text-[#1264E8]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Role Selection Section - Only in Sign In mode */}
          {mode === "signin" ? (
            <div className="mb-5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Select Portal / Role:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isSelected = selectedRole === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleRoleChange(r.id)}
                      className={`p-2 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? "border-[#1264E8] bg-blue-50/70 text-[#1264E8] shadow-xs"
                          : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-1 ${isSelected ? "text-[#1264E8]" : "text-gray-500"}`} />
                      <span className="text-[11px] font-bold leading-tight truncate">{r.label}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-gray-500 mt-2">
                Selected: <strong className="text-gray-800">{currentRoleConfig.label}</strong> — {currentRoleConfig.desc}
              </p>
            </div>
          ) : (
            <div className="mb-5 p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#1264E8] flex-shrink-0" />
              <div>
                <strong>Student Registration Portal</strong>
                <p className="text-[11px] text-blue-700 mt-0.5">
                  Public signup is only available for Students. Super Admin, Faculty, Remedial Coordinator, and Library accounts cannot be created via signup.
                </p>
              </div>
            </div>
          )}

          {/* Alerts */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    {currentRoleConfig.idLabel} *
                  </label>
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials(selectedRole)}
                    className="text-[11px] text-[#1264E8] hover:text-blue-700 font-semibold flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Auto-fill Demo</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={currentRoleConfig.idPlaceholder}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1264E8]/20 focus:border-[#1264E8]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    Password *
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your account password"
                    className="w-full px-3.5 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1264E8]/20 focus:border-[#1264E8]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#1264E8] hover:bg-[#0E52C2] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Validating credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to {currentRoleConfig.label} Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                {selectedRole === "SUPER_ADMIN" ? (
                  <span className="text-xs text-gray-500 font-medium">
                    Super Admin registration is not available. System-managed account.
                  </span>
                ) : selectedRole === "STUDENT" ? (
                  <>
                    <span className="text-xs text-gray-500">Don't have an account? </span>
                    <button
                      type="button"
                      onClick={() => { setMode("signup"); setSelectedRole("STUDENT"); setErrorMsg(""); }}
                      className="text-xs font-semibold text-[#1264E8] hover:underline"
                    >
                      Sign Up
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-gray-500 font-medium">
                    Public signup is not available for {currentRoleConfig.label}. Accounts are created by Super Admin.
                  </span>
                )}
              </div>

              {/* Demo Login Credentials for All Roles */}
              <div className="mt-5 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Demo Login Credentials</span>
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">Click to 1-Click Auto-Fill</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => fillDemoCredentials(r.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        selectedRole === r.id
                          ? "bg-blue-50/80 border-blue-400 ring-1 ring-blue-300"
                          : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold text-gray-900">
                        <span>{r.label}</span>
                        <span className="text-[9px] px-1.5 py-0.2 bg-blue-100 text-blue-700 rounded font-semibold">Demo</span>
                      </div>
                      <div className="text-[11px] font-mono text-gray-700 mt-1 truncate">ID: {r.demoId}</div>
                      <div className="text-[10px] text-gray-500 truncate">Pass: {r.demoPassword}</div>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}

          {/* SIGN UP FORM */}
          {mode === "signup" && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Kumar"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1264E8]/20 focus:border-[#1264E8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {selectedRole === "STUDENT"
                    ? "Register Number *"
                    : selectedRole === "FACULTY"
                    ? "Faculty ID *"
                    : selectedRole === "REMEDIAL_COORDINATOR"
                    ? "Faculty / Coordinator ID *"
                    : "Library ID *"}
                </label>
                <input
                  type="text"
                  required
                  value={roleSpecificId}
                  onChange={(e) => setRoleSpecificId(e.target.value)}
                  placeholder={
                    selectedRole === "STUDENT"
                      ? "e.g. 23CSE101"
                      : selectedRole === "FACULTY"
                      ? "e.g. FAC701"
                      : selectedRole === "REMEDIAL_COORDINATOR"
                      ? "e.g. RC402"
                      : "e.g. LIB108"
                  }
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1264E8]/20 focus:border-[#1264E8]"
                />
              </div>

              {/* Student-specific Year & Branch */}
              {selectedRole === "STUDENT" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Year *
                    </label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1264E8]/20 focus:border-[#1264E8]"
                    >
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Branch *
                    </label>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1264E8]/20 focus:border-[#1264E8]"
                    >
                      <option value="CSE">CSE</option>
                      <option value="ECE">ECE</option>
                      <option value="EEE">EEE</option>
                      <option value="AIML">AIML</option>
                      <option value="IT">IT</option>
                      <option value="DS">DS</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email ID *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. name@vignan.ac.in"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1264E8]/20 focus:border-[#1264E8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Create a secure password"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1264E8]/20 focus:border-[#1264E8]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#1264E8] hover:bg-[#0E52C2] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Registering profile...</span>
                  </>
                ) : (
                  <>
                    <span>Register as Student</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-gray-500">Already registered? </span>
                <button
                  type="button"
                  onClick={() => { setMode("signin"); setErrorMsg(""); }}
                  className="text-xs font-semibold text-[#1264E8] hover:underline"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
