import {MOCK_PRODUCTS} from '../data/mockProducts';
import {ProductListSchema, ApiProduct} from '../types/product.schema';

const PAGE_SIZE = 4;

export interface ProductPage {
  items: ApiProduct[];
  nextPage: number | null;
}

export async function fetchProductsPage({
  pageParam = 1,
}: {
  pageParam?: number;
}): Promise<ProductPage> {
  await new Promise<void>(resolve => setTimeout(resolve, 250));

  const start = (pageParam - 1) * PAGE_SIZE;
  const rawItems = MOCK_PRODUCTS.slice(start, start + PAGE_SIZE);
  const items = ProductListSchema.parse(rawItems);
  const hasNextPage = start + PAGE_SIZE < MOCK_PRODUCTS.length;

  return {
    items,
    nextPage: hasNextPage ? pageParam + 1 : null,
  };
}
