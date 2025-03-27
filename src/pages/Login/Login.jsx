import React, { useState, useContext } from 'react'; 
import CustomFormLoginRegister from '../../components/LoginRegister';
import { AuthContext } from '../../Auth/AuthContext'; 

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const { login } = useContext(AuthContext); // Sử dụng hàm login từ AuthContext

  const handleSwitchClick = () => {
    setIsRegister((prev) => !prev);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const loginData = {
      usernameOrEmail: formData.get('usernameOrEmail'),
      password: formData.get('password'),
    };

    try {
      const response = await fetch('http://localhost:5168/api/User/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        throw new Error('Đăng nhập thất bại');
      }

      const data = await response.json();
      console.log('Đăng nhập thành công:', data);

      // Gọi hàm login từ AuthContext để lưu token và gọi API /profile
      login(data.token);

      // Chuyển hướng về trang chủ
      window.location.href = '/';
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      alert('Tài khoản hoặc mật khẩu không chính xác!');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const registerData = {
      username: formData.get('nickname'),
      password: formData.get('password'),
      email: formData.get('usernameOrEmail'),
      role: 'user',
    };

    try {
      const response = await fetch('http://localhost:5168/api/User/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        throw new Error('Đăng ký thất bại');
      }

      const data = await response.json();
      console.log('Đăng ký thành công:', data);
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      setIsRegister(false);
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      alert('Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
    }
  };

  return (
    <CustomFormLoginRegister
      title={isRegister ? 'Đăng ký' : 'Đăng nhập'}
      isRegister={isRegister}
      contentButton1={isRegister ? 'Đăng ký' : 'Đăng nhập'}
      contentButton2={isRegister ? 'Đăng nhập' : 'Đăng ký'}
      handleOnSubmit={isRegister ? handleRegisterSubmit : handleLoginSubmit}
      handleSwitchClick={handleSwitchClick}
    />
  );
};

export default Login;