// context/authContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import { loginWithEmail, logout as doLogout, registerAndCreateProfile } from "@/services/authService";

type AuthCtx = {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  register: (form: { name: string; email: string; password: string; location: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;
  }, []);

  return (
    <Ctx.Provider
      value={{
        user,
        login: async (email, password) => {
          await loginWithEmail(email, password);
        },
        register: async (form) => {
          await registerAndCreateProfile(form);
        },
        logout: async () => {
          await doLogout();
        },
      }}
    >
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => useContext(Ctx);
