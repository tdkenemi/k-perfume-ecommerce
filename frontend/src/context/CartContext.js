// src/context/CartContext.js
import React, { createContext, useReducer, useEffect } from 'react';

export const CartContext = createContext();

// 1. CẬP NHẬT initialState (Thêm paymentMethod)
const initialState = {
  cartItems: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [],
  shippingAddress: localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress'))
    : {},
  // Thêm dòng này:
  paymentMethod: localStorage.getItem('paymentMethod')
    ? JSON.parse(localStorage.getItem('paymentMethod'))
    : '', // Mặc định là chuỗi rỗng
};

// 2. CẬP NHẬT Reducer (Thêm case mới)
function cartReducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;
      const existItem = state.cartItems.find(
        (item) => item.product === newItem.product
      );
      let updatedCartItems;
      if (existItem) {
        updatedCartItems = state.cartItems.map((item) =>
          item.product === existItem.product ? newItem : item
        );
      } else {
        updatedCartItems = [...state.cartItems, newItem];
      }
      return { ...state, cartItems: updatedCartItems };
    }
    case 'CART_REMOVE_ITEM': {
      const updatedCartItems = state.cartItems.filter(
        (item) => item.product !== action.payload
      );
      return { ...state, cartItems: updatedCartItems };
    }
    case 'CART_SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        shippingAddress: action.payload,
      };
    
    // Thêm case này:
    case 'CART_SAVE_PAYMENT_METHOD':
      return {
        ...state,
        paymentMethod: action.payload,
      };

      case 'CART_CLEAR_ITEMS':
      return {
        ...state,
        cartItems: [], // Trả giỏ hàng về mảng rỗng
      };

    default:
      return state;
  }
}

// 3. CẬP NHẬT Provider
export function CartProvider(props) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // 4. CẬP NHẬT useEffect (Lưu cả 3 vào localStorage)
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(state.cartItems));

    if (state.shippingAddress && Object.keys(state.shippingAddress).length > 0) {
      localStorage.setItem('shippingAddress', JSON.stringify(state.shippingAddress));
    }

    // Thêm 2 dòng này:
    if (state.paymentMethod) {
      localStorage.setItem('paymentMethod', JSON.stringify(state.paymentMethod));
    }
  }, [state.cartItems, state.shippingAddress, state.paymentMethod]); // Thêm state.paymentMethod

  const value = { state, dispatch };

  return <CartContext.Provider value={value} {...props} />;
}