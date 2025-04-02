import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../Auth/AuthContext';
import './ChemistryOfLife.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChemistryOfLife = () => {
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
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLifeData = async () => {
      try {
        if (!user) {
          navigate('/login');
          return;
        }

        const token = localStorage.getItem('token');
        
        // Fetch classes
        const classesResponse = await fetch('http://localhost:5168/api/Categories/used-classes', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!classesResponse.ok) throw new Error('Failed to fetch classes');
        const classesData = await classesResponse.json();
        setClasses(classesData);

        // Fetch life questions
        const response = await fetch('http://localhost:5168/api/Life', {
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
          throw new Error('Failed to fetch life questions');
        }

        const data = await response.json();
        setLifeData(data);
        
        // Initialize answers
        const initialAnswers = {};
        data.forEach(item => {
          initialAnswers[item.id] = '';
        });
        setUserAnswers(initialAnswers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLifeData();
  }, [user, navigate]);

  useEffect(() => {
    // Fetch categories when class is selected
    const fetchCategories = async () => {
      if (!selectedClass) {
        setCategories([]);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `http://localhost:5168/api/Categories/by-class/${selectedClass}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
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
    setSelectedCategory(''); // Reset category when class changes
  }, [selectedClass]);

  useEffect(() => {
    // Filter data when category is selected
    if (selectedCategory) {
      const result = lifeData.filter(item => 
        item.category_id.toString() === selectedCategory
      );
      setFilteredData(result);
    } else {
      setFilteredData([]);
    }
  }, [selectedCategory, lifeData]);

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const checkAllAnswered = (questions) => {
    return questions.every(q => userAnswers[q.id]?.trim() !== '');
  };

  const handleSubmitAnswers = () => {
    if (checkAllAnswered(filteredData)) {
      setAnsweredQuestions(prev => [...prev, ...filteredData.map(q => q.id)]);
    } else {
      toast.error('Vui lòng trả lời tất cả câu hỏi trước khi xem đáp án');
    }
  };

  if (!user) return null;

  if (loading) return (
    <div className="loading-container">
      <p>Đang tải dữ liệu...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <p className="error-message">Lỗi: {error}</p>
    </div>
  );

  return (
    <div className="chemistry-container">
      <h1>Hóa học trong đời sống</h1>
      
      <div className="filter-section">
        <div className="filter-group">
          <label htmlFor="class-select">Lớp học</label>
          <select
            id="class-select"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
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

      {selectedCategory && filteredData.length > 0 ? (
        <div className="questions-container">
          <h2>{categories.find(c => c.id.toString() === selectedCategory)?.name}</h2>
          
          <div className="questions-list">
            {filteredData.map((question) => (
              <div key={question.id} className="question-card">
                <div className="question-content">
                  <p className="question-text">{question.question}</p>
                  <input
                    type="text"
                    value={userAnswers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    placeholder="Nhập câu trả lời của bạn..."
                    className="answer-input"
                  />
                </div>
                
                {answeredQuestions.includes(question.id) && (
                  <div className="answer-section">
                    <p className="correct-answer">Đáp án gợi ý: {question.answer}</p>
                    <p className="answer-author">
                      Tác giả: {question.username || 'Không xác định'}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="actions">
            <p className="question-count">
              {filteredData.length} câu hỏi trong chủ đề này
            </p>
            <button 
              onClick={handleSubmitAnswers}
              className="submit-button"
            >
              Kiểm tra đáp án
            </button>
          </div>
        </div>
      ) : selectedCategory ? (
        <p className="no-questions">Không có câu hỏi nào trong danh mục này</p>
      ) : (
        !selectedClass && (
          <p className="no-questions">Vui lòng chọn lớp và danh mục để xem câu hỏi</p>
        )
      )}
      <ToastContainer />
    </div>
  );
};

export default ChemistryOfLife;