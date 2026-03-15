module.exports = {
  '*.{ts,js}': 'eslint --cache --cache-location=.husky/_ --fix',
  '*.{ts,js,css,scss,md,mdx}': 'prettier --write',
  'README.md': () => [
    'pnpm nx run web-app:update-readme',
    'git add apps/web-app/src/assets/home.md',
  ],
};
