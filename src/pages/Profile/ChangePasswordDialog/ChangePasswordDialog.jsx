import React, { useState } from 'react';
import Modal from 'react-modal';
import './ChangePasswordDialog.css';
import { ToastContainer } from 'react-toastify';

const ChangePasswordDialog = ({ isOpen, onRequestClose, onChangePassword }) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = (type) => {
    if (type === 'old') setShowOldPassword(prev => !prev);
    if (type === 'new') setShowNewPassword(prev => !prev);
    if (type === 'confirm') setShowConfirmPassword(prev => !prev);
  };

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
          <div className="input-with-icon">
            <input
              type={showOldPassword ? "text" : "password"}
              id="oldPassword"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              required
            />
            <span className="toggle-password" onClick={() => togglePasswordVisibility('old')}>
              {showOldPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">Mật khẩu mới:</label>
          <div className="input-with-icon">
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
            <span className="toggle-password" onClick={() => togglePasswordVisibility('new')}>
              {showNewPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Xác nhận mật khẩu mới:</label>
          <div className="input-with-icon">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <span className="toggle-password" onClick={() => togglePasswordVisibility('confirm')}>
              {showConfirmPassword ? "🙈" : "👁️"}
            </span>
          </div>
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
  <ToastContainer />
};

export default ChangePasswordDialog;
