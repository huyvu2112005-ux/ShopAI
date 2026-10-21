import axiosClient from '../api/axiosClient';
import {z} from 'zod';
import {ProductListSchema, ProductSchema, ApiProduct} from '../types/product.schema';
import {addCrashBreadcrumb, recordNonFatal, setCrashContext} from './crashReporting';
const ProductPageSchema = z.object({items: ProductListSchema, nextPage: z.number().int().positive().nullable(), total: z.number().int().nonnegative()});
export type ProductPage = z.infer<typeof ProductPageSchema>;
export async function fetchProductsPage({pageParam = 1, search = ''}: {pageParam?: number; search?: string}): Promise<ProductPage> {
 try {
  addCrashBreadcrumb('Home: yêu cầu danh sách sản phẩm');
  const {data} = await axiosClient.get('/api/products', {params: {page: pageParam, limit: 8, ...(search ? {search} : {})}});
  return ProductPageSchema.parse(data);
 } catch (error) {
  setCrashContext({screen: 'HomeScreen', api_action: 'GET /api/products'});
  addCrashBreadcrumb('Home: tải sản phẩm thất bại');
  recordNonFatal(error, 'ProductFetchFailed');
  throw error;
 }
}
export async function fetchProductById(id: string): Promise<ApiProduct> {
 const {data} = await axiosClient.get(`/api/products/${encodeURIComponent(id)}`);
 return ProductSchema.parse(data);
}
