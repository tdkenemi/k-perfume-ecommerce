import React, { createContext, useState, useEffect } from 'react';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    // Lấy dữ liệu từ LocalStorage khi mới vào web
    const [wishlistItems, setWishlistItems] = useState(() => {
        const savedItems = localStorage.getItem('wishlistItems');
        return savedItems ? JSON.parse(savedItems) : [];
    });

    // Tự động lưu vào LocalStorage mỗi khi danh sách thay đổi
    useEffect(() => {
        localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    // Hàm thêm vào yêu thích
    const addToWishlist = (product) => {
        const existItem = wishlistItems.find((x) => x._id === product._id);
        if (!existItem) {
            setWishlistItems([...wishlistItems, product]);
        }
    };

    // Hàm xóa khỏi yêu thích
    const removeFromWishlist = (id) => {
        setWishlistItems(wishlistItems.filter((x) => x._id !== id));
    };

    // Hàm kiểm tra xem sản phẩm đã được thích chưa
    const isInWishlist = (id) => {
        return wishlistItems.some((x) => x._id === id);
    };

    return (
        <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};