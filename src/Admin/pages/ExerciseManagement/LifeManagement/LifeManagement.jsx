import React, { useState, useEffect, useContext } from "react";
import "./LifeManagement.css";
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
  Chip,
  Stack,
} from "@mui/material";
import axios from "axios";

const API_URL = "https://hachieve.runasp.net/api/Life";
const CATEGORIES_API_URL = "https://hachieve.runasp.net/api/Categories";
const USED_CLASSES_API_URL = "https://hachieve.runasp.net/api/Categories/used-classes";

const LifeManagement = () => {
  const { user } = useContext(AuthContext);
  const [lives, setLives] = useState([]);
  const [categories, setCategories] = useState([]);
  const [usedClasses, setUsedClasses] = useState([]);
  const [questionSets, setQuestionSets] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingLife, setEditingLife] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [selectedQuestionSet, setSelectedQuestionSet] = useState("");
  const [showQuestionSetFilter, setShowQuestionSetFilter] = useState(false);

  const [searchParams, setSearchParams] = useState({
    question: "",
    categoryId: "",
    classId: "",
    questionSet: ""
  });

  const formatDateTime = (dateTimeString) => {
    return moment(dateTimeString).format("DD/MM/YYYY HH:mm:ss");
  };

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'teacher')) {
      window.location.href = '/';
    }
    fetchLives();
    fetchCategories();
    fetchUsedClasses();
    fetchQuestionSets();
  }, []);

  const fetchLives = async (params = {}) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_URL, {
        params: params,
        headers: { Authorization: `Bearer ${token}` },
      });
      setLives(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách câu hỏi:", error);
    }
  };

  const fetchQuestionSets = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/questionsets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestionSets(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bộ câu hỏi:", error);
    }
  };

  const fetchLivesByQuestionSet = async (questionSet) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/questionset/${questionSet}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLives(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy câu hỏi theo bộ:", error);
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
        ...(searchParams.question && { question: searchParams.question.trim() }), 
        ...(searchParams.categoryId && { categoryId: parseInt(searchParams.categoryId) }), 
        ...(searchParams.classId && { classId: parseInt(searchParams.classId) }),
        ...(searchParams.questionSet && { questionSet: parseInt(searchParams.questionSet) })
      };
  
      if (Object.keys(params).length === 0) {
        fetchLives();
      } else {
        const response = await axios.get(`${API_URL}/search`, {
          params: params,
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setLives(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm câu hỏi:", error);
      toast.error("Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại!");
    }
  };

  const handleClassChange = async (e) => {
    const classId = e.target.value;
    setSelectedClassId(classId);
    
    if (classId) {
      await fetchCategoriesByClass(classId);
      setEditingLife(prev => ({
        ...prev,
        categoryId: ""
      }));
    } else {
      setFilteredCategories([]);
    }
  };

  const handleQuestionSetChange = (e) => {
    const questionSet = e.target.value;
    setSelectedQuestionSet(questionSet);
    if (questionSet) {
      fetchLivesByQuestionSet(questionSet);
    } else {
      fetchLives();
    }
  };

  const handleResetSearch = () => {
    setSearchParams({
      question: "",
      categoryId: "",
      classId: "",
      questionSet: ""
    });
    setSelectedQuestionSet("");
    fetchLives();
  };

  const handleAdd = () => {
    setIsAdding(true);
    setSelectedClassId("");
    setFilteredCategories([]);
    setEditingLife({
      question: "",
      answer: "",
      categoryId: "",
      questionSet: 1, // Default value
      uploadedBy: user?.userId || 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setOpenDialog(true);
  };

  const handleEdit = async (life) => {
    setIsAdding(false);
    
    const category = categories.find(cat => cat.id === life.category_id);
    const classId = category?.classId || "";
    
    if (classId) {
      setSelectedClassId(classId);
      await fetchCategoriesByClass(classId);
    } else {
      setSelectedClassId("");
      setFilteredCategories([]);
    }
    
    setEditingLife({
      id: life.id,
      question: life.question,
      answer: life.answer,
      categoryId: life.category_id,
      questionSet: life.questionSet,
      uploadedBy: life.uploaded_by,
      createdAt: life.createdAt,
      updatedAt: life.updatedAt
    });
    
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa câu hỏi này?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLives();
      toast.success("Xóa câu hỏi thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa câu hỏi:", error);
      toast.error("Có lỗi xảy ra khi xóa câu hỏi!");
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!user) {
        toast.error("Vui lòng đăng nhập để thực hiện thao tác này");
        return;
      }
  
      const lifeData = {
        question: editingLife.question,
        answer: editingLife.answer,
        category_id: parseInt(editingLife.categoryId),
        questionSet: parseInt(editingLife.questionSet),
        updatedAt: new Date().toISOString()
      };
  
      if (!lifeData.question || !lifeData.answer || !lifeData.category_id) {
        toast.warning("Vui lòng điền đầy đủ các trường bắt buộc (Câu hỏi, Câu trả lời, Chủ đề)");
        return;
      }
  
      if (isAdding) {
        await axios.post(API_URL, {
          ...lifeData,
          uploaded_by: user.userId, 
          createdAt: new Date().toISOString()
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Thêm câu hỏi thành công!");
      } else {
        await axios.put(`${API_URL}/${editingLife.id}`, {
          ...lifeData,
          uploaded_by: editingLife.uploadedBy, 
          createdAt: editingLife.createdAt 
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Cập nhật câu hỏi thành công!");
      }
  
      fetchLives();
      fetchQuestionSets();
      setOpenDialog(false);
    } catch (error) {
      console.error("Lỗi khi lưu câu hỏi:", error);
      
      let errorMessage = "Có lỗi xảy ra khi lưu câu hỏi";
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
    setEditingLife((prev) => ({ ...prev, [name]: value }));
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

  const hasPermission = (life) => {
    if (!user) return false;
    return user.role === 'admin' || user.userId === life.uploaded_by;
  };

  return (
    <div className="">
      <h1>Quản lý câu hỏi hóa học đời sống</h1>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 200 }} size="small">
          <TextField
            label="Tìm theo câu hỏi"
            name="question"
            value={searchParams.question}
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

        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Bộ câu hỏi</InputLabel>
          <Select
            name="questionSet"
            value={searchParams.questionSet}
            onChange={handleSearchParamChange}
            label="Bộ câu hỏi"
          >
            <MenuItem value="">Tất cả bộ câu hỏi</MenuItem>
            {questionSets.map((set) => (
              <MenuItem key={set} value={set}>Bộ {set}</MenuItem>
            ))}
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

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Thêm Câu hỏi
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => setShowQuestionSetFilter(!showQuestionSetFilter)}
        >
          {showQuestionSetFilter ? 'Ẩn bộ câu hỏi' : 'Xem theo bộ câu hỏi'}
        </Button>
      </Stack>

      {showQuestionSetFilter && (
        <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {questionSets.map((set) => (
            <Chip
              key={set}
              label={`Bộ ${set}`}
              onClick={() => {
                setSelectedQuestionSet(set);
                fetchLivesByQuestionSet(set);
              }}
              color={selectedQuestionSet === set ? 'primary' : 'default'}
              variant={selectedQuestionSet === set ? 'filled' : 'outlined'}
            />
          ))}
          <Chip
            label="Tất cả"
            onClick={() => {
              setSelectedQuestionSet("");
              fetchLives();
            }}
            color={!selectedQuestionSet ? 'primary' : 'default'}
            variant={!selectedQuestionSet ? 'filled' : 'outlined'}
          />
        </Box>
      )}

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>STT</TableCell>
            <TableCell>Câu hỏi</TableCell>
            <TableCell>Câu trả lời</TableCell>
            <TableCell>Chủ đề</TableCell>
            <TableCell>Bộ câu hỏi</TableCell>
            <TableCell>Người tạo</TableCell>
            <TableCell>Ngày tạo</TableCell>
            <TableCell>Ngày cập nhật</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lives.map((life,index) => (
            <TableRow key={life.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{life.question}</TableCell>
              <TableCell>{life.answer}</TableCell>
              <TableCell>{life.categoryName}</TableCell>
              <TableCell>Bộ {life.questionSet}</TableCell>
              <TableCell>{life.username}</TableCell>
              <TableCell>{formatDateTime(life.createdAt)}</TableCell>
              <TableCell>{formatDateTime(life.updatedAt)}</TableCell>
              <TableCell className="action-cell">
                {hasPermission(life) ? (
                  <>
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      onClick={() => handleEdit(life)}
                      className="action-button"
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(life.id)}
                      className="action-button"
                      sx={{ ml: 1 }}
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
        <DialogTitle>{isAdding ? "Thêm Câu hỏi" : "Sửa Câu hỏi"}</DialogTitle>
        <DialogContent>
          <TextField 
            fullWidth 
            label="Câu hỏi" 
            name="question" 
            value={editingLife?.question || ""} 
            onChange={handleChange} 
            margin="normal" 
            required
          />
          <TextField 
            fullWidth 
            label="Câu trả lời" 
            name="answer" 
            value={editingLife?.answer || ""} 
            onChange={handleChange} 
            margin="normal" 
            multiline
            rows={4}
            required
          />
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth margin="normal" sx={{ flex: 1 }}>
              <InputLabel>Bộ câu hỏi</InputLabel>
              <Select
                name="questionSet"
                value={editingLife?.questionSet || 1}
                onChange={handleChange}
                label="Bộ câu hỏi"
                required
              >
                {[1, 2, 3, 4, 5].map((set) => (
                  <MenuItem key={set} value={set}>Bộ {set}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal" sx={{ flex: 1 }}>
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
          </Box>
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Chủ đề</InputLabel>
            <Select
              name="categoryId"
              value={editingLife?.categoryId || ""}
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

export default LifeManagement;