import React from 'react';
import './Members.css';

const Members = () => {
  const teamMembers = [
    {
      name: 'Nguyễn Vũ Mai Chi',
      role: 'Supporter',
      description: 'Nguyễn Văn A là giám đốc điều hành của công ty, có nhiều năm kinh nghiệm trong lĩnh vực quản lý.',
      photo: 'https://static2.yan.vn/YanNews/2167221/202102/facebook-cap-nhat-avatar-doi-voi-tai-khoan-khong-su-dung-anh-dai-dien-e4abd14d.jpg'
    },
    {
      name: 'Văn Thị Phương Nam',
      role: 'Trưởng nhóm',
      description: 'Trần Thị B phụ trách chiến lược marketing và xây dựng thương hiệu.',
      photo: 'https://static2.yan.vn/YanNews/2167221/202102/facebook-cap-nhat-avatar-doi-voi-tai-khoan-khong-su-dung-anh-dai-dien-e4abd14d.jpg'
    },
    {
      name: 'Tạ Minh Khiết',
      role: 'Lập trình viên',
      description: 'Lê Minh C là lập trình viên chính, chịu trách nhiệm phát triển các sản phẩm phần mềm của công ty.',
      photo: 'https://static2.yan.vn/YanNews/2167221/202102/facebook-cap-nhat-avatar-doi-voi-tai-khoan-khong-su-dung-anh-dai-dien-e4abd14d.jpg'
    },
    {
      name: 'Nguyễn Thu Hà',
      role: 'Thành viên nhóm',
      description: 'Phạm Ngọc D là người đứng đầu bộ phận thiết kế, chịu trách nhiệm về giao diện và trải nghiệm người dùng.',
      photo: 'https://static2.yan.vn/YanNews/2167221/202102/facebook-cap-nhat-avatar-doi-voi-tai-khoan-khong-su-dung-anh-dai-dien-e4abd14d.jpg'
    },
    {
      name: 'Phùng Thị Mai',
      role: 'Thành viên nhóm',
      description: 'Vũ Thị E có nhiệm vụ quản lý tài chính và các vấn đề liên quan đến ngân sách công ty.',
      photo: 'https://static2.yan.vn/YanNews/2167221/202102/facebook-cap-nhat-avatar-doi-voi-tai-khoan-khong-su-dung-anh-dai-dien-e4abd14d.jpg'
    },
    {
      name: 'Nguyễn Nhất Sinh',
      role: 'Thành viên nhóm',
      description: 'Bùi Minh F là người quản lý tuyển dụng và các chính sách nhân sự của công ty.',
      photo: 'https://static2.yan.vn/YanNews/2167221/202102/facebook-cap-nhat-avatar-doi-voi-tai-khoan-khong-su-dung-anh-dai-dien-e4abd14d.jpg'
    }
  ];

  return (
    
    <div className="team-container">
      <h1 className="title">Giới Thiệu Các Thành Viên</h1>

      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <div key={index} className="team-member">
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
