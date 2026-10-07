import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "taskflow.accessToken";

/** Reads the access token from encrypted device storage. */
export async function getToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}
/** Persists the access token using SecureStore only. */
export async function setToken(token) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}
/** Removes the access token from encrypted device storage. */
export async function clearToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
