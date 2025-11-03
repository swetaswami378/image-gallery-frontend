import { createContext, useState, useEffect } from 'react';
import API from '../api/api';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    if (u && u !== 'undefined') {
      return JSON.parse(u);
    }
    return null;
  });

  useEffect(() => {
    // could validate token on mount
  }, []);

const saveAuth = (user, token) => {
  localStorage.setItem("accessToken", token.access);
  localStorage.setItem("user", JSON.stringify(user));
  setUser(user);
};

const login = async (username, password) => {
  const res = await API.post("/api/auth/login", { username, password });
  saveAuth(username, res.data);
  toast.success("Logged in!");
};

const logout = async () => {
  // await API.post("/api/auth/logout");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  setUser(null);
  toast.info("Logged out");
};

  const register = async (username, email, password) => {
    const res = await API.post('/api/auth/register', { username, email, password });
    saveAuth(res.data.user, res.data.token);
    toast.success('Registered!');
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
