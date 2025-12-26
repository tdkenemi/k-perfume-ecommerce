import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col, InputGroup } from 'react-bootstrap';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'; // Thêm icon Eye
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // --- State kiểm soát ẩn hiện mật khẩu ---
  const [showPassword, setShowPassword] = useState(false); 

  const navigate = useNavigate();
  const { search } = useLocation();
  const { login, loading, error, userInfo } = useContext(AuthContext);
  const redirect = search ? search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [navigate, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <FormContainer>
      <h1 className="text-center mb-4"><FaEnvelope className="me-2"/> Đăng nhập</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      
      <Form onSubmit={submitHandler}>
        <Form.Group className="my-3" controlId="email">
          <Form.Label>Địa chỉ Email</Form.Label>
          <InputGroup>
            <InputGroup.Text><FaEnvelope /></InputGroup.Text>
            <Form.Control
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="my-3" controlId="password">
          <Form.Label>Mật khẩu</Form.Label>
          <InputGroup>
            <InputGroup.Text><FaLock /></InputGroup.Text>
            
            {/* --- Ô NHẬP MẬT KHẨU --- */}
            <Form.Control
              type={showPassword ? 'text' : 'password'} // Đổi loại ô nhập
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            {/* --- NÚT CON MẮT --- */}
            <Button 
                variant="outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                style={{borderColor: '#ced4da'}}
            >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
            </Button>
            {/* ------------------- */}
          </InputGroup>
        </Form.Group>

        <Button type="submit" variant="primary" disabled={loading} className="w-100 mt-3">
          Đăng nhập
        </Button>
      </Form>

      <div className="text-end mt-2">
         <Link to="/forgot-password" style={{fontSize: '0.9rem', color: '#165c3e'}}>
            Quên mật khẩu?
         </Link>
      </div>

      <Row className="py-3 text-center">
        <Col>
          Chưa có tài khoản?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="fw-bold">
            Đăng ký ngay
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;