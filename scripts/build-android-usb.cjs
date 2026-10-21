const {spawnSync} = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const result = spawnSync(process.execPath, [path.join(__dirname, 'build-android-release.cjs')], {
 cwd: root, stdio: 'inherit', env: {...process.env, APP_ENV: 'development', EXPO_PUBLIC_API_URL: 'http://127.0.0.1:3000', SHOPAI_DISABLE_OTA: 'true'},
});
if (result.error) {throw result.error;}
if (result.status !== 0) {process.exit(result.status ?? 1);}
fs.mkdirSync(path.join(root, 'artifacts'), {recursive: true});
fs.copyFileSync(path.join(root, 'android/app/build/outputs/apk/release/app-release.apk'), path.join(root, 'artifacts/ShopAI-USB.apk'));
console.log('USB QA APK: artifacts/ShopAI-USB.apk (backend via adb reverse; OTA disabled for this build only)');
