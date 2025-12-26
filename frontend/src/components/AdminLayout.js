// src/components/AdminLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css'; // Chúng ta sẽ tạo file CSS này ngay sau đây

const AdminLayout = () => {
    return (
        <div className="admin-wrapper">
            {/* 1. Thanh Sidebar Cố định */}
            <div className="admin-sidebar">
                <AdminSidebar />
            </div>

            {/* 2. Nội dung chính (sẽ là ProductListScreen, OrderListScreen...) */}
            <div className="admin-content">
                <Container fluid className="p-4">
                    {/* Outlet sẽ render component con (ProductListScreen, v.v.) */}
                    <Outlet /> 
                </Container>
            </div>
        </div>
    );
};

export default AdminLayout;