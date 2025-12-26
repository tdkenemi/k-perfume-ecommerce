// src/components/CheckoutSteps.js
import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaUserCheck, FaMapMarkedAlt, FaCreditCard, FaClipboardCheck } from 'react-icons/fa';

// step1, step2... là các props (true/false) để biết bước nào đã hoàn thành
const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <Nav className="justify-content-center mb-4">
      {/* Bước 1: Đăng nhập */}
      <Nav.Item>
        {step1 ? (
          <LinkContainer to="/login">
            <Nav.Link className="text-success">
              <FaUserCheck className="me-1" /> Đã đăng nhập
            </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>
            <FaUserCheck className="me-1" /> Đăng nhập
          </Nav.Link>
        )}
      </Nav.Item>

      {/* Bước 2: Địa chỉ */}
      <Nav.Item>
        {step2 ? (
          <LinkContainer to="/shipping">
            <Nav.Link>
              <FaMapMarkedAlt className="me-1" /> Địa chỉ
            </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>
            <FaMapMarkedAlt className="me-1" /> Địa chỉ
          </Nav.Link>
        )}
      </Nav.Item>

      {/* Bước 3: Thanh toán */}
      <Nav.Item>
        {step3 ? (
          <LinkContainer to="/payment">
            <Nav.Link>
              <FaCreditCard className="me-1" /> Thanh toán
            </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>
            <FaCreditCard className="me-1" /> Thanh toán
          </Nav.Link>
        )}
      </Nav.Item>

      {/* Bước 4: Đặt hàng */}
      <Nav.Item>
        {step4 ? (
          <LinkContainer to="/placeorder">
            <Nav.Link>
              <FaClipboardCheck className="me-1" /> Đặt hàng
            </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>
            <FaClipboardCheck className="me-1" /> Đặt hàng
          </Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutSteps;