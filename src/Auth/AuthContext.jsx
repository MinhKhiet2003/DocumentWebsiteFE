import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  };

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
      navigate('/');
      return;
    }

    try {
      const response = await fetch('https://hachieve.runasp.net/api/User/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Đang gọi API...');
      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error('Không thể lấy thông tin người dùng');
      }

      const userInfo = await response.json();
      console.log('Response JSON:', userInfo); // Ghi log dữ liệu JSON đã phân tích
      setUser({
        ...userInfo,
        userId: userInfo.id,
        role: userInfo.role
      });
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      localStorage.removeItem('token');
      setUser(null);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const login = (token) => {
    localStorage.setItem('token', token);
    fetchProfile();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const updateUser = (updatedUser) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedUser
    }));
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};