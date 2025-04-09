import React, { useState, useEffect, useContext } from "react";
import "./ComicManagement.css";
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

const API_URL = "https://hachieve.runasp.net/api/Comic";
const CATEGORIES_API_URL = "https://hachieve.runasp.net/api/Categories";
const USED_CLASSES_API_URL = "https://hachieve.runasp.net/api/Categories/used-classes";

const ComicManagement = () => {
  const { user } = useContext(AuthContext);
  const [comics, setComics] = useState([]);
  const [categories, setCategories] = useState([]);
  const [usedClasses, setUsedClasses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingComic, setEditingComic] = useState(null);
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
    fetchComics();
    fetchCategories();
    fetchUsedClasses();
  }, []);

  const fetchComics = async (params = {}) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_URL, {
        params: params,
        headers: { Authorization: `Bearer ${token}` },
      });
      setComics(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách truyện tranh:", error);
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
      console.error("Lỗi khi lấy chủ đề:", error);
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
      console.error("Lỗi khi lấy chủ đề theo lớp:", error);
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
        ...(searchParams.title && { title: searchParams.title.trim() }), 
        ...(searchParams.categoryId && { categoryId: parseInt(searchParams.categoryId) }), 
        ...(searchParams.classId && { classId: parseInt(searchParams.classId) }) 
      };
  
      if (Object.keys(params).length === 0) {
        fetchComics();
      } else {
        const response = await axios.get(`${API_URL}/search`, {
          params: params,
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setComics(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm truyện tranh:", error);
      toast.error("Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại!");
    }
  };

  const handleClassChange = async (e) => {
    const classId = e.target.value;
    setSelectedClassId(classId);
    
    if (classId) {
      await fetchCategoriesByClass(classId);
      setEditingComic(prev => ({
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
    fetchComics();
  };

  const handleAdd = () => {
    setIsAdding(true);
    setSelectedClassId("");
    setFilteredCategories([]);
    setEditingComic({
      title: "",
      description: "",
      comic_url: "",
      categoryId: "",
      uploadedBy: user?.userId || 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setOpenDialog(true);
  };

  const handleEdit = async (comic) => {
    setIsAdding(false);
    
    const category = categories.find(cat => cat.id === comic.category_id);
    const classId = category?.classId || "";
    
    if (classId) {
      setSelectedClassId(classId);
      await fetchCategoriesByClass(classId);
    } else {
      setSelectedClassId("");
      setFilteredCategories([]);
    }
    
    setEditingComic({
      id: comic.id,
      title: comic.title,
      description: comic.description,
      comic_url: comic.comic_url,
      categoryId: comic.category_id,
      uploadedBy: comic.uploaded_by,
      createdAt: comic.createdAt,
      updatedAt: comic.updatedAt
    });
    
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa truyện tranh này?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComics();
    } catch (error) {
      console.error("Lỗi khi xóa truyện tranh:", error);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!user) {
        toast.error("Vui lòng đăng nhập để thực hiện thao tác này");
        return;
      }
  
      const comicData = {
        title: editingComic.title,
        description: editingComic.description,
        comic_url: editingComic.comic_url,
        category_id: parseInt(editingComic.categoryId),
        updatedAt: new Date().toISOString()
      };
  
      if (!comicData.title || !comicData.comic_url || !comicData.category_id) {
        toast.warning("Vui lòng điền đầy đủ các trường bắt buộc (Tiêu đề, Đường dẫn, Chủ đề)");
        return;
      }
  
      if (isAdding) {
        await axios.post(API_URL, {
          ...comicData,
          uploaded_by: user.userId,
          createdAt: new Date().toISOString()
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Thêm truyện tranh thành công!");
      } else {
        await axios.put(`${API_URL}/${editingComic.id}`, {
          ...comicData,
          uploaded_by: editingComic.uploadedBy,
          createdAt: editingComic.createdAt
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Cập nhật truyện tranh thành công!");
      }
  
      fetchComics();
      setOpenDialog(false);
    } catch (error) {
      console.error("Lỗi khi lưu truyện tranh:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi lưu truyện tranh");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingComic((prev) => ({ ...prev, [name]: value }));
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

  const hasPermission = (comic) => {
    if (!user) return false;
    return user.role === 'admin' || user.userId === comic.uploaded_by;
  };

  return (
    <div className="">
      <h1>Quản lý Truyện tranh</h1>
      
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
          <InputLabel>Chủ đề</InputLabel>
          <Select
            name="categoryId"
            value={searchParams.categoryId}
            onChange={handleSearchParamChange}
            label="Chủ đề"
            disabled={!searchParams.classId || isLoadingCategories}
          >
            <MenuItem value="">Tất cả chủ đề</MenuItem>
            {isLoadingCategories ? (
              <MenuItem disabled>Đang tải chủ đề...</MenuItem>
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
        Thêm Truyện tranh
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Tiêu đề</TableCell>
            <TableCell>Mô tả</TableCell>
            <TableCell>Đường dẫn</TableCell>
            <TableCell>Chủ đề</TableCell>
            <TableCell>Người tải lên</TableCell>
            <TableCell>Ngày tạo</TableCell>
            <TableCell>Ngày cập nhật</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {comics.map((comic) => (
            <TableRow key={comic.id}>
              <TableCell>{comic.id}</TableCell>
              <TableCell>{comic.title}</TableCell>
              <TableCell>{comic.description}</TableCell>
              <TableCell>
                <a href={comic.comic_url} target="_blank" rel="noopener noreferrer">
                  Xem truyện
                </a>
              </TableCell>
              <TableCell>{comic.categoryName}</TableCell>
              <TableCell>{comic.username}</TableCell>
              <TableCell>{formatDateTime(comic.createdAt)}</TableCell>
              <TableCell>{formatDateTime(comic.updatedAt)}</TableCell>
              <TableCell className="action-cell">
                {hasPermission(comic) ? (
                  <>
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      onClick={() => handleEdit(comic)}
                      className="action-button"
                      style={{ marginRight: "10px" }}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(comic.id)}
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
        <DialogTitle>{isAdding ? "Thêm Truyện tranh" : "Sửa Truyện tranh"}</DialogTitle>
        <DialogContent>
          <TextField 
            fullWidth 
            label="Tiêu đề" 
            name="title" 
            value={editingComic?.title || ""} 
            onChange={handleChange} 
            margin="normal" 
            required
          />
          <TextField 
            fullWidth 
            label="Mô tả" 
            name="description" 
            value={editingComic?.description || ""} 
            onChange={handleChange} 
            margin="normal" 
            multiline
            rows={4}
          />
          <TextField 
            fullWidth 
            label="Đường dẫn truyện" 
            name="comic_url" 
            value={editingComic?.comic_url || ""} 
            onChange={handleChange} 
            margin="normal" 
            helperText="Nhập URL truyện tranh"
            required
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
            <InputLabel>Chủ đề</InputLabel>
            <Select
              name="categoryId"
              value={editingComic?.categoryId || ""}
              onChange={handleChange}
              label="Chủ đề"
              required
              disabled={!selectedClassId || isLoadingCategories}
            >
              {isLoadingCategories ? (
                <MenuItem disabled>Đang tải chủ đề...</MenuItem>
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled value="">
                  {selectedClassId ? "Không có chủ đề nào" : "Vui lòng chọn lớp trước"}
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

export default ComicManagement;