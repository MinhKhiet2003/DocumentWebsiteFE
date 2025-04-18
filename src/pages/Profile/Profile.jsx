import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; 
import ProfileDialog from './ProfileDialog/ProfileDialog'; 
import { AuthContext } from '../../Auth/AuthContext'; 
import ChangePasswordDialog from './ChangePasswordDialog/ChangePasswordDialog'; 
import './Profile.css';
import Navbar from '../../components/Navbar/Navbar';
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';

Modal.setAppElement('#root'); 

const Profile = () => {
  const navigate = useNavigate(); 
  const { user, updateUser } = useContext(AuthContext); 
  const [userInfo, setUserInfo] = useState({
    username: '',
    avatar: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
    role: '',
    email: '',
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false); 

  // Đồng bộ userInfo với dữ liệu từ AuthContext
  useEffect(() => {
    if (user) {
      setUserInfo({
        username: user.username || '',
        avatar: user.avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
        role: user.role || '',
        email: user.email || '',
      });
    }
  }, [user]);

  // Kiểm tra token và điều hướng nếu không có
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  const handleUpdateProfile = async (updatedData) => {
    const token = localStorage.getItem('token');
    if (!token) return;
  
    try {
      const response = await fetch('https://hachieve.runasp.net/api/User/profile', {
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
        const errorData = await response.json();
        if (errorData.errorMessage === 'Username đã tồn tại') {
          toast.error('Tên người dùng đã tồn tại, vui lòng chọn tên khác!');
        } else {
          toast.error(errorData.errorMessage || 'Không thể cập nhật thông tin profile');
        }
        return;
      }
  
      if (response.status === 204) {
        setUserInfo((prev) => ({
          ...prev,
          username: updatedData.username,
          avatar: updatedData.profilePicturePath,
          email: updatedData.email,
        }));
        setIsDialogOpen(false);
        toast.success('Cập nhật thông tin thành công!');
  
        // Cập nhật AuthContext
        updateUser({
          username: updatedData.username,
          email: updatedData.email,
          avatar: updatedData.profilePicturePath,
          role: user.role,
        });
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin profile:', error);
      toast.warning('Có lỗi xảy ra khi cập nhật thông tin.');
    }
  };
  
  const handleChangePassword = async (passwordData) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('https://hachieve.runasp.net/api/User/change-password', {
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
        toast.error(errorResponse.errorMessage || 'Đổi mật khẩu thất bại');
        return;
      }

      if (response.status === 204) {
        toast.success('Đổi mật khẩu thành công!');
        setIsChangePasswordDialogOpen(false);
      }
    } catch (error) {
      console.error('Lỗi khi đổi mật khẩu:', error);
      toast.error('Có lỗi xảy ra khi đổi mật khẩu.');
    }
  };

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
      <ToastContainer />
    </div>
  );
};

export default Profile;