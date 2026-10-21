const fs = require('node:fs');
const path = require('node:path');
if (process.env.FIREBASE_CONFIGURED === undefined) {
  process.env.FIREBASE_CONFIGURED = String(fs.existsSync(path.join(__dirname, 'android/app/google-services.json')));
}

module.exports = {
  presets: ['babel-preset-expo'],

  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],

        alias: {
          '@assets': './src/assets',
          '@components': './src/components',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@store': './src/store',
          '@services': './src/services',
          '@hooks': './src/hooks',
          '@data': './src/data',
          '@utils': './src/utils',
          '@constants': './src/constants',
          '@types': './src/types',
          '@api': './src/api',
        },
      },
    ],

    '@babel/plugin-transform-export-namespace-from',

    ['transform-inline-environment-variables', {
      include: ['APP_ENV', 'FIREBASE_CONFIGURED'],
    }],

    'react-native-worklets/plugin',
  ],
};
