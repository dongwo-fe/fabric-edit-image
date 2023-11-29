const { Port } = require('../config')

function joinStaticSrc (req, name) {
  if (req.ip.indexOf('8.141.12.38') > -1) {
    return `http://8.141.12.38:${Port}/static/images/${name}`
  }
  return `http://localhost:${Port}/static/images/${name}`
}

module.exports = {
  joinStaticSrc
}
