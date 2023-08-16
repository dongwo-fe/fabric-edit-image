// @ts-nocheck
import { useCallback, useContext } from 'react';
import { Context } from '../CanvasContext';
import { Context as EditorContext } from '../../Editor/Context'
import { fabric } from 'fabric';
import { uuid } from '../../../utils/utils';
import useClipImage from './useClipImage';

// 默认参数
const DefaultOptions = {
  text: {
    fill: '#000000'
  },
  image: {},
}

const useAddObject = () => {
  const {workSpace, canvas, isClipImage, clipImageId, clipRawIndex} = useContext(Context)
  const {cancelClipImage} = useClipImage()
  const {setLoading} = useContext(EditorContext)
  /**
   * 新增图片
   * @param item
   */
  const addImage = useCallback((src, options,callback) => {
    if (!workSpace) return
    setLoading(true)
    if (isClipImage) cancelClipImage()
    const scale = workSpace.getScale()
    fabric.Image.fromURL(`${src}?t=${Date.now()}`, img => {
      if (!img.width || !img.height) {
        setLoading(false)
        return
      }
      img.set({
        ...DefaultOptions.image,
        id: uuid(),
        scaleY: scale,
        scaleX: scale,
        left: (workSpace.width - img.width * scale) / 2,
        top: (workSpace.height - img.height * scale) / 2,
        ...options,
      })
      canvas?.add(img)
      canvas?.setActiveObject(img);
      callback?.(img)
      canvas?.renderAll();
      setLoading(false)
    }, {crossOrigin: 'anonymous'})
  }, [workSpace, canvas, clipImageId, clipRawIndex])

  /**
   * 新增文字
   */
  const addText = useCallback((item) => {
    if (!workSpace) return
    if (isClipImage) cancelClipImage()
    const text = new fabric.IText(item.title, {
      ...DefaultOptions.text,
      fontFamily: 'serif',
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
    canvas?.renderAll();
  }, [workSpace, canvas, clipImageId, clipRawIndex])
  return {
    addImage,
    addText,
  }
}
export default useAddObject
