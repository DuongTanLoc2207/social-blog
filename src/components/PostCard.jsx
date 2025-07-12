import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase-config";
import { useNavigate } from "react-router";

const PostCard = ({ id, author, title, content, timestamp, likes = [] }) => {
  const { currentUser } = useAuth();
  const [isLiked, setIsLiked] = useState(
    currentUser ? likes.includes(currentUser.uid) : false
  );
  const [likeCount, setLikeCount] = useState(likes.length);
  const [isLiking, setIsLiking] = useState(false);
  const navigate = useNavigate();

  const handleLike = async () => {
    if (!currentUser) {
      alert("Vui lòng đăng nhập để thích bài viết!");
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
      alert("Đã có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsLiking(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/post/${id}`);
  };

  return (
    <div
      className="bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition"
      onClick={handleCardClick}
    >
      <h2 className="text-xl font-bold text-blue-600">{title}</h2>
      <p className="text-sm text-gray-500 mb-2">{author}</p>
      <p className="text-gray-700">{content}</p>
      <p className="text-gray-500">
        {timestamp?.toDate().toLocaleString("vi-VN")}
      </p>
      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleLike();
          }}
          className={`text-2xl ${
            isLiked ? "text-red-500" : "text-gray-400"
          } hover:text-red-400 transition-colors duration-200 ${
            isLiking ? "opacity-50" : ""
          }`}
          disabled={!currentUser || isLiking}
          aria-label={isLiked ? "Bỏ thích bài viết" : "Thích bài viết"}
        >
          {isLiking ? "⏳" : "❤️"}
        </button>
        <span className="text-gray-600">{likeCount} lượt thích</span>
      </div>
    </div>
  );
};

export default PostCard;
