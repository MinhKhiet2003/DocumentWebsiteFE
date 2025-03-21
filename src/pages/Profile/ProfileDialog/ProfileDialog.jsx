import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './ProfileDialog.css';

const ProfileDialog = ({ isOpen, onRequestClose, userInfo, onUpdateProfile }) => {
  const [formData, setFormData] = useState({
    username: userInfo.username,
    email: userInfo.email,
    profilePicturePath: userInfo.avatar,
  });

  // Cập nhật formData khi userInfo thay đổi
  useEffect(() => {
    setFormData({
      username: userInfo.username,
      email: userInfo.email,
      profilePicturePath: userInfo.avatar,
    });
  }, [userInfo]);

  // Xử lý thay đổi giá trị trong form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    onUpdateProfile(formData); // Gọi hàm cập nhật thông tin
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Thông tin cá nhân"
      className="profile-modal"
      overlayClassName="profile-overlay"
    >
      <h2>Thông tin cá nhân</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Tên người dùng:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="profilePicturePath">Avatar (URL):</label>
          <input
            type="url"
            id="profilePicturePath"
            name="profilePicturePath"
            value={formData.profilePicturePath}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-actions">
          <button type="button" onClick={onRequestClose} className="btn btn-secondary">
            Đóng
          </button>
          <button type="submit" className="btn btn-primary">
            Lưu thay đổi
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProfileDialog;