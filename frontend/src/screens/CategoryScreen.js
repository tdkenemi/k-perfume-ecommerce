import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Breadcrumb, ListGroup, Pagination, InputGroup, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { FaTh, FaList, FaSearch } from 'react-icons/fa';
import axios from 'axios';

const CategoryScreen = () => {
  const { category, brand } = useParams(); 
  
  const [products, setProducts] = useState([]);
  
  // State quản lý bộ lọc
  const [sortType, setSortType] = useState('newest');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000000 }); 
  const [keywordBrand, setKeywordBrand] = useState('');

  // --- SỬA: Thay mảng cứng bằng State để chứa thương hiệu từ DB ---
  const [allBrands, setAllBrands] = useState([]); 

  let pageTitle = 'Tất cả sản phẩm';
  if (category) pageTitle = `Nước hoa ${category}`;
  if (brand) pageTitle = `Thương hiệu: ${brand}`;

  // --- SỬA: Gọi API lấy danh sách thương hiệu thật ---
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const { data } = await axios.get('/api/products/brands');
        setAllBrands(data); // Lưu danh sách hãng vào state
      } catch (error) {
        console.error("Lỗi lấy danh sách thương hiệu:", error);
      }
    };
    fetchBrands();
  }, []);

  // Xử lý logic chọn Brand từ URL
  useEffect(() => {
    if (brand) {
      setSelectedBrands([brand]);
    } else {
      setSelectedBrands([]);
    }
  }, [brand]); 

  // Gọi API lấy sản phẩm khi bộ lọc thay đổi
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = {
            sort: sortType,
            minPrice: priceRange.min,
            ...(priceRange.max < 100000000 && { maxPrice: priceRange.max }) 
        };

        if (category) params.category = category;
        
        if (selectedBrands.length > 0) {
            params.brand = selectedBrands.join(',');
        } else if (brand) {
            params.brand = brand;
        }

        const { data } = await axios.get('/api/products', { params });
        setProducts(data);
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      }
    };

    fetchProducts();
  }, [category, brand, sortType, selectedBrands, priceRange]);

  const handleBrandChange = (bName) => {
    if (selectedBrands.includes(bName)) {
      setSelectedBrands(selectedBrands.filter(b => b !== bName)); 
    } else {
      setSelectedBrands([...selectedBrands, bName]); 
    }
  };

  const handlePriceChange = (min, max) => {
    if (priceRange.min === min && priceRange.max === max) {
        setPriceRange({ min: 0, max: 100000000 }); 
    } else {
        setPriceRange({ min, max });
    }
  };

  return (
    <Container className="py-3">
      <Breadcrumb className="bg-transparent p-0 mb-3 small">
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Trang chủ</Breadcrumb.Item>
        <Breadcrumb.Item active>{pageTitle}</Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        <Col md={3} className="d-none d-md-block">
          
          {/* Lọc Thương hiệu (DỮ LIỆU ĐỘNG TỪ DB) */}
          <div className="mb-4 border p-3 bg-white rounded shadow-sm">
            <h6 className="fw-bold text-uppercase mb-3 small" style={{color: '#165c3e'}}>Thương hiệu</h6>
            <InputGroup className="mb-3" size="sm">
              <Form.Control 
                placeholder="Tìm thương hiệu..." 
                value={keywordBrand}
                onChange={(e) => setKeywordBrand(e.target.value)}
              />
              <Button variant="outline-secondary"><FaSearch /></Button>
            </InputGroup>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }} className="small">
              {/* Lọc danh sách hãng theo từ khóa tìm kiếm */}
              {allBrands
                .filter(b => b.toLowerCase().includes(keywordBrand.toLowerCase()))
                .map((b, index) => (
                    <Form.Check 
                      key={index}
                      type="checkbox"
                      label={b}
                      checked={selectedBrands.includes(b) || b === brand}
                      onChange={() => handleBrandChange(b)}
                      className="mb-2 text-muted custom-checkbox"
                    />
              ))}
              {allBrands.length === 0 && <p className="text-muted small">Chưa có thương hiệu nào.</p>}
            </div>
          </div>

          {/* Lọc Giá (Giữ nguyên) */}
          <div className="mb-4 border p-3 bg-white rounded shadow-sm">
            <h6 className="fw-bold text-uppercase mb-3 small" style={{color: '#165c3e'}}>Giá sản phẩm</h6>
            <div className="small">
              <Form.Check type="radio" name="priceFilter" label="Giá dưới 100.000đ" 
                checked={priceRange.max === 100000} onChange={() => handlePriceChange(0, 100000)} className="mb-2 text-muted"/>
              <Form.Check type="radio" name="priceFilter" label="100.000đ - 200.000đ" 
                checked={priceRange.min === 100000 && priceRange.max === 200000} onChange={() => handlePriceChange(100000, 200000)} className="mb-2 text-muted"/>
              <Form.Check type="radio" name="priceFilter" label="200.000đ - 500.000đ" 
                checked={priceRange.min === 200000 && priceRange.max === 500000} onChange={() => handlePriceChange(200000, 500000)} className="mb-2 text-muted"/>
              <Form.Check type="radio" name="priceFilter" label="500.000đ - 1.000.000đ" 
                checked={priceRange.min === 500000 && priceRange.max === 1000000} onChange={() => handlePriceChange(500000, 1000000)} className="mb-2 text-muted"/>
              <Form.Check type="radio" name="priceFilter" label="Trên 1.000.000đ" 
                checked={priceRange.min === 1000000} onChange={() => handlePriceChange(1000000, 100000000)} className="mb-2 text-muted"/>
               <Form.Check type="radio" name="priceFilter" label="Tất cả mức giá" 
                checked={priceRange.max === 100000000 && priceRange.min === 0} onChange={() => handlePriceChange(0, 100000000)} className="mb-2 text-muted"/>
            </div>
          </div>

          <div className="mb-4 border p-3 bg-white rounded shadow-sm">
            <h6 className="fw-bold text-uppercase mb-3 small" style={{color: '#165c3e'}}>DANH MỤC</h6>
            <ListGroup variant="flush" className="small">
              <ListGroup.Item action as={Link} to="/category/Nam" className={`border-0 px-0 py-1 ${category === 'Nam' ? 'fw-bold text-success' : 'text-muted'}`}>Nước hoa Nam</ListGroup.Item>
              <ListGroup.Item action as={Link} to="/category/Nữ" className={`border-0 px-0 py-1 ${category === 'Nữ' ? 'fw-bold text-success' : 'text-muted'}`}>Nước hoa Nữ</ListGroup.Item>
              <ListGroup.Item action as={Link} to="/category/Unisex" className={`border-0 px-0 py-1 ${category === 'Unisex' ? 'fw-bold text-success' : 'text-muted'}`}>Nước hoa Unisex</ListGroup.Item>
            </ListGroup>
          </div>
        </Col>

        <Col md={9}>
          <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-4">
            <h4 className="text-uppercase fw-bold m-0 text-secondary">{pageTitle}</h4>
            <div className="d-flex align-items-center small">
              <span className="me-2 text-muted">Sắp xếp:</span>
              <Form.Select size="sm" style={{width: '150px'}} className="me-3 border-success" onChange={(e) => setSortType(e.target.value)}>
                <option value="newest">Hàng mới</option>
                <option value="low-high">Giá thấp đến cao</option>
                <option value="high-low">Giá cao xuống thấp</option>
              </Form.Select>
            </div>
          </div>

          <Row>
            {products.length > 0 ? products.map((product) => (
              <Col key={product._id} xs={6} md={4} lg={3} className="mb-4">
                <Card className="h-100 border-0 shadow-sm product-card">
                  <div className="position-relative overflow-hidden">
                     <Link to={`/product/${product._id}`}>
                        <Card.Img 
                            variant="top" 
                            src={product.image} 
                            style={{ height: '200px', objectFit: 'contain', padding: '10px' }} 
                        />
                     </Link>
                  </div>
                  <Card.Body className="text-center p-2 d-flex flex-column">
                    <p className="text-muted small mb-1 text-uppercase">{product.brand}</p>
                    <Card.Title as="div" className="mb-2" style={{minHeight: '40px'}}>
                        <Link to={`/product/${product._id}`} className="text-dark text-decoration-none fw-bold small text-uppercase product-link">
                            {product.name}
                        </Link>
                    </Card.Title>
                    <div className="mt-auto fw-bold" style={{color: '#B91C1C'}}>
                        {product.price.toLocaleString('vi-VN')}₫
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            )) : (
               <Col xs={12} className="text-center py-5">
                  <h5 className="text-muted">Không tìm thấy sản phẩm.</h5>
                  <Button variant="outline-dark" size="sm" onClick={() => window.location.href='/products/all'}>Xem tất cả</Button>
               </Col>
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default CategoryScreen;