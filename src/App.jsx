import "./App.css";
import { Routes, Route } from "react-router";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import MyPosts from "./pages/MyPosts.jsx";
import EditPost from "./pages/EditPost.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route element={<PrivateRoute />}>
          <Route path="/create" element={<CreatePost />} />
          <Route path="/my-posts" element={<MyPosts />} />
          <Route path="/edit/:id" element={<EditPost />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
