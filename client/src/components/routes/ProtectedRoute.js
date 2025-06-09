import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  // Если пользователь авторизован, показываем защищенный контент
  return children;
};

export default ProtectedRoute;      