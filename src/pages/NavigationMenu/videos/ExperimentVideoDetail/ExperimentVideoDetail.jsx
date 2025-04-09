import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../Auth/AuthContext';
import { toast,ToastContainer } from 'react-toastify';
import './ExperimentVideoDetail.css';

const ExperimentVideoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isValidUrl, setIsValidUrl] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        if (!user) {
          navigate('/login');
          return;
        }

        const token = localStorage.getItem('token');
        const response = await fetch(`https://hachieve.runasp.net/api/Video/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error('Không thể tải thông tin video');
        }

        const data = await response.json();
        setVideo(data);
        
        // Kiểm tra URL video YouTube
        if (data.video_url) {
          const isValid = validateYouTubeUrl(data.video_url);
          setIsValidUrl(isValid);
          if (!isValid) {
            toast.error('Đường dẫn video không hợp lệ');
          }
        }
      } catch (err) {
        toast.error(err.message || 'Đã xảy ra lỗi khi tải video');
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id, user, navigate]);

  const validateYouTubeUrl = (url) => {
    try {
      const urlObj = new URL(url);
      // Kiểm tra các domain YouTube hợp lệ
      const validDomains = ['youtube.com', 'youtu.be', 'www.youtube.com'];
      if (!validDomains.includes(urlObj.hostname.replace('www.', ''))) {
        return false;
      }
      
      // Kiểm tra định dạng embed (nếu là embed URL)
      if (url.includes('/embed/')) {
        return true;
      }
      
      // Kiểm tra video ID cho regular YouTube URL
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11);
    } catch {
      return false;
    }
  };
  const handleGoBack = () => {
    navigate(`/resources/experiment-videos${location.search}`);
  };
  const getEmbedUrl = (url) => {
    if (!url) return '';
    
    try {
      // Nếu đã là embed URL thì trả về luôn
      if (url.includes('/embed/')) {
        return url;
      }
      
      // Chuyển đổi regular YouTube URL sang embed URL
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      const videoId = (match && match[2].length === 11) ? match[2] : null;
      
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
      
      return url;
    } catch {
      return '';
    }
  };

  const handleOpenInYouTube = (e) => {
    if (!isValidUrl) {
      e.preventDefault();
      toast.error('Không thể mở video do đường dẫn không hợp lệ');
    }
  };

  if (!user) return null;

  if (loading) return (
        <p>Đang tải video...</p>
  );

  if (!video) return (
        <p>Không tìm thấy video</p>
  );

  return (
    <div className="video-detail">
      <div className='video-title'>
          <h1>{video.title}</h1>
          <button onClick={handleGoBack} className="back-button">← Quay lại</button>
        </div>
      
      <div className="video-meta">
        <p><strong>Tác giả:</strong> {video.uploadedByUsername || "Không xác định"}</p>
        <p><strong>Ngày tạo:</strong> {new Date(video.created_at).toLocaleDateString()}</p>
        <p><strong>Cập nhật lần cuối:</strong> {new Date(video.updated_at).toLocaleDateString()}</p>
      </div>

      {video.description && (
        <div className="video-description">
          <h2>Mô tả</h2>
          <p>{video.description}</p>
        </div>
      )}

      {video.video_url && (
        <div className="video-content">
          <h2>Nội dung video</h2>
          
          {isValidUrl ? (
            <>
              <div className="video-embed-container">
                <iframe
                  src={getEmbedUrl(video.video_url)}
                  className="video-embed"
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="video-actions">
                <a 
                  href={video.video_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="external-link"
                  onClick={handleOpenInYouTube}
                >
                  Mở trên YouTube
                </a>
              </div>
            </>
          ) : (
            <div className="video-error">
              <p>Video không khả dụng, vui lòng phản ánh lại với giáo viên !</p>
            </div>
          )}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ExperimentVideoDetail;