const fs = require('node:fs');
const path = require('node:path');
const {randomBytes} = require('node:crypto');
const {spawnSync} = require('node:child_process');
const dir = path.resolve(__dirname, '../.private');
fs.mkdirSync(dir, {recursive: true});
const key = path.join(dir, 'shopai-upload.keystore');
const properties = path.join(dir, 'android-signing.properties');
if (fs.existsSync(key) || fs.existsSync(properties)) {
  throw new Error('Signing credentials already exist. Back them up; never overwrite them.');
}
const password = randomBytes(32).toString('hex');
const keytool = process.env.JAVA_HOME
  ? path.join(process.env.JAVA_HOME, 'bin', process.platform === 'win32' ? 'keytool.exe' : 'keytool')
  : 'keytool';
const result = spawnSync(keytool, ['-genkeypair', '-noprompt', '-keystore', key,
  '-storetype', 'JKS', '-alias', 'shopai-upload', '-keyalg', 'RSA', '-keysize', '2048',
  '-validity', '10000', '-storepass:env', 'SHOPAI_KEY_PASSWORD', '-keypass:env', 'SHOPAI_KEY_PASSWORD',
  '-dname', 'CN=ShopAI Upload, OU=Mobile, O=ShopAI, L=Ho Chi Minh, C=VN'], {
  env: {...process.env, SHOPAI_KEY_PASSWORD: password}, stdio: 'inherit',
});
if (result.error) {throw result.error;}
if (result.status !== 0) {process.exit(result.status || 1);}
fs.writeFileSync(properties, `MYAPP_RELEASE_STORE_FILE=../../.private/shopai-upload.keystore\nMYAPP_RELEASE_STORE_PASSWORD=${password}\nMYAPP_RELEASE_KEY_ALIAS=shopai-upload\nMYAPP_RELEASE_KEY_PASSWORD=${password}\n`, {mode: 0o600, flag: 'wx'});
console.log('Created local upload key in .private/. Back up both files securely. Do not commit them.');
