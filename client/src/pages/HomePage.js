import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Button,
  Container,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Paper,
} from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import ProductCard from '../components/products/ProductCard';
import { fetchFeaturedProducts, fetchDiscountedProducts } from '../features/products/productSlice';
import { fetchCategories } from '../features/categories/categorySlice';

// Настройки для слайдера
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  pauseOnHover: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const HomePage = () => {
  const dispatch = useDispatch();
  const { featuredProducts, discountedProducts, loading } = useSelector(
    (state) => state.products
  );
  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    dispatch(fetchDiscountedProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Баннеры для слайдера
  const banners = [
    {
      id: 1,
      title: 'Новая коллекция мебели',
      description: 'Современный дизайн для вашего дома',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
      link: '/catalog?category=living-room',
    },
    {
      id: 2,
      title: 'Скидки до 30%',
      description: 'На всю мебель для спальни',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
      link: '/catalog?category=bedroom',
    },
    {
      id: 3,
      title: 'Офисная мебель',
      description: 'Создайте комфортное рабочее место',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36',
      link: '/catalog?category=office',
    },
  ];

  return (
    <Box>
      {/* Слайдер с баннерами */}
      <Box sx={{ mb: 6 }}>
        <Slider {...sliderSettings}>
          {banners.map((banner) => (
            <Box key={banner.id}>
              <Paper
                sx={{
                  position: 'relative',
                  height: { xs: '300px', sm: '400px', md: '500px' },
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${banner.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 0,
                }}
              >
                <Box
                  sx={{
                    textAlign: 'center',
                    color: 'white',
                    p: 3,
                  }}
                >
                  <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                      fontWeight: 'bold',
                      mb: 2,
                      textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    {banner.title}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 3,
                      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    {banner.description}
                  </Typography>
                  <Button
                    component={RouterLink}
                    to={banner.link}
                    variant="contained"
                    color="secondary"
                    size="large"
                  >
                    Подробнее
                  </Button>
                </Box>
              </Paper>
            </Box>
          ))}
        </Slider>
      </Box>

      <Container>
        {/* Популярные категории */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{ mb: 3, textAlign: 'center' }}
          >
            Популярные категории
          </Typography>
          <Grid container spacing={3}>
            {categories
              .filter((category) => category.featured)
              .slice(0, 4)
              .map((category) => (
                <Grid item xs={6} sm={6} md={3} key={category._id}>
                  <Card>
                    <CardActionArea
                      component={RouterLink}
                      to={`/catalog/${category.slug}`}
                    >
                      <CardMedia
                        component="img"
                        height="140"
                        image={category.image || 'https://via.placeholder.com/300x200'}
                        alt={category.name}
                      />
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" component="div">
                          {category.name}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              component={RouterLink}
              to="/catalog"
              variant="outlined"
              color="primary"
              size="large"
            >
              Все категории
            </Button>
          </Box>
        </Box>

        {/* Хиты продаж */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{ mb: 3, textAlign: 'center' }}
          >
            Хиты продаж
          </Typography>
          <Grid container spacing={3}>
            {loading ? (
              <Typography>Загрузка...</Typography>
            ) : (
              featuredProducts.slice(0, 4).map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product._id}>
                  <ProductCard product={product} />
                </Grid>
              ))
            )}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              component={RouterLink}
              to="/catalog"
              variant="outlined"
              color="primary"
              size="large"
            >
              Смотреть все товары
            </Button>
          </Box>
        </Box>

        {/* Акции и скидки */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{ mb: 3, textAlign: 'center' }}
          >
            Акции и скидки
          </Typography>
          <Grid container spacing={3}>
            {loading ? (
              <Typography>Загрузка...</Typography>
            ) : (
              discountedProducts.slice(0, 4).map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product._id}>
                  <ProductCard product={product} />
                </Grid>
              ))
            )}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              component={RouterLink}
              to="/catalog?discount=true"
              variant="outlined"
              color="primary"
              size="large"
            >
              Все акции
            </Button>
          </Box>
        </Box>

        {/* О компании */}
        <Box sx={{ mb: 6 }}>
          <Paper sx={{ p: 4 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h4" component="h2" gutterBottom>
                  О компании BIZON
                </Typography>
                <Typography variant="body1" paragraph>
                  Мы производим качественную мебель с 2010 года. Наша миссия — создавать
                  комфортные и стильные интерьеры, которые будут радовать вас долгие годы.
                </Typography>
                <Typography variant="body1" paragraph>
                  Мы используем только экологически чистые материалы и современное
                  оборудование, что позволяет нам гарантировать высокое качество каждого
                  изделия.
                </Typography>
                <Button
                  component={RouterLink}
                  to="/about"
                  variant="contained"
                  color="primary"
                >
                  Подробнее о нас
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea"
                  alt="О компании"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 1,
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;