import React from 'react';
import CustomFormLoginRegister from '../../components/LoginRegister';
const Register = () => {
  return (
    <CustomFormLoginRegister title={"Đăng ký"} isRegister={true} contentButton1={"Đăng ký"} contentButton2={"Đăng nhập"}/>
  );
};

export default Register;