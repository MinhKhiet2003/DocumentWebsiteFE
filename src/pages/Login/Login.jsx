import React from 'react';
import CustomFormLoginRegister from '../../components/LoginRegister';
const Login = () => {
  const handleOnSubmit = (e) => {
    console.log("Login",e);
    /// cal api owr ddaay
  }
  return (
    <CustomFormLoginRegister title={"Đăng nhập"} isRegister={false} contentButton1={"Đăng nhập"} contentButton2={"Đăng ký"} handleOnSubmit={handleOnSubmit}/>
  );
};

export default Login;