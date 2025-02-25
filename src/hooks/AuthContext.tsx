"use client";

import { createContext, useContext, useState } from "react";
import { Models } from "node-appwrite";

interface AuthContextType {
  currentUser: Models.User<Models.Preferences> | undefined;
  setCurrentUser: (user: Models.User<Models.Preferences> | undefined) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({
  initialUser,
  children,
}: {
  initialUser: AuthContextType["currentUser"];
  children: React.ReactNode;
}) => {
  const [currentUser, setCurrentUser] = useState(initialUser);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
