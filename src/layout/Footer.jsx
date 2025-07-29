import { NavLink } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-white shadow py-8 sm:py-10 text-gray-600 text-sm sm:text-base mt-20 sm:mt-24 md:mt-32">
      <div className="w-[90%] sm:w-[85%] mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 lg:gap-20">
        <div className="text-center sm:text-left space-y-2">
          <NavLink
            to="/"
            className="inline-block mb-1 transition-transform duration-200 hover:scale-105"
          >
            <span className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-400">
              BlogMini
            </span>
          </NavLink>

          <p className="text-xs sm:text-sm md:text-base">
            Chia sẻ câu chuyện, kết nối cộng đồng
          </p>
        </div>
        <div className="text-center text-sm sm:text-base md:text-lg sm:text-left space-y-2">
          <h4 className="font-semibold text-gray-800">Liên hệ</h4>
          <p className="text-xs sm:text-sm md:text-base">
            Email:{" "}
            <a
              href="mailto:blogmini.contact@gmail.com"
              className="hover:text-blue-600 transition-colors duration-200"
            >
              blogmini.contact@gmail.com
            </a>
          </p>
        </div>
        <div className="flex flex-col items-center lg:items-start space-y-2 ">
          <h4 className="font-semibold text-gray-800 text-sm sm:text-base md:text-lg">
            Kết nối với chúng tôi
          </h4>
          <div className="flex gap-4 justify-center">
            <a
              href="https://www.linkedin.com/in/d%C6%B0%C6%A1ng-t%E1%BA%A5n-l%E1%BB%99c-465073240/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
              aria-label="LinkedIn"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.327-.024-3.037-1.849-3.037-1.852 0-2.136 1.447-2.136 2.941v5.665H9.352V9.747h3.415v1.516h.048c.476-.9 1.636-1.849 3.365-1.849 3.598 0 4.261 2.369 4.261 5.455v5.583zM5.337 8.231c-1.143 0-2.063-.93-2.063-2.077 0-1.146.92-2.076 2.063-2.076 1.143 0 2.063.93 2.063 2.076 0 1.147-.92 2.077-2.063 2.077zm1.778 12.221H3.56V9.747h3.555v10.705z" />
              </svg>
            </a>
            <a
              href="https://github.com/DuongTanLoc2207"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
              aria-label="GitHub"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center text-gray-500 text-sm">
        &copy; 2025 BlogMini. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
