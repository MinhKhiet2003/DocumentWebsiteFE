import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import ProfileDialog from './ProfileDialog/ProfileDialog'; 
import ChangePasswordDialog from './ChangePasswordDialog/ChangePasswordDialog'; 
import './Profile.css';
import Navbar from '../../components/Navbar/Navbar';
import Modal from 'react-modal';

// Thiết lập phần tử gốc của ứng dụng
Modal.setAppElement('#root'); 

const Profile = () => {
  const navigate = useNavigate(); 
  const [userInfo, setUserInfo] = useState({
    username: '',
    avatar: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
    role: '',
    email: '',
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false); 

  // Hàm để gọi API lấy thông tin profile
  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5168/api/User/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Không thể lấy thông tin profile');
      }

      const data = await response.json();
      setUserInfo({
        username: data.nickname,
        avatar: data.avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
        role: data.role,
        email: data.email,
      });
    } catch (error) {
      console.error('Lỗi khi lấy thông tin profile:', error);
    }
  };

  // Hàm để cập nhật thông tin profile
  const handleUpdateProfile = async (updatedData) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5168/api/User/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Username: updatedData.username,
          Email: updatedData.email,
          ProfilePicturePath: updatedData.profilePicturePath,
        }),
      });

      if (!response.ok) {
        throw new Error('Không thể cập nhật thông tin profile');
      }

      if (response.status === 204) {
        setUserInfo((prev) => ({
          ...prev,
          username: updatedData.username,
          avatar: updatedData.profilePicturePath,
          email: updatedData.email,
        }));
        setIsDialogOpen(false);
        alert('Cập nhật thông tin thành công!');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin profile:', error);
      alert('Có lỗi xảy ra khi cập nhật thông tin.');
    }
  };

  // Hàm để đổi mật khẩu
  const handleChangePassword = async (passwordData) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5168/api/User/change-password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          OldPassword: passwordData.oldPassword,
          NewPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        alert(errorResponse.errorMessage || 'Đổi mật khẩu thất bại');
        return;
      }

      if (response.status === 204) {
        alert('Đổi mật khẩu thành công!');
        setIsChangePasswordDialogOpen(false);
      }
    } catch (error) {
      console.error('Lỗi khi đổi mật khẩu:', error);
      alert('Có lỗi xảy ra khi đổi mật khẩu.');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    } else {
      fetchProfile();
    }
  }, [navigate]);

  return (
    <div>
      <Navbar />
      <div className="main-content">
        <div className="profile-container">
          <h1>Thông tin cá nhân</h1>
          <div className="profile-info">
            <div className="avatar-container">
              <img
                src={userInfo.avatar}
                alt="Avatar"
                className="profile-avatar"
              />
            </div>
            <div className="profile-details">
              <p><strong>Tên người dùng:</strong> {userInfo.username}</p>
              <p><strong>Email:</strong> {userInfo.email}</p>
              <p><strong>Vai trò:</strong> {userInfo.role}</p>
            </div>
          </div>
          <div className="profile-actions">
            <button onClick={() => setIsDialogOpen(true)} className="btn btn-primary">
              Chỉnh sửa thông tin
            </button>
            <button onClick={() => setIsChangePasswordDialogOpen(true)} className="btn btn-primary">
              Đổi mật khẩu
            </button>
          </div>
        </div>
      </div>

      <ProfileDialog
        isOpen={isDialogOpen}
        onRequestClose={() => setIsDialogOpen(false)}
        userInfo={userInfo}
        onUpdateProfile={handleUpdateProfile}
      />

      <ChangePasswordDialog
        isOpen={isChangePasswordDialogOpen}
        onRequestClose={() => setIsChangePasswordDialogOpen(false)}
        onChangePassword={handleChangePassword}
      />
    </div>
  );
};

export default Profile;