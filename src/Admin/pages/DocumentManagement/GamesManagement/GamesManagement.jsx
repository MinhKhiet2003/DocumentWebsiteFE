  import React, { useState, useEffect, useContext } from "react";
  import "./GamesManagement.css";
  import moment from "moment";
  import { AuthContext } from "../../../../Auth/AuthContext";
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
    FormControl,
    InputLabel,
    Box,
  } from "@mui/material";
  import axios from "axios";

  const API_URL = "https://hachieve.runasp.net/api/Game";
  const CATEGORIES_API_URL = "https://hachieve.runasp.net/api/Categories";
  const USED_CLASSES_API_URL = "https://hachieve.runasp.net/api/Categories/used-classes";

  const GamesManagement = () => {
    const { user } = useContext(AuthContext);
    const [games, setGames] = useState([]);
    const [categories, setCategories] = useState([]);
    const [usedClasses, setUsedClasses] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingGame, setEditingGame] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState("");
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [searchParams, setSearchParams] = useState({
      title: "",
      categoryId: "",
      classId: "",
      classify: ""
    });

    const formatDateTime = (dateTimeString) => {
      return moment(dateTimeString).format("DD/MM/YYYY HH:mm:ss");
    };

    useEffect(() => {
      if (!user || (user.role !== 'admin' && user.role !== 'teacher')) {
        window.location.href = '/';
      }
      fetchGames();
      fetchCategories();
      fetchUsedClasses();
    }, []);

    const fetchGames = async (params = {}) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGames(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách game:", error);
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
          name: searchParams.title.trim() || null,
          categoryId: searchParams.categoryId ? parseInt(searchParams.categoryId) : null,
          classId: searchParams.classId ? parseInt(searchParams.classId) : null,
          classify: searchParams.classify || null
        };
    
        const response = await axios.get(`${API_URL}/search`, {
          params,
          headers: { Authorization: `Bearer ${token}` },
        });
        setGames(response.data);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm game:", error);
        toast.error(error.response?.data?.message || "Có lỗi xảy ra khi tìm kiếm");
      }
    };

    const handleClassChange = async (e) => {
      const classId = e.target.value;
      setSelectedClassId(classId);
      
      if (classId) {
        await fetchCategoriesByClass(classId);
        setEditingGame(prev => ({
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
        classId: "",
        classify: ""
      });
      fetchGames();
    };

    const handleAdd = () => {
      setIsAdding(true);
      setSelectedClassId("");
      setFilteredCategories([]);
      setEditingGame({
        title: "",
        description: "",
        gameUrl: "",
        categoryId: "",
        classify: "",
        uploadedBy: user?.userId || 1
      });
      setOpenDialog(true);
    };

    const handleEdit = async (game) => {
      setIsAdding(false);
      if (!hasPermission(game)) {
        toast.warning("Bạn không có quyền sửa game này!");
        return;
      }
      const category = categories.find(cat => cat.id === game.category_id);
      const classId = category?.classId || "";
      if (category) {
        setSelectedClassId(category.classId);
        await fetchCategoriesByClass(category.classId);
      } else {
        setSelectedClassId("");
        setFilteredCategories([]);
      }
      if (classId) {
        setSelectedClassId(classId);
        await fetchCategoriesByClass(classId);
      } else {
        setSelectedClassId("");
        setFilteredCategories([]);
      }
      
      setEditingGame({
        id: game.id,
        title: game.title,
        description: game.description,
        gameUrl: game.gameUrl,
        categoryId: game.category_id,
        classify: game.classify || "",
        uploadedBy: game.uploaded_by 
      });
      
      setOpenDialog(true);
    };

    const handleDelete = async (id) => {
      if (!window.confirm("Bạn có chắc muốn xóa game này?")) return;
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchGames();
      } catch (error) {
        console.error("Lỗi khi xóa game:", error);
        toast.error(error.response?.data?.message || "Có lỗi xảy ra khi xóa game");
      }
    };

    const handleSave = async () => {
      try {
        const token = localStorage.getItem("token");
        const gameData = {
          title: editingGame.title,
          description: editingGame.description,
          gameUrl: editingGame.gameUrl,  
          category_id: parseInt(editingGame.categoryId),
          classify: editingGame.classify
        };
        
        if (!gameData.title || !gameData.gameUrl || !gameData.category_id || !gameData.classify) {
          toast.warning("Vui lòng điền đầy đủ các trường bắt buộc (Tiêu đề, Đường dẫn, Danh mục)");
          return;
        }
        
        if (isAdding) {
          gameData.uploaded_by = user.userId;
          await axios.post(API_URL, gameData, {
            headers: { Authorization: `Bearer ${token}` },
          });
          toast.success("Thêm game thành công!");
        } else {
          gameData.uploaded_by = editingGame.uploadedBy;
          await axios.put(`${API_URL}/${editingGame.id}`, gameData, {
            headers: { Authorization: `Bearer ${token}` },
          });
          toast.success("Cập nhật game thành công!");
        }
    
        fetchGames();
        setOpenDialog(false);
      } catch (error) {
        console.error("Lỗi khi lưu game:", error);
        if (error.response?.data?.message) {
          toast.error(error.response.data.message); 
        } else {
          toast.error("Có lỗi xảy ra khi lưu game");
        }
      }
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setEditingGame((prev) => ({ ...prev, [name]: value }));
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
    const hasPermission = (game) => {
      if (!user) return false;
      return user.role === 'admin' || user.userId === game.uploaded_by;
    };
    return (
      <div className="">
        <h1>Quản lý Games</h1>
        
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
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>Phân loại</InputLabel>
            <Select
              name="classify"
              value={searchParams.classify}
              onChange={handleSearchParamChange}
              label="Phân loại"
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="Online">Online</MenuItem>
              <MenuItem value="Offline">Offline</MenuItem>
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
          Thêm Game
        </Button>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Đường dẫn Game</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Phân loại</TableCell>
              <TableCell>Người tải lên</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Ngày cập nhật</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {games.map((game) => (
              <TableRow key={game.id}>
                <TableCell>{game.id}</TableCell>
                <TableCell>{game.title}</TableCell>
                <TableCell>{game.description}</TableCell>
                <TableCell>
                  <a href={game.gameUrl} target="_blank" rel="noopener noreferrer">
                    Chơi game
                  </a>
                </TableCell>
                <TableCell>{game.category_name}</TableCell>
                <TableCell>{game.classify || "Không xác định"}</TableCell>
                <TableCell>{game.uploadedByUsername}</TableCell>
                <TableCell>{formatDateTime(game.createdAt)}</TableCell>
                <TableCell>{formatDateTime(game.updatedAt)}</TableCell>
                <TableCell className="action-cell" >
                  {hasPermission(game) && (
                    <>
                      <Button 
                        variant="contained" 
                        color="secondary" 
                        onClick={() => handleEdit(game)}
                        className="action-button"
                        style={{ marginRight: "10px" }}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(game.id)}
                        className="action-button"
                      >
                        Xóa
                      </Button>
                    </>
                  )}
                  {!hasPermission(game) && (
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
          <DialogTitle>{isAdding ? "Thêm Game" : "Sửa Game"}</DialogTitle>
          <DialogContent>
            <TextField 
              fullWidth 
              label="Tiêu đề" 
              name="title" 
              value={editingGame?.title || ""} 
              onChange={handleChange} 
              margin="normal" 
              required
            />
            <TextField 
              fullWidth 
              label="Mô tả" 
              name="description" 
              value={editingGame?.description || ""} 
              onChange={handleChange} 
              margin="normal" 
              multiline
              rows={4}
            />
            <TextField 
              fullWidth 
              label="Đường dẫn Game" 
              name="gameUrl" 
              value={editingGame?.gameUrl || ""} 
              onChange={handleChange} 
              margin="normal" 
              required
              helperText="Nhập URL game"
            />
            
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Lớp học</InputLabel>
              <Select
                value={selectedClassId}
                onChange={handleClassChange}
                label="Lớp học"
              >
                <MenuItem value="">Chọn lớp học</MenuItem>
                {usedClasses.map((classItem) => (
                  <MenuItem key={classItem.id} value={classItem.id}>
                    {classItem.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Danh mục</InputLabel>
              <Select
                name="categoryId"
                value={editingGame?.categoryId || ""}
                onChange={handleChange}
                label="Danh mục"
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
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Phân loại</InputLabel>
              <Select
                name="classify"
                value={editingGame?.classify || ""}
                onChange={handleChange}
                label="Phân loại"
              >
                <MenuItem value="">Chọn phân loại</MenuItem>
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
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

  export default GamesManagement;