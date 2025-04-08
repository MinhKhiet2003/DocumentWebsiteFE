import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../../../components/Sidebar/Sidebar';
import { AuthContext } from '../../../../Auth/AuthContext';
import './LessonPlanDetail.css';
import { toast,ToastContainer } from 'react-toastify';

const LessonPlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isValidUrl, setIsValidUrl] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        if (!user) {
          navigate('/login');
          return;
        }

        const token = localStorage.getItem('token');
        const response = await fetch(`https://hachieve.vercel.app/api/Document/${id}`, {
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
          throw new Error('Không thể tải tài liệu');
        }

        const data = await response.json();
        setDocument(data);
        
        // Kiểm tra URL ngay khi nhận dữ liệu
        if (data.file_path) {
          const isValid = validateGoogleDocsUrl(data.file_path);
          setIsValidUrl(isValid);
          if (!isValid) {
            toast.error('Đường dẫn tài liệu không hợp lệ');
          }
        }
      } catch (err) {
        toast.error(err.message || 'Đã xảy ra lỗi khi tải tài liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id, user, navigate]);
  const handleGoBack = () => {
    navigate(`/resources/lesson-plans${location.search}`);
  };
  const validateGoogleDocsUrl = (url) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname !== 'docs.google.com') return false;
      
      const pathParts = urlObj.pathname.split('/');
      if (pathParts.length < 4) return false;
      
      return true;
    } catch {
      return false;
    }
  };

  const handleOpenInNewWindow = (e) => {
    if (!isValidUrl) {
      e.preventDefault();
      toast.error('Không thể mở tài liệu do đường dẫn không hợp lệ');
    }
  };

  const handleDownloadPDF = (e) => {
    if (!isValidUrl) {
      e.preventDefault();
      toast.error('Không thể tải xuống do đường dẫn không hợp lệ');
    }
  };

  if (!user) return null;

  if (loading) return <p>Đang tải dữ liệu...</p>;

  if (!document) return <p>Không tìm thấy tài liệu</p>;

  return (
    <div className="document-detail">
      <div className='document-title'>
          <h1>{document.title}</h1>
          <button onClick={handleGoBack} className="back-button">← Quay lại</button>
        </div>
      
      <div className="document-meta">
        <p><strong>Tác giả:</strong> {document.uploadedByUsername}</p>
        <p><strong>Ngày tạo:</strong> {new Date(document.createdAt).toLocaleDateString()}</p>
        <p><strong>Cập nhật lần cuối:</strong> {new Date(document.updatedAt).toLocaleDateString()}</p>
      </div>

      {document.description && (
        <div className="document-description">
          <h2>Mô tả</h2>
          <p>{document.description}</p>
        </div>
      )}

      {document.file_path && (
        <div className="document-content">
          <h2>Nội dung</h2>
          
          {isValidUrl ? (
            <>
              <div className="document-embed-container">
                <iframe
                  src={getEmbedUrl(document.file_path)}
                  className="document-embed"
                  title={document.title}
                  allowFullScreen
                />
              </div>
              <div className="document-actions">
                <a 
                  href={document.file_path} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="external-link"
                  onClick={handleOpenInNewWindow}
                >
                  Mở trong cửa sổ mới
                </a>
                <a
                  href={`https://docs.google.com/document/d/${getDocId(document.file_path)}/export?format=pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-link"
                  onClick={handleDownloadPDF}
                >
                  Tải xuống PDF
                </a>
              </div>
            </>
          ) : (
            <div className="document-error">
              <p>Tài liệu không khả dụng, vui lòng phản ánh lại với giáo viên !</p>
            </div>
          )}
        </div>
      )}
      <ToastContainer />
    </div>
  );

  function getEmbedUrl(url) {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      const docId = pathParts[3];
      return `https://docs.google.com/document/d/${docId}/preview`;
    } catch {
      return '';
    }
  }

  function getDocId(url) {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      return pathParts[3];
    } catch {
      return '';
    }
  }
};

export default LessonPlanDetail;