/**
 * 预加载图片单张
 * @param src
 */
export const loadImage = (src: string) => {
  if(!src) return Promise.resolve()
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
