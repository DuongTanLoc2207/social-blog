import React from "react";
import Header from "./Header";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import Footer from "./Footer";

const override = css`
  display: block;
  margin: 0 auto;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Layout = ({ children, className = "", isLoading = false }) => {
  return (
    <div
      className={`min-h-screen flex flex-col bg-gray-100 font-sans ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center flex-1">
          <ClipLoader color="#3498db" css={override} size={50} />
        </div>
      ) : (
        <>
          <Header />
          <main className="flex-1 container mx-auto px-6 sm:px-6 md:px-10 min-h-[calc(100vh-400px)]">
            {children}
          </main>
          <Footer />
        </>
      )}
    </div>
  );
};

export default Layout;