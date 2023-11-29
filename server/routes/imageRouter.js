const express = require('express')
const { returnError, returnFail } = require('../utils/return')
const router = express.Router()
const Paths = require('../utils/paths')
const { MaxCount } = require('../config')
const { readImageListFile } = require('../controll/editImageControll')

// 上传图片
router.post('/upload', (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.json(returnError({ code: 400, message: '请选择文件' }))
    }
    const list = readImageListFile()
    if (list.length >= MaxCount) {
      return res.json(returnError({ message: `最多上传${MaxCount}张图片` }))
    }
    const fileObj = req.files.file
    const filePath = `${Paths.ImageFilePath}/${fileObj.name}`
    fileObj.mv(filePath, (err) => {
      if (err) {
        res.json(returnError({ message: err.message }))
      }
      res.json(returnFail({ message: '上传成功', data: filePath }))
    })
  } catch (err) {
    res.json(returnError({ message: err.message }))
  }
})

module.exports = router
