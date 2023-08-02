const { createProxyMiddleware } = require('http-proxy-middleware')

console.log(1111)
module.exports = app => {
  app.use('/api_editimg', createProxyMiddleware({
    target: 'https://sharedev.jrdaimao.com',
    changeOrigin: true,
    pathRewrite: {
      '^/api_editimg': ''
    },
    secure: false
  }))
}
