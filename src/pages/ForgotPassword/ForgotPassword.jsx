import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomFormLoginRegister from '../../components/LoginRegister';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');

    // Validate email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast.error('Email không hợp lệ.');
      return;
    }

    try {
      const response = await fetch('https://hachieve.runasp.net/api/User/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Gửi OTP thất bại.');
        return;
      }

      toast.success('OTP đã được gửi.');
      setIsOtpSent(true);
      setResendCooldown(30); // 30-second cooldown
    } catch (error) {
      toast.error('Gửi OTP thất bại. Vui lòng thử lại.');
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const otp = formData.get('otp');
    const newPassword = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    // Validate inputs
    if (newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Xác nhận mật khẩu không khớp.');
      return;
    }

    try {
      const response = await fetch('https://hachieve.runasp.net/api/User/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp,
          newPassword,
          confirmPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Đặt lại mật khẩu thất bại.');
        return;
      }

      toast.success('Đặt lại mật khẩu thành công!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      toast.error('Đặt lại mật khẩu thất bại. Vui lòng thử lại.');
    }
  };

  const handleSwitchToLogin = () => {
    navigate('/login');
  };

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  return (
    <div>
      <CustomFormLoginRegister
        title={isOtpSent ? 'Đặt lại mật khẩu' : 'Quên mật khẩu'}
        isForgotPassword={true}
        isOtpSent={isOtpSent}
        contentButton1={isOtpSent ? 'Đặt lại mật khẩu' : 'Gửi OTP'}
        contentButton2="Đăng nhập"
        handleOnSubmit={isOtpSent ? handleResetPasswordSubmit : handleForgotPasswordSubmit}
        handleSwitchClick={handleSwitchToLogin}
      />
      {isOtpSent && (
        <div className="resend-otp">
          <button
            type="button"
            className="btn-link"
            onClick={handleForgotPasswordSubmit}
            disabled={resendCooldown > 0}
          >
            Gửi lại OTP {resendCooldown > 0 && `(${resendCooldown}s)`}
          </button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;