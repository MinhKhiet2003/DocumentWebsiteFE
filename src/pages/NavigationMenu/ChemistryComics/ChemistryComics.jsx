import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar/Sidebar';
import { AuthContext } from '../../../Auth/AuthContext';
import StarRating from '../../../components/StarRating/StarRating';
import Tabs from '../../../components/Tabs/Tabs';
import './ChemistryComics.css';

const ChemistryComics = () => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

        let apiUrl = 'https://hachieve.runasp.net/api/Comic/search';

        // Create API query params
        const apiParams = new URLSearchParams();
        if (searchQuery) apiParams.set('title', searchQuery);
        if (categoryId) apiParams.set('categoryId', categoryId);
        if (classId) apiParams.set('classId', classId);

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

        // Get comics list
        const response = await fetch(apiUrl, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error(response.status === 404 ? 'Không thấy truyện tranh hóa học nào' : 'lỗi không xác định');
        }

        const data = await response.json();
        setComics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate, location.search]);


  const handleCardClick = (e, comicId) => {
    if (!user) {
      e.preventDefault();
      navigate('/login');
    }
  };

  // Calculate comics for current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentComics = comics.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) {
    return (
      <div className="flex-wrap">
        <Sidebar />
        <div className="Resource-container">
          <Tabs />
          <h1>Chemistry Comics{currentCategory && `: ${currentCategory.name}`}</h1>
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
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
          <h1>Chemistry Comics{currentCategory && `: ${currentCategory.name}`}</h1>
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => window.location.reload()}
          >
            Try Again
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
        <h1>Chemistry Comics{currentCategory && `: ${currentCategory.name}`}</h1>
        
        {comics.length === 0 ? (
          <div className="alert alert-info mt-3" role="alert">
            Không có truyện tranh tài liệu nào.
          </div>
        ) : (
          <>
            <div className="cards-grid">
              {currentComics.map((comic) => (
                <Link
                  to={`/resources/chemistry-comics/${comic.id}`}
                  key={comic.id}
                  className="card-link"
                  onClick={(e) => handleCardClick(e, comic.id)}
                >
                  <div className="card">
                    <div className="card-image">
                      <img
                        src={comic.imageUrl || "https://hoctot.hocmai.vn/wp-content/uploads/2020/07/on-tap-hoa-hoc.png"}
                        alt={comic.title}
                      />
                    </div>
                    <div className="card-content">
                      <h3>{comic.title}</h3>
                      <p className="text-muted">{comic.description || "No description"}</p>
                      <p><small>Author: {comic.username || "Unknown"}</small></p>
                      <p><small>Created: {new Date(comic.createdAt).toLocaleDateString()}</small></p>
                      <div className="card-footer">
                        <StarRating averageRating={comic.averageRating} />
                        <span className="ms-2">{comic.commentCount} phản hồi</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChemistryComics;