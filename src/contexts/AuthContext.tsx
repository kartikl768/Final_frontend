import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import type { User } from "../data";
import * as authApi from "../services/api/auth";

interface DecodedToken {
  sub?: string;
  userId?: number;
  email?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  exp?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Partial<User>) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = sessionStorage.getItem("rms_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!sessionStorage.getItem("rms_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("rms_token");
    if (token && !user) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const mapped: User = {
          UserId: Number(decoded.userId || decoded.sub),
          Email: decoded.email || "",
          Role: decoded.role || "",
          FirstName: decoded.firstName || "",
          LastName: decoded.lastName || "",
          session_token: token,
        };
        setUser(mapped);
        setIsAuthenticated(true);
      } catch {
        sessionStorage.removeItem("rms_token");
        sessionStorage.removeItem("rms_user");
        setUser(null);
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) sessionStorage.setItem("rms_user", JSON.stringify(user));
    else sessionStorage.removeItem("rms_user");
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await authApi.loginUser(email, password);
      if (res.token) {
        sessionStorage.setItem("rms_token", res.token);
        const mapped: User = {
          UserId: res.userId,
          Email: res.email,
          Role: res.role,
          FirstName: res.firstName || "",
          LastName: res.lastName || "",
          session_token: res.token,
        };
        setUser(mapped);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (err: any) {
      console.error("Login error", err);
      return false;
    }
  };

  const signup = async (userData: Partial<User>): Promise<boolean> => {
    try {
      const res = await authApi.registerUser({
        email: userData.Email || "",
        password: userData.Password || "",
        firstName: userData.FirstName || "",
        lastName: userData.LastName || "",
        phone: userData.Phone || "",
      });
      if (res.token) {
        sessionStorage.setItem("rms_token", res.token);
        const mapped: User = {
          UserId: res.userId,
          Email: res.email,
          Role: res.role,
          FirstName: res.firstName || userData.FirstName || "",
          LastName: res.lastName || userData.LastName || "",
          session_token: res.token,
        };
        setUser(mapped);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (err: any) {
      console.error("Signup error", err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem("rms_token");
    sessionStorage.removeItem("rms_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};