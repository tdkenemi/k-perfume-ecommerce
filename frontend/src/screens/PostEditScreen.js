import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Image } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';

const PostEditScreen = () => {
  const { id: postId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [content, setContent] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`/api/blog-posts/${postId}`);
        setTitle(data.title);
        setImage(data.image);
        setContent(data.content);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = await axios.post('/api/upload', formData, config);
      setImage(data); // Backend trả về đường dẫn ảnh
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.put(
        `/api/blog-posts/${postId}`,
        { title, image, content },
        config
      );
      navigate('/admin/postlist');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Link to="/admin/postlist" className="btn btn-light my-3">Quay lại</Link>
      <h1>Chỉnh sửa Bài viết</h1>
      {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
        <Form onSubmit={submitHandler}>
          {/* 1. TIÊU ĐỀ */}
          <Form.Group controlId="title" className="mb-3">
            <Form.Label>Tiêu đề</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tiêu đề"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></Form.Control>
          </Form.Group>

          {/* 2. HÌNH ẢNH */}
          <Form.Group controlId="image" className="mb-3">
            <Form.Label>Hình ảnh</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập đường dẫn ảnh"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            ></Form.Control>
            
            {/* Nút Upload */}
            <Form.Control 
                type="file" 
                label="Chọn file" 
                onChange={uploadFileHandler}
                className="mt-2" 
            />
            {uploading && <Loader />}
            
            {/* Xem trước ảnh */}
            {image && (
                <div className="mt-2">
                    <Image src={image} fluid rounded style={{ maxHeight: '200px' }} />
                </div>
            )}
          </Form.Group>

          {/* 3. NỘI DUNG */}
          <Form.Group controlId="content" className="mb-3">
            <Form.Label>Nội dung</Form.Label>
            <Form.Control
              as="textarea"
              rows={8}
              placeholder="Nhập nội dung bài viết"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary">Cập nhật Bài viết</Button>
        </Form>
      )}
    </Container>
  );
};

export default PostEditScreen;