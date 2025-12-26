import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Button, Form, InputGroup, Tabs, Tab, Card, Badge } from 'react-bootstrap';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext'; // <--- Import Wishlist
import { FaMinus, FaPlus, FaTruck, FaMedal, FaHeadset, FaCheckCircle, FaChevronLeft, FaChevronRight, FaMars, FaVenus, FaGenderless, FaChevronDown, FaChevronUp, FaHeart, FaRegHeart } from 'react-icons/fa';

const ProductScreen = () => {
  const [product, setProduct] = useState({});
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [allImages, setAllImages] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false); 
  
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useContext(CartContext);
  
  // --- LẤY CONTEXT YÊU THÍCH ---
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const isLiked = isInWishlist(productId); // Kiểm tra xem sp này đã like chưa

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: currentProduct } = await axios.get(`/api/products/${productId}`);
        setProduct(currentProduct);
        const imagesList = [currentProduct.image, ...(currentProduct.images || [])];
        setAllImages(imagesList);
        setSelectedImage(currentProduct.image);

        const { data: allProducts } = await axios.get('/api/products');
        const related = allProducts
          .filter(p => p.category === currentProduct.category && p._id !== currentProduct._id)
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (error) { console.error(error); }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [productId]);

  const addToCartHandler = () => {
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty: Number(qty),
        brand: product.brand,
        category: product.category,
      },
    });
  };

  const buyNowHandler = () => {
    addToCartHandler();
    navigate('/shipping');
  };

  // --- XỬ LÝ KHI BẤM NÚT TIM ---
  const toggleWishlistHandler = () => {
      if (isLiked) {
          removeFromWishlist(product._id);
      } else {
          addToWishlist(product);
      }
  };

  const increaseQty = () => { if (qty < product.countInStock) setQty(qty + 1); };
  const decreaseQty = () => { if (qty > 1) setQty(qty - 1); };

  const handleNextImage = () => {
    const currentIndex = allImages.indexOf(selectedImage);
    const nextIndex = currentIndex === allImages.length - 1 ? 0 : currentIndex + 1;
    setSelectedImage(allImages[nextIndex]);
  };

  const handlePrevImage = () => {
    const currentIndex = allImages.indexOf(selectedImage);
    const prevIndex = currentIndex === 0 ? allImages.length - 1 : currentIndex - 1;
    setSelectedImage(allImages[prevIndex]);
  };

  const getGenderIcon = (cat) => {
      if (!cat) return null;
      if (cat.toLowerCase() === 'nam') return <FaMars className="me-1"/>;
      if (cat.toLowerCase() === 'nữ' || cat.toLowerCase() === 'nu') return <FaVenus className="me-1"/>;
      return <FaGenderless className="me-1"/>;
  };

  return (
    <div className="container py-4" style={{ backgroundColor: '#fff' }}>
      <div className="small text-muted mb-3">
        <Link to="/" className="text-decoration-none text-muted">Trang chủ</Link> / 
        <Link to={`/category/${product.category}`} className="text-decoration-none text-muted ms-1">Nước hoa {product.category}</Link> / 
        <span className="ms-1 fw-bold text-dark">{product.name}</span>
      </div>

      <Row className="mb-5">
        <Col md={6}>
          <div className="border border-1 rounded-2 p-2 mb-2 position-relative bg-white" style={{ borderColor: '#ddd' }}>
             <Image src={selectedImage} alt={product.name} fluid className="d-block mx-auto" style={{ maxHeight: '450px', objectFit: 'contain' }} />
             {allImages.length > 1 && (
                 <>
                    <Button variant="light" className="position-absolute top-50 start-0 translate-middle-y ms-2 rounded-circle shadow-sm border" onClick={handlePrevImage} style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><FaChevronLeft /></Button>
                    <Button variant="light" className="position-absolute top-50 end-0 translate-middle-y me-2 rounded-circle shadow-sm border" onClick={handleNextImage} style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><FaChevronRight /></Button>
                 </>
             )}
          </div>
          <div className="d-flex gap-2 justify-content-center overflow-auto py-2">
             {allImages.map((img, index) => (
                <div key={index} className={`border p-1 cursor-pointer rounded ${selectedImage === img ? 'border-success border-2' : ''}`} style={{width: '70px', height: '70px', minWidth: '70px'}} onClick={() => setSelectedImage(img)}>
                    <Image src={img} className="w-100 h-100 object-fit-cover rounded-1" />
                </div>
             ))}
          </div>
        </Col>

        <Col md={6}>
          <h2 className="fw-bold text-dark mb-2">{product.name}</h2>
          <div className="d-flex align-items-center mb-3">
             <div className="text-success small me-3">Tình trạng: <span className="fw-bold">{product.countInStock > 0 ? 'Còn hàng' : 'Hết hàng'}</span></div>
             <Badge bg="light" text="dark" className="border px-3 py-2 d-flex align-items-center">{getGenderIcon(product.category)} <span className="text-uppercase fw-bold">NƯỚC HOA {product.category}</span></Badge>
          </div>
          <h3 className="fw-bold mb-4" style={{ color: '#165c3e' }}>{product.price?.toLocaleString('vi-VN')}₫</h3>
          <p className="text-muted mb-4 text-justify" style={{lineHeight: '1.6'}}>{product.description}</p>
          <ListGroup variant="flush" className="mb-4 small">
            <ListGroup.Item className="px-0 py-2 border-0"><strong>Thương hiệu: </strong><span className="text-uppercase fw-bold text-dark">{product.brand}</span></ListGroup.Item>
            <ListGroup.Item className="px-0 py-2 border-0"><strong>Dung tích: </strong><span className="badge bg-dark rounded-0 px-3 py-2">FULLBOX</span></ListGroup.Item>
            <ListGroup.Item className="px-0 py-2 border-0 d-flex align-items-center"><strong className="me-3">Số lượng:</strong><InputGroup size="sm" style={{ width: '120px' }}><Button variant="outline-secondary" onClick={decreaseQty}><FaMinus size={8} /></Button><Form.Control className="text-center p-0 fw-bold" value={qty} readOnly style={{height: '30px'}} /><Button variant="outline-secondary" onClick={increaseQty}><FaPlus size={8} /></Button></InputGroup></ListGroup.Item>
          </ListGroup>
          
          <div className="d-flex gap-2 align-items-center">
                <Button onClick={buyNowHandler} disabled={product.countInStock === 0} className="w-40 py-3 fw-bold text-uppercase border-0 shadow-sm" style={{ backgroundColor: '#165c3e', flex: 2 }}>MUA NGAY</Button>
                <Button onClick={addToCartHandler} disabled={product.countInStock === 0} className="w-40 py-3 fw-bold text-uppercase border-0 shadow-sm" style={{ backgroundColor: '#0f402b', flex: 2 }}>THÊM VÀO GIỎ</Button>
                
                {/* --- NÚT YÊU THÍCH MỚI --- */}
                <Button 
                    onClick={toggleWishlistHandler} 
                    className="py-3 shadow-sm border" 
                    variant="light"
                    style={{ flex: 1, borderColor: '#ddd' }}
                    title={isLiked ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
                >
                    {isLiked ? <FaHeart size={24} color="#dc3545" /> : <FaRegHeart size={24} color="#555" />}
                </Button>
                {/* ------------------------- */}
          </div>
        </Col>
      </Row>

      {/* --- PHẦN THÔNG TIN SẢN PHẨM --- */}
      <Row className="mb-5">
        <Col md={9}>
            <div className="custom-tabs">
                <Tabs defaultActiveKey="info" id="product-tabs" className="mb-3 border-bottom-0">
                    <Tab eventKey="info" title={<span className="fw-bold text-uppercase">Thông tin sản phẩm</span>} className="border p-4 rounded-bottom">
                        <div className="position-relative" style={{ maxHeight: isExpanded ? 'none' : '300px', overflow: 'hidden', transition: 'max-height 0.5s ease' }}>
                            <div style={{ whiteSpace: 'pre-line', lineHeight: '1.8', color: '#333' }}>
                                {product.detailedDescription ? product.detailedDescription : "Đang cập nhật thông tin chi tiết..."}
                            </div>
                            <div className="mt-4 text-center">
                                 <Image src={product.image} fluid style={{maxWidth: '80%', borderRadius: '8px'}} />
                            </div>
                            {!isExpanded && (
                                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100px', background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))', pointerEvents: 'none' }} />
                            )}
                        </div>
                        <div className="text-center mt-3">
                            <Button variant="outline-success" size="sm" className="rounded-pill px-4 fw-bold" onClick={() => setIsExpanded(!isExpanded)} style={{borderColor: '#165c3e', color: '#165c3e'}}>
                                {isExpanded ? <><FaChevronUp className="me-1"/> Thu gọn</> : <><FaChevronDown className="me-1"/> Xem thêm</>}
                            </Button>
                        </div>
                    </Tab>
                    <Tab eventKey="guide" title={<span className="fw-bold text-uppercase">Hướng dẫn sử dụng</span>} className="border p-4 rounded-bottom">
                        <p>1. Vệ sinh cơ thể sạch sẽ trước khi xịt nước hoa.</p>
                        <p>2. Xịt vào các điểm mạch đập: cổ tay, sau gáy, ngực.</p>
                        <p>3. Không chà xát sau khi xịt.</p>
                    </Tab>
                    <Tab eventKey="warranty" title={<span className="fw-bold text-uppercase">Đổi trả & Bảo hành</span>} className="border p-4 rounded-bottom">
                        <p><strong>Chính sách K-perfume:</strong></p><ul><li>Đổi trả miễn phí trong vòng 7 ngày.</li><li>Bảo hành mùi hương trọn đời sản phẩm.</li></ul>
                    </Tab>
                </Tabs>
            </div>
        </Col>
        <Col md={3}>
            <Card className="border-0 shadow-sm mb-3 bg-light"><Card.Body><div className="mb-3"><div className="fw-bold mb-2" style={{color: '#165c3e'}}><FaTruck className="me-2"/> Giao hàng nhanh</div><ul className="list-unstyled small text-muted ps-1" style={{fontSize: '0.85rem'}}><li className="mb-1"><FaCheckCircle className="text-success me-1" size={10}/> Ship COD toàn quốc</li><li><FaCheckCircle className="text-success me-1" size={10}/> Freeship đơn &gt; 1 triệu</li></ul></div><div className="mb-3"><div className="fw-bold mb-2" style={{color: '#165c3e'}}><FaMedal className="me-2"/> Chất lượng đảm bảo</div><ul className="list-unstyled small text-muted ps-1" style={{fontSize: '0.85rem'}}><li className="mb-1"><FaCheckCircle className="text-success me-1" size={10}/> Chính hãng 100%</li></ul></div><div><div className="fw-bold mb-2" style={{color: '#165c3e'}}><FaHeadset className="me-2"/> Hỗ trợ 24/7</div><ul className="list-unstyled small text-muted ps-1" style={{fontSize: '0.85rem'}}><li><FaCheckCircle className="text-success me-1" size={10}/> Hotline: 0901.234.567</li></ul></div></Card.Body></Card>
        </Col>
      </Row>

      <div className="mt-5 pt-3 border-top"><h4 className="fw-bold text-uppercase mb-4 text-center" style={{color: '#165c3e'}}>Có thể bạn sẽ thích</h4><Row>{relatedProducts.length > 0 ? relatedProducts.map((relProduct) => (<Col key={relProduct._id} md={3} sm={6} xs={6} className="mb-4"><Card className="h-100 border-0 shadow-sm product-card"><Link to={`/product/${relProduct._id}`}><Card.Img variant="top" src={relProduct.image} style={{ height: '200px', objectFit: 'contain', padding: '10px' }} /></Link><Card.Body className="text-center p-2 d-flex flex-column"><p className="text-muted small mb-1 text-uppercase">{relProduct.brand}</p><Card.Title as="div" className="mb-2" style={{minHeight: '40px'}}><Link to={`/product/${relProduct._id}`} className="text-dark text-decoration-none fw-bold small text-uppercase">{relProduct.name}</Link></Card.Title><div className="mt-auto fw-bold" style={{color: '#B91C1C'}}>{relProduct.price.toLocaleString('vi-VN')}₫</div></Card.Body></Card></Col>)) : <p className="text-center text-muted">Không có sản phẩm tương tự.</p>}</Row></div>
      <style>{`.custom-tabs .nav-tabs .nav-link { color: #555; border: none; background-color: #f1f1f1; margin-right: 5px; border-radius: 5px 5px 0 0; } .custom-tabs .nav-tabs .nav-link.active { background-color: #165c3e; color: white !important; } .product-card { transition: transform 0.2s; } .product-card:hover { transform: translateY(-5px); }`}</style>
    </div>
  );
};
export default ProductScreen;