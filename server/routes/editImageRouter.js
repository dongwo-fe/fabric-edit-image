const express = require('express')
const { returnError, returnFail } = require('../utils/return')
const {
  readImageListFile,
  pushImageItem,
  deleteImageItem,
  writeImageListFile,
  findImageItem,
  getImageDetail,
  setImageDetail,
  deleteImageDetail
} = require('../controll/editImageControll')
const { v4: uuid } = require('uuid')
const { joinStaticSrc } = require('../utils')
const fs = require('fs')
const path = require('path')
const router = express.Router()
const Paths = require('../utils/paths');
const { MaxCount } = require('../config')


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
    const list = readImageListFile()
    if (list.length >= 2) {
      return res.json(returnError({ message: `最多上传${MaxCount}个素材` }))
    }
    const data = uuid()
    pushImageItem({
      '_id': data,
      'stockName': '素材',
      'imgSrc': joinStaticSrc(req, stockName)
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
    return res.json(returnFail())
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
    const item = findImageItem(id)
    if (!item) return res.json(returnError({ message: '不存在' }))
    const imgPath = `${Paths.ImageFilePath}/${path.basename(item.imgSrc)}`
    fs.unlinkSync(imgPath);
    deleteImageDetail(item.image);
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
