import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import { AuthContext } from '../../Auth/AuthContext';
import StarRating from '../StarRating/StarRating';
import Tabs from '../Tabs/Tabs';
import Pagination from '../Pagination/Pagination';
import './CommonResource.css';
const CommonResource = ({
  resourceType, 
  apiEndpoint, 
  title, 
  itemsPerPage = 6,
  additionalFilters = null,
  imageField = 'imageUrl',
  titleField = 'title',
  descriptionField = 'description',
  dateField = 'createdAt',
  authorField = 'uploadedByUsername'
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!user) {
          navigate('/login');
          return;
        }

        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams(location.search);
        const categoryId = queryParams.get('categoryId');
        const searchQuery = queryParams.get('search');
        const classId = queryParams.get('classId');

        let apiUrl = apiEndpoint;

        // Tạo query params cho API
        const apiParams = new URLSearchParams();
        if (searchQuery) apiParams.set('name', searchQuery || 'title', searchQuery);
        if (categoryId) apiParams.set('categoryId', categoryId);
        if (classId) apiParams.set('classId', classId);
        
        // Thêm các filter bổ sung
        if (additionalFilters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value) apiParams.set(key, value);
          });
        }

        apiUrl += `?${apiParams.toString()}`;

        if (categoryId) {
          const categoryResponse = await fetch(`https://hachieve.runasp.net/api/Categories/${categoryId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });

          if (categoryResponse.ok) {
            const categoryData = await categoryResponse.json();
            setCurrentCategory(categoryData);
          }
        } else {
          setCurrentCategory(null);
        }

        // Lấy danh sách items
        const response = await fetch(apiUrl, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error(response.status === 404 ? 
            `Không tìm thấy ${title.toLowerCase()} nào` : 
            `Lỗi khi tải dữ liệu ${title.toLowerCase()}`);
        }

        const data = await response.json();
        setItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate, location.search, filters]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCardClick = (e, itemId) => {
    if (!user) {
      e.preventDefault();
      navigate('/login');
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  // Tính toán items cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) {
    return (
      <div className="flex-wrap">
        <Sidebar />
        <div className="Resource-container">
          <Tabs />
          <h1>{title}{currentCategory && `: ${currentCategory.name}`}</h1>
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-wrap">
        <Sidebar />
        <div className="Resource-container">
          <Tabs />
          <h1>{title}{currentCategory && `: ${currentCategory.name}`}</h1>
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-wrap">
      <Sidebar />
      <div className="Resource-container">
        <Tabs />
        <div className="resource-header">
          <h1>{title}{currentCategory && `: ${currentCategory.name}`}</h1>
          {additionalFilters && (
            <div className="resource-filters">
              {additionalFilters.map(filter => (
                <select
                  key={filter.name}
                  className="form-select"
                  value={filters[filter.name] || ''}
                  onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                >
                  <option value="">{filter.placeholder}</option>
                  {filter.options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ))}
            </div>
          )}
        </div>
        
        {items.length === 0 ? (
          <div className="alert alert-info mt-3" role="alert">
            Không có {title.toLowerCase()} nào được tìm thấy.
          </div>
        ) : (
          <>
            <div className="cards-grid">
              {currentItems.map((item) => (
                <Link
                  to={`/resources/${resourceType}/${item.id || item.video_id}`}
                  key={item.id || item.video_id}
                  className="card-link"
                  onClick={(e) => handleCardClick(e, item.id || item.video_id)}
                >
                  <div className="card">
                    <div className="card-image">
                      <img
                        src={item[imageField] || "https://hoctot.hocmai.vn/wp-content/uploads/2020/07/on-tap-hoa-hoc.png"}
                        alt={item[titleField]}
                      />
                    </div>
                    <div className="card-content">
                      <h3>{item[titleField]}</h3>
                      <p className="text-muted">{item[descriptionField] || "Không có mô tả"}</p>
                      {item.classify && <p><small>Phân loại: {item.classify}</small></p>}
                      <p><small>Tác giả: {item[authorField] || "Không xác định"}</small></p>
                      <p><small>Ngày tạo: {new Date(item[dateField]).toLocaleDateString()}</small></p>
                      <div className="card-footer">
                        <StarRating averageRating={item.averageRating || 0} />
                        <span className="ms-2">{item.commentCount || 0} phản hồi</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {items.length > itemsPerPage && (
              <Pagination
                currentPage={currentPage}
                totalItems={items.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommonResource;