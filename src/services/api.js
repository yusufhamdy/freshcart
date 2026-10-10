const BASE_URL = import.meta.env.VITE_API_BASE;
const TOKEN_KEY = "token";
const PROFILE_KEY = "profile";
const SESSION_KEY = "session";

// The token lives in localStorage ("keep me signed in") or sessionStorage
export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function saveToken(token, remember) {
  clearToken();
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(PROFILE_KEY);
  sessionStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}

// Keeps the token in the same storage it was saved in
export function replaceToken(token) {
  const storage = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage;
  storage.setItem(TOKEN_KEY, token);
}

// The profile (name, email, phone) is saved next to the token
export function getProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || sessionStorage.getItem(PROFILE_KEY) || "null");
  } catch {
    return null;
  }
}

export function saveProfile(profile) {
  const storage = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage;
  storage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

// The verified JWT payload is kept beside the token so a dropped connection can
// restore the session instead of signing the user out. It is written only after
// the server has confirmed it and is removed together with the token.
export function saveSession(decoded) {
  const storage = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage;
  storage.setItem(SESSION_KEY, JSON.stringify({ token: getToken(), decoded }));
}

// Returns the cached payload only when it belongs to the token we hold now, so a
// replaced or rotated token can never be restored with the previous identity.
export function getSession() {
  const token = getToken();
  try {
    const stored = JSON.parse(
      localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY) || "null"
    );
    return stored && stored.token === token ? stored.decoded : null;
  } catch {
    return null;
  }
}

export async function request(path, { method = "GET", body } = {}) {
  const token = getToken();

  const response = await fetch(BASE_URL + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { token } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.errors?.msg || data.message || "Something went wrong, please try again");
    error.status = response.status;
    throw error;
  }
  return data;
}
