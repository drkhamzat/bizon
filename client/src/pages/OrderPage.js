import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { getOrderDetails } from '../features/orders/orderSlice';

const OrderPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const { order, loading, error } = useSelector((state) => state.orders);
  const { userInfo } = useSelector((state) => state.auth);
  
  // Загрузка данных заказа
  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);
  
  // Получение цвета для статуса заказа
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };
  
  // Получение текста для статуса заказа
  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Ожидает';
      case 'processing':
        return 'Обработка';
      case 'shipped':
        return 'Отправлен';
      case 'delivered':
        return 'Доставлен';
      case 'cancelled':
        return 'Отменён';
      default:
        return 'Неизвестно';
    }
  };
  
  // Форматирование даты
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }
  
  if (!order) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">Заказ не найден</Alert>
      </Container>
    );
  }
  
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
        {userInfo && (
          <Link 
            component={RouterLink} 
            to="/profile"
            underline="hover"
          >
            Личный кабинет
          </Link>
        )}
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <ShoppingCartIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Заказ #{order._id.slice(-6)}
        </Typography>
      </Breadcrumbs>
      
      <Grid container spacing={4}>
        {/* Основная информация о заказе */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h1">
                Заказ #{order._id.slice(-6)}
              </Typography>
              <Chip
                label={getStatusText(order.status)}
                color={getStatusColor(order.status)}
              />
            </Box>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {formatDate(order.createdAt)}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            {/* Товары в заказе */}
            <Typography variant="h6" gutterBottom>
              Товары
            </Typography>
            
            <List disablePadding>
              {order.orderItems.map((item) => (
                <ListItem key={item._id} sx={{ py: 2, px: 0 }}>
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.name}
                    sx={{
                      width: 60,
                      height: 60,
                      objectFit: 'contain',
                      mr: 2,
                      borderRadius: 1,
                    }}
                  />
                  <ListItemText
                    primary={
                      <Link
                        component={RouterLink}
                        to={`/product/${item.product}`}
                        underline="hover"
                        color="inherit"
                      >
                        {item.name}
                      </Link>
                    }
                    secondary={`${item.quantity} × ${item.price.toLocaleString()} ₽`}
                  />
                  <Typography variant="body1" fontWeight="bold">
                    {(item.price * item.quantity).toLocaleString()} ₽
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
          
          {/* Адрес доставки */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Адрес доставки
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body1">
                  {order.shippingAddress.fullName}
                </Typography>
                <Typography variant="body2">
                  {order.shippingAddress.address}
                </Typography>
                <Typography variant="body2">
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                </Typography>
                {order.shippingAddress.phone && (
                  <Typography variant="body2">
                    Телефон: {order.shippingAddress.phone}
                  </Typography>
                )}
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 2 }} />
            
            {/* Способ доставки */}
            <Typography variant="h6" gutterBottom>
              Способ доставки
            </Typography>
            
            <Typography variant="body1">
              {order.deliveryMethod === 'courier' ? 'Курьерская доставка' : 'Самовывоз из магазина'}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            {/* Способ оплаты */}
            <Typography variant="h6" gutterBottom>
              Способ оплаты
            </Typography>
            
            <Typography variant="body1">
              {order.paymentMethod === 'card' ? 'Банковская карта' : 'Наличные при получении'}
            </Typography>
          </Paper>
        </Grid>
        
        {/* Сводка заказа */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Сводка заказа
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Товары ({order.orderItems.reduce((acc, item) => acc + item.quantity, 0)} шт.):</Typography>
              <Typography>{order.itemsPrice.toLocaleString()} ₽</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Доставка:</Typography>
              <Typography>{order.shippingPrice > 0 ? `${order.shippingPrice.toLocaleString()} ₽` : 'Бесплатно'}</Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Итого:</Typography>
              <Typography variant="h6" fontWeight="bold">
                {order.totalPrice.toLocaleString()} ₽
              </Typography>
            </Box>
            
            {/* Кнопки действий */}
            <Box sx={{ mt: 3 }}>
              <Button
                component={RouterLink}
                to={userInfo ? '/profile' : '/'}
                variant="outlined"
                fullWidth
              >
                {userInfo ? 'Вернуться в личный кабинет' : 'На главную'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderPage;