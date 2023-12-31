// @ts-nocheck
import { useCallback, useContext, useEffect } from 'react';
import { Context } from '../CanvasContext';
import { Context as EditorContext } from '../../Editor/Context'
import { fabric } from 'fabric';
import { KeyNames } from '../../../utils/hotEventKeys';
import { hotkeys } from '../../../core/initHotKeys'
import useClipImage from './useClipImage';
import { isUndef } from '../../../utils';
import { events, Types } from '../../../utils/events';

const useEvents = () => {
  const {
    canvas, editor, workSpace, setSelectMode, setSelectIds, setSelectOneType,
    clipImageId, setIsClipImage, clipRawIndex,
    isClipImage
  } = useContext(Context)
  const {setLoading} = useContext(EditorContext)
  const {cancelClipImage} = useClipImage()
  useEffect(() => {
    events.on(Types.SHOW_LOADING, setLoading)
    return () => {
      events.off(Types.SHOW_LOADING, setLoading)
    }
  }, [])
  useEffect(() => {
    if (!canvas) return
    canvas.on({
      'selection:created': selected,
      'selection:updated': selected,
      'selection:cleared': selected,
      'mouse:wheel': onWheel
    })
    return () => {
      canvas.off({
        'selection:created': selected,
        'selection:updated': selected,
        'selection:cleared': selected,
        'mouse:wheel': onWheel
      })
    }
  }, [canvas, editor])
  useEffect(() => {
    hotkeys(KeyNames.delete, deleteObjects);
    return () => {
      hotkeys.unbind(KeyNames.delete, deleteObjects);
    }
  }, [canvas, isClipImage, clipImageId])
  useEffect(() => {
    hotkeys(KeyNames.zoom, onZoom)
    return () => {
      hotkeys.unbind(KeyNames.zoom, onZoom)
    }
  }, [canvas, workSpace])
  // useEffect(() => {
  //   if (!canvas) return
  //   canvas.on('selection:updated', selectionUpdated)
  //   return () => {
  //     canvas.off('selection:updated', selectionUpdated)
  //   }
  // }, [canvas, isClipImage, clipImageId, clipRawIndex])
  //
  // const selectionUpdated = useCallback(() => {
  //   const objects = canvas?.getActiveObjects()
  //   if (isClipImage) {
  //     cancelClipImage()
  //   }
  // }, [canvas, isClipImage, clipImageId, clipRawIndex])
  /**
   * 单选多选事件
   */
  const selected = useCallback(() => {
    if (!canvas) return
    const actives = canvas
      .getActiveObjects()
      .filter((item) => !(item instanceof fabric.GuideLine)); // 过滤掉辅助线
    if (actives && actives.length === 1) {
      const activeObject = actives[0]
      if (activeObject && activeObject.type === 'image') {
        activeObject.set({
          prevWidth: activeObject.getScaledWidth(),
          prevHeight: activeObject.getScaledHeight()
        })
        canvas.renderAll()
      }
      if (activeObject.type === 'i-text') {
        activeObject.setControlsVisibility({
          mt: false,
          ml: false,
          mb: false,
          mr: false,
        })
        canvas.renderAll()
      }
      setSelectMode('one')
      setSelectIds([activeObject.id])
      setSelectOneType(activeObject.type)
    } else if (actives && actives.length > 1) {
      setSelectMode('multiple')
      setSelectIds(actives.map(item => item.id as string))
    } else {
      setSelectMode('')
      setSelectIds([])
      setSelectOneType('')
    }
  }, [canvas, editor])
  /**
   * 放大缩小
   */
  const onZoom = useCallback((e) => {
    if (e.code === 'Minus') {
      workSpace?.small(0.05)
      e.preventDefault();
      e.stopPropagation();
    }
    if (e.code === 'Equal') {
      workSpace?.big(0.05)
      e.preventDefault();
      e.stopPropagation();
    }
  }, [canvas, workSpace])
  useEffect(() => {
    if (!canvas) return
    canvas.on('object:modified', (e) => {
      const target = e.transform?.target
      if (!target) return
      if (target.type !== 'image') return
      if (isUndef(target.rawScaleX) || isUndef(target.rawScaleY)) return
      const prevWidth = target.prevWidth
      const prevHeight = target.prevHeight
      target.set({
        rawScaleX: target.getScaledWidth() / prevWidth * target.rawScaleX,
        rawScaleY: target.getScaledHeight() / prevHeight * target.rawScaleY,
        prevWidth: target.getScaledWidth(),
        prevHeight: target.getScaledHeight()
      })
      canvas.renderAll()

    })
  }, [canvas])
  /**
   * 鼠标缩放事件
   */
  const onWheel = useCallback(({e}) => {
    const delta = e.deltaY;
    // 根据滚轮方向调整缩放级别
    if (delta > 0) {
      workSpace?.small(0.01)
    } else {
      workSpace?.big(0.01)
    }
    // 阻止默认滚轮事件
    e.preventDefault();
    e.stopPropagation();
  }, [canvas, workSpace])

  const deleteClipImageAndRect = useCallback(() => {
    if (!canvas) return
    let rect = null // 裁剪rect
    let clipImage = null // 被裁剪的图片
    canvas.getObjects().forEach((item) => {
      if (item.id === 'currentClipRect') {
        rect = item
      }
      if (item.id === clipImageId) {
        clipImage = item
      }
    })
    if (!rect || !clipImage) return
    canvas.remove(rect)
    canvas.remove(clipImage)
    canvas.discardActiveObject()
    canvas.renderAll()
    setIsClipImage(false)
  }, [canvas, clipImageId])
  /**
   * 删除
   */
  const deleteObjects = useCallback(() => {
    // 如果正在剪裁图片
    if (isClipImage) {
      return
      // deleteClipImageAndRect()
    }
    const activeObject = canvas.getActiveObjects()
    if (activeObject) {
      activeObject.map((item) => canvas.remove(item))
      canvas.discardActiveObject()
      canvas.renderAll()
    }
  }, [canvas, isClipImage, clipImageId])
}

export default useEvents
