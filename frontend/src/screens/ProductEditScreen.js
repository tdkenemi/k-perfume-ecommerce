import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Image, Row, Col } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');     
  const [images, setImages] = useState([]);   
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState(''); // State danh mục
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${productId}`);
        
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setImages(data.images || []);
        setBrand(data.brand);
        setCategory(data.category); // Load danh mục cũ lên
        setCountInStock(data.countInStock);
        setDescription(data.description);
        setDetailedDescription(data.detailedDescription || '');
        
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const uploadFileHandler = async (e, isMainImage = true) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = await axios.post('/api/upload', formData, config);

      if (isMainImage) {
        setImage(data);
      } else {
        setImages((prevImages) => [...prevImages, data]);
      }
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
      alert('Lỗi upload ảnh');
    }
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
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
        `/api/products/${productId}`,
        {
          name, 
          price, 
          image, 
          images,
          brand, 
          category, 
          description, 
          detailedDescription, 
          countInStock,
        },
        config
      );
      
      navigate('/admin/productlist');
    } catch (error) {
      console.error(error);
      setError('Lỗi khi cập nhật sản phẩm: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Container>
      <Link to="/admin/productlist" className="btn btn-light my-3">Quay lại</Link>
      <h1>Chỉnh sửa Sản phẩm</h1>
      
      {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
        <Form onSubmit={submitHandler}>
          <Row>
            {/* CỘT TRÁI */}
            <Col md={8}>
                <Form.Group controlId="name" className="mb-3"><Form.Label>Tên sản phẩm</Form.Label><Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} /></Form.Group>
                
                <Row>
                    <Col md={6}><Form.Group controlId="price" className="mb-3"><Form.Label>Giá (VND)</Form.Label><Form.Control type="number" value={price} onChange={(e) => setPrice(e.target.value)} /></Form.Group></Col>
                    <Col md={6}><Form.Group controlId="countInStock" className="mb-3"><Form.Label>Tồn kho</Form.Label><Form.Control type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} /></Form.Group></Col>
                </Row>

                <Row>
                    <Col md={6}><Form.Group controlId="brand" className="mb-3"><Form.Label>Thương hiệu</Form.Label><Form.Control type="text" value={brand} onChange={(e) => setBrand(e.target.value)} /></Form.Group></Col>
                    
                    {/* --- SỬA THÀNH DROPDOWN CHỌN DANH MỤC --- */}
                    <Col md={6}>
                        <Form.Group controlId="category" className="mb-3">
                            <Form.Label>Danh mục</Form.Label>
                            <Form.Select 
                                value={category} 
                                onChange={(e) => setCategory(e.target.value)}
                                style={{ cursor: 'pointer' }}
                            >
                                <option value="">-- Chọn danh mục --</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Unisex">Unisex</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    {/* ------------------------------------------ */}
                </Row>

                <Form.Group controlId="description" className="mb-3">
                    <Form.Label>Mô tả ngắn</Form.Label>
                    <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="detailedDescription" className="mb-3">
                    <Form.Label className="fw-bold text-primary">Bài viết chi tiết</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={10} 
                        placeholder="Nhập thông tin chi tiết..." 
                        value={detailedDescription} 
                        onChange={(e) => setDetailedDescription(e.target.value)} 
                        style={{backgroundColor: '#f8f9fa'}}
                    />
                </Form.Group>
            </Col>

            {/* CỘT PHẢI: HÌNH ẢNH */}
            <Col md={4}>
                <div className="p-3 border bg-light rounded">
                    <h5 className="mb-3">Quản lý Hình ảnh</h5>
                    
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Ảnh chính</Form.Label>
                        <Form.Control type="text" value={image} onChange={(e) => setImage(e.target.value)} className="mb-2"/>
                        <Form.Control type="file" onChange={(e) => uploadFileHandler(e, true)} />
                        {image && <Image src={image} fluid className="mt-2 border bg-white p-1" style={{maxHeight:'150px'}} />}
                    </Form.Group>
                    
                    <hr/>
                    
                    <Form.Group>
                        <Form.Label className="fw-bold">Album ảnh phụ ({images.length})</Form.Label>
                        <Form.Control type="file" onChange={(e) => uploadFileHandler(e, false)} />
                        <div className="d-flex flex-wrap mt-2 gap-2">
                            {images.map((img, idx) => (
                                <div key={idx} className="position-relative" style={{width: '70px', height: '70px'}}>
                                    <Image src={img} style={{width:'100%', height:'100%', objectFit:'cover'}} rounded />
                                    <Button 
                                        variant="danger" 
                                        size="sm" 
                                        className="position-absolute top-0 end-0 p-0" 
                                        style={{width:'20px', height:'20px', lineHeight:'10px'}} 
                                        onClick={() => removeImage(idx)}
                                    >
                                        &times;
                                    </Button>
                                </div>
                            ))}
                        </div>
                        {uploading && <Loader />}
                    </Form.Group>
                </div>
            </Col>
          </Row>
          <Button type="submit" variant="primary" className="mt-3 w-100 btn-lg">Cập nhật Sản phẩm</Button>
        </Form>
      )}
    </Container>
  );
};

export default ProductEditScreen;