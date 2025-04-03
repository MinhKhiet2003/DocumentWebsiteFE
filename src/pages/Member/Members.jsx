import React from 'react';
import './Members.css';
import imgkhiet from '../../assets/members/image.png';
import imgha from '../../assets/members/ha.jpg';
import imgsinh from '../../assets/members/sinh.jpg';
import imgnam from '../../assets/members/nam.png';
import imgmai from '../../assets/members/mai.png';
import imgchi from '../../assets/members/chi.png';

const Members = () => {
  const teamMembers = [
    {
      name: 'Nguyễn Vũ Mai Chi',
      role: 'Thành viên nhóm',
      description: 'Nguyễn Vũ Mai Chi là sinh viên lớp K71A1, có đam mê nghiên cứu hóa học và ứng dụng trong thực tiễn.',
      email: 'ngvumaichi1809@gmail.com',
      photo: imgchi
    },
    {
      name: 'Văn Thị Phương Nam',
      role: 'Thành viên nhóm',
      description: 'Văn Thị Phương Nam thuộc lớp K72K, quan tâm đến lĩnh vực hóa học phân tích và nghiên cứu môi trường.',
      email: 'vanthiphuongnam@gmail.com',
      photo: imgnam
    },
    {
      name: 'Tạ Minh Khiết',
      role: 'Thành viên nhóm',
      description: 'Tạ Minh Khiết là sinh viên lớp K71E2 - K.CNTT, đam mê lập trình và phát triển phần mềm.',
      email: 'khiet2003@gmail.com',
      photo: imgkhiet
    },
    {
      name: 'Nguyễn Thị Thu Hà',
      role: 'Thành viên nhóm',
      description: 'Nguyễn Thị Thu Hà là sinh viên lớp K71K, yêu thích nghiên cứu và thực nghiệm trong lĩnh vực hóa học.',
      email: 'thuhanguyenth2003@gmail.com',
      photo: imgha
    },
    {
      name: 'Phùng Thị Mai',
      role: 'Thành viên nhóm',
      description: 'Phùng Thị Mai đang theo học lớp K71K, có hứng thú với các phản ứng hóa học và ứng dụng của chúng trong công nghiệp.',
      email: 'Mai14112003@gmail.com',
      photo: imgmai
    },
    {
      name: 'Nguyễn Nhất Sinh',
      role: 'Thành viên nhóm',
      description: 'Nguyễn Nhất Sinh là sinh viên lớp K73K, yêu thích hóa hữu cơ và tìm hiểu về các hợp chất ứng dụng trong đời sống.',
      email: 'nnsinh.0912@gmail.com',
      photo: imgsinh
    },
    
  ];

  const handleEmailClick = (email) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="team-container">
      <h1 className="title">Giới Thiệu Các Thành Viên</h1>

      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <div 
            key={index} 
            className="team-member" 
            onClick={() => handleEmailClick(member.email)} 
            style={{ cursor: 'pointer' }} 
          >
            <img src={member.photo} alt={member.name} className="member-photo" />
            <h3 className="member-name">{member.name}</h3>
            <p className="member-role">{member.role}</p>
            <p className="member-description">{member.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Members;
