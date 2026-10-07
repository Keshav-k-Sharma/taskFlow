"use client";
import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";
const AuthContext = createContext(null);

/** Verifies persisted sessions and exposes login and server-backed logout. */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    /** Verifies the token before showing protected pages. */
    async function restore() {
      if (!localStorage.getItem("token")) {
        if (active) setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/auth/me");
        if (active) {
          setUser(data.user);
          setError("");
        }
      } catch (failure) {
        if (active && failure.response?.status !== 401)
          setError("Could not verify your session. Please retry.");
      } finally {
        if (active) setLoading(false);
      }
    }
    restore();
    return () => {
      active = false;
    };
  }, [revision]);
  /** Saves a successful login or registration. */
  function signIn(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    setError("");
    setLoading(false);
  }
  /** Revokes the current token before clearing local session state. */
  async function signOut() {
    await api.post("/auth/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }
  /** Retries server verification after a network failure. */
  function retry() {
    setRevision((value) => value + 1);
  }
  return (
    <AuthContext.Provider
      value={{ user, loading, error, signIn, signOut, retry }}
    >
      {children}
    </AuthContext.Provider>
  );
}
/** Returns the shared authenticated session. */
export function useAuth() {
  return useContext(AuthContext);
}
