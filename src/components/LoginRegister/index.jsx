import React, { useState } from "react";
import "./styles.css";

const CustomFormLoginRegister = ({
  title,
  isRegister,
  contentButton1,
  contentButton2,
  handleOnSubmit
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev);
  };

  return (
    <div className="login-register-container">
      <div className="auth-container">
        <h2>{title}</h2>
        <form onSubmit={handleOnSubmit}>
          {isRegister && (
            <div className="form-group">
              <label htmlFor="nickname">Username:</label>
              <input type="text" id="nickname" className="form-control" required />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" className="form-control" required />
          </div>
          <div className="form-group password-group">
            <label htmlFor="password">Mật khẩu:</label>
            <div className="input-with-icon">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="form-control"
                required
              />
              <span className="toggle-password" onClick={togglePasswordVisibility}>
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>
          {isRegister && (
            <div className="form-group password-group">
              <label htmlFor="confirm-password">Xác nhận mật khẩu:</label>
              <div className="input-with-icon">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm-password"
                  className="form-control"
                  required
                />
                <span className="toggle-password" onClick={toggleConfirmPasswordVisibility}>
                  {showConfirmPassword ? "🙈" : "👁️"}
                </span>
              </div>
            </div>
          )}
          <div className="btn-group">
            <button type="submit" className="btn btn-primary">
              {contentButton1}
            </button>
            <button type="button" className="btn btn-secondary">
              {contentButton2}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomFormLoginRegister;
