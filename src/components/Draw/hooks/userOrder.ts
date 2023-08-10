import { useCallback, useContext } from 'react'
import { Context } from '../CanvasContext'
import { fabric } from 'fabric';

/**
 * 修改层级顺序
 */
const userOrder = () => {
  const {canvas, editor} = useContext(Context)

  const changeOrder = useCallback((funcKey: string, object: fabric.Object) => {
    if (!canvas) return
    let activeObject: any
    if (object) {
      activeObject = object
    } else {
      const actives = canvas.getActiveObjects();
      if (actives && actives.length === 1) {
        activeObject = canvas.getActiveObjects()[0];
      }
    }
    if (!activeObject) return
    activeObject && activeObject[funcKey]?.();
    canvas.renderAll();
    editor?.workspaceSendToBack()
  }, [canvas, editor])
  // 上
  const up = useCallback((object: fabric.Object) => {
    changeOrder('bringForward', object)
  }, [canvas, editor])

  // 上到顶
  const upTop = useCallback((object: fabric.Object) => {
    changeOrder('bringToFront', object)
  }, [canvas, editor])

  // 下
  const down = useCallback((object: fabric.Object) => {
    changeOrder('sendBackwards', object)
  }, [canvas, editor])

  // 下到底
  const downTop = useCallback((object: fabric.Object) => {
    changeOrder('sendToBack', object)
  }, [canvas, editor])
  return {
    up, upTop, down, downTop
  }
}

export default userOrder
