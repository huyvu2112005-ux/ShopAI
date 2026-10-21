// Exercise the running local NestJS server, including a real Gemini request.
// Creates one QA account/order; never deletes existing application data.
const assert = require('node:assert/strict');
const {randomUUID} = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const origin = 'http://127.0.0.1:3000';
const results = [];
async function request(route, method = 'GET', body, token) {
 const response = await fetch(`${origin}${route}`, {
  method, signal: AbortSignal.timeout(29000),
  headers: {'Content-Type': 'application/json', ...(token ? {Authorization: `Bearer ${token}`} : {})},
  ...(body === undefined ? {} : {body: JSON.stringify(body)}),
 });
 const text = await response.text();
 let data;
 try {data = JSON.parse(text);} catch {data = text;}
 return {status: response.status, data};
}
async function check(name, action) {
 try {
  const evidence = await action();
  results.push({name, status: 'PASS', evidence});
  console.log(`PASS ${name}`);
 } catch (error) {
  results.push({name, status: 'FAIL', reason: error.message});
  console.log(`FAIL ${name}: ${error.message}`);
 }
}
async function main() {
 await check('Health and Swagger', async () => {
  assert.equal((await request('/api/health')).status, 200);
  assert.equal((await request('/api/docs')).status, 200);
  const docs = await request('/api/docs-json');
  assert.equal(docs.status, 200);
  assert.ok(docs.data.components.securitySchemes.bearer);
  return 'HTTP 200; Swagger Bearer authentication documented';
 });
 let product;
 await check('Products, detail and 404', async () => {
  const catalog = await request('/api/products');
  assert.equal(catalog.status, 200);
  assert.ok(Array.isArray(catalog.data) && catalog.data.length >= 20);
  product = catalog.data[0];
  assert.equal((await request(`/api/products/${product.id}`)).status, 200);
  assert.equal((await request('/api/products/qa-product-does-not-exist')).status, 404);
  assert.equal((await request(product.image)).status, 200);
  const imagePaths = [...new Set(catalog.data.map(item => item.image))];
  const imageStatuses = await Promise.all(imagePaths.map(async image => (await fetch(`${origin}${image}`, {signal: AbortSignal.timeout(10000)})).status));
  assert.ok(imageStatuses.every(status => status === 200), 'Every catalog image must load');
  const first = await request('/api/products?page=1&limit=8');
  const last = await request('/api/products?page=3&limit=8');
  assert.equal(first.data.items.length, 8);
  assert.equal(first.data.nextPage, 2);
  assert.equal(last.data.items.length, 4);
  assert.equal(last.data.nextPage, null);
  const search = await request(`/api/products?page=1&limit=8&search=${encodeURIComponent(catalog.data.at(-1).name)}`);
  assert.ok(search.data.items.some(item => item.id === catalog.data.at(-1).id));
  return `${catalog.data.length} products; all ${imagePaths.length} images HTTP 200; true pagination 8/8/4; last-page search; missing detail HTTP 404`;
 });
 await check('DTO and Orders Guard', async () => {
  assert.equal((await request('/api/auth/register', 'POST', {name: '', email: 'invalid', password: 'x'})).status, 400);
  assert.equal((await request('/api/orders')).status, 401);
  assert.equal((await request('/api/orders', 'GET', undefined, 'invalid-jwt')).status, 401);
  return 'Invalid DTO rejected; missing/invalid JWT rejected';
 });
 await check('Real register/login, checkout, server total, Orders and PAID', async () => {
  assert.ok(product, 'Product API must be available first');
  const credentials = {email: `qa-${randomUUID()}@shopai.test`, password: randomUUID()};
  const registered = await request('/api/auth/register', 'POST', {...credentials, name: 'Live QA'});
  assert.equal(registered.status, 201);
  const session = await request('/api/auth/login', 'POST', credentials);
  assert.equal(session.status, 200);
  const token = session.data.accessToken;
  assert.equal(typeof token, 'string');
  const input = {items: [{productId: product.id, quantity: 1}], total: product.price};
  assert.equal((await request('/api/orders', 'POST', {...input, total: product.price + 1}, token)).status, 400);
  const order = await request('/api/orders', 'POST', input, token);
  assert.equal(order.status, 201);
  assert.equal(order.data.status, 'PENDING');
  assert.equal(order.data.total, product.price);
  const route = `/api/orders/${order.data.id}`;
  assert.equal((await request(route, 'GET', undefined, token)).status, 200);
  const paid = await request(`${route}/pay`, 'POST', undefined, token);
  assert.equal(paid.status, 201);
  assert.equal(paid.data.status, 'PAID');
  assert.equal((await request(route, 'GET', undefined, token)).data.status, 'PAID');
  assert.ok((await request('/api/orders', 'GET', undefined, token)).data.some(item => item.id === order.data.id));
  return {orderId: order.data.id, status: 'PAID', total: paid.data.total};
 });
 await check('Real Gemini reply through NestJS', async () => {
  const reply = await request('/api/ai/chat', 'POST', {message: 'Tư vấn laptop phù hợp học tập, trả lời ngắn gọn.'});
  assert.equal(reply.status, 201, `AI HTTP ${reply.status}: ${reply.data.message ?? 'No reply'}`);
  assert.equal(typeof reply.data.reply, 'string');
  assert.ok(reply.data.reply.trim().length > 0);
  const followup = await request('/api/ai/chat', 'POST', {
   message: 'Nên chọn RAM bao nhiêu?',
   history: [{role: 'user', text: 'Tư vấn laptop phù hợp học tập, trả lời ngắn gọn.'}, {role: 'model', text: reply.data.reply}],
  });
  assert.equal(followup.status, 201, `AI follow-up HTTP ${followup.status}: ${followup.data.message ?? 'No reply'}`);
  assert.equal(typeof followup.data.reply, 'string');
  assert.ok(followup.data.reply.trim().length > 0);
  return {reply: reply.data.reply, followup: followup.data.reply};
 });
 const directory = path.resolve(__dirname, '../.sprint10-check');
 fs.mkdirSync(directory, {recursive: true});
 const report = {checkedAt: new Date().toISOString(), origin, results,
  note: 'Live API verification only. UI/native/Firebase/OTA evidence is indexed in CHAPTER_1_10_STATUS.md. Physical device is deferred by the user.'};
 fs.writeFileSync(path.join(directory, 'live-verification.json'), JSON.stringify(report, null, 2) + '\n');
 console.log(`Report: ${path.join(directory, 'live-verification.json')}`);
 if (results.some(result => result.status !== 'PASS')) process.exitCode = 1;
}
main().catch(error => {console.error(error.message); process.exitCode = 1;});
