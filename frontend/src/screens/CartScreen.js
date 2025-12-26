import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Form, Button, Card, Container, InputGroup } from 'react-bootstrap';
import { FaTrash, FaMinus, FaPlus, FaArrowLeft, FaShoppingBag } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';

const CartScreen = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(CartContext);
  const { cartItems } = state;

  // Hàm cập nhật số lượng
  const updateQtyHandler = (item, newQty) => {
    if (newQty > 0 && newQty <= item.countInStock) {
      dispatch({
        type: 'CART_ADD_ITEM',
        payload: { ...item, qty: Number(newQty) },
      });
    }
  };

  // Hàm xóa sản phẩm
  const removeFromCartHandler = (id) => {
    dispatch({
      type: 'CART_REMOVE_ITEM',
      payload: id,
    });
  };

  // Hàm chuyển trang thanh toán
  const checkoutHandler = () => {
    // Kiểm tra nếu chưa đăng nhập thì bắt đăng nhập, xong mới sang shipping
    navigate('/login?redirect=/shipping');
  };

  // Tính tổng tiền
  const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  return (
    <Container className="py-4" style={{ minHeight: '60vh' }}>
      <h2 className="mb-4 text-uppercase fw-bold" style={{color: '#165c3e'}}>
        <FaShoppingBag className="me-2" /> Giỏ hàng của bạn
      </h2>

      {cartItems.length === 0 ? (
        // === GIAO DIỆN KHI GIỎ HÀNG TRỐNG ===
        <div className="text-center py-5 bg-light rounded shadow-sm">
          <FaShoppingBag size={80} className="text-muted mb-3 opacity-50" />
          <h4 className="text-muted">Giỏ hàng của bạn đang trống</h4>
          <p className="mb-4 text-secondary">Hãy chọn thêm sản phẩm để tiếp tục mua sắm nhé!</p>
          <Link to="/" className="btn btn-dark btn-lg rounded-0 px-5">
             Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        // === GIAO DIỆN KHI CÓ SẢN PHẨM ===
        <Row>
          {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
          <Col md={8}>
            <ListGroup variant="flush" className="shadow-sm rounded mb-4">
              {cartItems.map((item) => (
                <ListGroup.Item key={item.product} className="p-3">
                  <Row className="align-items-center">
                    {/* Ảnh */}
                    <Col md={2} xs={3}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    
                    {/* Tên & Phân loại */}
                    <Col md={4} xs={9}>
                      <Link to={`/product/${item.product}`} className="text-decoration-none text-dark fw-bold">
                        {item.name}
                      </Link>
                      <div className="text-muted small mt-1">
                         {item.countInStock > 0 ? 'Còn hàng' : 'Hết hàng'}
                      </div>
                    </Col>
                    
                    {/* Giá */}
                    <Col md={2} xs={4} className="mt-2 mt-md-0 fw-bold text-danger">
                      {item.price.toLocaleString('vi-VN')}₫
                    </Col>
                    
                    {/* Số lượng */}
                    <Col md={3} xs={6} className="mt-2 mt-md-0">
                        <InputGroup size="sm">
                            <Button 
                                variant="outline-secondary" 
                                onClick={() => updateQtyHandler(item, item.qty - 1)}
                                disabled={item.qty === 1}
                            >
                                <FaMinus size={10} />
                            </Button>
                            <Form.Control 
                                className="text-center" 
                                value={item.qty} 
                                readOnly
                                style={{maxWidth: '50px'}} 
                            />
                            <Button 
                                variant="outline-secondary" 
                                onClick={() => updateQtyHandler(item, item.qty + 1)}
                                disabled={item.qty >= item.countInStock}
                            >
                                <FaPlus size={10} />
                            </Button>
                        </InputGroup>
                    </Col>
                    
                    {/* Nút Xóa */}
                    <Col md={1} xs={2} className="mt-2 mt-md-0 text-end">
                      <Button
                        type="button"
                        variant="light"
                        className="text-danger"
                        onClick={() => removeFromCartHandler(item.product)}
                      >
                        <FaTrash />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
            
            <Link to="/" className="text-decoration-none text-muted small">
                <FaArrowLeft className="me-1" /> Tiếp tục mua sắm
            </Link>
          </Col>

          {/* CỘT PHẢI: TỔNG KẾT & THANH TOÁN */}
          <Col md={4}>
            <Card className="border-0 shadow-sm rounded">
              <Card.Header className="bg-white py-3 border-bottom">
                  <h5 className="m-0 fw-bold text-uppercase">Tóm tắt đơn hàng</h5>
              </Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between py-3">
                  <span>Tổng sản phẩm:</span>
                  <strong>{cartItems.reduce((acc, item) => acc + item.qty, 0)}</strong>
                </ListGroup.Item>
                
                <ListGroup.Item className="d-flex justify-content-between py-3 bg-light">
                  <span className="fw-bold">Tạm tính:</span>
                  <span className="fw-bold text-danger fs-5">
                    {totalPrice.toLocaleString('vi-VN')}₫
                  </span>
                </ListGroup.Item>
                
                <ListGroup.Item className="p-3">
                  <Button
                    type="button"
                    className="w-100 py-2 fw-bold text-uppercase border-0"
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                    style={{ backgroundColor: '#165c3e' }}
                  >
                    Tiến hành Thanh toán
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default CartScreen;