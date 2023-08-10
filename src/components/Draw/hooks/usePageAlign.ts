import { useCallback, useContext } from 'react'
import { Context } from '../CanvasContext'
import { isUndef } from '../../../utils';

type Pos = { left?: number, top?: number }

const usePageAlign = () => {
  const {canvas, workSpace} = useContext(Context)
  const setPosition = useCallback((value: Pos, target?: any) => {
    if (!canvas) return
    let activeObject: any
    if (target) {
      activeObject = target
    } else {
      activeObject = canvas.getActiveObject()
    }
    if (!activeObject) return console.log('no allow activeObject')
    const {left, top} = value
    const pos: Pos = {}
    if (!isUndef(left)) pos.left = left
    if (!isUndef(top)) pos.top = top
    activeObject.set(pos)
    canvas.renderAll()
  }, [canvas, workSpace])
  /**
   * 左对齐
   */
  const left = () => {
    setPosition({left: 0})
  }
  /**
   * 顶对齐
   */
  const top = () => {
    setPosition({top: 0})
  }
  /**
   * 左右居中对齐
   */
  const alignCenter = () => {
    if (!canvas || !workSpace) return
    const activeObject = canvas.getActiveObject() as any
    if (!activeObject) return
    const width = workSpace?.width || 0
    setPosition({left: (width - activeObject.width * activeObject.scaleX) / 2})
  }
  /**
   * 上下居中对齐
   */
  const middleCenter = () => {
    if (!canvas || !workSpace) return
    const activeObject = canvas.getActiveObject() as any
    if (!activeObject) return
    const height = workSpace?.height || 0
    setPosition({top: (height - activeObject.height * activeObject.scaleY) / 2})
  }
  /**
   * 右对齐
   */
  const right = () => {
    if (!canvas || !workSpace) return
    const activeObject = canvas.getActiveObject() as any
    if (!activeObject) return
    const width = workSpace?.width || 0
    setPosition({left: width - activeObject.width * activeObject.scaleX})
  }
  /**
   * 底对齐
   */
  const bottom = () => {
    if (!canvas || !workSpace) return
    const activeObject = canvas.getActiveObject() as any
    if (!activeObject) return
    const height = workSpace?.height || 0
    setPosition({top: height - activeObject.height * activeObject.scaleY})
  }
  return {
    left, top, alignCenter, middleCenter, right, bottom
  }
}

export default usePageAlign
