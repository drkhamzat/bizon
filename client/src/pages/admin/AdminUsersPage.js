import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminUsersPage = () => {
  const dispatch = useDispatch();
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Временные данные для демонстрации
  const [users, setUsers] = useState([
    {
      _id: '1',
      name: 'Иван Иванов',
      email: 'ivan@example.com',
      role: 'user',
      createdAt: '2023-01-15T10:30:00Z',
    },
    {
      _id: '2',
      name: 'Петр Петров',
      email: 'petr@example.com',
      role: 'user',
      createdAt: '2023-02-20T14:45:00Z',
    },
    {
      _id: '3',
      name: 'Анна Сидорова',
      email: 'anna@example.com',
      role: 'admin',
      createdAt: '2023-03-10T09:15:00Z',
    },
    {
      _id: '4',
      name: 'Мария Кузнецова',
      email: 'maria@example.com',
      role: 'user',
      createdAt: '2023-04-05T16:20:00Z',
    },
    {
      _id: '5',
      name: 'Алексей Смирнов',
      email: 'alexey@example.com',
      role: 'user',
      createdAt: '2023-05-12T11:10:00Z',
    },
  ]);
  
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Фильтрация пользователей при изменении поискового запроса
  useEffect(() => {
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      setFilteredUsers(
        users.filter(
          (user) =>
            user.name.toLowerCase().includes(lowercasedSearch) ||
            user.email.toLowerCase().includes(lowercasedSearch)
        )
      );
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);
  
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
  const handleOpenDeleteDialog = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };
  
  // Удаление пользователя (заглушка)
  const handleDeleteUser = () => {
    if (selectedUser) {
      // Имитация удаления пользователя
      setUsers(users.filter(user => user._id !== selectedUser._id));
      handleCloseDeleteDialog();
    }
  };
  
  // Форматирование даты
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };
  
  return (
    <AdminLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Управление пользователями
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {/* Поиск */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <TextField
              variant="outlined"
              size="small"
              placeholder="Поиск пользователей..."
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
        
        {/* Таблица пользователей */}
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
                      <TableCell>ID</TableCell>
                      <TableCell>Имя</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell align="center">Роль</TableCell>
                      <TableCell>Дата регистрации</TableCell>
                      <TableCell align="center">Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((user) => (
                        <TableRow key={user._id}>
                          <TableCell>
                            <Typography variant="caption" color="text.secondary">
                              {user._id}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {user.name}
                            </Typography>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell align="center">
                            <Chip
                              label={user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                              color={user.role === 'admin' ? 'primary' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{formatDate(user.createdAt)}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="Редактировать">
                              <IconButton
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
                                onClick={() => handleOpenDeleteDialog(user)}
                                disabled={user.role === 'admin'} // Запрет удаления администраторов
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    {filteredUsers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          {searchTerm ? 'По вашему запросу ничего не найдено' : 'Нет пользователей'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredUsers.length}
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
            Вы действительно хотите удалить пользователя "{selectedUser?.name}"?
            Это действие нельзя будет отменить.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Отмена</Button>
          <Button
            onClick={handleDeleteUser}
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

export default AdminUsersPage;