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
  QuerySnapshot,
} from "firebase/firestore";
import Layout from "../components/Layout";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/loign");
    }

    setLoading(true);
    const q = query(
      collection(db, "posts"),
      where("userId", "==", currentUser.uid)
    );
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const postData = QuerySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, navigate]);

  const handleDelete = async (postId) => {
    if (window.confirm("Bạn có chắc muốn xóa bài viết này")) {
      try {
        await deleteDoc(doc(db, "posts", postId));
        setPosts(posts.filter((post) => post.id !== postId));
      } catch (error) {
        console.error("Error deletign post: ", error);
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
        <p className="flex items-center justify-center min-h-screen text-gray-600">
          Đang tải...
        </p>
      </Layout>
    );
  }

  if (posts.length === 0) {
    return (
      <Layout>
        <p className="text-center text-gray-600 p-5">
          Bạn chưa có bài viết nào.
        </p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-5 w-[70%] mx-auto">
        <h1 className="text-2xl font-bold mb-4">Bài viết của tôi</h1>
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white p-4 rounded-lg shadow-md border"
            >
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-600 mt-2">
                {post.content.substring(0, 100)}...
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Đăng lúc: {post.timestamp?.toDate().toLocaleString("vi-VN")}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEdit(post.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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

export default MyPosts
