// src/components/AdminHeader.js
import React, { useContext } from 'react';
import { Navbar, Nav, NavDropdown, Form, Button } from 'react-bootstrap';
import { FaSignOutAlt, FaUserCircle, FaSearch } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const AdminHeader = () => {
  const { userInfo, logout } = useContext(AuthContext);

  const logoutHandler = () => {
    logout();
    // (Không cần navigate vì AdminRoute sẽ tự động "đá" về /login)
  };

  return (
    <Navbar className="admin-header" expand="lg">
      {/* (Chúng ta có thể thêm nút bật/tắt sidebar ở đây sau) */}
      <Nav className="ms-auto align-items-center">
        <Form className="d-flex me-3">
          <Form.Control
            type="search"
            placeholder="Tìm kiếm..."
            className="me-2"
            aria-label="Search"
          />
          <Button variant="outline-success"><FaSearch /></Button>
        </Form>
        <FaUserCircle size="1.5em" className="me-2" />
        <NavDropdown title={userInfo.name} id="admin-user-menu">
          <NavDropdown.Item onClick={logoutHandler}>
            <FaSignOutAlt className="me-2" /> Đăng xuất
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </Navbar>
  );
};

export default AdminHeader;