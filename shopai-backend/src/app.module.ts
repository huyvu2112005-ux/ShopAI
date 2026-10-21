import {Controller, Get, Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {APP_GUARD} from '@nestjs/core';
import {ThrottlerGuard, ThrottlerModule} from '@nestjs/throttler';
import {PrismaModule} from './prisma/prisma.module';
import {ProductModule} from './product/product.module';
import {AuthModule} from './auth/auth.module';
import {OrderModule} from './order/order.module';
import {AiModule} from './ai/ai.module';
@Controller('api/health')
class HealthController {@Get() check() {return {status: 'ok', timestamp: new Date().toISOString()};}}
@Module({imports: [ConfigModule.forRoot({isGlobal: true}), ThrottlerModule.forRoot([{ttl: 60000, limit: 120}]), PrismaModule, ProductModule, AuthModule, OrderModule, AiModule], controllers: [HealthController], providers: [{provide: APP_GUARD, useClass: ThrottlerGuard}]})
export class AppModule {}
