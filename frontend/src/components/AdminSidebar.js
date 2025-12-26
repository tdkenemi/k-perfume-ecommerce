// src/components/AdminSidebar.js
import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { 
    FaTachometerAlt, 
    FaBoxOpen, 
    FaUsers, 
    FaClipboardList, 
    FaHome,
    FaPen
} from 'react-icons/fa';

const AdminSidebar = () => {
    return (
        // Thêm class 'text-white' để chữ trong Nav.Link màu trắng
        <Nav className="flex-column" variant="dark" style={{ minHeight: '100vh' }}>
            <h4 className="text-white text-center my-3">K-perfume Admin</h4>
            <hr className="bg-light" />
            
            <LinkContainer to="/admin/dashboard">
                <Nav.Link className="admin-nav-link">
                    <FaTachometerAlt className="me-2" /> Dashboard
                </Nav.Link>
            </LinkContainer>
            
            <LinkContainer to="/admin/productlist">
                <Nav.Link className="admin-nav-link">
                    <FaBoxOpen className="me-2" /> QL Sản phẩm
                </Nav.Link>
            </LinkContainer>
            
            <LinkContainer to="/admin/orderlist">
                <Nav.Link className="admin-nav-link">
                    <FaClipboardList className="me-2" /> QL Đơn hàng
                </Nav.Link>
            </LinkContainer>

            <LinkContainer to="/admin/userlist">
                <Nav.Link className="admin-nav-link">
                    <FaUsers className="me-2" /> QL Người dùng
                </Nav.Link>
            </LinkContainer>
            
            <LinkContainer to="/admin/postlist">
                <Nav.Link className="admin-nav-link">
                    <FaPen className="me-2" /> QL Bài viết
                </Nav.Link>
            </LinkContainer>

            <Nav.Link disabled><hr className="bg-light my-1" /></Nav.Link>

            {/* Nút trở về trang chủ bạn yêu cầu */}
            <LinkContainer to="/">
                <Nav.Link className="admin-nav-link">
                    <FaHome className="me-2" /> Về Trang chủ
                </Nav.Link>
            </LinkContainer>
        </Nav>
    );
};

export default AdminSidebar;