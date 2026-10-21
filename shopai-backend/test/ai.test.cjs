const {test} = require('node:test');
const assert = require('node:assert/strict');
const {ApiError} = require('@google/genai');
const {withGeminiRetry, requestGeminiInteraction} = require('../dist/ai/gemini-request');

test('temporary Gemini failure recovers without exposing an error to mobile', async () => {
 let calls = 0;
 const response = await withGeminiRetry(async () => {
  if (++calls === 1) throw new ApiError({status: 503, message: 'Busy'});
  return {text: 'A real upstream reply'};
 });
 assert.equal(calls, 2);
 assert.equal(response.text, 'A real upstream reply');
});
test('persistent upstream failure is bounded and preserves its status', async () => {
 let calls = 0;
 const failure = new ApiError({status: 503, message: 'Busy'});
 await assert.rejects(withGeminiRetry(async () => {calls++; throw failure;}), error => error === failure);
 assert.equal(calls, 2);
});
test('credentials, quota and invalid model errors are returned without retrying', async () => {
 for (const status of [401, 403, 404, 429]) {
  let calls = 0;
  const failure = new ApiError({status, message: 'Unavailable'});
  await assert.rejects(withGeminiRetry(async () => {calls++; throw failure;}), error => error === failure);
  assert.equal(calls, 1);
 }
});

test('temporary fetch transport errors recover once, while programming errors are not retried', async () => {
 for (const code of ['ECONNRESET', 'ETIMEDOUT', 'EAI_AGAIN', 'UND_ERR_CONNECT_TIMEOUT', 'UND_ERR_SOCKET']) {
  let calls = 0;
  const result = await withGeminiRetry(async () => {
   if (++calls === 1) throw new TypeError('fetch failed', {cause: {code}});
   return 'recovered';
  });
  assert.equal(result, 'recovered');
  assert.equal(calls, 2);
 }
 for (const error of [new TypeError('invalid argument'), new TypeError('fetch failed', {cause: {code: 'INVALID_CONFIG'}})]) {
  let calls = 0;
  await assert.rejects(withGeminiRetry(async () => {calls++; throw error;}), cause => cause === error);
  assert.equal(calls, 1);
 }
 let calls = 0;
 const persistent = new TypeError('fetch failed', {cause: {code: 'ECONNRESET'}});
 await assert.rejects(withGeminiRetry(async () => {calls++; throw persistent;}), cause => cause === persistent);
 assert.equal(calls, 2);
});

test('Interactions sends stateless conversation history and returns only final model text', async () => {
 const reply = await requestGeminiInteraction({
  apiKey: 'test-key', model: 'gemini-3.5-flash-lite', message: 'RAM bao nhieu?',
  history: [{role: 'user', text: 'Laptop hoc tap'}, {role: 'model', text: 'Laptop A'}], deadline: Date.now() + 10000,
 }, async (url, options) => {
  assert.equal(url, 'https://generativelanguage.googleapis.com/v1/interactions');
  assert.equal(options.headers['x-goog-api-key'], 'test-key');
  const body = JSON.parse(options.body);
  assert.equal(body.store, false);
  assert.deepEqual(body.input.map(step => step.type), ['user_input', 'model_output', 'user_input']);
  assert.deepEqual(body.input.map(step => step.content[0].text), ['Laptop hoc tap', 'Laptop A', 'RAM bao nhieu?']);
  return Response.json({status: 'completed', steps: [
   {type: 'thought', content: [{type: 'text', text: 'Never expose reasoning'}]},
   {type: 'model_output', content: [{type: 'text', text: 'Chọn RAM 16GB.'}]},
  ]});
 });
 assert.equal(reply, 'Chọn RAM 16GB.');
});

test('Interactions preserves HTTP failures and rejects incomplete or empty replies', async () => {
 const input = {apiKey: 'test-key', model: 'model', message: 'Hello', history: [], deadline: Date.now() + 10000};
 for (const status of [401, 403, 404, 429, 500, 503]) {
  await assert.rejects(requestGeminiInteraction(input, async () => Response.json({error: {message: 'upstream failure'}}, {status})), error => error instanceof ApiError && error.status === status);
 }
 for (const response of [{status: 'completed', steps: []}, {status: 'in_progress', steps: [{type: 'model_output', content: [{type: 'text', text: 'partial'}]}]}]) {
  await assert.rejects(requestGeminiInteraction(input, async () => Response.json(response)), error => error instanceof ApiError && error.status === 502);
 }
 let calls = 0;
 await assert.rejects(withGeminiRetry(async () => {
  calls++;
  throw new ApiError({status: 503, message: 'Busy'});
 }, Date.now()), error => error.status === 503);
 assert.equal(calls, 1, 'Do not retry beyond the shared deadline');
});
