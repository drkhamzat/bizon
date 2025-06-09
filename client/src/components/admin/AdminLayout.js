import React, { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

// Ширина бокового меню
const drawerWidth = 240;

const AdminLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [open, setOpen] = useState(!isMobile);
  const [anchorElUser, setAnchorElUser] = useState(null);
  
  const { userInfo } = useSelector((state) => state.auth);
  
  // Проверка, является ли текущий путь активным
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // Обработчики для меню пользователя
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  const handleLogout = () => {
    dispatch(logout());
    handleCloseUserMenu();
    navigate('/login');
  };
  
  // Обработчики для бокового меню
  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  
  // Пункты меню
  const menuItems = [
    {
      text: 'Панель управления',
      icon: <DashboardIcon />,
      path: '/admin',
    },
    {
      text: 'Товары',
      icon: <InventoryIcon />,
      path: '/admin/products',
    },
    {
      text: 'Категории',
      icon: <CategoryIcon />,
      path: '/admin/categories',
    },
    {
      text: 'Заказы',
      icon: <ShoppingCartIcon />,
      path: '/admin/orders',
    },
    {
      text: 'Пользователи',
      icon: <PeopleIcon />,
      path: '/admin/users',
    },
    {
      text: 'Настройки',
      icon: <SettingsIcon />,
      path: '/admin/settings',
    },
  ];
  
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Верхняя панель */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            BIZON
          </Typography>
          <Box sx={{ ml: 2 }}>
            <Tooltip title="Настройки аккаунта">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt={userInfo?.name}
                  src="/static/images/avatar/2.jpg"
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem
                component={RouterLink}
                to="/profile"
                onClick={handleCloseUserMenu}
              >
                <Typography textAlign="center">Профиль</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Typography textAlign="center">Выйти</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Боковое меню */}
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={isMobile ? open : true}
        onClose={isMobile ? handleDrawerToggle : undefined}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                component={RouterLink}
                to={item.path}
                selected={isActive(item.path)}
                sx={{
                  backgroundColor: isActive(item.path)
                    ? 'rgba(0, 0, 0, 0.08)'
                    : 'transparent',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive(item.path)
                      ? 'primary.main'
                      : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem
              button
              component={RouterLink}
              to="/"
            >
              <ListItemText primary="Вернуться на сайт" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      
      {/* Основное содержимое */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;