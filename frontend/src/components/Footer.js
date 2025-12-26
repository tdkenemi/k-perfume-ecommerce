import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#113a2f', color: '#fff', paddingTop: '60px', paddingBottom: '20px', marginTop: 'auto' }}>
      <Container>
        <Row className="mb-5">
          {/* CỘT 1: VỀ K-PERFUME */}
          <Col md={3} sm={6} className="mb-4">
            <h5 className="text-uppercase fw-bold mb-3">Về K-Perfume</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/about" className="text-white text-decoration-none opacity-75 hover-opacity-100">Giới thiệu</Link></li>
              <li className="mb-2"><Link to="/products/all" className="text-white text-decoration-none opacity-75 hover-opacity-100">Sản phẩm</Link></li>
              <li className="mb-2"><Link to="/blog" className="text-white text-decoration-none opacity-75 hover-opacity-100">Blog</Link></li>
              <li className="mb-2"><Link to="/contact" className="text-white text-decoration-none opacity-75 hover-opacity-100">Liên hệ</Link></li>
            </ul>
          </Col>

          {/* CỘT 2: HƯỚNG DẪN */}
          <Col md={3} sm={6} className="mb-4">
            <h5 className="text-uppercase fw-bold mb-3">Hướng dẫn</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="#" className="text-white text-decoration-none opacity-75 hover-opacity-100">Hướng dẫn thanh toán</Link></li>
              <li className="mb-2"><Link to="#" className="text-white text-decoration-none opacity-75 hover-opacity-100">Hướng dẫn giao hàng</Link></li>
              <li className="mb-2"><Link to="#" className="text-white text-decoration-none opacity-75 hover-opacity-100">Điều khoản sử dụng</Link></li>
            </ul>
          </Col>

          {/* CỘT 3: CHÍNH SÁCH */}
          <Col md={3} sm={6} className="mb-4">
            <h5 className="text-uppercase fw-bold mb-3">Chính sách</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="#" className="text-white text-decoration-none opacity-75 hover-opacity-100">Chính sách bảo mật</Link></li>
              <li className="mb-2"><Link to="#" className="text-white text-decoration-none opacity-75 hover-opacity-100">Chính sách giao hàng</Link></li>
              <li className="mb-2"><Link to="#" className="text-white text-decoration-none opacity-75 hover-opacity-100">Chính sách đổi trả</Link></li>
            </ul>
          </Col>

          {/* CỘT 4: THÔNG TIN LIÊN HỆ */}
          <Col md={3} sm={6} className="mb-4">
            <h5 className="text-uppercase fw-bold mb-3">Thông tin liên hệ</h5>
            <p className="opacity-75 mb-2">Hộ Kinh doanh K-perfume</p>
            <p className="opacity-75 mb-2"><FaMapMarkerAlt className="me-2"/> 123 Đường Nguyễn Tất Thành, Q.4, TP.HCM</p>
            <p className="opacity-75 mb-2"><FaPhoneAlt className="me-2"/> 0987.654.321</p>
            <p className="opacity-75 mb-2"><FaEnvelope className="me-2"/> support@kperfume.com</p>
          </Col>
        </Row>

        <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

        <Row className="align-items-center py-3">
          {/* PHƯƠNG THỨC THANH TOÁN */}
          <Col md={4} className="mb-3 mb-md-0">
            <h6 className="text-uppercase fw-bold mb-2 small">Phương thức thanh toán</h6>
            <div className="d-flex gap-2">
                {/* Dùng link ảnh online để hiển thị ngay */}
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" style={{ height: '30px', backgroundColor: '#fff', padding: '2px', borderRadius: '4px' }} />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" style={{ height: '30px', backgroundColor: '#fff', padding: '2px', borderRadius: '4px' }} />
                <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="Momo" style={{ height: '30px', backgroundColor: '#fff', padding: '2px', borderRadius: '4px' }} />
            </div>
          </Col>

          {/* KẾT NỐI MẠNG XÃ HỘI */}
          <Col md={4} className="text-center mb-3 mb-md-0">
            <h6 className="text-uppercase fw-bold mb-2 small">Kết nối với chúng tôi</h6>
            <div className="d-flex justify-content-center gap-3">
               <a href="#" className="text-white fs-5"><FaFacebookF /></a>
               <a href="#" className="text-white fs-5"><FaInstagram /></a>
               <a href="#" className="text-white fs-5"><FaYoutube /></a>
               <a href="#" className="text-white fs-5"><FaTiktok /></a>
            </div>
          </Col>

          {/* CHỨNG NHẬN (DMCA & BỘ CÔNG THƯƠNG) */}
          <Col md={4} className="text-md-end">
             <div className="d-flex justify-content-md-end gap-2">
                <img src="https://images.dmca.com/Badges/dmca_protected_sml_120n.png?ID=49626064-26db-4298-842d-206775747656" alt="DMCA.com Protection Status" style={{height: '30px'}} />
                <img src="https://webmedia.com.vn/images/2021/09/logo-da-thong-bao-bo-cong-thuong-mau-xanh.png" alt="Đã thông báo bộ công thương" style={{height: '30px'}} />
             </div>
          </Col>
        </Row>

        {/* COPYRIGHT */}
        <Row>
            <Col className="text-center mt-3 small opacity-50">
                &copy; {new Date().getFullYear()} K-perfume. Bản quyền thuộc về Hộ kinh doanh K-perfume.
            </Col>
        </Row>
      </Container>
      
      {/* CSS Hiệu ứng hover */}
      <style>{`
        .hover-opacity-100:hover { opacity: 1 !important; text-decoration: underline !important; }
      `}</style>
    </footer>
  );
};

export default Footer;