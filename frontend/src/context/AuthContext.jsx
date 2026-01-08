import { createContext, useState, useEffect } from "react";

// Helper to decode JWT token
const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) return storedRole;
    // Try to decode from token if role not stored
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const decoded = decodeToken(storedToken);
      return decoded?.role || null;
    }
    return null;
  });

  useEffect(() => {
    // Sync role from token if token exists but role doesn't
    if (token && !role) {
      const decoded = decodeToken(token);
      if (decoded?.role) {
        setRole(decoded.role);
        localStorage.setItem("role", decoded.role);
      }
    }
  }, [token, role]);

  const login = (newToken, newRole) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    setToken(newToken);
    setRole(newRole);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
