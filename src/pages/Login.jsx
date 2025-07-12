import { useState } from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase-config";
import { Link, useNavigate } from "react-router";
import Layout from "../components/Layout";

const Login = () => {
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const handleLogin = (e) => {
    const { name, value } = e.target;
    setLoginInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      console.log("Đăng nhập Google thành công:", userCredential.user);
      navigate("/");
    } catch (error) {
      console.error("Lỗi đăng nhập với Google:", error.message);
    }
  };

  const handleSubmit = async () => {
    try {
      const { email, password } = loginInput;
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      navigate("/");
      console.log("Đăng nhập thành công:", userCredential.user);
    } catch (error) {
      console.error("Lỗi đăng nhập:", error.message);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center mt-10">
        <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-center mb-6">Đăng nhập</h3>
          <label htmlFor="emailInput">
            <input
              className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="emailInput"
              type="text"
              value={loginInput.email}
              name="email"
              placeholder="Nhập email của bạn..."
              onChange={handleLogin}
            />
          </label>
          <label htmlFor="passInput">
            <input
              className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="passInput"
              type="password"
              value={loginInput.password}
              name="password"
              placeholder="Nhập mật khẩu của bạn..."
              onChange={handleLogin}
            />
          </label>
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition mb-2"
            onClick={handleSubmit}
          >
            Đăng nhập
          </button>
          <button
            className="w-full bg-blue-800 hover:bg-blue-900 text-white py-2 px-4 rounded"
            onClick={handleGoogleLogin}
          >
            Đăng nhập với Google
          </button>
          <p className="text-center text-sm mt-4">
            Bạn chưa có tài khoản?
            <Link to="/signup" className="text-blue-600 hover:underline ml-1">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Login;