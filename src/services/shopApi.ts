import axios from 'axios';
import axiosClient from '../api/axiosClient';
import {z} from 'zod';
import {ServerOrderSchema} from '../types/shop.schema';
export type {ServerOrder} from '../types/shop.schema';
export function apiError(error: unknown): string {
 if (error instanceof z.ZodError) {return 'Dữ liệu Server chưa hợp lệ. Vui lòng thử lại hoặc liên hệ hỗ trợ.';}
 if (axios.isAxiosError(error)) {
  const message = error.response?.data?.message;
  if (Array.isArray(message)) {return message.join('\n');}
  if (typeof message === 'string') {return message;}
  if (!error.response) {return 'Không kết nối được Server. Kiểm tra mạng và địa chỉ API.';}
 }
 return error instanceof Error ? error.message : 'Có lỗi xảy ra, vui lòng thử lại.';
}
export type CreateOrderInput = {items: {productId: string; quantity: number}[]; total: number};
export const createOrder = async (input: CreateOrderInput) => ServerOrderSchema.parse((await axiosClient.post('/api/orders', input)).data);
export const getOrders = async () => ServerOrderSchema.array().parse((await axiosClient.get('/api/orders')).data);
export const getOrder = async (id: string) => ServerOrderSchema.parse((await axiosClient.get(`/api/orders/${encodeURIComponent(id)}`)).data);
export const payOrder = async (id: string) => ServerOrderSchema.parse((await axiosClient.post(`/api/orders/${encodeURIComponent(id)}/pay`)).data);
export type ChatHistoryItem = {role: 'user' | 'model'; text: string};
export async function askShopAI(message: string, history: ChatHistoryItem[]) {
 const {data} = await axiosClient.post('/api/ai/chat', {message, history: history.slice(-10).map(item => ({...item, text: item.text.slice(0, 4000)}))});
 if (typeof data?.reply !== 'string' || !data.reply.trim()) {throw new Error('AI chưa trả lời, vui lòng thử lại.');}
 return data.reply as string;
}
