import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControlLabel,
  Switch,
  Grid,
  Chip,
  Tooltip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { 
  listCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../../features/categories/categorySlice';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminCategoriesPage = () => {
  const dispatch = useDispatch();
  
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create' или 'edit'
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    featured: false,
  });
  
  const { 
    categories, 
    loading, 
    error, 
    success 
  } = useSelector((state) => state.categories);
  
  // Загрузка списка категорий
  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);
  
  // Сброс формы после успешного создания/обновления
  useEffect(() => {
    if (success) {
      handleCloseDialog();
    }
  }, [success]);
  
  // Обработчики диалога создания/редактирования
  const handleOpenCreateDialog = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: '',
      featured: false,
    });
    setDialogMode('create');
    setOpenDialog(true);
  };
  
  const handleOpenEditDialog = (category) => {
    setFormData({
      _id: category._id,
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image: category.image || '',
      featured: category.featured || false,
    });
    setDialogMode('edit');
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  // Обработчики диалога удаления
  const handleOpenDeleteDialog = (category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedCategory(null);
  };
  
  // Обработчик изменения полей формы
  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    
    // Для переключателей используем checked вместо value
    const newValue = name === 'featured' ? checked : value;
    
    // Если изменяется название, автоматически генерируем slug
    if (name === 'name' && !formData.slug) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^а-яa-z0-9\s]/g, '')
        .replace(/\s+/g, '-');
      
      setFormData({
        ...formData,
        [name]: value,
        slug: generatedSlug,
      });
    } else {
      setFormData({
        ...formData,
        [name]: newValue,
      });
    }
  };
  
  // Обработчики действий
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (dialogMode === 'create') {
      dispatch(createCategory(formData));
    } else {
      dispatch(updateCategory(formData));
    }
  };
  
  const handleDeleteCategory = () => {
    if (selectedCategory) {
      dispatch(deleteCategory(selectedCategory._id));
      handleCloseDeleteDialog();
    }
  };
  
  return (
    <AdminLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Управление категориями
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateDialog}
            disabled={loading}
          >
            Добавить категорию
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Операция выполнена успешно
          </Alert>
        )}
        
        {/* Таблица категорий */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Изображение</TableCell>
                    <TableCell>Название</TableCell>
                    <TableCell>Slug</TableCell>
                    <TableCell>Описание</TableCell>
                    <TableCell align="center">Рекомендуемая</TableCell>
                    <TableCell align="center">Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <TableRow key={category._id}>
                        <TableCell>
                          {category.image ? (
                            <Box
                              component="img"
                              src={category.image}
                              alt={category.name}
                              sx={{
                                width: 50,
                                height: 50,
                                objectFit: 'cover',
                                borderRadius: 1,
                              }}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: 50,
                                height: 50,
                                bgcolor: 'grey.300',
                                borderRadius: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Typography variant="caption" color="text.secondary">
                                Нет фото
                              </Typography>
                            </Box>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {category.name}
                          </Typography>
                        </TableCell>
                        <TableCell>{category.slug}</TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              maxWidth: 250,
                            }}
                          >
                            {category.description || 'Нет описания'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={category.featured ? 'Да' : 'Нет'}
                            color={category.featured ? 'primary' : 'default'}
                            size="small"
                            variant={category.featured ? 'filled' : 'outlined'}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Редактировать">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleOpenEditDialog(category)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Удалить">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleOpenDeleteDialog(category)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        Нет категорий
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
      
      {/* Диалог создания/редактирования категории */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {dialogMode === 'create' ? 'Добавить категорию' : 'Редактировать категорию'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Название"
                  value={formData.name}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="slug"
                  label="Slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  helperText="Уникальный идентификатор для URL (только латинские буквы, цифры и дефисы)"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Описание"
                  value={formData.description}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="image"
                  label="URL изображения"
                  value={formData.image}
                  onChange={handleInputChange}
                  fullWidth
                  helperText="Укажите прямую ссылку на изображение"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      color="primary"
                    />
                  }
                  label="Рекомендуемая категория"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDialog}
              startIcon={<CancelIcon />}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Сохранить'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      
      {/* Диалог подтверждения удаления */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Подтверждение удаления
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Вы действительно хотите удалить категорию "{selectedCategory?.name}"?
            Это действие нельзя будет отменить. Все товары в этой категории останутся, но будут без категории.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Отмена</Button>
          <Button
            onClick={handleDeleteCategory}
            color="error"
            autoFocus
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCategoriesPage;