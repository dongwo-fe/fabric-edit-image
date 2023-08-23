// @ts-nocheck
import { fabric } from 'fabric';
import { useCallback, useContext } from 'react';
import { Context } from '../CanvasContext';
import { Context as EditorContext } from '../../Editor/Context';
import { base64ConvertFile } from '../../../utils/tool'
import { postUploadImage } from '../../../api/image';
import useToast from './useToast';
import { uuid } from '../../../utils/utils';

const useClipImage = () => {
  const {workSpace, canvas, clipImageId, clipRawIndex, setIsClipImage} = useContext(Context)
  const {setLoading} = useContext(EditorContext)
  const toast = useToast()
  /**
   * 保存裁剪
   */
  const saveClipImage = useCallback(async () => {
    if (!canvas || !workSpace) return
    const scale = canvas.getZoom()
    try {
      let image = null // 被裁剪的图片
      let rect = null // 裁剪rect
      let currentClipImageIndex = null // 当前下标
      canvas.getObjects().forEach((item, index) => {
        // 获取到裁剪rect
        if (item.id === 'currentClipRect') {
          rect = item
        }
        // 获取到被裁剪的图片和被裁剪的图片的index
        if (item.id === clipImageId) {
          image = item
          currentClipImageIndex = index
        }
      })
      if (!image || !rect) return
      setLoading(true)
      // 创建一个新的rect并保持和裁剪rect位置一致
      const newRect = new fabric.Rect({
        left: rect.left,
        top: rect.top,
        width: rect.getScaledWidth(),
        height: rect.getScaledHeight(),
        absolutePositioned: true,
      });
      // 设置图片clipPath（裁剪功能）
      image.clipPath = newRect;

      // 生成一个image
      const cropped = new Image();
      cropped.crossOrigin = 'anonymous'
      // 把旧的rect删除
      canvas.remove(rect);
      // 恢复画布缩放比例
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      // 裁剪图片，位置是newRect的位置
      const base64 = canvas.toDataURL({
        left: newRect.left,
        top: newRect.top,
        width: newRect.width,
        height: newRect.height,
      });
      const file = base64ConvertFile(base64)
      const res = await postUploadImage(file)
      cropped.src = res.url
      // cropped.src = base64
      // 裁剪完成收回复画布缩放比例
      workSpace?.setZoomAuto(scale)
      // 等待裁剪的图片加载完成
      cropped.onload = function () {
        // 将原图片删除
        canvas.remove(image)
        // 创建新的图片
        const newImage = new fabric.Image(cropped, {crossOrigin: 'anonymous'});
        // 这个原图的src很重要，重新编辑的时候会用到
        // 设置新图片的位置和newRect位置保持一致
        newImage.set({
          id: image.id,
          left: newRect.left,
          top: newRect.top,
          rawScaleX: image.scaleX,
          rawScaleY: image.scaleY,
          sourceSrc: image.sourceSrc,
          rectDiffLeft: newRect.left - image.left,
          rectDiffTop: newRect.top - image.top,
          prevWidth: newRect.getScaledWidth(),
          prevHeight: newRect.getScaledHeight()
        })
        canvas.add(newImage);
        if (currentClipImageIndex !== clipRawIndex) {
          // 如果被裁剪的图片层级发生了变化那么需要恢复image之前的层级
          while (currentClipImageIndex !== clipRawIndex) {
            newImage.sendBackwards()
            currentClipImageIndex--
          }
        }
        canvas.renderAll();
        // 完成裁剪
        setIsClipImage(false)
        setLoading(false)
      };
    } catch (err) {
      setLoading(false)
      workSpace?.setZoomAuto(scale)
      cancelClipImage()
      toast.error('裁剪失败，请稍后重试~')
      console.log(err)
    }
  }, [canvas, workSpace, clipImageId, clipRawIndex])
  /**
   * 取消裁剪
   */
  const cancelClipImage = useCallback(() => {
    if (!canvas) return
    let rect = null // 裁剪rect
    let clipImage = null // 被裁剪的图片
    let currentClipImageIndex = null // 被裁剪的图片的index
    canvas.getObjects().forEach((item, index) => {
      // 获取到裁剪rect
      if (item.id === 'currentClipRect') {
        rect = item
      }
      // 获取到被裁剪的图片和被裁剪的图片的index
      if (item.id === clipImageId) {
        clipImage = item
        currentClipImageIndex = index
      }
    })
    if (!clipImage) return
    // 如果点击取消，那么判断有rect就把rect删除
    if (rect) canvas.remove(rect)
    canvas.remove(clipImage)
    const cloneObject = clipImage.get('cloneObject')
    if (!clipImage) return
    cloneObject.set({
      id: uuid(),
      sourceSrc: clipImage.sourceSrc,
      rawScaleX: clipImage.scaleX,
      rawScaleY: clipImage.scaleY,
      rectDiffLeft: clipImage.rectDiffLeft,
      rectDiffTop: clipImage.rectDiffTop,
    })
    canvas.add(cloneObject)
    if (cloneObject && currentClipImageIndex !== clipRawIndex) {
      // 如果被裁剪的图片层级发生了变化那么需要恢复image之前的层级
      while (currentClipImageIndex !== clipRawIndex) {
        cloneObject.sendBackwards()
        currentClipImageIndex--
      }
    }
    // 完成裁剪，恢复状态
    setIsClipImage(false)
    canvas.renderAll()
  }, [canvas, workSpace, clipImageId, clipRawIndex])

  return {
    saveClipImage,
    cancelClipImage
  }
}

export default useClipImage
