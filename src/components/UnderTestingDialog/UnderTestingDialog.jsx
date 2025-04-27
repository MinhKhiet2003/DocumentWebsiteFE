import React from 'react';
import './UnderTestingDialog.css';
import qrcodeST from '../../assets/qrcodeST.png';
import qrcodeTC from '../../assets/qrcodeTC.png';

const UnderTestingDialog = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-container">
        <span className="dialog-close-icon" onClick={onClose}>
          ×
        </span>
        <h2 className="dialog-title">Cảm Ơn Bạn Đã Sử Dụng Website!</h2>
        <p className="dialog-message">
          Chúng tôi rất trân trọng sự tin tưởng của bạn. Website hiện đang trong giai đoạn thử nghiệm, và chúng tôi rất mong nhận được ý kiến đóng góp từ bạn để hoàn thiện hơn. Vui lòng quét mã QR dưới đây để gửi đánh giá và góp ý cho chúng tôi!
        </p>
        <div className="qr-code-container">
          <div className="qr-code-item">
            <a href="https://forms.gle/9RfZjY2mFcZu12JT8" target="_blank" rel="noopener noreferrer">
              <img
                src={qrcodeST}
                alt="QR Code Học Sinh"
                className="dialog-qr-code"
              />
            </a>
            <p className="qr-code-label">Học Sinh</p>
          </div>
          <div className="qr-code-item">
            <a href="https://forms.gle/ax1cV8rv4pjfhPT69" target="_blank" rel="noopener noreferrer">
              <img
                src={qrcodeTC}
                alt="QR Code Giáo Viên"
                className="dialog-qr-code"
              />
            </a>
            <p className="qr-code-label">Giáo Viên</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderTestingDialog;