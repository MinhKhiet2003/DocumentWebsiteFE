import React, { useState } from 'react';
import './styles.css';

const CustomFormLoginRegister = ({
  title,
  isRegister,
  isForgotPassword,
  isOtpSent,
  contentButton1,
  contentButton2,
  handleOnSubmit,
  handleSwitchClick,
  forgotPasswordLink, // New prop for the forgot password link
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <div className="login-register-container">
      <div className="auth-container">
        <h2>{title}</h2>
        <form onSubmit={handleOnSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              
              id="email"
              name={isForgotPassword ? 'email' : 'usernameOrEmail'}
              className="form-control"
              required
            />
          </div>
          {isForgotPassword && isOtpSent && (
            <>
              <div className="form-group">
                <label htmlFor="otp">OTP:</label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group password-group">
                <label htmlFor="password">Mật khẩu mới:</label>
                <div className="input-with-icon">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className="form-control"
                    required
                  />
                  <span className="toggle-password" onClick={togglePasswordVisibility}>
                    {showPassword ? '🙈' : '👁️'}
                  </span>
                </div>
              </div>
              <div className="form-group password-group">
                <label htmlFor="confirm-password">Xác nhận mật khẩu mới:</label>
                <div className="input-with-icon">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirm-password"
                    name="confirmPassword"
                    className="form-control"
                    required
                  />
                  <span className="toggle-password" onClick={toggleConfirmPasswordVisibility}>
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </span>
                </div>
              </div>
            </>
          )}
          {!isForgotPassword && (
            <>
              {isRegister && (
                <div className="form-group">
                  <label htmlFor="nickname">Username:</label>
                  <input
                    type="text"
                    id="nickname"
                    name="nickname"
                    className="form-control"
                    required
                  />
                </div>
              )}
              <div className="form-group password-group">
                <label htmlFor="password">Mật khẩu:</label>
                <div className="input-with-icon">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className="form-control"
                    required
                  />
                  <span className="toggle-password" onClick={togglePasswordVisibility}>
                    {showPassword ? '🙈' : '👁️'}
                  </span>
                </div>
              </div>
              {isRegister && (
                <div className="form-group password-group">
                  <label htmlFor="confirm-password">Xác nhận mật khẩu:</label>
                  <div className="input-with-icon">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirm-password"
                      name="confirmPassword"
                      className="form-control"
                      required
                    />
                    <span className="toggle-password" onClick={toggleConfirmPasswordVisibility}>
                      {showConfirmPassword ? '🙈' : '👁️'}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
          {forgotPasswordLink && (
            <div className="forgot-password-link-container">
              {forgotPasswordLink}
            </div>
          )}
          <div className="btn-group">
            <button type="submit" className="btn btn-primary">
              {contentButton1}
            </button>
            {handleSwitchClick && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleSwitchClick}
              >
                {contentButton2}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomFormLoginRegister;