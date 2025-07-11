import { useState } from "react";
import { useNavigate } from "react-router";
import { db } from "../firebase-config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/useAuth";

const CreatePost = () => {
  const [post, setPost] = useState({ title: "", content: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError("Bạn cần đăng nhập để tạo bài viết!");
      return;
    }
    if (!post.title.trim() || !post.content.trim()) {
      setError("Tiêu đề và nội dung không được để trống!");
      return;
    }
    setError(null); // Xóa lỗi cũ
    try {
      await addDoc(collection(db, "posts"), {
        title: post.title.trim(),
        content: post.content.trim(),
        author:
          currentUser.displayName ||
          currentUser.email ||
          currentUser.uid ||
          "Unknown",
        userId: currentUser.uid,
        timestamp: serverTimestamp(),
      });
      navigate("/");
    } catch (error) {
      setError("Lỗi khi tạo bài viết: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Tạo bài viết mới
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="titleInput" className="block">
            <input
              className="w-full border-2 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              type="text"
              id="titleInput"
              placeholder="Nhập tiêu đề"
              name="title"
              value={post.title}
              onChange={handleChange}
              required
            />
          </label>
          <label htmlFor="contentTextarea" className="block">
            <textarea
              className="w-full border-2 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 h-32 resize-none"
              id="contentTextarea"
              placeholder="Nhập nội dung bài viết"
              name="content"
              value={post.content}
              onChange={handleChange}
              required
            ></textarea>
          </label>
          <button
            type="submit"
            className="w-full text-lg bg-gradient-to-r from-blue-500 to-teal-400 text-white p-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
          >
            Đăng bài
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
