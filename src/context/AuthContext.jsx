import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, getDocs, query, collection, where, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import { AuthContext } from "./auth-context";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";

const override = css`
  display: block;
  margin: 0 auto;
`;

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        setCurrentUser(user);
        if (user) {
          try {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const userData = docSnap.data();
              setDisplayName(userData.displayName || user.email);
            } else {
              const initialDisplayName = user.displayName || user.email;
              await setDoc(docRef, {
                email: user.email,
                displayName: initialDisplayName,
                createdAt: new Date(),
              });
              setDisplayName(initialDisplayName);
            }
          } catch (error) {
            console.error("Lỗi khi lấy hoặc tạo tài liệu người dùng:", error.message);
            setDisplayName(user.email);
          }
        } else {
          setDisplayName("");
        }
        setLoading(false);
      },
      (error) => {
        console.error("Lỗi xác thực:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const updateDisplayName = async (newName) => {
    if (!currentUser) return;
    try {
      // Cập nhật displayName trong collection users
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, { displayName: newName, updatedAt: new Date() }, { merge: true });

      // Cập nhật author trong tất cả bài viết của người dùng trong collection posts
      const postsQuery = query(
        collection(db, "posts"),
        where("userId", "==", currentUser.uid)
      );
      const postsSnapshot = await getDocs(postsQuery);
      const updatePostPromises = postsSnapshot.docs.map(async (postDoc) => {
        await updateDoc(postDoc.ref, { author: newName });
      });

      // Cập nhật author trong tất cả bình luận của người dùng
      const commentsPromises = [];
      const posts = await getDocs(collection(db, "posts"));
      for (const postDoc of posts.docs) {
        const commentsQuery = query(
          collection(db, `posts/${postDoc.id}/comments`),
          where("userId", "==", currentUser.uid)
        );
        const commentsSnapshot = await getDocs(commentsQuery);
        commentsSnapshot.docs.forEach((commentDoc) => {
          commentsPromises.push(
            updateDoc(commentDoc.ref, { author: newName })
          );
        });
      }

      // Thực hiện tất cả các cập nhật đồng thời
      await Promise.all([...updatePostPromises, ...commentsPromises]);

      // Cập nhật displayName trong context
      setDisplayName(newName);
    } catch (error) {
      console.error("Lỗi khi cập nhật displayName:", error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, displayName, loading, updateDisplayName }}>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <ClipLoader color="#3498db" css={override} size={50} />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};