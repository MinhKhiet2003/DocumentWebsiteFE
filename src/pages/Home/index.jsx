import React, { useState, useEffect } from "react";
import "./style.css";
import home1 from '../../assets/home/home1.jpg';
import home2 from '../../assets/home/home2.jpg';
import home3 from '../../assets/home/home3.jpg';
import home4 from '../../assets/home/home4.jpg';
import home5 from '../../assets/home/home5.jpg';
import home6 from '../../assets/home/home6.jpg';
import poster1 from '../../assets/poster1.png';
import poster2 from '../../assets/poster2.png'; 
import poster3 from '../../assets/poster3.png';

const Home = () => {
  const posters = [
    poster1,
    poster2,
    poster3
  ];

  const [currentPoster, setCurrentPoster] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPoster((prev) => (prev + 1) % posters.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [posters.length]);

  // Handle dot click
  const handleDotClick = (index) => {
    setCurrentPoster(index);
  };

  return (
    <div className="home">
      <h1>Giới thiệu nền tảng Hachieve <br /> ( Happy to Achieve )</h1>
      <div className="poster-carousel">
        {posters.map((poster, index) => (
          <img
            key={index}
            className={`poster ${index === currentPoster ? 'active' : ''}`}
            src={poster}
            alt={`Poster ${index + 1}`}
          />
        ))}
        <div className="carousel-dots">
          {posters.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentPoster ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
            ></span>
          ))}
        </div>
      </div>
      <p>
      Trong bối cảnh công nghệ phát triển mạnh mẽ, nền giáo dục cũng không ngừng đổi mới để đáp ứng nhu cầu học tập và giảng dạy ngày càng đa dạng. Đặc biệt, đối với môn Khoa học tự nhiên (phần Chất và sự biến đổi của chất, các lớp 6-7- 8- 9) và môn Hoá học (các lớp 10- 11- 12) có tính ứng dụng thực tiễn cao nhưng thường được xem là khó tiếp cận do tính chất lý thuyết phức tạp và hệ thống công thức đa dạng – việc áp dụng các phương pháp dạy và học tiên tiến là điều vô cùng cần thiết. Chính từ thực tế đó, Hachieve (Happy to Achieve) đã ra đời với sứ mệnh mang lại sự đổi mới toàn diện trong cách tiếp cận và giảng dạy môn học này. 
      </p>
      <p>
      Hachieve là một nền tảng học liệu chuyên biệt dành riêng cho bộ môn môn KHTN, Hoá học, được nghiên cứu và phát triển bởi một nhóm sinh viên đam mê khoa học đến từ khoa Hóa học và khoa Công nghệ Thông tin, Trường Đại học Sư phạm Hà Nội. Với mong muốn Góp phần hỗ trợ GV trong việc giảng dạy và học sinh tiếp cận kiến thức một cách dễ dàng, sáng tạo và hiệu quả hơn, Hachieve không chỉ cung cấp hệ thống tài liệu phong phú mà còn xây dựng một hệ sinh thái học tập hiện đại, ứng dụng công nghệ vào quá trình giảng dạy ôn tập. Nhờ đó, việc học Hoá học nói riêng và học các môn khoa học nói chung không còn khô khan, vật thể mà trở thành nên sinh động, trực quan và hấp dẫn hơn bao giờ hết, giúp học sinh không chỉ nắm vững kiến thức mà còn nuôi dưỡng niềm yêu thích với bộ môn này.
      </p>
      <h2>Hỗ trợ giảng dạy và học tập toàn diện</h2>
      <p>
      Hachieve cung cấp một hệ thống dữ liệu đa dạng, trợ giúp giáo viên và học sinh xây dựng kiến thức một cách hiệu quả thông qua hoạt động sáng tạo và trò chơi tương tác. Nền tảng hỗ trợ quá trình:
      </p>
      <ul>
        <li><b>Trải nghiệm học tập phong phú: </b>Người dùng có thể chơi online trực tiếp trên website, tải tài liệu về và tuỳ chỉnh nội dung theo nhu cầu giảng dạy.</li>
        <li><b>Lập kế hoạch bài dạy: </b> Giáo viên được cung cấp kế hoạch bài dạy tham khảo theo chương trình mới, tích hợp các trò chơi có sẵn trên web với nội dung, hình thức đa dạng phong phú, có sự liên kết thống nhất với nhau.</li>
        <li><b>Đánh giá và trao đổi: </b>Người dùng có thể để lại đánh giá, nhận xét, chia sẻ kinh nghiệm để cùng nhau phát triển nội dung chất lượng hơn.</li>
      </ul>
      <div className="image-gallery">
        <img src={home1} alt="Hoạt động giáo dục trải nghiệm STEM" />
        <img src={home2} alt="Hoạt động giáo dục trải nghiệm STEM" />
        <img src={home3} alt="Hoạt động giáo dục trải nghiệm STEM" />
      </div>
      <h2>Hướng tới cộng đồng học tập Hóa học sôi động, sáng tạo và kết nối</h2>
      <p>
      Nhằm mục đích phát triển, mở rộng tài nguyên và không gian học tập của website, Hachieve định hướng trong tương lai sẽ cập nhật quyền đăng tải tài liệu để các thầy cô giáo có thể chia sẻ học hỏi lẫn nhau, chung tay tạo một kho tài liệu giá trị trên website; bên cạnh đó mở các diễn đàn trao đổi học tập trực tuyến tích hợp và ứng dụng trí tuệ nhân tạo AI vào việc cập nhật các tài liệu học tập và tin tức sự kiện,...
      </p>
      <div className="image-gallery">
        <img src={home4} alt="Hoạt động giáo dục trải nghiệm STEM" />
        <img src={home5} alt="Hoạt động giáo dục trải nghiệm STEM" />
        <img src={home6} alt="Hoạt động giáo dục trải nghiệm STEM" />
      </div>
      <p>
        Với Hachieve, học Hóa chưa bao giờ dễ dàng và thú vị đến thế!
      </p>
    </div>
  );
};

export default Home;