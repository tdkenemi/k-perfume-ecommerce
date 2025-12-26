// src/screens/ShippingScreen.js
import React, { useState, useContext } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCity, FaMailBulk, FaGlobe } from 'react-icons/fa';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { CartContext } from '../context/CartContext';

const ShippingScreen = () => {
  const { state, dispatch } = useContext(CartContext);
  const { shippingAddress } = state; // Lấy địa chỉ đã lưu (nếu có)
  const navigate = useNavigate();

  // 1. Khởi tạo state với dữ liệu đã lưu trong context
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  const submitHandler = (e) => {
    e.preventDefault();
    // 2. Dispatch action để LƯU địa chỉ vào Context
    dispatch({
      type: 'CART_SAVE_SHIPPING_ADDRESS',
      payload: { address, city, postalCode, country },
    });
    // 3. Chuyển hướng tới trang Payment
    navigate('/payment');
  };

  return (
    <FormContainer>
      {/* Hiển thị các bước, active bước 1 và 2 */}
      <CheckoutSteps step1 step2 />
      
     <h1><FaMapMarkerAlt className="me-2" />Địa chỉ Giao hàng</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="my-3" controlId="address">
          <Form.Label>Địa chỉ</Form.Label>
          <InputGroup>
            <InputGroup.Text><FaMapMarkerAlt /></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Nhập địa chỉ"
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Form.Group>

        <Form.Group className="my-3" controlId="city">
          <Form.Label>Thành phố</Form.Label>
          <InputGroup>
            <InputGroup.Text><FaCity /></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Nhập thành phố"
              value={city}
              required
              onChange={(e) => setCity(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Form.Group>

        <Form.Group className="my-3" controlId="postalCode">
          <Form.Label>Mã bưu điện (Postal Code)</Form.Label>
          <InputGroup>
            <InputGroup.Text><FaMailBulk /></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Nhập mã bưu điện"
              value={postalCode}
              required
              onChange={(e) => setPostalCode(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Form.Group>

        <Form.Group className="my-3" controlId="country">
          <Form.Label>Quốc gia</Form.Label>
          <InputGroup>
            <InputGroup.Text><FaGlobe /></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Nhập quốc gia"
              value={country}
              required
              onChange={(e) => setCountry(e.target.value)}
            ></Form.Control>
          </InputGroup>
        </Form.Group>

        <div className="d-grid">
          <Button type="submit" variant="primary">
            Tiếp tục
          </Button>
        </div>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;