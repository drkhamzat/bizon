import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Breadcrumbs,
  Link,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import {
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
  AccessTime as AccessTimeIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const ContactsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  
  // Обработчик изменения полей формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Очистка ошибки при вводе
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };
  
  // Валидация формы
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Пожалуйста, укажите ваше имя';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Пожалуйста, укажите ваш email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Пожалуйста, укажите корректный email';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Пожалуйста, введите сообщение';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      
      // Имитация отправки формы
      setTimeout(() => {
        setLoading(false);
        setSnackbar({
          open: true,
          message: 'Ваше сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.',
          severity: 'success',
        });
        
        // Сброс формы
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        });
      }, 1500);
    }
  };
  
  // Обработчик закрытия уведомления
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Хлебные крошки */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Link 
          component={RouterLink} 
          to="/"
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Главная
        </Link>
        <Typography color="text.primary">Контакты</Typography>
      </Breadcrumbs>
      
      <Typography variant="h4" component="h1" gutterBottom>
        Контакты
      </Typography>
      
      <Grid container spacing={4}>
        {/* Контактная информация */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Наши контакты
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <PhoneIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Телефон" 
                  secondary={
                    <>
                      <Link href="tel:+78001234567" color="inherit">
                        8 (800) 123-45-67
                      </Link>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Бесплатная горячая линия
                      </Typography>
                    </>
                  } 
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <EmailIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Email" 
                  secondary={
                    <Link href="mailto:info@bizon-mebel.ru" color="inherit">
                      info@bizon-mebel.ru
                    </Link>
                  } 
                />
              </ListItem>
              
              <Divider sx={{ my: 2 }} />
              
              <ListItem>
                <ListItemIcon>
                  <AccessTimeIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Режим работы" 
                  secondary={
                    <>
                      <Typography variant="body2">
                        Пн-Пт: 10:00 - 20:00
                      </Typography>
                      <Typography variant="body2">
                        Сб-Вс: 10:00 - 18:00
                      </Typography>
                    </>
                  } 
                />
              </ListItem>
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              Наши магазины
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <LocationOnIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Москва" 
                  secondary={
                    <>
                      <Typography variant="body2">
                        ул. Ленинская Слобода, 26, ТЦ "Румер"
                      </Typography>
                      <Typography variant="body2">
                        Телефон: <Link href="tel:+74951234567" color="inherit">+7 (495) 123-45-67</Link>
                      </Typography>
                    </>
                  } 
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <LocationOnIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Санкт-Петербург" 
                  secondary={
                    <>
                      <Typography variant="body2">
                        Московский пр-т, 111, ТЦ "Мебельный Центр"
                      </Typography>
                      <Typography variant="body2">
                        Телефон: <Link href="tel:+78121234567" color="inherit">+7 (812) 123-45-67</Link>
                      </Typography>
                    </>
                  } 
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <LocationOnIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Казань" 
                  secondary={
                    <>
                      <Typography variant="body2">
                        ул. Декабристов, 85, ТЦ "Мебельный Город"
                      </Typography>
                      <Typography variant="body2">
                        Телефон: <Link href="tel:+78431234567" color="inherit">+7 (843) 123-45-67</Link>
                      </Typography>
                    </>
                  } 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        {/* Форма обратной связи */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Напишите нам
            </Typography>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              Если у вас есть вопросы, предложения или вы хотите получить консультацию, 
              заполните форму ниже, и мы свяжемся с вами в ближайшее время.
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="name"
                    label="Ваше имя"
                    fullWidth
                    value={formData.name}
                    onChange={handleInputChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    value={formData.email}
                    onChange={handleInputChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="phone"
                    label="Телефон"
                    fullWidth
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="message"
                    label="Сообщение"
                    multiline
                    rows={4}
                    fullWidth
                    value={formData.message}
                    onChange={handleInputChange}
                    error={!!errors.message}
                    helperText={errors.message}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                    disabled={loading}
                    sx={{ mt: 1 }}
                  >
                    {loading ? 'Отправка...' : 'Отправить сообщение'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
          
          {/* Карта */}
          <Paper sx={{ p: 3, mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Мы на карте
            </Typography>
            
            <Box
              sx={{
                width: '100%',
                height: 300,
                bgcolor: 'grey.200',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mt: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Здесь будет карта с расположением магазинов
              </Typography>
            </Box>
            
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              * Для просмотра интерактивной карты необходимо подключить Google Maps API или Яндекс.Карты API
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Уведомление об успешной отправке */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ContactsPage;