import { useParams } from "react-router";
import { useEffect, useState } from "react";
import {
  getDoc,
  doc,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase-config";
import { useAuth } from "../context/useAuth";
import Layout from "../components/Layout";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          await updateDoc(docRef, {
            views: increment(1),
          });

          const postData = docSnap.data();
          const currentViews = postData.views || 0;
          const likes = postData.likes || [];

          setPost({
            ...postData,
            views: currentViews + 1,
            likes,
          });
          setIsLiked(currentUser && likes.includes(currentUser.uid));
          setLikeCount(likes.length);
        } else {
          console.log("Không tìm thấy bài viết");
        }
      } catch (error) {
        console.error("Lỗi khi lấy bài viết:", error);
        alert("Đã có lỗi khi tải bài viết!");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, currentUser]);

  const handleLike = async () => {
    if (!currentUser) {
      alert("Vui lòng đăng nhập để like bài viết!");
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
      console.error("Lỗi khi like bài viết:", error);
      alert("Đã có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsLiking(false);
    }
  };

  if (loading)
    return (
      <Layout>
        <p className="flex items-center justify-center min-h-screen">
          Đang tải...
        </p>
      </Layout>
    );
  if (!post)
    return (
      <Layout>
        <p className="flex items-center justify-center min-h-screen">
          Không tìm thấy bài viết
        </p>
      </Layout>
    );

  return (
    <Layout>
      <div className="max-w-3xl mt-10 mx-auto px-6 py-10 bg-white rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 leading-snug">
          {post.title}
        </h1>
        <div className="prose prose-lg text-gray-800 leading-relaxed mb-6">
          {post.content}
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
          <div className="flex items-center">
            <span className="flex items-center gap-1">
              👁️ {post.views} {post.views > 1 ? "views" : "view"}
            </span>
            <button
              onClick={handleLike}
              className={`text-lg ml-4 mr-1 ${isLiked ? "text-red-500" : "text-gray-400"} hover:scale-110 hover:text-red-400 transition-transform duration-200`}
              disabled={!currentUser || isLiking}
            >
              {isLiking ? "⏳" : "❤️"}
            </button>
            <span>{likeCount} {likeCount > 0 ? "likes" : "like"}</span>
          </div>
          <div className="flex items-center gap-3 opacity-80">
            <span className="font-medium text-black">✍️ {post.author}</span>
            <span className="font-medium text-black">
              {post.timestamp?.toDate().toLocaleString("vi-VN")}
            </span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PostDetail;