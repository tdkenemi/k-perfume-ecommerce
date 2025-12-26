// src/screens/ProductListScreen.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Table, Button, Container, Row, Col, Image } from 'react-bootstrap'; // <--- Thêm Image
import { FaBoxOpen, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';

// Hàm helper format tiền
const formatCurrency = (amount) => {
  return amount.toLocaleString('vi-VN');
};

const ProductListScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State cho việc xóa và tạo
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [errorDelete, setErrorDelete] = useState(null);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [errorCreate, setErrorCreate] = useState(null);

  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  // Hàm để tải lại danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:5000/api/products');
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchProducts();
    }
  }, [userInfo]);

  const deleteHandler = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        setLoadingDelete(true);
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`http://localhost:5000/api/products/${id}`, config);
        setLoadingDelete(false);
        fetchProducts(); // Tải lại danh sách
      } catch (err) {
        setErrorDelete(err.response?.data?.message || err.message);
        setLoadingDelete(false);
      }
    }
  };

  const createProductHandler = async () => {
    if (window.confirm('Tạo một sản phẩm mẫu mới?')) {
      try {
        setLoadingCreate(true);
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.post('http://localhost:5000/api/products', {}, config);
        setLoadingCreate(false);
        navigate(`/admin/product/${data._id}/edit`); // Chuyển trang
      } catch (err) {
        setErrorCreate(err.response?.data?.message || err.message);
        setLoadingCreate(false);
      }
    }
  };

  return (
    <Container>
      <Row className="align-items-center my-4">
        <Col>
          <h1><FaBoxOpen className="me-2" />Quản lý Sản phẩm</h1>
        </Col>
        <Col className="text-end">
          <Button onClick={createProductHandler} disabled={loadingCreate}>
            {loadingCreate ? <Loader size="sm" /> : <><FaPlus className="me-1" /> Tạo Sản phẩm</>}
          </Button>
        </Col>
      </Row>
      
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm bg-white shadow-sm rounded align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>HÌNH ẢNH</th> {/* <--- 1. THÊM CỘT HÌNH ẢNH */}
              <th>TÊN</th>
              <th>GIÁ</th>
              <th>LOẠI</th>
              <th>HÃNG</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>

                {/* <--- 2. THÊM Ô CHỨA ẢNH */}
                <td className="text-center">
                    <Image 
                        src={product.image} 
                        alt={product.name} 
                        fluid 
                        rounded 
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                    />
                </td>
                {/* --------------------------- */}

                <td>{product.name}</td>
                <td>{formatCurrency(product.price)} VND</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button variant="light" className="btn-sm mx-1">
                      <FaEdit />
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm mx-1"
                    onClick={() => deleteHandler(product._id)}
                    disabled={loadingDelete}
                  >
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

export default ProductListScreen;