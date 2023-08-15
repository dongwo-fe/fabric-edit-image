import { useCallback, useContext, useRef, useState } from 'react';
import { Context } from '../CanvasContext';
import { saveAs } from 'file-saver';
import { uuid } from '../../../utils/utils';
import { saveHistory as saveHistoryApi } from '../../../api/image';
import useClipImage from './useClipImage';

const useSave = () => {
  const userInfo = localStorage.getItem('userInfo')
  const phone = userInfo ? JSON.parse(userInfo).phone : '15612868761'
  const {editor, canvas, workSpace, mainUrl, isClipImage} = useContext(Context)
  const {cancelClipImage} = useClipImage()
  const [saveToImageLoading, setSaveToImageLoading] = useState(false)
  const useLast = useRef<any>({})
  useLast.current = {
    editor,
    mainUrl,
    phone
  }
  /**
   * send beacon
   */
  const unloadSendBeacon = useCallback(() => {
    const {editor, mainUrl, phone} = useLast.current
    if (!editor || !mainUrl || !phone) return
    const dataJson = editor.getJson()
    const data = JSON.stringify({
      phone,
      data: dataJson ? JSON.stringify(dataJson) : '',
      imgSrc: mainUrl
    })
    const blob = new Blob([data], {type: 'application/json'})
    const isPush = navigator.sendBeacon('/api_editimg/save', blob)
    console.log('navigator.sendBeacon event', isPush)
  }, [editor, mainUrl, phone])
  /**
   * 保存历史修改记录
   */
  const saveHistory = useCallback(() => {
    if (!editor || !mainUrl || !phone) return
    const dataJson = editor.getJson()
    return saveHistoryApi({
      phone,
      data: dataJson ? JSON.stringify(dataJson) : '',
      imgSrc: mainUrl
    })
  }, [editor, mainUrl, phone])
  /**
   * 保存为json
   */
  const saveToJson = useCallback(() => {
    if (!editor) return
    saveHistory()
    const dataUrl = editor.getJson();
    const fileStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataUrl, null, '\t')
    )}`;
    saveAs(fileStr, `${uuid()}.json`)
  }, [editor])

  /**
   * 保存为图片
   */
  const saveToImage = useCallback(async () => {
    if (saveToImageLoading) return
    if (!canvas || !editor) return;
    // 如果正在编辑图片
    if (isClipImage) {
      cancelClipImage()
    }
    try {
      setSaveToImageLoading(true)
      await saveHistory()
      const workspace = canvas?.getObjects().find((item) => item.id === 'workspace');
      editor.ruler.hideGuideline();
      if (!workspace) return;
      const {left, top, width, height} = workspace;
      const option = {
        format: 'png',
        quality: 1,
        left,
        top,
        width,
        height,
      };
      const scale = canvas.getZoom()
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      const dataUrl = canvas.toDataURL(option);
      saveAs(dataUrl, `${uuid()}.png`);
      workSpace?.setZoomAuto(scale)
      // 恢复之前的缩放比例
      editor.ruler.showGuideline();
      setSaveToImageLoading(false)
    } catch (err) {
      console.log('onSaveToImage err', err)
      workSpace?.auto()
      setSaveToImageLoading(false)
    }
  }, [canvas, editor, workSpace, isClipImage])

  return {
    saveToJson,
    saveHistory,
    unloadSendBeacon,
    saveToImage
  }
}

export default useSave
