import { createContext, useContext, useEffect, useRef, useState } from "react";
import { clearToken, getProfile, getToken, saveProfile, saveToken } from "../services/api.js";
import { signIn, verifyToken } from "../services/auth.js";
import { getUser } from "../services/user.js";

const AuthContext = createContext(null);

// The token keeps the name from sign up, so the saved profile has priority
const withProfile = (decoded) => ({ ...decoded, ...getProfile() });

// Fills in the fields the JWT does not carry. Only non-empty values are used so
// a short or failed response can never wipe details we already hold.
function mergeServerUser(current, data) {
  if (!data) return current;
  const merged = { ...current };
  if (data.name) merged.name = data.name;
  if (data.email) merged.email = data.email;
  if (data.phone) merged.phone = data.phone;
  if (data.id) merged.id = data.id;
  if (data.role) merged.role = data.role;
  return merged;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Guards against firing the same profile lookup twice.
  const requestedFor = useRef(null);

  // The JWT only carries id, name and role, so the stored email and phone are
  // read once per account. Failures leave the existing profile untouched.
  async function loadAccount(decoded) {
    const restored = withProfile(decoded);
    setUser(restored);
    if (!restored.id || requestedFor.current === restored.id) return;
    requestedFor.current = restored.id;
    try {
      const response = await getUser(restored.id);
      const serverUser = mergeServerUser(restored, response?.data);
      // Persist only what the server actually confirmed.
      saveProfile({
        name: serverUser.name,
        email: serverUser.email,
        ...(serverUser.phone ? { phone: serverUser.phone } : {}),
      });
      setUser(serverUser);
    } catch {
      // Keep whatever we already had rather than clearing it.
    }
  }

  // Restore the session when the app opens
  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    verifyToken()
      .then((data) => loadAccount(data.decoded))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  async function login(credentials, remember) {
    const data = await signIn(credentials);
    saveToken(data.token, remember);
    saveProfile({
      name: data.user.name,
      email: data.user.email,
      ...(data.user.phone ? { phone: data.user.phone } : {}),
    });
    const verified = await verifyToken();
    // Reset the guard so the signed-in account is always fetched.
    requestedFor.current = null;
    await loadAccount(verified.decoded);
  }

  function updateProfile(profile) {
    saveProfile(profile);
    setUser((current) => ({ ...current, ...profile }));
  }

  function logout() {
    clearToken();
    requestedFor.current = null;
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
