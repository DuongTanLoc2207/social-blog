import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase-config";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const PostCard = ({ id, author, title, content, timestamp, likes = [] }) => {
  const { currentUser } = useAuth();
  const [isLiked, setIsLiked] = useState(
    currentUser ? likes.includes(currentUser.uid) : false
  );
  const [likeCount, setLikeCount] = useState(likes.length);
  const [isLiking, setIsLiking] = useState(false);
  const navigate = useNavigate();

  const handleLike = async (event) => {
    event.stopPropagation(); 
    if (!currentUser) {
      toast.info("Vui lòng đăng nhập để thích bài viết!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    if (isLiking) return;

    setIsLiking(true);
    try {
      const postRef = doc(db, "posts", id);
      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(currentUser.uid),
        });
        setIsLiked(false);
        setLikeCount(likeCount - 1);
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(currentUser.uid),
        });
        setIsLiked(true);
        setLikeCount(likeCount + 1);
      }
    } catch (error) {
      console.error("Lỗi khi thích bài viết:", error);
      toast.error("Đã có lỗi xảy ra, vui lòng thử lại!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLiking(false);
    }
  };

  const handleCardClick = () => {
    if (window.getSelection().toString()) {
      return; 
    }
    navigate(`/post/${id}`);
  };

  return (
    <div
      className="bg-white shadow-md rounded-lg p-4 sm:p-5 hover:shadow-lg transition cursor-pointer"
      onClick={handleCardClick}
    >
      <h2 className="text-lg sm:text-xl font-bold text-blue-600">{title}</h2>
      <p className="text-sm sm:text-base md:text-lg text-gray-500 mb-2 mt-2">{author}</p>
      <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-2">{content.substring(0, 100)}...</p>
      <p className="text-sm sm:text-base md:text-lg text-gray-500">
        {timestamp?.toDate().toLocaleString("vi-VN")}
      </p>
      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={handleLike}
          className={`text-2xl ${
            isLiked ? "text-red-500" : "text-gray-400"
          } hover:text-red-400 transition-colors duration-200 ${
            isLiking ? "opacity-50" : ""
          }`}
          disabled={!currentUser || isLiking}
          aria-label={isLiked ? "Bỏ thích bài viết" : "Thích bài viết"}
        >
          {isLiking ? "⏳" : <span className="cursor-pointer">❤️</span>}
        </button>
        <span className="text-sm sm:text-base text-gray-600">{likeCount} {likeCount > 1 ? "Likes" : "Like"} </span>
      </div>
    </div>
  );
};

export default PostCard;