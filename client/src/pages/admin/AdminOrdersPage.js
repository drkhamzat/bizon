import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  TablePagination,
  Chip,
  Tooltip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { 
  listOrders, 
  updateOrderStatus 
} from '../../features/orders/orderSlice';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminOrdersPage = () => {
  const dispatch = useDispatch();
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  
  const { 
    orders, 
    loading, 
    error, 
    success 
  } = useSelector((state) => state.orders);
  
  // Загрузка списка заказов
  useEffect(() => {
    dispatch(listOrders());
  }, [dispatch]);
  
  // Фильтрация заказов при изменении поискового запроса или списка заказов
  useEffect(() => {
    if (orders) {
      if (searchTerm) {
        const lowercasedSearch = searchTerm.toLowerCase();
        setFilteredOrders(
          orders.filter(
            (order) =>
              order._id.toLowerCase().includes(lowercasedSearch) ||
              (order.user && order.user.name && order.user.name.toLowerCase().includes(lowercasedSearch)) ||
              (order.shippingAddress && order.shippingAddress.fullName && order.shippingAddress.fullName.toLowerCase().includes(lowercasedSearch))
          )
        );
      } else {
        setFilteredOrders(orders);
      }
    }
  }, [searchTerm, orders]);
  
  // Обработчики пагинации
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Обработчики поиска
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };
  
  const handleClearSearch = () => {
    setSearchTerm('');
  };
  
  // Обработчики диалога изменения статуса
  const handleOpenStatusDialog = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusDialogOpen(true);
  };
  
  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
    setSelectedOrder(null);
  };
  
  // Обновление статуса заказа
  const handleUpdateStatus = () => {
    if (selectedOrder && newStatus) {
      dispatch(updateOrderStatus({
        id: selectedOrder._id,
        status: newStatus,
      }));
      handleCloseStatusDialog();
    }
  };
  
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
  
  return (
    <AdminLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Управление заказами
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Статус заказа успешно обновлен
          </Alert>
        )}
        
        {/* Поиск */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <TextField
              variant="outlined"
              size="small"
              placeholder="Поиск по ID заказа или имени клиента..."
              fullWidth
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                endAdornment: searchTerm && (
                  <IconButton size="small" onClick={handleClearSearch}>
                    <ClearIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>
        </Paper>
        
        {/* Таблица заказов */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID заказа</TableCell>
                      <TableCell>Дата</TableCell>
                      <TableCell>Клиент</TableCell>
                      <TableCell align="right">Сумма</TableCell>
                      <TableCell align="center">Способ оплаты</TableCell>
                      <TableCell align="center">Статус</TableCell>
                      <TableCell align="center">Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredOrders
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((order) => (
                        <TableRow key={order._id}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              #{order._id.slice(-6)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {order._id}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {formatDate(order.createdAt)}
                          </TableCell>
                          <TableCell>
                            {order.user ? (
                              <Typography variant="body2">
                                {order.user.name}
                              </Typography>
                            ) : (
                              order.shippingAddress && (
                                <Typography variant="body2">
                                  {order.shippingAddress.fullName}
                                </Typography>
                              )
                            )}
                            {order.shippingAddress && (
                              <Typography variant="caption" color="text.secondary">
                                {order.shippingAddress.address}, {order.shippingAddress.city}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="bold">
                              {order.totalPrice.toLocaleString()} ₽
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {order.orderItems.length} товаров
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            {order.paymentMethod === 'card' ? 'Карта' : 'Наличные'}
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={getStatusText(order.status)}
                              color={getStatusColor(order.status)}
                              size="small"
                              onClick={() => handleOpenStatusDialog(order)}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="Просмотреть детали">
                              <IconButton
                                component={RouterLink}
                                to={`/admin/orders/${order._id}`}
                                size="small"
                                color="primary"
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    {filteredOrders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          {searchTerm ? 'По вашему запросу ничего не найдено' : 'Нет заказов'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredOrders.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Строк на странице:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}–${to} из ${count}`
                }
              />
            </>
          )}
        </Paper>
      </Container>
      
      {/* Диалог изменения статуса */}
      <Dialog
        open={statusDialogOpen}
        onClose={handleCloseStatusDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Изменить статус заказа #{selectedOrder?._id.slice(-6)}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="status-select-label">Статус</InputLabel>
            <Select
              labelId="status-select-label"
              id="status-select"
              value={newStatus}
              label="Статус"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="pending">Ожидает</MenuItem>
              <MenuItem value="processing">Обработка</MenuItem>
              <MenuItem value="shipped">Отправлен</MenuItem>
              <MenuItem value="delivered">Доставлен</MenuItem>
              <MenuItem value="cancelled">Отменён</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog}>Отмена</Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Сохранить'}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminOrdersPage;