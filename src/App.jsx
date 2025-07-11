import "./App.css";
import { Routes, Route } from "react-router";
import "./App.css";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Header from "./components/Header.jsx";
import SignUp from "./pages/SignUp.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx"

function App() {
  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/post/:id" element={<PostDetail/>}/>
          <Route element={<PrivateRoute/>}>
            <Route path="/create" element={<div>Create Post Page</div>} />
            <Route path="/my-posts" element={<div>My Posts Page</div>} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
