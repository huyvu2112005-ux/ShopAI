import {z} from 'zod';

export const SessionSchema = z.object({
  accessToken: z.string().min(1),
  user: z.object({id: z.string().min(1), email: z.string().email(), name: z.string().nullable()}),
});

export const ServerOrderSchema = z.object({
  id: z.string().min(1),
  total: z.number().int().positive(),
  status: z.enum(['PENDING', 'PAID']),
  createdAt: z.string().refine(value => Number.isFinite(Date.parse(value)), 'Ngày đặt hàng không hợp lệ'),
  items: z.array(z.object({
    id: z.string().min(1), productId: z.string().min(1), name: z.string().min(1),
    price: z.number().int().positive(), quantity: z.number().int().positive(),
  })).min(1),
}).refine(order => order.total === order.items.reduce((sum, item) => sum + item.price * item.quantity, 0), 'Tổng tiền hóa đơn không hợp lệ');

export type ServerOrder = z.infer<typeof ServerOrderSchema>;
