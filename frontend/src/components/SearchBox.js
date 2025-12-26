// src/components/SearchBox.js
import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const SearchBox = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
      setKeyword(''); // Xóa ô input sau khi tìm
    } else {
      navigate('/'); // Nếu tìm rỗng thì về trang chủ
    }
  };

  return (
    <Form onSubmit={submitHandler} className="d-flex">
      <InputGroup style={{ minWidth: '300px' }}>
        <Form.Control
          type="text"
          name="q"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Tìm theo tên hoặc hãng..."
          className="mr-sm-2"
        ></Form.Control>
        <Button type="submit" variant="outline-success" className="p-2">
          <FaSearch />
        </Button>
      </InputGroup>
    </Form>
  );
};

export default SearchBox;