// src/components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { userInfo } = useContext(AuthContext);

  // Kiểm tra: Nếu có userInfo, cho phép truy cập (hiển thị <Outlet/>)
  // Nếu không, chuyển hướng về trang /login
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;