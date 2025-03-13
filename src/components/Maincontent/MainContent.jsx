import React from 'react';
import './MainContent.css';
const MainContent = () => {
  return (
    <main className="content">
      <div className="tab-navigation">
        <a href="#">Lớp 6</a>
        <a href="#">Lớp 7</a>
        <a href="#">Lớp 8</a>
        <a href="#">Lớp 9</a>
        <a href="#">Lớp 10</a>
        <a href="#">Lớp 11</a>
        <a href="#">Lớp 12</a>
      </div>

      <div className="section">
        <div className="section-header d-flex justify-content-between align-items-center">
          <h3>Kế hoạch bài dạy</h3>
          <div className="see-more">
            <a href="#">Xem tất cả &rarr;</a>
          </div>
        </div>
        <div className="cards" id="documents-list">
          {/* Documents will be appended here */}
        </div>
        <div id="document-viewer" style={{ marginTop: '20px' }}>
          {/* Document viewer will be appended here */}
        </div>
      </div>
      {/* Repeat similar structure for other sections */}
    </main>
  );
};

export default MainContent;