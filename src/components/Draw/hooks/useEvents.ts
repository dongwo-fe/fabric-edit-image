// @ts-nocheck
import { useCallback, useContext, useEffect, useRef } from 'react';
import { Context } from '../CanvasContext';
import { fabric } from 'fabric';
// import { events, Types } from '../../../utils/events';
import { setLocal } from '../../../utils/local';
import { LocalKeys } from '../../../utils/local/keys';

const useEvents = () => {
  const {canvas, editor, workSpace, setSelectMode, setSelectIds, setSelectOneType} = useContext(Context)
  /**
   * 暴露单选多选事件
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
   * 将数据存在浏览器中，记录用户操作
   */
  const saveJsonToLocal = useCallback(() => {
    console.log('saveJsonToLocal')
    if (!canvas) return
    const json = editor?.getJson()
    if (!json) return
    // 将数据存储在localStorage中
    setLocal(LocalKeys.CANVAS_DATA, JSON.stringify(json))
  }, [canvas, editor])

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

  useEffect(() => {
    if (!canvas) return
    canvas.on({
      'selection:created': selected,
      'selection:updated': selected,
      'selection:cleared': selected,
      'object:modified': saveJsonToLocal,
    })
    // events.on(Types.CANVAS_CHANGE, saveJsonToLocal)
    return () => {
      canvas.off({
        'selection:created': selected,
        'selection:updated': selected,
        'selection:cleared': selected,
        'canvas:modified': saveJsonToLocal,
      })
      // events.off(Types.CANVAS_CHANGE, saveJsonToLocal)
    }
  }, [canvas, editor])
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
  }, [canvas])
}

export default useEvents
