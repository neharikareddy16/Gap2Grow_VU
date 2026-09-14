import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("gap2grow_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("gap2grow_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("gap2grow_user");
    }
  }, [currentUser]);

  const login = async (role, identifier, password) => {
    try {
      const res = await api.login({ role, identifier, password });
      if (res && res.user) {
        setCurrentUser(res.user);
        const userRole = res.user.role;
        if (userRole === "SUPER_ADMIN") {
          setActiveTab("superadmin-portal");
        } else if (userRole === "FACULTY") {
          setActiveTab("faculty-dashboard");
        } else if (userRole === "REMEDIAL_COORDINATOR") {
          setActiveTab("remedial-dashboard");
        } else if (userRole === "LIBRARY") {
          setActiveTab("library-dashboard");
        } else {
          setActiveTab("dashboard");
        }
        return { success: true, user: res.user };
      }
      throw new Error("Authentication failed. Please verify your credentials.");
    } catch (err) {
      throw new Error(err.message || "Invalid Credentials. Please check your role, ID, and password.");
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.register(userData);
      return res;
    } catch (err) {
      throw new Error(err.message || "Registration failed. Please check your details.");
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTab("dashboard");
    localStorage.removeItem("gap2grow_user");
  };

  const updateProfile = (updatedFields) => {
    setCurrentUser(prev => ({
      ...prev,
      ...updatedFields
    }));
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        login,
        register,
        logout,
        updateProfile,
        activeTab,
        setActiveTab,
        isAssistantOpen,
        setIsAssistantOpen,
        globalSearch,
        setGlobalSearch
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within UserProvider");
  }
  return ctx;
}
