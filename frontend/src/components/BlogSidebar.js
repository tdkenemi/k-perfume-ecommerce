import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaAngleRight, FaCaretRight } from 'react-icons/fa';

const BlogSidebar = () => {
    const [featuredPosts, setFeaturedPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await axios.get('/api/blog-posts');
                setFeaturedPosts(data.slice(0, 4));
            } catch (error) {
                console.error(error);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className="mb-5">
            {/* --- PHẦN 1: DANH MỤC --- */}
            <div className="mb-4">
                <h5 className="blog-sidebar-title">DANH MỤC</h5>
                <ul className="sidebar-menu">
                    {/* 1. Trang chủ */}
                    <li>
                        <Link to="/">
                            Trang chủ <FaAngleRight className="float-end text-muted" size={12} />
                        </Link>
                    </li>
                    
                    {/* 2. Giới thiệu */}
                    <li>
                        <Link to="/about">
                            Giới thiệu <FaAngleRight className="float-end text-muted" size={12} />
                        </Link>
                    </li>

                    {/* 3. Nước hoa (ĐÃ CẬP NHẬT: Thêm mục con giống Header) */}
                    <li>
                        <Link to="/products/all" className="d-flex justify-content-between align-items-center">
                            Nước hoa <FaAngleRight className="text-muted" size={12} />
                        </Link>
                        {/* Danh sách con (Nam, Nữ, Unisex) */}
                        <ul className="list-unstyled ms-3 mt-2 mb-0" style={{ fontSize: '0.9rem', borderLeft: '2px solid #f0f0f0', paddingLeft: '10px' }}>
                            <li className="border-0 py-1">
                                <Link to="/category/Nam" className="text-secondary d-block">
                                    <FaCaretRight className="me-1" size={10}/> Nước hoa Nam
                                </Link>
                            </li>
                            <li className="border-0 py-1">
                                <Link to="/category/Nữ" className="text-secondary d-block">
                                    <FaCaretRight className="me-1" size={10}/> Nước hoa Nữ
                                </Link>
                            </li>
                            <li className="border-0 py-1">
                                <Link to="/category/Unisex" className="text-secondary d-block">
                                    <FaCaretRight className="me-1" size={10}/> Nước hoa Unisex
                                </Link>
                            </li>
                        </ul>
                    </li>

                    {/* 4. Kiến thức */}
                    <li>
                        <Link to="/knowledge">
                            Kiến thức <FaAngleRight className="float-end text-muted" size={12} />
                        </Link>
                    </li>

                    {/* 5. Blog */}
                    <li>
                        <Link to="/blog" className="fw-bold text-success">
                            Blog <FaAngleRight className="float-end text-muted" size={12} />
                        </Link>
                    </li>

                    {/* 6. Liên hệ */}
                    <li>
                        <Link to="/contact">
                            Liên hệ <FaAngleRight className="float-end text-muted" size={12} />
                        </Link>
                    </li>
                </ul>
            </div>

            {/* --- PHẦN 2: NỔI BẬT --- */}
            <div>
                <h5 className="blog-sidebar-title">NỔI BẬT</h5>
                {featuredPosts.map((post) => (
                    <div key={post._id} className="featured-item">
                        <Link to={`/blog/post/${post.slug || post._id}`}>
                            <img 
                                src={post.image} 
                                alt={post.title} 
                                className="featured-img"
                            />
                        </Link>
                        <div className="flex-grow-1">
                            <h6 className="featured-title">
                                <Link to={`/blog/post/${post.slug || post._id}`}>
                                    {post.title.length > 45 ? post.title.substring(0, 45) + '...' : post.title}
                                </Link>
                            </h6>
                            <small className="text-muted" style={{fontSize: '11px'}}>
                                {post.createdAt.substring(0, 10)}
                            </small>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogSidebar;