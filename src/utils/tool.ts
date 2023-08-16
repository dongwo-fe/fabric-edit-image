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
export function base64ConvertFile(urlData:string) {
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
