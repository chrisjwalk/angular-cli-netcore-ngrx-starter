module.exports = {
  '*.{ts,js}': 'eslint --cache --cache-location=.husky/_ --fix',
  '*.{ts,js,css,scss,md,mdx}': 'prettier --write',
  // Keeps apps/web-app/src/assets/home.md (rendered + PWA-precached) in sync
  // with README.md — the content/home.md twin is maintained by hand.
  'README.md': 'pnpm update-readme',
};
