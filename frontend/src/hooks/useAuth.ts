import { useState, useCallback } from "react";
import { authApi } from "../api/authApi";
import type { User, RegisterPayload, LoginPayload } from "../types/auth";
import toast from "react-hot-toast";

// Read initial user from localStorage so auth persists on page refresh
function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveSession = (token: string, userData: User) => {
    localStorage.setItem("access_token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setError(null);
  };

  const clearSession = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const register = useCallback(async (payload: RegisterPayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.register(payload);
      saveSession(data.access_token, data.user);
      toast.success(`Welcome, ${data.user.full_name}!`);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Registration failed.";
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (payload: LoginPayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.login(payload);
      saveSession(data.access_token, data.user);
      toast.success(`Welcome back, ${data.user.full_name}!`);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed.";
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
    toast.success("Logged out successfully.");
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: Boolean(user),
    register,
    login,
    logout,
  };
}