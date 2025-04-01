import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import axios from 'axios';
import { AuthContext } from '../../Auth/AuthContext';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
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
    baseURL: 'http://localhost:5168'
  });

  authAxios.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  const toggleMenu = async (index) => {
    const item = menuItems[index];
    
    if (item.resourceType && item.subItems.length === 0 && !item.loading) {
      try {
        const updatedItems = [...menuItems];
        updatedItems[index] = {
          ...updatedItems[index],
          loading: true,
          error: null
        };
        setMenuItems(updatedItems);
  
        const response = await authAxios.get(
          `/api/Categories/used-by-type?resourceType=${item.resourceType}`
        );
  
        const subItems = response.data.map(category => ({
          title: category.name,
          path: `${item.path}?categoryId=${category.id}`,
          categoryId: category.id 
        }));
  
        const newItems = [...menuItems];
        newItems[index] = {
          ...newItems[index],
          subItems,
          loading: false
        };
        setMenuItems(newItems);
      } catch (error) {
        console.error("Error fetching categories:", error);
        
        if (error.response && error.response.status === 401) {
          logout();
          navigate('/login');
          return;
        }
  
        const newItems = [...menuItems];
        newItems[index] = {
          ...newItems[index],
          error: "Không thể tải danh mục",
          loading: false
        };
        setMenuItems(newItems);
      }
    }
  
    setExpanded(expanded === index ? null : index);
  };

  const toggleSubMenu = async (menuIndex, subItemIndex) => {
    const subItem = menuItems[menuIndex].subItems[subItemIndex];
    
    if (subItem.resourceType && subItem.subItems.length === 0 && !subItem.loading) {
      try {
        const updatedItems = [...menuItems];
        updatedItems[menuIndex].subItems[subItemIndex] = {
          ...updatedItems[menuIndex].subItems[subItemIndex],
          loading: true,
          error: null
        };
        setMenuItems(updatedItems);
  
        const response = await authAxios.get(
          `/api/Categories/used-by-type?resourceType=${subItem.resourceType}`
        );
  
        const subSubItems = response.data.map(category => ({
          title: category.name,
          path: `${subItem.path}?categoryId=${category.id}`,
          categoryId: category.id 
        }));
  
        const newItems = [...menuItems];
        newItems[menuIndex].subItems[subItemIndex] = {
          ...newItems[menuIndex].subItems[subItemIndex],
          subItems: subSubItems,
          loading: false
        };
        setMenuItems(newItems);
      } catch (error) {
        console.error("Error fetching categories:", error);
        
        if (error.response && error.response.status === 401) {
          logout();
          navigate('/login');
          return;
        }
  
        const newItems = [...menuItems];
        newItems[menuIndex].subItems[subItemIndex] = {
          ...newItems[menuIndex].subItems[subItemIndex],
          error: "Không thể tải danh mục",
          loading: false
        };
        setMenuItems(newItems);
      }
    }
  
    setExpandedSubMenu(expandedSubMenu === `${menuIndex}-${subItemIndex}` ? null : `${menuIndex}-${subItemIndex}`);
  };

  return (
    <div className="sidebar">
      <aside>
        <input type="text" className="form-control mb-3" placeholder="Search" />
        <ul className="list-group">
          {menuItems.map((item, index) => (
            <li className="list-group-item" key={index}>
              {item.resourceType ? (
                <div className="menu-item-container" onClick={() => toggleMenu(index)}>
                  <Link 
                    to={item.path} 
                    className="menu-item d-flex justify-content-between align-items-center"
                  >
                    {item.title}
                    {item.loading && <span className="spinner-border spinner-border-sm" role="status" />}
                  </Link>
                </div>
              ) : (
                <div 
                  className="menu-item d-flex justify-content-between align-items-center"
                  onClick={() => setExpanded(expanded === index ? null : index)}
                >
                  {item.title}
                </div>
              )}
              
              <ul className={`sub-menu ${expanded === index ? 'open' : ''}`}>
                {item.error && <li className="text-danger small p-2">{item.error}</li>}
                
                {item.subItems.map((subItem, subIndex) => (
                  <li key={subIndex}>
                    {subItem.resourceType ? (
                      <div 
                        className="sub-menu-item d-flex justify-content-between align-items-center"
                        onClick={() => toggleSubMenu(index, subIndex)}
                      >
                        {subItem.title}
                        {subItem.loading && <span className="spinner-border spinner-border-sm" role="status" />}
                      </div>
                    ) : (
                      <Link 
                        to={subItem.path} 
                        className="sub-menu-item"
                      >
                        {subItem.title}
                      </Link>
                    )}
                    
                    {subItem.subItems && subItem.subItems.length > 0 && (
                      <ul className={`sub-sub-menu ${expandedSubMenu === `${index}-${subIndex}` ? 'open' : ''}`}>
                        {subItem.error && <li className="text-danger small p-2">{subItem.error}</li>}
                        {subItem.subItems.map((subSubItem, subSubIndex) => (
                          <li 
                            key={subSubIndex} 
                            className="sub-sub-menu-item"
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
        <p className="mt-2">&copy; SciPlay - Trường ĐHSP Hà Nội</p>
      </div>
    </div>
  );
};

export default Sidebar;