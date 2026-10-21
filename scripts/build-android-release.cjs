const fs = require('node:fs');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const debugBuild = process.argv.includes('--debug');
const firebaseFile = path.join(root, 'android/app/google-services.json');
const firebaseConfigured = fs.existsSync(firebaseFile);
if (firebaseConfigured) {
  const config = JSON.parse(fs.readFileSync(firebaseFile, 'utf8'));
  if (!config.client?.some(client => client.client_info?.android_client_info?.package_name === 'com.shopai')) {
    throw new Error('Firebase configuration must include Android package com.shopai');
  }
}
// A local QA release talks to the local backend; production must opt in explicitly.
const appEnv = process.env.APP_ENV || 'development';
if (!['development', 'staging', 'production'].includes(appEnv)) {throw new Error('Invalid APP_ENV');}
const api = process.env.EXPO_PUBLIC_API_URL || (appEnv === 'development' ? 'http://10.0.2.2:3000' : '');
const apiUrl = new URL(api);
if (!['http:', 'https:'].includes(apiUrl.protocol) || (appEnv !== 'development' && apiUrl.protocol !== 'https:')) {
  throw new Error('Set EXPO_PUBLIC_API_URL to a valid backend URL (HTTPS for staging/production)');
}
console.log(`Android ${debugBuild ? 'debug' : 'release'} environment: ${appEnv}; Firebase: ${firebaseConfigured}`);
const cache = path.join(root, '.gradle-build');
const temp = path.join(cache, 'tmp');
fs.mkdirSync(temp, {recursive: true});
const args = [...(debugBuild ? [':app:assembleDebug'] : [':app:bundleRelease', ':app:assembleRelease']), '-PreactNativeArchitectures=arm64-v8a,x86_64', '--max-workers=2', '--no-daemon', '--console=plain'];
const windows = process.platform === 'win32';
const result = spawnSync(windows ? 'cmd.exe' : './gradlew', windows ? ['/d', '/c', 'gradlew.bat', ...args] : args, {
  cwd: path.join(root, 'android'), stdio: 'inherit',
  env: {...process.env, APP_ENV: appEnv, EXPO_PUBLIC_API_URL: api,
    FIREBASE_CONFIGURED: String(firebaseConfigured),
    SHOPAI_LOCAL_QA: appEnv === 'development' ? 'true' : 'false',
    GRADLE_USER_HOME: cache, TEMP: temp, TMP: temp,
    JAVA_TOOL_OPTIONS: `${process.env.JAVA_TOOL_OPTIONS || ''} -Djava.io.tmpdir="${temp}"`.trim()},
});
if (result.error) {throw result.error;}
process.exit(result.status ?? 1);
