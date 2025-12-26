// src/components/Product.js
import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Product = ({ product }) => {
  return (
    // THAY ĐỔI DÒNG NÀY: Thêm className và bỏ p-3
    <Card className="my-3 rounded shadow-sm h-100 product-card">
      <Link to={`/product/${product._id}`}>
        {/* Thêm className cho ảnh */}
        <Card.Img src={product.image} variant="top" className="product-card-img" />
      </Link>

      {/* Căn nội dung bằng flex */}
      <Card.Body className="d-flex flex-column p-4">
        <Link to={`/product/${product._id}`} className="text-decoration-none">
          {/* Thêm className cho tiêu đề */}
          <Card.Title as="div" className="product-title">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        {/* mt-auto đẩy giá xuống dưới cùng */}
        <Card.Text as="h3" className="mt-auto pt-2">
          {product.price.toLocaleString('vi-VN')} VND
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;