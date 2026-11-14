const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const sharedConfigPath = path.join(__dirname, 'js', 'tailwind-config.js');
const sharedConfigContext = { tailwind: {} };
vm.runInNewContext(fs.readFileSync(sharedConfigPath, 'utf8'), sharedConfigContext, {
  filename: sharedConfigPath
});

module.exports = {
  content: [
    './*.html',
    './*.js',
    './js/**/*.js',
    './assets/js/**/*.js',
    './tools/components/**/*.html'
  ],
  darkMode: sharedConfigContext.tailwind.config.darkMode,
  theme: sharedConfigContext.tailwind.config.theme,
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ]
};
