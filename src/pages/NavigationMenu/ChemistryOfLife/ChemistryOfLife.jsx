import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../../Auth/AuthContext';
import './ChemistryOfLife.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChemistryOfLife = () => {
  // Các state hiện có
  const [lifeData, setLifeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [categories, setCategories] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [questionSets, setQuestionSets] = useState([]);
  const [selectedQuestionSet, setSelectedQuestionSet] = useState(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Thêm các state mới cho comment
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchLifeData = async () => {
      try {
        if (!user) {
          navigate('/login');
          return;
        }

        const token = localStorage.getItem('token');
        
        // Fetch classes, life questions và comments
        const [classesResponse, lifeResponse] = await Promise.all([
          fetch('https://hachieve.runasp.net/api/Categories/used-classes', {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
          fetch('https://hachieve.runasp.net/api/Life', {
            headers: { 'Authorization': `Bearer ${token}` },
          })
        ]);

        if (!classesResponse.ok) throw new Error('Failed to fetch classes');
        if (!lifeResponse.ok) {
          if (lifeResponse.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch life questions');
        }

        const [classesData, lifeData] = await Promise.all([
          classesResponse.json(),
          lifeResponse.json()
        ]);

        setClasses(classesData);
        setLifeData(lifeData);
        
        // Initialize answers
        const initialAnswers = {};
        lifeData.forEach(item => {
          initialAnswers[item.id] = '';
        });
        setUserAnswers(initialAnswers);

        // Extract unique question sets
        const sets = [...new Set(lifeData.map(item => item.questionSet))].sort((a, b) => a - b);
        setQuestionSets(sets);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLifeData();
  }, [user, navigate]);

  // Thêm hàm fetchComments
  const fetchComments = async (questionSet, categoryId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://hachieve.runasp.net/api/comment/by-questionset?questionSet=${questionSet}&categoryId=${categoryId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      if (!selectedClass) {
        setCategories([]);
        setSelectedCategory('');
        setSelectedQuestionSet(null);
        setShowQuestions(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `https://hachieve.runasp.net/api/Categories/by-class/${selectedClass}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, [selectedClass]);

  useEffect(() => {
    if (selectedCategory) {
      const result = lifeData.filter(item => 
        item.category_id.toString() === selectedCategory
      );
      setFilteredData(result);
      setSelectedQuestionSet(null);
      setShowQuestions(false);
    } else {
      setFilteredData([]);
      setSelectedQuestionSet(null);
      setShowQuestions(false);
    }
  }, [selectedCategory, lifeData]);

  const filterByQuestionSet = (set) => {
    setSelectedQuestionSet(set);
    const result = lifeData.filter(item => 
      item.category_id.toString() === selectedCategory && 
      item.questionSet === set
    );
    setFilteredData(result);
    setShowQuestions(true);
    // Load comments khi chọn bộ câu hỏi
    fetchComments(set, parseInt(selectedCategory));
  };

  // Thêm các hàm xử lý comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Vui lòng nhập nội dung bình luận');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://hachieve.runasp.net/api/comment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          userId: user.id,
          questionSet: selectedQuestionSet,
          categoryId: parseInt(selectedCategory)
        }),
      });

      if (!response.ok) {
        throw new Error('Không thể gửi bình luận');
      }

      const addedComment = await response.json();
      const updatedComment = {
        ...addedComment,
        user: {
          user_id: user.id,
          username: user.username || 'Người dùng', 
        },
        createdAt: new Date().toISOString(),
      };
      setComments([...comments, updatedComment]);
      setNewComment('');
      toast.success('Bình luận đã được gửi');
    } catch (err) {
      toast.error(err.message || 'Đã xảy ra lỗi khi gửi bình luận');
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.comment_id);
    setEditedContent(comment.content);
    setDropdownOpen(null);
  };

  const handleUpdateComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://hachieve.runasp.net/api/comment/${commentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editedContent,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Không thể cập nhật bình luận');
      }

      const updatedComment = await response.json();
      setComments(comments.map(c => (c.comment_id === commentId ? updatedComment : c)));
      setEditingCommentId(null);
      setEditedContent('');
      toast.success('Bình luận đã được cập nhật');
    } catch (err) {
      toast.error(err.message || 'Đã xảy ra lỗi khi cập nhật bình luận');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://hachieve.runasp.net/api/comment/${commentId}?userId=${user.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Không thể xóa bình luận');
      }

      setComments(comments.filter(c => c.comment_id !== commentId));
      toast.success('Bình luận đã được xóa');
    } catch (err) {
      toast.error(err.message || 'Đã xảy ra lỗi khi xóa bình luận');
    }
  };

  const toggleDropdown = (commentId) => {
    setDropdownOpen(dropdownOpen === commentId ? null : commentId);
  };

  // Các hàm hiện có giữ nguyên
  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitAnswers = async () => {
    if (!checkAllAnswered(filteredData)) {
      toast.error('Vui lòng trả lời tất cả câu hỏi trước khi xem đáp án');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setAnsweredQuestions(prev => [...prev, ...filteredData.map(q => q.id)]);
      toast.success('Kiểm tra đáp án thành công!');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi kiểm tra đáp án');
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkAllAnswered = (questions) => {
    return questions.every(q => userAnswers[q.id]?.trim() !== '');
  };

  const handleGoBack = () => {
    navigate(location.state?.from || '/resources/');
  };

  if (!user) return null;

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Đang tải dữ liệu...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <p className="error-message">Lỗi: {error}</p>
      <button onClick={() => window.location.reload()} className="retry-button">
        Thử lại
      </button>
    </div>
  );

  return (
    <div className="chemistry-container">
      <div className='chemistry-header'>
        <button onClick={handleGoBack} className="back-button">
          <i className="fas fa-arrow-left"></i> Quay lại
        </button>
        <h1>Hóa học trong đời sống</h1>
      </div>
      
      <div className="filter-section">
        <div className="filter-group">
          <label htmlFor="class-select">Lớp học</label>
          <select
            id="class-select"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="custom-select"
          >
            <option value="">-- Chọn lớp học --</option>
            {classes.map(classItem => (
              <option key={classItem.id} value={classItem.id}>
                Lớp {classItem.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="category-select">Chủ đề</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={!selectedClass || categories.length === 0}
            className="custom-select"
          >
            <option value="">-- Chọn chủ đề --</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {selectedClass && categories.length === 0 && (
            <p className="no-categories-message">Không có chủ đề nào cho lớp này</p>
          )}
        </div>
      </div>

      {selectedCategory && (
        <div className="question-sets-container">
          <h3 className="sets-title">Chọn bộ câu hỏi</h3>
          <div className="sets-grid">
            {questionSets.map((set) => (
              <button
                key={set}
                className={`set-card ${selectedQuestionSet === set ? 'active' : ''}`}
                onClick={() => filterByQuestionSet(set)}
              >
                Bộ {set}
              </button>
            ))}
          </div>
        </div>
      )}

      {showQuestions && (
        <div className="questions-section">
          <div className="section-header">
            <h2>
              {categories.find(c => c.id.toString() === selectedCategory)?.name}
              {selectedQuestionSet && <span> - Bộ {selectedQuestionSet}</span>}
            </h2>
            {filteredData.length > 0 && (
              <p className="question-count">
                {filteredData.length} câu hỏi
              </p>
            )}
          </div>

          {filteredData.length > 0 ? (
            <>
              <div className="questions-list">
                {filteredData.map((question) => (
                  <div key={question.id} className="question-card">
                    <div className="question-content">
                      <p className="question-text">
                        <span className="question-number">Câu {filteredData.indexOf(question) + 1}: </span>
                        {question.question}
                      </p>
                      <textarea
                        value={userAnswers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        placeholder="Nhập câu trả lời của bạn..."
                        className="answer-input"
                        rows="3"
                      />
                    </div>
                    
                    {answeredQuestions.includes(question.id) && (
                      <div className="answer-section">
                        <div className="answer-header">
                          <span className="answer-label">Đáp án gợi ý:</span>
                        </div>
                        <p className="correct-answer">{question.answer}</p>
                        {question.username && (
                          <p className="answer-author">
                            <i className="fas fa-user"></i> {question.username}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Thêm phần comment vào đây */}
              <div className="comments-section">
                <h3>Bình luận về bộ câu hỏi</h3>
                <div className="comments-list">
                  {comments.length > 0 ? (
                    comments.map(comment => (
                      <div key={comment.comment_id} className="comment-item">
                        <div className="comment-header">
                          <span className="comment-author">{comment.user?.username || 'Người dùng'}</span>
                          <div className="comment-meta">
                            <span className="comment-date">
                              {new Date(comment.createdAt).toLocaleString()}
                            </span>
                            {comment.user_id === user.id && (
                              <div className="comment-actions">
                                <button
                                  className="more-options"
                                  onClick={() => toggleDropdown(comment.comment_id)}
                                >
                                  ⋮
                                </button>
                                {dropdownOpen === comment.comment_id && (
                                  <div className="dropdown-menu">
                                    <button onClick={() => handleEditComment(comment)}>Sửa</button>
                                    <button onClick={() => handleDeleteComment(comment.comment_id)}>Xóa</button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        {editingCommentId === comment.comment_id ? (
                          <div className="edit-comment">
                            <textarea
                              value={editedContent}
                              onChange={(e) => setEditedContent(e.target.value)}
                            />
                            <div className="edit-actions">
                              <button onClick={() => handleUpdateComment(comment.comment_id)}>Lưu</button>
                              <button onClick={() => setEditingCommentId(null)}>Hủy</button>
                            </div>
                          </div>
                        ) : (
                          <p className="comment-content">{comment.content}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>Chưa có bình luận nào.</p>
                  )}
                </div>

                <form className="comment-form" onSubmit={handleCommentSubmit}>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Viết bình luận của bạn về bộ câu hỏi này..."
                  />
                  <button type="submit">Gửi</button>
                </form>
              </div>

              <div className="actions">
                <button 
                  onClick={handleSubmitAnswers}
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Đang xử lý...
                    </>
                  ) : (
                    'Kiểm tra đáp án'
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="no-questions-container">
              <i className="fas fa-question-circle"></i>
              <p>Không có câu hỏi nào trong bộ này</p>
            </div>
          )}
        </div>
      )}

      {!selectedClass && (
        <div className="empty-state">
          <i className="fas fa-flask"></i>
          <p>Vui lòng chọn lớp và chủ đề để bắt đầu</p>
        </div>
      )}

      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default ChemistryOfLife;