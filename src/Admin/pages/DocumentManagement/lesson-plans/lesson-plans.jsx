import React, { useState, useEffect, useContext } from "react";
import "./lesson-plans.css";
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

const API_URL = "https://hachieve.runasp.net/api/Document";
const CATEGORIES_API_URL = "https://hachieve.runasp.net/api/Categories";
const USED_CLASSES_API_URL = "https://hachieve.runasp.net/api/Categories/used-classes";

const LessonPlansAdmin = () => {
  const { user } = useContext(AuthContext);
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [usedClasses, setUsedClasses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
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
    fetchDocuments();
    fetchCategories();
    fetchUsedClasses();
  }, []);

  const fetchDocuments = async (params = {}) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_URL, {
        params: params,
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tài liệu:", error);
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
        ...(searchParams.title && { name: searchParams.title.trim() }), 
        ...(searchParams.categoryId && { categoryId: searchParams.categoryId }),
        ...(searchParams.classId && { classId: searchParams.classId })
      };

      // Kiểm tra xem có tham số tìm kiếm nào không
      if (Object.keys(params).length === 0) {
        // Nếu không có tham số nào thì gọi API get all
        fetchDocuments();
      } else {
        // Nếu có tham số thì gọi API search
        const response = await axios.get(`${API_URL}/search`, {
          params: params,
          headers: { Authorization: `Bearer ${token}` },
        });
        setDocuments(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm tài liệu:", error);
      toast.error("Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại!");
    }
  };

  const handleClassChange = async (e) => {
    const classId = e.target.value;
    setSelectedClassId(classId);
    
    if (classId) {
      await fetchCategoriesByClass(classId);
      // Reset categoryId khi thay đổi lớp
      setEditingDocument(prev => ({
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
    fetchDocuments();
  };

  const handleAdd = () => {
    setIsAdding(true);
    setSelectedClassId("");
    setFilteredCategories([]);
    setEditingDocument({
      title: "",
      description: "",
      file_path: "",
      categoryId: "",
      uploadedBy: user?.userId || 1,
    });
    setOpenDialog(true);
  };

  const handleEdit = async (document) => {
    setIsAdding(false);
    
    // Lấy thông tin lớp học của chủ đề này (giả sử mỗi category có classId)
    const category = categories.find(cat => cat.id === document.categoryId);
    const classId = category?.classId || "";
    
    // Nếu có classId thì load chủ đề tương ứng
    if (classId) {
      setSelectedClassId(classId);
      await fetchCategoriesByClass(classId);
    } else {
      setSelectedClassId("");
      setFilteredCategories([]);
    }
    
    setEditingDocument({
      id: document.id,
      title: document.title,
      description: document.description,
      file_path: document.file_path,
      categoryId: document.categoryId,
      uploadedBy: document.uploadedBy, 
      createdAt: document.createdAt,
      updatedAt: document.updatedAt
    });
    
    setOpenDialog(true);
  };
  

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa tài liệu này?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDocuments();
    } catch (error) {
      console.error("Lỗi khi xóa tài liệu:", error);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Chuẩn bị dữ liệu cơ bản
      const documentData = {
        title: editingDocument.title,
        description: editingDocument.description,
        file_path: editingDocument.file_path,
        categoryId: parseInt(editingDocument.categoryId),
      };
  
      if (isAdding) {
        await axios.post(API_URL, {
          ...documentData,
          uploadedBy: user.id, 
          CreatedAt: new Date().toISOString(),
          UpdatedAt: new Date().toISOString()
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Thêm tài liệu thành công!");
      } else {
        await axios.put(`${API_URL}/${editingDocument.id}`, {
          ...documentData,
          Id: editingDocument.id,
          uploadedBy: editingDocument.uploadedBy, 
          UpdatedAt: new Date().toISOString()
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Cập nhật tài liệu thành công!");
      }
  
      fetchDocuments();
      setOpenDialog(false);
    } catch (error) {
      console.error("Lỗi khi lưu tài liệu:", error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || error.response.statusText;
        toast.error(`Lỗi: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Không nhận được phản hồi từ server. Vui lòng thử lại!");
      } else {
        toast.error("Có lỗi xảy ra khi gửi yêu cầu!");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingDocument((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchParamChange = async (e) => {
    const { name, value } = e.target;
    
    // Nếu thay đổi lớp học, cần fetch lại chủ đề tương ứng
    if (name === "classId") {
      setSearchParams(prev => ({ 
        ...prev, 
        [name]: value,
        categoryId: "" // Reset chủ đề khi thay đổi lớp
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

  const hasPermission = (document) => {
    if (!user) return false;
    return user.role === 'admin' || user.userId === document.uploadedBy;
  };

  return (
    <div className="">
      <h1>Quản lý Kế hoạch bài dạy</h1>
      
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
            disabled={!searchParams.classId}
          >
            <MenuItem value="">Tất cả chủ đề</MenuItem>
            {searchParams.classId ? (
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
        Thêm tài liệu
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Tiêu đề</TableCell>
            <TableCell>Mô tả</TableCell>
            <TableCell>Đường dẫn file</TableCell>
            <TableCell>Chủ đề</TableCell>
            <TableCell>Người tải lên</TableCell>
            <TableCell>Ngày tạo</TableCell>
            <TableCell>Ngày cập nhật</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>{doc.id}</TableCell>
              <TableCell>{doc.title}</TableCell>
              <TableCell>{doc.description}</TableCell>
              <TableCell>
                <a href={doc.file_path} target="_blank" rel="noopener noreferrer">
                  Xem file
                </a>
              </TableCell>
              <TableCell>{categories.find(cat => cat.id === doc.categoryId)?.name || "Không xác định"}</TableCell>
              <TableCell>{doc.uploadedByUsername}</TableCell>
              <TableCell>{formatDateTime(doc.createdAt)}</TableCell>
              <TableCell>{formatDateTime(doc.updatedAt)}</TableCell>
              <TableCell className="action-cell">
                {hasPermission(doc) ? (
                <>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={() => handleEdit(doc)}
                    className="action-button"
                    style={{ marginRight: "10px" }}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(doc.id)}
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
        <DialogTitle>{isAdding ? "Thêm tài liệu" : "Sửa tài liệu"}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Tiêu đề" name="title" value={editingDocument?.title || ""} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Mô tả" name="description" value={editingDocument?.description || ""} onChange={handleChange} margin="normal" multiline rows={4} />
          <TextField fullWidth label="Đường dẫn file" name="file_path" value={editingDocument?.file_path || ""} onChange={handleChange} margin="normal" />
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
            value={editingDocument?.categoryId || ""}
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

export default LessonPlansAdmin;