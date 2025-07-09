import PostCard from "../components/PostCard";

const Home = () => {
  const posts = [
    {
      id: 1,
      title: "Tôi học React như thế nào?",
      author: "Kevin",
      description: "Chia sẻ hành trình học React từ con số 0...",
    },
    {
      id: 2,
      title: "Tips Tailwind bạn nên biết",
      author: "Linh",
      description: "Tailwind không chỉ là utility CSS đâu nhé...",
    },
  ];

  return (
    <div className="p-5 w-[50%] grid grid-cols-1 gap-6 mx-auto">
      {posts.map((post) => (
        <PostCard key={post.id} {...post} />
      ))}
    </div>
  );
};

export default Home;
