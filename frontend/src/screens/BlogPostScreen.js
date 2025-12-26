// src/screens/BlogPostScreen.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Image, Card } from 'react-bootstrap';
import axios from 'axios';
import Loader from '../components/Loader';
import Message from '../components/Message';
import BlogSidebar from '../components/BlogSidebar'; // Đảm bảo bạn đã có file này
import { FaCalendarAlt, FaUser, FaEye, FaTag, FaArrowLeft } from 'react-icons/fa';

const BlogPostScreen = () => {
    const { slug } = useParams(); 
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                // Gọi API lấy bài viết (backend route đã hỗ trợ lấy theo ID hoặc Slug)
                const { data } = await axios.get(`/api/blog-posts/${slug}`);
                setPost(data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };
        fetchPost();
    }, [slug]);

    if (loading) return <Loader />;
    if (error) return <Message variant="danger">{error}</Message>;
    if (!post) return <Message variant="info">Không tìm thấy bài viết.</Message>;

    return (
        <Container className="mt-4">
            <Row>
                {/* Cột Sidebar (Danh mục) */}
                <Col md={3} className="d-none d-md-block">
                    <BlogSidebar />
                </Col>

                {/* Cột Nội dung bài viết */}
                <Col md={9}>
                    <Link to="/blog" className="btn btn-light my-3">
                        <FaArrowLeft className="me-2" /> Quay lại Blog
                    </Link>

                    <Card className="border-0 shadow-sm mb-5">
                        {post.image && (
                            <Image 
                                src={post.image} 
                                alt={post.title} 
                                fluid 
                                className="rounded-top" 
                                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                            />
                        )}
                        
                        <Card.Body className="p-4">
                            <h1 className="fw-bold mb-3" style={{ color: '#0f4c3b' }}>
                                {post.title}
                            </h1>
                            
                            <div className="text-muted mb-4 small border-bottom pb-3">
                                <span className="me-3">
                                    <FaUser className="me-1" /> {post.user?.name}
                                </span>
                                <span className="me-3">
                                    <FaCalendarAlt className="me-1" /> {post.createdAt.substring(0, 10)}
                                </span>
                                <span className="me-3">
                                    <FaEye className="me-1" /> {post.views} lượt xem
                                </span>
                                {post.category && (
                                     <span>
                                        <FaTag className="me-1" /> {post.category.name}
                                     </span>
                                )}
                            </div>

                            {/* Hiển thị nội dung (xử lý xuống dòng) */}
                            <div className="blog-content" style={{ fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                                {post.content}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default BlogPostScreen;