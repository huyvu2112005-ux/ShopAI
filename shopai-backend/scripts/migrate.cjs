const fs = require('node:fs');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
// Create the default SQLite file first; the Windows schema engine can fail on a missing file.
const envFile = fs.existsSync('.env') ? fs.readFileSync('.env', 'utf8') : '';
const match = envFile.match(/^DATABASE_URL\s*=\s*["']?([^"'\r\n]+)/m);
const url = process.env.DATABASE_URL || match?.[1]?.trim() || 'file:./dev.db';
if (url.startsWith('file:')) {
  const filename = path.resolve('prisma', url.slice(5));
  fs.mkdirSync(path.dirname(filename), {recursive: true});
  fs.closeSync(fs.openSync(filename, 'a'));
}
const result = spawnSync(process.execPath, ['node_modules/prisma/build/index.js', 'migrate', 'dev', ...process.argv.slice(2)], {stdio: 'inherit', env: process.env});
process.exit(result.status ?? 1);
