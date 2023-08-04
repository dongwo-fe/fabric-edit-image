const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = app => {
  app.use('/api_editimg', createProxyMiddleware({
    target: 'https://sharedev.jrdaimao.com',
    changeOrigin: true,
    secure: false
  }))
  
  app.use('/easyhome-ops-web-application', createProxyMiddleware({
    target: 'https://gatewaydev.jrdaimao.com',
    changeOrigin: true,
    secure: false
  }))
  
  app.use('/api_font',createProxyMiddleware({
    target: 'https://acsit.jrdaimao.com',
    changeOrigin: true,
    secure: false,
    pathRewrite:{
      "^/api_font": ''
    }
  }))
  
  app.use('/api_image',createProxyMiddleware({
    target: 'https://acsit.jrdaimao.com',
    changeOrigin: true,
    secure: false
  }))
}
