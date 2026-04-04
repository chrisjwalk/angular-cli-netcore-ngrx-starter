module.exports = {
  '*.{ts,js}': 'eslint --cache --cache-location=.husky/_ --fix',
  '*.{ts,js,css,scss,md,mdx}': 'prettier --write',
};
