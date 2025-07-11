const PostCard = ({ author, title, content, timestamp }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition">
      <h2 className="text-xl font-bold text-blue-600">{title}</h2>
      <p className="text-sm text-gray-500 mb-2">{author}</p>
      <p className="text-gray-700">{content}</p>
      <p className="text-gray-500">{timestamp?.toDate().toLocaleString()}</p>
    </div>
  );
};

export default PostCard;
