import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';
import axios from 'axios';
import { AuthContext } from '../../Auth/AuthContext';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState(""); 

  const [menuItems, setMenuItems] = useState([
    {
      title: "Kế hoạch bài dạy",
      path: "/resources/lesson-plans",
      resourceType: "document",
      subItems: [],
      loading: false,
      error: null
    },
    {
      title: "Game",
      path: "/resources/games",
      resourceType: "game",
      subItems: [],
      loading: false,
      error: null
    },
    {
      title: "Video thí nghiệm",
      path: "/resources/experiment-videos",
      resourceType: "video",
      subItems: [],
      loading: false,
      error: null
    },
    {
      title: "Bài tập",
      subItems: [
        { title: "Hóa học đời sống", path: "/resources/chemistry-of-life" },
        { 
          title: "Truyện tranh hóa học", 
          path: "/resources/chemistry-comics",
          resourceType: "comic",
          subItems: [],
          loading: false,
          error: null
        },
      ],
    },
  ]);

  const [expanded, setExpanded] = useState(null);
  const [expandedSubMenu, setExpandedSubMenu] = useState(null);

  const authAxios = axios.create({
    baseURL: 'http://20.28.55.54:5168'
  });

  // Thêm interceptor để tự động gắn token
  authAxios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => Promise.reject(error));

  const searchParams = new URLSearchParams(location.search);
  const classId = searchParams.get('classId');

  const fetchCategories = async (resourceType) => {
    if (!user) {
      return [];
    }
  
    try {
      const params = { resourceType };
      if (classId) params.classId = classId;
      
      const response = await authAxios.get('/api/Categories/used-by-type', { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      if (error.response?.status === 401) {
        logout();
        navigate('/login');
      }
      throw error;
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      const currentPath = location.pathname;
      const searchParams = new URLSearchParams(location.search);
      
      if (searchTerm.trim() !== "") {
        searchParams.set('search', searchTerm);
      } else {
        searchParams.delete('search');
      }
  
      navigate(`${currentPath}?${searchParams.toString()}`);
    }
  };

  const buildPath = (basePath, categoryId = null) => {
    const params = new URLSearchParams();
    if (classId) params.set('classId', classId);
    if (categoryId) params.set('categoryId', categoryId);
    return `${basePath}?${params.toString()}`;
  };

  const toggleMenu = async (index, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    const item = menuItems[index];
    
    if (!item.resourceType || item.loading) {
      setExpanded(expanded === index ? null : index);
      return;
    }

    try {
      setMenuItems(prev => prev.map((mi, i) => 
        i === index ? { ...mi, loading: true, error: null } : mi
      ));

      const categories = await fetchCategories(item.resourceType);
      
      setMenuItems(prev => prev.map((mi, i) => 
        i === index ? { 
          ...mi, 
          subItems: categories.map(cat => ({
            title: cat.name,
            path: buildPath(mi.path, cat.id),
            categoryId: cat.id
          })),
          loading: false
        } : mi
      ));
    } catch (error) {
      setMenuItems(prev => prev.map((mi, i) => 
        i === index ? { ...mi, error: "Không thể tải chủ đề", loading: false } : mi
      ));
    }
    
    setExpanded(expanded === index ? null : index);
  };

  const toggleSubMenu = async (menuIndex, subItemIndex, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    const subItem = menuItems[menuIndex].subItems[subItemIndex];
    
    if (!subItem.resourceType || subItem.loading) {
      setExpandedSubMenu(expandedSubMenu === `${menuIndex}-${subItemIndex}` ? null : `${menuIndex}-${subItemIndex}`);
      return;
    }

    try {
      setMenuItems(prev => {
        const newItems = [...prev];
        newItems[menuIndex].subItems[subItemIndex] = {
          ...subItem,
          loading: true,
          error: null
        };
        return newItems;
      });

      const categories = await fetchCategories(subItem.resourceType);
      
      setMenuItems(prev => {
        const newItems = [...prev];
        newItems[menuIndex].subItems[subItemIndex] = {
          ...subItem,
          subItems: categories.map(cat => ({
            title: cat.name,
            path: buildPath(subItem.path, cat.id),
            categoryId: cat.id
          })),
          loading: false
        };
        return newItems;
      });
    } catch (error) {
      setMenuItems(prev => {
        const newItems = [...prev];
        newItems[menuIndex].subItems[subItemIndex] = {
          ...subItem,
          error: "Không thể tải chủ đề",
          loading: false
        };
        return newItems;
      });
    }
    
    setExpandedSubMenu(expandedSubMenu === `${menuIndex}-${subItemIndex}` ? null : `${menuIndex}-${subItemIndex}`);
  };

  // Reset expanded menus when classId changes
  useEffect(() => {
    setExpanded(null);
    setExpandedSubMenu(null);
  }, [classId]);

  // Cập nhật chủ đề khi classId thay đổi
  useEffect(() => {
    const updateCategories = async () => {
      const updates = menuItems.map(async (item, index) => {
        if (item.resourceType) {
          try {
            const categories = await fetchCategories(item.resourceType);
            return {
              ...item,
              subItems: categories.map(cat => ({
                title: cat.name,
                path: buildPath(item.path, cat.id),
                categoryId: cat.id
              })),
              loading: false,
              error: null
            };
          } catch (error) {
            return {
              ...item,
              error: "Không thể tải chủ đề",
              loading: false
            };
          }
        }
        
        if (item.subItems) {
          const updatedSubItems = await Promise.all(item.subItems.map(async (subItem) => {
            if (subItem.resourceType) {
              try {
                const categories = await fetchCategories(subItem.resourceType);
                return {
                  ...subItem,
                  subItems: categories.map(cat => ({
                    title: cat.name,
                    path: buildPath(subItem.path, cat.id),
                    categoryId: cat.id
                  })),
                  loading: false,
                  error: null
                };
              } catch (error) {
                return {
                  ...subItem,
                  error: "Không thể tải chủ đề",
                  loading: false
                };
              }
            }
            return subItem;
          }));
          
          return {
            ...item,
            subItems: updatedSubItems
          };
        }
        
        return item;
      });

      const updatedMenuItems = await Promise.all(updates);
      setMenuItems(updatedMenuItems);
    };

    updateCategories();
  }, [classId]);

  const isActive = (path) => {
    return path && location.pathname === path.split('?')[0];
  };

  return (
    <div className="sidebar">
      <aside>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearchKeyDown} 
        />
        <ul className="list-group">
          {menuItems.map((item, index) => (
            <li 
              className={`list-group-item ${isActive(item.path) ? 'active-menu' : ''}`} 
              key={index}
            >
              {item.path ? (
                <div 
                  className="menu-item-container"
                  onClick={(e) => toggleMenu(index, e)}
                >
                  <Link 
                    to={buildPath(item.path)}
                    className={`menu-item d-flex justify-content-between align-items-center ${isActive(item.path) ? 'active' : ''}`}
                  >
                    <span>{item.title}</span>
                    {item.loading && <span className="spinner-border spinner-border-sm" />}
                  </Link>
                </div>
              ) : (
                <div 
                  className="menu-item-container"
                  onClick={() => setExpanded(expanded === index ? null : index)}
                >
                  <div className={`menu-item d-flex justify-content-between align-items-center`}>
                    <span>{item.title}</span>
                  </div>
                </div>
              )}
              
              <ul className={`sub-menu ${expanded === index ? 'open' : ''}`}>
                {item.error && <li className="text-danger small p-2">{item.error}</li>}
                
                {item.subItems.map((subItem, subIndex) => (
                  <li 
                    key={subIndex} 
                    className={isActive(subItem.path) ? 'active-submenu' : ''}
                  >
                    {subItem.resourceType ? (
                      <div 
                        className={`sub-menu-item d-flex justify-content-between align-items-center ${isActive(subItem.path) ? 'active' : ''}`}
                        onClick={(e) => toggleSubMenu(index, subIndex, e)}
                      >
                        <span>{subItem.title}</span>
                        {subItem.loading && <span className="spinner-border spinner-border-sm" />}
                      </div>
                    ) : (
                      <Link 
                        to={subItem.path} 
                        className={`sub-menu-item ${isActive(subItem.path) ? 'active' : ''}`}
                      >
                        {subItem.title}
                      </Link>
                    )}
                    
                    {subItem.subItems?.length > 0 && (
                      <ul className={`sub-sub-menu ${
                        expandedSubMenu === `${index}-${subIndex}` ? 'open' : ''
                      }`}>
                        {subItem.error && <li className="text-danger small p-2">{subItem.error}</li>}
                        {subItem.subItems.map((subSubItem, subSubIndex) => (
                          <li 
                            key={subSubIndex} 
                            className={`sub-sub-menu-item ${location.pathname + location.search === subSubItem.path ? 'active' : ''}`}
                            onClick={() => navigate(subSubItem.path)}
                          >
                            {subSubItem.title}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </aside>
      <div className="sidebar-footer">
        <p className="mt-2 mb-0">&copy; Hachieve - Trường ĐHSP Hà Nội</p>
      </div>
    </div>
  );
};

export default Sidebar;