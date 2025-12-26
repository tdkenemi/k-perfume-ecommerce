// src/screens/AboutScreen.js
import React from 'react';
import { Container, Row, Col, Image, Breadcrumb } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './AboutScreen.css'; // Import file CSS bạn vừa tạo

// Đường dẫn đến ảnh bạn đã lưu ở Bước 1
const aboutImage = '/images/kperfume-about-image.png';

const AboutScreen = () => {
    return (
        <Container className="about-container">
            {/* Thêm "Breadcrumb" để điều hướng */}
            <Breadcrumb>
                <LinkContainer to="/">
                    <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                </LinkContainer>
                <Breadcrumb.Item active>Giới thiệu</Breadcrumb.Item>
            </Breadcrumb>

            <Row className="justify-content-center">
                <Col md={10} lg={8}>
                    <h1 className="about-headline text-center">
                        TRẢI NGHIỆM HÀNH TRÌNH CẢM XÚC CÙNG K-PERFUME
                    </h1>
                    <p className="about-intro-text text-center">
                        Hơn cả thơm & đẹp, nước hoa chính là cá tính và dấu ấn của mỗi người. 
                        Hãy chọn lấy những mùi hương nồng nàn, nâng niu cảm xúc tự do, 
                        mạnh mẽ và cả những yêu thương từ trái tim mình bạn nhé! 
                        Hương thơm sẽ luôn để lại những ký ức thi vị trong ta...
                    </p>

                    <Image src={aboutImage} fluid className="about-image mb-2" />
                    <p className="image-caption">
                        Có một K-perfume rất đời mà cũng rất thơ giữa lòng thành phố.
                    </p>

                    <div className="about-content">
                        <h2 className="about-headline">
                            Có một K-perfume rất ĐỜI mà cũng rất THƠ
                        </h2>
                        <p>
                            Bạn thường tìm kiếm điều gì ở một shop nước hoa chính hãng? 
                            Những sản phẩm chính hãng? Một mùi hương khiến bạn hài lòng? 
                            Hay một sản phẩm với mức giá hợp lý? Hơn cả những điều đó, 
                            K-perfume muốn mang đến cho bạn những trải nghiệm cảm xúc tuyệt vời.
                        </p>
                        <ul>
                            <li>
                                <strong>Để một ngày vui,</strong> bạn vẫn tự tin bước ra ngoài với phong thái đầy cá tính.
                            </li>
                            <li>
                                <strong>Để một ngày buồn,</strong> bạn đồng gói nỗi buồn kia thả vào một khoảng lặng yên bình trôi đi mất.
                            </li>
                            <li>
                                <strong>Để một ngày "yêu",</strong> bạn cuồng nhiệt và cháy hết mình cho những hoài bão, vượt qua giới hạn của chính mình.
                            </li>
                        </ul>

                        <h2 className="about-headline">
                            Vì sao K-perfume xứng đáng để đồng hành cùng bạn?
                        </h2>
                        <p>
                            <strong>1. K-perfume 100% NÓI KHÔNG</strong> với nước hoa "Fake". Chúng tôi chỉ cung cấp nước hoa chiết và các sản phẩm chính hãng có nguồn gốc rõ ràng.
                        </p>
                        <p>
                            <strong>2. Giá cả hợp lý</strong> do tối ưu chi phí vận hành. Chúng tôi "cạnh tranh lành mạnh" với các đơn vị kinh doanh khác trên thị trường.
                        </p>
                        <p>
                            <strong>3. Trải nghiệm độc đáo,</strong> nơi bạn được tự do thử mùi, test sản phẩm và thư giãn trong thế giới mùi hương của riêng mình.
                        </p>
                        <p>
                            <strong>4. Chính sách rõ ràng</strong> về thanh toán, vận chuyển và đổi trả, được quy định cụ thể trên website K-perfume.vn.
                        </p>
                        <p>
                            <strong>5. K-perfume là câu chuyện cảm xúc,</strong> cũng như hành trình của chính bạn. Chúng tôi tin rằng mỗi mùi hương là một cá tính, một cột mốc đáng nhớ.
                        </p>

                        <p className="about-signoff">
                            Trân trọng,
                            <br />
                            Đội ngũ K-perfume
                        </p>
                    </div>

                </Col>
            </Row>
        </Container>
    );
};

export default AboutScreen;