import { onAuthStateChanged, signOut, User } from "firebase/auth";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";

// context type
type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;   // ✅ logout added
};

// default context
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ?? null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ logout function
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
