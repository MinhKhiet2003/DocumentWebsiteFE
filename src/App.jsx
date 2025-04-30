import React, { useContext, useState, useEffect } from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/index';
import ScrollToTopButton from './components/ScrollToTopButton/ScrollToTopButton';
import UnderTestingDialog from './components/UnderTestingDialog/UnderTestingDialog';
import { AuthContext } from './Auth/AuthContext';
const App = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      // Kiểm tra xem dialog đã hiển thị chưa
      const hasShownDialog = localStorage.getItem('hasShownUnderTestingDialog');
      if (!hasShownDialog) {
        setIsDialogOpen(true);
      }
    } else {
      // Khi đăng xuất, có thể giữ hoặc xóa trạng thái tùy yêu cầu
      setIsDialogOpen(false);
      // Tùy chọn: Xóa trạng thái khi đăng xuất để dialog hiện lại khi đăng nhập lần sau
      localStorage.removeItem('hasShownUnderTestingDialog');
    }
  }, [user]);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    // Lưu trạng thái đã hiển thị dialog
    localStorage.setItem('hasShownUnderTestingDialog', 'true');
  };

  return (
    <div>
      <Helmet>
        <title>Hachieve - Tài liệu hóa học trực tuyến</title>
        <meta name="description" content="Hachieve cung cấp các tài liệu hóa học trực tuyến chất lượng cao." />
      </Helmet>
      <Navbar />
      <div className="marquee-container">
        <div className="marquee-text">
          📚 Chào mừng Kỷ niệm 50 năm Ngày Giải phóng miền Nam, Thống nhất đất nước (30/4/1975 – 30/4/2025)! Hãy cùng nhau ghi nhớ công ơn các thế hệ cha anh và không ngừng học tập, rèn luyện để xây dựng quê hương ngày càng giàu đẹp!
        </div>
      </div>
      <div className="main-content">
        {location.pathname === '/' ? <Home /> : <Outlet />}
      </div>
      <UnderTestingDialog isOpen={isDialogOpen} onClose={handleCloseDialog} />
      <ScrollToTopButton />
    </div>
  );
};

export default App;