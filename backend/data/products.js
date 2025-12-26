// backend/data/products.js
const products = [
  {
    name: 'Chanel Coco Mademoiselle',
    image: '/images/coco.jpg',
    description:
      'Một mùi hương phương Đông hiện đại, tươi mát và gợi cảm. Dành cho người phụ nữ thanh lịch và độc lập.',
    brand: 'Chanel',
    category: 'Nước hoa nữ',
    price: 3500000,
    countInStock: 10,
    rating: 4.5,
    numReviews: 12,
  },
  {
    name: 'Dior Sauvage Eau de Parfum',
    image: '/images/sauvage.jpg',
    description:
      'Một mùi hương nam tính, mạnh mẽ và tươi mát với hương cam Bergamot và hương gỗ Ambroxan.',
    brand: 'Dior',
    category: 'Nước hoa nam',
    price: 2900000,
    countInStock: 7,
    rating: 4.8,
    numReviews: 20,
  },
  {
    name: 'Creed Aventus',
    image: '/images/aventus.jpg',
    description:
      'Hương thơm của quyền lực, thành công. Mở đầu với hương dứa, cam bergamot, và kết thúc bằng rêu sồi, vani.',
    brand: 'Creed',
    category: 'Nước hoa nam',
    price: 7500000,
    countInStock: 5,
    rating: 4.9,
    numReviews: 35,
  },
];

module.exports = products;