module.exports = {
  '*.{ts,js}': () => 'vp lint',
  '*.{ts,js,css,scss,md,mdx}': () => 'vp fmt',
};
