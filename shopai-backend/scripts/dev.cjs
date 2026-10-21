const {spawn} = require('node:child_process');
const compiler = spawn(process.execPath, ['node_modules/typescript/bin/tsc', '--watch', '--preserveWatchOutput'], {stdio: 'inherit'});
const server = spawn(process.execPath, ['--watch', 'dist/main.js'], {stdio: 'inherit'});
function stop() {compiler.kill(); server.kill();}
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
compiler.on('exit', () => server.kill());
server.on('exit', () => compiler.kill());
