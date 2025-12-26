import React from 'react';
import { Container } from 'react-bootstrap';
import { Routes, Route, Outlet } from 'react-router-dom';

// Component
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

// Screens (Public)
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import CategoryScreen from './screens/CategoryScreen';
import AllProductsScreen from './screens/AllProductsScreen';
import WishlistScreen from './screens/WishlistScreen';

// Screens (Static)
import AboutScreen from './screens/AboutScreen';
import ContactScreen from './screens/ContactScreen';
import BlogScreen from './screens/BlogScreen'; 
import BlogPostScreen from './screens/BlogPostScreen'; 

// Screens (User/Protected)
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import ProfileScreen from './screens/ProfileScreen';
import PostCreateScreen from './screens/PostCreateScreen';

// Admin Screens
import AdminLayout from './components/AdminLayout';
import DashboardScreen from './screens/DashboardScreen';
import UserListScreen from './screens/UserListScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import UserEditScreen from './screens/UserEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import PostListScreen from './screens/PostListScreen';
import PostEditScreen from './screens/PostEditScreen'; 
import RefundListScreen from './screens/RefundListScreen'; // Import màn hình hoàn tiền

// Routes
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

const PublicLayout = () => (
  <>
    <Header />
    <main className="py-3" style={{ minHeight: '80vh' }}>
      <Container>
        <Outlet />
      </Container>
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        {/* Route Trang chủ */}
        <Route index element={<HomeScreen />} />
        <Route path="search/:keyword" element={<HomeScreen />} />

        {/* Route Authentication */}
        <Route path="login" element={<LoginScreen />} />
        <Route path="forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="passwordreset/:token" element={<ResetPasswordScreen />} />
        <Route path="register" element={<RegisterScreen />} />
        
        {/* Route Danh mục & Thương hiệu */}
        <Route path="category/:category" element={<CategoryScreen />} />
        <Route path="brand/:brand" element={<CategoryScreen />} />
        <Route path="products/all" element={<AllProductsScreen />} />
        
        {/* Static Pages */}
        <Route path="about" element={<AboutScreen />} />
        <Route path="contact" element={<ContactScreen />} />
        
        {/* Blog Routes */}
        <Route path="blog" element={<BlogScreen />} />
        <Route path="blog/category/:categoryName" element={<BlogScreen />} />
        <Route path="blog/post/:slug" element={<BlogPostScreen />} />
        
        {/* Shop Routes */}
        <Route path="product/:id" element={<ProductScreen />} />
        <Route path="cart" element={<CartScreen />} />
        <Route path="cart/:id" element={<CartScreen />} />
        <Route path="wishlist" element={<WishlistScreen />} />

        {/* Protected (User) */}
        <Route path="" element={<ProtectedRoute />}>
          <Route path="shipping" element={<ShippingScreen />} />
          <Route path="payment" element={<PaymentScreen />} />
          <Route path="placeorder" element={<PlaceOrderScreen />} />
          <Route path="order/:id" element={<OrderScreen />} />
          <Route path="profile" element={<ProfileScreen />} />
          <Route path="blog/create" element={<PostCreateScreen />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route 
        path="/admin" 
        element={<AdminRoute>{<AdminLayout />}</AdminRoute>}
      >
        <Route path="dashboard" element={<DashboardScreen />} />
        <Route path="userlist" element={<UserListScreen />} />
        <Route path="productlist" element={<ProductListScreen />} />
        <Route path="product/:id/edit" element={<ProductEditScreen />} />
        <Route path="user/:id/edit" element={<UserEditScreen />} />
        <Route path="orderlist" element={<OrderListScreen />} />
        <Route path="postlist" element={<PostListScreen />} />
        <Route path="post/:id/edit" element={<PostEditScreen />} />
        
        {/* Đã sửa lại đường dẫn này cho chuẩn (bỏ /admin ở đầu vì nó đang nằm trong route cha /admin) */}
        <Route path="refunds" element={<RefundListScreen />} />
      </Route>
    </Routes>
  );
}

export default App;