import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  LocalShipping as LocalShippingIcon,
  Storefront as StorefrontIcon,
  Build as BuildIcon,
  ThumbUp as ThumbUpIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const AboutPage = () => {
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
        <Typography color="text.primary">О компании</Typography>
      </Breadcrumbs>
      
      <Typography variant="h4" component="h1" gutterBottom>
        О компании BIZON
      </Typography>
      
      {/* Основной блок */}
      <Paper sx={{ p: { xs: 2, md: 4 }, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              Мы создаем комфорт для вашего дома
            </Typography>
            <Typography variant="body1" paragraph>
              BIZON — это современный мебельный магазин с широким ассортиментом качественной мебели для дома и офиса. 
              Мы работаем с 2010 года и за это время завоевали доверие тысяч клиентов благодаря высокому качеству продукции, 
              отличному сервису и индивидуальному подходу к каждому покупателю.
            </Typography>
            <Typography variant="body1" paragraph>
              Наша миссия — помогать людям создавать уютное и функциональное пространство для жизни и работы, 
              предлагая мебель, которая сочетает в себе современный дизайн, комфорт и долговечность.
            </Typography>
            <Typography variant="body1">
              В нашем каталоге представлена мебель от ведущих российских и зарубежных производителей, 
              а также собственная линейка мебели BIZON, разработанная с учетом потребностей наших клиентов.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/images/about/showroom.jpg"
              alt="Шоурум BIZON"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
              }}
            />
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        {/* Наши преимущества */}
        <Typography variant="h5" gutterBottom>
          Наши преимущества
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                bgcolor: 'background.default',
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ThumbUpIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
                <Typography variant="h6">Качество</Typography>
              </Box>
              <Typography variant="body2">
                Мы тщательно отбираем поставщиков и контролируем качество каждого товара. 
                Вся мебель соответствует стандартам качества и имеет необходимые сертификаты.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                bgcolor: 'background.default',
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalShippingIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
                <Typography variant="h6">Доставка</Typography>
              </Box>
              <Typography variant="body2">
                Быстрая доставка по всей России. Собственный автопарк в Москве и Санкт-Петербурге 
                позволяет нам доставлять товары в кратчайшие сроки.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                bgcolor: 'background.default',
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BuildIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
                <Typography variant="h6">Сборка</Typography>
              </Box>
              <Typography variant="body2">
                Профессиональная сборка мебели опытными мастерами. 
                Мы гарантируем качественную установку и настройку всех элементов.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                bgcolor: 'background.default',
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StorefrontIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
                <Typography variant="h6">Шоурумы</Typography>
              </Box>
              <Typography variant="body2">
                Просторные шоурумы, где вы можете увидеть и протестировать мебель перед покупкой. 
                Наши консультанты помогут с выбором и ответят на все вопросы.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                bgcolor: 'background.default',
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTimeIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
                <Typography variant="h6">Гарантия</Typography>
              </Box>
              <Typography variant="body2">
                Мы предоставляем гарантию на всю мебель от 12 до 36 месяцев в зависимости от категории товара. 
                Оперативное гарантийное обслуживание.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                bgcolor: 'background.default',
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
                <Typography variant="h6">Сервис</Typography>
              </Box>
              <Typography variant="body2">
                Индивидуальный подход к каждому клиенту. Мы ценим ваше время и стремимся сделать процесс 
                выбора и покупки мебели максимально комфортным.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        {/* Наша история */}
        <Typography variant="h5" gutterBottom>
          История компании
        </Typography>
        
        <Box sx={{ py: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3} md={2}>
              <Typography variant="h6" color="primary">2010</Typography>
            </Grid>
            <Grid item xs={12} sm={9} md={10}>
              <Typography variant="body1" paragraph>
                Основание компании BIZON. Открытие первого магазина в Москве площадью 200 м².
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={3} md={2}>
              <Typography variant="h6" color="primary">2012</Typography>
            </Grid>
            <Grid item xs={12} sm={9} md={10}>
              <Typography variant="body1" paragraph>
                Расширение ассортимента и открытие второго магазина. Запуск собственной линейки мебели BIZON.
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={3} md={2}>
              <Typography variant="h6" color="primary">2015</Typography>
            </Grid>
            <Grid item xs={12} sm={9} md={10}>
              <Typography variant="body1" paragraph>
                Открытие большого шоурума в Санкт-Петербурге. Запуск интернет-магазина с доставкой по всей России.
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={3} md={2}>
              <Typography variant="h6" color="primary">2018</Typography>
            </Grid>
            <Grid item xs={12} sm={9} md={10}>
              <Typography variant="body1" paragraph>
                Получение премии "Лучший мебельный магазин года". Открытие филиалов в Казани и Екатеринбурге.
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={3} md={2}>
              <Typography variant="h6" color="primary">2020</Typography>
            </Grid>
            <Grid item xs={12} sm={9} md={10}>
              <Typography variant="body1" paragraph>
                10-летний юбилей компании. Обновление концепции магазинов и запуск программы лояльности для клиентов.
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={3} md={2}>
              <Typography variant="h6" color="primary">2023</Typography>
            </Grid>
            <Grid item xs={12} sm={9} md={10}>
              <Typography variant="body1">
                Редизайн интернет-магазина и запуск мобильного приложения. Расширение сети до 12 магазинов по всей России.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
      {/* Наша команда */}
      <Paper sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h5" gutterBottom>
          Наша команда
        </Typography>
        
        <Typography variant="body1" paragraph>
          В BIZON работают профессионалы, любящие свое дело и стремящиеся сделать ваш дом уютнее. 
          Наша команда состоит из опытных дизайнеров, консультантов, логистов и мастеров по сборке мебели.
        </Typography>
        
        <Typography variant="body1" paragraph>
          Мы постоянно совершенствуем свои навыки и следим за последними тенденциями в мире мебели и дизайна интерьеров, 
          чтобы предлагать вам лучшие решения для вашего дома.
        </Typography>
        
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Консультанты с профильным образованием" 
                  secondary="Помогут подобрать мебель, учитывая ваши потребности и особенности помещения"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Дизайнеры интерьера" 
                  secondary="Предложат оптимальные решения для организации пространства и создания гармоничного интерьера"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Опытные мастера по сборке" 
                  secondary="Профессионально и аккуратно соберут и установят вашу мебель"
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Служба доставки" 
                  secondary="Обеспечит своевременную и бережную доставку вашей мебели"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Служба поддержки клиентов" 
                  secondary="Всегда готова ответить на ваши вопросы и помочь решить любые проблемы"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Технические специалисты" 
                  secondary="Обеспечивают качественное гарантийное и постгарантийное обслуживание"
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AboutPage;