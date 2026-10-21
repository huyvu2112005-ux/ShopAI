const {test} = require('node:test');
const assert = require('node:assert/strict');
const {spawn, spawnSync} = require('node:child_process');
const {once} = require('node:events');
const {randomUUID, randomBytes} = require('node:crypto');
const {unlinkSync, closeSync, openSync} = require('node:fs');
const path = require('node:path');
const {JwtService} = require('@nestjs/jwt');
test('Sprint 9: JWT, validation, ownership, totals, payment and persistence', {timeout: 60000}, async () => {
 const db = `test-${randomUUID()}.db`;
 const env = {...process.env, PORT: '3099', DATABASE_URL: `file:./${db}`, JWT_SECRET: randomBytes(32).toString('hex'), GEMINI_API_KEY: ''};
 closeSync(openSync(path.join('prisma', db), 'a'));
 const migration = spawnSync(process.execPath, ['node_modules/prisma/build/index.js', 'migrate', 'deploy'], {env, encoding: 'utf8'});
 assert.equal(migration.status, 0, migration.stderr);
 let server, output = '';
 async function start() {
  output = '';
  server = spawn(process.execPath, ['dist/main.js'], {env, stdio: ['ignore', 'pipe', 'pipe']});
  server.stdout.on('data', c => {output += c;}); server.stderr.on('data', c => {output += c;});
  for (let i = 0; i < 100; i++) {
   if (server.exitCode !== null) throw new Error(output);
   try {if ((await fetch('http://127.0.0.1:3099/api/health')).ok) return;} catch {}
   await new Promise(r => setTimeout(r, 100));
  }
  throw new Error(output);
 }
 async function stop() {if (server && server.exitCode === null) {const ended = once(server, 'exit'); server.kill(); await ended;}}
 async function req(route, method = 'GET', body, token) {
  const r = await fetch(`http://127.0.0.1:3099${route}`, {method, headers: {'Content-Type': 'application/json', ...(token ? {Authorization: `Bearer ${token}`} : {})}, ...(body ? {body: JSON.stringify(body)} : {})});
  return {status: r.status, data: await r.json()};
 }
 try {
  await start();
  const products = await req('/api/products'); assert.equal(products.status, 200); assert.equal(products.data.length, 20);
  assert.deepEqual(products.data, (await req('/api/products')).data);
  const p = products.data[0];
  const firstPage = await req('/api/products?page=1&limit=8');
  assert.equal(firstPage.status, 200); assert.equal(firstPage.data.items.length, 8); assert.equal(firstPage.data.nextPage, 2); assert.equal(firstPage.data.total, 20);
  const lastPage = await req('/api/products?page=3&limit=8');
  assert.equal(lastPage.data.items.length, 4); assert.equal(lastPage.data.nextPage, null);
  assert.equal((await req('/api/products?page=0&limit=8')).status, 400);
  assert.equal((await req('/api/products?page=1&limit=101')).status, 400);
  const search = await req('/api/products?page=1&limit=8&search=' + encodeURIComponent(products.data[19].name));
  assert.ok(search.data.items.some(item => item.id === products.data[19].id));
  assert.equal((await req('/api/products/' + encodeURIComponent(p.barcode))).data.id, p.id);
  assert.equal((await req(`/api/products/${p.id}`)).status, 200);
  assert.equal((await req('/api/products/missing')).status, 404);
  assert.equal((await fetch(`http://127.0.0.1:3099${p.image}`)).status, 200);
  assert.equal((await req('/api/products', 'POST', {name: 'Test', price: -100, image: 'https://example.com/img.jpg'})).status, 400);
  assert.equal((await req('/api/auth/register', 'POST', {email: 'invalid', password: 'x', name: ''})).status, 400);
  assert.equal((await req('/api/auth/register', 'POST', {email: 'blank@shopai.com', password: '123456', name: '   '})).status, 400);
  assert.equal((await req('/api/auth/register', 'POST', {email: 'unicode@shopai.com', password: '😀'.repeat(19), name: 'Unicode'})).status, 400);
  const user = {email: 'test@shopai.com', password: '123456', name: 'Test User'};
  const auth = await req('/api/auth/register', 'POST', user); assert.equal(auth.status, 201);
  const token = auth.data.accessToken; assert.equal(token.split('.').length, 3); assert.equal(auth.data.user.password, undefined);
  assert.equal((await req('/api/auth/register', 'POST', user)).status, 409);
  assert.equal((await req('/api/auth/login', 'POST', {email: user.email, password: 'wrong-password'})).status, 401);
    assert.equal((await req('/api/auth/login', 'POST', {email: user.email, password: user.password})).status, 200);
  assert.equal((await req('/api/auth/login', 'POST', {email: `  ${user.email.toUpperCase()}  `, password: user.password})).status, 200);
  const jwt = new JwtService({secret: env.JWT_SECRET});
  for (const payload of [{}, {sub: 42}, {sub: ''}]) {
   assert.equal((await req('/api/orders', 'GET', undefined, jwt.sign(payload))).status, 401);
  }
  const body = {items: [{productId: p.id, quantity: 2}], total: p.price * 2};
  assert.equal((await req('/api/orders', 'POST', body)).status, 401);
  assert.equal((await req('/api/orders', 'POST', body, 'demo-token')).status, 401);
  assert.equal((await req('/api/orders', 'POST', {...body, total: 1000}, token)).status, 400);
  assert.equal((await req('/api/orders', 'POST', {items: [{productId: p.id, quantity: 1}, {productId: p.id, quantity: 1}], total: p.price * 2}, token)).status, 400);
  assert.equal((await req('/api/orders', 'POST', {items: [{productId: p.id, quantity: 1}, {productId: p.legacyId, quantity: 1}], total: p.price * 2}, token)).status, 400);
  for (const quantity of [0, -1, 1.5, 101]) assert.equal((await req('/api/orders', 'POST', {...body, items: [{productId: p.id, quantity}]}, token)).status, 400);
  assert.equal((await req('/api/orders', 'POST', {...body, items: [{productId: 'missing', quantity: 1}]}, token)).status, 404);
  const created = await req('/api/orders', 'POST', body, token); assert.equal(created.status, 201);
  assert.equal(created.data.status, 'PENDING'); assert.equal(created.data.total, body.total); assert.equal(created.data.items[0].price, p.price);
  const id = created.data.id;
  const other = await req('/api/auth/register', 'POST', {...user, email: 'other@shopai.com'});
  assert.deepEqual((await req('/api/orders', 'GET', undefined, other.data.accessToken)).data, []);
  assert.equal((await req(`/api/orders/${id}`, 'GET', undefined, other.data.accessToken)).status, 404);
  assert.equal((await req(`/api/orders/${id}/pay`, 'POST', undefined, other.data.accessToken)).status, 404);
  assert.equal((await req(`/api/orders/${id}/pay`, 'POST', undefined, token)).data.status, 'PAID');
  assert.equal((await req(`/api/orders/${id}/pay`, 'POST', undefined, token)).data.status, 'PAID');
  assert.equal((await req('/api/ai/chat', 'POST', {message: ''})).status, 400);
  assert.equal((await req('/api/ai/chat', 'POST', {message: '   '})).status, 400);
  assert.equal((await req('/api/ai/chat', 'POST', {message: 'hello', history: [{role: 'model', text: 'hello'}]})).status, 400);
  assert.equal((await req('/api/ai/chat', 'POST', {message: 'Tư vấn điện thoại'})).status, 503);
  const docs = await req('/api/docs-json'); assert.equal(docs.status, 200); assert.ok(docs.data.components.securitySchemes.bearer); assert.ok(docs.data.paths['/api/orders'].post.security);
  await stop(); await start();
  const persisted = await req(`/api/orders/${id}`, 'GET', undefined, token); assert.equal(persisted.status, 200); assert.equal(persisted.data.status, 'PAID');
  assert.equal((await req('/api/orders', 'GET', undefined, token)).data.length, 1);
  const product = await req('/api/products', 'POST', {name: ' New product ', price: 100000, image: 'https://example.com/new.jpg'});
  assert.equal(product.status, 201);
  assert.equal(product.data.name, 'New product');
  assert.equal(product.data.barcode, undefined);
  assert.equal(product.data.legacyId, undefined);
  assert.equal((await req(`/api/products/${product.data.id}`)).data.id, product.data.id);
  assert.equal((await req(`/api/products/${p.legacyId}`)).data.id, p.id);
 } finally {
  await stop();
  for (const suffix of ['', '-journal', '-wal', '-shm']) {try {unlinkSync(path.join('prisma', db + suffix));} catch {}}
 }
});
