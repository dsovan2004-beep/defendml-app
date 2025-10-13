// src/contexts/AuthContext.tsx
// Updated AuthContext with Role-Based Access Control

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { UserRole, User } from '@/types/roles';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // For now, demo login with role assignment
      
      // Demo users with different roles
      const demoUsers: Record<string, User> = {
        'admin@defendml.com': {
          id: '1',
          email: 'admin@defendml.com',
          name: 'Admin User',
          role: UserRole.SUPER_ADMIN,
          department: 'IT',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          isActive: true,
        },
        'analyst@defendml.com': {
          id: '2',
          email: 'analyst@defendml.com',
          name: 'Security Analyst',
          role: UserRole.SECURITY_ANALYST,
          department: 'Security',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          isActive: true,
        },
        'viewer@defendml.com': {
          id: '3',
          email: 'viewer@defendml.com',
          name: 'Viewer User',
          role: UserRole.VIEWER,
          department: 'Engineering',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          isActive: true,
        },
      };

      // Simple demo authentication
      if (demoUsers[email] && password === 'demo123') {
        const loggedInUser = demoUsers[email];
        setUser(loggedInUser);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        router.push('/overview');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
