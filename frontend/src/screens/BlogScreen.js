// src/screens/BlogScreen.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import BlogSidebar from '../components/BlogSidebar';
import Loader from '../components/Loader';
import Message from '../components/Message';
import './BlogScreen.css'; // Nhớ import file CSS mới tạo

const BlogScreen = () => {
    const { categoryName } = useParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get('/api/blog-posts');
                
                let filteredPosts = data;
                if (categoryName) {
                    filteredPosts = data.filter(
                        (post) => post.category && post.category.name === categoryName
                    );
                }
                setPosts(filteredPosts);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };
        fetchPosts();
    }, [categoryName]);

    // Hàm formatDate để hiển thị ngày tháng đẹp (dd/mm/yyyy)
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    return (
        <div className="blog-container py-4">
            <Container>
                {/* Breadcrumb giả lập (tùy chọn) */}
                <div className="mb-3 text-muted small">
                    <Link to="/">Trang chủ</Link> / <span>Blog</span>
                </div>

                <Row>
                    {/* CỘT TRÁI: SIDEBAR (3 phần) */}
                    <Col lg={3} md={4} className="d-none d-md-block">
                        <BlogSidebar />
                    </Col>

                    {/* CỘT PHẢI: NỘI DUNG (9 phần) */}
                    <Col lg={9} md={8}>
                        <h2 className="blog-main-title">Blog</h2>

                        {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
                            <div>
                                {posts.map((post) => (
                                    <Row key={post._id} className="blog-item">
                                        {/* Hình ảnh (Bên trái - chiếm 4/12) */}
                                        <Col sm={4} className="mb-3 mb-sm-0">
                                            <Link to={`/blog/post/${post.slug || post._id}`}>
                                                <div className="blog-item-img-container">
                                                    <img 
                                                        src={post.image} 
                                                        alt={post.title} 
                                                        className="blog-item-img"
                                                    />
                                                </div>
                                            </Link>
                                        </Col>

                                        {/* Nội dung (Bên phải - chiếm 8/12) */}
                                        <Col sm={8}>
                                            <Link to={`/blog/post/${post.slug || post._id}`}>
                                                <h3 className="blog-item-title">{post.title}</h3>
                                            </Link>
                                            
                                            <div className="blog-meta">
                                                {formatDate(post.createdAt)} - Đăng bởi {post.user?.name || 'Admin'}
                                            </div>

                                            <p className="blog-excerpt">
                                                {/* Cắt nội dung khoảng 180 ký tự */}
                                                {post.content.replace(/<[^>]+>/g, '').substring(0, 180)}...
                                            </p>
                                        </Col>
                                    </Row>
                                ))}
                            </div>
                        )}
                        
                        {/* Phân trang (Pagination - Tĩnh) */}
                        {!loading && posts.length > 0 && (
                            <div className="d-flex justify-content-center mt-4">
                                <ul className="pagination">
                                    <li className="page-item active"><span className="page-link">1</span></li>
                                    <li className="page-item"><span className="page-link">2</span></li>
                                    <li className="page-item"><span className="page-link">3</span></li>
                                    <li className="page-item"><span className="page-link">...</span></li>
                                </ul>
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default BlogScreen;