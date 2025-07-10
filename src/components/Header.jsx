import { Link, useNavigate } from "react-router";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import { useAuth } from "../context/useAuth"; 

const Header = () => {
  const { currentUser } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Đăng xuất lỗi:", error.message);
    }
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="w-[80%] mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold text-blue-600">
            📝 BlogMini
          </Link>
          <nav className="hidden sm:flex gap-4 text-sm">
            <Link to="/" className="hover:underline">Trang chủ</Link>
            {currentUser && (
              <>
                <Link to="/create" className="hover:underline">Đăng bài</Link>
                <Link to="/my-posts" className="hover:underline">My Posts</Link>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4 text-sm">
          {currentUser ? (
            <>
              <span className="text-gray-600 hidden sm:inline">
                👋 {currentUser.displayName || currentUser.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:underline"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Đăng nhập</Link>
              <Link to="/signup" className="hover:underline">Đăng ký</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
