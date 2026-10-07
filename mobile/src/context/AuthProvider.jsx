import { createContext, useContext, useEffect, useState } from "react";
import client, { errorMessage, onSessionExpired } from "../api/client";
import { getToken, setToken, clearToken } from "../storage/token";

const AuthContext = createContext(null);

/** Restores server-verified sessions and manages secure login/logout. */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(
    () =>
      onSessionExpired(() => {
        setUser(null);
        setError("");
        setMessage("Session expired, please log in again.");
      }),
    [],
  );
  useEffect(() => {
    let active = true;
    /** Restores a saved token without trusting cached user metadata. */
    async function restore() {
      setLoading(true);
      setError("");
      try {
        const token = await getToken();
        if (token) {
          const { data } = await client.get("/auth/me");
          if (active) setUser(data.user);
        }
      } catch (failure) {
        if (active && failure.response?.status !== 401)
          setError(errorMessage(failure));
      } finally {
        if (active) setLoading(false);
      }
    }
    restore();
    return () => {
      active = false;
    };
  }, [revision]);
  /** Saves credentials securely before unlocking protected screens. */
  async function signIn(values, registerMode = false) {
    const { data } = await client.post(
      `/auth/${registerMode ? "register" : "login"}`,
      values,
    );
    await setToken(data.token);
    setUser(data.user);
    setMessage("");
    setError("");
  }
  /** Revokes the token before removing it from the device. */
  async function signOut() {
    await client.post("/auth/logout");
    await clearToken();
    setUser(null);
  }
  /** Retries startup verification after a storage or network error. */
  function retry() {
    setRevision((value) => value + 1);
  }
  return (
    <AuthContext.Provider
      value={{ user, loading, error, message, signIn, signOut, retry }}
    >
      {children}
    </AuthContext.Provider>
  );
}
/** Returns the shared verified session. */
export function useAuth() {
  return useContext(AuthContext);
}
