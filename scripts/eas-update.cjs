const {spawnSync} = require('node:child_process');
const channel = process.argv[2];
if (!['development', 'staging', 'production'].includes(channel)) {throw new Error('Invalid channel');}
const app = require('../app.json').expo;
if (!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(app.extra?.eas?.projectId || '') || /^0+-0+-0+-0+-0+$/.test(app.extra.eas.projectId)) {
  throw new Error('Run release:configure with your real EAS_PROJECT_ID first');
}
const api = new URL(process.env.EXPO_PUBLIC_API_URL || '');
if (!['http:', 'https:'].includes(api.protocol) || (channel !== 'development' && api.protocol !== 'https:')) {
  throw new Error('Set EXPO_PUBLIC_API_URL to your deployed HTTPS backend');
}
const npmCli = process.env.npm_execpath;
if (!npmCli) {throw new Error('Run through npm run update:staging or update:production');}
const environment = channel === 'staging' ? 'preview' : channel;
const result = spawnSync(process.execPath, [npmCli, 'exec', '--yes', '--package=eas-cli', '--', 'eas', 'update', '--channel', channel, '--environment', environment, ...process.argv.slice(3)], {
  stdio: 'inherit',
  env: {...process.env, APP_ENV: channel},
});
if (result.error) {throw result.error;}
process.exit(result.status ?? 1);
