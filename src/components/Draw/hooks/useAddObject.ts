// @ts-nocheck
import { useCallback, useContext } from 'react';
import { Context } from '../CanvasContext';
import { fabric } from 'fabric';
import { uuid } from '../../../utils/utils';

// 默认参数
const DefaultOptions = {
  text: {
    fill: '#000000'
  },
  image: {},
}

const useAddObject = () => {
  const {workSpace, canvas} = useContext(Context)
  /**
   * 新增图片
   * @param item
   */
  const addImage = useCallback((src, options) => {
    if (!workSpace) return
    const scale = workSpace.getScale()
    fabric.Image.fromURL(`${src}?t=${Date.now()}`, img => {
      img.set({
        ...DefaultOptions.image,
        id: uuid(),
        scaleY: scale,
        scaleX: scale,
        left: (workSpace.width - img.width * scale) / 2,
        top: (workSpace.height - img.height * scale) / 2,
        ...options
      })
      canvas?.add(img)
      canvas?.setActiveObject(img);
      canvas?.requestRenderAll();
    }, { crossOrigin: 'anonymous'})
  }, [workSpace, canvas])

  /**
   * 新增文字
   */
  const addText = useCallback((item) => {
    if (!workSpace) return
    const text = new fabric.Textbox(item.title, {
      ...DefaultOptions.text,
      fontSize: item.style.fontSize as number * 3,
      fontWeight: item.style.fontWeight as number,
      id: uuid(),
    })
    text.set({
      left: (workSpace.width - text.width) / 2,
      top: (workSpace.height - text.height) / 2,
    })
    canvas?.add(text)
    canvas?.setActiveObject(text)
    canvas?.requestRenderAll();
  }, [workSpace, canvas])
  return {
    addImage,
    addText,
  }
}
export default useAddObject
