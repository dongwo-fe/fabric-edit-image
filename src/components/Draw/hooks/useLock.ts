import useAttr from './useAttr';
import { useCallback, useContext } from 'react';
import { Context } from '../CanvasContext';
import { fabric } from 'fabric';

const lockAttrs = [
  'lockMovementX',
  'lockMovementY',
  'lockRotation',
  'lockScalingX',
  'lockScalingY',
];

/**
 * 检测fabric对象是否隐藏了X Y缩放
 * @param object
 */
export const isControlsInRatioVisible = (object: fabric.Object) => {
  const controls = object._controlsVisibility
  return !!(controls && !controls.mb && !controls.ml && !controls.mr && !controls.mt)
}

const useLock = () => {
  const {canvas} = useContext(Context)
  const {getActiveObject} = useAttr()

  /**
   * 锁定全部操作 或 解锁全部操作
   */
  const changeOwnLock = useCallback((isLock: boolean, object?: fabric.Object) => {
    let activeObject: null | undefined | fabric.Object = null
    if (object) {
      activeObject = object
    } else {
      activeObject = getActiveObject()
    }
    if (!activeObject) return
    activeObject.hasControls = isLock
    lockAttrs.forEach((key) => {
      (activeObject as fabric.Object)[key] = !isLock
    });
    activeObject.selectable = isLock
    canvas?.renderAll()
  }, [canvas, getActiveObject])

  /**
   * 按比例锁定 或 解锁
   */
  const changeInRatioLock = useCallback((isLock: boolean, object?: fabric.Object) => {
    let activeObject: null | undefined | fabric.Object = null
    if (object) {
      activeObject = object
    } else {
      activeObject = getActiveObject()
    }
    if (!activeObject) return
    activeObject.setControlsVisibility({
      mt: isLock, // 控制上中点的缩放控件可见性
      mb: isLock, // 控制下中点的缩放控件可见性
      ml: isLock, // 控制左中点的缩放控件可见性
      mr: isLock, // 控制右中点的缩放控件可见性
    })
    canvas?.renderAll()
  }, [canvas, getActiveObject])
  return {
    changeOwnLock,
    changeInRatioLock
  }
}

export default useLock
