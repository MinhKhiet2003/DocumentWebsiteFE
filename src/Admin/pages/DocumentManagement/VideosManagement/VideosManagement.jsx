import React, { useState, useEffect, useContext } from "react";
import "./VideosManagement.css";
import moment from "moment";
import { AuthContext } from "../../../../Auth/AuthContext";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "https://hachieve.runasp.net/api/Video";
const CATEGORIES_API_URL = "https://hachieve.runasp.net/api/Categories";
const USED_CLASSES_API_URL = "https://hachieve.runasp.net/api/Categories/used-classes";

const VideosManagement = () => {
  const { user } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [usedClasses, setUsedClasses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [searchParams, setSearchParams] = useState({
    title: "",
    categoryId: "",
    classId: ""
  });

  const formatDateTime = (dateTimeString) => {
    return moment(dateTimeString).format("DD/MM/YYYY HH:mm:ss");
  };

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'teacher')) {
      window.location.href = '/';
    }
    fetchVideos();
    fetchCategories();
    fetchUsedClasses();
  }, []);

  const fetchVideos = async (params = {}) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_URL, {
        params: params,
        headers: { Authorization: `Bearer ${token}` },
      });
      setVideos(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách video:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(CATEGORIES_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);
    }
  };

  const fetchCategoriesByClass = async (classId) => {
    try {
      setIsLoadingCategories(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://hachieve.runasp.net/api/Categories/by-class/${classId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFilteredCategories(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh mục theo lớp:", error);
      setFilteredCategories([]);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const fetchUsedClasses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(USED_CLASSES_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsedClasses(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách lớp:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const params = {
        ...(searchParams.title && { name: searchParams.title.trim() }), 
        ...(searchParams.categoryId && { categoryId: parseInt(searchParams.categoryId) }), 
        ...(searchParams.classId && { classId: parseInt(searchParams.classId) }) 
      };
  
      if (Object.keys(params).length === 0) {
        fetchVideos(); // Sửa thành fetchVideos
      } else {
        const response = await axios.get(`${API_URL}/search`, {
          params: params,
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setVideos(response.data); // Sửa thành setVideos
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm video:", error); // Sửa thông báo lỗi
      toast.error("Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại!");
    }
  };

  const handleClassChange = async (e) => {
    const classId = e.target.value;
    setSelectedClassId(classId);
    
    if (classId) {
      await fetchCategoriesByClass(classId);
      setEditingVideo(prev => ({
        ...prev,
        categoryId: ""
      }));
    } else {
      setFilteredCategories([]);
    }
  };

  const handleResetSearch = () => {
    setSearchParams({
      title: "",
      categoryId: "",
      classId: ""
    });
    fetchVideos();
  };

  const handleAdd = () => {
    setIsAdding(true);
    setSelectedClassId("");
    setFilteredCategories([]);
    setEditingVideo({
      title: "",
      description: "",
      video_url: "",
      categoryId: "",
      uploadedBy: user?.userId || 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setOpenDialog(true);
  };

  const handleEdit = async (video) => {
    setIsAdding(false);
    
    const category = categories.find(cat => cat.id === video.category_id);
    const classId = category?.classId || "";
    
    if (classId) {
      setSelectedClassId(classId);
      await fetchCategoriesByClass(classId);
    } else {
      setSelectedClassId("");
      setFilteredCategories([]);
    }
    
    setEditingVideo({
      video_id: video.video_id,
      title: video.title,
      description: video.description,
      video_url: video.video_url,
      categoryId: video.category_id,
      uploadedBy: video.uploaded_by,
      createdAt: video.created_at,
      updatedAt: video.updated_at
    });
    
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa video này?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchVideos();
    } catch (error) {
      console.error("Lỗi khi xóa video:", error);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!user) {
        toast.error("Vui lòng đăng nhập để thực hiện thao tác này");
        return;
      }
  
      const videoData = {
        title: editingVideo.title,
        description: editingVideo.description,
        video_url: editingVideo.video_url,
        category_id: parseInt(editingVideo.categoryId),
      };
  
      if (!videoData.title || !videoData.video_url || !videoData.category_id) {
        toast.warning("Vui lòng điền đầy đủ các trường bắt buộc (Tiêu đề, Đường dẫn, Danh mục)");
        return;
      }
  
      if (isAdding) {
        await axios.post(API_URL, {
          ...videoData,
          uploaded_by: user.userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Thêm video thành công!");
      } else {
        await axios.put(`${API_URL}/${editingVideo.video_id}`, {
          ...videoData,
          uploaded_by: editingVideo.uploadedBy,
          created_at: editingVideo.CreatedAt,    
          updated_at: new Date().toISOString()   
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Cập nhật video thành công!");
      }
  
      fetchVideos();
      setOpenDialog(false);
    } catch (error) {
      console.error("Lỗi khi lưu video:", error);
      
      let errorMessage = "Có lỗi xảy ra khi lưu video";
      if (error.response) {
        if (error.response.data) {
          errorMessage = error.response.data.message || 
                        (error.response.data.errors ? JSON.stringify(error.response.data.errors) : 
                        JSON.stringify(error.response.data));
        }
      }
      toast.error(errorMessage);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingVideo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchParamChange = async (e) => {
    const { name, value } = e.target;
    
    if (name === "classId") {
      setSearchParams(prev => ({ 
        ...prev, 
        [name]: value,
        categoryId: "" 
      }));
      
      if (value) {
        await fetchCategoriesByClass(value);
      } else {
        setFilteredCategories([]);
      }
    } else {
      setSearchParams(prev => ({ ...prev, [name]: value }));
    }
  };

  const hasPermission = (video) => {
    if (!user) return false;
    return user.role === 'admin' || user.userId === video.uploaded_by;
  };

  return (
    <div className="">
      <h1>Quản lý Videos</h1>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 200 }} size="small">
          <TextField
            label="Tìm theo tiêu đề"
            name="title"
            value={searchParams.title}
            onChange={handleSearchParamChange}
            size="small"
            fullWidth
          />
        </FormControl>

        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Lớp học</InputLabel>
          <Select
            name="classId"
            value={searchParams.classId}
            onChange={handleSearchParamChange}
            label="Lớp học"
          >
            <MenuItem value="">Tất cả lớp</MenuItem>
            {usedClasses.map((classItem) => (
              <MenuItem key={classItem.id} value={classItem.id}>{classItem.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Danh mục</InputLabel>
          <Select
            name="categoryId"
            value={searchParams.categoryId}
            onChange={handleSearchParamChange}
            label="Danh mục"
            disabled={!searchParams.classId || isLoadingCategories}
          >
            <MenuItem value="">Tất cả danh mục</MenuItem>
            {isLoadingCategories ? (
              <MenuItem disabled>Đang tải danh mục...</MenuItem>
            ) : searchParams.classId ? (
              filteredCategories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))
            ) : (
              categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
        
        <Button 
          variant="contained" 
          onClick={handleSearch}
          sx={{ height: 40 }}
        >
          Tìm kiếm
        </Button>
        <Button 
          variant="outlined" 
          onClick={handleResetSearch}
          sx={{ height: 40 }}
        >
          Đặt lại
        </Button>
      </Box>

      <Button variant="contained" color="primary" onClick={handleAdd} sx={{ mb: 2 }}>
        Thêm Video
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Tiêu đề</TableCell>
            <TableCell>Mô tả</TableCell>
            <TableCell>Đường dẫn Video</TableCell>
            <TableCell>Danh mục</TableCell>
            <TableCell>Người tải lên</TableCell>
            <TableCell>Ngày tạo</TableCell>
            <TableCell>Ngày cập nhật</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {videos.map((video) => (
            <TableRow key={video.video_id}>
              <TableCell>{video.video_id}</TableCell>
              <TableCell>{video.title}</TableCell>
              <TableCell>{video.description}</TableCell>
              <TableCell>
                <a href={video.video_url} target="_blank" rel="noopener noreferrer">
                  Xem video
                </a>
              </TableCell>
              <TableCell>{video.category_name}</TableCell>
              <TableCell>{video.uploadedByUsername}</TableCell>
              <TableCell>{formatDateTime(video.created_at)}</TableCell>
              <TableCell>{formatDateTime(video.updated_at)}</TableCell>
              <TableCell className="action-cell">
                {hasPermission(video) ? (
                  <>
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      onClick={() => handleEdit(video)}
                      className="action-button"
                      style={{ marginRight: "10px" }}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(video.video_id)}
                      className="action-button"
                    >
                      Xóa
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    disabled
                    className="action-button"
                    sx={{ opacity: 0.7 }}
                  >
                    Không có quyền
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{isAdding ? "Thêm Video" : "Sửa Video"}</DialogTitle>
        <DialogContent>
          <TextField 
            fullWidth 
            label="Tiêu đề" 
            name="title" 
            value={editingVideo?.title || ""} 
            onChange={handleChange} 
            margin="normal" 
          />
          <TextField 
            fullWidth 
            label="Mô tả" 
            name="description" 
            value={editingVideo?.description || ""} 
            onChange={handleChange} 
            margin="normal" 
            multiline
            rows={4}
          />
          <TextField 
            fullWidth 
            label="Đường dẫn Video" 
            name="video_url" 
            value={editingVideo?.video_url || ""} 
            onChange={handleChange} 
            margin="normal" 
            helperText="Nhập URL video (VD: https://youtube.com/...)"
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Lớp học</InputLabel>
            <Select
              value={selectedClassId}
              onChange={handleClassChange}
              label="Lớp học"
              required
            >
              {usedClasses.map((classItem) => (
                <MenuItem key={classItem.id} value={classItem.id}>
                  {classItem.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Danh mục</InputLabel>
            <Select
              name="categoryId"
              value={editingVideo?.categoryId || ""}
              onChange={handleChange}
              label="Danh mục"
              required
              disabled={!selectedClassId || isLoadingCategories}
            >
              {isLoadingCategories ? (
                <MenuItem disabled>Đang tải danh mục...</MenuItem>
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled value="">
                  {selectedClassId ? "Không có danh mục nào" : "Vui lòng chọn lớp trước"}
                </MenuItem>
              )}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">Hủy</Button>
          <Button onClick={handleSave} color="primary">Lưu</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default VideosManagement;