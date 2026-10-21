const {execFileSync} = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const adb = process.env.ANDROID_HOME ? path.join(process.env.ANDROID_HOME, 'platform-tools', process.platform === 'win32' ? 'adb.exe' : 'adb') : 'adb';
function run(args) {return execFileSync(adb, args, {encoding: 'utf8'});}
async function main() {
 const entries = run(['devices']).split(/\r?\n/).slice(1).map(line => line.trim().split(/\s+/)).filter(parts => parts.length >= 2);
 const serial = process.argv[2] || entries.filter(([id, state]) => !id.startsWith('emulator-') && state === 'device').map(([id]) => id).filter(Boolean).join(',');
 if (!serial || serial.includes(',')) {throw Error('Connect exactly one Android phone using a data USB cable, enable USB debugging, unlock the phone and accept Allow USB debugging. Or pass its serial explicitly.');}
 if (!entries.some(([id, state]) => id === serial && state === 'device')) {throw Error('Device is offline or unauthorized. Unlock it and accept USB debugging, then retry.');}
 const apk = path.join(root, 'artifacts/ShopAI-USB.apk');
 if (!fs.existsSync(apk)) {throw Error('Run npm run android:usb first to create the USB APK.');}
 const health = await fetch('http://127.0.0.1:3000/api/health', {signal: AbortSignal.timeout(5000)});
 if (!health.ok) {throw Error('Start shopai-backend on port 3000 first.');}
 console.log(run(['-s', serial, 'reverse', 'tcp:3000', 'tcp:3000']));
 console.log(run(['-s', serial, 'install', '-r', apk]));
 const appId = fs.existsSync(path.join(root, 'android/app/google-services.json')) ? 'com.shopai' : 'com.shopai.qa';
 console.log(run(['-s', serial, 'shell', 'am', 'start', '-n', `${appId}/com.shopai.MainActivity`]));
 console.log(`Connected ${serial}. Keep the USB cable attached and the backend running. This release APK does not need Metro or Expo Go.`);
}
main().catch(error => {console.error(error.message); process.exitCode = 1;});
