import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Rating,
  Divider,
  List,
  ListItem,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Breadcrumbs,
  Link,
  Paper,
  Chip,
  Skeleton,
  ImageList,
  ImageListItem,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';
import { getProductDetails } from '../features/products/productSlice';
import { addToCart } from '../features/cart/cartSlice';

const ProductPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  
  const { product, loading, error } = useSelector((state) => state.products);
  
  useEffect(() => {
    dispatch(getProductDetails(slug));
  }, [dispatch, slug]);
  
  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value));
  };
  
  const handleAddToCart = () => {
    dispatch(addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
    }));
  };
  
  const handleImageClick = (index) => {
    setActiveImage(index);
  };
  
  // Рассчет цены с учетом скидки
  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * discount / 100);
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" width="100%" height={400} />
            <Box sx={{ display: 'flex', mt: 2 }}>
              {[1, 2, 3].map((item) => (
                <Skeleton key={item} variant="rectangular" width={80} height={80} sx={{ mr: 1 }} />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" height={60} width="80%" />
            <Skeleton variant="text" height={30} width="40%" />
            <Skeleton variant="text" height={30} width="30%" />
            <Skeleton variant="text" height={100} />
            <Skeleton variant="rectangular" height={50} width={200} sx={{ mt: 2 }} />
          </Grid>
        </Grid>
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
  
  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">Товар не найден</Alert>
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
        <Link 
          component={RouterLink} 
          to="/catalog"
          underline="hover"
        >
          Каталог
        </Link>
        {product.category && (
          <Link 
            component={RouterLink} 
            to={`/catalog?category=${product.category.slug}`}
            underline="hover"
          >
            {product.category.name}
          </Link>
        )}
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>
      
      <Grid container spacing={4}>
        {/* Изображения товара */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              justifyContent: 'center',
              mb: 2 
            }}
          >
            <Box
              component="img"
              sx={{
                width: '100%',
                maxHeight: 400,
                objectFit: 'contain',
              }}
              src={product.images && product.images[activeImage]}
              alt={product.name}
            />
          </Paper>
          
          {/* Миниатюры изображений */}
          {product.images && product.images.length > 1 && (
            <ImageList sx={{ width: '100%', height: 100 }} cols={4} rowHeight={80}>
              {product.images.map((img, index) => (
                <ImageListItem 
                  key={index}
                  onClick={() => handleImageClick(index)}
                  sx={{ 
                    cursor: 'pointer',
                    border: index === activeImage ? '2px solid #1976d2' : 'none',
                    p: 0.5,
                  }}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    loading="lazy"
                    style={{ objectFit: 'contain', height: '100%' }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          )}
        </Grid>
        
        {/* Информация о товаре */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.name}
          </Typography>
          
          {/* Цена и скидка */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {product.discount > 0 ? (
              <>
                <Typography variant="h5" color="error" sx={{ fontWeight: 'bold', mr: 2 }}>
                  {calculateDiscountedPrice(product.price, product.discount).toLocaleString()} ₽
                </Typography>
                <Typography variant="h6" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                  {product.price.toLocaleString()} ₽
                </Typography>
                <Chip 
                  label={`-${product.discount}%`} 
                  color="error" 
                  size="small" 
                  sx={{ ml: 2 }} 
                />
              </>
            ) : (
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {product.price.toLocaleString()} ₽
              </Typography>
            )}
          </Box>
          
          {/* Наличие */}
          <Box sx={{ mb: 2 }}>
            <Chip 
              label={product.inStock ? 'В наличии' : 'Нет в наличии'} 
              color={product.inStock ? 'success' : 'default'} 
              variant="outlined"
            />
          </Box>
          
          {/* Описание */}
          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          {/* Характеристики */}
          <Typography variant="h6" gutterBottom>
            Характеристики
          </Typography>
          <List dense>
            {product.dimensions && (
              <ListItem>
                <ListItemText 
                  primary="Размеры" 
                  secondary={`${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} см`} 
                />
              </ListItem>
            )}
            {product.material && (
              <ListItem>
                <ListItemText primary="Материал" secondary={product.material} />
              </ListItem>
            )}
            {product.color && (
              <ListItem>
                <ListItemText primary="Цвет" secondary={product.color} />
              </ListItem>
            )}
            {product.weight && (
              <ListItem>
                <ListItemText primary="Вес" secondary={`${product.weight} кг`} />
              </ListItem>
            )}
          </List>
          
          <Divider sx={{ my: 2 }} />
          
          {/* Выбор количества и кнопка добавления в корзину */}
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
            <FormControl sx={{ width: 100, mr: 2 }}>
              <InputLabel id="quantity-select-label">Кол-во</InputLabel>
              <Select
                labelId="quantity-select-label"
                id="quantity-select"
                value={quantity}
                label="Количество"
                onChange={handleQuantityChange}
                disabled={!product.inStock}
              >
                {[...Array(10).keys()].map((x) => (
                  <MenuItem key={x + 1} value={x + 1}>
                    {x + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCartIcon />}
              onClick={handleAddToCart}
              disabled={!product.inStock}
              sx={{ flexGrow: 1 }}
            >
              В корзину
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductPage;