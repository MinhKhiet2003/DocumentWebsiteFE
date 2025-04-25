import React, { use } from "react";
import { Routes, Route, Outlet ,useLocation,useNavigate} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/index";
import ScrollToTopButton from "./components/ScrollToTopButton/ScrollToTopButton";
const App = () => {
  const location = useLocation();
  return (
    <div>
      <Navbar />
      <div className="marquee-container">
        <div className="marquee-text">
        📚 Chào mừng Kỷ niệm 50 năm Ngày Giải phóng miền Nam, Thống nhất đất nước (30/4/1975 – 30/4/2025)! Hãy cùng nhau ghi nhớ công ơn các thế hệ cha anh và không ngừng học tập, rèn luyện để xây dựng quê hương ngày càng giàu đẹp!
        </div>
      </div>
        <div className="main-content">
           {
            location.pathname == "/" ? <Home /> : <Outlet />
           } 
        </div>
          <ScrollToTopButton/>
    </div>
  );
};

export default App;