import React from 'react';
import CustomFormLoginRegister from '../../components/LoginRegister';

const Register = () => {
  const handleOnSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn hành động mặc định của form

    const formData = new FormData(e.currentTarget);

    const registerData = {
      username: formData.get('nickname'), 
      password: formData.get('password'), 
      email: formData.get('usernameOrEmail'),
      role: "user", 
    };

    // console.log("Dữ liệu gửi lên:", JSON.stringify(registerData));

    try {
      const response = await fetch('http://localhost:5168/api/User/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(registerData), 
      });

      // console.log("Phản hồi từ máy chủ:", response);

      if (!response.ok) {
        const errorData = await response.json(); 
        console.error("Chi tiết lỗi từ máy chủ:", errorData);
        throw new Error(errorData.message || "Đăng ký thất bại");
      }

      const data = await response.json();
      console.log('Đăng ký thành công:', data);
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      window.location.href = '/login'; 
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      alert('Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
    }
  };

  return (
    <CustomFormLoginRegister
      title={"Đăng ký"}
      isRegister={true}
      contentButton1={"Đăng ký"}
      contentButton2={"Đăng nhập"}
      handleOnSubmit={handleOnSubmit}
    />
  );
};

export default Register;