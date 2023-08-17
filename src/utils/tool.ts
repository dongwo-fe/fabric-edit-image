// @ts-nocheck
/**
 * 预加载图片单张
 * @param src
 */
import { uuid } from './utils';

export const loadImage = (src: string) => {
  if (!src) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const img = new Image
    img.onload = () => {
      resolve()
    }
    img.onerror = (err) => {
      reject(err)
    }
    img.src = src
  })
}

/**
 * 预加载图片多张
 * @param list
 */
export const loadImageList = (list: Array<string>) => {
  return Promise.all(list.map(src => loadImage(src)))
}

/**
 * base64转file
 * @param {string} urlData base64格式图片
 * @returns
 */
export function base64ConvertFile(urlData: string) {
  const arr = urlData.split(',')
  // @ts-ignore
  const type = arr[0].match(/:(.*?);/)[1]
  const fileExt = type.split('/')[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], `${uuid()}.` + fileExt, {
    type: type
  });
}


// 分别传入图片宽高、父容器宽高
export const transformImgRatio = (imgWidth: any, imgHeight: any, containerWidth: any, containerHeight: any) => {
  debugger
  let [
    // 用于设定图片的宽和高
    tempWidth,
    tempHeight,
  ] = [
    0,
    0
  ]
  try {
    imgWidth = parseFloat(imgWidth)
    imgHeight = parseFloat(imgHeight)
    containerWidth = parseFloat(containerWidth)
    containerHeight = parseFloat(containerHeight)
  } catch (error) {
    throw new Error('抱歉，我只接收数值类型或者可以转成数值类型的参数')
  }

  if (imgWidth > 0 && imgHeight > 0) {
    //原图片宽高比例 大于 指定的宽高比例，这就说明了原图片的宽度必然 > 高度
    if (imgWidth / imgHeight >= containerWidth / containerHeight) {
      if (imgWidth > containerWidth) {
        tempWidth = containerWidth
        // 按原图片的比例进行缩放
        tempHeight = (imgHeight * containerWidth) / imgWidth
      } else {
        // 按照图片的大小进行缩放
        tempWidth = imgWidth
        tempHeight = imgHeight
      }
    } else {  // 原图片的高度必然 > 宽度
      if (imgHeight > containerHeight) {

        tempHeight = containerHeight
        // 按原图片的比例进行缩放
        tempWidth = (imgWidth * containerHeight) / imgHeight
      } else {
        // 按原图片的大小进行缩放
        tempWidth = imgWidth
        tempHeight = imgHeight
      }
    }
  }

  return {width: tempWidth, height: tempHeight}
}

export const imgPect = (picture_width, picture_height, default_width, default_height) => {
  const widthRatio = default_width / picture_width
  const heightRatio = default_height / picture_height
  let ratio
  widthRatio < heightRatio ? ratio = widthRatio : ratio = heightRatio
  const currentImg = {
    picture_width: parseInt(picture_width * ratio),
    picture_height: parseInt(picture_height * ratio)
  }
  return currentImg
}
