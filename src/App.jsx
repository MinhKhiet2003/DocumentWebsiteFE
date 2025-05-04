import React, { useContext, useState, useEffect } from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/index';
import ScrollToTopButton from './components/ScrollToTopButton/ScrollToTopButton';
import ChatBotButton from './components/ChatBotButton/ChatBotButton';
import UnderTestingDialog from './components/UnderTestingDialog/UnderTestingDialog';
import { AuthContext } from './Auth/AuthContext';

const App = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const hasShownDialog = localStorage.getItem('hasShownUnderTestingDialog');
      if (!hasShownDialog) {
        setIsDialogOpen(true);
      }
    } else {
      setIsDialogOpen(false);
      localStorage.removeItem('hasShownUnderTestingDialog');
    }
  }, [user]);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    localStorage.setItem('hasShownUnderTestingDialog', 'true');
  };

  return (
    <div>
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
      <ChatBotButton />
      <ScrollToTopButton />
    </div>
  );
};

export default App;