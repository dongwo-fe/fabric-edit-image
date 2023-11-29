const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = app => {
  app.use('/api_editimg', createProxyMiddleware({
    target: 'http://localhost:8585',
    changeOrigin: true,
    secure: false
  }))
  app.use('/api_image', createProxyMiddleware({
    target: 'http://localhost:8585',
    changeOrigin: true,
    secure: false
  }))
}
