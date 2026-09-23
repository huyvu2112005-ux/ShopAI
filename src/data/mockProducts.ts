import {
  ImageSourcePropType,
} from 'react-native';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: ImageSourcePropType;
  category: string;
  rating: number;
  stock: number;
  description: string;
  specs: ProductSpec[];
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'iphone-16-pro',
    name: 'iPhone 16 Pro',
    price: 28990000,
    image: require('../assets/products/iphone-16-pro.jpg'),
    category: 'Điện thoại',
    rating: 4.9,
    stock: 12,
    description:
      'iPhone 16 Pro là mẫu smartphone cao cấp của Apple, phù hợp cho người dùng cần hiệu năng mạnh, camera chất lượng cao và hệ sinh thái iOS ổn định.',
    specs: [
      {
        label: 'Màn hình',
        value: '6.3 inch',
      },
      {
        label: 'Bộ nhớ',
        value: '128GB',
      },
      {
        label: 'Kết nối',
        value: '5G',
      },
      {
        label: 'Cổng sạc',
        value: 'USB-C',
      },
    ],
  },

  {
    id: 'galaxy-s25-ultra',
    name: 'Samsung Galaxy S25 Ultra',
    price: 30990000,
    image: require('../assets/products/galaxy-s25-ultra.jpg'),
    category: 'Điện thoại',
    rating: 4.9,
    stock: 9,
    description:
      'Galaxy S25 Ultra là smartphone cao cấp hướng đến người dùng cần màn hình lớn, khả năng đa nhiệm, camera linh hoạt và bút S Pen.',
    specs: [
      {
        label: 'Màn hình',
        value: '6.9 inch',
      },
      {
        label: 'Bộ nhớ',
        value: '256GB',
      },
      {
        label: 'Kết nối',
        value: '5G',
      },
      {
        label: 'Bút',
        value: 'S Pen',
      },
    ],
  },

  {
    id: 'macbook-air-m4',
    name: 'MacBook Air M4 13-inch',
    price: 26990000,
    image: require('../assets/products/macbook-air-m4.jpg'),
    category: 'Laptop',
    rating: 4.8,
    stock: 7,
    description:
      'MacBook Air 13-inch là laptop mỏng nhẹ dành cho học tập, văn phòng và công việc sáng tạo, với thời lượng pin tốt và thiết kế gọn nhẹ.',
    specs: [
      {
        label: 'Màn hình',
        value: '13 inch',
      },
      {
        label: 'Chip',
        value: 'Apple M4',
      },
      {
        label: 'RAM',
        value: '16GB',
      },
      {
        label: 'Bộ nhớ',
        value: '256GB SSD',
      },
    ],
  },

  {
    id: 'ipad-air-m3',
    name: 'iPad Air M3 11-inch',
    price: 16990000,
    image: require('../assets/products/ipad-air-m3.jpg'),
    category: 'Máy tính bảng',
    rating: 4.8,
    stock: 15,
    description:
      'iPad Air 11-inch phù hợp cho học tập, giải trí và làm việc di động nhờ thiết kế mỏng nhẹ, màn hình lớn và hiệu năng tốt.',
    specs: [
      {
        label: 'Màn hình',
        value: '11 inch',
      },
      {
        label: 'Chip',
        value: 'Apple M3',
      },
      {
        label: 'Bộ nhớ',
        value: '128GB',
      },
      {
        label: 'Kết nối',
        value: 'Wi-Fi',
      },
    ],
  },

  {
    id: 'sony-wh1000xm6',
    name: 'Sony WH-1000XM6',
    price: 11490000,
    image: require('../assets/products/sony-wh1000xm6.jpg'),
    category: 'Tai nghe',
    rating: 4.9,
    stock: 18,
    description:
      'Sony WH-1000XM6 là tai nghe không dây cao cấp, phù hợp với nhu cầu nghe nhạc, làm việc và di chuyển nhờ khả năng chống ồn chủ động.',
    specs: [
      {
        label: 'Kiểu tai nghe',
        value: 'Over-ear',
      },
      {
        label: 'Kết nối',
        value: 'Bluetooth',
      },
      {
        label: 'Chống ồn',
        value: 'ANC',
      },
      {
        label: 'Sạc',
        value: 'USB-C',
      },
    ],
  },

  {
    id: 'apple-watch-series-10',
    name: 'Apple Watch Series 10',
    price: 10990000,
    image: require('../assets/products/apple-watch-series-10.png'),
    category: 'Đồng hồ thông minh',
    rating: 4.8,
    stock: 20,
    description:
      'Apple Watch Series 10 hỗ trợ theo dõi hoạt động hằng ngày, thông báo và các tiện ích thông minh khi sử dụng cùng iPhone.',
    specs: [
      {
        label: 'Loại',
        value: 'Smartwatch',
      },
      {
        label: 'Kết nối',
        value: 'Bluetooth / Wi-Fi',
      },
      {
        label: 'Tương thích',
        value: 'iPhone',
      },
      {
        label: 'Sạc',
        value: 'Sạc từ tính',
      },
    ],
  },

  {
    id: 'mx-master-4',
    name: 'Logitech MX Master 4',
    price: 3190000,
    image: require('../assets/products/mx-master-4.jpg'),
    category: 'Phụ kiện máy tính',
    rating: 4.7,
    stock: 24,
    description:
      'Logitech MX Master 4 là chuột không dây hướng đến người dùng văn phòng và sáng tạo, với thiết kế công thái học và nhiều nút điều khiển.',
    specs: [
      {
        label: 'Loại',
        value: 'Chuột không dây',
      },
      {
        label: 'Kết nối',
        value: 'Bluetooth',
      },
      {
        label: 'Sạc',
        value: 'USB-C',
      },
      {
        label: 'Mục đích',
        value: 'Văn phòng / Sáng tạo',
      },
    ],
  },

  {
    id: 'anker-prime-20000',
    name: 'Anker Prime 20,000mAh',
    price: 3490000,
    image: require('../assets/products/anker-prime-20000.png'),
    category: 'Pin sạc dự phòng',
    rating: 4.8,
    stock: 30,
    description:
      'Anker Prime 20,000mAh là pin sạc dự phòng dung lượng lớn, phù hợp cho điện thoại, máy tính bảng và các thiết bị sử dụng USB-C.',
    specs: [
      {
        label: 'Dung lượng',
        value: '20,000mAh',
      },
      {
        label: 'Kết nối',
        value: 'USB-C',
      },
      {
        label: 'Loại',
        value: 'Pin sạc dự phòng',
      },
      {
        label: 'Ứng dụng',
        value: 'Điện thoại / Tablet',
      },
    ],
  },
];