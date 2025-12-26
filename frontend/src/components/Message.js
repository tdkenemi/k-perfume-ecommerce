// src/components/Message.js
import React from 'react';
import { Alert } from 'react-bootstrap';

// variant là màu sắc (danger, success, info...)
const Message = ({ variant, children }) => {
  return <Alert variant={variant}>{children}</Alert>;
};

Message.defaultProps = {
  variant: 'info',
};

export default Message;