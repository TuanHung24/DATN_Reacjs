const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://provinces.open-api.vn',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    })
  );
};
