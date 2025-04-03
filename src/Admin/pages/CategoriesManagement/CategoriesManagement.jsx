import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../Auth/AuthContext";
import "./CategoriesManagement.css";
import { toast } from "react-toastify";
import moment from "moment";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  FormControl, InputLabel, Select, MenuItem,
} from "@mui/material";
import axios from "axios";

const API_URL = "http://localhost:5168/api/Categories";
const SEARCH_API_URL = "http://localhost:5168/api/Categories/search?keyword=";
const CLASS_API_URL = "http://localhost:5168/api/Class";

const CategoriesManagement = () => {
  const { user } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [classes, setClasses] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");


  const formatDateTime = (dateTimeString) => {
    return moment(dateTimeString).format("DD/MM/YYYY HH:mm:ss");
  };
  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'teacher')) {
      window.location.href = "/";
    }
    fetchCategories();
    fetchClasses();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (error) {
      toast.error("Lỗi khi lấy chủ đề! Vui lòng thử lại.");
    }
  };

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(CLASS_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(response.data);
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách lớp!");
    }
  };

  const handleFilterByClass = async (classId) => {
    try {
      const token = localStorage.getItem("token");
      if (!classId) {
        fetchCategories();
        return;
      }
      const response = await axios.get(`${API_URL}/by-class/${classId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.length === 0) {
        setCategories([]); 
      } else {
      setCategories(response.data);
      }
    } catch (error) {
      setCategories([]); 
    }
  };
  

  const handleSearch = async () => {
    try {
      if (!searchKeyword.trim()) {
        fetchCategories();
        return;
      }
      const token = localStorage.getItem("token");
      const response = await axios.get(`${SEARCH_API_URL}${searchKeyword}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (error) {
      toast.error("Lỗi khi tìm kiếm chủ đề!");
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingCategory({ name: "", description: "", classId: "" });
    setOpenDialog(true);
    setErrorMessage("");
  };

  const handleEdit = (category) => {
    setIsAdding(false);
    setEditingCategory(category);
    setOpenDialog(true);
    setErrorMessage("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa chủ đề này?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Xóa chủ đề thành công!");
      fetchCategories();
    } catch (error) {
      toast.error("Lỗi khi xóa chủ đề!");
    }
  };

  const handleSave = async () => {
    try {
      setErrorMessage("");
  
      if (!editingCategory.name || !editingCategory.classId) {
        setErrorMessage("Tên chủ đề và Lớp không được để trống!");
        return;
      }
  
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
  
      // Chuẩn bị dữ liệu cơ bản
      const categoryData = {
        name: editingCategory.name,
        description: editingCategory.description,
        classId: editingCategory.classId,
        updatedAt: new Date().toISOString()
      };
  
      if (isAdding) {
        await axios.post(API_URL, {
          ...categoryData,
          uploadedBy: user.id, 
          createdAt: new Date().toISOString()
        }, config);
        toast.success("Thêm chủ đề thành công!");
      } else {
        await axios.put(`${API_URL}/${editingCategory.id}`, {
          ...categoryData,
          uploadedBy: editingCategory.uploadedBy 
        }, config);
        toast.success("Cập nhật chủ đề thành công!");
      }
  
      fetchCategories();
      setOpenDialog(false);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || "Lỗi khi lưu chủ đề!");
      } else {
        toast.error("Lỗi khi lưu chủ đề! Kiểm tra lại thông tin nhập vào.");
      }
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingCategory((prev) => ({ ...prev, [name]: value }));
  };

  const hasPermission = (category) => {
    if (!user) return false;
    return user.role === 'admin' || user.id === category.uploadedBy;
  };

  return (
    <div className="">
      <h1>Quản lý chủ đề</h1>

      <div className="search-add-container">
        <div className="search-box" >
          <TextField
            label="Tìm kiếm chủ đề"
            variant="outlined"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button variant="contained" color="primary" onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </div>
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Lọc theo lớp học</InputLabel>
          <Select name="classId" label="Lọc theo lớp học"
            value={selectedClassId}
            onChange={(e) => {
              setSelectedClassId(e.target.value);
              handleFilterByClass(e.target.value);
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                  overflowY: "auto", 
                },
              },
            }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {classes.map((cls) => (
              <MenuItem key={cls.class_id} value={cls.class_id}>{cls.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Thêm chủ đề
        </Button>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Tên chủ đề</TableCell>
            <TableCell>Mô tả</TableCell>
            <TableCell>Lớp</TableCell>
            <TableCell>Người tạo</TableCell>
            <TableCell>Ngày tạo</TableCell>
            <TableCell>ngày cập nhật</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((cat) => (
            <TableRow key={cat.id}>
              <TableCell>{cat.id}</TableCell>
              <TableCell>{cat.name}</TableCell>
              <TableCell>{cat.description}</TableCell>
              <TableCell>{cat.classId}</TableCell>
              <TableCell>{cat.uploadedByUsername}</TableCell>
              <TableCell>{formatDateTime(cat.createdAt)}</TableCell>
              <TableCell>{formatDateTime(cat.updatedAt)}</TableCell>
              <TableCell>
                {hasPermission(cat) && (
                  <>
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      onClick={() => handleEdit(cat)}
                      style={{ marginRight: "10px" }}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(cat.id)}
                    >
                      Xóa
                    </Button>
                  </>
                )}
                {!hasPermission(cat) && (
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
        <DialogTitle>{isAdding ? "Thêm chủ đề" : "Sửa chủ đề"}</DialogTitle>
        <DialogContent>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <TextField fullWidth label="Tên chủ đề" name="name" value={editingCategory?.name || ""} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Mô tả" name="description" value={editingCategory?.description || ""} onChange={handleChange} margin="normal" />
          <FormControl fullWidth margin="normal">
            <InputLabel>Lớp học</InputLabel>
            <Select name="classId" label="Lớp học" value={editingCategory?.classId || ""} onChange={handleChange}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                    overflowY: "auto", 
                  },
                },
              }}>
              {classes.map((cls) => (
                <MenuItem key={cls.class_id} value={cls.class_id}>{cls.name}</MenuItem>
              ))}
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

export default CategoriesManagement;