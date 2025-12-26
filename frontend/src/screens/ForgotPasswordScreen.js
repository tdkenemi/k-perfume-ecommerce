import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';
import FormContainer from '../components/FormContainer';
import Message from '../components/Message';
import Loader from '../components/Loader';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null); // Thông báo thành công
  const [error, setError] = useState(null);     // Thông báo lỗi
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Gọi API gửi mail
      const { data } = await axios.post('/api/users/forgotpassword', { email }, config);
      
      setMessage(data.data); // "Email đã được gửi!"
      setLoading(false);
    } catch (error) {
      setError(error.response && error.response.data.message
        ? error.response.data.message
        : error.message);
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <Link to="/login" className="btn btn-light my-3 border rounded-pill px-4">
         <FaArrowLeft className="me-2" /> Quay lại Đăng nhập
      </Link>

      <div className="text-center mb-4">
        <h2 className="fw-bold text-uppercase" style={{color: '#165c3e'}}>Quên mật khẩu</h2>
        <p className="text-muted">Nhập email của bạn, chúng tôi sẽ gửi link khôi phục.</p>
      </div>

      {message && <Message variant="success">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}

      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email" className="mb-4">
          <Form.Label className="fw-bold">Địa chỉ Email đã đăng ký</Form.Label>
          <InputGroup>
             <InputGroup.Text className="bg-light"><FaEnvelope /></InputGroup.Text>
             <Form.Control
                type="email"
                placeholder="nguoidung@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="py-2"
             />
          </InputGroup>
        </Form.Group>

        <Button 
            type="submit" 
            variant="primary" 
            className="w-100 py-2 fw-bold text-uppercase border-0"
            disabled={loading}
            style={{backgroundColor: '#165c3e'}}
        >
          <FaPaperPlane className="me-2" /> Gửi yêu cầu
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ForgotPasswordScreen;