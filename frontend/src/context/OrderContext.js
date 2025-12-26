import React, { createContext, useReducer, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const OrderContext = createContext();

const initialState = {
  create: { loading: false, error: null, order: null, success: false },
  details: { loading: true, error: null, order: null },
};

export const orderReducer = (state, action) => {
  switch (action.type) {
    // --- CREATE ORDER ---
    case 'ORDER_CREATE_REQUEST':
      return { ...state, create: { loading: true } };
    case 'ORDER_CREATE_SUCCESS':
      return { ...state, create: { loading: false, success: true, order: action.payload } };
    case 'ORDER_CREATE_FAIL':
      return { ...state, create: { loading: false, error: action.payload } };
    case 'ORDER_CREATE_RESET':
      return { ...state, create: { loading: false, error: null, order: null, success: false } };

    // --- ORDER DETAILS ---
    case 'ORDER_DETAILS_REQUEST':
      return { ...state, details: { loading: true } };
    case 'ORDER_DETAILS_SUCCESS':
      return { ...state, details: { loading: false, order: action.payload } };
    case 'ORDER_DETAILS_FAIL':
      return { ...state, details: { loading: false, error: action.payload } };

    default:
      return state;
  }
};

export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);
  const { userInfo } = useContext(AuthContext);

  // 1. TẠO ĐƠN HÀNG
  const createOrder = async (orderData) => {
    try {
      dispatch({ type: 'ORDER_CREATE_REQUEST' });

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post('/api/orders', orderData, config);

      dispatch({ type: 'ORDER_CREATE_SUCCESS', payload: data });
    } catch (error) {
      const message = error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
      dispatch({ type: 'ORDER_CREATE_FAIL', payload: message });
    }
  };

  // 2. LẤY CHI TIẾT ĐƠN HÀNG
  const getOrderDetails = async (id) => {
    try {
      dispatch({ type: 'ORDER_DETAILS_REQUEST' });

      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      const { data } = await axios.get(`/api/orders/${id}`, config);

      dispatch({ type: 'ORDER_DETAILS_SUCCESS', payload: data });
    } catch (error) {
      const message = error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
      dispatch({ type: 'ORDER_DETAILS_FAIL', payload: message });
    }
  };

  // 3. RESET TRẠNG THÁI TẠO ĐƠN
  const resetOrderCreate = () => {
    dispatch({ type: 'ORDER_CREATE_RESET' });
  };

  return (
    <OrderContext.Provider
      value={{
        ...state,
        createOrder,
        getOrderDetails,
        resetOrderCreate,
        
        // --- QUAN TRỌNG: LẤY STATE RA NGOÀI ĐỂ PLACEORDERSCREEN DÙNG ĐƯỢC ---
        loading: state.create.loading,
        success: state.create.success,
        error: state.create.error,
        order: state.create.order,
        
        // State cho chi tiết đơn hàng
        orderDetails: state.details, 
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};