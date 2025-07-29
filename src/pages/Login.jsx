import { useForm, useWatch } from "react-hook-form";
import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase-config";
import { Link, useNavigate } from "react-router";
import { ClipLoader } from "react-spinners";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";

const Login = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const email = useWatch({ control, name: "email" });
  const password = useWatch({ control, name: "password" });

  useEffect(() => {
    if (serverError) setServerError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, password]);

  const onSubmit = async (data) => {
    setServerError("");
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast.success("Đăng nhập thành công!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate("/");
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        setServerError("Email hoặc mật khẩu không đúng.");
      } else {
        setServerError("Lỗi đăng nhập: " + error.message);
        toast.error("Lỗi đăng nhập:" + error.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Đăng nhập với Google thành công!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate("/");
    } catch (error) {
      console.error("Lỗi đăng nhập với Google:", error.message);
      toast.error("Lỗi đăng nhập với Google: " + error.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="flex items-center justify-center px-2 sm:px-4 py-10 sm:py-16">
      <div className="w-full max-w-sm bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md">
        <h3 className="text-xl sm:text-2xl font-semibold text-center mb-6">
          Đăng nhập
        </h3>

        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="emailInput">
            <input
              className=" w-full border text-sm sm:text-base md:text-lg border-gray-300 rounded px-4 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="emailInput"
              type="text"
              placeholder="Nhập email của bạn..."
              {...register("email", {
                required: "Email không được để trống",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email không hợp lệ",
                },
              })}
            />
          </label>
          {errors.email && (
            <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>
          )}

          <div className="relative">
            <input
              className="w-full text-sm sm:text-base md:text-lg border border-gray-300 rounded px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              id="passInput"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu của bạn..."
              {...register("password", {
                required: "Mật khẩu không được để trống",
                minLength: {
                  value: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự",
                },
              })}
            />
            <div
              className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </div>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mb-2">
              {errors.password.message}
            </p>
          )}

          {serverError && (
            <p className="text-red-500 text-sm text-center mb-4">
              {serverError}
            </p>
          )}

          <button
            className="w-full text-sm sm:text-base md:text-lg bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition mb-1 flex items-center justify-center cursor-pointer"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <ClipLoader size={20} color="#ffffff" /> : "Đăng nhập"}
          </button>
        </form>

        <button
          className="w-full text-sm sm:text-base md:text-lg bg-blue-800 hover:bg-blue-900 text-white py-2 px-4 rounded cursor-pointer"
          onClick={handleGoogleLogin}
        >
          Đăng nhập với Google
        </button>

        <p className="text-center text-sm sm:text-base md:text-lg mt-4">
          Bạn chưa có tài khoản?
          <Link
            to="/signup"
            className="text-blue-600 text-sm sm:text-base md:text-lg hover:text-blue-900 ml-1"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
