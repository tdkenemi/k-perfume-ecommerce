// src/screens/UserEditScreen.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';

const UserEditScreen = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [errorUpdate, setErrorUpdate] = useState(null);

  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        
        // === SỬA LỖI API: Bỏ http://localhost:5000 ===
        const { data } = await axios.get(`/api/users/${userId}`, config);
        // === HẾT SỬA LỖI ===
        
        setName(data.name);
        setEmail(data.email);
        setIsAdmin(data.isAdmin);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, userInfo.token]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoadingUpdate(true);
      setErrorUpdate(null);
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // === SỬA LỖI API: Bỏ http://localhost:5000 ===
      await axios.put(
        `/api/users/${userId}`,
        { name, email, isAdmin },
        config
      );
      // === HẾT SỬA LỖI ===
      
      setLoadingUpdate(false);
      alert('Đã cập nhật người dùng thành công!');
      navigate('/admin/userlist');
    } catch (err) {
      setErrorUpdate(err.response?.data?.message || err.message);
      setLoadingUpdate(false);
    }
  };

  return (
    // Bỏ <Container> vì AdminLayout đã có Col
    <>
      <Link to="/admin/userlist" className="btn btn-light my-3">
        <FaArrowLeft className="me-2" /> Quay lại
      </Link>
      <Row className="justify-content-md-center">
        <Col md={8}> {/* Tăng độ rộng form */}
          <h1 className="my-4">Chỉnh sửa Người dùng</h1>
          {loadingUpdate && <Loader />}
          {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
          
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <Form onSubmit={submitHandler} className="bg-white p-4 rounded shadow-sm">
              <Form.Group controlId="name" className="mb-3">
                <Form.Label>Tên</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập tên"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Nhập email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="isadmin" className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Là Quản trị viên (Admin)"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                ></Form.Check>
              </Form.Group>

              <Button type="submit" variant="primary" className="mt-3">
                <FaSave className="me-2" /> Cập nhật
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </>
  );
};

export default UserEditScreen;