import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button, Badge, Container, Modal, Form } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { FaUser, FaTruck, FaMoneyBillWave, FaBoxOpen, FaMapMarkerAlt, FaTimes, FaQrcode, FaExpand, FaUndo, FaCheckCircle, FaHome } from 'react-icons/fa'; // Import thêm icon

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Lưu nội dung lỗi
  const [isCancelledState, setIsCancelledState] = useState(false); // State kiểm tra đã hủy chưa
  
  const [showQRModal, setShowQRModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  const BANK_ID = 'MB'; 
  const ACCOUNT_NO = '0987654321'; 
  const ACCOUNT_NAME = 'NGUYEN VAN A'; 

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(`/api/orders/${orderId}`, config);
        setOrder(data);
        setLoading(false);

        if (data.paymentMethod === 'QRCode' && !data.isPaid) {
            setShowQRModal(true);
        }
      } catch (err) {
        // --- LOGIC MỚI: KIỂM TRA NẾU ĐƠN BỊ XÓA (404) ---
        // Nếu lỗi là 404 -> Nghĩa là đơn đã bị hủy/xóa (hoàn tiền xong)
        if (err.response && err.response.status === 404) {
            setIsCancelledState(true);
        } else {
            setError(err.response?.data?.message || err.message);
        }
        setLoading(false);
        // ------------------------------------------------
      }
    };

    if (!order || order._id !== orderId) fetchOrder();
  }, [orderId, order, userInfo]);

  const successPaymentHandler = async () => {
    try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.put(`/api/orders/${orderId}/pay`, {}, config);
        window.location.reload();
    } catch (error) { alert('Lỗi cập nhật thanh toán'); }
  };

  const deliverHandler = async () => {
    try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.put(`/api/orders/${orderId}/deliver`, {}, config);
        window.location.reload();
    } catch (error) { alert('Lỗi cập nhật giao hàng'); }
  };

  const handleCancelClick = () => {
      if (order.isPaid) {
          setShowRefundModal(true);
      } else {
          if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
              processCancelOrder({});
          }
      }
  };

  const processCancelOrder = async (refundData) => {
      try {
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          await axios.put(`/api/orders/${orderId}/cancel`, refundData, config);
          
          if (order.isPaid) {
              alert('Yêu cầu hủy đơn và hoàn tiền đã được gửi tới Admin. Vui lòng chờ xử lý!');
              window.location.reload();
          } else {
              alert('Đơn hàng đã được hủy thành công!');
              navigate('/profile');
          }
      } catch (error) {
          alert(error.response?.data?.message || 'Không thể hủy đơn hàng này');
      }
  };

  const submitRefundHandler = () => {
      if (!bankName || !accountNumber || !accountName) {
          alert('Vui lòng điền đầy đủ thông tin ngân hàng nhận tiền!');
          return;
      }
      processCancelOrder({ bankName, accountNumber, accountName });
      setShowRefundModal(false);
  };

  if (loading) return <Loader />;

  // --- GIAO DIỆN KHI ĐƠN ĐÃ BỊ HỦY/HOÀN TIỀN (DO ADMIN XÓA) ---
  if (isCancelledState) {
      return (
          <Container className="py-5 text-center">
              <Card className="border-0 shadow-sm p-5 mx-auto" style={{maxWidth: '600px'}}>
                  <div className="text-success mb-3">
                      <FaCheckCircle size={60} />
                  </div>
                  <h3 className="fw-bold text-success mb-3">Đơn hàng đã được hủy thành công!</h3>
                  <p className="text-muted mb-4">
                      Đơn hàng này đã được Admin xác nhận hủy (hoặc hoàn tiền xong) và xóa khỏi hệ thống.
                      <br/>Vui lòng kiểm tra tài khoản ngân hàng của bạn nếu có yêu cầu hoàn tiền.
                  </p>
                  <Link to="/">
                      <Button variant="primary" size="lg" style={{backgroundColor: '#165c3e', border: 'none'}}>
                          <FaHome className="me-2"/> Quay về Trang chủ
                      </Button>
                  </Link>
              </Card>
          </Container>
      );
  }
  // -----------------------------------------------------------

  if (error) return <Message variant="danger">{error}</Message>;

  const qrCodeUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact.png?amount=${order.totalPrice}&addInfo=KPERFUME ${order._id}&accountName=${ACCOUNT_NAME}`;

  return (
    <Container className="py-4">
      {/* ... Phần hiển thị chi tiết đơn hàng giữ nguyên như cũ ... */}
      <div className="d-flex align-items-center justify-content-between mb-4">
         <h4 className="fw-bold text-uppercase" style={{color: '#165c3e'}}>
            <FaBoxOpen className="me-2" /> Chi tiết đơn hàng
         </h4>
         <div className="text-muted small">Mã đơn: <span className="fw-bold text-dark">#{order._id}</span></div>
      </div>

      <Row>
        <Col md={8}>
          <Card className="border-0 shadow-sm mb-4 rounded-3">
            <Card.Header className="bg-white border-bottom py-3">
                <h6 className="m-0 fw-bold text-dark"><FaUser className="me-2 text-success" /> Thông tin nhận hàng</h6>
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col md={6} className="mb-3">
                        <strong className="d-block text-muted small text-uppercase mb-1">Người nhận</strong>
                        <p className="mb-1 fw-bold">{order.user?.name}</p>
                        <a href={`mailto:${order.user?.email}`} className="text-decoration-none small">{order.user?.email}</a>
                    </Col>
                    <Col md={6}>
                        <strong className="d-block text-muted small text-uppercase mb-1">Địa chỉ</strong>
                        <p className="mb-0"><FaMapMarkerAlt className="text-danger me-1"/>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                    </Col>
                </Row>
                <hr className="my-3 opacity-25"/>
                <div className="d-flex align-items-center justify-content-between bg-light p-3 rounded">
                    <div className="d-flex align-items-center"><FaTruck className="me-3 fs-4 text-secondary" /><div><div className="fw-bold small text-uppercase text-muted">Trạng thái giao hàng</div>{order.isDelivered ? <span className="text-success fw-bold">Đã giao lúc {order.deliveredAt?.substring(0, 10)}</span> : <span className="text-danger fw-bold">Chưa giao hàng</span>}</div></div>
                    {order.isDelivered ? <Badge bg="success">Hoàn thành</Badge> : <Badge bg="warning" text="dark">Đang xử lý</Badge>}
                </div>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm mb-4 rounded-3">
            <Card.Header className="bg-white border-bottom py-3"><h6 className="m-0 fw-bold text-dark"><FaMoneyBillWave className="me-2 text-success" /> Thanh toán</h6></Card.Header>
            <Card.Body>
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>Phương thức: <Badge bg="dark" className="ms-1">{order.paymentMethod === 'QRCode' ? 'Chuyển khoản QR' : order.paymentMethod}</Badge></div>
                    {order.isPaid ? <Badge bg="success">Đã thanh toán</Badge> : <Badge bg="danger">Chưa thanh toán</Badge>}
                </div>

                {!order.isPaid && order.paymentMethod === 'QRCode' && (
                    <div className="text-center bg-light p-3 rounded border border-success position-relative">
                        <h6 className="fw-bold text-success mb-3"><FaQrcode className="me-2"/>QUÉT MÃ ĐỂ THANH TOÁN</h6>
                        <div style={{cursor: 'pointer', display: 'inline-block', position: 'relative'}} onClick={() => setShowQRModal(true)} title="Bấm để phóng to">
                            <Image src={qrCodeUrl} alt="QR Code Thanh Toán" fluid style={{maxHeight: '200px'}} />
                            <div className="position-absolute bottom-0 end-0 bg-white p-1 rounded border shadow-sm"><FaExpand /></div>
                        </div>
                        <div className="mt-2 small text-muted">
                            <p className="mb-1">Ngân hàng: <strong>{BANK_ID}</strong></p>
                            <p className="mb-1">Số tài khoản: <strong>{ACCOUNT_NO}</strong></p>
                            <p className="mb-1">Số tiền: <strong className="text-danger">{order.totalPrice.toLocaleString('vi-VN')}₫</strong></p>
                            <p className="mb-0">Nội dung: <strong>KPERFUME {order._id}</strong></p>
                        </div>
                        <Button variant="outline-success" size="sm" className="mt-3" onClick={() => setShowQRModal(true)}><FaExpand className="me-1"/> Phóng to mã QR</Button>
                    </div>
                )}
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm mb-4 rounded-3">
            <Card.Header className="bg-white border-bottom py-3"><h6 className="m-0 fw-bold text-dark">Sản phẩm đã đặt ({order.orderItems.length})</h6></Card.Header>
            <ListGroup variant="flush">
              {order.orderItems.map((item, index) => (
                <ListGroup.Item key={index} className="p-3">
                  <Row className="align-items-center">
                    <Col md={2} xs={3}><Image src={item.image} alt={item.name} fluid rounded className="border" /></Col>
                    <Col md={5} xs={9}>
                      {item.brand && <div className="text-uppercase text-muted small fw-bold mb-1">{item.brand}</div>}
                      <Link to={`/product/${item.product}`} className="text-decoration-none text-dark fw-bold d-block mb-1">{item.name}</Link>
                      <div className="d-flex align-items-center flex-wrap gap-1"><Badge bg="dark" className="rounded-0 px-2 py-1" style={{fontSize: '0.7rem'}}>FULLBOX</Badge>{item.category && <Badge bg="light" text="dark" className="border px-2 py-1 text-uppercase" style={{fontSize: '0.7rem'}}>{item.category}</Badge>}</div>
                    </Col>
                    <Col md={5} xs={12} className="text-md-end mt-2 mt-md-0"><div className="text-muted small mb-1">Số lượng: {item.qty}</div><span className="fw-bold text-danger fs-5">{(item.qty * item.price).toLocaleString('vi-VN')}₫</span></Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-3">
            <Card.Header className="bg-success text-white py-3 text-center"><h5 className="m-0 fw-bold">TỔNG ĐƠN HÀNG</h5></Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item className="d-flex justify-content-between py-3"><span className="text-muted">Tạm tính</span><span className="fw-bold">{order.itemsPrice?.toLocaleString('vi-VN')}₫</span></ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between py-3"><span className="text-muted">Phí vận chuyển</span><span className="fw-bold">{order.shippingPrice?.toLocaleString('vi-VN')}₫</span></ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between py-3"><span className="text-muted">Thuế</span><span className="fw-bold">{order.taxPrice?.toLocaleString('vi-VN')}₫</span></ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between py-3 bg-light"><span className="fw-bold text-uppercase">Tổng cộng</span><span className="fw-bold text-danger fs-5">{order.totalPrice?.toLocaleString('vi-VN')}₫</span></ListGroup.Item>

              {userInfo && userInfo.isAdmin && (
                  <div className="p-3">
                      {!order.isPaid && <Button variant="dark" className="w-100 mb-2 fw-bold" onClick={successPaymentHandler}>Xác nhận Đã Thu Tiền</Button>}
                      {!order.isDelivered && <Button className="w-100 fw-bold border-0" style={{backgroundColor: '#165c3e'}} onClick={deliverHandler}>Xác nhận Đã Giao Hàng</Button>}
                  </div>
              )}
              
              {!order.isDelivered && (!order.refundResult || !order.refundResult.isRefunded) && (
                  <div className="p-3 pt-0">
                      {order.refundResult && order.refundResult.refundAt ? (
                          <div className="alert alert-warning text-center small mt-2">
                              <FaUndo className="me-1"/> Đã gửi yêu cầu hoàn tiền. <br/> Đang chờ Admin xử lý.
                          </div>
                      ) : (
                          <Button variant="outline-danger" className="w-100 fw-bold mt-2" onClick={handleCancelClick}>
                              <FaTimes className="me-2"/> {order.isPaid ? 'Yêu cầu Hủy & Hoàn tiền' : 'Hủy Đơn Hàng'}
                          </Button>
                      )}
                  </div>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>

      {/* MODAL QR */}
      <Modal show={showQRModal} onHide={() => setShowQRModal(false)} centered backdrop="static">
        <Modal.Header closeButton className="bg-success text-white"><Modal.Title><FaQrcode className="me-2"/>Quét Mã Thanh Toán</Modal.Title></Modal.Header>
        <Modal.Body className="text-center">
            <p className="text-muted">Vui lòng sử dụng App Ngân hàng để quét mã bên dưới</p>
            <div className="p-2 border rounded d-inline-block shadow-sm"><Image src={qrCodeUrl} fluid style={{maxHeight: '400px'}} /></div>
            <h4 className="text-danger fw-bold mt-3">{order.totalPrice.toLocaleString('vi-VN')}₫</h4>
            <div className="alert alert-warning mt-3 small">Nội dung chuyển khoản: <strong>KPERFUME {order._id}</strong><br/>(Hệ thống đã tự động điền, vui lòng không sửa đổi)</div>
        </Modal.Body>
        <Modal.Footer><Button variant="secondary" onClick={() => setShowQRModal(false)}>Đóng cửa sổ này</Button></Modal.Footer>
      </Modal>

      {/* MODAL HOÀN TIỀN */}
      <Modal show={showRefundModal} onHide={() => setShowRefundModal(false)} centered backdrop="static">
        <Modal.Header closeButton className="bg-danger text-white"><Modal.Title><FaUndo className="me-2"/> Thông tin nhận Hoàn tiền</Modal.Title></Modal.Header>
        <Modal.Body>
            <p className="text-muted small">Vì bạn đã thanh toán qua QR Code, vui lòng cung cấp tài khoản ngân hàng để chúng tôi hoàn lại tiền sau khi hủy đơn.</p>
            <Form>
                <Form.Group className="mb-3"><Form.Label>Tên Ngân hàng</Form.Label><Form.Control type="text" placeholder="VD: MB Bank, Vietcombank..." value={bankName} onChange={(e) => setBankName(e.target.value)} /></Form.Group>
                <Form.Group className="mb-3"><Form.Label>Số tài khoản</Form.Label><Form.Control type="text" placeholder="Số tài khoản nhận tiền" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} /></Form.Group>
                <Form.Group className="mb-3"><Form.Label>Tên chủ tài khoản</Form.Label><Form.Control type="text" placeholder="Tên in hoa không dấu" value={accountName} onChange={(e) => setAccountName(e.target.value)} /></Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRefundModal(false)}>Quay lại</Button>
            <Button variant="danger" onClick={submitRefundHandler} disabled={!bankName || !accountNumber || !accountName}>Gửi yêu cầu</Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default OrderScreen;