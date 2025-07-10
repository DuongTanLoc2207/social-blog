import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";
import { Link, useNavigate } from "react-router";

const SignUp = () => {
  const [signUpInput, setSignUpInput] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = (e) => {
    const { name, value } = e.target;

    setSignUpInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await createUserWithEmailAndPassword(
        auth,
        signUpInput.email,
        signUpInput.password
      );
      console.log("tạo tài khoản thành công");
      navigate("/")
    } catch (error) {
      console.log(error);
    }
  };

  console.log(signUpInput);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold text-center mb-6">Đăng ký</h3>
        <label htmlFor="emailInput">
          <input
            className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="emailInput"
            type="text"
            value={signUpInput.email}
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
            value={signUpInput.password}
            name="password"
            placeholder="Nhập mật khẩu của bạn..."
            onChange={handleLogin}
          />
        </label>
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
          onClick={handleSubmit}
        >
          Đăng ký
        </button>
        <p className="text-center text-sm mt-4">
          Bạn đã có tài khoản?
          <Link to="/login" className="text-blue-600 hover:underline ml-1">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
