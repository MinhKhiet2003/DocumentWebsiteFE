import React, { useState } from 'react';
import './News.css';

// Dữ liệu mẫu (giả định lấy từ trang web)
const newsData = [
    {
      title: 'HỘI NGHỊ TRỰC TUYẾN: KẾT NỐI VÀ ĐỒNG HÀNH CÙNG GIÁO VIÊN HÓA HỌC HƯỚNG DẪN THỰC TẬP SƯ PHẠM',
      description:
        'Để chuẩn bị tốt cho thực tập sư phạm năm học 2024-2025, Khoa Hóa học phối hợp với Trường Đại học Sư phạm Hà Nội tổ chức Hội nghị trực tuyến "KẾT NỐI VÀ ĐỒNG HÀNH CÙNG GIÁO VIÊN HÓA HỌC HƯỚNG DẪN THỰC TẬP SƯ PHẠM',
      date: '07-02-2025',
      image: 'https://chem.hnue.edu.vn/Portals/0/NewsImages//700/400/638744858551979345.jpg',
      url: 'https://chem.hnue.edu.vn/Tin-t%E1%BB%A9c/%C4%90%C3%A0o-t%E1%BA%A1o-v%C3%A0-NCKH/p/hoi-nghi-truc-tuyen-ket-noi-va-dong-hanh-cung-giao-vien-hoa-hoc-huong-dan-thuc-tap-su-pham-709',
    },
    {
      title: 'THÔNG TIN HƯỚNG NGHIÊN CỨU CỦA GIẢNG VIÊN KHOA HOÁ HỌC Năm học 2024-2025',
      description: '',
      date: '07-02-2025',
      image: 'https://chem.hnue.edu.vn/Portals/0/NewsImages//200/100/638680964030825282.jpg',
      url: 'https://chem.hnue.edu.vn/Tin-t%E1%BB%A9c/%C4%90%C3%A0o-t%E1%BA%A1o-v%C3%A0-NCKH/p/thong-tin-huong-nghien-cuu-cua-giang-vien-khoa-hoa-hoc-nam-hoc-2024-2025-687',
    },
    {
      title: 'Seminar khoa học: ỨNG DỤNG TRÍ TUỆ NHÂN TẠO TRONG GIẢNG DẠY VÀ NGHIÊN CỨU KHOA HỌC',
      description:
        'Với nhiều năm kinh nghiệm trong học tập và nghiên cứu khoa học có sử dụng trí tuệ nhân tạo (AI), TS Kiều Phương Thuỳ CHUYÊN GIA GIÁO DỤC SÁNG TẠO MICROSOFT (MIE EXPERT) sẽ trao đổi, hướng dẫn người tham dự phương pháp học tập và nghiên cứu khoa học có ứng dụng trí tuệ nhân tạo. Thời gian: 8:30, Thứ 2, ngày 21/10/2024, tại P403, A4. Người tham gia mang theo laptop để thực hành',
      date: '07-02-2025',
      image: 'https://chem.hnue.edu.vn/Portals/0/NewsImages//700/400/638649797948737644.jpg',
      url: 'https://chem.hnue.edu.vn/Tin-t%E1%BB%A9c/%C4%90%C3%A0o-t%E1%BA%A1o-v%C3%A0-NCKH/p/hoi-nghi-truc-tuyen-ket-noi-va-dong-hanh-cung-giao-vien-hoa-hoc-huong-dan-thuc-tap-su-pham-709',
    },
    {
      title: 'Toạ đàm với học giả của Trung tâm đổi mới sáng tạo và khởi nghiệp Sinh viên, ĐHBK Hà Nội và NOVAEDU',
      description:
        '1. PGS.TS Lương Xuân Điển hiện đang công tác tại Khoa Hoá học, Trường Hoá và Khoa học sự sống sẽ báo cáo về đổi mới sáng tạo và khởi nghiệp tại Khoa Hoá học, Trường ĐHSP Hà Nội 2. Bà Bùi Thị Ngần, Giám đốc điều hành NOVASPRO vào 9:00 ngày 7/10/2024 tại P302, Trung tâm Học Liệu, 128 Xuân Thuỷ, Cầu Giấy, Hà Nội',
      date: '27-09-2024',
      image: 'https://chem.hnue.edu.vn/Portals/0/NewsImages//200/100/638638072359312943.png',
      url: 'https://chem.hnue.edu.vn/Tin-t%E1%BB%A9c/%C4%90%C3%A0o-t%E1%BA%A1o-v%C3%A0-NCKH/p/toa-dam-voi-hoc-gia-cua-trung-tam-doi-moi-sang-tao-va-khoi-nghiep-sinh-vien-dhbk-ha-noi-va-novaedu-668',
    },
    {
      title: 'HỘI NGHỊ HOÁ HỮU CƠ TOÀN QUỐC LẦN X',
      description:
        'Hội nghị khoa học toàn quốc lần thứ X " Hoá hữu cơ, Hoá hợp chất thiên nhiên-tiềm năng, cơ hội và thách thức trong thời kỳ hội nhập quốc tế và phát triển bền vững" Hội nghị dự kiến được tổ chức vào ngày 20-21/9/2024 tại Viện Hoá học, Viện Hàn lâm Khoa học và Công nghệ Việt Nam, 18 Hoàng Quốc Việt, Cầu Giấy, Hà Nội',
      date: '29-05-2024',
      image: '',
      url: 'https://chem.hnue.edu.vn/Tin-t%E1%BB%A9c/%C4%90%C3%A0o-t%E1%BA%A1o-v%C3%A0-NCKH/p/thong-bao-so-1-hoi-nghi-hoa-hoc-huu-co-toan-quoc-lan-x-630',
    },
    {
      title: 'KẾ HOẠCH XÉT TẶNG GIẢI THƯỞNG KHOA HỌC GIẢNG VIÊN TRẺ NĂM 2024',
      description:
        'Hạn chót gửi hồ sơ từ 05/05/2024 đến trước 17:00 ngày 10/5/2024. Bản cứng chuyển về PKH ĐHSP; bản mềm email: giaithuongkhcn@hnue.edu.vn',
      date: '06-02-2024',
      // image: 'https://picsum.photos/200/150?random=4',
      url: 'https://chem.hnue.edu.vn/Tin-t%E1%BB%A9c/%C4%90%C3%A0o-t%E1%BA%A1o-v%C3%A0-NCKH/p/ke-hoach-xet-tang-giai-thuong-khoa-hoc-giang-vien-tre-nam-2024-600',
    },
];

const News = () => {
  const [newsList, setNewsList] = useState(newsData);

  const handleNewsClick = (url) => {
    window.location.href = url; // Redirect to the news URL
  };

  return (
    <div className="news-container">
      <h2>Tin tức và Sự kiện về Nghiên cứu Khoa học</h2>
      <ul className="news-list">
        {newsList.map((news, index) => (
          <li
            key={index}
            className="news-item"
            onClick={() => handleNewsClick(news.url)}
          >
            {news.image && (
              <img
                src={news.image}
                alt={news.title}
                className="news-image"
              />
            )}
            <div className="news-content">
              <h3 className="news-title">{news.title}</h3>
              <p className="news-description">{news.description}</p>
              <p className="news-date">
                <strong>Ngày đăng:</strong> {news.date}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default News;