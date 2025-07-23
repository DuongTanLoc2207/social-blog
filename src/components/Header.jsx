import { NavLink, useNavigate } from "react-router";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import { useAuth } from "../context/useAuth";
import { useState } from "react";

const Header = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Đăng xuất lỗi:", error.message);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="w-[90%] sm:w-[80%] mx-auto px-2 sm:px-4 py-2 sm:py-3 flex justify-between items-center">
        <div className="flex items-center gap-4 sm:gap-6">
          <NavLink
            to="/"
            className="text-xl sm:text-2xl font-bold flex items-center gap-2 transition-all duration-200 hover:scale-105"
          >
            <span>📝</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-400">
              BlogMini
            </span>
          </NavLink>

          {/* Nút hamburger cho mobile với điều chỉnh marginRight dưới 400px */}
          <button
            className="sm:hidden text-gray-600 hover:text-blue-600"
            onClick={toggleMenu}
            style={{
              marginRight: window.innerWidth < 400 ? '1rem' : '0',
            }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>

          <nav className="hidden sm:flex sm:gap-4 md:gap-6 text-sm sm:text-base">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-white bg-blue-600 px-3 py-1 rounded-md transition-all duration-200"
                  : "text-gray-600 hover:bg-blue-100 hover:text-blue-600 px-3 py-1 rounded-md transition-all duration-200"
              }
            >
              Trang chủ
            </NavLink>
            {currentUser && (
              <>
                <NavLink
                  to="/create"
                  className={({ isActive }) =>
                    isActive
                      ? "text-white bg-blue-600 px-3 py-1 rounded-md transition-all duration-200"
                      : "text-gray-600 hover:bg-blue-100 hover:text-blue-600 px-3 py-1 rounded-md transition-all duration-200"
                  }
                >
                  Đăng bài
                </NavLink>
                <NavLink
                  to="/my-posts"
                  className={({ isActive }) =>
                    isActive
                      ? "text-white bg-blue-600 px-3 py-1 rounded-md transition-all duration-200"
                      : "text-gray-600 hover:bg-blue-100 hover:text-blue-600 px-3 py-1 rounded-md transition-all duration-200"
                  }
                >
                  My Posts
                </NavLink>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-2 md:gap-4 text-sm sm:text-base overflow-hidden">
          {currentUser ? (
            <>
              <span className="flex text-sm sm:text-base truncate overflow-hidden max-w-[120px] sm:max-w-[200px] md:max-w-[250px]">
                👋 {currentUser.displayName || currentUser.email}
              </span>
              <button
                onClick={handleLogout}
                className="hidden sm:block text-white bg-red-500 px-3 py-1 rounded-md hover:bg-red-600 transition-all duration-200"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? "text-white bg-blue-600 px-3 py-1 rounded-md transition-all duration-200"
                    : "text-gray-600 hover:bg-blue-100 hover:text-blue-600 px-3 py-1 rounded-md transition-all duration-200"
                }
              >
                Đăng nhập
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  isActive
                    ? "text-white bg-blue-600 px-3 py-1 rounded-md transition-all duration-200"
                    : "text-gray-600 hover:bg-blue-100 hover:text-blue-600 px-3 py-1 rounded-md transition-all duration-200"
                }
              >
                Đăng ký
              </NavLink>
            </>
          )}
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <nav className="sm:hidden bg-white shadow-md w-[90%] mx-auto px-2 py-2 space-y-2">
          <NavLink
            to="/"
            onClick={toggleMenu}
            className={({ isActive }) =>
              isActive
                ? "block text-white bg-blue-600 px-3 py-1 rounded-md transition-all duration-200"
                : "block text-gray-600 hover:bg-blue-100 hover:text-blue-600 px-3 py-1 rounded-md transition-all duration-200"
            }
          >
            Trang chủ
          </NavLink>
          {currentUser && (
            <>
              <NavLink
                to="/create"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  isActive
                    ? "block text-white bg-blue-600 px-3 py-1 rounded-md transition-all duration-200"
                    : "block text-gray-600 hover:bg-blue-100 hover:text-blue-600 px-3 py-1 rounded-md transition-all duration-200"
                }
              >
                Đăng bài
              </NavLink>
              <NavLink
                to="/my-posts"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  isActive
                    ? "block text-white bg-blue-600 px-3 py-1 rounded-md transition-all duration-200"
                    : "block text-gray-600 hover:bg-blue-100 hover:text-blue-600 px-3 py-1 rounded-md transition-all duration-200"
                }
              >
                My Posts
              </NavLink>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="block text-white bg-red-500 px-3 py-1 rounded-md hover:bg-red-600 transition-all duration-200 w-full text-left"
              >
                Đăng xuất
              </button>
            </>
          )}
          {!currentUser && (
            <>
              <NavLink
                to="/login"
                onClick={toggleMenu}
                className="block text-gray-600 hover:bg-blue-100 hover:text-blue-600 px-3 py-1 rounded-md transition-all duration-200"
              >
                Đăng nhập
              </NavLink>
              <NavLink
                to="/signup"
                onClick={toggleMenu}
                className="block text-gray-600 hover:bg-blue-100 hover:text-blue-600 px-3 py-1 rounded-md transition-all duration-200"
              >
                Đăng ký
              </NavLink>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;