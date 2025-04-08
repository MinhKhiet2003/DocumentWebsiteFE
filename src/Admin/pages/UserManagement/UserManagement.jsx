import React, { useState, useEffect, useContext } from "react";
import moment from "moment";
import { AuthContext } from "../../../Auth/AuthContext"; 
import "./UserManagement.css";
import { toast } from "react-toastify";
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
} from "@mui/material";
import axios from "axios";

const formatDateTime = (dateTimeString) => {
  return moment(dateTimeString).format("DD/MM/YYYY HH:mm:ss");
};
const UserManagement = () => {
  const { user } = useContext(AuthContext); 
  const [users, setUsers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      window.location.href = '/';
    }
  }, [user]);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get("https://hachieve.runasp.net//api/User", {
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = () => {
    setIsAdding(true);
    setEditingUser({
      username: "",
      password_hash: "",
      email: "",
      role: "user",
      profilePicturePath: "",
    });
    setOpenDialog(true);
  };

  const handleEdit = (user) => {
    setIsAdding(false);
    setEditingUser(user);
    setOpenDialog(true);
  };

  const handleDelete = async (user_id) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://hachieve.runasp.net//api/User/${user_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      toast.success("Xóa người dùng thành công!");
      fetchUsers(); 
    } catch (error) {
      toast.error("Lỗi khi xóa người dùng!");
      console.error("Error deleting user:", error);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (isAdding) {
        await axios.post("https://hachieve.runasp.net//api/User", editingUser, {
          headers: {
            'Authorization': `Bearer ${token}`, 
          },
        });
        toast.success("Thêm người dùng thành công!");
      } else {
        await axios.put(`https://hachieve.runasp.net//api/User/${editingUser.user_id}`, editingUser, {
          headers: {
            'Authorization': `Bearer ${token}`, 
          },
        });
        toast.success("Cập nhật người dùng thành công!");
      }
      fetchUsers(); 
      setOpenDialog(false);
    } catch (error) {if (error.response && error.response.status === 400) {
      if (error.response.data && error.response.data.error === "Username đã tồn tại") {
        toast.error("Tên người dùng đã tồn tại, vui lòng chọn tên khác!");
      } else {
        toast.error(error.response.data || "Đã xảy ra lỗi khi lưu thông tin người dùng.");
      }
    } else {
      toast.error("Đã xảy ra lỗi khi lưu thông tin người dùng.");
    }
    }
  };
  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!searchKeyword.trim()) {
        setFilteredUsers(users);
        return;
      }
      const response = await axios.get(
        `https://hachieve.runasp.net//api/User/search?keyword=${searchKeyword}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error searching users:", error);
      setFilteredUsers(users);
    }
  };

  const handleChangeSearch = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);
    if (!value.trim()) {
      setFilteredUsers(users);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });
  };

  if (!user || user.role !== 'admin') {
    return null; 
  }

  return (
    <div className="">
      <h1>Quản lý người dùng</h1>
      <div className="search-add-container">
      <div className="search-box">
        <TextField
          label="Tìm kiếm người dùng" 
          variant="outlined"
          value={searchKeyword}
          onChange={handleChangeSearch}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Tìm kiếm
        </Button>
      </div>
      <Button variant="contained" color="primary" onClick={handleAdd}>
        Thêm người dùng 
      </Button>
    </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Tên đăng nhập</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Vai trò</TableCell>
            <TableCell>Avatar</TableCell>
            <TableCell>Ngày tạo</TableCell>
            <TableCell>Ngày cập nhật</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {filteredUsers.map((user) => (
            <TableRow key={user.user_id}>
              <TableCell>{user.user_id}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <img
                  src={user.profilePicturePath}
                  alt="Profile"
                  style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                />
              </TableCell>
              <TableCell>{formatDateTime(user.createdAt)}</TableCell>
              <TableCell>{formatDateTime(user.updatedAt)}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleEdit(user)}
                  style={{ marginRight: "10px" }}
                >
                  Sửa
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDelete(user.user_id)}
                >
                  Xóa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {isAdding ? "Thêm người dùng" : "Sửa thông tin người dùng"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Tên đăng nhập"
            name="username"
            value={editingUser?.username || ""}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Mật khẩu (hash)"
            name="password_hash"
            type="password"
            value={editingUser?.password_hash || ""}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={editingUser?.email || ""}
            onChange={handleChange}
            margin="normal"
          />
          <Select
            fullWidth
            label="Vai trò"
            name="role"
            value={editingUser?.role || "user"}
            onChange={handleChange}
            margin="dense"
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="teacher">Teacher</MenuItem>
          </Select>
          <TextField
            fullWidth
            label="Đường dẫn ảnh đại diện"
            name="profilePicturePath"
            value={editingUser?.profilePicturePath || ""}
            onChange={handleChange}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSave} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserManagement;