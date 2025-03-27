import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Auth/AuthContext";
import "./MainContent.css";

const MainContent = () => {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/';
        return;
      }

      try {
        // Gọi API để lấy số lượng người dùng
        const response = await fetch('http://localhost:5168/api/User/count', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Không thể lấy dữ liệu số lượng người dùng');
        }

        const data = await response.json();
        setDashboardData({ totalUsers: data }); // Lưu số lượng người dùng vào state
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu số lượng người dùng:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="main-content--admin">
      <h3>Dashboard Overview</h3>
      {dashboardData ? (
        <div className="cards--admin">
          <div className="card--admin">
            <h4>Total Users</h4>
            <p>{dashboardData.totalUsers}</p> {/* Hiển thị số lượng người dùng */}
          </div>
          {/* Các card khác có thể được thêm vào sau */}
        </div>
      ) : (
        <p>Đang tải dữ liệu...</p>
      )}
    </div>
  );
};

export default MainContent;