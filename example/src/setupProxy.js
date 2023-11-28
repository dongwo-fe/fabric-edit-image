const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = app => {
  app.use('/api_editimg', createProxyMiddleware({
    target: 'http://localhost:5678',
    changeOrigin: true,
    secure: false
  }))
}
