import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomFormLoginRegister from '../../components/LoginRegister';
import { AuthContext } from '../../Auth/AuthContext';
import { toast, ToastContainer } from 'react-toastify';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const loginData = {
      usernameOrEmail: formData.get('usernameOrEmail'),
      password: formData.get('password'),
    };

    try {
      const response = await fetch('https://hachieve.runasp.net/api/User/login', {
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
      login(data.token);
      navigate('/');
    } catch (error) {
      toast.error('Tài khoản hoặc mật khẩu không chính xác!');
    }
  };

  const handleSwitchToRegister = () => {
    navigate('/register');
  };

  return (
    <div>
      <CustomFormLoginRegister
        title="Đăng nhập"
        isRegister={false}
        contentButton1="Đăng nhập"
        contentButton2="Đăng ký"
        handleOnSubmit={handleLoginSubmit}
        handleSwitchClick={handleSwitchToRegister}
      />
      <ToastContainer />
    </div>
  );
};

export default Login;