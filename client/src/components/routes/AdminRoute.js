import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);

  // Если пользователь не авторизован или не является администратором, перенаправляем на главную страницу
  if (!userInfo || userInfo.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Если пользователь является администратором, показываем защищенный контент
  return children;
};

export default AdminRoute; 
 