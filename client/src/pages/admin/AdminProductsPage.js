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
  DialogContentText,
  DialogTitle,
  TextField,
  TablePagination,
  Chip,
  Tooltip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { 
  listProducts, 
  deleteProduct, 
  createProduct 
} from '../../features/products/productSlice';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminProductsPage = () => {
  const dispatch = useDispatch();
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  const { 
    products, 
    loading, 
    error, 
    success: productSuccess 
  } = useSelector((state) => state.products);
  
  // Загрузка списка товаров
  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);
  
  // Фильтрация товаров при изменении поискового запроса или списка товаров
  useEffect(() => {
    if (products) {
      if (searchTerm) {
        const lowercasedSearch = searchTerm.toLowerCase();
        setFilteredProducts(
          products.filter(
            (product) =>
              product.name.toLowerCase().includes(lowercasedSearch) ||
              product.description.toLowerCase().includes(lowercasedSearch) ||
              (product.category && product.category.name.toLowerCase().includes(lowercasedSearch))
          )
        );
      } else {
        setFilteredProducts(products);
      }
    }
  }, [searchTerm, products]);
  
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
  
  // Обработчики диалога удаления
  const handleOpenDeleteDialog = (product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedProduct(null);
  };
  
  // Удаление товара
  const handleDeleteProduct = () => {
    if (selectedProduct) {
      dispatch(deleteProduct(selectedProduct._id));
      handleCloseDeleteDialog();
    }
  };
  
  // Создание нового товара
  const handleCreateProduct = () => {
    dispatch(createProduct());
  };
  
  // Рассчет цены с учетом скидки
  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * discount / 100);
  };
  
  return (
    <AdminLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Управление товарами
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateProduct}
            disabled={loading}
          >
            Добавить товар
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {productSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Операция выполнена успешно
          </Alert>
        )}
        
        {/* Поиск */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <TextField
              variant="outlined"
              size="small"
              placeholder="Поиск товаров..."
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
        
        {/* Таблица товаров */}
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
                      <TableCell>Изображение</TableCell>
                      <TableCell>Название</TableCell>
                      <TableCell>Категория</TableCell>
                      <TableCell align="right">Цена</TableCell>
                      <TableCell align="center">Наличие</TableCell>
                      <TableCell align="center">Рекомендуемый</TableCell>
                      <TableCell align="center">Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProducts
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((product) => (
                        <TableRow key={product._id}>
                          <TableCell>
                            <Box
                              component="img"
                              src={product.images[0]}
                              alt={product.name}
                              sx={{
                                width: 50,
                                height: 50,
                                objectFit: 'contain',
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {product.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {product._id}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {product.category ? product.category.name : 'Без категории'}
                          </TableCell>
                          <TableCell align="right">
                            {product.discount > 0 ? (
                              <Box>
                                <Typography variant="body2" color="error" fontWeight="bold">
                                  {calculateDiscountedPrice(product.price, product.discount).toLocaleString()} ₽
                                </Typography>
                                <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                                  {product.price.toLocaleString()} ₽
                                </Typography>
                              </Box>
                            ) : (
                              <Typography variant="body2">
                                {product.price.toLocaleString()} ₽
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={product.inStock ? 'В наличии' : 'Нет в наличии'}
                              color={product.inStock ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={product.featured ? 'Да' : 'Нет'}
                              color={product.featured ? 'primary' : 'default'}
                              size="small"
                              variant={product.featured ? 'filled' : 'outlined'}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="Редактировать">
                              <IconButton
                                component={RouterLink}
                                to={`/admin/products/${product._id}/edit`}
                                size="small"
                                color="primary"
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Удалить">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleOpenDeleteDialog(product)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    {filteredProducts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          {searchTerm ? 'По вашему запросу ничего не найдено' : 'Нет товаров'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredProducts.length}
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
      
      {/* Диалог подтверждения удаления */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Подтверждение удаления
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Вы действительно хотите удалить товар "{selectedProduct?.name}"?
            Это действие нельзя будет отменить.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Отмена</Button>
          <Button
            onClick={handleDeleteProduct}
            color="error"
            autoFocus
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminProductsPage;