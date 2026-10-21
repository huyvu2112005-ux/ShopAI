const { getDefaultConfig } = require('expo/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);
config.maxWorkers = 2;
const existingBlockList = config.resolver.blockList;
config.resolver.blockList = [
  ...(Array.isArray(existingBlockList) ? existingBlockList : existingBlockList ? [existingBlockList] : []),
  /[/\\](?:\.gradle-build|\.private|\.sprint9-check|\.sprint10-check|shopai-backend)[/\\].*/,
  /[/\\]android[/\\](?:app[/\\])?(?:build|\.cxx)[/\\].*/,
];
module.exports = config;
