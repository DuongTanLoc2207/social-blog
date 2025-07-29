import { NavLink, useNavigate } from "react-router";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import { useAuth } from "../context/useAuth";
import { useState } from "react";

const Header = () => {
  const { currentUser, displayName, loading } = useAuth();
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
            className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-2 transition-all duration-200 hover:scale-105"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-400">
              BlogMini
            </span>
          </NavLink>

          <button
            className="sm:hidden text-gray-600 hover:text-blue-600"
            onClick={toggleMenu}
            style={{
              marginRight: window.innerWidth < 400 ? "1rem" : "0",
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

          <nav className="hidden sm:flex sm:gap-2 md:gap-4 text-sm sm:text-sm md:text-base lg:text-lg whitespace-nowrap">
            {currentUser && (
              <>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? "text-white bg-blue-600 px-3 py-1 rounded-md transition-all duration-200 "
                      : "text-gray-600 hover:bg-blue-100 hover:text-blue-600 px-3 py-1 rounded-md transition-all duration-200"
                  }
                >
                  Trang chủ
                </NavLink>
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
                  Bài viết của tôi
                </NavLink>
              </>
            )}
          </nav>
        </div>

        <div className="hidden sm:flex items-center gap-2 sm:gap-2 md:gap-4 sm:text-sm md:text-base lg:text-lg whitespace-nowrap ">
          {currentUser ? (
            <>
              <NavLink
                to="/user-profile"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 flex items-center group transition"
                    : "flex items-center group transition"
                }
              >
                <svg
                  className="w-6 h-6 group-hover:text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>

                <span className="hidden lg:inline ml-2 truncate max-w-[200px] md:max-w-[250px]">
                  {loading ? (
                    <span className="bg-gray-300 animate-pulse w-20 h-4 rounded "></span>
                  ) : (
                    <span className="group-hover:text-blue-600">
                      {displayName || currentUser.email}
                    </span>
                  )}
                </span>
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-white bg-red-500 px-3 py-1 rounded-md hover:bg-red-600 transition-all duration-200 "
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

      {isMenuOpen && (
        <nav className="sm:hidden bg-white shadow-md w-[90%] mx-auto px-2 py-2 space-y-2">
          {currentUser && (
            <>
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
                Bài viết của tôi
              </NavLink>
              <NavLink
                to="/user-profile"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  isActive
                    ? "block text-white bg-blue-600 px-3 py-1 rounded-md transition-all duration-200"
                    : "block text-gray-600 hover:bg-blue-100 hover:text-blue-600 px-3 py-1 rounded-md transition-all duration-200"
                }
              >
                Hồ sơ
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
                className={({ isActive }) =>
                  isActive
                    ? "block text-white bg-blue-600 px-3 py-1 rounded-md transition-all duration-200"
                    : "block text-gray-600 hover:bg-blue-100 hover:text-blue-600 px-3 py-1 rounded-md transition-all duration-200"
                }
              >
                Đăng nhập
              </NavLink>
              <NavLink
                to="/signup"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  isActive
                    ? "block text-white bg-blue-600 px-3 py-1 rounded-md transition-all duration-200"
                    : "block text-gray-600 hover:bg-blue-100 hover:text-blue-600 px-3 py-1 rounded-md transition-all duration-200"
                }
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
