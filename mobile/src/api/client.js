import { create } from "axios";
import { z } from "zod";
import { getToken, clearToken } from "../storage/token";

const base = z
  .url()
  .parse(process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:5000/api")
  .replace(/\/$/, "");
const client = create({
  baseURL: base.endsWith("/api") ? base : `${base}/api`,
  timeout: 15000,
});
const listeners = new Set();
let expiring;

/** Subscribes to invalid sessions without coupling HTTP code to navigation. */
export function onSessionExpired(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
/** Adds the current SecureStore token to a request. */
export async function authorizeRequest(config) {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}
/** Invalidates rejected sessions while keeping login errors on the form. */
export async function rejectResponse(error) {
  const authForm = /\/auth\/(login|register)$/.test(error.config?.url || "");
  if (error.response?.status === 401 && !authForm) {
    const currentToken = await getToken();
    // Reason: An old request must not clear a newly signed-in session.
    if (
      currentToken &&
      error.config?.headers?.Authorization === `Bearer ${currentToken}`
    ) {
      if (!expiring)
        expiring = clearToken()
          .then(() => listeners.forEach((listener) => listener()))
          .finally(() => {
            expiring = undefined;
          });
      await expiring;
    }
  }
  return Promise.reject(error);
}
/** Maps connectivity failures to an actionable message. */
export function errorMessage(error) {
  if (error.code === "ERR_NETWORK") return "No internet connection";
  if (error.code === "ECONNABORTED")
    return "The request timed out. Please retry.";
  return (
    error.response?.data?.error?.message || "Unable to connect. Please retry."
  );
}
client.interceptors.request.use(authorizeRequest);
client.interceptors.response.use(undefined, rejectResponse);
export default client;
