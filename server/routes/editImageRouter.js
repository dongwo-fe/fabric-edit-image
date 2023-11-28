const express = require('express')
const { returnError, returnFail } = require('../utils/return')
const {
  readImageListFile,
  pushImageItem,
  deleteImageItem,
  writeImageListFile,
  getImageDetail,
  setImageDetail
} = require('../controll/editImageControll')
const { v4: uuid } = require('uuid')
const { Port } = require('../config/index')
const router = express.Router()

// 已上传的图片列表
router.get('/liststock', async (req, res) => {
  try {
    const list = readImageListFile()
    res.json(returnFail({ data: list }))
  } catch (err) {
    res.json(returnError({ message: err.message }))
  }
})

// 新增素材
router.post('/addstock', (req, res) => {
  try {
    const { stockName } = req.body
    if (!stockName) {
      return res.json(returnError({ message: '参数有误，请检查' }))
    }
    const data = uuid()
    pushImageItem({
      '_id': data,
      'stockName': '素材',
      'imgSrc': `http://localhost:${Port}/static/images/${stockName}`
    })
    res.json(returnFail({ data }))
  } catch (err) {
    res.json(returnError({ message: err.message }))
  }
})

router.post('/save', (req, res) => {
  try {
    const { data, imgSrc } = req.body
    if (!data || !imgSrc) {
      return res.json(returnError({ message: '参数有误' }))
    }
    setImageDetail(imgSrc, data)
    return res.json(returnError())
  } catch (err) {
    res.json(returnError({ message: err.message }))
  }
})

// 删除素材
router.get('/delstock', (req, res) => {
  try {
    const { id } = req.query
    if (!id) {
      return res.json(returnError({ message: 'id不存在' }))
    }
    const list = deleteImageItem(id)
    writeImageListFile(list)
    res.json(returnFail())
  } catch (err) {
    res.json(returnError({ message: err.message }))
  }
})

// 详情
router.get('/detail', (req, res) => {
  try {
    const { imgSrc } = req.query
    if (!imgSrc) {
      return res.json(returnError({ message: 'imgSrc不存在' }))
    }
    const data = getImageDetail(imgSrc)
    res.json(returnFail({ data }))
  } catch (err) {
    res.json(returnError({ message: err.message }))
  }
})

module.exports = router
