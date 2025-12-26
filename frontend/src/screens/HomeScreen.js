import React, { useEffect, useState } from 'react';
import { Row, Col, Container, Carousel, Card, Button } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Danh sách logo thương hiệu
const brandLogos = [
    { name: 'Chanel', img: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/92/Chanel_logo_interlocking_cs.svg/1200px-Chanel_logo_interlocking_cs.svg.png' },
    { name: 'Dior', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Dior_Logo.svg/1200px-Dior_Logo.svg.png' },
    { name: 'Gucci', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Gucci_logo.svg/2560px-Gucci_logo.svg.png' },
    { name: 'YSL', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXDI_57sB2TzQ4pLPP1Es5UdMJ3E91y6AKsA&s' },
    { name: 'Versace', img: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Emblema_Medusa_versace.png' },
    { name: 'Tom Ford', img: 'https://i.pinimg.com/736x/53/aa/d8/53aad883f8da7086db3ea43dfdadd9b2.jpg' },
    { name: 'Louis Vuitton', img: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Louis_Vuitton_logo_and_wordmark.svg' },
    { name: 'Hermes', img: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e4/Herm%C3%A8s.svg/1200px-Herm%C3%A8s.svg.png' },
];

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const { keyword } = useParams(); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products', {
            params: { keyword: keyword } 
        });
        setProducts(data);
      } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
      }
    };
    fetchProducts();
  }, [keyword]);

  // === GIAO DIỆN TÌM KIẾM ===
  if (keyword) {
      return (
        <Container className="py-5">
            <h3 className="mb-4 text-center text-uppercase fw-light letter-spacing-2">Kết quả cho: "{keyword}"</h3>
            <hr className="width-50px mx-auto bg-dark mb-5" />
            {products.length === 0 ? (
                <div className="text-center py-5">
                    <h5 className="text-muted fw-light">Không tìm thấy sản phẩm nào.</h5>
                    <Link to="/" className="btn btn-outline-dark mt-3 rounded-0 px-4">QUAY LẠI TRANG CHỦ</Link>
                </div>
            ) : (
                <Row>
                    {products.map((product) => (
                        <Col key={product._id} sm={6} md={4} lg={3} className="mb-4">
                             <ProductCard product={product} />
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
      );
  }

  // Lọc sản phẩm theo danh mục (Lấy TẤT CẢ để chạy slider)
  const menProducts = products.filter(p => p.category === 'Nam');
  const womenProducts = products.filter(p => p.category === 'Nữ');
  const unisexProducts = products.filter(p => p.category === 'Unisex');

  return (
    <div className="home-screen bg-white">
      {/* 1. HERO SLIDER */}
      <Carousel fade interval={4000} controls={false} indicators={true}>
        <Carousel.Item>
          <div style={{ height: '390px', backgroundColor: '#1a1a1a' }}>
            <img 
                className="d-block w-100 h-101
                " 
                src="/images/banner-main-1.jpg"
                alt="Luxury Perfume" 
                style={{ objectFit: 'cover', opacity: 0.9 }} 
                onError={(e) => {e.target.src='https://bizweb.dktcdn.net/100/429/123/themes/824870/assets/slider_2.jpg?1764043051659'}}
            />
          </div>
          <Carousel.Caption className="d-none d-md-block text-center position-absolute top-50 start-50 translate-middle">
            <h1 className="display-4 fw-bold text-white text-shadow letter-spacing-2 mb-3">K-PERFUME</h1>
            <p className="lead text-white text-shadow mb-4">Tinh hoa hương thơm đẳng cấp thế giới.</p>
            <Link to="/products/all" className="btn btn-light rounded-0 px-4 py-2 fw-bold shadow letter-spacing-2 hover-scale" style={{fontSize: '0.9rem'}}>MUA NGAY</Link>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/* 2. DẢI THƯƠNG HIỆU */}
      <div className="brand-slider-container bg-white py-4 mb-5 border-bottom overflow-hidden">
        <div className="brand-slider-track">
            {[...brandLogos, ...brandLogos].map((brand, index) => (
                <div key={index} className="brand-slide">
                    <img src={brand.img} alt={brand.name} />
                </div>
            ))}
        </div>
      </div>

      <Container style={{ maxWidth: '1080px' }}> 
        
        {/* 3. NƯỚC HOA NAM (SLIDER) */}
        <Section 
            title="QUÝ ÔNG LỊCH LÃM" 
            subtitle="Nước hoa Nam" 
            link="/category/Nam" 
            products={menProducts}
            bannerImg="/images/men-banner.jpg" 
            fallbackBanner="https://bizweb.dktcdn.net/100/429/123/themes/824870/assets/sec_group_product_banner_1.jpg?1764043051659"
        />

        {/* 4. NƯỚC HOA NỮ (SLIDER) */}
        <Section 
            title="QUÝ CÔ THANH LỊCH" 
            subtitle="Nước hoa Nữ" 
            link="/category/Nữ" 
            products={womenProducts}
            bannerImg="/images/women-banner.jpg" 
            fallbackBanner="https://bizweb.dktcdn.net/100/429/123/themes/824870/assets/sec_group_product_banner_2.jpg?1764043051659"
        />

        {/* 5. NƯỚC HOA UNISEX (SLIDER) */}
        <Section 
            title="PHÁ CÁCH & ĐỘC BẢN" 
            subtitle="Nước hoa Unisex" 
            link="/category/Unisex" 
            products={unisexProducts}
            bannerImg="/images/unisex-banner.jpg" 
            fallbackBanner="https://images.unsplash.com/photo-1557827983-012eb6ea8dc1?auto=format&fit=crop&w=1200&q=80"
        />

      </Container>

      {/* CSS TÙY CHỈNH */}
      <style>{`
        .letter-spacing-2 { letter-spacing: 2px; }
        .text-shadow { text-shadow: 2px 2px 8px rgba(0,0,0,0.5); }
        .hover-scale:hover { transform: scale(1.05); transition: transform 0.3s; }
        .product-card-hover:hover { box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; transform: translateY(-5px); transition: all 0.3s ease; }
        .product-link:hover { color: #165c3e !important; }
        
        /* CSS cho Product Slider */
        .product-slider .carousel-control-prev,
        .product-slider .carousel-control-next {
            width: 5%;
            opacity: 0; /* Ẩn mặc định, hiện khi hover */
            transition: opacity 0.3s;
        }
        .product-slider:hover .carousel-control-prev,
        .product-slider:hover .carousel-control-next {
            opacity: 1;
        }
        .product-slider .carousel-control-prev-icon,
        .product-slider .carousel-control-next-icon {
            background-color: rgba(0,0,0,0.8); /* Mũi tên màu đen */
            border-radius: 50%;
            padding: 20px;
            background-size: 50%;
        }

        /* Brand Slider */
        .brand-slider-track { display: flex; width: calc(180px * 16); animation: scroll 40s linear infinite; }
        .brand-slide { width: 180px; height: 70px; display: flex; align-items: center; justify-content: center; padding: 0 25px; }
        .brand-slide img { max-width: 100%; max-height: 100%; filter: grayscale(100%); opacity: 0.5; transition: all 0.3s; }
        .brand-slide img:hover { filter: grayscale(0%); opacity: 1; transform: scale(1.1); }
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(calc(-180px * 8)); } }
      `}</style>
    </div>
  );
};

// Component hiển thị Section (Bao gồm Banner và Slider Sản phẩm)
const Section = ({ title, subtitle, link, products, bannerImg, fallbackBanner }) => {
    return (
        <div className="mb-5">
            <div className="d-flex justify-content-between align-items-end mb-3 border-bottom pb-2">
                <div>
                    <h3 className="fw-bold m-0 text-dark" style={{letterSpacing: '1px'}}>{title}</h3>
                    <p className="text-muted m-0 small letter-spacing-1 text-uppercase mt-1" style={{fontSize: '0.8rem'}}>{subtitle}</p>
                </div>
                <Link to={link} className="btn btn-outline-dark rounded-0 btn-sm px-3 fw-bold" style={{fontSize: '0.75rem'}}>XEM TẤT CẢ</Link>
            </div>
            
            {bannerImg && bannerImg !== "" && (
                <div className="mb-4 position-relative overflow-hidden shadow-sm">
                    <img 
                        src={bannerImg} 
                        alt={title} 
                        className="w-100 img-fluid" 
                        style={{ maxHeight: '280px', objectFit: 'cover', filter: 'brightness(0.95)' }} 
                        onError={(e) => {if(fallbackBanner) e.target.src = fallbackBanner}}
                    />
                </div>
            )}

            {/* --- PHẦN SLIDER SẢN PHẨM --- */}
            {products.length > 0 ? (
                <ProductSlider products={products} />
            ) : (
                <p className="text-center text-muted col-12 py-3">Đang cập nhật sản phẩm...</p>
            )}
        </div>
    );
};

// Component Slider Sản phẩm (Carousel 4 item)
const ProductSlider = ({ products }) => {
    const chunkSize = 4; // Số sản phẩm mỗi slide
    const chunks = [];
    
    for (let i = 0; i < products.length; i += chunkSize) {
        chunks.push(products.slice(i, i + chunkSize));
    }

    return (
        <Carousel 
            interval={4000} 
            indicators={false} 
            className="product-slider"
            prevIcon={<span aria-hidden="true" className="carousel-control-prev-icon" />}
            nextIcon={<span aria-hidden="true" className="carousel-control-next-icon" />}
        >
            {chunks.map((chunk, index) => (
                <Carousel.Item key={index}>
                    <Row>
                        {chunk.map((product) => (
                            <Col key={product._id} sm={6} md={4} lg={3} className="mb-4">
                                <ProductCard product={product} />
                            </Col>
                        ))}
                    </Row>
                </Carousel.Item>
            ))}
        </Carousel>
    );
};

// Component Card Sản phẩm (Giữ nguyên thiết kế cũ)
const ProductCard = ({ product }) => (
    <Card className="h-100 border-0 shadow-sm product-card-hover bg-white">
        <Link to={`/product/${product._id}`} className="overflow-hidden position-relative d-flex align-items-center justify-content-center" style={{height: '240px', backgroundColor: '#fff'}}>
            <Card.Img 
                variant="top" 
                src={product.image} 
                style={{ height: '80%', objectFit: 'contain', padding: '10px' }} 
            />
        </Link>
        <Card.Body className="text-center d-flex flex-column pt-2 pb-3">
            <div className="text-muted small text-uppercase mb-1 fw-bold" style={{fontSize: '0.65rem'}}>{product.brand}</div>
            <Card.Title as="div" className="mb-1" style={{minHeight: '40px'}}>
                <Link to={`/product/${product._id}`} className="text-dark text-decoration-none fw-bold product-link text-uppercase px-1 d-block" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>
                    {product.name}
                </Link>
            </Card.Title>
            <div className="mt-auto">
                <h5 className="text-danger fw-bold mb-2 fs-6">{product.price.toLocaleString('vi-VN')}₫</h5>
                <Link to={`/product/${product._id}`} className="btn btn-dark w-100 mx-auto rounded-0 text-uppercase fw-bold py-1" style={{fontSize: '0.75rem', letterSpacing: '1px'}}>
                    Mua Ngay
                </Link>
            </div>
        </Card.Body>
    </Card>
);

export default HomeScreen;