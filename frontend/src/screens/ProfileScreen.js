import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Row, Col, Table, Container, Card, Image, Alert } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaUser, FaHistory, FaCheck, FaTimes, FaEdit,  } from 'react-icons/fa';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  
  // State cho danh sách đơn hàng
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const { userInfo, updateProfile, loading, error, success } = useContext(AuthContext);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      fetchMyOrders();
    }
  }, [userInfo]);

  // Hàm lấy danh sách đơn hàng của tôi
  const fetchMyOrders = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.get('/api/orders/myorders', config);
      setOrders(data);
      setLoadingOrders(false);
    } catch (error) {
      console.error(error);
      setLoadingOrders(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Mật khẩu xác nhận không khớp');
    } else {
      updateProfile({ id: userInfo._id, name, email, password });
      setMessage(null);
    }
  };

  return (
    <Container className="py-5">
      <Row>
        {/* === CỘT TRÁI: THÔNG TIN CÁ NHÂN === */}
        <Col md={4} className="mb-4">
          <Card className="border-0 shadow-sm rounded-3">
            <Card.Header className="bg-white border-bottom-0 text-center pt-4">
                <div className="position-relative d-inline-block">
                    {/* Avatar giả lập */}
                    <Image 
                        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                        roundedCircle 
                        style={{ width: '100px', height: '100px', border: '3px solid #165c3e' }} 
                    />
                </div>
                <h5 className="mt-3 fw-bold">{userInfo?.name}</h5>
                <p className="text-muted small">{userInfo?.email}</p>
            </Card.Header>
            <Card.Body>
                <h6 className="fw-bold text-uppercase mb-3" style={{color: '#165c3e'}}>
                    <FaUser className="me-2"/> Cập nhật thông tin
                </h6>
                
                {message && <Message variant="danger">{message}</Message>}
                {error && <Message variant="danger">{error}</Message>}
                {success && <Message variant="success">Cập nhật thành công!</Message>}
                {loading && <Loader />}

                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="name" className="mb-3">
                        <Form.Label className="small fw-bold">Tên hiển thị</Form.Label>
                        <Form.Control 
                            type="name" 
                            placeholder="Nhập tên" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </Form.Group>

                    <Form.Group controlId="email" className="mb-3">
                        <Form.Label className="small fw-bold">Email</Form.Label>
                        <Form.Control 
                            type="email" 
                            placeholder="Nhập email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </Form.Group>

                    <Form.Group controlId="password" classname="mb-3">
                        <Form.Label className="small fw-bold">Mật khẩu mới</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Để trống nếu không đổi" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </Form.Group>

                    <Form.Group controlId="confirmPassword" classname="mb-4">
                        <Form.Label className="small fw-bold">Xác nhận mật khẩu</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Nhập lại mật khẩu mới" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                        />
                    </Form.Group>

                    <Button type="submit" className="w-100 fw-bold border-0" style={{backgroundColor: '#165c3e'}}>
                        <FaEdit className="me-2" /> CẬP NHẬT
                    </Button>
                </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* === CỘT PHẢI: LỊCH SỬ ĐƠN HÀNG === */}
        <Col md={8}>
            <Card className="border-0 shadow-sm rounded-3">
                <Card.Header className="bg-white py-3 border-bottom">
                    <h5 className="m-0 fw-bold text-uppercase" style={{color: '#165c3e'}}>
                        <FaHistory className="me-2"/> Đơn hàng của tôi
                    </h5>
                </Card.Header>
                <Card.Body className="p-0">
                    {loadingOrders ? (
                        <Loader />
                    ) : orders.length === 0 ? (
                        <Alert variant="info" className="m-3">Bạn chưa có đơn hàng nào.</Alert>
                    ) : (
                        <Table striped hover responsive className="table-borderless mb-0 align-middle">
                            <thead className="bg-light text-muted small">
                                <tr>
                                    <th className="ps-3">ID ĐƠN</th>
                                    <th>NGÀY ĐẶT</th>
                                    <th>TỔNG TIỀN</th>
                                    <th className="text-center">THANH TOÁN</th>
                                    <th className="text-center">GIAO HÀNG</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <td className="ps-3 fw-bold text-dark">#{order._id.substring(0, 10)}...</td>
                                        <td>{order.createdAt.substring(0, 10)}</td>
                                        <td className="fw-bold">{order.totalPrice.toLocaleString('vi-VN')}₫</td>
                                        <td className="text-center">
                                            {order.isPaid ? (
                                                <div className="text-success small fw-bold">
                                                    <FaCheck className="me-1"/> {order.paidAt.substring(0, 10)}
                                                </div>
                                            ) : (
                                                <FaTimes style={{ color: 'red' }} />
                                            )}
                                        </td>
                                        <td className="text-center">
                                            {order.isDelivered ? (
                                                <div className="text-success small fw-bold">
                                                    <FaCheck className="me-1"/> {order.deliveredAt.substring(0, 10)}
                                                </div>
                                            ) : (
                                                <FaTimes style={{ color: 'red' }} />
                                            )}
                                        </td>
                                        <td className="text-end pe-3">
                                            <LinkContainer to={`/order/${order._id}`}>
                                                <Button variant="outline-dark" size="sm" className="rounded-pill px-3">
                                                    Chi tiết
                                                </Button>
                                            </LinkContainer>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileScreen;