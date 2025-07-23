import { Link, useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
  getDoc,
  doc,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase-config";
import { useAuth } from "../context/useAuth";
import Layout from "../components/Layout";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";

const override = css`
  display: block;
  margin: 0 auto;
`;

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

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
        }
      } catch {
        alert("Đã có lỗi khi tải bài viết!");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, currentUser, navigate]);

  useEffect(() => {
    if (!id) return;

    const q = query(
      collection(db, `posts/${id}/comments`),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const commentData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(commentData);
      },
      (error) => {
        setCommentError(error);
      }
    );
    return () => unsubscribe();
  }, [id]);

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
    } catch {
      alert("Đã có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setCommentError("Bạn cần đăng nhập để bình luận.");
      return;
    }
    if (!commentText.trim()) {
      setCommentError("Bình luận không được để trống.");
      return;
    }

    setIsSubmittingComment(true);
    setCommentError(null);
    try {
      await addDoc(collection(db, `posts/${id}/comments`), {
        content: commentText.trim(),
        author: currentUser.displayName || currentUser.email || "Unknown",
        userId: currentUser.uid,
        timestamp: serverTimestamp(),
      });
      setCommentText("");
    } catch (error) {
      setCommentError("Đã có lỗi khi gửi bình luận: " + error.message);
    } finally {
      setIsSubmittingComment(false);
    }
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

  if (!post) {
    return (
      <Layout>
        <p className="flex items-center justify-center min-h-screen">
          Không tìm thấy bài viết
        </p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-screen-md mx-auto mt-4 px-4 sm:px-6 md:px-10 py-6 bg-white rounded-xl shadow-md">
        <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 leading-snug">
          {post.title}
        </h1>

        <div className="prose prose-xs sm:prose-sm md:prose lg:prose-lg text-gray-800 leading-relaxed mb-6">
          {post.content}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm text-gray-500 border-t pt-4 gap-3">
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
            <span className="flex items-center gap-1">
              👁️ {post.views} {post.views > 1 ? "views" : "view"}
            </span>
            <button
              onClick={handleLike}
              className={`text-base sm:text-lg ml-2 ${
                isLiked ? "text-red-500" : "text-gray-400"
              } hover:scale-110 hover:text-red-400 transition-transform duration-200`}
              disabled={!currentUser || isLiking}
            >
              {isLiking ? "⏳" : <span className="cursor-pointer">❤️</span>}
            </button>
            <span>
              {likeCount} {likeCount > 1 ? "likes" : "like"}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 opacity-80">
            <span className="font-medium text-gray-800 text-xs sm:text-sm">
              ✍️ {post.author}
            </span>
            <span className="font-medium text-gray-800 text-xs sm:text-sm">
              {post.timestamp?.toDate().toLocaleString("vi-VN")}
            </span>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-4">
            Bình luận
          </h3>

          {commentError && (
            <p className="text-red-500 text-center mb-4 text-sm sm:text-base">
              {commentError}
            </p>
          )}

          {currentUser ? (
            <form
              onSubmit={handleCommentSubmit}
              className="space-y-3 sm:space-y-4 mb-4"
            >
              <label htmlFor="commentInput" className="block">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  id="commentInput"
                  className="w-full text-sm sm:text-base border-2 border-gray-300 p-2 sm:p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 h-20 resize-none"
                  placeholder="Viết bình luận của bạn..."
                  required
                />
              </label>
              <button
                type="submit"
                disabled={isSubmittingComment}
                className="w-full sm:w-auto bg-blue-500 text-white text-sm sm:text-base p-2 sm:p-3 rounded-lg hover:bg-blue-600 transition-all duration-200 disabled:opacity-50"
              >
                {isSubmittingComment ? "Đang gửi..." : "Gửi bình luận"}
              </button>
            </form>
          ) : (
            <p className="text-gray-600 text-sm sm:text-base mb-6">
              Vui lòng{" "}
              <Link className="text-blue-600 hover:underline" to="/login">
                đăng nhập
              </Link>{" "}
              để bình luận.
            </p>
          )}

          <div className="space-y-3 sm:space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-600 text-sm sm:text-base">
                Chưa có bình luận nào.
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-start gap-2 sm:gap-3 py-2 sm:py-3 border-b border-gray-200"
                >
                  <div className="flex-shrink-0 w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs sm:text-sm">
                    {comment.author?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div className="flex flex-col">
                    <div className="bg-gray-100 rounded-2xl px-2 sm:px-3 py-1 sm:py-2 max-w-md sm:max-w-lg shadow-sm">
                      <p className="font-semibold text-xs sm:text-sm text-gray-800 mb-1">
                        {comment.author}
                      </p>
                      <p className="text-gray-700 text-xs sm:text-sm whitespace-pre-line break-words">
                        {comment.content}
                      </p>
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-400 mt-1 ml-2 sm:ml-2">
                      {comment.timestamp?.toDate().toLocaleString("vi-VN")}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PostDetail;
