import 'reflect-metadata';
import {NestFactory} from '@nestjs/core';
import {ValidationPipe} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import helmet from 'helmet';
import {AppModule} from './app.module';
import {NestExpressApplication} from '@nestjs/platform-express';
import {resolve} from 'node:path';
async function bootstrap() {
 const app = await NestFactory.create<NestExpressApplication>(AppModule);
 app.useStaticAssets(resolve(__dirname, '../../src/assets/products'), {prefix: '/assets/products/'});
 const config = app.get(ConfigService);
 if ((config.get<string>('JWT_SECRET') ?? '').length < 32) throw new Error('JWT_SECRET phải có ít nhất 32 ký tự');
 app.use(helmet());
 app.enableCors();
 app.useGlobalPipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true, transform: true}));
 app.enableShutdownHooks();
 const swagger = new DocumentBuilder().setTitle('ShopAI API').setDescription('Sprint 9: Products, Auth, Orders, AI').setVersion('1.0').addBearerAuth().build();
 SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, swagger));
 await app.listen(Number(config.get('PORT') || 3000), '0.0.0.0');
}
bootstrap().catch(error => {console.error(error); process.exit(1);});
