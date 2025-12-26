import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom'; // useParams để lấy token từ URL
import { FaLock, FaKey, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import FormContainer from '../components/FormContainer';
import Message from '../components/Message';
import Loader from '../components/Loader';

const ResetPasswordScreen = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false); // Để hiện nút đăng nhập khi thành công

  const { token } = useParams(); // Lấy token từ URL
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Gọi API đặt lại mật khẩu kèm token
      await axios.put(`/api/users/resetpassword/${token}`, { password }, config);

      setSuccess(true);
      setLoading(false);
      // Tự động chuyển về trang login sau 3 giây (tuỳ chọn)
      setTimeout(() => { navigate('/login') }, 3000);

    } catch (error) {
      setError(error.response && error.response.data.message
        ? error.response.data.message
        : error.message);
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <div className="text-center mb-4">
        <h2 className="fw-bold text-uppercase" style={{color: '#165c3e'}}>Đặt lại mật khẩu</h2>
        <p className="text-muted">Vui lòng nhập mật khẩu mới của bạn.</p>
      </div>

      {message && <Message variant="danger">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {success && <Message variant="success">Thành công! Đang chuyển về trang đăng nhập...</Message>}
      {loading && <Loader />}

      {!success ? (
        <Form onSubmit={submitHandler}>
            <Form.Group controlId="password" className="mb-3">
            <Form.Label>Mật khẩu mới</Form.Label>
            <InputGroup>
                <InputGroup.Text className="bg-light"><FaKey /></InputGroup.Text>
                <Form.Control
                    type="password"
                    placeholder="Nhập mật khẩu mới"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </InputGroup>
            </Form.Group>

            <Form.Group controlId="confirmPassword" className="mb-4">
            <Form.Label>Xác nhận mật khẩu</Form.Label>
            <InputGroup>
                <InputGroup.Text className="bg-light"><FaLock /></InputGroup.Text>
                <Form.Control
                    type="password"
                    placeholder="Nhập lại mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </InputGroup>
            </Form.Group>

            <Button 
                type="submit" 
                variant="primary" 
                className="w-100 py-2 fw-bold text-uppercase border-0"
                style={{backgroundColor: '#165c3e'}}
            >
            <FaCheckCircle className="me-2" /> Cập nhật mật khẩu
            </Button>
        </Form>
      ) : (
          <div className="text-center">
              <Link to="/login" className="btn btn-primary w-100">Đăng nhập ngay</Link>
          </div>
      )}
    </FormContainer>
  );
};

export default ResetPasswordScreen;