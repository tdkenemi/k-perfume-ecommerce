import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Button, Container, Card } from 'react-bootstrap';
import { FaTrash, FaShoppingCart, FaHeartBroken, FaArrowLeft } from 'react-icons/fa';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext'; // Để thêm vào giỏ từ wishlist

const WishlistScreen = () => {
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
  const { dispatch } = useContext(CartContext);
  const navigate = useNavigate();

  const addToCartHandler = (product) => {
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty: 1, // Mặc định thêm 1
        brand: product.brand,
        category: product.category,
      },
    });
    navigate('/cart'); // Chuyển sang giỏ hàng sau khi thêm
  };

  return (
    <Container className="py-5" style={{ minHeight: '70vh' }}>
      <h2 className="text-uppercase fw-bold mb-4" style={{ color: '#165c3e' }}>
        Danh sách Yêu thích ({wishlistItems.length})
      </h2>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-5 bg-light rounded shadow-sm">
          <FaHeartBroken size={60} className="text-muted mb-3 opacity-50" />
          <h4 className="text-muted">Danh sách yêu thích đang trống</h4>
          <p className="mb-4 text-secondary">Hãy thả tim các sản phẩm bạn thích nhé!</p>
          <Link to="/" className="btn btn-dark rounded-0 px-4">
             <FaArrowLeft className="me-2" /> Quay lại mua sắm
          </Link>
        </div>
      ) : (
        <Row>
          <Col md={12}>
            <ListGroup variant="flush" className="shadow-sm rounded">
              {wishlistItems.map((item) => (
                <ListGroup.Item key={item._id} className="p-3">
                  <Row className="align-items-center">
                    {/* Ảnh */}
                    <Col md={2} xs={3}>
                      <Link to={`/product/${item._id}`}>
                         <Image src={item.image} alt={item.name} fluid rounded className="border" />
                      </Link>
                    </Col>
                    
                    {/* Tên & Giá */}
                    <Col md={4} xs={9}>
                      <div className="text-muted small text-uppercase fw-bold">{item.brand}</div>
                      <Link to={`/product/${item._id}`} className="text-decoration-none text-dark fw-bold fs-5">
                        {item.name}
                      </Link>
                      <div className="text-danger fw-bold mt-1">
                         {item.price.toLocaleString('vi-VN')}₫
                      </div>
                    </Col>

                    {/* Trạng thái kho */}
                    <Col md={3} xs={6} className="mt-2 mt-md-0 text-center">
                        {item.countInStock > 0 ? (
                            <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">Còn hàng</span>
                        ) : (
                            <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill">Hết hàng</span>
                        )}
                    </Col>
                    
                    {/* Hành động */}
                    <Col md={3} xs={6} className="mt-2 mt-md-0 text-end">
                      <Button
                        variant="outline-success"
                        className="me-2"
                        size="sm"
                        disabled={item.countInStock === 0}
                        onClick={() => addToCartHandler(item)}
                        title="Thêm vào giỏ"
                      >
                        <FaShoppingCart /> 
                      </Button>
                      <Button
                        variant="light"
                        className="text-danger border"
                        size="sm"
                        onClick={() => removeFromWishlist(item._id)}
                        title="Xóa khỏi yêu thích"
                      >
                        <FaTrash />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default WishlistScreen;