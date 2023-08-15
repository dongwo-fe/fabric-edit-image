// @ts-nocheck
import { fabric } from 'fabric';
import { useCallback, useContext, useRef } from 'react';
import { Context } from '../CanvasContext';

const useClipImage = () => {
  const {workSpace, canvas, clipImageId, clipRawIndex, setIsClipImage} = useContext(Context)
  /**
   * 保存裁剪
   */
  const saveClipImage = useCallback(() => {
    if (!canvas || !workSpace) return
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

    // 把旧的rect删除
    canvas.remove(rect);

    // 生成一个image
    const cropped = new Image();
    cropped.crossOrigin = 'anonymous'
    // 恢复画布缩放比例
    const scale = canvas.getZoom()
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    // 裁剪图片，位置是newRect的位置
    cropped.src = canvas.toDataURL({
      left: newRect.left,
      top: newRect.top,
      width: newRect.width,
      height: newRect.height,
    });
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
        left: newRect.left,
        top: newRect.top,
        sourceImageDiffTop: newRect.top - image.top,
        sourceImageDiffLeft: newRect.left - image.left,
        rawScaleX: image.scaleX,
        rawScaleY: image.scaleY,
        sourceSrc: image.sourceSrc
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
    };
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
    clipImage.setControlsVisibility({
      copy: true,
      delete: true,
      clip: true,
      rotate: true,
      topBg: true
    })
    if (rect) {
      // 如果点击取消，那么判断有rect就把rect删除
      canvas.remove(rect)
      canvas.renderAll()
    }
    canvas.remove(clipImage)
    const cloneObject = clipImage.get('cloneObject')
    cloneObject.set({
      centeredScaling: false,
      sourceSrc: clipImage.sourceSrc,
      sourceImageDiffTop: clipImage.rectRawY - clipImage.top,
      sourceImageDiffLeft: clipImage.rectRawX - clipImage.left,
      rawScaleX: clipImage.scaleX,
      rawScaleY: clipImage.scaleY,
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
  }, [canvas, clipImageId, clipRawIndex])

  return {
    saveClipImage,
    cancelClipImage
  }
}

export default useClipImage
