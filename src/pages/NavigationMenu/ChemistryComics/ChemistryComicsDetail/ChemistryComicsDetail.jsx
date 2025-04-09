import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../../../components/Sidebar/Sidebar';
import { AuthContext } from '../../../../Auth/AuthContext';
import './ChemistryComicsDetail.css';
import { toast, ToastContainer } from 'react-toastify';

const ChemistryComicsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [isGoogleSlide, setIsGoogleSlide] = useState(false);
  const [slideId, setSlideId] = useState('');
  

  useEffect(() => {
    const fetchComic = async () => {
      try {
        if (!user) {
          navigate('/login');
          return;
        }

        const token = localStorage.getItem('token');
        const response = await fetch(`https://hachieve.runasp.net/api/Comic/${id}`, {
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
          throw new Error('Không thể tải truyện tranh');
        }

        const data = await response.json();
        setComic(data);
        
        if (data.comic_url) {
          const { isValid, isSlide, id } = checkGoogleSlideUrl(data.comic_url);
          setIsValidUrl(isValid);
          setIsGoogleSlide(isSlide);
          setSlideId(id);
          
          if (!isValid) {
            toast.error('Đường dẫn truyện tranh không hợp lệ');
          }
        }
      } catch (err) {
        toast.error(err.message || 'Đã xảy ra lỗi khi tải truyện tranh');
      } finally {
        setLoading(false);
      }
    };

    fetchComic();
  }, [id, user, navigate]);

  const handleGoBack = () => {
    navigate(location.state?.from || '/resources/chemistry-comics');
  };
  
  const checkGoogleSlideUrl = (url) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname !== 'docs.google.com') return { isValid: true, isSlide: false, id: '' };
      
      const pathParts = urlObj.pathname.split('/');
      if (pathParts[1] === 'presentation' && pathParts[2] === 'd' && pathParts.length >= 4) {
        return { 
          isValid: true, 
          isSlide: true, 
          id: pathParts[3] 
        };
      }
      return { isValid: true, isSlide: false, id: '' };
    } catch {
      return { isValid: false, isSlide: false, id: '' };
    }
  };

  const handleOpenInNewWindow = (e) => {
    if (!isValidUrl) {
      e.preventDefault();
      toast.error('Không thể mở truyện tranh do đường dẫn không hợp lệ');
    }
  };

  const handleDownloadPDF = (e) => {
    if (!isValidUrl || !isGoogleSlide) {
      e.preventDefault();
      toast.error('Không thể tải xuống do đường dẫn không hợp lệ');
    }
  };

  if (!user) return null;

  if (loading) return <p>Đang tải dữ liệu...</p>;

  if (!comic) return <p>Không tìm thấy truyện tranh</p>;

  return (
      <div className="comic-detail">
        <div className='comic-title'>
          <h1>{comic.title}</h1>
          <button onClick={handleGoBack} className="back-button">← Quay lại</button>
        </div>
        
        <div className="comic-meta">
          <p><strong>Tác giả:</strong> {comic.username || 'Không xác định'}</p>
          <p><strong>Ngày tạo:</strong> {new Date(comic.createdAt).toLocaleDateString()}</p>
          <p><strong>Cập nhật lần cuối:</strong> {new Date(comic.updatedAt).toLocaleDateString()}</p>
          {comic.categoryName && <p><strong>Chủ đề:</strong> {comic.categoryName}</p>}
        </div>

        {comic.description && (
          <div className="comic-description">
            <h2>Mô tả</h2>
            <p>{comic.description}</p>
          </div>
        )}

        {comic.comic_url && (
          <div className="comic-content">
            <h2>Nội dung</h2>
            
            {isValidUrl ? (
              <>
                <div className="comic-embed-container">
                  {isGoogleSlide ? (
                    <iframe
                      src={`https://docs.google.com/presentation/d/${slideId}/embed?start=true&loop=true&delayms=3000`}
                      className="comic-slide-embed"
                      title={comic.title}
                      allowFullScreen
                    />
                  ) : isImageUrl(comic.comic_url) ? (
                    <img 
                      src={comic.comic_url} 
                      alt={comic.title} 
                      className="comic-image"
                    />
                  ) : (
                    <iframe
                      src={comic.comic_url}
                      className="comic-embed"
                      title={comic.title}
                      allowFullScreen
                    />
                  )}
                </div>
                <div className="comic-actions">
                  <a 
                    href={comic.comic_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="external-link"
                    onClick={handleOpenInNewWindow}
                  >
                    Mở trong cửa sổ mới
                  </a>
                  {isGoogleSlide && (
                    <a
                      href={`https://docs.google.com/presentation/d/${slideId}/export/pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="download-link"
                      onClick={handleDownloadPDF}
                    >
                      Tải xuống PDF
                    </a>
                  )}
                </div>
              </>
            ) : (
              <div className="comic-error">
                <p>Truyện tranh không khả dụng, vui lòng phản ánh lại với giáo viên!</p>
              </div>
            )}
          </div>
        )}
        <ToastContainer />
      </div>
  );

  function isImageUrl(url) {
    return /\.(jpeg|jpg|gif|png|webp)$/.test(url.toLowerCase());
  }
};

export default ChemistryComicsDetail;