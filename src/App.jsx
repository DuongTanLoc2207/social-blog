import "./App.css";
import { Routes, Route } from "react-router";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Header from "./components/Header.jsx";
import SignUp from "./pages/SignUp.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx"
import CreatePost from "./pages/CreatePost.jsx";
import Layout from "./components/Layout.jsx";

function App() {
  return (
    <>
      {/* <div className="min-h-screen bg-gray-100"> */}
        {/* <Header /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/post/:id" element={<PostDetail/>}/>
          <Route element={<PrivateRoute/>}>
            <Route path="/create" element={<CreatePost/>} />
            <Route path="/my-posts" element={<Layout/>} />
          </Route>
        </Routes>
      {/* </div> */}
    </>
  );
}


export default App;
