import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Divider,
  Alert,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { 
  removeFromCart, 
  updateCartItemQuantity, 
  clearCart 
} from '../features/cart/cartSlice';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  
  // Рассчет цены с учетом скидки
  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * discount / 100);
  };
  
  // Рассчет общей суммы корзины
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const itemPrice = item.discount > 0 
        ? calculateDiscountedPrice(item.price, item.discount) 
        : item.price;
      return sum + itemPrice * item.quantity;
    }, 0);
  };
  
  // Обработчики изменения количества
  const handleIncreaseQuantity = (productId) => {
    const item = cartItems.find((item) => item.productId === productId);
    if (item) {
      dispatch(updateCartItemQuantity({ 
        productId, 
        quantity: item.quantity + 1 
      }));
    }
  };
  
  const handleDecreaseQuantity = (productId) => {
    const item = cartItems.find((item) => item.productId === productId);
    if (item && item.quantity > 1) {
      dispatch(updateCartItemQuantity({ 
        productId, 
        quantity: item.quantity - 1 
      }));
    }
  };
  
  const handleQuantityChange = (e, productId) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity > 0) {
      dispatch(updateCartItemQuantity({ 
        productId, 
        quantity: newQuantity 
      }));
    }
  };
  
  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };
  
  const handleClearCart = () => {
    dispatch(clearCart());
  };
  
  const handleCheckout = () => {
    if (userInfo) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=checkout');
    }
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
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <ShoppingCartIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Корзина
        </Typography>
      </Breadcrumbs>
      
      <Typography variant="h4" component="h1" gutterBottom>
        Корзина
      </Typography>
      
      {cartItems.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Ваша корзина пуста
          </Alert>
          <Button 
            component={RouterLink} 
            to="/catalog"
            variant="contained"
          >
            Перейти к покупкам
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={4}>
          {/* Таблица товаров */}
          <Grid item xs={12} lg={8}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Товар</TableCell>
                    <TableCell align="right">Цена</TableCell>
                    <TableCell align="center">Количество</TableCell>
                    <TableCell align="right">Сумма</TableCell>
                    <TableCell align="center">Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => {
                    const itemPrice = item.discount > 0 
                      ? calculateDiscountedPrice(item.price, item.discount) 
                      : item.price;
                    const itemTotal = itemPrice * item.quantity;
                    
                    return (
                      <TableRow key={item.productId}>
                        {/* Товар */}
                        <TableCell component="th" scope="row">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box
                              component="img"
                              sx={{
                                width: 60,
                                height: 60,
                                objectFit: 'contain',
                                mr: 2,
                              }}
                              src={item.image}
                              alt={item.name}
                            />
                            <Link
                              component={RouterLink}
                              to={`/product/${item.slug}`}
                              underline="hover"
                              color="inherit"
                            >
                              {item.name}
                            </Link>
                          </Box>
                        </TableCell>
                        
                        {/* Цена */}
                        <TableCell align="right">
                          {item.discount > 0 ? (
                            <Box>
                              <Typography variant="body2" color="error" fontWeight="bold">
                                {itemPrice.toLocaleString()} ₽
                              </Typography>
                              <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                                {item.price.toLocaleString()} ₽
                              </Typography>
                            </Box>
                          ) : (
                            <Typography>
                              {item.price.toLocaleString()} ₽
                            </Typography>
                          )}
                        </TableCell>
                        
                        {/* Количество */}
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <IconButton 
                              size="small" 
                              onClick={() => handleDecreaseQuantity(item.productId)}
                              disabled={item.quantity <= 1}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <TextField
                              variant="outlined"
                              size="small"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(e, item.productId)}
                              inputProps={{ 
                                min: 1, 
                                style: { textAlign: 'center', width: '40px' } 
                              }}
                              sx={{ mx: 1 }}
                            />
                            <IconButton 
                              size="small" 
                              onClick={() => handleIncreaseQuantity(item.productId)}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                        
                        {/* Сумма */}
                        <TableCell align="right">
                          <Typography fontWeight="bold">
                            {itemTotal.toLocaleString()} ₽
                          </Typography>
                        </TableCell>
                        
                        {/* Действия */}
                        <TableCell align="center">
                          <IconButton 
                            color="error" 
                            onClick={() => handleRemoveItem(item.productId)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                component={RouterLink}
                to="/catalog"
                variant="outlined"
              >
                Продолжить покупки
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleClearCart}
              >
                Очистить корзину
              </Button>
            </Box>
          </Grid>
          
          {/* Сводка заказа */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Сводка заказа
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Товары ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} шт.):</Typography>
                <Typography>{calculateTotal().toLocaleString()} ₽</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Доставка:</Typography>
                <Typography>Бесплатно</Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Итого:</Typography>
                <Typography variant="h6" fontWeight="bold">
                  {calculateTotal().toLocaleString()} ₽
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleCheckout}
              >
                Оформить заказ
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default CartPage;