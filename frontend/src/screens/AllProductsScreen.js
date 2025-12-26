import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Breadcrumb, Button, InputGroup, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSearch,  } from 'react-icons/fa';
import axios from 'axios';

const AllProductsScreen = () => {
  const [products, setProducts] = useState([]);
  const [allBrands, setAllBrands] = useState([]); // Danh sách hãng để lọc
  
  // State bộ lọc
  const [sortType, setSortType] = useState('newest');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000000 });
  const [keywordBrand, setKeywordBrand] = useState('');

  // Lấy danh sách thương hiệu & Sản phẩm khi load trang
  useEffect(() => {
    const fetchInitialData = async () => {
        try {
            // 1. Lấy list brands
            const { data: brandsData } = await axios.get('/api/products/brands');
            setAllBrands(brandsData);
        } catch (error) {
            console.error(error);
        }
    };
    fetchInitialData();
  }, []);

  // Gọi API lọc sản phẩm mỗi khi state thay đổi
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = {
            sort: sortType,
            minPrice: priceRange.min,
            ...(priceRange.max < 100000000 && { maxPrice: priceRange.max }),
            brand: selectedBrands.join(',')
        };
        
        const { data } = await axios.get('/api/products', { params });
        setProducts(data);
      } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
      }
    };
    fetchProducts();
  }, [sortType, priceRange, selectedBrands]);

  // Xử lý chọn hãng
  const handleBrandChange = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  // Xử lý chọn giá
  const handlePriceChange = (min, max) => {
    if (priceRange.min === min && priceRange.max === max) {
        setPriceRange({ min: 0, max: 100000000 }); // Bỏ chọn
    } else {
        setPriceRange({ min, max });
    }
  };

  return (
    <div className="all-products-screen bg-white">
      {/* 1. HEADER BANNER (Bạn có thể thay ảnh khác vào src) */}
      <div className="position-relative mb-5" style={{ height: '300px', backgroundColor: '#222' }}>
        <img 
            src="/images/banner-collection.jpg" // Đặt ảnh banner bộ sưu tập vào folder public/images
            alt="Collection" 
            className="w-100 h-100" 
            style={{ objectFit: 'cover', opacity: 0.7 }}
            onError={(e) => {e.target.src='https://images.unsplash.com/photo-1557827983-012eb6ea8dc1?auto=format&fit=crop&w=1600&q=80'}}
        />
        <div className="position-absolute top-50 start-50 translate-middle text-center text-white">
            <h1 className="display-4 fw-bold letter-spacing-2 text-shadow">BỘ SƯU TẬP</h1>
            <p className="text-uppercase letter-spacing-1 mt-2">Tinh hoa hương thơm thế giới</p>
        </div>
      </div>

      <Container className="pb-5">
        <Breadcrumb className="bg-transparent p-0 mb-4 small text-uppercase">
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Trang chủ</Breadcrumb.Item>
            <Breadcrumb.Item active>Tất cả sản phẩm</Breadcrumb.Item>
        </Breadcrumb>

        <Row>
            {/* === SIDEBAR BỘ LỌC (CỘT TRÁI) === */}
            <Col md={3} className="d-none d-md-block pe-md-4">
                <div className="filter-box mb-5">
                    <h5 className="fw-bold text-uppercase mb-3 border-bottom pb-2" style={{fontSize: '0.9rem', letterSpacing: '1px'}}>Thương hiệu</h5>
                    <InputGroup className="mb-3" size="sm">
                        <Form.Control 
                            placeholder="Tìm nhanh..." 
                            value={keywordBrand}
                            onChange={(e) => setKeywordBrand(e.target.value)}
                            className="rounded-0 border-end-0"
                        />
                        <Button variant="outline-secondary" className="border-start-0 rounded-0"><FaSearch /></Button>
                    </InputGroup>
                    <div className="filter-scroll" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                        {allBrands.filter(b => b.toLowerCase().includes(keywordBrand.toLowerCase())).map((brand, idx) => (
                            <Form.Check 
                                key={idx}
                                type="checkbox"
                                label={brand}
                                id={`brand-${idx}`}
                                className="mb-2 text-muted small"
                                checked={selectedBrands.includes(brand)}
                                onChange={() => handleBrandChange(brand)}
                            />
                        ))}
                    </div>
                </div>

                <div className="filter-box mb-5">
                    <h5 className="fw-bold text-uppercase mb-3 border-bottom pb-2" style={{fontSize: '0.9rem', letterSpacing: '1px'}}>Khoảng giá</h5>
                    <div className="small">
                        {[
                            { label: 'Dưới 500k', min: 0, max: 500000 },
                            { label: '500k - 1 triệu', min: 500000, max: 1000000 },
                            { label: '1 triệu - 3 triệu', min: 1000000, max: 3000000 },
                            { label: '3 triệu - 5 triệu', min: 3000000, max: 5000000 },
                            { label: 'Trên 5 triệu', min: 5000000, max: 100000000 },
                        ].map((range, idx) => (
                            <Form.Check 
                                key={idx}
                                type="radio"
                                name="price"
                                label={range.label}
                                id={`price-${idx}`}
                                className="mb-2 text-muted"
                                checked={priceRange.min === range.min && priceRange.max === range.max}
                                onChange={() => handlePriceChange(range.min, range.max)}
                            />
                        ))}
                        <Form.Check 
                            type="radio"
                            name="price"
                            label="Tất cả mức giá"
                            className="mb-2 text-muted"
                            checked={priceRange.min === 0 && priceRange.max === 100000000}
                            onChange={() => handlePriceChange(0, 100000000)}
                        />
                    </div>
                </div>
            </Col>

            {/* === LƯỚI SẢN PHẨM (CỘT PHẢI) === */}
            <Col md={9}>
                {/* Thanh công cụ (Sort) */}
                <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                    <div className="text-muted small">Hiển thị <strong>{products.length}</strong> sản phẩm</div>
                    <div className="d-flex align-items-center">
                        <span className="me-2 small text-muted text-uppercase">Sắp xếp:</span>
                        <Form.Select 
                            size="sm" 
                            className="rounded-0 border-0 border-bottom" 
                            style={{width: '150px', boxShadow: 'none', cursor: 'pointer'}}
                            value={sortType}
                            onChange={(e) => setSortType(e.target.value)}
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="low-high">Giá tăng dần</option>
                            <option value="high-low">Giá giảm dần</option>
                        </Form.Select>
                    </div>
                </div>

                {/* Grid */}
                <Row>
                    {products.length > 0 ? products.map((product) => (
                        <Col key={product._id} sm={6} lg={4} className="mb-4">
                            <Card className="h-100 border-0 shadow-sm product-card-hover bg-white">
                                <Link to={`/product/${product._id}`} className="overflow-hidden position-relative d-flex align-items-center justify-content-center" style={{height: '280px', backgroundColor: '#fff'}}>
                                    <Card.Img 
                                        variant="top" 
                                        src={product.image} 
                                        style={{ height: '85%', objectFit: 'contain', padding: '15px' }} 
                                    />
                                    {/* Badge SALE giả lập nếu muốn */}
                                    {/* <span className="position-absolute top-0 start-0 bg-dark text-white px-2 py-1 small m-2">HOT</span> */}
                                </Link>
                                <Card.Body className="text-center d-flex flex-column pt-2 pb-4">
                                    <div className="text-muted small text-uppercase mb-2 fw-bold letter-spacing-2" style={{fontSize: '0.65rem'}}>{product.brand}</div>
                                    <Card.Title as="div" className="mb-2" style={{minHeight: '45px'}}>
                                        <Link to={`/product/${product._id}`} className="text-dark text-decoration-none fw-bold product-link text-uppercase" style={{ fontSize: '0.9rem', letterSpacing: '0.5px' }}>
                                            {product.name}
                                        </Link>
                                    </Card.Title>
                                    <div className="mt-auto">
                                        <h5 className="text-danger fw-bold mb-3 fs-6">{product.price.toLocaleString('vi-VN')}₫</h5>
                                        <Link to={`/product/${product._id}`} className="btn btn-dark w-100 rounded-0 text-uppercase fw-bold py-2" style={{fontSize: '0.75rem', letterSpacing: '1px'}}>
                                            Mua Ngay
                                        </Link>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    )) : (
                        <Col className="text-center py-5">
                            <h5 className="text-muted fw-light">Không tìm thấy sản phẩm phù hợp.</h5>
                            <Button variant="outline-dark" className="mt-3 rounded-0" onClick={() => window.location.reload()}>Xóa bộ lọc</Button>
                        </Col>
                    )}
                </Row>

                {/* Phân trang (Demo UI) */}
                <div className="d-flex justify-content-center mt-5">
                    <Pagination>
                        <Pagination.First disabled />
                        <Pagination.Prev disabled />
                        <Pagination.Item active>{1}</Pagination.Item>
                        <Pagination.Item>{2}</Pagination.Item>
                        <Pagination.Item>{3}</Pagination.Item>
                        <Pagination.Next />
                        <Pagination.Last />
                    </Pagination>
                </div>
            </Col>
        </Row>
      </Container>

      {/* CSS Nhúng */}
      <style>{`
        .letter-spacing-1 { letter-spacing: 1px; }
        .letter-spacing-2 { letter-spacing: 2px; }
        .text-shadow { text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
        .product-card-hover:hover { box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important; transform: translateY(-5px); transition: all 0.3s ease; }
        .product-link:hover { color: #165c3e !important; }
        .filter-scroll::-webkit-scrollbar { width: 5px; }
        .filter-scroll::-webkit-scrollbar-thumb { background: #ccc; border-radius: 5px; }
      `}</style>
    </div>
  );
};

export default AllProductsScreen;