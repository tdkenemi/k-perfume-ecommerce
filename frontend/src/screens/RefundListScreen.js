import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Table, Button, Container, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { FaCheck } from 'react-icons/fa';

const RefundListScreen = () => {
    const { userInfo } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);

    const fetchRefunds = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get('/api/orders/refunds', config);
            setOrders(data);
        } catch (error) { console.error(error); }
    };

    useEffect(() => { fetchRefunds(); }, []);

    const markAsRefundedHandler = async (id) => {
        if(window.confirm('Xác nhận đã chuyển khoản? Đơn hàng sẽ bị xóa.')) {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.delete(`/api/orders/${id}`, config);
                alert('Hoàn tất hoàn tiền!');
                fetchRefunds();
            } catch (error) { alert('Lỗi'); }
        }
    }

    return (
        <Container className="py-5">
            <h2 className="mb-4 text-danger fw-bold">Yêu cầu Hoàn tiền</h2>
            {orders.length === 0 ? <Alert variant="info">Không có yêu cầu nào.</Alert> : (
                <Table striped bordered hover responsive>
                    <thead><tr className="bg-dark text-white"><th>MÃ ĐƠN</th><th>KHÁCH</th><th>SỐ TIỀN</th><th>THÔNG TIN BANK</th><th>XỬ LÝ</th></tr></thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user?.name}</td>
                                <td className="text-danger fw-bold">{order.totalPrice.toLocaleString()}₫</td>
                                <td>{order.refundResult.bankName} - {order.refundResult.accountNumber} - {order.refundResult.accountName}</td>
                                <td><Button variant="success" size="sm" onClick={() => markAsRefundedHandler(order._id)}><FaCheck/> Đã hoàn tiền</Button></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};
export default RefundListScreen;