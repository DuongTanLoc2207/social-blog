import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { db } from "../firebase-config";
import { useAuth } from "../context/useAuth";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import Layout from "../components/Layout";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";

const override = css`
  display: block;
  margin: 0 auto;
`;

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const q = query(
      collection(db, "posts"),
      where("userId", "==", currentUser.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, navigate]);

  const handleDelete = async (postId) => {
    if (window.confirm("Bạn có chắc muốn xóa bài viết này?")) {
      try {
        await deleteDoc(doc(db, "posts", postId));
        setPosts((prev) => prev.filter((post) => post.id !== postId));
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Đã có lỗi khi xóa bài viết");
      }
    }
  };

  const handleEdit = (postId) => {
    navigate(`/edit/${postId}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <ClipLoader color="#3498db" css={override} size={50} />
        </div>
      </Layout>
    );
  }

  if (posts.length === 0) {
    return (
      <Layout>
        <p className="text-center text-gray-600 text-sm sm:text-base p-6">
          Bạn chưa có bài viết nào.
        </p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-3 sm:px-4 md:px-6 py-6 max-w-screen-md mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center text-gray-800">
          Bài viết của tôi
        </h1>

        <div className="space-y-5">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white p-4 sm:p-5 rounded-lg shadow-md border border-gray-200"
            >
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
                {post.title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-2">
                {post.content.substring(0, 100)}...
              </p>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-2">
                Đăng lúc:{" "}
                {post.timestamp?.toDate().toLocaleString("vi-VN")}
              </p>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleEdit(post.id)}
                  className="text-xs sm:text-sm bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-xs sm:text-sm bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default MyPosts;
