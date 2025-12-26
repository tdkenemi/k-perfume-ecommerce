import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar, Nav, Container, Badge, NavDropdown, Row, Col, Form, InputGroup, Button, Image } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaSearch } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext';

const Header = () => {
    const { state: cartState } = useContext(CartContext);
    const { cartItems } = cartState;
    const { userInfo, logout } = useContext(AuthContext);
    
    const { wishlistItems } = useContext(WishlistContext);

    const [keyword, setKeyword] = useState('');
    const [brands, setBrands] = useState([]);

    const navigate = useNavigate();

    const submitSearchHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search/${keyword}`);
        } else {
            navigate('/');
        }
    };

    const logoutHandler = () => {
        logout();
    };

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const { data } = await axios.get('/api/products/brands');
                setBrands(data);
            } catch (err) { console.error(err); }
        };
        fetchBrands();
    }, []);

    return (
        <header className="sticky-top" style={{ zIndex: 1020 }}> 
            
            {/* TOP BAR MÀU XANH */}
            <div style={{ backgroundColor: '#0f4c36', padding: '15px 0' }}>
                <Container>
                    <Row className="align-items-center">
                        
                        {/* 1. SEARCH */}
                        <Col md={4} className="d-none d-md-block">
                            <Form onSubmit={submitSearchHandler}>
                                <InputGroup>
                                    <Form.Control
                                        type="text"
                                        placeholder="Tìm kiếm sản phẩm..."
                                        className="border-0 rounded-0"
                                        style={{ height: '40px' }}
                                        onChange={(e) => setKeyword(e.target.value)}
                                    />
                                    <Button type="submit" variant="light" className="bg-white border-0 rounded-0 text-muted">
                                        <FaSearch />
                                    </Button>
                                </InputGroup>
                            </Form>
                        </Col>

                        {/* 2. LOGO */}
                        <Col md={4} xs={6} className="text-center">
                            <Link to="/">
                                <Image 
                                    src="/images/logo-header.png" 
                                    alt="K-perfume"
                                    style={{ maxHeight: '70px', objectFit: 'contain' }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                    }}
                                />
                                <h2 style={{display: 'none', color: 'white', fontFamily: 'serif', margin: 0}}>K-PERFUME</h2>
                            </Link>
                        </Col>

                        {/* 3. USER & CART */}
                        <Col md={4} xs={6}>
                            <div className="d-flex justify-content-end align-items-center text-white">
                                <div className="text-end me-3 d-none d-md-block" style={{lineHeight: '1.2'}}>
                                    <small className="d-block" style={{opacity: 0.8}}>Xin chào, {userInfo ? userInfo.name : 'Khách'}</small>
                                    
                                    {userInfo ? (
                                        <NavDropdown 
                                            title={
                                                <div className="d-inline-flex align-items-center header-user-title">
                                                     {/* Avatar nhỏ trên menu */}
                                                    <img 
                                                        src={userInfo.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                                                        alt="avatar"
                                                        style={{ width: '25px', height: '25px', borderRadius: '50%', marginRight: '5px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.5)' }} 
                                                    />
                                                    <span>Tài khoản</span>
                                                </div>
                                            } 
                                            id="username"
                                        >
                                            <LinkContainer to="/profile">
                                                <NavDropdown.Item>Hồ sơ cá nhân</NavDropdown.Item>
                                            </LinkContainer>
                                            
                                            {userInfo.isAdmin && (
                                                <>
                                                    <NavDropdown.Divider />
                                                    <NavDropdown.Header>Quản trị</NavDropdown.Header>
                                                    <LinkContainer to="/admin/dashboard"><NavDropdown.Item>Dashboard</NavDropdown.Item></LinkContainer>
                                                    <LinkContainer to="/admin/productlist"><NavDropdown.Item>Sản phẩm</NavDropdown.Item></LinkContainer>
                                                    <LinkContainer to="/admin/orderlist"><NavDropdown.Item>Đơn hàng</NavDropdown.Item></LinkContainer>
                                                    <LinkContainer to="/admin/userlist"><NavDropdown.Item>Người dùng</NavDropdown.Item></LinkContainer>
                                                    <LinkContainer to="/admin/refunds"><NavDropdown.Item>Quản lý Hoàn tiền</NavDropdown.Item></LinkContainer>
                                                </>
                                            )}
                                            
                                            <NavDropdown.Divider />
                                            <NavDropdown.Item onClick={logoutHandler} className="text-danger fw-bold">Đăng xuất</NavDropdown.Item>
                                        </NavDropdown>
                                    ) : (
                                        <div style={{fontWeight: 'bold', fontSize: '0.9rem'}}>
                                            <Link to="/login" className="header-top-link">Đăng nhập</Link>
                                            <span className="mx-1">hoặc</span>
                                            <Link to="/register" className="header-top-link">Đăng ký</Link>
                                        </div>
                                    )}
                                </div>

                                <div className="d-none d-md-block" style={{height: '35px', borderLeft: '1px solid rgba(255,255,255,0.3)', margin: '0 15px'}}></div>

                                {/* Wishlist Icon */}
                                <Link to="/wishlist" className="text-white me-3 position-relative header-icon-link">
                                    <FaHeart size={22} />
                                    {wishlistItems && wishlistItems.length > 0 && (
                                        <Badge pill bg="danger" style={{ position: 'absolute', top: '-8px', right: '-10px', fontSize: '0.65rem' }}>
                                            {wishlistItems.length}
                                        </Badge>
                                    )}
                                </Link>

                                {/* Cart Icon */}
                                <Link to="/cart" className="text-white position-relative header-icon-link">
                                    <FaShoppingCart size={22} />
                                    {cartItems.length > 0 && (
                                        <Badge pill bg="danger" style={{ position: 'absolute', top: '-8px', right: '-10px', fontSize: '0.65rem' }}>
                                            {cartItems.length}
                                        </Badge>
                                    )}
                                </Link>
                            </div>
                        </Col>
                    </Row>
                    
                    <div className="d-block d-md-none mt-3">
                        <Form onSubmit={submitSearchHandler}>
                            <InputGroup>
                                <Form.Control placeholder="Tìm kiếm..." onChange={(e) => setKeyword(e.target.value)} />
                                <Button type="submit" variant="light"><FaSearch /></Button>
                            </InputGroup>
                        </Form>
                    </div>
                </Container>
            </div>

            {/* NAVBAR MENU (MÀU TRẮNG - CHỮ ĐEN) */}
            <Navbar bg="white" variant="light" expand="lg" className="shadow-sm py-0">
                <Container>
                    <Navbar.Toggle aria-controls="main-nav" className="my-2" />
                    <Navbar.Collapse id="main-nav">
                        <Nav className="mx-auto fw-bold text-uppercase py-2" style={{fontSize: '0.9rem'}}>
                            <LinkContainer to="/"><Nav.Link className="px-3 hover-green">Trang chủ</Nav.Link></LinkContainer>
                            <LinkContainer to="/about"><Nav.Link className="px-3 hover-green">Giới thiệu</Nav.Link></LinkContainer>
                            
                            <NavDropdown title="Thương hiệu" id="brand-nav" className="px-2 hover-green-dropdown">
                                {brands.map(brand => (
                                    <LinkContainer key={brand} to={`/brand/${brand}`}><NavDropdown.Item>{brand}</NavDropdown.Item></LinkContainer>
                                ))}
                            </NavDropdown>

                            <NavDropdown title="Nước hoa" id="cat-nav" className="px-2 hover-green-dropdown">
                                <LinkContainer to="/category/Nam"><NavDropdown.Item>Nước hoa Nam</NavDropdown.Item></LinkContainer>
                                <LinkContainer to="/category/Nữ"><NavDropdown.Item>Nước hoa Nữ</NavDropdown.Item></LinkContainer>
                                <LinkContainer to="/category/Unisex"><NavDropdown.Item>Nước hoa Unisex</NavDropdown.Item></LinkContainer>
                            </NavDropdown>

                            <LinkContainer to="/blog"><Nav.Link className="px-3 hover-green">Blog</Nav.Link></LinkContainer>
                            <LinkContainer to="/contact"><Nav.Link className="px-3 hover-green">Liên hệ</Nav.Link></LinkContainer>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* CSS TÙY CHỈNH MỚI */}
            <style>{`
                /* 1. Link Đăng nhập/Đăng ký trên nền xanh */
                .header-top-link { color: rgba(255,255,255,0.9) !important; text-decoration: none; transition: color 0.3s; }
                .header-top-link:hover { color: #ffd700 !important; /* Đổi sang màu Vàng Kim khi hover */ }

                /* 2. Tên User (Dropdown) trên nền xanh */
                #username { color: white !important; font-weight: bold; text-decoration: none; display: flex; align-items: center; transition: color 0.3s; }
                #username:hover { color: #ffd700 !important; } /* Đổi sang màu Vàng Kim khi hover */
                #username::after { color: white; display: inline-block; margin-left: 0.255em; vertical-align: 0.255em; content: ""; border-top: 0.3em solid; border-right: 0.3em solid transparent; border-bottom: 0; border-left: 0.3em solid transparent; }
                .header-user-title { color: inherit; }

                /* 3. Icon Giỏ hàng & Tim */
                .header-icon-link:hover { color: #ffd700 !important; transform: scale(1.1); transition: all 0.3s; }

                /* 4. Menu Dropdown (Nền trắng, chữ đen) */
                .dropdown-menu { border-radius: 0; box-shadow: 0 5px 15px rgba(0,0,0,0.1); margin-top: 10px; }
                .dropdown-menu a.dropdown-item { color: #333 !important; font-weight: normal; }
                .dropdown-menu a.dropdown-item:hover { background-color: #f8f9fa; color: #0f4c36 !important; }

                /* 5. Menu Navbar dưới (Nền trắng, chữ đen, hover xanh) */
                .hover-green:hover { color: #0f4c36 !important; }
                .navbar-toggler { border: none; }
            `}</style>
        </header>
    );
};

export default Header;