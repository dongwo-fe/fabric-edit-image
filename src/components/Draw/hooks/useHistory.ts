import useHistoryTravel from '../../../hooks/useHistoryTravel';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { Context } from '../CanvasContext';

const useHistory = () => {
  const {canvas, workSpace, editor, clipImageId, isClipImage} = useContext(Context)
  const {value, setValue, go, reset, backLength, forwardLength} = useHistoryTravel<any>(undefined, 50)
  const historyFlagRef = useRef(false)


  useEffect(() => {
    canvas?.on({
      'object:added': save,
      'object:modified': save,
      'object:removed': save
    })
    return () => {
      canvas?.off({
        'object:added': save,
        'object:modified': save,
        'object:removed': save
      })
    }
  }, [canvas, editor, setValue, isClipImage, clipImageId])
  useEffect(() => {
    if (!workSpace || !editor) return
    reset(editor.getJson());
  }, [editor, workSpace])
  useEffect(() => {
    if (!canvas) return
    if (!historyFlagRef.current) return
    canvas?.clear();
    canvas?.loadFromJSON(value, () => {
      historyFlagRef.current = false
      canvas.renderAll();
    });
  }, [value, canvas])
  /**
   * 每次操作保存历史记录
   * @param event
   */
  const save = useCallback((event: any) => {
    // 过滤选择元素事件
    const isSelect = event.action === undefined && event.e;
    if (isSelect || !canvas) return
    if (historyFlagRef.current) return
    if (event.target && event.target.id === "currentClipRect") {
      // 裁剪图片新增的rect不需要记录
      return
    }
    if (isClipImage && event.target.id === clipImageId || event.target.id === 'clipRawImage'){
      return
    }
    setValue(editor?.getJson())
  }, [canvas, editor, setValue, isClipImage, clipImageId])
  /**
   * 后退
   */
  const undo = useCallback(() => {
    historyFlagRef.current = true
    go(-1);
  }, [go])
  /**
   * 重做
   */
  const redo = useCallback(() => {
    historyFlagRef.current = true
    go(1);
  }, [go]);
  return {
    undo,
    redo,
    backLength,
    forwardLength,
  }
}

export default useHistory
