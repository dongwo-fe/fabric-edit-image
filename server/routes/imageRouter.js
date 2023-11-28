const express = require('express')
const { returnError, returnFail } = require('../utils/return')
const router = express.Router()
const Paths = require('../utils/paths')

// 上传图片
router.post('/upload', (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      res.json(returnError({ code: 400, message: '请选择文件' }))
      return
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
