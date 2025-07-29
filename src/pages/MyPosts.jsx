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
import { toast } from "react-toastify";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import ConfirmModal from "../components/ConfirmModal"; // Thêm import

const override = css`
  display: block;
  margin: 0 auto;
`;

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // State cho modal
  const [postIdToDelete, setPostIdToDelete] = useState(null); // ID bài viết cần xóa
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      toast.info("Vui lòng đăng nhập để xem bài viết của bạn!", {
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

    const q = query(
      collection(db, "posts"),
      where("userId", "==", currentUser.uid)
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const postData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postData);
        setLoading(false);
      },
      (error) => {
        console.error("Lỗi khi lấy dữ liệu bài viết:", error);
        toast.error("Đã có lỗi khi tải bài viết: " + error.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser, navigate]);

  const handleDelete = async (event, postId) => {
    event.stopPropagation();
    setPostIdToDelete(postId); // Lưu ID bài viết
    setIsModalOpen(true); // Mở modal
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, "posts", postIdToDelete));
      toast.success("Bài viết đã được xóa thành công!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setPosts((prev) => prev.filter((post) => post.id !== postIdToDelete));
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Đã có lỗi khi xóa bài viết: " + error.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsModalOpen(false); // Đóng modal
      setPostIdToDelete(null); // Xóa ID
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false); // Đóng modal
    setPostIdToDelete(null); // Xóa ID
  };

  const handleEdit = (event, postId) => {
    event.stopPropagation();
    navigate(`/edit/${postId}`);
  };

  const handleCardClick = (event, postId) => {
    if (window.getSelection().toString()) {
      return;
    }
    navigate(`/post/${postId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ClipLoader color="#3498db" css={override} size={50} />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <p className="text-center text-gray-600 text-sm sm:text-base p-6">
        Bạn chưa có bài viết nào.
      </p>
    );
  }

  return (
    <>
      <div className="px-3 sm:px-4 md:px-6 py-6 max-w-screen-md mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center text-gray-800">
          Bài viết của tôi
        </h1>

        <div className="space-y-5">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={(event) => handleCardClick(event, post.id)}
              className="bg-white p-4 sm:p-5 rounded-lg shadow-md border border-gray-200 cursor-pointer"
            >
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
                {post.title}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-2">
                {post.content.substring(0, 100)}...
              </p>
              <p className="text-sm sm:text-base md:text-lg text-gray-500 mt-2">
                Đăng lúc: {post.timestamp?.toDate().toLocaleString("vi-VN")}
              </p>
              <p className="text-sm sm:text-base md:text-lg text-gray-500 mt-2">
                Tác giả: {post.author}
              </p>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={(event) => handleEdit(event, post.id)}
                  className="text-xs sm:text-sm md:text-base bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 cursor-pointer"
                >
                  Sửa
                </button>
                <button
                  onClick={(event) => handleDelete(event, post.id)}
                  className="text-xs sm:text-sm md:text-base bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 cursor-pointer"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Xác nhận xóa bài viết"
        message="Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác."
      />
    </>
  );
};

export default MyPosts;
