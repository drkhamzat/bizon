import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Telegram as TelegramIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Информация о компании */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom component="div">
              BIZON
            </Typography>
            <Typography variant="body2">
              Качественная мебель для вашего дома и офиса. Создаем уют и комфорт с 2010 года.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton color="inherit" aria-label="Facebook" component="a" href="https://facebook.com" target="_blank">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram" component="a" href="https://instagram.com" target="_blank">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Telegram" component="a" href="https://t.me/bizon_furniture" target="_blank">
                <TelegramIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Категории */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Категории
            </Typography>
            <Link component={RouterLink} to="/catalog?category=living-room" color="inherit" display="block" sx={{ mb: 1 }}>
              Гостиная
            </Link>
            <Link component={RouterLink} to="/catalog?category=bedroom" color="inherit" display="block" sx={{ mb: 1 }}>
              Спальня
            </Link>
            <Link component={RouterLink} to="/catalog?category=kitchen" color="inherit" display="block" sx={{ mb: 1 }}>
              Кухня
            </Link>
            <Link component={RouterLink} to="/catalog?category=office" color="inherit" display="block" sx={{ mb: 1 }}>
              Офис
            </Link>
            <Link component={RouterLink} to="/catalog?category=children" color="inherit" display="block" sx={{ mb: 1 }}>
              Детская
            </Link>
          </Grid>

          {/* Информация */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Информация
            </Typography>
            <Link component={RouterLink} to="/about" color="inherit" display="block" sx={{ mb: 1 }}>
              О нас
            </Link>
            <Link component={RouterLink} to="/delivery" color="inherit" display="block" sx={{ mb: 1 }}>
              Доставка и оплата
            </Link>
            <Link component={RouterLink} to="/return" color="inherit" display="block" sx={{ mb: 1 }}>
              Возврат и обмен
            </Link>
            <Link component={RouterLink} to="/contacts" color="inherit" display="block" sx={{ mb: 1 }}>
              Контакты
            </Link>
          </Grid>

          {/* Контакты */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Контакты
            </Typography>
            <Box sx={{ display: 'flex', mb: 1 }}>
              <PhoneIcon sx={{ mr: 1 }} />
              <Link href="tel:+78001234567" color="inherit">
                8 (800) 123-45-67
              </Link>
            </Box>
            <Box sx={{ display: 'flex', mb: 1 }}>
              <EmailIcon sx={{ mr: 1 }} />
              <Link href="mailto:info@bizon-mebel.ru" color="inherit">
                info@bizon-mebel.ru
              </Link>
            </Box>
            <Box sx={{ display: 'flex' }}>
              <LocationIcon sx={{ mr: 1 }} />
              <Typography variant="body2">
                г. Москва, ул. Примерная, д. 123
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} BIZON Мебель. Все права защищены.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 