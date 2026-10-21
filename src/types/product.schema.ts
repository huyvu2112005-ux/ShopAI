import {z} from 'zod';
import {API_BASE_URL} from '../constants/api';

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  price: z.number().positive(),
  image: z.string().refine(value => value.startsWith('/assets/products/') || /^https?:\/\//.test(value), 'Đường dẫn ảnh không hợp lệ').transform(value => ({uri: value.startsWith('/') ? `${API_BASE_URL}${value}` : value})),
  barcode: z.string().optional(),
  category: z.string(),
  rating: z.number().min(0).max(5),
  stock: z.number().nonnegative(),
  description: z.string(),
  specs: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    }),
  ),
});

export const ProductListSchema = z.array(ProductSchema);
export type ApiProduct = z.infer<typeof ProductSchema>;
