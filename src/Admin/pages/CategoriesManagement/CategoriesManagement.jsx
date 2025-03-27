import React, { useState, useEffect, useContext } from "react";
import Sidebar from "../../../Admin/components/Sidebar/Sidebar";
import Header from "../../../Admin/components/Header/Header";
import { AuthContext } from "../../../Auth/AuthContext";
import "./CategoriesManagement.css";
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
} from "@mui/material";
import axios from "axios";

const API_URL = "http://localhost:5168/api/Categories";
const SEARCH_API_URL = "http://localhost:5168/api/Categories/search?keyword=";

const CategoriesManagement = () => {
  const { user } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'teacher')) {
      window.location.href = "/";
    }
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (error) {
      alert("Lỗi khi lấy danh mục! Vui lòng thử lại.");
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
      alert("Lỗi khi tìm kiếm danh mục!");
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
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Xóa danh mục thành công!");
      fetchCategories();
    } catch (error) {
      alert("Lỗi khi xóa danh mục!");
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (isAdding) {
        await axios.post(API_URL, editingCategory, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Thêm danh mục thành công!");
      } else {
        await axios.put(`${API_URL}/${editingCategory.id}`, editingCategory, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Cập nhật danh mục thành công!");
      }
      fetchCategories();
      setOpenDialog(false);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data);
      } else {
        alert("Lỗi khi lưu danh mục! Kiểm tra lại thông tin nhập vào.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingCategory((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="content--admin">
        <Header />
        <div className="categories-management">
          <h1>Quản lý Danh mục</h1>

          <div className="search-add-container">
          <div className="search-box">
            <TextField
              label="Tìm kiếm danh mục"
              variant="outlined"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button variant="contained" color="primary" onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </div>
          <Button variant="contained" color="primary" onClick={handleAdd}>
            Thêm danh mục
          </Button>
        </div>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên danh mục</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Lớp</TableCell>
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
                  <TableCell>
                    <Button variant="contained" color="secondary" onClick={() => handleEdit(cat)}>
                      Sửa
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(cat.id)}
                      style={{ marginLeft: "10px" }}
                    >
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>{isAdding ? "Thêm danh mục" : "Sửa danh mục"}</DialogTitle>
            <DialogContent>
              {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
              <TextField fullWidth label="Tên danh mục" name="name" value={editingCategory?.name || ""} onChange={handleChange} margin="normal" />
              <TextField fullWidth label="Mô tả" name="description" value={editingCategory?.description || ""} onChange={handleChange} margin="normal" />
              <TextField fullWidth label="Lớp" name="classId" type="number" value={editingCategory?.classId || ""} onChange={handleChange} margin="normal" />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)} color="secondary">Hủy</Button>
              <Button onClick={handleSave} color="primary">Lưu</Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default CategoriesManagement;