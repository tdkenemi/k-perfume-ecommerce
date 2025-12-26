import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaQrcode, FaTruck,  } from 'react-icons/fa';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { CartContext } from '../context/CartContext';

const PaymentScreen = () => {
  const { state, dispatch } = useContext(CartContext);
  const { shippingAddress } = state;
  const navigate = useNavigate();

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const [paymentMethod, setPaymentMethod] = useState('QRCode'); // Mặc định chọn QR Code

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch({
      type: 'CART_SAVE_PAYMENT_METHOD',
      payload: paymentMethod,
    });
    navigate('/placeorder');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1 className="mb-4 text-center" style={{color: '#165c3e'}}>Phương thức Thanh toán</h1>
      
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-4">
          <Form.Label as="legend" className="mb-3 fw-bold">Chọn hình thức thanh toán:</Form.Label>
          <Col>
            
            {/* Lựa chọn 1: Chuyển khoản QR Code (VietQR) */}
            <div className={`p-3 border rounded mb-3 ${paymentMethod === 'QRCode' ? 'border-success bg-light' : ''}`} style={{cursor: 'pointer'}} onClick={() => setPaymentMethod('QRCode')}>
                <Form.Check
                  type='radio'
                  label={
                      <div className="d-flex align-items-center">
                          <FaQrcode className="me-3 fs-4 text-success" />
                          <div>
                              <span className="fw-bold">Chuyển khoản Ngân hàng (QR Code)</span>
                              <div className="small text-muted">Quét mã QR để thanh toán nhanh chóng, tự động.</div>
                          </div>
                      </div>
                  }
                  id='QRCode'
                  name='paymentMethod'
                  value='QRCode'
                  checked={paymentMethod === 'QRCode'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
            </div>

            {/* Lựa chọn 2: COD */}
            <div className={`p-3 border rounded mb-3 ${paymentMethod === 'COD' ? 'border-success bg-light' : ''}`} style={{cursor: 'pointer'}} onClick={() => setPaymentMethod('COD')}>
                <Form.Check
                  type='radio'
                  label={
                      <div className="d-flex align-items-center">
                          <FaTruck className="me-3 fs-4 text-warning" />
                          <div>
                              <span className="fw-bold">Thanh toán khi nhận hàng (COD)</span>
                              <div className="small text-muted">Nhận hàng, kiểm tra rồi mới thanh toán tiền mặt.</div>
                          </div>
                      </div>
                  }
                  id='COD'
                  name='paymentMethod'
                  value='COD'
                  checked={paymentMethod === 'COD'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
            </div>

          </Col>
        </Form.Group>

        <Button type='submit' variant='primary' className="w-100 py-2 fw-bold" style={{backgroundColor: '#165c3e'}}>
          Tiếp tục
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;