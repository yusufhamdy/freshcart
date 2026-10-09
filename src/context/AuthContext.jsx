import { createContext, useContext, useEffect, useState } from "react";
import { clearToken, getProfile, getToken, saveProfile, saveToken } from "../services/api.js";
import { signIn, verifyToken } from "../services/auth.js";

const AuthContext = createContext(null);

// The token keeps the name from sign up, so the saved profile has priority
const withProfile = (decoded) => ({ ...decoded, ...getProfile() });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore the session when the app opens
  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    verifyToken()
      .then((data) => setUser(withProfile(data.decoded)))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  async function login(credentials, remember) {
    const data = await signIn(credentials);
    saveToken(data.token, remember);
    saveProfile({ name: data.user.name, email: data.user.email });
    const verified = await verifyToken();
    setUser(withProfile(verified.decoded));
  }

  function updateProfile(profile) {
    saveProfile(profile);
    setUser((current) => ({ ...current, ...profile }));
  }

  function logout() {
    clearToken();
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
