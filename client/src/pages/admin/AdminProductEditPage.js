import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Breadcrumbs,
  Link,
  Chip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const isNewProduct = id === 'new';
  
  // Состояние формы
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount: 0,
    category: '',
    inStock: true,
    featured: false,
    images: [''],
    specifications: [{ name: '', value: '' }],
  });
  
  const [errors, setErrors] = useState({});
  
  // Временные данные для демонстрации
  const categories = [
    { _id: '1', name: 'Диваны' },
    { _id: '2', name: 'Кресла' },
    { _id: '3', name: 'Столы' },
    { _id: '4', name: 'Стулья' },
    { _id: '5', name: 'Шкафы' },
  ];
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Загрузка данных товара при редактировании
  useEffect(() => {
    if (!isNewProduct) {
      setLoading(true);
      
      // Имитация загрузки данных товара
      setTimeout(() => {
        setFormData({
          name: 'Диван "Комфорт"',
          description: 'Удобный диван с мягкими подушками и прочным каркасом. Идеально подходит для гостиной.',
          price: '45000',
          discount: 10,
          category: '1',
          inStock: true,
          featured: true,
          images: [
            'https://example.com/images/sofa1.jpg',
            'https://example.com/images/sofa2.jpg',
          ],
          specifications: [
            { name: 'Материал', value: 'Экокожа' },
            { name: 'Размеры', value: '220x90x80 см' },
            { name: 'Цвет', value: 'Бежевый' },
          ],
        });
        setLoading(false);
      }, 1000);
    }
  }, [id, isNewProduct]);
  
  // Обработчик изменения полей формы
  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    
    // Для переключателей используем checked вместо value
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData({
      ...formData,
      [name]: newValue,
    });
    
    // Очистка ошибки при вводе
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };
  
  // Обработчики для изображений
  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({
      ...formData,
      images: newImages,
    });
  };
  
  const handleAddImage = () => {
    setFormData({
      ...formData,
      images: [...formData.images, ''],
    });
  };
  
  const handleRemoveImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({
      ...formData,
      images: newImages.length ? newImages : [''],
    });
  };
  
  // Обработчики для характеристик
  const handleSpecificationChange = (index, field, value) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index] = {
      ...newSpecs[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      specifications: newSpecs,
    });
  };
  
  const handleAddSpecification = () => {
    setFormData({
      ...formData,
      specifications: [...formData.specifications, { name: '', value: '' }],
    });
  };
  
  const handleRemoveSpecification = (index) => {
    const newSpecs = [...formData.specifications];
    newSpecs.splice(index, 1);
    setFormData({
      ...formData,
      specifications: newSpecs.length ? newSpecs : [{ name: '', value: '' }],
    });
  };
  
  // Валидация формы
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Название товара обязательно';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Описание товара обязательно';
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'Цена товара обязательна';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Цена должна быть положительным числом';
    }
    
    if (isNaN(formData.discount) || parseFloat(formData.discount) < 0 || parseFloat(formData.discount) > 100) {
      newErrors.discount = 'Скидка должна быть числом от 0 до 100';
    }
    
    if (!formData.category) {
      newErrors.category = 'Категория товара обязательна';
    }
    
    // Проверка, что хотя бы одно изображение указано
    if (!formData.images[0]) {
      newErrors.images = 'Необходимо указать хотя бы одно изображение';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      
      // Имитация сохранения товара
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        
        // Перенаправление на список товаров после успешного сохранения
        setTimeout(() => {
          navigate('/admin/products');
        }, 1500);
      }, 1500);
    }
  };
  
  return (
    <AdminLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Хлебные крошки */}
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />} 
          aria-label="breadcrumb"
          sx={{ mb: 3 }}
        >
          <Link 
            component={RouterLink} 
            to="/admin"
            underline="hover"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Админ-панель
          </Link>
          <Link 
            component={RouterLink} 
            to="/admin/products"
            underline="hover"
          >
            Товары
          </Link>
          <Typography color="text.primary">
            {isNewProduct ? 'Новый товар' : 'Редактирование товара'}
          </Typography>
        </Breadcrumbs>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            {isNewProduct ? 'Добавить товар' : 'Редактировать товар'}
          </Typography>
          <Button
            component={RouterLink}
            to="/admin/products"
            startIcon={<ArrowBackIcon />}
            sx={{ ml: 2 }}
          >
            Назад к списку
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Товар успешно {isNewProduct ? 'добавлен' : 'обновлен'}
          </Alert>
        )}
        
        {loading && !formData.name ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper sx={{ p: 3 }}>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Основная информация */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Основная информация
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={8}>
                  <TextField
                    name="name"
                    label="Название товара"
                    value={formData.name}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    error={!!errors.name}
                    helperText={errors.name}
                  />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth required error={!!errors.category}>
                    <InputLabel id="category-label">Категория</InputLabel>
                    <Select
                      labelId="category-label"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      label="Категория"
                    >
                      {categories.map((category) => (
                        <MenuItem key={category._id} value={category._id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.category && (
                      <Typography variant="caption" color="error">
                        {errors.category}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    name="description"
                    label="Описание товара"
                    value={formData.description}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    multiline
                    rows={4}
                    error={!!errors.description}
                    helperText={errors.description}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="price"
                    label="Цена (₽)"
                    value={formData.price}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    type="number"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">₽</InputAdornment>,
                    }}
                    error={!!errors.price}
                    helperText={errors.price}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="discount"
                    label="Скидка (%)"
                    value={formData.discount}
                    onChange={handleInputChange}
                    fullWidth
                    type="number"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    error={!!errors.discount}
                    helperText={errors.discount}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        name="inStock"
                        checked={formData.inStock}
                        onChange={handleInputChange}
                        color="primary"
                      />
                    }
                    label="В наличии"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                        color="primary"
                      />
                    }
                    label="Рекомендуемый товар"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                
                {/* Изображения */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                      Изображения
                    </Typography>
                    <Button
                      startIcon={<AddIcon />}
                      onClick={handleAddImage}
                      size="small"
                    >
                      Добавить изображение
                    </Button>
                  </Box>
                  {errors.images && (
                    <Typography variant="caption" color="error" sx={{ display: 'block', mb: 2 }}>
                      {errors.images}
                    </Typography>
                  )}
                </Grid>
                
                {formData.images.map((image, index) => (
                  <Grid item xs={12} key={`image-${index}`}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        label={`URL изображения ${index + 1}`}
                        value={image}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        fullWidth
                        required={index === 0}
                      />
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveImage(index)}
                        disabled={formData.images.length === 1 && index === 0}
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
                
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                
                {/* Характеристики */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                      Характеристики
                    </Typography>
                    <Button
                      startIcon={<AddIcon />}
                      onClick={handleAddSpecification}
                      size="small"
                    >
                      Добавить характеристику
                    </Button>
                  </Box>
                </Grid>
                
                {formData.specifications.map((spec, index) => (
                  <Grid item xs={12} key={`spec-${index}`}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={5}>
                        <TextField
                          label="Название характеристики"
                          value={spec.name}
                          onChange={(e) => handleSpecificationChange(index, 'name', e.target.value)}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={5}>
                        <TextField
                          label="Значение"
                          value={spec.value}
                          onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveSpecification(index)}
                          disabled={formData.specifications.length === 1 && index === 0}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
                
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                
                {/* Кнопки действий */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                      disabled={loading}
                      sx={{ mt: 1 }}
                    >
                      {loading ? 'Сохранение...' : 'Сохранить товар'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        )}
      </Container>
    </AdminLayout>
  );
};

export default AdminProductEditPage;