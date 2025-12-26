// src/components/FormContainer.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const FormContainer = ({ children }) => {
  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          {/* THÊM DIV BỌC VỚI STYLE MỚI */}
          <div className="p-4 p-md-5 bg-white rounded shadow-sm">
            {children}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default FormContainer;