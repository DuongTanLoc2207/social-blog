import { useAuth } from "../context/useAuth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { updatePassword } from "firebase/auth";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { css } from "@emotion/react";

const override = css`
  display: block;
  margin: 0 auto;
`;

const UserProfile = () => {
  const {
    currentUser,
    displayName,
    loading: authLoading,
    updateDisplayName,
  } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { displayName: displayName || "", newPassword: "" },
  });

  const onSubmit = async (data) => {
    setMessage(null);
    if (!data.displayName.trim()) {
      setMessage({ type: "error", text: "Tên hiển thị không được để trống" });
      return;
    }

    setLoading(true);
    try {
      await updateDisplayName(data.displayName);

      if (
        currentUser?.providerData[0]?.providerId === "password" &&
        data.newPassword.trim()
      ) {
        await updatePassword(currentUser, data.newPassword);
      }

      setIsEditing(false);
      toast.success("Cập nhật thông tin thành công!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Đã có lỗi khi cập nhật thông tin: " + error.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setMessage({
        type: "error",
        text: "Đã có lỗi khi cập nhật thông tin: " + error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ClipLoader color="#3498db" css={override} size={50} />
      </div>
    );
  }

  if (!currentUser) {
    return <p className="text-center text-gray-500">Vui lòng đăng nhập</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">
        Hồ sơ của {displayName || currentUser.email}
      </h1>

      {isEditing ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-4 sm:p-6 rounded-lg shadow-md space-y-4"
        >
          <div>
            <label className="block mb-1">
              <span className="text-gray-700 font-semibold inline-block mb-1 text-sm sm:text-base md:text-lg">
                Email
              </span>
              <input
                className="w-full border-2 border-gray-300 p-2 sm:p-3 rounded-lg bg-gray-100 cursor-not-allowed text-sm sm:text-base md:text-lg"
                type="email"
                value={currentUser.email}
                disabled
              />
            </label>
          </div>

          <div>
            <label className="block mb-1">
              <span className="text-gray-700 font-semibold inline-block mb-1 text-sm sm:text-base md:text-lg">
                Tên hiển thị
              </span>
              <input
                {...register("displayName", {
                  required: "Tên hiển thị không được để trống",
                  minLength: {
                    value: 2,
                    message: "Tên phải có ít nhất 2 ký tự",
                  },
                })}
                className="w-full text-sm sm:text-base md:text-lg border-2 border-gray-300 p-2 sm:p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                type="text"
                placeholder="Nhập tên hiển thị"
                disabled={loading}
              />
              {errors.displayName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.displayName.message}
                </p>
              )}
            </label>
          </div>

          {currentUser?.providerData[0]?.providerId === "password" && (
            <div>
              <label className="block mb-1">
                <span className="text-gray-700 text-sm sm:text-base md:text-lg font-semibold mb-1 inline-block">
                  Mật khẩu mới
                </span>
                <div className="relative">
                  <input
                    {...register("newPassword", {
                      minLength: {
                        value: 6,
                        message: "Mật khẩu ít nhất 6 ký tự",
                      },
                    })}
                    className="w-full text-sm sm:text-base md:text-lg border-2 border-gray-300 p-2 sm:p-3 rounded-lg pr-10 focus:ring-2 focus:ring-indigo-500"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu mới (nếu muốn đổi)"
                    disabled={loading}
                  />
                  <div
                    className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </div>
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.newPassword.message}
                  </p>
                )}
              </label>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200"
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="cursor-pointer bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200"
            >
              Hủy
            </button>
          </div>

          {message && (
            <p
              className={`text-sm mt-2 text-center ${
                message.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message.text}
            </p>
          )}
        </form>
      ) : (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">
            <strong>Email:</strong> {currentUser.email}
          </p>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">
            <strong>Tên hiển thị:</strong> {displayName || "Chưa đặt"}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="cursor-pointer mt-4 bg-green-500 text-white px-3 sm:px-4 py-2 text-sm sm:text-base md:text-lg rounded-lg hover:bg-green-600 transition-all duration-200"
          >
            Chỉnh sửa thông tin
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
