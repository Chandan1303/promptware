import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = localStorage.getItem('ecoguide_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      // Simulate Google login (in production, this would use actual OAuth)
      const mockUser = {
        uid: 'user-' + Date.now(),
        email: 'eco.champion@gmail.com',
        displayName: 'Eco Champion',
        photoURL: 'https://ui-avatars.com/api/?name=Eco+Champion&background=00BFA5&color=fff&size=256',
        isAnonymous: false
      };
      setUser(mockUser);
      localStorage.setItem('ecoguide_user', JSON.stringify(mockUser));
    } catch (error) {
      console.error("Sign in failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginAnonymously = async () => {
    setLoading(true);
    try {
      const mockUser = {
        uid: 'guest-' + Date.now(),
        email: null,
        displayName: 'Guest User',
        photoURL: null,
        isAnonymous: true
      };
      setUser(mockUser);
      localStorage.setItem('ecoguide_user', JSON.stringify(mockUser));
    } catch (error) {
      console.error("Anonymous Sign in failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      setUser(null);
      localStorage.removeItem('ecoguide_user');
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginAnonymously, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
