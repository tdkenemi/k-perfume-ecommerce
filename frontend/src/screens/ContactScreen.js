import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Breadcrumb } from 'react-bootstrap';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';

const ContactScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    // Xử lý logic gửi form (gọi API) ở đây
    alert('Cảm ơn bạn đã liên hệ K-perfume! Chúng tôi sẽ phản hồi sớm.');
  };

  return (
    <Container className="py-4">
      {/* Breadcrumb - Thanh điều hướng */}
      <Breadcrumb className="bg-transparent p-0 mb-4">
        <LinkContainer to="/">
          <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active>Liên hệ</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="mb-5">
        {/* CỘT TRÁI: THÔNG TIN LIÊN HỆ */}
        <Col md={5} className="mb-4">
          <h4 className="text-uppercase mb-4 fw-bold" style={{ color: '#555' }}>Liên hệ</h4>
          
          <div className="d-flex mb-4">
            <div className="me-3 mt-1" style={{ color: '#165c3e' }}>
              <FaMapMarkerAlt size={20} />
            </div>
            <div>
              <strong>Địa chỉ K-perfume:</strong>
              <p className="text-muted mb-0">
                {/* BẠN SỬA ĐỊA CHỈ CỦA BẠN Ở DÒNG DƯỚI */}
                Số 123 Đường Nguyễn Tất Thành, Quận 4, TP. Hồ Chí Minh
              </p>
            </div>
          </div>

          <div className="d-flex mb-4">
            <div className="me-3 mt-1" style={{ color: '#165c3e' }}>
              <FaPhoneAlt size={20} />
            </div>
            <div>
              <strong>Điện thoại:</strong>
              <p className="text-muted mb-0">
                 {/* BẠN SỬA SỐ ĐIỆN THOẠI Ở DÒNG DƯỚI */}
                0901.234.567
              </p>
            </div>
          </div>

          <div className="d-flex mb-4">
            <div className="me-3 mt-1" style={{ color: '#165c3e' }}>
              <FaEnvelope size={20} />
            </div>
            <div>
              <strong>Email:</strong>
              <p className="text-muted mb-0">
                 {/* BẠN SỬA EMAIL Ở DÒNG DƯỚI */}
                support@kperfume.vn
              </p>
            </div>
          </div>
        </Col>

        {/* CỘT PHẢI: FORM GỬI THÔNG TIN */}
        <Col md={7}>
          <h4 className="text-uppercase mb-3 fw-bold" style={{ color: '#555' }}>Gửi thông tin</h4>
          <p className="text-muted small mb-4">
            Bạn hãy điền nội dung tin nhắn vào form dưới đây và gửi cho K-perfume. 
            Chúng tôi sẽ trả lời bạn ngay sau khi nhận được.
          </p>
          
          <Form onSubmit={submitHandler}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label className="fw-bold small">Họ tên <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Nhập họ tên..." 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-0"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label className="fw-bold small">Email <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="Nhập email..." 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-0"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4" controlId="content">
              <Form.Label className="fw-bold small">Nội dung <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                as="textarea" 
                rows={5} 
                placeholder="Nhập nội dung liên hệ..." 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="rounded-0"
                required
              />
            </Form.Group>

            <Button 
              type="submit" 
              className="px-4 py-2 text-uppercase fw-bold rounded-0 border-0" 
              style={{ backgroundColor: '#165c3e' }}
            >
              Gửi tin nhắn
            </Button>
          </Form>
        </Col>
      </Row>

      {/* BẢN ĐỒ GOOGLE MAPS */}
      <Row>
        <Col xs={12}>
          <div className="border p-1">
            {/* Bạn có thể thay link src bên dưới bằng link Google Maps địa chỉ thật của bạn */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.669726937899!2d106.6822528147488!3d10.759917092332762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1b7c3ed289%3A0xa1118a88bf9d0d5!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBOZ3V54buFbiBU4bqldCBUaMOgbmggLSBDxqEgc-G7nyBRdeG6rW4gNA!5e0!3m2!1svi!2s!4v1680000000000!5m2!1svi!2s" 
              width="100%" 
              height="400" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="K-perfume Location"
            ></iframe>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactScreen;