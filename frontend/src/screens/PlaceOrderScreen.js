import React, { useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image, Card, Container, Badge } from 'react-bootstrap';
import { FaMapMarkerAlt, FaCreditCard, FaBoxOpen, FaCheckCircle } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { OrderContext } from '../context/OrderContext';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';
import Loader from '../components/Loader';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const { state: cartState, dispatch: cartDispatch } = useContext(CartContext);
  
  // Lấy thêm hàm resetOrderCreate từ OrderContext
  const { createOrder, error, success, order, loading, resetOrderCreate } = useContext(OrderContext);

  // Tính toán giá tiền
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100);
  };

  const itemsPrice = addDecimals(
    cartState.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  const shippingPrice = addDecimals(itemsPrice > 1000000 ? 0 : 30000); 
  const taxPrice = addDecimals(Number((0.08 * itemsPrice).toFixed(0))); 
  const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice));

  useEffect(() => {
    if (success) {
        if (order && order._id) {
            // 1. Chuyển trang đến hóa đơn
            navigate(`/order/${order._id}`);
            
            // 2. Xóa giỏ hàng
            cartDispatch({ type: 'CART_CLEAR_ITEMS' });
            localStorage.removeItem('cartItems'); 
            
            // 3. Reset trạng thái đặt hàng
            resetOrderCreate(); 
        }
    }
    // eslint-disable-next-line
  }, [success, navigate, order]);

  const placeOrderHandler = () => {
    createOrder({
      orderItems: cartState.cartItems,
      shippingAddress: cartState.shippingAddress,
      paymentMethod: cartState.paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });
  };

  return (
    <Container className="py-4">
      <CheckoutSteps step1 step2 step3 step4 />
      
      <Row>
        {/* CỘT TRÁI */}
        <Col md={8}>
          <Card className="mb-4 border-0 shadow-sm rounded-3">
            <Card.Header className="bg-white py-3">
                <h5 className="m-0 fw-bold text-dark">
                    <FaMapMarkerAlt className="me-2 text-danger" /> Địa chỉ Giao hàng
                </h5>
            </Card.Header>
            <Card.Body>
                <p className="mb-0 fs-6">
                    <strong>Địa chỉ: </strong> 
                    {cartState.shippingAddress.address}, {cartState.shippingAddress.city}, 
                    {cartState.shippingAddress.postalCode}, {cartState.shippingAddress.country}
                </p>
            </Card.Body>
          </Card>

          <Card className="mb-4 border-0 shadow-sm rounded-3">
            <Card.Header className="bg-white py-3">
                <h5 className="m-0 fw-bold text-dark">
                    <FaCreditCard className="me-2 text-primary" /> Phương thức Thanh toán
                </h5>
            </Card.Header>
            <Card.Body>
                <strong className="text-success">{cartState.paymentMethod}</strong>
            </Card.Body>
          </Card>

          <Card className="mb-4 border-0 shadow-sm rounded-3">
            <Card.Header className="bg-white py-3">
                <h5 className="m-0 fw-bold text-dark">
                    <FaBoxOpen className="me-2 text-warning" /> Sản phẩm Đặt hàng
                </h5>
            </Card.Header>
            <ListGroup variant="flush">
              {cartState.cartItems.length === 0 ? (
                <Message>Giỏ hàng của bạn đang trống</Message>
              ) : (
                cartState.cartItems.map((item, index) => (
                  <ListGroup.Item key={index} className="p-3">
                    <Row className="align-items-center">
                      {/* Ảnh Sản phẩm */}
                      <Col md={2} xs={3}>
                        <Image src={item.image} alt={item.name} fluid rounded className="border" />
                      </Col>
                      
                      {/* Thông tin chi tiết */}
                      <Col md={5} xs={9}>
                        {/* Thương hiệu */}
                        <div className="text-uppercase text-muted small fw-bold mb-1">
                            {item.brand || 'Thương hiệu'}
                        </div>
                        
                        {/* Tên sản phẩm */}
                        <Link to={`/product/${item.product}`} className="text-decoration-none text-dark fw-bold d-block mb-1">
                          {item.name}
                        </Link>
                        
                        {/* Huy hiệu (Badge) */}
                        <div className="d-flex align-items-center flex-wrap gap-1">
                            <Badge bg="dark" className="rounded-0 px-2 py-1">FULLBOX</Badge>
                            {item.category && (
                                <Badge bg="light" text="dark" className="border px-2 py-1 text-uppercase">
                                    {item.category}
                                </Badge>
                            )}
                        </div>
                      </Col>
                      
                      {/* Giá tiền */}
                      <Col md={5} xs={12} className="text-md-end mt-2 mt-md-0">
                        <div className="text-muted small mb-1">Số lượng: {item.qty}</div>
                        <span className="fw-bold text-danger fs-5">
                            {(item.qty * item.price).toLocaleString('vi-VN')}₫
                        </span>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))
              )}
            </ListGroup>
          </Card>
        </Col>

        {/* CỘT PHẢI */}
        <Col md={4}>
          <Card className="border-0 shadow rounded-3 sticky-top" style={{ top: '20px' }}>
            <Card.Header className="py-3 text-white text-center" style={{backgroundColor: '#165c3e'}}>
                <h5 className="m-0 fw-bold text-uppercase">Tóm tắt Đơn hàng</h5>
            </Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item className="d-flex justify-content-between py-3">
                <span className="text-muted">Tạm tính</span>
                <span className="fw-bold">{itemsPrice.toLocaleString('vi-VN')}₫</span>
              </ListGroup.Item>
              
              <ListGroup.Item className="d-flex justify-content-between py-3">
                <span className="text-muted">Phí giao hàng</span>
                <span className="fw-bold">{shippingPrice.toLocaleString('vi-VN')}₫</span>
              </ListGroup.Item>
              
              <ListGroup.Item className="d-flex justify-content-between py-3">
                <span className="text-muted">Thuế (VAT 8%)</span>
                <span className="fw-bold">{taxPrice.toLocaleString('vi-VN')}₫</span>
              </ListGroup.Item>
              
              <ListGroup.Item className="d-flex justify-content-between py-3 bg-light">
                <span className="fw-bold text-uppercase">Tổng cộng</span>
                <span className="fw-bold text-danger fs-4">{totalPrice.toLocaleString('vi-VN')}₫</span>
              </ListGroup.Item>
              
              {error && (
                  <ListGroup.Item>
                    <Message variant='danger'>{error}</Message>
                  </ListGroup.Item>
              )}

              <ListGroup.Item className="p-3">
                <Button
                  type='button'
                  className='w-100 py-3 fw-bold text-uppercase border-0'
                  style={{backgroundColor: '#165c3e', fontSize: '1.1rem'}}
                  disabled={cartState.cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  {loading ? <Loader size="sm" color="white" /> : <><FaCheckCircle className="me-2"/> Xác nhận Đặt hàng</>}
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PlaceOrderScreen;