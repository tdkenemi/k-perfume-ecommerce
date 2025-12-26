import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Table, Button, Container } from 'react-bootstrap';
import { FaClipboardList, FaCheck, FaTimes, FaTrash, FaEye } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';

// Hàm helper format tiền
const formatCurrency = (amount) => {
  return amount.toLocaleString('vi-VN') + ' VND';
};

const OrderListScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State dùng để load lại trang sau khi xóa
  const [successDelete, setSuccessDelete] = useState(false);

  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get('/api/orders', config);
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    if (userInfo && userInfo.isAdmin) {
      fetchOrders();
    }
  }, [userInfo, successDelete]); // Tự động chạy lại khi successDelete thay đổi

  // --- HÀM XÓA ĐƠN HÀNG ---
  const deleteHandler = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này không?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        await axios.delete(`/api/orders/${id}`, config);
        setSuccessDelete(!successDelete); // Kích hoạt reload lại danh sách
      } catch (err) {
        alert('Xóa thất bại: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <Container fluid className="py-3">
      <h2 className="my-4 text-uppercase fw-bold"><FaClipboardList className="me-2" />Quản lý Đơn hàng</h2>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm bg-white shadow-sm rounded text-center align-middle">
          <thead className="bg-dark text-white">
            <tr>
              <th>ID</th>
              <th>NGƯỜI DÙNG</th>
              <th>NGÀY ĐẶT</th>
              <th>TỔNG CỘNG</th>
              <th>ĐÃ TT</th>
              <th>ĐÃ GIAO</th>
              <th>HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                <td className="fw-bold">{formatCurrency(order.totalPrice)}</td>
                <td>
                  {order.isPaid ? (
                    <FaCheck style={{ color: 'green' }} />
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    <FaCheck style={{ color: 'green' }} />
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button variant="light" className="btn-sm border">
                        <FaEye /> Chi tiết
                      </Button>
                    </LinkContainer>
                    
                    {/* NÚT XÓA MÀU ĐỎ */}
                    <Button 
                        variant="danger" 
                        className="btn-sm" 
                        onClick={() => deleteHandler(order._id)}
                    >
                        <FaTrash />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default OrderListScreen;