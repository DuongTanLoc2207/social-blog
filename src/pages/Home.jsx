import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { db } from "../firebase-config";
import { useAuth } from "../context/useAuth";
import PostCard from "../components/PostCard";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import Layout from "../components/Layout";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else {
      const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
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
          setLoading(false);
        },
        (error) => {
          console.error("Lỗi khi lấy dữ liệu bài viết:", error);
          alert("Đã có lỗi khi tải bài viết!");
          setLoading(false);
        }
      );
      return () => unsubscribe();
    }
  }, [currentUser, navigate]);

  return (
    <Layout>
      <div className="p-5 w-[50%] grid grid-cols-1 gap-6 mx-auto">
        {loading ? (
          <p className="flex items-center justify-center min-h-screen text-gray-600">
            Đang tải...
          </p>
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