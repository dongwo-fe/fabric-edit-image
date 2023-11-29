const fs = require('fs')
const Paths = require('../utils/paths')

const readImageListFile = () => {
  const list = fs.readFileSync(Paths.ImageListPath, 'utf-8')
  return list ? JSON.parse(list) : []
}

const pushImageItem = (value) => {
  const list = readImageListFile()
  list.push(value)
  fs.writeFileSync(Paths.ImageListPath, JSON.stringify(list))
}

const findImageItem = (id) => {
  const list = readImageListFile()
  return list.find(item => item._id === id)
}

const deleteImageItem = (id) => {
  const list = readImageListFile()
  const item = findImageItem(id)
  return list.filter(v => v._id !== item._id)
}

const writeImageListFile = (list) => {
  fs.writeFileSync(Paths.ImageListPath, JSON.stringify(list))
}

const getImageDetail = (src) => {
  const json = fs.readFileSync(Paths.ImageDetailPath, 'utf-8')
  const data = json ? JSON.parse(json) : {}
  return data[src]
}

const setImageDetail = (key, value) => {
  const json = fs.readFileSync(Paths.ImageDetailPath, 'utf-8')
  const data = json ? JSON.parse(json) : {}
  data[key] = value
  fs.writeFileSync(Paths.ImageDetailPath, JSON.stringify(data))
}

module.exports = {
  readImageListFile,
  pushImageItem,
  deleteImageItem,
  writeImageListFile,
  getImageDetail,
  setImageDetail,
  findImageItem
}
