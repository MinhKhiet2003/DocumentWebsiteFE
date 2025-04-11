import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UserRating.css';

const UserRating = ({
  userId,
  documentId = null,
  exerciseId = null,
  gameId = null,
  videoId = null,
  comicId = null,
}) => {
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);

  // Lấy đánh giá của người dùng
  const fetchUserRating = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ userId });

      if (documentId) params.append('documentId', documentId);
      if (exerciseId) params.append('exerciseId', exerciseId);
      if (gameId) params.append('gameId', gameId);
      if (videoId) params.append('videoId', videoId);
      if (comicId) params.append('comicId', comicId);

      const response = await fetch(
        `https://hachieve.runasp.net/api/Star/user?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const rating = await response.json();
        setUserRating(rating?.total_star ?? 0);
      } else if (response.status === 404) {
        setUserRating(0);
      } else {
        throw new Error('Không thể tải đánh giá');
      }
    } catch (error) {
      console.error('Error fetching user rating:', error);
      toast.error('Không thể tải đánh giá');
    } finally {
      setLoading(false);
    }
  };

  // Lấy đánh giá trung bình
  const fetchAverageRating = async () => {
    try {
      const params = new URLSearchParams();

      if (documentId) params.append('documentId', documentId);
      if (exerciseId) params.append('exerciseId', exerciseId);
      if (gameId) params.append('gameId', gameId);
      if (videoId) params.append('videoId', videoId);
      if (comicId) params.append('comicId', comicId);

      const response = await fetch(
        `https://hachieve.runasp.net/api/Star/average?${params.toString()}`
      );

      if (response.ok) {
        const data = await response.json();
        setAverageRating(data || 0);
      }
    } catch (error) {
      console.error('Error fetching average rating:', error);
    }
  };

  useEffect(() => {
    fetchUserRating();
    fetchAverageRating();
  }, [userId, documentId, exerciseId, gameId, videoId, comicId]);

  // Thêm hoặc cập nhật đánh giá
  const handleRating = async (newRating) => {
    if (loading || !userId) return;

    // Cho phép đặt lại về 0 nếu nhấp vào sao hiện tại
    const ratingToSend = newRating === userRating ? 0 : newRating;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ userId });

      if (documentId) params.append('documentId', documentId);
      if (exerciseId) params.append('exerciseId', exerciseId);
      if (gameId) params.append('gameId', gameId);
      if (videoId) params.append('videoId', videoId);
      if (comicId) params.append('comicId', comicId);

      const response = await fetch(
        `https://hachieve.runasp.net/api/Star/user?${params.toString()}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rating: ratingToSend,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Không thể lưu đánh giá');
      }

      const updatedRating = await response.json();
      setUserRating(updatedRating.total_star);
      await fetchAverageRating();

      toast.success(
        updatedRating.total_star === 0
          ? 'Đã đặt lại đánh giá!'
          : userRating
          ? 'Đánh giá đã được cập nhật!'
          : 'Đánh giá đã được lưu!'
      );
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-rating-container">
      <div className="rating-section">
        <h3>Đánh giá của bạn</h3>
        <div className="star-rating">
          {loading ? (
            <span>Đang tải...</span>
          ) : (
            [1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${
                  star <= (hoverRating || userRating) ? 'filled' : ''
                } ${loading ? 'disabled' : ''}`}
                onClick={() => handleRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                title={`Đánh giá ${star} sao`}
              >
                ★
              </span>
            ))
          )}
          <span className="your-rating">
            ({userRating === 0 ? 'Chưa đánh giá' : userRating})
          </span>
        </div>
      </div>

      <div className="rating-section">
        <h3>Đánh giá trung bình</h3>
        <div className="average-rating">
          {averageRating > 0 ? (
            <>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= Math.round(averageRating) ? 'filled' : ''}`}
                >
                  ★
                </span>
              ))}
              <span>({averageRating.toFixed(1)})</span>
            </>
          ) : (
            <span>Chưa có đánh giá</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserRating;