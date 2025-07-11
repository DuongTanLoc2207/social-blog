import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router"; 
import { db } from "../firebase-config";
import { useAuth } from "../context/useAuth";
import PostCard from "../components/PostCard";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else {
      const fetchPosts = async () => {
        try {
          const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
          const querySnapshot = await getDocs(q);
          const postData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            author: doc.data().author,
            title: doc.data().title,
            content: doc.data().content,
            timestamp: doc.data().timestamp,
          }));
          setPosts(postData);
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu post: ", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPosts();
    }
  }, [currentUser, navigate]);

  return (
    <div className="p-5 w-[50%] grid grid-cols-1 gap-6 mx-auto">
      {loading ? (
        <p className="flex items-center justify-center min-h-screen">Đang tải...</p>
      ) : posts.length === 0 ? (
        <p>chưa có bài viết nào</p>
      ) : (
        posts.map((post) => (
          <Link to={`/post/${post.id}`} key={post.id}>
            <PostCard author={post.author} title={post.title} content={post.content} timestamp={post.timestamp} />
          </Link>
        ))
      )}
    </div>
  );
};

export default Home;