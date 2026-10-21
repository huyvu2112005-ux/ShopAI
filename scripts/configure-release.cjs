// Run before a native build: node scripts/configure-release.cjs staging|production
// EAS_PROJECT_ID is public configuration; never place service account keys here.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const channel = process.argv[2];
const projectId = process.env.EAS_PROJECT_ID;
if (!['development', 'staging', 'production'].includes(channel)) {
  throw new Error('Specify development, staging or production');
}
if (!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(projectId || '') || /^0+-0+-0+-0+-0+$/.test(projectId)) {
  throw new Error('Set EAS_PROJECT_ID to the real Expo project UUID');
}
const api = new URL(process.env.EXPO_PUBLIC_API_URL || '');
if (channel !== 'development' && api.protocol !== 'https:') {
  throw new Error('Staging and production require EXPO_PUBLIC_API_URL with HTTPS');
}
const configPath = path.join(root, 'app.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
config.expo.extra.eas.projectId = projectId;
config.expo.updates.enabled = true;
config.expo.updates.url = `https://u.expo.dev/${projectId}`;
const manifestPath = path.join(root, 'android/app/src/main/AndroidManifest.xml');
const manifest = fs.readFileSync(manifestPath, 'utf8')
  .replace(/(android:name="expo.modules.updates.ENABLED"\s+android:value=")(?:true|false)(")/, '$1true$2')
  .replace(/https:\/\/u\.expo\.dev\/[0-9a-f-]+/gi, config.expo.updates.url)
  .replace(/(&quot;expo-channel-name&quot;:&quot;)[^&]+(&quot;)/, `$1${channel}$2`);
const plistPath = path.join(root, 'ios/ShopAI/Expo.plist');
const plist = fs.readFileSync(plistPath, 'utf8')
  .replace(/(<key>EXUpdatesEnabled<\/key>\s*)<false\/>/, '$1<true/>')
  .replace(/https:\/\/u\.expo\.dev\/[0-9a-f-]+/gi, config.expo.updates.url)
  .replace(/(<key>expo-channel-name<\/key>\s*<string>)[^<]+/, `$1${channel}`);
fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');
fs.writeFileSync(manifestPath, manifest);
fs.writeFileSync(plistPath, plist);
console.log(`Configured Expo project and native OTA channel: ${channel}. Rebuild the native app.`);
