import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";
import { AuthContext } from "./auth-context";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;
    const timer = setTimeout(() => {
      try {
        unsubscribe = onAuthStateChanged(auth, (user) => {
          setCurrentUser(user);
        });
      } catch (error) {
        console.error("Error in auth state change:", error);
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => {
      if (unsubscribe) unsubscribe();
      clearTimeout(timer); 
    };
  }, []);

  if (loading) return <div className="mt-[20%]">Loading...</div>;
  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
