import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { addToCart } from '../../features/cart/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        ...product,
        quantity: 1,
      })
    );
  };

  // Расчет цены со скидкой
  const discountedPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : null;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Бейджи */}
      <Box sx={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}>
        {product.featured && (
          <Chip
            label="Хит"
            color="secondary"
            size="small"
            sx={{ mb: 0.5 }}
          />
        )}
        {product.discount > 0 && (
          <Chip
            label={`-${product.discount}%`}
            color="error"
            size="small"
            sx={{ display: 'block', mb: 0.5 }}
          />
        )}
        {!product.inStock && (
          <Chip
            label="Нет в наличии"
            color="default"
            size="small"
            sx={{ display: 'block' }}
          />
        )}
      </Box>

      {/* Изображение и ссылка на детали */}
      <CardActionArea
        component={RouterLink}
        to={`/product/${product.slug}`}
        sx={{ flexGrow: 1 }}
      >
        <CardMedia
          component="img"
          height="200"
          image={product.images[0]}
          alt={product.name}
          sx={{ objectFit: 'contain', p: 1 }}
        />
        <CardContent sx={{ pb: 1 }}>
          <Typography
            variant="subtitle1"
            component="div"
            fontWeight="medium"
            noWrap
          >
            {product.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              mb: 1,
              height: '40px',
            }}
          >
            {product.description}
          </Typography>

          {/* Цена и скидка */}
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            {discountedPrice ? (
              <>
                <Typography
                  variant="h6"
                  color="primary"
                  fontWeight="bold"
                  sx={{ mr: 1 }}
                >
                  {discountedPrice.toLocaleString()} ₽
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textDecoration: 'line-through' }}
                >
                  {product.price.toLocaleString()} ₽
                </Typography>
              </>
            ) : (
              <Typography variant="h6" color="primary" fontWeight="bold">
                {product.price.toLocaleString()} ₽
              </Typography>
            )}
          </Box>
        </CardContent>
      </CardActionArea>

      {/* Кнопки действий */}
      <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 1 }}>
        <Button
          size="small"
          component={RouterLink}
          to={`/product/${product.slug}`}
          color="primary"
        >
          Подробнее
        </Button>
        <Button
          size="small"
          variant="contained"
          color="primary"
          startIcon={<ShoppingCartIcon />}
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          В корзину
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;