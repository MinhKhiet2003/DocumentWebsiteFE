import React from "react";
import "./style.css";
import home1 from '../../assets/home/home1.jpg';
import home2 from '../../assets/home/home2.jpg';
import home3 from '../../assets/home/home3.jpg';
import home4 from '../../assets/home/home4.jpg';
import home5 from '../../assets/home/home5.jpg';
import home6 from '../../assets/home/home6.jpg';
import poster from '../../assets/poster.png';

const Home = () => {
  return (
    <div className="home">
      <h1>Giới thiệu nền tảng Hachieve <br /> ( Happy to Achieve )</h1>
      <img className="poster" src = {poster} alt="" />
      <p>
        Trong bối cảnh công nghệ số phát triển mạnh mẽ, nền giáo dục cũng không ngừng đổi mới để đáp ứng nhu cầu học tập và giảng dạy ngày càng đa dạng. Đặc biệt, đối với môn Hóa học – một bộ môn khoa học tự nhiên có tính ứng dụng thực tiễn cao nhưng lại thường được xem là khó tiếp cận do tính chất lý thuyết phức tạp và hệ thống công thức đa dạng – việc áp dụng những phương pháp dạy và học tiên tiến là điều vô cùng cần thiết. Chính từ thực tế đó, Hachieve (Happy to Achieve) đã ra đời với sứ mệnh mang lại sự đổi mới toàn diện trong cách tiếp cận và giảng dạy môn học này.
     </p>
     <p>
     Hachieve là một nền tảng học liệu số chuyên biệt dành riêng cho bộ môn Hóa học, được nghiên cứu và phát triển bởi một nhóm sinh viên đam mê khoa học đến từ khoa Hóa học và khoa Công nghệ Thông tin, Trường Đại học Sư phạm Hà Nội. Với mong muốn hỗ trợ giáo viên và học sinh tiếp cận kiến thức một cách dễ dàng, sáng tạo và hiệu quả hơn, Hachieve không chỉ cung cấp hệ thống tài liệu phong phú mà còn xây dựng một hệ sinh thái học tập hiện đại, ứng dụng công nghệ vào quá trình giảng dạy và ôn luyện. Nhờ đó, việc học Hóa học không còn khô khan, trừu tượng mà trở nên sinh động, trực quan và hấp dẫn hơn bao giờ hết, giúp học sinh không chỉ nắm vững kiến thức mà còn nuôi dưỡng niềm yêu thích với bộ môn này.
     </p>
      <h2>Hỗ trợ giảng dạy và học tập toàn diện</h2>
      <p>Hachieve cung cấp một hệ thống học liệu đa dạng, giúp giáo viên và học sinh củng cố kiến thức một cách hiệu quả thông qua các hoạt động ôn tập sáng tạo và trò chơi tương tác. Nền tảng cho phép:
      </p>
      <ul>
        <li><b>Trải nghiệm học tập phong phú: </b>Người dùng có thể chơi trực tiếp các trò chơi, tải về tài liệu để sử dụng ngoại tuyến, hoặc tùy chỉnh nội dung theo nhu cầu giảng dạy.</li>
        <li><b>Lập kế hoạch bài dạy: </b> Giáo viên có thể xây dựng và tổ chức các hoạt động học tập theo chủ đề, tích hợp các trò chơi vào bài giảng một cách linh hoạt.</li>
        <li><b>Đánh giá và trao đổi: </b>Người dùng có thể để lại đánh giá, nhận xét, chia sẻ kinh nghiệm để cùng nhau phát triển nội dung chất lượng hơn.</li>
      </ul>

      <div  className="image-gallery">
        <img src= {home1} alt="Hoạt động giáo dục trải nghiệm STEM" />
        <img src= {home2} alt="Hoạt động giáo dục trải nghiệm STEM" />
        <img src= {home3} alt="Hoạt động giáo dục trải nghiệm STEM" />
      </div>

      <h2>Hướng tới cộng đồng học tập Hóa học sôi động, sáng tạo và kết nối</h2>
      <p>
        Trong bối cảnh giáo dục hiện nay, số lượng học sinh lựa chọn Hóa học như một môn học chính đang có xu hướng giảm dần. Nguyên nhân chủ yếu đến từ việc học sinh cảm thấy Hóa học là một môn học khó, khô khan và thiếu sự liên kết với thực tế, khiến động lực học tập bị giảm sút. Hơn nữa, phương pháp giảng dạy truyền thống với nhiều công thức phức tạp, nội dung lý thuyết nặng nề đôi khi chưa thực sự khơi gợi hứng thú học tập, khiến học sinh gặp khó khăn trong việc tiếp thu và ứng dụng kiến thức.   
      </p>
      <p>
        Thấu hiểu những thách thức này, Hachieve được tạo ra với mong muốn thay đổi cách tiếp cận đối với môn Hóa học, biến việc học tập trở thành một hành trình khám phá đầy thú vị. Không chỉ đơn thuần là một nền tảng học liệu số cung cấp kiến thức một cách có hệ thống, Hachieve còn mang đến một không gian học tập sáng tạo, nơi học sinh có thể học tập thông qua các phương pháp trực quan, tương tác và ứng dụng thực tế. Nhờ vào các bài giảng sinh động, mô phỏng thí nghiệm ảo, bài tập tương tác và hệ thống câu hỏi đa dạng, học sinh có thể nắm bắt kiến thức dễ dàng hơn, từ đó tăng cường khả năng ghi nhớ và vận dụng linh hoạt vào thực tiễn.
      </p>
      <p>
        Bên cạnh đó, Hachieve không chỉ đóng vai trò là công cụ hỗ trợ giảng dạy mà còn hướng tới việc xây dựng một cộng đồng học tập sôi động dành cho những ai yêu thích và đam mê bộ môn Hóa học. Đây là nơi mà giáo viên, học sinh, sinh viên và những người quan tâm có thể kết nối, chia sẻ tài nguyên, kinh nghiệm cũng như cùng nhau thảo luận, giải đáp các vấn đề liên quan đến Hóa học. Thông qua diễn đàn học thuật, các buổi thảo luận trực tuyến, cũng như các hoạt động giao lưu, Hachieve tạo ra một môi trường mở, khuyến khích sự sáng tạo, chủ động và hợp tác trong học tập.
      </p>
      <p>
      Không dừng lại ở đó, Hachieve còn là một bước tiến trong việc ứng dụng công nghệ vào giáo dục, mở ra một cách tiếp cận mới giúp nâng cao hiệu quả dạy và học trong thời đại số. Với sự kết hợp giữa trí tuệ nhân tạo (AI), dữ liệu lớn (Big Data) và các phương pháp giảng dạy hiện đại, Hachieve giúp cá nhân hóa lộ trình học tập cho từng học sinh, giúp mỗi người có thể học theo tốc độ và phong cách riêng của mình. Điều này không chỉ giúp cải thiện chất lượng giáo dục mà còn truyền cảm hứng để học sinh tự tin theo đuổi đam mê, khám phá sâu hơn về thế giới Hóa học.
      </p>
      <div className="image-gallery">
      <img src= {home4} alt="Hoạt động giáo dục trải nghiệm STEM" />
      <img src=  {home5} alt="Hoạt động giáo dục trải nghiệm STEM" />
      <img src= {home6} alt="Hoạt động giáo dục trải nghiệm STEM" />
      </div>

      <p>
        Với Hachieve, học Hóa chưa bao giờ dễ dàng và thú vị đến thế!
      </p>
    </div>
  );
};

export default Home;
