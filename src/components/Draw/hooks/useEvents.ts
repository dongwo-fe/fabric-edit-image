import { useCallback, useContext, useEffect } from 'react';
import { Context } from '../CanvasContext';
import { fabric } from 'fabric';

const useEvents = () => {
  const {canvas, setSelectMode, setSelectIds, setSelectOneType} = useContext(Context)
  /**
   * 暴露单选多选事件
   * @private
   */
  const selected = useCallback(() => {
    if (!canvas) return
    const actives = canvas
      .getActiveObjects()
      .filter((item) => !(item instanceof fabric.GuideLine)); // 过滤掉辅助线
    if (actives && actives.length === 1) {
      setSelectMode('one')
      setSelectIds([actives[0].id as string])
      setSelectOneType(actives[0].type as string)
    } else if (actives && actives.length > 1) {
      setSelectMode('multiple')
      setSelectIds(actives.map(item => item.id as string))
    } else {
      setSelectMode('')
      setSelectIds([])
      setSelectOneType('')
    }
  }, [canvas])

  useEffect(() => {
    if (!canvas) return
    canvas.on('selection:created', () => selected());
    canvas.on('selection:updated', () => selected());
    canvas.on('selection:cleared', () => selected());
  }, [canvas])
}

export default useEvents
