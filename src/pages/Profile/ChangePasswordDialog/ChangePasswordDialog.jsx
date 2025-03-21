import React, { useState } from 'react';
import Modal from 'react-modal';
import './ChangePasswordDialog.css'; 

const ChangePasswordDialog = ({ isOpen, onRequestClose, onChangePassword }) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '', 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }

    onChangePassword({
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Đổi mật khẩu"
      className="change-password-modal"
      overlayClassName="change-password-overlay"
    >
      <h2>Đổi mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="oldPassword">Mật khẩu cũ:</label>
          <input
            type="password"
            id="oldPassword"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">Mật khẩu mới:</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Xác nhận mật khẩu mới:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-actions">
          <button type="button" onClick={onRequestClose} className="btn btn-secondary">
            Đóng
          </button>
          <button type="submit" className="btn btn-primary">
            Đổi mật khẩu
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ChangePasswordDialog;