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
    if (!user || user.role !== "admin") {
      window.location.href = "/";
    }
  }, [user]);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://hachieve.runasp.net/api/User", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Lỗi khi lấy danh sách người dùng!");
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
    setEditingUser({
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      role: user.role,
      profilePicturePath: user.profilePicturePath || "",
      password_hash: "", // Khởi tạo rỗng, nếu để trống sẽ giữ nguyên mật khẩu cũ
      original_password_hash: user.password_hash, // Lưu mật khẩu cũ để sử dụng nếu không thay đổi
    });
    setOpenDialog(true);
  };

  const handleDelete = async (user_id) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://hachieve.runasp.net/api/User/${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Xóa người dùng thành công!");
      fetchUsers();
    } catch (error) {
      toast.error("Lỗi khi xóa người dùng!");
      console.error("Error deleting user:", error);
    }
  };

  const handleRestore = async (user_id) => {
    if (!window.confirm("Bạn có chắc chắn muốn khởi động lại tài khoản?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(`https://hachieve.runasp.net/api/User/restore/${user_id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Khôi phục tài khoản thành công!");
      fetchUsers();
    } catch (error) {
      toast.error("Lỗi khi khôi phục tài khoản!");
      console.error("Error restoring user:", error);
    }
  };

  const validateUserData = (userData) => {
    if (!userData.username || userData.username.length < 3) {
      toast.error("Tên đăng nhập phải có ít nhất 3 ký tự!");
      return false;
    }
    if (!userData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      toast.error("Email không hợp lệ!");
      return false;
    }
    if (isAdding && (!userData.password_hash || userData.password_hash.length < 6)) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự khi thêm mới!");
      return false;
    }
    if (!userData.role) {
      toast.error("Vui lòng chọn vai trò!");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!editingUser) return;

    // Chuẩn bị dữ liệu gửi đi
    const userData = {
      user_id: editingUser.user_id,
      username: editingUser.username,
      email: editingUser.email,
      role: editingUser.role,
      profilePicturePath: editingUser.profilePicturePath || null,
      password_hash: editingUser.password_hash || editingUser.original_password_hash, // Gửi mật khẩu cũ nếu để trống
    };

    // Kiểm tra dữ liệu trước khi gửi
    if (!validateUserData(userData)) return;

    try {
      const token = localStorage.getItem("token");
      if (isAdding) {
        // Loại bỏ user_id và original_password_hash khi thêm mới
        const { user_id, original_password_hash, ...postData } = userData;
        await axios.post("https://hachieve.runasp.net/api/User", postData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Thêm người dùng thành công!");
      } else {
        // Loại bỏ original_password_hash khi cập nhật
        const { original_password_hash, ...putData } = userData;
        await axios.put(`https://hachieve.runasp.net/api/User/${editingUser.user_id}`, putData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Cập nhật người dùng thành công!");
      }
      fetchUsers();
      setOpenDialog(false);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data?.error || error.response.data;
        if (errorMessage === "Username đã tồn tại") {
          toast.error("Tên người dùng đã tồn tại, vui lòng chọn tên khác!");
        } else if (errorMessage === "Email đã tồn tại") {
          toast.error("Email đã tồn tại, vui lòng chọn email khác!");
        } else if (errorMessage.includes("Mật khẩu phải có ít nhất 6 ký tự")) {
          toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
        } else {
          toast.error(errorMessage || "Dữ liệu không hợp lệ, vui lòng kiểm tra lại!");
        }
      } else {
        toast.error("Đã xảy ra lỗi khi lưu thông tin người dùng!");
      }
      console.error("Error saving user:", error);
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
        `https://hachieve.runasp.net/api/User/search?keyword=${searchKeyword}`,
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
      toast.error("Lỗi khi tìm kiếm người dùng!");
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
    setEditingUser(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });
  };

  if (!user || user.role !== "admin") {
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
            <TableCell>Trạng thái</TableCell>
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
                {user.profilePicturePath ? (
                  <img
                    src={user.profilePicturePath}
                    alt="Profile"
                    style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                  />
                ) : (
                  "Không có ảnh"
                )}
              </TableCell>
              <TableCell>{formatDateTime(user.createdAt)}</TableCell>
              <TableCell>{formatDateTime(user.updatedAt)}</TableCell>
              <TableCell>{user.isDeleted ? "Ngừng hoạt động" : "Hoạt động"}</TableCell>
              <TableCell>
                {!user.isDeleted ? (
                  <>
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
                  </>
                ) : (
                  <Button
                    variant="contained"
                    color="muted"
                    onClick={() => handleRestore(user.user_id)}
                  >
                    Tạm dừng
                  </Button>
                )}
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
            required
          />
          <TextField
            fullWidth
            label="Mật khẩu"
            name="password_hash"
            type="password"
            value={editingUser?.password_hash || ""}
            onChange={handleChange}
            margin="normal"
            required={isAdding}
            helperText={!isAdding ? "Để trống nếu không muốn thay đổi mật khẩu" : ""}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={editingUser?.email || ""}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Select
            fullWidth
            label="Vai trò"
            name="role"
            value={editingUser?.role || "user"}
            onChange={handleChange}
            margin="dense"
            required
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