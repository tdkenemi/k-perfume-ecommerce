import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Table, Button, Container, Row, Col, Image } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';

const PostListScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/blog-posts');
      setPosts(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchPosts();
    } else {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  const createPostHandler = async () => {
    // Tạo bài viết nháp rồi chuyển ngay sang trang Edit
    try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.post('/api/blog-posts', {}, config);
        navigate(`/admin/post/${data._id}/edit`);
    } catch (error) {
        console.error(error);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Xóa bài viết này?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`/api/blog-posts/${id}`, config);
        fetchPosts();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Container fluid>
      <Row className="align-items-center my-4">
        <Col><h1>Quản lý Bài viết</h1></Col>
        <Col className="text-end">
          <Button className="my-3" onClick={createPostHandler}>
            <FaPlus className="me-2"/> Tạo Bài viết Mới
          </Button>
        </Col>
      </Row>
      {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>HÌNH ẢNH</th>
              <th>TIÊU ĐỀ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post._id}>
                <td>{post._id}</td>
                <td><Image src={post.image} style={{ width: '50px' }} fluid rounded /></td>
                <td>{post.title}</td>
                <td>
                  <LinkContainer to={`/admin/post/${post._id}/edit`}>
                    <Button variant="light" className="btn-sm mx-1"><FaEdit /></Button>
                  </LinkContainer>
                  <Button variant="danger" className="btn-sm mx-1" onClick={() => deleteHandler(post._id)}>
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default PostListScreen;