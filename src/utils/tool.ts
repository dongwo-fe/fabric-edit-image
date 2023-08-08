export const loadImage = (src: string) => {
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

export const loadImageList = (list: Array<string>) => {
  return Promise.all(list.map(src => loadImage(src)))
}
