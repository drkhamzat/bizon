import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Person as PersonIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { listOrders } from '../../features/orders/orderSlice';
import { listProducts } from '../../features/products/productSlice';
import { listCategories } from '../../features/categories/categorySlice';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  
  const { orders } = useSelector((state) => state.orders);
  const { products } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  
  useEffect(() => {
    dispatch(listOrders());
    dispatch(listProducts());
    dispatch(listCategories());
  }, [dispatch]);
  
  // Статистика заказов
  const totalOrders = orders?.length || 0;
  const totalRevenue = orders?.reduce((sum, order) => sum + order.totalPrice, 0) || 0;
  const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;
  
  // Статистика товаров
  const totalProducts = products?.length || 0;
  const outOfStockProducts = products?.filter(product => !product.inStock).length || 0;
  const featuredProducts = products?.filter(product => product.featured).length || 0;
  
  // Последние заказы
  const recentOrders = orders?.slice(0, 5) || [];
  
  return (
    <AdminLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Панель управления
        </Typography>
        
        {/* Карточки со статистикой */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Заказы */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                      mr: 2,
                    }}
                  >
                    <ShoppingCartIcon sx={{ color: 'white' }} />
                  </Box>
                  <Typography variant="h6" component="div">
                    Заказы
                  </Typography>
                </Box>
                <Typography variant="h4" component="div">
                  {totalOrders}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 1 }}>
                  {pendingOrders} ожидают обработки
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Общая сумма: {totalRevenue.toLocaleString()} ₽
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Товары */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: 'success.main',
                      mr: 2,
                    }}
                  >
                    <InventoryIcon sx={{ color: 'white' }} />
                  </Box>
                  <Typography variant="h6" component="div">
                    Товары
                  </Typography>
                </Box>
                <Typography variant="h4" component="div">
                  {totalProducts}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 1 }}>
                  {outOfStockProducts} нет в наличии
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {featuredProducts} рекомендуемых товаров
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Категории */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: 'warning.main',
                      mr: 2,
                    }}
                  >
                    <CategoryIcon sx={{ color: 'white' }} />
                  </Box>
                  <Typography variant="h6" component="div">
                    Категории
                  </Typography>
                </Box>
                <Typography variant="h4" component="div">
                  {categories?.length || 0}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 1 }}>
                  {categories?.filter(cat => cat.featured).length || 0} избранных
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Всего товаров: {totalProducts}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Пользователи - заглушка */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: 'info.main',
                      mr: 2,
                    }}
                  >
                    <PersonIcon sx={{ color: 'white' }} />
                  </Box>
                  <Typography variant="h6" component="div">
                    Пользователи
                  </Typography>
                </Box>
                <Typography variant="h4" component="div">
                  {/* Заглушка для количества пользователей */}
                  10
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 1 }}>
                  1 администратор
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  9 клиентов
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Последние заказы */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" component="h2" gutterBottom>
                Последние заказы
              </Typography>
              <List>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order, index) => (
                    <React.Fragment key={order._id}>
                      <ListItem>
                        <ListItemText
                          primary={`Заказ #${order._id.slice(-6)}`}
                          secondary={`${new Date(order.createdAt).toLocaleDateString()} - ${order.totalPrice.toLocaleString()} ₽`}
                        />
                        <Box
                          sx={{
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor: 
                              order.status === 'pending' ? 'warning.light' :
                              order.status === 'processing' ? 'info.light' :
                              order.status === 'shipped' ? 'primary.light' :
                              order.status === 'delivered' ? 'success.light' : 'grey.light',
                            color: 'text.primary',
                          }}
                        >
                          {order.status === 'pending' ? 'Ожидает' :
                           order.status === 'processing' ? 'Обработка' :
                           order.status === 'shipped' ? 'Отправлен' :
                           order.status === 'delivered' ? 'Доставлен' : 'Неизвестно'}
                        </Box>
                      </ListItem>
                      {index < recentOrders.length - 1 && <Divider />}
                    </React.Fragment>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="Нет заказов" />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>
          
          {/* Популярные товары */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" component="h2" gutterBottom>
                Популярные товары
              </Typography>
              <List>
                {products && products.length > 0 ? (
                  products
                    .filter(product => product.featured)
                    .slice(0, 5)
                    .map((product, index, filteredProducts) => (
                      <React.Fragment key={product._id}>
                        <ListItem>
                          <Box
                            component="img"
                            src={product.images[0]}
                            alt={product.name}
                            sx={{
                              width: 50,
                              height: 50,
                              objectFit: 'contain',
                              mr: 2,
                            }}
                          />
                          <ListItemText
                            primary={product.name}
                            secondary={`${product.price.toLocaleString()} ₽`}
                          />
                          <Box
                            sx={{
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              bgcolor: product.inStock ? 'success.light' : 'error.light',
                              color: 'text.primary',
                            }}
                          >
                            {product.inStock ? 'В наличии' : 'Нет в наличии'}
                          </Box>
                        </ListItem>
                        {index < filteredProducts.length - 1 && <Divider />}
                      </React.Fragment>
                    ))
                ) : (
                  <ListItem>
                    <ListItemText primary="Нет популярных товаров" />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </AdminLayout>
  );
};

export default AdminDashboard;