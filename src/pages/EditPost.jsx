import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { db } from "../firebase-config";
import { useAuth } from "../context/useAuth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

const override = css`
  display: block;
  margin: 0 auto;
`;

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: { title: "", content: "" },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      toast.info("Vui lòng đăng nhập để chỉnh sửa bài viết!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate("/login");
      return;
    }

    const fetchPost = async () => {
      try {
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const postData = docSnap.data();
          if (postData.userId !== currentUser.uid) {
            toast.error("Bạn không có quyền chỉnh sửa bài viết này!", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
            navigate("/my-posts");
            return;
          }
          setValue("title", postData.title);
          setValue("content", postData.content);
        } else {
          toast.error("Bài viết không tồn tại!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          navigate("/my-posts");
        }
      } catch (error) {
        console.error("Error fetching post: ", error);
        setError("Đã có lỗi khi tải bài viết");
        toast.error("Đã có lỗi khi tải bài viết: " + error.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, currentUser, navigate, setValue]);

  const onSubmit = async (data) => {
    if (!data.title.trim() || !data.content.trim()) {
      setError("Tiêu đề và nội dung không được để trống");
      return;
    }
    try {
      const postRef = doc(db, "posts", id);
      await updateDoc(postRef, {
        title: data.title,
        content: data.content,
        timestamp: new Date(),
      });
      toast.success("Bài viết đã được cập nhật thành công!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate("/my-posts");
    } catch (error) {
      console.error("Error updating post: ", error);
      setError("Đã có lỗi khi cập nhật bài viết");
      toast.error("Đã có lỗi khi cập nhật bài viết: " + error.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ClipLoader color="#3498db" css={override} size={50} />
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-10">
      <div className="max-w-lg mx-auto bg-white px-4 py-4 sm:px-6 sm:py-6 rounded-xl shadow-lg">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
          Sửa bài viết
        </h1>

        {error && (
          <p className="text-red-500 text-center text-sm sm:text-base mb-4">
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3 sm:space-y-4"
        >
          <div>
            <label className="block mb-1" htmlFor="titleInput">
              <input
                {...register("title", {
                  required: "Tiêu đề không được để trống",
                })}
                className="w-full text-sm sm:text-base md:text-lg border-2 border-gray-300 p-2 sm:p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
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
          </div>

          <div>
            <label className="block mb-1" htmlFor="contentInput">
              <textarea
                {...register("content", {
                  required: "Nội dung không được để trống",
                })}
                className="w-full text-sm sm:text-base md:text-lg border-2 border-gray-300 p-2 sm:p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 h-32 resize-none"
                id="contentInput"
                placeholder="Nhập nội dung bài viết"
              />
              {errors.content && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.content.message}
                </p>
              )}
            </label>
          </div>

          <button
            type="submit"
            className="cursor-pointer w-full text-sm sm:text-base md:text-lg bg-gradient-to-r from-green-500 to-teal-400 text-white p-2 sm:p-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
          >
            Lưu thay đổi
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
