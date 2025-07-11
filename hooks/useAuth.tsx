
import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../services/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isProfessor: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isProfessor: false,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfessor, setIsProfessor] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // In a real app, you'd verify the custom claim from the ID token.
        // For this demo, we'll assume any logged-in user is a professor.
        // const idTokenResult = await user.getIdTokenResult();
        // setIsProfessor(idTokenResult.claims.role === 'professor');
        setIsProfessor(true); // DEMO: Assume professor role
      } else {
        setUser(null);
        setIsProfessor(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = { user, loading, isProfessor };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
