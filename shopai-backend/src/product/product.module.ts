import {Body, Controller, Get, Injectable, Module, NotFoundException, Param, Post, Query} from '@nestjs/common';
import {ApiProperty, ApiPropertyOptional, ApiTags} from '@nestjs/swagger';
import {IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Max, MaxLength, Min} from 'class-validator';
import catalog from './catalog.json';
import {randomUUID} from 'node:crypto';
import {Transform, Type} from 'class-transformer';
export class ProductQueryDto {
 @ApiPropertyOptional({minimum: 1}) @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100000) page?: number;
 @ApiPropertyOptional({minimum: 1, maximum: 100}) @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number;
 @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100) search?: string;
}
type CatalogProduct = Omit<(typeof catalog)[number], 'barcode' | 'legacyId'> & {barcode?: string; legacyId?: string};
export class CreateProductDto {
 @ApiProperty() @Transform(({value}) => typeof value === 'string' ? value.trim() : value) @IsString() @IsNotEmpty() name: string;
 @ApiProperty({minimum: 1}) @IsInt() @Min(1) price: number;
 @ApiProperty() @IsUrl() image: string;
}
@Injectable()
export class ProductService {
 private readonly products: CatalogProduct[] = catalog.map(product => ({...product}));
 getAll() {return this.products;}
 getPage(query: ProductQueryDto) {
  const term = query.search?.trim().toLowerCase() ?? '';
  const products = this.products.filter(product => [product.name, product.category, product.barcode ?? ''].some(value => value.toLowerCase().includes(term)));
  const page = query.page ?? 1, limit = query.limit ?? 8;
  const start = (page - 1) * limit;
  return {items: products.slice(start, start + limit), total: products.length, nextPage: start + limit < products.length ? page + 1 : null};
 }
 getById(id: string) {const p = this.products.find(item => item.id === id || item.legacyId === id || item.barcode === id); if (!p) throw new NotFoundException('Sản phẩm không tồn tại'); return p;}
 create(dto: CreateProductDto) {
  const p: CatalogProduct = {...dto, id: `backend_prod_${randomUUID()}`, category: 'Khác', rating: 0, stock: 0, description: dto.name, specs: []};
  this.products.push(p);
  return p;
 }
}
@ApiTags('Products')
@Controller('api/products')
export class ProductController {
 constructor(private readonly products: ProductService) {}
 @Get() list(@Query() query: ProductQueryDto) {return query.page === undefined && query.limit === undefined && query.search === undefined ? this.products.getAll() : this.products.getPage(query);}
 @Get(':id') detail(@Param('id') id: string) {return this.products.getById(id);}
 @Post() create(@Body() dto: CreateProductDto) {return this.products.create(dto);}
}
@Module({controllers: [ProductController], providers: [ProductService], exports: [ProductService]})
export class ProductModule {}
