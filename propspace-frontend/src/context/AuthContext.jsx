import { createContext, useContext, useState, useCallback } from 'react';
import { loginRequest, registerRequest } from '../api/auth.js';
import { TOKEN_KEY, USER_KEY } from '../api/client.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize from storage so a refresh keeps the user signed in.
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  const persist = ({ token, ...profile }) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
    setUser(profile);
  };

  const login = useCallback(async (credentials) => {
    persist(await loginRequest(credentials));
  }, []);

  const register = useCallback(async (data) => {
    persist(await registerRequest(data));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  // Used by Account Settings after a profile update.
  const updateUser = useCallback((profile) => {
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
    setUser(profile);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
