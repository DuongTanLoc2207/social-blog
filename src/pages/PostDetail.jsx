import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { getDoc, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase-config";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);

        await updateDoc(docRef, {
          views: increment(1),
        });

        if (docSnap.exists()) {
          const postData = docSnap.data();
          const currentViews = postData.views || 0;

          setPost({
            ...postData,
            views: currentViews + 1,
          });
        } else {
          console.log("Không tìm thấy bài viết");
        }
      } catch (error) {
        console.error("Lỗi khi lấy bài viết:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading)
    return (
      <p className="flex items-center justify-center min-h-screen">
        Đang tải...
      </p>
    );
  if (!post)
    return (
      <p className="flex items-center justify-center min-h-screen">
        Không tìm thấy bài viết
      </p>
    );

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 mb-2">Tác giả: {post.author}</p>
      <p>Ngày đăng: {post.timestamp?.toDate().toLocaleString("vi-VN")}</p>
      <div className="mt-4">{post.content}</div>
      <p>Tổng lượt xem: {post.views}</p>
    </div>
  );
};

export default PostDetail;
