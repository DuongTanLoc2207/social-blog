import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Header from "./components/Header.jsx";
import SignUp from "./pages/SignUp.jsx";

function App() {
  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          {/* Thêm các route khác nếu cần */}
        </Routes>
      </div>
    </>
  );
}

export default App;
