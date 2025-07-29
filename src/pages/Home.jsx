import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { db } from "../firebase-config";
import { useAuth } from "../context/useAuth";
import PostCard from "../components/PostCard";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";

const override = css`
  display: block;
  margin: 0 auto;
`;

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Tải ban đầu
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const loadInitialPosts = async () => {
      try {
        const q = query(collection(db, "posts"), orderBy("timestamp", "desc"), limit(5));
        const snapshot = await getDocs(q);
        const postData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(postData);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === 5);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải bài viết:", error);
        toast.error("Không tải được bài viết");
        setLoading(false);
      }
    };

    loadInitialPosts();
  }, [currentUser, navigate]);

  // Tải thêm khi cuộn
  const fetchMorePosts = async () => {
    if (!lastVisible) return;

    const q = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc"),
      startAfter(lastVisible),
      limit(5)
    );

    const snapshot = await getDocs(q);
    const newPosts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setPosts((prev) => [...prev, ...newPosts]);
    setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    setHasMore(snapshot.docs.length === 5);
  };

  // Realtime cho bài mới nhất
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const latestDoc = snapshot.docs[0];
        const newPost = {
          id: latestDoc.id,
          ...latestDoc.data(),
        };

        setPosts((prev) => {
          if (prev.length === 0 || prev[0].id !== newPost.id) {
            return [newPost, ...prev];
          }
          return prev;
        });
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <div className="p-2 sm:p-4 md:p-5 mx-auto max-w-[80%] sm:max-w-[70%] md:max-w-[60%]">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <ClipLoader color="#3498db" css={override} size={50} />
        </div>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-600">Chưa có bài viết nào</p>
      ) : (
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchMorePosts}
          hasMore={hasMore}
          loader={
            <div className="flex items-center justify-center py-6">
              <ClipLoader color="#3498db" css={override} size={40} />
            </div>
          }
          endMessage={
            <p className="text-center text-gray-400 mt-4">Bạn đã xem hết bài viết.</p>
          }
          scrollThreshold={0.5}
        >
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                author={post.author}
                title={post.title}
                content={post.content}
                timestamp={post.timestamp}
                likes={post.likes}
              />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};

export default Home;