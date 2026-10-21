// This suite clears app state. Only an explicitly selected emulator is accepted.
const {spawnSync, execFileSync} = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');
const {randomUUID} = require('node:crypto');
const root = path.resolve(__dirname, '..');
async function main() {
 const serial = process.argv[2] || process.env.E2E_ANDROID_SERIAL;
 if (!serial?.startsWith('emulator-')) {throw Error('Pass a dedicated test emulator: npm run e2e -- emulator-5556. Suite clears its ShopAI app data; physical phones are refused.');}
 const adb = process.env.ANDROID_HOME ? path.join(process.env.ANDROID_HOME, 'platform-tools', process.platform === 'win32' ? 'adb.exe' : 'adb') : 'adb';
 execFileSync(adb, ['-s', serial, 'get-state'], {stdio: 'pipe'});
 const origin = process.env.E2E_API_ORIGIN || 'http://127.0.0.1:3000';
 const health = await fetch(`${origin}/api/health`, {signal: AbortSignal.timeout(5000)});
 if (!health.ok) {throw Error('Start the real NestJS backend before running E2E.');}
 const credentials = {name: 'Maestro QA', email: `maestro-${randomUUID().slice(0, 12)}@shopai.test`, password: `Qa11-${randomUUID().slice(0, 12)}`};
 const registration = await fetch(`${origin}/api/auth/register`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(credentials)});
 if (registration.status !== 201) {throw Error(`QA registration HTTP ${registration.status}`);}
 const session = await registration.json();
 execFileSync(adb, ['-s', serial, 'reverse', 'tcp:3000', 'tcp:3000']);
 const appId = fs.existsSync(path.join(root, 'android/app/google-services.json')) ? 'com.shopai' : 'com.shopai.qa';
 const reportDir = path.join(root, '.maestro/artifacts'); fs.mkdirSync(reportDir, {recursive: true});
 const args = ['--device', serial, 'test', '--format', 'junit', '--output', path.join(reportDir, 'junit.xml'), '--debug-output', reportDir, '-e', `E2E_APP_ID=${appId}`, '-e', `E2E_EMAIL=${credentials.email}`, '-e', `E2E_PASSWORD=${credentials.password}`, '.maestro'];
 const portableLib = path.join(root, '.sprint11-check/tools/maestro/lib/*');
 const portable = fs.existsSync(path.dirname(portableLib));
 const command = portable ? 'java' : (process.platform === 'win32' ? 'maestro.bat' : 'maestro');
 const cliArgs = portable ? ['-cp', portableLib, 'maestro.cli.AppKt', ...args] : args;
 const result = spawnSync(command, cliArgs, {cwd: root, stdio: 'inherit', shell: !portable && process.platform === 'win32', env: {...process.env, MAESTRO_CLI_NO_ANALYTICS: '1', MAESTRO_CLI_ANALYSIS_NOTIFICATION_DISABLED: 'true'}});
 if (result.error) {throw result.error;}
 if (result.status !== 0) {process.exitCode = result.status ?? 1; return;}
 const response = await fetch(`${origin}/api/orders`, {headers: {Authorization: `Bearer ${session.accessToken}`}});
 const orders = await response.json();
 if (!response.ok || !orders.some(order => order.status === 'PAID')) {throw Error('UI passed but no PAID order was persisted for the QA account.');}
 const report = {checkedAt: new Date().toISOString(), serial, appId, flows: ['login_home', 'cart_checkout'], status: 'PASS', orders: orders.map(({id, total, status}) => ({id, total, status}))};
 fs.writeFileSync(path.join(reportDir, 'acceptance.json'), JSON.stringify(report, null, 2));
 console.log('E2E PASS: real JWT login, UI checkout and persisted PAID order verified.');
}
main().catch(error => {console.error(error.message); process.exitCode = 1;});
