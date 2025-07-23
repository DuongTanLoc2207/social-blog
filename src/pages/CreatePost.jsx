import { useState } from "react";
import { useNavigate } from "react-router";
import { db } from "../firebase-config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/useAuth";
import { useForm } from "react-hook-form";
import Layout from "../components/Layout";

const CreatePost = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    if (!currentUser) {
      setError("Bạn cần đăng nhập để tạo bài viết!");
      return;
    }
    try {
      await addDoc(collection(db, "posts"), {
        title: data.title.trim(),
        content: data.content.trim(),
        author: currentUser.displayName || currentUser.email || "Unknown",
        userId: currentUser.uid,
        timestamp: serverTimestamp(),
        likes: [],
        views: 0,
      });
      navigate("/");
    } catch (error) {
      setError("Lỗi khi tạo bài viết: " + error.message);
    }
  };

  return (
    <Layout>
      <div className="py-8 sm:py-10">
        <div className="max-w-lg mx-auto bg-white px-4 py-4 sm:px-6 sm:py-6 rounded-xl shadow-lg">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
            Tạo bài viết mới
          </h2>

          {error && (
            <p className="text-red-500 text-center text-sm sm:text-base mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
            <label htmlFor="titleInput" className="block">
              <input
                {...register("title", { required: "Tiêu đề không được để trống" })}
                className="w-full text-sm sm:text-base border-2 border-gray-300 p-2 sm:p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                type="text"
                id="titleInput"
                placeholder="Nhập tiêu đề"
              />
              {errors.title && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </label>

            <label htmlFor="contentTextarea" className="block">
              <textarea
                {...register("content", { required: "Nội dung không được để trống" })}
                className="w-full text-sm sm:text-base border-2 border-gray-300 p-2 sm:p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 h-32 resize-none"
                id="contentTextarea"
                placeholder="Nhập nội dung bài viết"
              />
              {errors.content && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.content.message}
                </p>
              )}
            </label>

            <button
              type="submit"
              className="w-full text-base sm:text-lg bg-gradient-to-r from-blue-500 to-teal-400 text-white p-2 sm:p-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
            >
              Đăng bài
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreatePost;
