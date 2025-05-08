import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import axios from "axios";

interface User {
  id: string;
  email: string;
  name: string;
  googleId?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
      logout();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          email,
          password,
        }
      );
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      setToken(token);
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        {
          name,
          email,
          password,
        }
      );
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      setToken(token);
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const loginWithGoogle = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        loginWithGoogle,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
