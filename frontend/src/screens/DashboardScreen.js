// src/screens/DashboardScreen.js
import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { FaBoxes, FaUserFriends, FaDollarSign, FaShoppingCart } from 'react-icons/fa';
// 1. Import các components từ Chart.js
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

// 2. Đăng ký các components Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

// Hàm helper format tiền
const formatCurrency = (amount) => {
  return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

const DashboardScreen = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userInfo } = useContext(AuthContext);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const { data } = await axios.get('/api/orders/stats', config);
                setStats(data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        if (userInfo && userInfo.isAdmin) {
            fetchStats();
        }
    }, [userInfo]);

    // 3. Chuẩn bị dữ liệu cho Biểu đồ Đường (Doanh thu 7 ngày)
    const lineChartData = {
        labels: stats?.dailySales.map(s => s._id), // Các ngày
        datasets: [
            {
                label: 'Doanh thu',
                data: stats?.dailySales.map(s => s.total), // Doanh thu
                fill: true,
                backgroundColor: 'rgba(15, 76, 59, 0.2)', // Màu xanh rêu nhạt
                borderColor: '#0f4c3b', // Màu xanh rêu đậm
                tension: 0.1
            },
        ],
    };

    // 4. Chuẩn bị dữ liệu cho Biểu đồ Tròn (Doanh thu theo danh mục)
    const doughnutChartData = {
        labels: stats?.categorySales.map(c => c._id), // Tên Category (Nam, Nữ)
        datasets: [
            {
                data: stats?.categorySales.map(c => c.total), // Doanh thu
                backgroundColor: [
                    '#0f4c3b', // Xanh rêu
                    '#a7c2b9', // Xanh nhạt
                    '#E5A3AD', // Hồng
                    '#FFFACD', // Vàng
                ],
                borderColor: '#ffffff',
                borderWidth: 1,
            },
        ],
    };

    return (
        <Container fluid>
            <h1 className="my-3">Bảng Thống Kê (Dashboard)</h1>
            {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
                <>
                    {/* HÀNG 1: 4 THẺ TÓM TẮT */}
                    <Row>
                        <Col md={3}>
                            <Card className="text-white mb-3" style={{ backgroundColor: '#0f4c3b' }}>
                                <Card.Body>
                                    <FaDollarSign size={30} />
                                    <h5 className="mt-2">Tổng Doanh Thu</h5>
                                    <h3>{formatCurrency(stats.totalRevenue)}</h3>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="text-white bg-info mb-3">
                                <Card.Body>
                                    <FaShoppingCart size={30} />
                                    <h5 className="mt-2">Tổng Đơn Hàng</h5>
                                    <h3>{stats.totalOrders}</h3>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="text-white bg-warning mb-3">
                                <Card.Body>
                                    <FaUserFriends size={30} />
                                    <h5 className="mt-2">Tổng Khách Hàng</h5>
                                    <h3>{stats.totalUsers}</h3>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="text-white bg-secondary mb-3">
                                <Card.Body>
                                    <FaBoxes size={30} />
                                    <h5 className="mt-2">Tổng Sản Phẩm</h5>
                                    <h3>{stats.totalProducts}</h3>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* HÀNG 2: BIỂU ĐỒ */}
                    <Row>
                        {/* BIỂU ĐỒ ĐƯỜNG: DOANH THU 7 NGÀY */}
                        <Col md={8}>
                            <Card className="mb-3">
                                <Card.Header as="h5">Doanh thu 7 ngày qua</Card.Header>
                                <Card.Body>
                                    {stats.dailySales.length > 0 ? (
                                        <Line data={lineChartData} />
                                    ) : (
                                        <Message>Không có dữ liệu doanh thu 7 ngày qua.</Message>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* BIỂU ĐỒ TRÒN: DANH MỤC */}
                        <Col md={4}>
                            <Card className="mb-3">
                                <Card.Header as="h5">Tỷ trọng Doanh thu (Theo Danh mục)</Card.Header>
                                <Card.Body>
                                    {stats.categorySales.length > 0 ? (
                                        <Doughnut data={doughnutChartData} />
                                    ) : (
                                        <Message>Không có dữ liệu doanh thu theo danh mục.</Message>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
};

export default DashboardScreen;