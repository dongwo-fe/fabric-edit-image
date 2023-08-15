// @ts-nocheck
import { fabric } from 'fabric';
import { events, Types } from '../utils/events';
import { uuid } from '../utils/utils';
import { isNumber, isUndef } from '../utils';
// 竖线
const verticalImg = 'https://ossprod.jrdaimao.com/file/1691055918106919.svg'
// 圆点
const edgeImg = 'https://ossprod.jrdaimao.com/file/1691055938230666.svg'
// 旋转
const rotateImg = 'https://ossprod.jrdaimao.com/file/1691574701262500.svg'
// 横线
const horizontalImg = 'https://ossprod.jrdaimao.com/file/1691055964267980.svg'
// 复制
const copyImg = 'https://ossprod.jrdaimao.com/file/1691660518949720.svg'
// 删除
const deleteImg = 'https://ossprod.jrdaimao.com/file/1691662370382182.svg'
// 剪裁
const clipImg = 'https://ossprod.jrdaimao.com/file/1691718842537240.svg'
// bg
const topBgImg = 'https://ossprod.jrdaimao.com/file/1691978616647204.svg'
/**
 * 实际场景: 在进行某个对象缩放的时候，由于fabric.js默认精度使用的是toFixed(2)。
 * 此处为了缩放的精度更准确一些，因此将NUM_FRACTION_DIGITS默认值改为4，即toFixed(4).
 */
fabric.Object.NUM_FRACTION_DIGITS = 4;

function drawImg(
  ctx: CanvasRenderingContext2D,
  left: number,
  top: number,
  img: HTMLImageElement,
  wSize: number,
  hSize: number,
  angle: number | undefined
) {
  if (angle === undefined) return;
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(fabric.util.degreesToRadians(angle));
  ctx.drawImage(img, -wSize / 2, -hSize / 2, wSize, hSize);
  ctx.restore();
}

// 中间横杠
function intervalControl() {
  const verticalImgIcon = document.createElement('img');
  verticalImgIcon.src = verticalImg;

  const horizontalImgIcon = document.createElement('img');
  horizontalImgIcon.src = horizontalImg;

  function renderIcon(
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: any,
    fabricObject: fabric.Object
  ) {
    drawImg(ctx, left, top, verticalImgIcon, 20, 25, fabricObject.angle);
  }

  function renderIconHoz(
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: any,
    fabricObject: fabric.Object
  ) {
    drawImg(ctx, left, top, horizontalImgIcon, 25, 20, fabricObject.angle);
  }

  // 中间横杠
  fabric.Object.prototype.controls.ml = new fabric.Control({
    x: -0.5,
    y: 0,
    offsetX: -1,
    cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingXOrSkewingY,
    getActionName: fabric.controlsUtils.scaleOrSkewActionName,
    render: renderIcon,
  });

  fabric.Object.prototype.controls.mr = new fabric.Control({
    x: 0.5,
    y: 0,
    offsetX: 1,
    cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingXOrSkewingY,
    getActionName: fabric.controlsUtils.scaleOrSkewActionName,
    render: renderIcon,
  });

  fabric.Object.prototype.controls.mb = new fabric.Control({
    x: 0,
    y: 0.5,
    offsetY: 1,
    cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingYOrSkewingX,
    getActionName: fabric.controlsUtils.scaleOrSkewActionName,
    render: renderIconHoz,
  });

  fabric.Object.prototype.controls.mt = new fabric.Control({
    x: 0,
    y: -0.5,
    offsetY: -1,
    cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingYOrSkewingX,
    getActionName: fabric.controlsUtils.scaleOrSkewActionName,
    render: renderIconHoz,
  });
}

// 顶点
function peakControl() {
  const img = document.createElement('img');
  img.src = edgeImg;

  function renderIconEdge(
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: any,
    fabricObject: fabric.Object
  ) {
    drawImg(ctx, left, top, img, 25, 25, fabricObject.angle);
  }

  // 四角图标
  fabric.Object.prototype.controls.tl = new fabric.Control({
    x: -0.5,
    y: -0.5,
    cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingEqually,
    render: renderIconEdge,
  });
  fabric.Object.prototype.controls.bl = new fabric.Control({
    x: -0.5,
    y: 0.5,
    cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingEqually,
    render: renderIconEdge,
  });
  fabric.Object.prototype.controls.tr = new fabric.Control({
    x: 0.5,
    y: -0.5,
    cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingEqually,
    render: renderIconEdge,
  });
  fabric.Object.prototype.controls.br = new fabric.Control({
    x: 0.5,
    y: 0.5,
    cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingEqually,
    render: renderIconEdge,
  });
}

// 旋转
function rotationControl() {
  const img = document.createElement('img');
  img.src = rotateImg;

  function renderIconRotate(
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: any,
    fabricObject: fabric.Object
  ) {
    drawImg(ctx, left, top, img, 60, 60, fabricObject.angle);
  }

  // 旋转图标
  fabric.Object.prototype.controls.rotate = new fabric.Control({
    y: 0.5,
    cursorStyleHandler: fabric.controlsUtils.rotationStyleHandler,
    actionHandler: fabric.controlsUtils.rotationWithSnapping,
    offsetY: 25,
    actionName: 'rotate',
    cursorStyle: 'pointer',
    render: renderIconRotate,
  });

}

// 自定义操作
function initMainControl() {
  const topBgEl = document.createElement('img')
  topBgEl.src = topBgImg
  const copyImageEl = document.createElement('img')
  copyImageEl.src = copyImg
  const deleteImageEl = document.createElement('img')
  deleteImageEl.src = deleteImg
  const clipImageEl = document.createElement('img')
  clipImageEl.src = clipImg

  function cloneObject(eventData, transform) {
    const target = transform.target;
    const canvas = target.canvas;
    target.clone(function (cloned) {
      cloned.set({
        left: target.left + 20,
        top: target.top + 20,
        sourceSrc: target.sourceSrc,
        rawScaleX: target.rawScaleX,
        rawScaleY: target.rawScaleY,
        sourceImageDiffTop: target.sourceImageDiffTop,
        sourceImageDiffLeft: target.sourceImageDiffLeft
      })
      cloned.left += 20
      cloned.top += 20
      cloned.setCoords()
      canvas.add(cloned)
      canvas.setActiveObject(cloned)
      canvas.renderAll()
    });
  }

  function deleteObject(eventData, transform) {
    const target = transform.target;
    const canvas = target.canvas;
    const clipRect = canvas.getObjects().find(item => item.id === 'currentClipRect')
    if (clipRect) {
      canvas.remove(clipRect)
    }
    canvas.remove(target);
    canvas.requestRenderAll();
  }

  function clipObject(eventData, transform) {
    const image = transform.target;
    const canvas = image.canvas;
    const sourceSrc = image.sourceSrc
    const rawScaleX = image.rawScaleX || image.scaleX
    const rawScaleY = image.rawScaleY || image.scaleY
    const index = canvas.getObjects().findIndex(item => item.id === image.id);
    const sourceWidth = image.getScaledWidth()
    const sourceHeight = image.getScaledHeight()
    image.clone((o) => {
      image.set({cloneObject: o})
    })
    if (sourceSrc) {
      image.setSrc(sourceSrc, () => {
        canvas.renderAll()
      }, {crossOrigin: 'anonymous'})
      image.set({
        scaleX: rawScaleX,
        scaleY: rawScaleY,
        left: image.left - image.sourceImageDiffLeft,
        top: image.top - image.sourceImageDiffTop,
      })
    }
    image.bringToFront() // 将这个图片的层级移动到顶层
    image.setControlsVisibility({
      copy: false,
      delete: false,
      clip: false,
      rotate: false,
      topBg: false
    })
    // 存一下原图的src，因为后面裁剪后生成的图片就是base64了
    // 创建一个矩形，让他在图片的上面
    const selectionRect = new fabric.Rect({
      left: !isUndef(image.sourceImageDiffLeft) ? image.sourceImageDiffLeft + image.left : image.left,
      top: !isUndef(image.sourceImageDiffTop) ? image.sourceImageDiffTop + image.top : image.top,
      fill: "rgba(0,0,0,0.3)",
      originX: "left",
      originY: "top",
      stroke: "black",
      opacity: 1,
      width: sourceWidth,
      height: sourceHeight,
      hasRotatingPoint: false,
      transparentCorners: false,
      cornerColor: "white",
      cornerStrokeColor: "black",
      borderColor: "black",
      cornerSize: 12,
      padding: 0,
      cornerStyle: "circle",
      borderDashArray: [5, 5],
      borderScaleFactor: 1.3,
      id: 'currentClipRect',
      centeredScaling: true
    });
    image.set({
      centeredScaling: true,
      sourceSrc: image.sourceSrc || image._element.src,
      rectRawX: selectionRect.left,
      rectRawY: selectionRect.top
    })
    // 控制rect的拖动区域
    selectionRect.on('moving', (e) => {
      const rect = e.transform.target
      // 如果rect的left小于image的left
      if (rect.left < image.left) {
        rect.set({left: image.left})
      }
      // 如果rect的top小于image的top
      if (rect.top < image.top) {
        rect.set({top: image.top})
      }
      // 如果rect往右拖动超过最大值
      const imageWidth = image.getScaledWidth()
      if (rect.left > image.left + imageWidth - rect.getScaledWidth()) {
        rect.set({left: image.left + imageWidth - rect.getScaledWidth()})
      }
      // 如果rect往下拖动超过最大值
      const imageHeight = image.getScaledHeight()
      if (rect.top > image.top + imageHeight - rect.getScaledHeight()) {
        rect.set({top: image.top + imageHeight - rect.getScaledHeight()})
      }
      canvas.renderAll()
    })
    // 监听rect八个角缩放的事件
    selectionRect.on('scaling', (e) => {
      const rect = e.transform.target
      if (rect.left < image.left) {
        rect.set({left: image.left})
      }
      if (rect.top < image.top) {
        rect.set({top: image.top})
      }
      if (rect.left + rect.getScaledWidth() > image.left + image.getScaledWidth()) {
        rect.set({left: image.left + image.getScaledWidth() - rect.getScaledWidth()})
      }
      if (rect.top + rect.getScaledHeight() > image.top + image.getScaledHeight()) {
        rect.set({top: image.top + image.getScaledHeight() - rect.getScaledHeight()})
      }
      if (image.getScaledWidth() / rect.getScaledWidth() < 1) {
        rect.set({
          scaleX: image.getScaledWidth() / selectionRect.getScaledWidth() * rect.get('scaleX'),
          left: image.left,
        })
      }
      if (image.getScaledHeight() / rect.getScaledHeight() < 1) {
        rect.set({
          scaleY: image.getScaledHeight() / selectionRect.getScaledHeight() * rect.get('scaleY'),
          top: image.top
        })
      }
      canvas.renderAll()
    });
    // 控制图片的拖动区域
    image.on('moving', (e) => {
      const image = e.transform.target
      if (image.left > selectionRect.left) {
        image.set({left: selectionRect.left})
      }
      if (image.top > selectionRect.top) {
        image.set({top: selectionRect.top})
      }
      const rectWidth = selectionRect.getScaledWidth()
      if (image.left < selectionRect.left + rectWidth - image.getScaledWidth()) {
        image.set({left: selectionRect.left + rectWidth - image.getScaledWidth()})
      }
      const rectHeight = selectionRect.getScaledHeight()
      if (image.top < selectionRect.top + rectHeight - image.getScaledHeight()) {
        image.set({top: selectionRect.top + rectHeight - image.getScaledHeight()})
      }
      canvas.renderAll()
    })
    // 监听图片八个角缩放事件
    image.on('scaling', (e) => {
      const image = e.transform.target
      if (image.left > selectionRect.left) {
        image.set({left: selectionRect.left})
      }
      if (image.top > selectionRect.top) {
        image.set({top: selectionRect.top})
      }
      if (selectionRect.getScaledWidth() / image.getScaledWidth() > 1) {
        image.set({scaleX: selectionRect.getScaledWidth() * image.get('scaleX') / image.getScaledWidth()})
      }
      if (selectionRect.getScaledHeight() / image.getScaledHeight() > 1) {
        image.set({scaleY: selectionRect.getScaledHeight() * image.get('scaleY') / image.getScaledHeight()})
      }
      canvas.renderAll()
    });
    // 矩形不要操作按钮，将它们隐藏
    selectionRect.setControlsVisibility({
      copy: false,
      delete: false,
      clip: false,
      rotate: false,
      topBg: false
    })
    canvas.add(selectionRect);
    canvas.setActiveObject(selectionRect)
    canvas.renderAll();
    // 告诉HeaderControl我要开始裁剪了
    events.emit(Types.CLIP_IMAGE, {
      visible: true, // 展示裁剪确定、取消按钮
      rawIndex: index, // 裁剪之前的层级index
      clipImageId: image.id, // 正在被裁剪的图片的id
    })
  }

  fabric.Object.prototype.controls.topBg = new fabric.Control({
    y: -0.5,
    cursorStyleHandler: fabric.controlsUtils.rotationStyleHandler,
    mouseUpHandler: () => {
    },
    offsetY: -25,
    cursorStyle: 'pointer',
    render: (ctx, left, top, styleOverride, fabricObject) => {
      drawImg(ctx, left, top, topBgEl, 136, 68, fabricObject.angle);
    },
  });
  // 复制
  fabric.Object.prototype.controls.copy = new fabric.Control({
    y: -0.5,
    cursorStyleHandler: fabric.controlsUtils.rotationStyleHandler,
    mouseUpHandler: cloneObject,
    offsetY: -25,
    offsetX: -30,
    cursorStyle: 'pointer',
    render: (ctx, left, top, styleOverride, fabricObject) => {
      drawImg(ctx, left, top, copyImageEl, 30, 30, fabricObject.angle);
    },
  });
  // 删除
  fabric.Object.prototype.controls.delete = new fabric.Control({
    y: -0.5,
    cursorStyleHandler: fabric.controlsUtils.rotationStyleHandler,
    mouseUpHandler: deleteObject,
    offsetY: -25,
    offsetX: 30,
    cursorStyle: 'pointer',
    render: (ctx, left, top, styleOverride, fabricObject) => {
      drawImg(ctx, left, top, deleteImageEl, 30, 30, fabricObject.angle);
    },
  });
  // 剪裁
  fabric.Object.prototype.controls.clip = new fabric.Control({
    y: -0.5,
    cursorStyleHandler: fabric.controlsUtils.rotationStyleHandler,
    mouseUpHandler: clipObject,
    offsetY: -25,
    offsetX: 0,
    cursorStyle: 'pointer',
    render: (ctx, left, top, styleOverride, fabricObject) => {
      drawImg(ctx, left, top, clipImageEl, 30, 30, fabricObject.angle);
    },
  });
}

function initControls(canvas: fabric.Canvas) {
  // 顶点图标
  peakControl();
  // 中间横杠图标
  intervalControl();
  // 旋转图标
  rotationControl();
  // 初始化自定义操作
  initMainControl();

  // 选中样式
  fabric.Object.prototype.set({
    transparentCorners: false,
    borderColor: '#51B9F9',
    cornerColor: '#FFF',
    borderScaleFactor: 2.5,
    cornerStyle: 'circle',
    cornerStrokeColor: '#0E98FC',
    borderOpacityWhenMoving: 1,
  });
  // textbox保持一致
  // fabric.Textbox.prototype.controls = fabric.Object.prototype.controls;
}

export default initControls;
