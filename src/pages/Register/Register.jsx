import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomFormLoginRegister from '../../components/LoginRegister';
import { toast, ToastContainer } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const username = formData.get('nickname');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const email = formData.get('usernameOrEmail');

    // Validation
    if (username.length < 3) {
      toast.error('Tên người dùng phải có ít nhất 3 ký tự.');
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      toast.error('Tên người dùng chỉ được chứa chữ cái, số và dấu gạch dưới.');
      return;
    }

    if (password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast.error('Email không hợp lệ.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Xác nhận mật khẩu không đúng.');
      return;
    }

    const registerData = {
      username: username,
      password: password,
      email: email,
      role: "user",
    };

    try {
      const response = await fetch('https://hachieve.runasp.net/api/User/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Nếu có lỗi liên quan đến username đã tồn tại, hiển thị thông báo lỗi
        if (errorData.errorMessage === 'Username đã tồn tại') {
          toast.error('Tên người dùng đã tồn tại. Vui lòng chọn tên khác.');
        } else {
          toast.error(errorData.errorMessage || "Đăng ký thất bại");
        }
        return;
      }

      toast.success("Đăng ký thành công!");
      setTimeout(() => {
        navigate('/login');
      }, 2000); 
    } catch (error) {
      toast.error(error.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
    }
  };

  const handleSwitchToLogin = () => {
    navigate('/login');
  };

  return (
    <div>
      <CustomFormLoginRegister
        title="Đăng ký"
        isRegister={true}
        contentButton1="Đăng ký"
        contentButton2="Đăng nhập"
        handleOnSubmit={handleRegisterSubmit}
        handleSwitchClick={handleSwitchToLogin}
      />
      <ToastContainer />
    </div>
  );
};

export default Register;
