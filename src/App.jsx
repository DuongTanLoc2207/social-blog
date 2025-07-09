import "./App.css";
import Home from "./pages/Home.jsx";
// import app from "./firebase-config.js";

// console.log("Firebase App đã khởi tạo:", app.name);

function App() {
  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Home />
      </div>
    </>
  );
}

export default App;
