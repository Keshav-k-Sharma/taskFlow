import axios from "axios";

const base = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");
const api = axios.create({
  baseURL: base.endsWith("/api") ? base : `${base}/api`,
});

/** Attaches the browser's current access token. */
export function authorizeRequest(config) {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}
/** Clears an invalid session while preserving errors from login forms. */
export function rejectResponse(error) {
  const isAuthForm = /\/auth\/(login|register)$/.test(error.config?.url || "");
  if (
    error.response?.status === 401 &&
    !isAuthForm &&
    typeof window !== "undefined"
  ) {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
    window.location.assign("/login?expired=1");
  }
  return Promise.reject(error);
}
/** Returns a readable API or network error. */
export function errorMessage(error) {
  return (
    error.response?.data?.error?.message ||
    "Unable to connect. Please try again."
  );
}
api.interceptors.request.use(authorizeRequest);
api.interceptors.response.use(undefined, rejectResponse);
export default api;
