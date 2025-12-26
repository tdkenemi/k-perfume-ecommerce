// src/screens/UserListScreen.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap'; // Bỏ Container vì AdminLayout đã có
import { FaUsers, FaCheck, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap'; // Import LinkContainer
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';

const UserListScreen = () => {
  // --- TOÀN BỘ LOGIC PHẢI NẰM BÊN TRONG HÀM NÀY ---
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [loadingDelete, setLoadingDelete] = useState(false);
  const [errorDelete, setErrorDelete] = useState(null);
  const [successDelete, setSuccessDelete] = useState(false);

  const { userInfo } = useContext(AuthContext);

  // Hàm fetchUsers (tách riêng)
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get('http://localhost:5000/api/users', config);
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchUsers();
    }
    // Tải lại danh sách nếu `successDelete` thay đổi
  }, [userInfo, successDelete]); // Chỉ phụ thuộc vào 2 biến này

  // HÀM XÓA
  const deleteHandler = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa user này?')) {
      try {
        setLoadingDelete(true);
        setErrorDelete(null);
        setSuccessDelete(false); // Reset
        
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        
        // Gọi API DELETE
        await axios.delete(`http://localhost:5000/api/users/${id}`, config);
        
        setLoadingDelete(false);
        setSuccessDelete(true); // Báo hiệu đã xóa thành công
      } catch (err) {
        setErrorDelete(err.response?.data?.message || err.message);
        setLoadingDelete(false);
      }
    }
  };

  return (
    // Chúng ta không cần <Container> vì AdminLayout đã có Col
    <>
      <h1 className="my-4"><FaUsers className="me-2" />Quản lý Người dùng</h1>
      
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {successDelete && <Message variant="success">Đã xóa người dùng thành công!</Message>}
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm bg-white shadow-sm rounded">
          <thead>
            <tr>
              <th>ID</th>
              <th>TÊN</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                <td>
                  {user.isAdmin ? (
                    <FaCheck style={{ color: 'green' }} />
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button variant="light" className="btn-sm mx-1">
                      <FaEdit />
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm mx-1"
                    onClick={() => deleteHandler(user._id)}
                    disabled={user.isAdmin || loadingDelete} // Không cho xóa Admin
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UserListScreen;