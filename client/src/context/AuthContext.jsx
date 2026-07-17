import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { authService } from "../services/authService.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("rentride_token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await authService.getMe();
      setUser(res.data.data);
    } catch (err) {
      localStorage.removeItem("rentride_token");
      localStorage.removeItem("rentride_user");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const { user, token } = res.data.data;
    localStorage.setItem("rentride_token", token);
    localStorage.setItem("rentride_user", JSON.stringify(user));
    setUser(user);
    toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
    return user;
  };

  const register = async (data) => {
    const res = await authService.register(data);
    const { user, token } = res.data.data;
    localStorage.setItem("rentride_token", token);
    localStorage.setItem("rentride_user", JSON.stringify(user));
    setUser(user);
    toast.success("Account created successfully!");
    return user;
  };

  const logout = () => {
    localStorage.removeItem("rentride_token");
    localStorage.removeItem("rentride_user");
    setUser(null);
    toast.success("Logged out successfully");
  };

  const updateUser = (data) => setUser((prev) => ({ ...prev, ...data }));

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
