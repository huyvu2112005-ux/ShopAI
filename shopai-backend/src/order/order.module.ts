import {BadRequestException, Body, Controller, Get, Inject, Injectable, Module, NotFoundException, Param, Post, Req, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiProperty, ApiTags} from '@nestjs/swagger';
import {ArrayMaxSize, ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsString, Max, Min, ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';
import {randomUUID} from 'node:crypto';
import {JwtAuthGuard} from '../auth/auth.module';
import {ProductModule, ProductService} from '../product/product.module';
import {IOrderRepository, PrismaOrderRepository} from './order.repository';
class OrderItemDto {
 @ApiProperty({example: 'backend_prod_0'}) @IsString() @IsNotEmpty() productId: string;
 @ApiProperty({minimum: 1}) @IsInt() @Min(1) @Max(100) quantity: number;
}
export class CreateOrderDto {
 @ApiProperty({type: [OrderItemDto]}) @IsArray() @ArrayMinSize(1) @ArrayMaxSize(100) @ValidateNested({each: true}) @Type(() => OrderItemDto) items: OrderItemDto[];
 @ApiProperty() @IsInt() @Min(1) total: number;
}
@Injectable()
class OrderService {
 constructor(private readonly products: ProductService, @Inject('IOrderRepository') private readonly repository: IOrderRepository) {}
 create(userId: string, dto: CreateOrderDto) {
  if (new Set(dto.items.map(item => this.products.getById(item.productId).id)).size !== dto.items.length) {
   throw new BadRequestException('Mỗi sản phẩm chỉ được xuất hiện một lần trong đơn hàng');
  }
  const items = dto.items.map(item => {const p = this.products.getById(item.productId); if (item.quantity > p.stock) throw new BadRequestException('Số lượng vượt tồn kho'); return {productId: p.id, name: p.name, quantity: item.quantity, price: p.price};});
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (!Number.isSafeInteger(total) || total > 2147483647 || total !== dto.total) throw new BadRequestException('Tổng tiền không khớp với giá sản phẩm trên Server');
  return this.repository.create({id: `ORD-${Date.now()}-${randomUUID().slice(0, 8)}`, user: {connect: {id: userId}}, total, status: 'PENDING', items: {create: items}});
 }
 list(userId: string) {return this.repository.list(userId);}
 async detail(id: string, userId: string) {const order = await this.repository.detail(id, userId); if (!order) throw new NotFoundException('Đơn hàng không tồn tại'); return order;}
 async pay(id: string, userId: string) {await this.detail(id, userId); return this.repository.pay(id, userId);}
}
@ApiTags('Orders') @ApiBearerAuth() @UseGuards(JwtAuthGuard)
@Controller('api/orders')
class OrderController {
 constructor(private readonly orders: OrderService) {}
 @Post() create(@Req() req: any, @Body() dto: CreateOrderDto) {return this.orders.create(req.user.id, dto);}
 @Get() list(@Req() req: any) {return this.orders.list(req.user.id);}
 @Get(':id') detail(@Req() req: any, @Param('id') id: string) {return this.orders.detail(id, req.user.id);}
 @Post(':id/pay') pay(@Req() req: any, @Param('id') id: string) {return this.orders.pay(id, req.user.id);}
}
@Module({imports: [ProductModule], controllers: [OrderController], providers: [OrderService, {provide: 'IOrderRepository', useClass: PrismaOrderRepository}]})
export class OrderModule {}
