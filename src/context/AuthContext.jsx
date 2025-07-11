import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";
import { AuthContext } from "./auth-context";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); 
      setLoading(false);  
    }, (error) => {
      console.error("Lỗi xác thực:", error);
      setLoading(false); 
    });

    // Đảm bảo unsubscribe khi unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {!loading ? children : <div className="flex items-center justify-center min-h-screen">Đang tải...</div>}
    </AuthContext.Provider>
  );
};