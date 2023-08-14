// @ts-nocheck
import { useCallback, useContext, useEffect } from 'react';
import { Context } from '../CanvasContext';
import { fabric } from 'fabric';

const useEvents = () => {
  const {canvas, editor, workSpace, setSelectMode, setSelectIds, setSelectOneType, setIsClipImage} = useContext(Context)
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

  const onClipImage = useCallback((value) => {
    setIsClipImage(value)
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
}

export default useEvents
