import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Auth/AuthContext";
import { toast } from "react-toastify";
import "./MainContent.css";

const MainContent = () => {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [categoryCounts, setCategoryCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      

      try {
        setLoading(true);
        
        // Lấy tổng số người dùng
        const userResponse = await fetch('http://localhost:5168/api/User/count', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!userResponse.ok) {
          throw new Error('Không thể lấy dữ liệu số lượng người dùng');
        }
        const totalUsers = await userResponse.json();

        // Lấy thống kê danh mục theo lớp
        const categoryResponse = await fetch('http://localhost:5168/api/Categories/count-by-class', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!categoryResponse.ok) {
          throw new Error('Không thể lấy dữ liệu số lượng danh mục theo lớp');
        }
        const categoryData = await categoryResponse.json();

        // Chuyển đổi dữ liệu từ object sang mảng
        const countsArray = Object.entries(categoryData).map(([classId, count]) => ({
          classId: parseInt(classId),
          className: `Lớp ${classId}`,
          count
        }));

        // Sắp xếp theo classId
        countsArray.sort((a, b) => a.classId - b.classId);

        setDashboardData({ totalUsers });
        setCategoryCounts(countsArray);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        toast.error("Lỗi khi tải dữ liệu thống kê");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="main-content--admin">
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="">
      <h3>Thống kê tổng quan</h3>
      
      <div className="dashboard-stats">
        <div className="stat-card total-users">
          <h4>Tổng số người dùng</h4>
          <p>{dashboardData?.totalUsers || 0}</p>
        </div>
        
        <div className="stat-card total-categories">
          <h4>Tổng số danh mục</h4>
          <p>{categoryCounts.reduce((sum, item) => sum + item.count, 0)}</p>
        </div>
      </div>
      
      <div className="category-stats">
        <h4>Thống kê danh mục theo lớp</h4>
        {categoryCounts.length > 0 ? (
          <div className="stats-table">
            <div className="table-header">
              <div className="header-item">Lớp</div>
              <div className="header-item">Số danh mục</div>
              <div className="header-item">Tỷ lệ</div>
            </div>
            
            {categoryCounts.map((category) => (
              <div className="table-row" key={category.classId}>
                <div className="row-item">{category.className}</div>
                <div className="row-item">{category.count}</div>
                <div className="row-item">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${(category.count / categoryCounts.reduce((sum, item) => sum + item.count, 0)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Không có dữ liệu thống kê</p>
        )}
      </div>
    </div>
  );
};

export default MainContent;