import 'reflect-metadata';
import {Test} from '@nestjs/testing';
import {INestApplication, ValidationPipe} from '@nestjs/common';
import request from 'supertest';
import {randomBytes} from 'node:crypto';
import {mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve, sep, basename} from 'node:path';
import {spawnSync} from 'node:child_process';
import {PrismaService} from '../src/prisma/prisma.module';

describe('JWT Auth + real Prisma Orders (isolated SQLite)', () => {
  let app: INestApplication;
  let directory: string;
  let token: string;
  let product: {id: string; price: number};
  const password = 'e2e-test-password';
  const email = 'chapter11@shopai.test';
  const saved = {DATABASE_URL: process.env.DATABASE_URL, JWT_SECRET: process.env.JWT_SECRET, GEMINI_API_KEY: process.env.GEMINI_API_KEY};
  beforeAll(async () => {
    directory = mkdtempSync(join(tmpdir(), 'shopai-jest-'));
    const dbPath = join(directory, 'test.db');
    writeFileSync(dbPath, '');
    process.env.DATABASE_URL = `file:${dbPath.split(sep).join('/')}`;
    process.env.JWT_SECRET = randomBytes(32).toString('hex');
    process.env.GEMINI_API_KEY = '';
    const migration = spawnSync(process.execPath, [resolve('node_modules/prisma/build/index.js'), 'migrate', 'deploy'], {env: process.env, encoding: 'utf8'});
    if (migration.status !== 0) {throw new Error(migration.stderr || migration.stdout);}
    const {AppModule} = await import('../src/app.module');
    const module = await Test.createTestingModule({imports: [AppModule]}).compile();
    app = module.createNestApplication({logger: false});
    app.useGlobalPipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true, transform: true}));
    await app.init();
    const registered = await request(app.getHttpServer()).post('/api/auth/register').send({email, password, name: 'Chapter 11 QA'}).expect(201);
    token = registered.body.accessToken;
    product = (await request(app.getHttpServer()).get('/api/products').expect(200)).body[0];
  });
  afterAll(async () => {
    if (app) {await app.close();}
    if (directory) {
      if (!resolve(directory).startsWith(resolve(tmpdir()) + sep) || !basename(directory).startsWith('shopai-jest-')) {throw new Error('Unsafe test cleanup path');}
      rmSync(directory, {recursive: true, force: true});
    }
    for (const [key, value] of Object.entries(saved)) {if (value === undefined) {delete process.env[key];} else {process.env[key] = value;}}
  });
  describe('POST /api/auth/login', () => {
    it('returns a real signed JWT for valid credentials', async () => {
      const response = await request(app.getHttpServer()).post('/api/auth/login').send({email, password}).expect(200);
      expect(response.body.accessToken.split('.')).toHaveLength(3);
      expect(response.body.user.password).toBeUndefined();
    });
    it('returns 401 for a wrong password', () => request(app.getHttpServer()).post('/api/auth/login').send({email, password: 'incorrect-password'}).expect(401));
    it('returns 400 for malformed email', () => request(app.getHttpServer()).post('/api/auth/login').send({email: 'invalid', password}).expect(400));
  });
  describe('POST /api/orders', () => {
    const input = () => ({items: [{productId: product.id, quantity: 1}], total: product.price});
    it('returns 401 without a token', () => request(app.getHttpServer()).post('/api/orders').send(input()).expect(401));
    it('returns 401 for a forged token', () => request(app.getHttpServer()).post('/api/orders').set('Authorization', 'Bearer forged-token').send(input()).expect(401));
    it('returns 201 and persists the server-calculated total for a valid JWT', async () => {
      const created = await request(app.getHttpServer()).post('/api/orders').set('Authorization', `Bearer ${token}`).send(input()).expect(201);
      expect(created.body).toMatchObject({status: 'PENDING', total: product.price});
      const stored = await app.get(PrismaService).order.findUnique({where: {id: created.body.id}});
      expect(stored?.total).toBe(product.price);
    });
    it('rejects a forged total and keeps another account out of the order', async () => {
      await request(app.getHttpServer()).post('/api/orders').set('Authorization', `Bearer ${token}`).send({...input(), total: 1}).expect(400);
      const order = await request(app.getHttpServer()).post('/api/orders').set('Authorization', `Bearer ${token}`).send(input()).expect(201);
      const other = await request(app.getHttpServer()).post('/api/auth/register').send({email: 'other@shopai.test', password, name: 'Other'}).expect(201);
      await request(app.getHttpServer()).get(`/api/orders/${order.body.id}`).set('Authorization', `Bearer ${other.body.accessToken}`).expect(404);
      await request(app.getHttpServer()).post(`/api/orders/${order.body.id}/pay`).set('Authorization', `Bearer ${token}`).expect(201).expect(res => expect(res.body.status).toBe('PAID'));
    });
  });
});
