import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  TextField,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Divider,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { createOrder, resetOrderState } from '../features/orders/orderSlice';
import { clearCart } from '../features/cart/cartSlice';

// Шаги оформления заказа
const steps = ['Данные получателя', 'Способ доставки', 'Способ оплаты', 'Подтверждение'];

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    deliveryMethod: 'courier',
    paymentMethod: 'card',
  });
  
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const { loading, success, error, order } = useSelector((state) => state.orders);
  
  // Перенаправление на страницу корзины, если корзина пуста
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);
  
  // Перенаправление на страницу заказа после успешного создания
  useEffect(() => {
    if (success && order) {
      navigate(`/order/${order._id}`);
      dispatch(clearCart());
      dispatch(resetOrderState());
    }
  }, [success, order, navigate, dispatch]);
  
  // Предзаполнение данных пользователя, если он авторизован
  useEffect(() => {
    if (userInfo) {
      setFormData((prev) => ({
        ...prev,
        firstName: userInfo.name.split(' ')[0] || '',
        lastName: userInfo.name.split(' ')[1] || '',
        email: userInfo.email || '',
      }));
    }
  }, [userInfo]);
  
  // Обработка изменения полей формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Переход к следующему шагу
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handlePlaceOrder();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };
  
  // Возврат к предыдущему шагу
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  // Размещение заказа
  const handlePlaceOrder = () => {
    // Рассчет общей суммы
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    
    // Создание объекта заказа
    const orderData = {
      orderItems: cartItems.map((item) => ({
        product: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      })),
      shippingAddress: {
        fullName: `${formData.firstName} ${formData.lastName}`,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        phone: formData.phone,
      },
      paymentMethod: formData.paymentMethod,
      deliveryMethod: formData.deliveryMethod,
      itemsPrice: totalPrice,
      shippingPrice: 0, // Бесплатная доставка
      totalPrice: totalPrice,
    };
    
    dispatch(createOrder(orderData));
  };
  
  // Валидация текущего шага
  const isStepValid = () => {
    switch (activeStep) {
      case 0: // Данные получателя
        return (
          formData.firstName.trim() !== '' &&
          formData.lastName.trim() !== '' &&
          formData.email.trim() !== '' &&
          formData.phone.trim() !== ''
        );
      case 1: // Способ доставки
        return (
          formData.address.trim() !== '' &&
          formData.city.trim() !== '' &&
          formData.postalCode.trim() !== ''
        );
      case 2: // Способ оплаты
        return formData.paymentMethod !== '';
      default:
        return true;
    }
  };
  
  // Рассчет общей суммы корзины
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };
  
  // Отображение формы в зависимости от текущего шага
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Имя"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Фамилия"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Телефон"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Способ доставки</FormLabel>
                <RadioGroup
                  name="deliveryMethod"
                  value={formData.deliveryMethod}
                  onChange={handleInputChange}
                >
                  <FormControlLabel
                    value="courier"
                    control={<Radio />}
                    label="Курьерская доставка"
                  />
                  <FormControlLabel
                    value="pickup"
                    control={<Radio />}
                    label="Самовывоз из магазина"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Адрес"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Город"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Почтовый индекс"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">Способ оплаты</FormLabel>
            <RadioGroup
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
            >
              <FormControlLabel
                value="card"
                control={<Radio />}
                label="Банковская карта"
              />
              <FormControlLabel
                value="cash"
                control={<Radio />}
                label="Наличные при получении"
              />
            </RadioGroup>
          </FormControl>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Информация о заказе
            </Typography>
            
            <List disablePadding>
              {cartItems.map((item) => (
                <ListItem key={item.productId} sx={{ py: 1, px: 0 }}>
                  <ListItemText
                    primary={item.name}
                    secondary={`Количество: ${item.quantity}`}
                  />
                  <Typography variant="body2">
                    {(item.price * item.quantity).toLocaleString()} ₽
                  </Typography>
                </ListItem>
              ))}
              <Divider sx={{ my: 2 }} />
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Итого" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {calculateTotal().toLocaleString()} ₽
                </Typography>
              </ListItem>
            </List>
            
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" gutterBottom>
                  Данные получателя
                </Typography>
                <Typography gutterBottom>
                  {formData.firstName} {formData.lastName}
                </Typography>
                <Typography gutterBottom>{formData.email}</Typography>
                <Typography gutterBottom>{formData.phone}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" gutterBottom>
                  Адрес доставки
                </Typography>
                <Typography gutterBottom>{formData.address}</Typography>
                <Typography gutterBottom>
                  {formData.city}, {formData.postalCode}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Способ оплаты
                </Typography>
                <Typography gutterBottom>
                  {formData.paymentMethod === 'card'
                    ? 'Банковская карта'
                    : 'Наличные при получении'}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        );
      default:
        return 'Неизвестный шаг';
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Оформление заказа
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: { xs: 3, md: 0 } }}>
            {getStepContent(activeStep)}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0 || loading}
              >
                Назад
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!isStepValid() || loading}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : activeStep === steps.length - 1 ? (
                  'Оформить заказ'
                ) : (
                  'Далее'
                )}
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Ваш заказ
            </Typography>
            
            <List disablePadding>
              {cartItems.map((item) => (
                <ListItem key={item.productId} sx={{ py: 1, px: 0 }}>
                  <ListItemText
                    primary={item.name}
                    secondary={`${item.quantity} x ${item.price.toLocaleString()} ₽`}
                  />
                  <Typography variant="body2">
                    {(item.price * item.quantity).toLocaleString()} ₽
                  </Typography>
                </ListItem>
              ))}
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Товары ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} шт.):</Typography>
              <Typography>{calculateTotal().toLocaleString()} ₽</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Доставка:</Typography>
              <Typography>Бесплатно</Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Итого:</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {calculateTotal().toLocaleString()} ₽
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;