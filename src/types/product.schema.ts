import {z} from 'zod';

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  price: z.number().positive(),
  image: z.any(),
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
