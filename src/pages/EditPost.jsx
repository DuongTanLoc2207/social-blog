import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { db } from "../firebase-config";
import { useAuth } from "../context/useAuth";
import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import Layout from "../components/Layout";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          const postData = docSnap.data();
          if (postData.userId !== currentUser.uid) {
            navigate("/my-posts");
            return;
          }
          setTitle(postData.title);
          setContent(postData.content);
        } else {
          navigate("/my-posts");
        }
      } catch (error) {
        console.error("Error fetching post: ", error);
        setError("Đã có lỗi khi tải bài viết");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Tiêu đề và nội dung không được để trống");
      return;
    }

    try {
      const postRef = doc(db, "posts", id);
      await updateDoc(postRef, {
        title,
        content,
        timestamp: new Date(),
      });
      navigate("/my-posts");
    } catch (error) {
      console.error("Error updating post: ", error);
      setError("Đã có lỗi khi cập nhật bài viết");
    }
  };

  if (loading) {
    return (
      <Layout>
        <p className="flex items-center justify-center min-h-screen text-gray-600">
          Đang tải...
        </p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-5 w-[70%] mx-auto">
        <h1 className="text-2xl font-bold mb-4">Sửa bài viết</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1" htmlFor="titleInput">
              <input
                type="text"
                id="titleInput"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </label>
          </div>
          <div>
            <label className="block mb-1" htmlFor="ContentInput">
              <textarea
                type="text"
                id="ContentInput"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border p-2 rounded h-40"
              />
            </label>
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Lưu thay đổi
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditPost;
