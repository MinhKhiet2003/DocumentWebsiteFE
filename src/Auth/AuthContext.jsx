import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5168/api/User/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Không thể lấy thông tin người dùng');
      }

      const userInfo = await response.json();
      setUser(userInfo);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    fetchProfile();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};
