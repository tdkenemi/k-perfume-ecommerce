// src/components/AdminRoute.js (ĐÃ SỬA LỖI)
import React, { useContext } from 'react';
// 1. Xóa 'Outlet' vì không dùng ở đây
import { Navigate } from 'react-router-dom'; 
import { AuthContext } from '../context/AuthContext';
import Loader from './Loader'; 

// 2. Thay đổi để nhận 'children' (chính là <AdminLayout />)
const AdminRoute = ({ children }) => {
  const { userInfo, loading } = useContext(AuthContext);

  if (loading) {
    return <Loader />;
  }

  return userInfo && userInfo.isAdmin ? (
    // 3. Hiển thị 'children' (AdminLayout) nếu là admin
    children 
  ) : (
    <Navigate to="/login" replace />
  );
};

export default AdminRoute;