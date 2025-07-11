import { useParams } from "react-router";

const PostDetail = () => {
    const { id } = useParams(); // Lấy id từ URL
    // Logic lấy dữ liệu từ Firestore sẽ thêm ở Ngày 5
    return (
      <div className="p-5">
        <h1>Chi tiết bài viết ID: {id}</h1>
        <p>(Placeholder, sẽ hoàn thiện ở Ngày 5)</p>
      </div>
    );
  };
  
  export default PostDetail;