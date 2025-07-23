import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { db } from "../firebase-config";
import { useAuth } from "../context/useAuth";
import PostCard from "../components/PostCard";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";
import Layout from "../components/Layout";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";

const override = css`
  display: block;
  margin: 0 auto;
`;

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return; // Ngăn không chạy tiếp nếu chưa đăng nhập
    }

    const q = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc"),
      limit(10)
    );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const postData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          author: doc.data().author,
          title: doc.data().title,
          content: doc.data().content,
          timestamp: doc.data().timestamp,
          likes: doc.data().likes || [],
        }));
        setPosts(postData);
        console.log("Posts loaded in Home:", postData); // Debug
        setLoading(false);
      },
      (error) => {
        console.error("Lỗi khi lấy dữ liệu bài viết:", error);
        alert("Đã có lỗi khi tải bài viết!");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [currentUser, navigate]);

  return (
    <Layout>
      <div className="p-2 sm:p-4 md:p-5 grid grid-cols-1 gap-4 sm:gap-6 mx-auto max-w-[80%] sm:max-w-[60%] md:max-w-[50%]">
        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <ClipLoader color="#3498db" css={override} size={50} />
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-600">Chưa có bài viết nào</p>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              author={post.author}
              title={post.title}
              content={post.content}
              timestamp={post.timestamp}
              likes={post.likes}
            />
          ))
        )}
      </div>
    </Layout>
  );
};

export default Home;
