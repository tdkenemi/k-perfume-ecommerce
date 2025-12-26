// src/screens/PostCreateScreen.js
import React from 'react';
import { Container } from 'react-bootstrap';

const PostCreateScreen = () => {
    return (
        <Container className="mt-4">
            <h1>Đăng bài viết mới</h1>
            <p>(Form tạo bài viết/đánh giá nước hoa sẽ được xây dựng ở đây)</p>
            {/* TODO: (Bước tiếp theo)
                - Form.Control cho Tiêu đề (title)
                - Form.Select cho Danh mục (category)
                - Một trình soạn thảo văn bản (Text Editor) cho Nội dung (content)
            */}
        </Container>
    );
};

export default PostCreateScreen;