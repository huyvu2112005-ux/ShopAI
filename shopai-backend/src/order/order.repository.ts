import {Injectable} from '@nestjs/common';
import {Prisma} from '@prisma/client';
import {PrismaService} from '../prisma/prisma.module';
export interface IOrderRepository {
 create(data: Prisma.OrderCreateInput): Promise<unknown>;
 list(userId: string): Promise<unknown>;
 detail(id: string, userId: string): Promise<any>;
 pay(id: string, userId: string): Promise<unknown>;
}
@Injectable()
export class PrismaOrderRepository implements IOrderRepository {
 constructor(private readonly prisma: PrismaService) {}
 create(data: Prisma.OrderCreateInput) {return this.prisma.order.create({data, include: {items: true}});}
 list(userId: string) {return this.prisma.order.findMany({where: {userId}, include: {items: true}, orderBy: {createdAt: 'desc'}});}
 detail(id: string, userId: string) {return this.prisma.order.findFirst({where: {id, userId}, include: {items: true}});}
 async pay(id: string, userId: string) {await this.prisma.order.updateMany({where: {id, userId, status: 'PENDING'}, data: {status: 'PAID'}}); return this.detail(id, userId);}
}
