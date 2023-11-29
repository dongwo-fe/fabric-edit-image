import React, { createContext, useState, useContext, useCallback, useEffect, useRef, useMemo } from 'react';
import { fabric } from 'fabric';
import EventEmitter from 'events';
import hotkeys from 'hotkeys-js';
import Select from 'react-select';
import { SketchPicker } from 'react-color';
import FontFaceObserver from 'fontfaceobserver';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { saveAs } from 'file-saver';
import { sortableElement, sortableContainer, arrayMove } from 'react-sortable-hoc';
import LoadingOverlay from 'react-loading-overlay';

var styles = {"workContent":"_styles-module__workContent__2NudB"};

const throttle = (fn, timer) => {
  let time = null;
  return (...args) => {
    if (time) clearTimeout(time);
    time = setTimeout(() => {
      fn.apply(undefined, args);
    }, timer);
  };
};
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}
function retainNumber(value) {
  if (!value) return '0';
  const result = ('' + value).replace(/[^0-9]/g, '');
  return Number(result) + '';
}

function initAligningGuidelines(canvas) {
  let disabled = false;
  const ctx = canvas.getSelectionContext();
  const aligningLineOffset = 5;
  const aligningLineMargin = 4;
  const aligningLineWidth = 1;
  const aligningLineColor = 'rgb(0,255,0)';
  let viewportTransform;
  let zoom = 1;
  function drawVerticalLine(coords) {
    drawLine(coords.x + 0.5, coords.y1 > coords.y2 ? coords.y2 : coords.y1, coords.x + 0.5, coords.y2 > coords.y1 ? coords.y2 : coords.y1);
  }
  function drawHorizontalLine(coords) {
    drawLine(coords.x1 > coords.x2 ? coords.x2 : coords.x1, coords.y + 0.5, coords.x2 > coords.x1 ? coords.x2 : coords.x1, coords.y + 0.5);
  }
  function drawLine(x1, y1, x2, y2) {
    if (viewportTransform == null || disabled) return;
    ctx.save();
    ctx.lineWidth = aligningLineWidth;
    ctx.strokeStyle = aligningLineColor;
    ctx.beginPath();
    ctx.moveTo(x1 * zoom + viewportTransform[4], y1 * zoom + viewportTransform[5]);
    ctx.lineTo(x2 * zoom + viewportTransform[4], y2 * zoom + viewportTransform[5]);
    ctx.stroke();
    ctx.restore();
  }
  function isInRange(value1, value2) {
    value1 = Math.round(value1);
    value2 = Math.round(value2);
    for (let i = value1 - aligningLineMargin, len = value1 + aligningLineMargin; i <= len; i++) {
      if (i === value2) {
        return true;
      }
    }
    return false;
  }
  const verticalLines = [];
  const horizontalLines = [];
  canvas.on('mouse:down', () => {
    viewportTransform = canvas.viewportTransform;
    zoom = canvas.getZoom();
  });
  canvas.on('object:moving', e => {
    if (viewportTransform === undefined || e.target === undefined) return;
    const activeObject = e.target;
    const canvasObjects = canvas.getObjects();
    const activeObjectCenter = activeObject.getCenterPoint();
    const activeObjectLeft = activeObjectCenter.x;
    const activeObjectTop = activeObjectCenter.y;
    const activeObjectBoundingRect = activeObject.getBoundingRect();
    const activeObjectHeight = activeObjectBoundingRect.height / viewportTransform[3];
    const activeObjectWidth = activeObjectBoundingRect.width / viewportTransform[0];
    let horizontalInTheRange = false;
    let verticalInTheRange = false;
    const transform = canvas._currentTransform;
    if (!transform) return;
    for (let i = canvasObjects.length; i--;) {
      if (canvasObjects[i] === activeObject) continue;
      if (activeObject instanceof fabric.GuideLine && canvasObjects[i] instanceof fabric.GuideLine) {
        continue;
      }
      const objectCenter = canvasObjects[i].getCenterPoint();
      const objectLeft = objectCenter.x;
      const objectTop = objectCenter.y;
      const objectBoundingRect = canvasObjects[i].getBoundingRect();
      const objectHeight = objectBoundingRect.height / viewportTransform[3];
      const objectWidth = objectBoundingRect.width / viewportTransform[0];
      if (isInRange(objectLeft, activeObjectLeft)) {
        verticalInTheRange = true;
        verticalLines.push({
          x: objectLeft,
          y1: objectTop < activeObjectTop ? objectTop - objectHeight / 2 - aligningLineOffset : objectTop + objectHeight / 2 + aligningLineOffset,
          y2: activeObjectTop > objectTop ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset
        });
        activeObject.setPositionByOrigin(new fabric.Point(objectLeft, activeObjectTop), 'center', 'center');
      }
      if (isInRange(objectLeft - objectWidth / 2, activeObjectLeft - activeObjectWidth / 2)) {
        verticalInTheRange = true;
        verticalLines.push({
          x: objectLeft - objectWidth / 2,
          y1: objectTop < activeObjectTop ? objectTop - objectHeight / 2 - aligningLineOffset : objectTop + objectHeight / 2 + aligningLineOffset,
          y2: activeObjectTop > objectTop ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset
        });
        activeObject.setPositionByOrigin(new fabric.Point(objectLeft - objectWidth / 2 + activeObjectWidth / 2, activeObjectTop), 'center', 'center');
      }
      if (isInRange(objectLeft + objectWidth / 2, activeObjectLeft + activeObjectWidth / 2)) {
        verticalInTheRange = true;
        verticalLines.push({
          x: objectLeft + objectWidth / 2,
          y1: objectTop < activeObjectTop ? objectTop - objectHeight / 2 - aligningLineOffset : objectTop + objectHeight / 2 + aligningLineOffset,
          y2: activeObjectTop > objectTop ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset
        });
        activeObject.setPositionByOrigin(new fabric.Point(objectLeft + objectWidth / 2 - activeObjectWidth / 2, activeObjectTop), 'center', 'center');
      }
      if (isInRange(objectTop, activeObjectTop)) {
        horizontalInTheRange = true;
        horizontalLines.push({
          y: objectTop,
          x1: objectLeft < activeObjectLeft ? objectLeft - objectWidth / 2 - aligningLineOffset : objectLeft + objectWidth / 2 + aligningLineOffset,
          x2: activeObjectLeft > objectLeft ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset
        });
        activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop), 'center', 'center');
      }
      if (isInRange(objectTop - objectHeight / 2, activeObjectTop - activeObjectHeight / 2)) {
        horizontalInTheRange = true;
        horizontalLines.push({
          y: objectTop - objectHeight / 2,
          x1: objectLeft < activeObjectLeft ? objectLeft - objectWidth / 2 - aligningLineOffset : objectLeft + objectWidth / 2 + aligningLineOffset,
          x2: activeObjectLeft > objectLeft ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset
        });
        activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop - objectHeight / 2 + activeObjectHeight / 2), 'center', 'center');
      }
      if (isInRange(objectTop + objectHeight / 2, activeObjectTop + activeObjectHeight / 2)) {
        horizontalInTheRange = true;
        horizontalLines.push({
          y: objectTop + objectHeight / 2,
          x1: objectLeft < activeObjectLeft ? objectLeft - objectWidth / 2 - aligningLineOffset : objectLeft + objectWidth / 2 + aligningLineOffset,
          x2: activeObjectLeft > objectLeft ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset
        });
        activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop + objectHeight / 2 - activeObjectHeight / 2), 'center', 'center');
      }
    }
    if (!horizontalInTheRange) {
      horizontalLines.length = 0;
    }
    if (!verticalInTheRange) {
      verticalLines.length = 0;
    }
  });
  canvas.on('before:render', () => {
    try {
      canvas.clearContext(canvas.contextTop);
    } catch (error) {
      console.log(error);
    }
  });
  canvas.on('after:render', () => {
    for (let i = verticalLines.length; i--;) {
      drawVerticalLine(verticalLines[i]);
    }
    for (let j = horizontalLines.length; j--;) {
      drawHorizontalLine(horizontalLines[j]);
    }
    verticalLines.length = 0;
    horizontalLines.length = 0;
  });
  canvas.on('mouse:up', () => {
    verticalLines.length = 0;
    horizontalLines.length = 0;
    canvas.renderAll();
  });
  return {
    disable: () => disabled = true,
    enable: () => disabled = false
  };
}

function rotateIcon(angle) {
  return `url("data:image/svg+xml,%3Csvg height='18' width='18' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg' style='color: black;'%3E%3Cg fill='none' transform='rotate(${angle} 16 16)'%3E%3Cpath d='M22.4484 0L32 9.57891L22.4484 19.1478V13.1032C17.6121 13.8563 13.7935 17.6618 13.0479 22.4914H19.2141L9.60201 32.01L0 22.4813H6.54912C7.36524 14.1073 14.0453 7.44023 22.4484 6.61688V0Z' fill='white'/%3E%3Cpath d='M24.0605 3.89587L29.7229 9.57896L24.0605 15.252V11.3562C17.0479 11.4365 11.3753 17.0895 11.3048 24.0879H15.3048L9.60201 29.7308L3.90932 24.0879H8.0806C8.14106 15.3223 15.2645 8.22345 24.0605 8.14313V3.89587Z' fill='black'/%3E%3C/g%3E%3C/svg%3E ") 12 12,crosshair`;
}
function initControlsRotate(canvas) {
  fabric.Object.prototype.controls.mtr = new fabric.Control({
    x: -0.5,
    y: -0.5,
    offsetY: -10,
    offsetX: -10,
    rotate: 20,
    actionName: 'rotate',
    actionHandler: fabric.controlsUtils.rotationWithSnapping,
    render: () => ''
  });
  fabric.Object.prototype.controls.mtr2 = new fabric.Control({
    x: 0.5,
    y: -0.5,
    offsetY: -10,
    offsetX: 10,
    rotate: 20,
    actionName: 'rotate',
    actionHandler: fabric.controlsUtils.rotationWithSnapping,
    render: () => ''
  });
  fabric.Object.prototype.controls.mtr3 = new fabric.Control({
    x: 0.5,
    y: 0.5,
    offsetY: 10,
    offsetX: 10,
    rotate: 20,
    actionName: 'rotate',
    actionHandler: fabric.controlsUtils.rotationWithSnapping,
    render: () => ''
  });
  fabric.Object.prototype.controls.mtr4 = new fabric.Control({
    x: -0.5,
    y: 0.5,
    offsetY: 10,
    offsetX: -10,
    rotate: 20,
    actionName: 'rotate',
    actionHandler: fabric.controlsUtils.rotationWithSnapping,
    render: () => ''
  });
  canvas.on('after:render', () => {
    var _activeObj$angle;
    const activeObj = canvas.getActiveObject();
    const angle = activeObj === null || activeObj === void 0 ? void 0 : (_activeObj$angle = activeObj.angle) === null || _activeObj$angle === void 0 ? void 0 : _activeObj$angle.toFixed(2);
    if (angle !== undefined) {
      fabric.Object.prototype.controls.mtr.cursorStyle = rotateIcon(Number(angle));
      fabric.Object.prototype.controls.mtr2.cursorStyle = rotateIcon(Number(angle) + 90);
      fabric.Object.prototype.controls.mtr3.cursorStyle = rotateIcon(Number(angle) + 180);
      fabric.Object.prototype.controls.mtr4.cursorStyle = rotateIcon(Number(angle) + 270);
    }
  });
  canvas.on('object:rotating', event => {
    var _canvas$getActiveObje, _canvas$getActiveObje2, _event$transform;
    const body = canvas.lowerCanvasEl.nextSibling;
    const angle = (_canvas$getActiveObje = canvas.getActiveObject()) === null || _canvas$getActiveObje === void 0 ? void 0 : (_canvas$getActiveObje2 = _canvas$getActiveObje.angle) === null || _canvas$getActiveObje2 === void 0 ? void 0 : _canvas$getActiveObje2.toFixed(2);
    if (angle === undefined) return;
    switch ((_event$transform = event.transform) === null || _event$transform === void 0 ? void 0 : _event$transform.corner) {
      case 'mtr':
        body.style.cursor = rotateIcon(Number(angle));
        break;
      case 'mtr2':
        body.style.cursor = rotateIcon(Number(angle) + 90);
        break;
      case 'mtr3':
        body.style.cursor = rotateIcon(Number(angle) + 180);
        break;
      case 'mtr4':
        body.style.cursor = rotateIcon(Number(angle) + 270);
        break;
    }
  });
}

class CenterAlign {
  constructor(canvas) {
    this.canvas = canvas;
  }
  centerH(workspace, object) {
    return this.canvas._centerObject(object, new fabric.Point(workspace.getCenterPoint().x, object.getCenterPoint().y));
  }
  center(workspace, object) {
    const center = workspace.getCenterPoint();
    return this.canvas._centerObject(object, center);
  }
  centerV(workspace, object) {
    return this.canvas._centerObject(object, new fabric.Point(object.getCenterPoint().x, workspace.getCenterPoint().y));
  }
  position(name) {
    const anignType = ['centerH', 'center', 'centerV'];
    const activeObject = this.canvas.getActiveObject();
    if (anignType.includes(name) && activeObject) {
      const defaultWorkspace = this.canvas.getObjects().find(item => item.id === 'workspace');
      if (defaultWorkspace) {
        this[name](defaultWorkspace, activeObject);
      }
      this.canvas.renderAll();
    }
  }
}

const KeyNames = {
  lrdu: 'left,right,down,up',
  shiftMove: 'shift+left,shift+right,shift+down,shift+up',
  delete: 'delete,backspace',
  ctrlz: 'ctrl+z,command+z',
  ctrlshiftz: 'ctrl+shift+z,command+shift+z',
  enter: 'enter',
  esc: 'esc',
  zoom: 'command+*,command+*,ctrl+*,ctrl+*'
};

function initHotkeys(canvas) {
  hotkeys(KeyNames.lrdu, (_event, handler) => {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    switch (handler.key) {
      case 'left':
        if (activeObject.left === undefined) return;
        activeObject.set('left', activeObject.left - 1);
        break;
      case 'right':
        if (activeObject.left === undefined) return;
        activeObject.set('left', activeObject.left + 1);
        break;
      case 'down':
        if (activeObject.top === undefined) return;
        activeObject.set('top', activeObject.top + 1);
        break;
      case 'up':
        if (activeObject.top === undefined) return;
        activeObject.set('top', activeObject.top - 1);
        break;
    }
    canvas.renderAll();
  });
  hotkeys(KeyNames.shiftMove, (_event, handler) => {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    switch (handler.key) {
      case 'shift+left':
        if (activeObject.left === undefined) return;
        activeObject.set('left', activeObject.left - 10);
        break;
      case 'shift+right':
        if (activeObject.left === undefined) return;
        activeObject.set('left', activeObject.left + 10);
        break;
      case 'shift+down':
        if (activeObject.top === undefined) return;
        activeObject.set('top', activeObject.top + 10);
        break;
      case 'shift+up':
        if (activeObject.top === undefined) return;
        activeObject.set('top', activeObject.top - 10);
        break;
    }
    canvas.renderAll();
  });
}

const Types = {
  CHANGE_SCALE: 'changeScale',
  CANVAS_CHANGE: 'canvasChange',
  CLIP_IMAGE: 'clipImage',
  SHOW_LOADING: 'show_loading'
};

const events = new EventEmitter();

const isNumber = value => typeof value === 'number';
const isUndef = value => typeof value === 'undefined';

const verticalImg = 'https://ossprod.jrdaimao.com/file/1691055918106919.svg';
const edgeImg = 'https://ossprod.jrdaimao.com/file/1691055938230666.svg';
const rotateImg = 'https://ossprod.jrdaimao.com/file/1691574701262500.svg';
const horizontalImg = 'https://ossprod.jrdaimao.com/file/1691055964267980.svg';
const copyImg = 'https://ossprod.jrdaimao.com/file/1691660518949720.svg';
const deleteImg = 'https://ossprod.jrdaimao.com/file/1691662370382182.svg';
const clipImg = 'https://ossprod.jrdaimao.com/file/1691718842537240.svg';
const topBgImg = 'https://ossprod.jrdaimao.com/file/1691978616647204.svg';
fabric.Object.NUM_FRACTION_DIGITS = 4;
const setBaseControlVisible = (object, visible) => {
  if (!object) return;
  object.setControlsVisibility({
    mt: visible,
    mb: visible,
    ml: visible,
    mr: visible,
    tl: visible,
    tr: visible,
    bl: visible,
    br: visible
  });
};
const setHighControlVisible = (object, visible) => {
  if (!object) return;
  object.setControlsVisibility({
    copy: visible,
    delete: visible,
    clip: visible,
    rotate: visible,
    topBg: visible
  });
};
function drawImg(ctx, left, top, img, wSize, hSize, angle) {
  if (angle === undefined) return;
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(fabric.util.degreesToRadians(angle));
  ctx.drawImage(img, -wSize / 2, -hSize / 2, wSize, hSize);
  ctx.restore();
}
function intervalControl() {
  const verticalImgIcon = document.createElement('img');
  verticalImgIcon.src = verticalImg;
  const horizontalImgIcon = document.createElement('img');
  horizontalImgIcon.src = horizontalImg;
  function renderIcon(ctx, left, top, styleOverride, fabricObject) {
    drawImg(ctx, left, top, verticalImgIcon, 20, 25, fabricObject.angle);
  }
  function renderIconHoz(ctx, left, top, styleOverride, fabricObject) {
    drawImg(ctx, left, top, horizontalImgIcon, 25, 20, fabricObject.angle);
  }
  fabric.Object.prototype.controls.ml = new fabric.Control({
    x: -0.5,
    y: 0,
    offsetX: -1,
    cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingXOrSkewingY,
    getActionName: fabric.controlsUtils.scaleOrSkewActionName,
    render: renderIcon
  });
  fabric.Object.prototype.controls.mr = new fabric.Control({
    x: 0.5,
    y: 0,
    offsetX: 1,
    cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingXOrSkewingY,
    getActionName: fabric.controlsUtils.scaleOrSkewActionName,
    render: renderIcon
  });
  fabric.Object.prototype.controls.mb = new fabric.Control({
    x: 0,
    y: 0.5,
    offsetY: 1,
    cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingYOrSkewingX,
    getActionName: fabric.controlsUtils.scaleOrSkewActionName,
    render: renderIconHoz
  });
  fabric.Object.prototype.controls.mt = new fabric.Control({
    x: 0,
    y: -0.5,
    offsetY: -1,
    cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingYOrSkewingX,
    getActionName: fabric.controlsUtils.scaleOrSkewActionName,
    render: renderIconHoz
  });
}
function peakControl() {
  const img = document.createElement('img');
  img.src = edgeImg;
  function renderIconEdge(ctx, left, top, styleOverride, fabricObject) {
    drawImg(ctx, left, top, img, 25, 25, fabricObject.angle);
  }
  fabric.Object.prototype.controls.tl = new fabric.Control({
    x: -0.5,
    y: -0.5,
    cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingEqually,
    render: renderIconEdge
  });
  fabric.Object.prototype.controls.bl = new fabric.Control({
    x: -0.5,
    y: 0.5,
    cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingEqually,
    render: renderIconEdge
  });
  fabric.Object.prototype.controls.tr = new fabric.Control({
    x: 0.5,
    y: -0.5,
    cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingEqually,
    render: renderIconEdge
  });
  fabric.Object.prototype.controls.br = new fabric.Control({
    x: 0.5,
    y: 0.5,
    cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingEqually,
    render: renderIconEdge
  });
}
function rotationControl() {
  const img = document.createElement('img');
  img.src = rotateImg;
  function renderIconRotate(ctx, left, top, styleOverride, fabricObject) {
    drawImg(ctx, left, top, img, 60, 60, fabricObject.angle);
  }
  fabric.Object.prototype.controls.rotate = new fabric.Control({
    y: 0.5,
    cursorStyleHandler: fabric.controlsUtils.rotationStyleHandler,
    actionHandler: fabric.controlsUtils.rotationWithSnapping,
    offsetY: 25,
    actionName: 'rotate',
    cursorStyle: 'pointer',
    render: renderIconRotate
  });
}
function initMainControl() {
  const topBgEl = document.createElement('img');
  topBgEl.src = topBgImg;
  const copyImageEl = document.createElement('img');
  copyImageEl.src = copyImg;
  const deleteImageEl = document.createElement('img');
  deleteImageEl.src = deleteImg;
  const clipImageEl = document.createElement('img');
  clipImageEl.src = clipImg;
  function cloneObject(eventData, transform) {
    const target = transform.target;
    if (!target) return;
    const canvas = target.canvas;
    events.emit(Types.SHOW_LOADING, true);
    target.clone(function (cloned) {
      cloned.set({
        id: uuid(),
        left: target.left + 20,
        top: target.top + 20,
        sourceSrc: target.sourceSrc,
        rawScaleX: target.rawScaleX,
        rawScaleY: target.rawScaleY,
        rectDiffLeft: target.rectDiffLeft,
        rectDiffTop: target.rectDiffTop,
        prevWidth: target.prevWidth,
        prevHeight: target.prevHeight
      });
      cloned.setCoords();
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
      events.emit(Types.SHOW_LOADING, false);
    });
  }
  function deleteObject(eventData, transform) {
    const target = transform.target;
    if (!target) return;
    const canvas = target.canvas;
    const clipRect = canvas.getObjects().find(item => item.id === 'currentClipRect');
    if (clipRect) {
      canvas.remove(clipRect);
    }
    canvas.remove(target);
    canvas.requestRenderAll();
  }
  function clipObject(eventData, transform) {
    const image = transform.target;
    if (image.type !== 'image') return;
    const canvas = image.canvas;
    const rectLeft = image.left;
    const rectTop = image.top;
    const sourceSrc = image.sourceSrc;
    const rawScaleX = image.rawScaleX || image.scaleX;
    const rawScaleY = image.rawScaleY || image.scaleY;
    const rectDiffLeft = image.rectDiffLeft;
    const rectDiffTop = image.rectDiffTop;
    const index = canvas.getObjects().findIndex(item => item.id === image.id);
    const sourceWidth = image.getScaledWidth();
    const sourceHeight = image.getScaledHeight();
    image.clone(o => image.set({
      cloneObject: o
    }));
    if (sourceSrc) {
      image.setSrc(sourceSrc, () => {
        canvas.renderAll();
      }, {
        crossOrigin: 'anonymous'
      });
      image.set({
        id: 'clipRawImage',
        scaleX: rawScaleX,
        scaleY: rawScaleY,
        left: !isUndef(rectDiffLeft) ? image.left - rectDiffLeft * image.scaleX : image.left,
        top: !isUndef(rectDiffTop) ? image.top - rectDiffTop * image.scaleY : image.top
      });
    }
    image.bringToFront();
    setHighControlVisible(image, false);
    const selectionRect = new fabric.Rect({
      left: rectLeft,
      top: rectTop,
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
      lockMovementX: true,
      lockMovementY: true,
      hoverCursor: 'default'
    });
    image.set({
      sourceSrc: image.sourceSrc || image._element.src
    });
    let selectionRectDown = false;
    let imageDown = false;
    selectionRect.on('mousedown', ({}) => selectionRectDown = true);
    selectionRect.on('scaling', () => selectionRectDown = false);
    selectionRect.on('mousemove', ({
      e
    }) => {
      if (!selectionRectDown) return;
      setBaseControlVisible(selectionRect, false);
      image.set({
        left: image.left + e.movementX,
        top: image.top + e.movementY
      });
      if (image.left > selectionRect.left) {
        image.set({
          left: selectionRect.left
        });
      }
      const rectWidth = selectionRect.getScaledWidth();
      if (image.left + image.getScaledWidth() <= selectionRect.left + rectWidth) {
        image.set({
          left: selectionRect.left + rectWidth - image.getScaledWidth()
        });
      }
      if (image.top > selectionRect.top) {
        image.set({
          top: selectionRect.top
        });
      }
      const rectHeight = selectionRect.getScaledHeight();
      if (image.top + image.getScaledHeight() <= selectionRect.top + rectHeight) {
        image.set({
          top: selectionRect.top + rectHeight - image.getScaledHeight()
        });
      }
      canvas.renderAll();
    });
    selectionRect.on('mouseup', () => {
      selectionRectDown = false;
      setBaseControlVisible(selectionRect, true);
      canvas.renderAll();
    });
    selectionRect.on('scaling', e => {
      const rect = e.transform.target;
      if (rect.left < image.left) {
        rect.set({
          left: image.left
        });
      }
      if (rect.top < image.top) {
        rect.set({
          top: image.top
        });
      }
      if (rect.left + rect.getScaledWidth() > image.left + image.getScaledWidth()) {
        rect.set({
          left: image.left + image.getScaledWidth() - rect.getScaledWidth()
        });
      }
      if (rect.top + rect.getScaledHeight() > image.top + image.getScaledHeight()) {
        rect.set({
          top: image.top + image.getScaledHeight() - rect.getScaledHeight()
        });
      }
      if (image.getScaledWidth() / rect.getScaledWidth() < 1) {
        rect.set({
          scaleX: image.getScaledWidth() / selectionRect.getScaledWidth() * rect.get('scaleX'),
          left: image.left
        });
      }
      if (image.getScaledHeight() / rect.getScaledHeight() < 1) {
        rect.set({
          scaleY: image.getScaledHeight() / selectionRect.getScaledHeight() * rect.get('scaleY'),
          top: image.top
        });
      }
      canvas.renderAll();
    });
    image.on('moving', e => {
      const image = e.transform.target;
      if (image.left > selectionRect.left) {
        image.set({
          left: selectionRect.left
        });
      }
      if (image.top > selectionRect.top) {
        image.set({
          top: selectionRect.top
        });
      }
      const rectWidth = selectionRect.getScaledWidth();
      if (image.left < selectionRect.left + rectWidth - image.getScaledWidth()) {
        image.set({
          left: selectionRect.left + rectWidth - image.getScaledWidth()
        });
      }
      const rectHeight = selectionRect.getScaledHeight();
      if (image.top < selectionRect.top + rectHeight - image.getScaledHeight()) {
        image.set({
          top: selectionRect.top + rectHeight - image.getScaledHeight()
        });
      }
      canvas.renderAll();
    });
    image.on('scaling', e => {
      const image = e.transform.target;
      if (image.left > selectionRect.left) {
        image.set({
          left: selectionRect.left
        });
      }
      if (image.top > selectionRect.top) {
        image.set({
          top: selectionRect.top
        });
      }
      if (selectionRect.getScaledWidth() / image.getScaledWidth() > 1) {
        image.set({
          scaleX: selectionRect.getScaledWidth() * image.get('scaleX') / image.getScaledWidth()
        });
      }
      if (selectionRect.getScaledHeight() / image.getScaledHeight() > 1) {
        image.set({
          scaleY: selectionRect.getScaledHeight() * image.get('scaleY') / image.getScaledHeight()
        });
      }
      canvas.renderAll();
    });
    image.on('mousedown', () => imageDown = true);
    image.on('mousemove', () => {
      if (imageDown) {
        setBaseControlVisible(image, false);
        canvas.renderAll();
      }
    });
    image.on('mouseup', () => {
      imageDown = false;
      setBaseControlVisible(image, true);
      canvas.renderAll();
    });
    setHighControlVisible(selectionRect, false);
    canvas.add(selectionRect);
    canvas.setActiveObject(selectionRect);
    canvas.renderAll();
    events.emit(Types.CLIP_IMAGE, {
      visible: true,
      rawIndex: index,
      clipImageId: image.id
    });
  }
  fabric.Object.prototype.controls.topBg = new fabric.Control({
    y: -0.5,
    cursorStyleHandler: fabric.controlsUtils.rotationStyleHandler,
    mouseUpHandler: () => {},
    offsetY: -25,
    cursorStyle: 'pointer',
    render: (ctx, left, top, styleOverride, fabricObject) => {
      if (fabricObject.type === 'image') {
        drawImg(ctx, left, top, topBgEl, 136, 68, fabricObject.angle);
      }
      if (fabricObject.type === 'i-text') {
        drawImg(ctx, left, top, topBgEl, 90, 68, fabricObject.angle);
      }
    }
  });
  fabric.Object.prototype.controls.copy = new fabric.Control({
    y: -0.5,
    cursorStyleHandler: fabric.controlsUtils.rotationStyleHandler,
    mouseUpHandler: cloneObject,
    offsetY: -25,
    offsetX: -30,
    cursorStyle: 'pointer',
    render: (ctx, left, top, styleOverride, fabricObject) => {
      if (fabricObject.type === 'image') {
        drawImg(ctx, left, top, copyImageEl, 30, 30, fabricObject.angle);
      }
    }
  });
  fabric.Object.prototype.controls.delete = new fabric.Control({
    y: -0.5,
    cursorStyleHandler: fabric.controlsUtils.rotationStyleHandler,
    mouseUpHandler: deleteObject,
    offsetY: -25,
    offsetX: 30,
    cursorStyle: 'pointer',
    render: (ctx, left, top, styleOverride, fabricObject) => {
      if (fabricObject.type === 'image') {
        drawImg(ctx, left, top, deleteImageEl, 30, 30, fabricObject.angle);
      }
    }
  });
  fabric.Object.prototype.controls.clip = new fabric.Control({
    y: -0.5,
    cursorStyleHandler: fabric.controlsUtils.rotationStyleHandler,
    mouseUpHandler: clipObject,
    offsetY: -25,
    offsetX: 0,
    cursorStyle: 'pointer',
    render: (ctx, left, top, styleOverride, fabricObject) => {
      if (fabricObject.type === 'image') {
        drawImg(ctx, left, top, clipImageEl, 30, 30, fabricObject.angle);
      }
    }
  });
  fabric.Object.prototype.controls.textC = new fabric.Control({
    y: -0.5,
    cursorStyleHandler: fabric.controlsUtils.rotationStyleHandler,
    mouseUpHandler: cloneObject,
    offsetY: -25,
    offsetX: -15,
    cursorStyle: 'pointer',
    render: (ctx, left, top, styleOverride, fabricObject) => {
      if (fabricObject.type === 'i-text') {
        drawImg(ctx, left, top, copyImageEl, 30, 30, fabricObject.angle);
      }
    }
  });
  fabric.Object.prototype.controls.textdelete = new fabric.Control({
    y: -0.5,
    cursorStyleHandler: fabric.controlsUtils.rotationStyleHandler,
    mouseUpHandler: deleteObject,
    offsetY: -25,
    offsetX: 15,
    cursorStyle: 'pointer',
    render: (ctx, left, top, styleOverride, fabricObject) => {
      if (fabricObject.type === 'i-text') {
        drawImg(ctx, left, top, deleteImageEl, 30, 30, fabricObject.angle);
      }
    }
  });
}
function initControls(canvas) {
  peakControl();
  intervalControl();
  rotationControl();
  initMainControl();
  fabric.Object.prototype.set({
    transparentCorners: false,
    borderColor: '#51B9F9',
    cornerColor: '#FFF',
    borderScaleFactor: 2.5,
    cornerStyle: 'circle',
    cornerStrokeColor: '#0E98FC',
    borderOpacityWhenMoving: 1
  });
}

const getGap = zoom => {
  const zooms = [0.02, 0.03, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 18];
  const gaps = [5000, 2500, 1000, 500, 250, 100, 50, 25, 10, 5, 2];
  let i = 0;
  while (i < zooms.length && zooms[i] < zoom) {
    i++;
  }
  return gaps[i - 1] || 5000;
};
const mergeLines = (rect, isHorizontal) => {
  const axis = isHorizontal ? 'left' : 'top';
  const length = isHorizontal ? 'width' : 'height';
  rect.sort((a, b) => a[axis] - b[axis]);
  const mergedLines = [];
  let currentLine = Object.assign({}, rect[0]);
  for (const item of rect) {
    const line = Object.assign({}, item);
    if (currentLine[axis] + currentLine[length] >= line[axis]) {
      currentLine[length] = Math.max(currentLine[axis] + currentLine[length], line[axis] + line[length]) - currentLine[axis];
    } else {
      mergedLines.push(currentLine);
      currentLine = Object.assign({}, line);
    }
  }
  mergedLines.push(currentLine);
  return mergedLines;
};
const darwLine = (ctx, options) => {
  ctx.save();
  const {
    left,
    top,
    width,
    height,
    stroke,
    lineWidth
  } = options;
  ctx.beginPath();
  stroke && (ctx.strokeStyle = stroke);
  ctx.lineWidth = lineWidth || 1;
  ctx.moveTo(left, top);
  ctx.lineTo(left + width, top + height);
  ctx.stroke();
  ctx.restore();
};
const darwText = (ctx, options) => {
  ctx.save();
  const {
    left,
    top,
    text,
    fill,
    align,
    angle,
    fontSize
  } = options;
  fill && (ctx.fillStyle = fill);
  ctx.textAlign = align || 'left';
  ctx.textBaseline = 'top';
  ctx.font = `${fontSize || 10}px sans-serif`;
  if (angle) {
    ctx.translate(left, top);
    ctx.rotate(Math.PI / 180 * angle);
    ctx.translate(-left, -top);
  }
  ctx.fillText(text, left, top);
  ctx.restore();
};
const darwRect = (ctx, options) => {
  ctx.save();
  const {
    left,
    top,
    width,
    height,
    fill,
    stroke,
    strokeWidth
  } = options;
  ctx.beginPath();
  fill && (ctx.fillStyle = fill);
  ctx.rect(left, top, width, height);
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth || 1;
    ctx.stroke();
  }
  ctx.restore();
};
const drawMask = (ctx, options) => {
  ctx.save();
  const {
    isHorizontal,
    left,
    top,
    width,
    height,
    backgroundColor
  } = options;
  const gradient = isHorizontal ? ctx.createLinearGradient(left, height / 2, left + width, height / 2) : ctx.createLinearGradient(width / 2, top, width / 2, height + top);
  const transparentColor = new fabric.Color(backgroundColor);
  transparentColor.setAlpha(0);
  gradient.addColorStop(0, transparentColor.toRgba());
  gradient.addColorStop(0.33, backgroundColor);
  gradient.addColorStop(0.67, backgroundColor);
  gradient.addColorStop(1, transparentColor.toRgba());
  darwRect(ctx, {
    left,
    top,
    width,
    height,
    fill: gradient
  });
  ctx.restore();
};

function setupGuideLine() {
  if (fabric.GuideLine) {
    return;
  }
  fabric.GuideLine = fabric.util.createClass(fabric.Line, {
    type: 'GuideLine',
    selectable: false,
    hasControls: false,
    hasBorders: false,
    stroke: '#4bec13',
    originX: 'center',
    originY: 'center',
    padding: 4,
    globalCompositeOperation: 'difference',
    axis: 'horizontal',
    initialize(points, options) {
      const isHorizontal = options.axis === 'horizontal';
      this.hoverCursor = isHorizontal ? 'ns-resize' : 'ew-resize';
      const newPoints = isHorizontal ? [-999999, points, 999999, points] : [points, -999999, points, 999999];
      options[isHorizontal ? 'lockMovementX' : 'lockMovementY'] = true;
      this.callSuper('initialize', newPoints, options);
      this.on('mousedown:before', e => {
        if (this.activeOn === 'down') {
          this.canvas.setActiveObject(this, e.e);
        }
      });
      this.on('moving', e => {
        if (this.canvas.ruler.options.enabled && this.isPointOnRuler(e.e)) {
          this.moveCursor = 'not-allowed';
        } else {
          this.moveCursor = this.isHorizontal() ? 'ns-resize' : 'ew-resize';
        }
        this.canvas.fire('guideline:moving', {
          target: this,
          e: e.e
        });
      });
      this.on('mouseup', e => {
        if (this.canvas.ruler.options.enabled && this.isPointOnRuler(e.e)) {
          this.canvas.remove(this);
          return;
        }
        this.moveCursor = this.isHorizontal() ? 'ns-resize' : 'ew-resize';
        this.canvas.fire('guideline:mouseup', {
          target: this,
          e: e.e
        });
      });
      this.on('removed', () => {
        this.off('removed');
        this.off('mousedown:before');
        this.off('moving');
        this.off('mouseup');
      });
    },
    getBoundingRect(absolute, calculate) {
      this.bringToFront();
      const isHorizontal = this.isHorizontal();
      const rect = this.callSuper('getBoundingRect', absolute, calculate);
      rect[isHorizontal ? 'top' : 'left'] += rect[isHorizontal ? 'height' : 'width'] / 2;
      rect[isHorizontal ? 'height' : 'width'] = 0;
      return rect;
    },
    isPointOnRuler(e) {
      const isHorizontal = this.isHorizontal();
      const hoveredRuler = this.canvas.ruler.isPointOnRuler(new fabric.Point(e.offsetX, e.offsetY));
      if (isHorizontal && hoveredRuler === 'horizontal' || !isHorizontal && hoveredRuler === 'vertical') {
        return hoveredRuler;
      }
      return false;
    },
    isHorizontal() {
      return this.height === 0;
    }
  });
  fabric.GuideLine.fromObject = function (object, callback) {
    const clone = fabric.util.object.clone;
    function _callback(instance) {
      delete instance.xy;
      callback && callback(instance);
    }
    const options = clone(object, true);
    const isHorizontal = options.height === 0;
    options.xy = isHorizontal ? options.y1 : options.x1;
    options.axis = isHorizontal ? 'horizontal' : 'vertical';
    fabric.Object._fromObject(options.type, options, _callback, 'xy');
  };
}

class CanvasRuler {
  constructor(_options) {
    this.activeOn = 'up';
    this.eventHandler = {
      calcObjectRect: throttle(this.calcObjectRect.bind(this), 15),
      clearStatus: this.clearStatus.bind(this),
      canvasMouseDown: this.canvasMouseDown.bind(this),
      canvasMouseMove: throttle(this.canvasMouseMove.bind(this), 15),
      canvasMouseUp: this.canvasMouseUp.bind(this),
      render: e => {
        if (!e.ctx) return;
        this.render();
      }
    };
    this.lastAttr = {
      status: 'out',
      cursor: undefined,
      selection: undefined
    };
    this.getCommonEventInfo = e => {
      if (!this.tempGuidelLine || !e.absolutePointer) return;
      return {
        e: e.e,
        transform: this.tempGuidelLine.get('transform'),
        pointer: {
          x: e.absolutePointer.x,
          y: e.absolutePointer.y
        },
        target: this.tempGuidelLine
      };
    };
    this.options = Object.assign({
      ruleSize: 20,
      fontSize: 10,
      enabled: false,
      backgroundColor: '#fff',
      borderColor: '#ddd',
      highlightColor: '#007fff',
      textColor: '#888'
    }, _options);
    this.ctx = this.options.canvas.getContext();
    fabric.util.object.extend(this.options.canvas, {
      ruler: this
    });
    setupGuideLine();
    if (this.options.enabled) {
      this.enable();
    }
  }
  destroy() {
    this.disable();
  }
  clearGuideline() {
    this.options.canvas.remove(...this.options.canvas.getObjects(fabric.GuideLine.prototype.type));
  }
  showGuideline() {
    this.options.canvas.getObjects(fabric.GuideLine.prototype.type).forEach(guideLine => {
      guideLine.set('visible', true);
    });
    this.options.canvas.renderAll();
  }
  hideGuideline() {
    this.options.canvas.getObjects(fabric.GuideLine.prototype.type).forEach(guideLine => {
      guideLine.set('visible', false);
    });
    this.options.canvas.renderAll();
  }
  enable() {
    this.options.enabled = true;
    this.options.canvas.on('after:render', this.eventHandler.calcObjectRect);
    this.options.canvas.on('after:render', this.eventHandler.render);
    this.options.canvas.on('mouse:down', this.eventHandler.canvasMouseDown);
    this.options.canvas.on('mouse:move', this.eventHandler.canvasMouseMove);
    this.options.canvas.on('mouse:up', this.eventHandler.canvasMouseUp);
    this.options.canvas.on('selection:cleared', this.eventHandler.clearStatus);
    this.showGuideline();
    this.render();
  }
  disable() {
    this.options.canvas.off('after:render', this.eventHandler.calcObjectRect);
    this.options.canvas.off('after:render', this.eventHandler.render);
    this.options.canvas.off('mouse:down', this.eventHandler.canvasMouseDown);
    this.options.canvas.off('mouse:move', this.eventHandler.canvasMouseMove);
    this.options.canvas.off('mouse:up', this.eventHandler.canvasMouseUp);
    this.options.canvas.off('selection:cleared', this.eventHandler.clearStatus);
    this.hideGuideline();
    this.options.enabled = false;
  }
  render() {
    var _this$startCalibratio, _this$startCalibratio2;
    const vpt = this.options.canvas.viewportTransform;
    if (!vpt) return;
    this.draw({
      isHorizontal: true,
      rulerLength: this.getSize().width,
      startCalibration: (_this$startCalibratio = this.startCalibration) !== null && _this$startCalibratio !== void 0 && _this$startCalibratio.x ? this.startCalibration.x : -(vpt[4] / vpt[0])
    });
    this.draw({
      isHorizontal: false,
      rulerLength: this.getSize().height,
      startCalibration: (_this$startCalibratio2 = this.startCalibration) !== null && _this$startCalibratio2 !== void 0 && _this$startCalibratio2.y ? this.startCalibration.y : -(vpt[5] / vpt[3])
    });
    drawMask(this.ctx, {
      isHorizontal: true,
      left: -10,
      top: -10,
      width: this.options.ruleSize * 2 + 10,
      height: this.options.ruleSize + 10,
      backgroundColor: this.options.backgroundColor
    });
    drawMask(this.ctx, {
      isHorizontal: false,
      left: -10,
      top: -10,
      width: this.options.ruleSize + 10,
      height: this.options.ruleSize * 2 + 10,
      backgroundColor: this.options.backgroundColor
    });
  }
  getSize() {
    return {
      width: this.options.canvas.width || 0,
      height: this.options.canvas.height || 0
    };
  }
  getZoom() {
    return this.options.canvas.getZoom();
  }
  draw(opt) {
    const {
      isHorizontal,
      rulerLength,
      startCalibration
    } = opt;
    const zoom = this.getZoom();
    const gap = getGap(zoom);
    const unitLength = rulerLength / zoom;
    const startValue = Math[startCalibration > 0 ? 'floor' : 'ceil'](startCalibration / gap) * gap;
    const startOffset = startValue - startCalibration;
    const canvasSize = this.getSize();
    darwRect(this.ctx, {
      left: 0,
      top: 0,
      width: isHorizontal ? canvasSize.width : this.options.ruleSize,
      height: isHorizontal ? this.options.ruleSize : canvasSize.height,
      fill: this.options.backgroundColor,
      stroke: this.options.borderColor
    });
    const textColor = new fabric.Color(this.options.textColor);
    for (let i = 0; i + startOffset <= Math.ceil(unitLength); i += gap) {
      const position = (startOffset + i) * zoom;
      const textValue = startValue + i + '';
      const textLength = 10 * textValue.length / 4;
      const textX = isHorizontal ? position - textLength - 1 : this.options.ruleSize / 2 - this.options.fontSize / 2 - 4;
      const textY = isHorizontal ? this.options.ruleSize / 2 - this.options.fontSize / 2 - 4 : position + textLength;
      darwText(this.ctx, {
        text: textValue,
        left: textX,
        top: textY,
        fill: textColor.toRgb(),
        angle: isHorizontal ? 0 : -90
      });
    }
    for (let j = 0; j + startOffset <= Math.ceil(unitLength); j += gap) {
      const position = Math.round((startOffset + j) * zoom);
      const left = isHorizontal ? position : this.options.ruleSize - 8;
      const top = isHorizontal ? this.options.ruleSize - 8 : position;
      const width = isHorizontal ? 0 : 8;
      const height = isHorizontal ? 8 : 0;
      darwLine(this.ctx, {
        left,
        top,
        width,
        height,
        stroke: textColor.toRgb()
      });
    }
    if (this.objectRect) {
      const axis = isHorizontal ? 'x' : 'y';
      this.objectRect[axis].forEach(rect => {
        if (rect.skip === axis) {
          return;
        }
        const roundFactor = x => Math.round(x / zoom + startCalibration) + '';
        const leftTextVal = roundFactor(isHorizontal ? rect.left : rect.top);
        const rightTextVal = roundFactor(isHorizontal ? rect.left + rect.width : rect.top + rect.height);
        const isSameText = leftTextVal === rightTextVal;
        const maskOpt = {
          isHorizontal,
          width: isHorizontal ? 160 : this.options.ruleSize - 8,
          height: isHorizontal ? this.options.ruleSize - 8 : 160,
          backgroundColor: this.options.backgroundColor
        };
        drawMask(this.ctx, {
          ...maskOpt,
          left: isHorizontal ? rect.left - 80 : 0,
          top: isHorizontal ? 0 : rect.top - 80
        });
        if (!isSameText) {
          drawMask(this.ctx, {
            ...maskOpt,
            left: isHorizontal ? rect.width + rect.left - 80 : 0,
            top: isHorizontal ? 0 : rect.height + rect.top - 80
          });
        }
        const highlightColor = new fabric.Color(this.options.highlightColor);
        highlightColor.setAlpha(0.5);
        darwRect(this.ctx, {
          left: isHorizontal ? rect.left : this.options.ruleSize - 8,
          top: isHorizontal ? this.options.ruleSize - 8 : rect.top,
          width: isHorizontal ? rect.width : 8,
          height: isHorizontal ? 8 : rect.height,
          fill: highlightColor.toRgba()
        });
        const pad = this.options.ruleSize / 2 - this.options.fontSize / 2 - 4;
        const textOpt = {
          fill: highlightColor.toRgba(),
          angle: isHorizontal ? 0 : -90
        };
        darwText(this.ctx, {
          ...textOpt,
          text: leftTextVal,
          left: isHorizontal ? rect.left - 2 : pad,
          top: isHorizontal ? pad : rect.top - 2,
          align: isSameText ? 'center' : isHorizontal ? 'right' : 'left'
        });
        if (!isSameText) {
          darwText(this.ctx, {
            ...textOpt,
            text: rightTextVal,
            left: isHorizontal ? rect.left + rect.width + 2 : pad,
            top: isHorizontal ? pad : rect.top + rect.height + 2,
            align: isHorizontal ? 'left' : 'right'
          });
        }
        const lineSize = isSameText ? 8 : 14;
        highlightColor.setAlpha(1);
        const lineOpt = {
          width: isHorizontal ? 0 : lineSize,
          height: isHorizontal ? lineSize : 0,
          stroke: highlightColor.toRgba()
        };
        darwLine(this.ctx, {
          ...lineOpt,
          left: isHorizontal ? rect.left : this.options.ruleSize - lineSize,
          top: isHorizontal ? this.options.ruleSize - lineSize : rect.top
        });
        if (!isSameText) {
          darwLine(this.ctx, {
            ...lineOpt,
            left: isHorizontal ? rect.left + rect.width : this.options.ruleSize - lineSize,
            top: isHorizontal ? this.options.ruleSize - lineSize : rect.top + rect.height
          });
        }
      });
    }
  }
  calcObjectRect() {
    const activeObjects = this.options.canvas.getActiveObjects();
    if (activeObjects.length === 0) return;
    const allRect = activeObjects.reduce((rects, obj) => {
      const rect = obj.getBoundingRect(false, true);
      if (obj.group) {
        const group = {
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          scaleX: 1,
          scaleY: 1,
          ...obj.group
        };
        rect.width *= group.scaleX;
        rect.height *= group.scaleY;
        const groupCenterX = group.width / 2 + group.left;
        const objectOffsetFromCenterX = (group.width / 2 + (obj.left || 0)) * (1 - group.scaleX);
        rect.left += (groupCenterX - objectOffsetFromCenterX) * this.getZoom();
        const groupCenterY = group.height / 2 + group.top;
        const objectOffsetFromCenterY = (group.height / 2 + (obj.top || 0)) * (1 - group.scaleY);
        rect.top += (groupCenterY - objectOffsetFromCenterY) * this.getZoom();
      }
      if (obj instanceof fabric.GuideLine) {
        rect.skip = obj.isHorizontal() ? 'x' : 'y';
      }
      rects.push(rect);
      return rects;
    }, []);
    if (allRect.length === 0) return;
    this.objectRect = {
      x: mergeLines(allRect, true),
      y: mergeLines(allRect, false)
    };
  }
  clearStatus() {
    this.objectRect = undefined;
  }
  isPointOnRuler(point) {
    if (new fabric.Rect({
      left: 0,
      top: 0,
      width: this.options.ruleSize,
      height: this.options.canvas.height
    }).containsPoint(point)) {
      return 'vertical';
    } else if (new fabric.Rect({
      left: 0,
      top: 0,
      width: this.options.canvas.width,
      height: this.options.ruleSize
    }).containsPoint(point)) {
      return 'horizontal';
    }
    return false;
  }
  canvasMouseDown(e) {
    if (!e.pointer || !e.absolutePointer) return;
    const hoveredRuler = this.isPointOnRuler(e.pointer);
    if (hoveredRuler && this.activeOn === 'up') {
      this.lastAttr.selection = this.options.canvas.selection;
      this.options.canvas.selection = false;
      this.activeOn = 'down';
      this.tempGuidelLine = new fabric.GuideLine(hoveredRuler === 'horizontal' ? e.absolutePointer.y : e.absolutePointer.x, {
        axis: hoveredRuler,
        visible: false
      });
      this.options.canvas.add(this.tempGuidelLine);
      this.options.canvas.setActiveObject(this.tempGuidelLine);
      this.options.canvas._setupCurrentTransform(e.e, this.tempGuidelLine, true);
      this.tempGuidelLine.fire('down', this.getCommonEventInfo(e));
    }
  }
  canvasMouseMove(e) {
    if (!e.pointer) return;
    if (this.tempGuidelLine && e.absolutePointer) {
      const pos = {};
      if (this.tempGuidelLine.axis === 'horizontal') {
        pos.top = e.absolutePointer.y;
      } else {
        pos.left = e.absolutePointer.x;
      }
      this.tempGuidelLine.set({
        ...pos,
        visible: true
      });
      this.options.canvas.requestRenderAll();
      const event = this.getCommonEventInfo(e);
      this.options.canvas.fire('object:moving', event);
      this.tempGuidelLine.fire('moving', event);
    }
    const hoveredRuler = this.isPointOnRuler(e.pointer);
    if (!hoveredRuler) {
      if (this.lastAttr.status !== 'out') {
        this.options.canvas.defaultCursor = this.lastAttr.cursor;
        this.lastAttr.status = 'out';
      }
      return;
    }
    if (this.lastAttr.status === 'out' || hoveredRuler !== this.lastAttr.status) {
      this.lastAttr.cursor = this.options.canvas.defaultCursor;
      this.options.canvas.defaultCursor = hoveredRuler === 'horizontal' ? 'ns-resize' : 'ew-resize';
      this.lastAttr.status = hoveredRuler;
    }
  }
  canvasMouseUp(e) {
    var _this$tempGuidelLine;
    if (this.activeOn !== 'down') return;
    this.options.canvas.selection = this.lastAttr.selection;
    this.activeOn = 'up';
    (_this$tempGuidelLine = this.tempGuidelLine) === null || _this$tempGuidelLine === void 0 ? void 0 : _this$tempGuidelLine.fire('up', this.getCommonEventInfo(e));
    this.tempGuidelLine = undefined;
  }
}

function initRuler(canvas, options) {
  const ruler = new CanvasRuler({
    canvas,
    ...options
  });
  let workspace = undefined;
  const getWorkspace = () => {
    workspace = canvas.getObjects().find(item => item.id === 'workspace');
  };
  const isRectOut = (object, target) => {
    const {
      top,
      height,
      left,
      width
    } = object;
    if (top === undefined || height === undefined || left === undefined || width === undefined) {
      return false;
    }
    const targetRect = target.getBoundingRect(true, true);
    const {
      top: targetTop,
      height: targetHeight,
      left: targetLeft,
      width: targetWidth
    } = targetRect;
    if (target.isHorizontal() && (top > targetTop + 1 || top + height < targetTop + targetHeight - 1)) {
      return true;
    } else if (!target.isHorizontal() && (left > targetLeft + 1 || left + width < targetLeft + targetWidth - 1)) {
      return true;
    }
    return false;
  };
  canvas.on('guideline:moving', e => {
    if (!workspace) {
      getWorkspace();
      return;
    }
    const {
      target
    } = e;
    if (isRectOut(workspace, target)) {
      target.moveCursor = 'not-allowed';
    }
  });
  canvas.on('guideline:mouseup', e => {
    if (!workspace) {
      getWorkspace();
      return;
    }
    const {
      target
    } = e;
    if (isRectOut(workspace, target)) {
      canvas.remove(target);
      canvas.setCursor(canvas.defaultCursor || '');
    }
  });
  return ruler;
}

class EditorGroupText {
  constructor(canvas) {
    this.canvas = canvas;
    this._init();
    this.isDown = false;
  }
  _init() {
    this.canvas.on('mouse:down', opt => {
      this.isDown = true;
      if (opt.target && opt.target.type === 'group') {
        const textObject = this._getGroupTextObj(opt);
        if (textObject) {
          this._bedingEditingEvent(textObject, opt);
          this.canvas.setActiveObject(textObject);
          textObject.enterEditing();
        } else {
          this.canvas.setActiveObject(opt.target);
        }
      }
    });
    this.canvas.on('mouse:up', () => {
      this.isDown = false;
    });
    this.canvas.on('mouse:move', opt => {
      if (this.isDown && opt.target && opt.target.type === 'group') {
        const textObject = this._getGroupTextObj(opt);
      }
    });
  }
  _getGroupTextObj(opt) {
    var _opt$target;
    const pointer = this.canvas.getPointer(opt.e, true);
    const clickObj = this.canvas._searchPossibleTargets((_opt$target = opt.target) === null || _opt$target === void 0 ? void 0 : _opt$target._objects, pointer);
    if (clickObj && this.isText(clickObj)) {
      return clickObj;
    }
    return false;
  }
  _bedingEditingEvent(textObject, opt) {
    if (!opt.target) return;
    const left = opt.target.left;
    const top = opt.target.top;
    const ids = this._unGroup() || [];
    const resetGroup = () => {
      const groupArr = this.canvas.getObjects().filter(item => item.id && ids.includes(item.id));
      groupArr.forEach(item => this.canvas.remove(item));
      const group = new fabric.Group([...groupArr]);
      group.set('left', left);
      group.set('top', top);
      group.set('id', uuid());
      textObject.off('editing:exited', resetGroup);
      this.canvas.add(group);
      this.canvas.discardActiveObject().renderAll();
    };
    textObject.on('editing:exited', resetGroup);
  }
  _unGroup() {
    const ids = [];
    const activeObj = this.canvas.getActiveObject();
    if (!activeObj) return;
    activeObj.getObjects().forEach(item => {
      const id = uuid();
      ids.push(id);
      item.set('id', id);
    });
    activeObj.toActiveSelection();
    return ids;
  }
  isText(obj) {
    return obj.type && ['i-text', 'text', 'textbox'].includes(obj.type);
  }
}

class Editor extends EventEmitter {
  constructor(canvas) {
    super();
    this.canvas = canvas;
    this.editorWorkspace = null;
    const {
      disable,
      enable
    } = initAligningGuidelines(canvas);
    this.disableGuidelines = disable;
    this.enableGuidelines = enable;
    initHotkeys(canvas);
    initControls();
    initControlsRotate(canvas);
    new EditorGroupText(canvas);
    this.centerAlign = new CenterAlign(canvas);
    this.ruler = initRuler(canvas);
  }
  _copyActiveSelection(activeObject) {
    const grid = 10;
    const canvas = this.canvas;
    activeObject === null || activeObject === void 0 ? void 0 : activeObject.clone(cloned => {
      cloned.clone(clonedObj => {
        canvas.discardActiveObject();
        if (clonedObj.left === undefined || clonedObj.top === undefined) return;
        clonedObj.canvas = canvas;
        clonedObj.set({
          left: clonedObj.left + grid,
          top: clonedObj.top + grid,
          evented: true,
          id: uuid()
        });
        clonedObj.forEachObject(obj => {
          obj.id = uuid();
          canvas.add(obj);
        });
        clonedObj.setCoords();
        canvas.setActiveObject(clonedObj);
        canvas.requestRenderAll();
      });
    });
  }
  _copyObject(activeObject) {
    const grid = 10;
    const canvas = this.canvas;
    activeObject === null || activeObject === void 0 ? void 0 : activeObject.clone(cloned => {
      if (cloned.left === undefined || cloned.top === undefined) return;
      canvas.discardActiveObject();
      cloned.set({
        left: cloned.left + grid,
        top: cloned.top + grid,
        evented: true,
        id: uuid()
      });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.requestRenderAll();
    });
  }
  clone(paramsActiveObeject) {
    const activeObject = paramsActiveObeject || this.canvas.getActiveObject();
    if (!activeObject) return;
    if ((activeObject === null || activeObject === void 0 ? void 0 : activeObject.type) === 'activeSelection') {
      this._copyActiveSelection(activeObject);
    } else {
      this._copyObject(activeObject);
    }
  }
  unGroup() {
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject) return;
    activeObject.toActiveSelection();
    activeObject.getObjects().forEach(item => {
      item.set('id', uuid());
    });
    this.canvas.discardActiveObject().renderAll();
  }
  group() {
    const activeObj = this.canvas.getActiveObject();
    if (!activeObj) return;
    const activegroup = activeObj.toGroup();
    const objectsInGroup = activegroup.getObjects();
    activegroup.clone(newgroup => {
      newgroup.set('id', uuid());
      this.canvas.remove(activegroup);
      objectsInGroup.forEach(object => {
        this.canvas.remove(object);
      });
      this.canvas.add(newgroup);
      this.canvas.setActiveObject(newgroup);
    });
  }
  getWorkspace() {
    return this.canvas.getObjects().find(item => item.id === 'workspace');
  }
  workspaceSendToBack() {
    const workspace = this.getWorkspace();
    workspace && workspace.sendToBack();
  }
  getJson() {
    return this.canvas.toJSON(['id', 'gradientAngle', 'selectable', 'hasControls', 'sourceSrc', 'rawScaleX', 'rawScaleY', 'rectDiffLeft', 'rectDiffTop', 'prevWidth', 'prevHeight', 'cloneObject']);
  }
  dragAddItem(event, item) {
    const {
      left,
      top
    } = this.canvas.getSelectionElement().getBoundingClientRect();
    if (event.x < left || event.y < top || item.width === undefined) return;
    const point = {
      x: event.x - left,
      y: event.y - top
    };
    const pointerVpt = this.canvas.restorePointerVpt(point);
    item.left = pointerVpt.x - item.width / 2;
    item.top = pointerVpt.y;
    this.canvas.add(item);
    this.canvas.requestRenderAll();
  }
}

const noop = () => {};
const Context = createContext({
  editor: null,
  canvas: null,
  workSpace: null,
  drawMode: '',
  selectMode: '',
  selectIds: [],
  selectOneType: '',
  selectActive: [],
  show: false,
  mainUrl: '',
  isClipImage: false,
  clipRawIndex: null,
  clipImageId: null,
  setClipRawIndex: noop,
  setClipImageId: noop,
  setIsClipImage: noop,
  setMainUrl: noop,
  setSelectOneType: noop,
  setSelectActive: noop,
  setSelectMode: noop,
  setSelectIds: noop,
  setDrawMode: noop,
  setCanvas: noop,
  setEditor: noop,
  setWorkSpace: noop,
  setShow: noop
});
const CanvasProvider = ({
  children
}) => {
  const [canvas, setCanvas] = useState(null);
  const [editor, setEditor] = useState(null);
  const [workSpace, setWorkSpace] = useState(null);
  const [drawMode, setDrawMode] = useState('default');
  const [selectMode, setSelectMode] = useState('');
  const [selectIds, setSelectIds] = useState([]);
  const [selectOneType, setSelectOneType] = useState('');
  const [selectActive, setSelectActive] = useState([]);
  const [show, setShow] = useState(false);
  const [mainUrl, setMainUrl] = useState('');
  const [isClipImage, setIsClipImage] = useState(false);
  const [clipImageId, setClipImageId] = useState(null);
  const [clipRawIndex, setClipRawIndex] = useState(null);
  const context = {
    canvas,
    editor,
    workSpace,
    drawMode,
    selectMode,
    setSelectMode,
    selectIds,
    setSelectIds,
    selectOneType,
    setSelectOneType,
    selectActive,
    setSelectActive,
    setDrawMode,
    setWorkSpace,
    setCanvas,
    setEditor,
    show,
    setShow,
    mainUrl,
    setMainUrl,
    isClipImage,
    setIsClipImage,
    clipImageId,
    setClipImageId,
    clipRawIndex,
    setClipRawIndex
  };
  return React.createElement(Context.Provider, {
    value: context
  }, children);
};

var style = {"size":"_index-module__size__25rEe","ratio":"_index-module__ratio__Z8umb","title":"_index-module__title__28Pa_","content":"_index-module__content__2c1fu"};

var customInputStyle = {"customInput":"_index-module__customInput__1bhWg","title":"_index-module__title__9y0uL","inputWrap":"_index-module__inputWrap__3aQ84"};

const Input = props => {
  const {
    title,
    afterText,
    value,
    onChange
  } = props;
  return React.createElement("div", {
    className: customInputStyle.customInput
  }, React.createElement("div", {
    className: customInputStyle.title
  }, title), React.createElement("div", {
    className: customInputStyle.inputWrap
  }, React.createElement("input", {
    onChange: onChange,
    value: value,
    type: "text"
  }), afterText ? React.isValidElement(afterText) ? afterText : React.createElement("span", null, afterText) : ''));
};

const useAttr = () => {
  const {
    canvas
  } = useContext(Context);
  const getActiveObject = () => {
    if (!canvas) return;
    const activeObject = canvas === null || canvas === void 0 ? void 0 : canvas.getActiveObject();
    if (!activeObject) return;
    return activeObject;
  };
  const setAttr = attr => {
    if (!canvas) return;
    const activeObject = getActiveObject();
    if (!activeObject) return;
    activeObject.set(attr);
    canvas.renderAll();
  };
  return {
    getActiveObject,
    setAttr
  };
};

const lockAttrs = ['lockMovementX', 'lockMovementY', 'lockRotation', 'lockScalingX', 'lockScalingY'];
const isControlsInRatioVisible = object => {
  const controls = object._controlsVisibility;
  return !!(controls && !controls.mb && !controls.ml && !controls.mr && !controls.mt);
};
const useLock = () => {
  const {
    canvas
  } = useContext(Context);
  const {
    getActiveObject
  } = useAttr();
  const changeOwnLock = useCallback((isLock, object) => {
    let activeObject = null;
    if (object) {
      activeObject = object;
    } else {
      activeObject = getActiveObject();
    }
    if (!activeObject) return;
    activeObject.hasControls = isLock;
    lockAttrs.forEach(key => {
      activeObject[key] = !isLock;
    });
    activeObject.selectable = isLock;
    canvas === null || canvas === void 0 ? void 0 : canvas.renderAll();
  }, [canvas, getActiveObject]);
  const changeInRatioLock = useCallback((isLock, object) => {
    let activeObject = null;
    if (object) {
      activeObject = object;
    } else {
      activeObject = getActiveObject();
    }
    if (!activeObject) return;
    activeObject.setControlsVisibility({
      mt: isLock,
      mb: isLock,
      ml: isLock,
      mr: isLock
    });
    canvas === null || canvas === void 0 ? void 0 : canvas.renderAll();
  }, [canvas, getActiveObject]);
  return {
    changeOwnLock,
    changeInRatioLock
  };
};

function subtract(num1, num2) {
  const num1Digits = (num1.toString().split('.')[1] || '').length;
  const num2Digits = (num2.toString().split('.')[1] || '').length;
  const baseNum = Math.pow(10, Math.max(num1Digits, num2Digits));
  return (multiply(num1, baseNum) - multiply(num2, baseNum)) / baseNum;
}
function multiply(num1, num2) {
  const num1String = num1.toString();
  const num2String = num2.toString();
  const num1Digits = (num1String.split('.')[1] || '').length;
  const num2Digits = (num2String.split('.')[1] || '').length;
  const baseNum = Math.pow(10, num1Digits + num2Digits);
  return Number(num1String.replace('.', '')) * Number(num2String.replace('.', '')) / baseNum;
}
function divide(num1, num2) {
  const num1String = num1.toString();
  const num2String = num2.toString();
  const num1Digits = (num1String.split('.')[1] || '').length;
  const num2Digits = (num2String.split('.')[1] || '').length;
  const baseNum = Math.pow(10, num1Digits + num2Digits);
  const n1 = multiply(num1, baseNum);
  const n2 = multiply(num2, baseNum);
  return Number(n1) / Number(n2);
}
function floatRound(num, len = 0) {
  const n = divide(Math.round(multiply(num, Math.pow(10, len))), Math.pow(10, len));
  return n.toFixed(len);
}

const Size = ({
  getActiveObject,
  showRation,
  isWorkSpace
}) => {
  const {
    canvas,
    workSpace
  } = useContext(Context);
  const {
    changeInRatioLock
  } = useLock();
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [lockRatio, setLockRatio] = useState(false);
  useEffect(() => {
    getAttr();
  }, [canvas, getActiveObject]);
  useEffect(() => {
    if (!canvas) return;
    canvas.on('object:modified', getAttr);
    return () => {
      canvas.off('object:modified', getAttr);
    };
  }, [canvas]);
  const getAttr = () => {
    const activeObject = getActiveObject();
    if (!activeObject) return;
    setWidth(floatRound(activeObject.width));
    setHeight(floatRound(activeObject.height));
    setLockRatio(isControlsInRatioVisible(activeObject));
  };
  const onWidthChange = value => {
    const activeObject = getActiveObject();
    if (!activeObject) return;
    value = retainNumber(value);
    if (isWorkSpace) {
      workSpace === null || workSpace === void 0 ? void 0 : workSpace.setSize(value, height);
      setWidth(value);
      return;
    }
    activeObject.set({
      width: +value
    });
    canvas === null || canvas === void 0 ? void 0 : canvas.renderAll();
    setWidth(value);
  };
  const onHeightChange = value => {
    const activeObject = getActiveObject();
    if (!activeObject) return;
    value = retainNumber(value);
    if (isWorkSpace) {
      workSpace === null || workSpace === void 0 ? void 0 : workSpace.setSize(width, value);
      setHeight(value);
      return;
    }
    activeObject.set({
      height: +value
    });
    canvas === null || canvas === void 0 ? void 0 : canvas.renderAll();
    setHeight(value);
  };
  const changeLock = () => {
    changeInRatioLock(lockRatio);
    setLockRatio(prevState => !prevState);
  };
  return React.createElement("div", {
    className: style.size
  }, React.createElement(Input, {
    afterText: '\u50CF\u7D20',
    title: '\u5BBD\u5EA6',
    value: width,
    onChange: e => onWidthChange(e.target.value)
  }), React.createElement(Input, {
    afterText: '\u50CF\u7D20',
    title: '\u9AD8\u5EA6',
    value: height,
    onChange: e => onHeightChange(e.target.value)
  }), showRation ? React.createElement("div", {
    className: style.ratio
  }, React.createElement("div", {
    className: style.title
  }, "\u6BD4\u4F8B"), React.createElement("div", {
    className: style.content,
    onClick: changeLock
  }, React.createElement("img", {
    src: lockRatio ? "https://ossprod.jrdaimao.com/file/1690955813239228.svg" : "https://ossprod.jrdaimao.com/file/1690425288688481.svg",
    alt: ""
  }))) : React.createElement("div", {
    className: style.ratio
  }));
};

var style$1 = {"workSpaceAttr":"_index-module__workSpaceAttr__2plhR","base":"_index-module__base__35ejr","division":"_index-module__division__2ohzj","title":"_index-module__title__J5Xgh","colorPicker":"_index-module__colorPicker__3uPze"};

var style$2 = {"position":"_index-module__position__3JjkO","rotate":"_index-module__rotate__pZ0Ae","title":"_index-module__title__ivS8M","content":"_index-module__content__25bwl"};

const Position = () => {
  const {
    canvas
  } = useContext(Context);
  const {
    getActiveObject,
    setAttr
  } = useAttr();
  const [rotate, setRotate] = useState('0');
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  useEffect(() => {
    getAttr();
  }, [canvas]);
  useEffect(() => {
    if (!canvas) return;
    canvas.on('object:modified', getAttr);
    return () => {
      canvas.off('object:modified', getAttr);
    };
  }, [canvas]);
  const getAttr = () => {
    const activeObject = getActiveObject();
    if (!activeObject) return;
    setX(floatRound(activeObject.left || 0));
    setY(floatRound(activeObject.top || 0));
    setRotate(floatRound(activeObject.angle || 0));
  };
  const onRotateChange = value => {
    const activeObject = getActiveObject();
    if (!activeObject) return;
    activeObject.rotate(+value);
    canvas === null || canvas === void 0 ? void 0 : canvas.renderAll();
    setRotate(value);
  };
  const onPositionXChange = value => {
    value = retainNumber(value);
    setAttr({
      left: +value
    });
    setX(value);
  };
  const onPositionYChange = value => {
    value = retainNumber(value);
    setAttr({
      top: +value
    });
    setY(value);
  };
  return React.createElement("div", {
    className: style$2.position
  }, React.createElement(Input, {
    afterText: '\u50CF\u7D20',
    value: x,
    onChange: e => onPositionXChange(e.target.value),
    title: 'X'
  }), React.createElement(Input, {
    afterText: '\u50CF\u7D20',
    value: y,
    onChange: e => onPositionYChange(e.target.value),
    title: 'Y'
  }), React.createElement("div", {
    className: style$2.rotate
  }, React.createElement("div", {
    className: style$2.title
  }, "\u65CB\u8F6C"), React.createElement("div", {
    className: style$2.content
  }, React.createElement("input", {
    value: rotate,
    onChange: e => onRotateChange(retainNumber(e.target.value)),
    type: "text"
  }))));
};

var style$3 = {"transparent":"_index-module__transparent__3zB_Q","title":"_index-module__title__1TUJG","reverseWrap":"_index-module__reverseWrap__2IPAY","visible":"_index-module__visible__37zRW","content":"_index-module__content__1EJOQ"};

const Transparent = () => {
  const {
    canvas
  } = useContext(Context);
  const {
    getActiveObject,
    setAttr
  } = useAttr();
  const [opacity, setOpacity] = useState(0);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const activeObject = getActiveObject();
    if (!activeObject) return;
    setOpacity(multiply(activeObject.opacity, 100));
    setVisible(activeObject.visible || false);
  }, [getActiveObject]);
  const onOpacityChange = value => {
    if (value > 100) {
      value = 100;
    }
    value = retainNumber(value);
    setAttr({
      opacity: divide(value, 100)
    });
    setOpacity(+value);
  };
  const onFlipChange = value => {
    const activeObject = getActiveObject();
    if (!activeObject) return;
    activeObject.set(`flip${value}`, !activeObject[`flip${value}`]).setCoords();
    canvas === null || canvas === void 0 ? void 0 : canvas.renderAll();
  };
  const onVisibleChange = () => {
    setAttr({
      visible: !visible
    });
    setVisible(prevState => !prevState);
  };
  return React.createElement("div", {
    className: style$3.transparent
  }, React.createElement("div", {
    className: customInputStyle.customInput
  }, React.createElement("div", {
    className: customInputStyle.title
  }, "\u4E0D\u900F\u660E\u5EA6"), React.createElement("div", {
    className: customInputStyle.inputWrap
  }, React.createElement("input", {
    style: {
      width: 48
    },
    onChange: e => onOpacityChange(e.target.value),
    value: opacity,
    type: "text"
  }), React.createElement("span", null, "%"))), React.createElement("div", {
    className: style$3.reverse
  }, React.createElement("div", {
    className: style$3.title
  }, "\u7FFB\u8F6C"), React.createElement("div", {
    className: style$3.reverseWrap
  }, React.createElement("div", {
    onClick: () => onFlipChange('X')
  }, React.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690428298144872.svg",
    alt: ""
  })), React.createElement("div", {
    onClick: () => onFlipChange('Y')
  }, React.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690428330458222.svg",
    alt: ""
  })))), React.createElement("div", {
    className: style$3.visible
  }, React.createElement("div", {
    className: style$3.title
  }, "\u53EF\u89C1\u6027"), React.createElement("div", {
    className: style$3.content,
    onClick: onVisibleChange
  }, visible ? React.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690428533888278.svg",
    alt: ""
  }) : React.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690883271867109.svg",
    alt: ""
  }))));
};

const usePageAlign = () => {
  const {
    canvas,
    workSpace
  } = useContext(Context);
  const setPosition = useCallback((value, target) => {
    if (!canvas) return;
    let activeObject;
    if (target) {
      activeObject = target;
    } else {
      activeObject = canvas.getActiveObject();
    }
    if (!activeObject) return console.log('no allow activeObject');
    const {
      left,
      top
    } = value;
    const pos = {};
    if (!isUndef(left)) pos.left = left;
    if (!isUndef(top)) pos.top = top;
    activeObject.set(pos);
    canvas.renderAll();
  }, [canvas, workSpace]);
  const left = () => {
    setPosition({
      left: 0
    });
  };
  const top = () => {
    setPosition({
      top: 0
    });
  };
  const alignCenter = () => {
    if (!canvas || !workSpace) return;
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    const width = (workSpace === null || workSpace === void 0 ? void 0 : workSpace.width) || 0;
    setPosition({
      left: (width - activeObject.width * activeObject.scaleX) / 2
    });
  };
  const middleCenter = () => {
    if (!canvas || !workSpace) return;
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    const height = (workSpace === null || workSpace === void 0 ? void 0 : workSpace.height) || 0;
    setPosition({
      top: (height - activeObject.height * activeObject.scaleY) / 2
    });
  };
  const right = () => {
    if (!canvas || !workSpace) return;
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    const width = (workSpace === null || workSpace === void 0 ? void 0 : workSpace.width) || 0;
    setPosition({
      left: width - activeObject.width * activeObject.scaleX
    });
  };
  const bottom = () => {
    if (!canvas || !workSpace) return;
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    const height = (workSpace === null || workSpace === void 0 ? void 0 : workSpace.height) || 0;
    setPosition({
      top: height - activeObject.height * activeObject.scaleY
    });
  };
  return {
    left,
    top,
    alignCenter,
    middleCenter,
    right,
    bottom
  };
};

const alignTypeList = [{
  icon: 'https://ossprod.jrdaimao.com/file/1690799178088909.svg',
  activeIcon: 'https://ossprod.jrdaimao.com/file/1690802921403421.svg',
  title: '左对齐',
  key: 'left'
}, {
  icon: 'https://ossprod.jrdaimao.com/file/1690429259779371.svg',
  activeIcon: 'https://ossprod.jrdaimao.com/file/1690799287561375.svg',
  title: '顶对齐',
  key: 'top'
}, {
  icon: 'https://ossprod.jrdaimao.com/file/1690429281715912.svg',
  activeIcon: 'https://ossprod.jrdaimao.com/file/1690799296804215.svg',
  title: '左右居中对齐',
  key: 'alignCenter'
}, {
  icon: 'https://ossprod.jrdaimao.com/file/1690429302732969.svg',
  activeIcon: 'https://ossprod.jrdaimao.com/file/169079930793443.svg',
  title: '上下居中对齐',
  key: 'middleCenter'
}, {
  icon: 'https://ossprod.jrdaimao.com/file/1690429331770745.svg',
  activeIcon: 'https://ossprod.jrdaimao.com/file/1690799316293458.svg',
  title: '右对齐',
  key: 'right'
}, {
  icon: 'https://ossprod.jrdaimao.com/file/169042936033629.svg',
  activeIcon: 'https://ossprod.jrdaimao.com/file/1690799325119567.svg',
  title: '底对齐',
  key: 'bottom'
}];

var pageAlignStyle = {"pageAlign":"_index-module__pageAlign__1MOiB","title":"_index-module__title__QElwi","shareShapeList":"_index-module__shareShapeList__2raEw","shareShapeListItem":"_index-module__shareShapeListItem__3uaCf"};

const PageAlign = () => {
  const alignFunc = usePageAlign();
  const onClick = item => {
    var _alignFunc$item$key;
    (_alignFunc$item$key = alignFunc[item.key]) === null || _alignFunc$item$key === void 0 ? void 0 : _alignFunc$item$key.call(alignFunc);
  };
  return React.createElement("div", {
    className: pageAlignStyle.pageAlign
  }, React.createElement("div", {
    className: pageAlignStyle.title
  }, "\u9875\u9762\u5BF9\u9F50"), React.createElement("div", {
    className: pageAlignStyle.shareShapeList
  }, alignTypeList.map(item => {
    return React.createElement("div", {
      onClick: () => onClick(item),
      key: item.key,
      className: pageAlignStyle.shareShapeListItem
    }, React.createElement("img", {
      src: item.icon,
      alt: ""
    }), React.createElement("img", {
      src: item.activeIcon,
      alt: ""
    }), React.createElement("span", null, item.title));
  })));
};

const coverOrderList = [{
  icon: 'https://ossprod.jrdaimao.com/file/1690802981178203.svg',
  activeIcon: 'https://ossprod.jrdaimao.com/file/1690430789758861.svg',
  title: '上移一层',
  key: 'up'
}, {
  icon: 'https://ossprod.jrdaimao.com/file/1690430798470387.svg',
  activeIcon: 'https://ossprod.jrdaimao.com/file/1690803025753461.svg',
  title: '移到顶层',
  key: 'upTop'
}, {
  icon: 'https://ossprod.jrdaimao.com/file/1690430807961422.svg',
  activeIcon: 'https://ossprod.jrdaimao.com/file/1690803032757409.svg',
  title: '下移一层',
  key: 'down'
}, {
  icon: 'https://ossprod.jrdaimao.com/file/1690430815475268.svg',
  activeIcon: 'https://ossprod.jrdaimao.com/file/1690803040084442.svg',
  title: '移到底层',
  key: 'downTop'
}];

const userOrder = () => {
  const {
    canvas,
    editor
  } = useContext(Context);
  const changeOrder = useCallback((funcKey, object) => {
    var _activeObject$funcKey, _activeObject;
    if (!canvas) return;
    let activeObject;
    if (object) {
      activeObject = object;
    } else {
      const actives = canvas.getActiveObjects();
      if (actives && actives.length === 1) {
        activeObject = canvas.getActiveObjects()[0];
      }
    }
    if (!activeObject) return;
    activeObject && ((_activeObject$funcKey = (_activeObject = activeObject)[funcKey]) === null || _activeObject$funcKey === void 0 ? void 0 : _activeObject$funcKey.call(_activeObject));
    canvas.renderAll();
    editor === null || editor === void 0 ? void 0 : editor.workspaceSendToBack();
  }, [canvas, editor]);
  const up = useCallback(object => {
    changeOrder('bringForward', object);
  }, [canvas, editor]);
  const upTop = useCallback(object => {
    changeOrder('bringToFront', object);
  }, [canvas, editor]);
  const down = useCallback(object => {
    changeOrder('sendBackwards', object);
  }, [canvas, editor]);
  const downTop = useCallback(object => {
    changeOrder('sendToBack', object);
  }, [canvas, editor]);
  return {
    up,
    upTop,
    down,
    downTop
  };
};

var style$4 = {"coverOrder":"_index-module__coverOrder__h4hzi","coverOrderTitle":"_index-module__coverOrderTitle__2k_YY"};

const CoverOrder = () => {
  const orderFunc = userOrder();
  const changeCoverOrder = item => {
    var _orderFunc$item$key;
    (_orderFunc$item$key = orderFunc[item.key]) === null || _orderFunc$item$key === void 0 ? void 0 : _orderFunc$item$key.call(orderFunc);
  };
  return React.createElement("div", {
    className: style$4.coverOrder
  }, React.createElement("div", {
    className: style$4.coverOrderTitle
  }, "\u56FE\u5C42\u987A\u5E8F"), React.createElement("div", {
    className: pageAlignStyle.shareShapeList
  }, coverOrderList.map(item => {
    return React.createElement("div", {
      onClick: () => changeCoverOrder(item),
      key: item.key,
      className: pageAlignStyle.shareShapeListItem
    }, React.createElement("img", {
      src: item.icon,
      alt: ""
    }), React.createElement("img", {
      src: item.activeIcon,
      alt: ""
    }), React.createElement("span", null, item.title));
  })));
};

const ImageSpaceAttr = () => {
  const {
    getActiveObject
  } = useAttr();
  return React.createElement("div", {
    className: style$1.workSpaceAttr
  }, React.createElement("div", {
    className: style$1.base
  }, React.createElement("div", null, React.createElement(Size, {
    getActiveObject: getActiveObject,
    showRation: true
  })), React.createElement("div", null, React.createElement(Position, null)), React.createElement("div", null, React.createElement(Transparent, null))), React.createElement("div", {
    className: style$1.division
  }), React.createElement(PageAlign, null), React.createElement("div", {
    className: style$1.division
  }), React.createElement(CoverOrder, null));
};

var style$5 = {"textArea":"_index-module__textArea__2bdXD","title":"_index-module__title__24HCb","fontFamily":"_index-module__fontFamily__3y7kb","size":"_index-module__size__3QZ4S","color":"_index-module__color__3P8p7","colorContent":"_index-module__colorContent__30T-A","style":"_index-module__style__vb8BV","alignGroup":"_index-module__alignGroup__1S5zb","alignGroupActive":"_index-module__alignGroupActive__ZYMEy","styleGroup":"_index-module__styleGroup__1oIDh","styleGroupActive":"_index-module__styleGroupActive__2_4Pb","fixColorPicker":"_index-module__fixColorPicker__1aFhU","disabledSelect":"_index-module__disabledSelect__2Wd1K","select":"_index-module__select__1s-z0","colorPicker":"_index-module__colorPicker__pHtr_"};

const DropdownIndicator = () => {
  return React.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690959702767983.svg",
    alt: ""
  });
};
const ReactSelectStyles = {
  singleValue: provided => ({
    ...provided,
    color: '#ADADB3',
    fontWeight: 600
  }),
  menuList: provided => ({
    ...provided,
    background: '#1C1D29'
  }),
  option: provided => ({
    ...provided,
    background: '#1C1D29',
    color: '#ADADB3',
    height: '32px',
    lineHeight: '32px',
    padding: '0px 11px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    '&:hover': {
      color: '#fff',
      background: '#2C375E'
    }
  }),
  container: provided => ({
    ...provided,
    width: '100%'
  }),
  control: () => ({
    width: '100%',
    cursor: 'pointer',
    paddingRight: 8,
    boxSizing: 'border-box',
    flex: 1,
    height: 28,
    borderRadius: 4,
    background: '#232634',
    color: '#ADADB3',
    fontSize: 14,
    fontWeight: 600,
    display: 'flex'
  })
};

var styles$1 = {"inputNumber":"_index-module__inputNumber__2oJGQ","control":"_index-module__control__1MYtS"};

const InputNumber = ({
  value,
  onChange: callback
}) => {
  const [number, setNumber] = useState(value);
  const last = useRef();
  last.current = number;
  const inputRef = useRef();
  useEffect(() => {
    setNumber(value);
  }, [value]);
  useEffect(() => {
    var _inputRef$current;
    (_inputRef$current = inputRef.current) === null || _inputRef$current === void 0 ? void 0 : _inputRef$current.addEventListener('keydown', keyDownChange);
    return () => {
      var _inputRef$current2;
      (_inputRef$current2 = inputRef.current) === null || _inputRef$current2 === void 0 ? void 0 : _inputRef$current2.removeEventListener('keydown', keyDownChange);
    };
  }, [value, callback]);
  const keyDownChange = e => {
    if (e.key === 'ArrowUp') {
      add();
    } else if (e.key === 'ArrowDown') {
      sub();
    }
  };
  const onNumberChange = e => {
    const value = retainNumber(e.target.value);
    setNumber(value);
    callback(value);
  };
  const add = () => {
    const n = +last.current + 1;
    setNumber(n);
    callback(n);
  };
  const sub = () => {
    if (last.current <= 12) return;
    const n = +last.current - 1;
    setNumber(n);
    callback(n);
  };
  return React.createElement("div", {
    className: styles$1.inputNumber
  }, React.createElement("input", {
    ref: inputRef,
    value: number,
    onChange: onNumberChange
  }), React.createElement("span", {
    className: styles$1.control
  }, React.createElement("span", {
    onClick: add
  }, React.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690962892247333.svg",
    alt: ""
  }), React.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1691034645816626.svg",
    alt: ""
  })), React.createElement("span", {
    onClick: sub
  }, React.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690962924824666.svg",
    alt: ""
  }), React.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1691035025689960.svg",
    alt: ""
  }))));
};

const textAlignList = [{
  src: 'https://ossprod.jrdaimao.com/file/1690963862052534.svg',
  activeSrc: 'https://ossprod.jrdaimao.com/file/1690963932538814.svg',
  key: 'left'
}, {
  src: 'https://ossprod.jrdaimao.com/file/1690963869720196.svg',
  activeSrc: 'https://ossprod.jrdaimao.com/file/1690963940992258.svg',
  key: 'center'
}, {
  src: 'https://ossprod.jrdaimao.com/file/1690963877465292.svg',
  activeSrc: 'https://ossprod.jrdaimao.com/file/1690963948610334.svg',
  key: 'right'
}, {
  src: 'https://ossprod.jrdaimao.com/file/1690963884592828.svg',
  activeSrc: 'https://ossprod.jrdaimao.com/file/1690963958787177.svg',
  key: 'justify'
}];
const textStyleList = [{
  label: '常规',
  value: 'normal'
}, {
  label: '粗体',
  value: 600
}];

const getFontManage = () => {
  return Promise.resolve([{
    "id": 1,
    "fontlibName": "雨落南泥行楷",
    "key": "ylnnxk",
    "fontlibfile": "https://osstest.jrdaimao.com/file/1684482933910660.ttf",
    "fontImgUrl": "https://osstest.jrdaimao.com/file/1684482969861534.jpg",
    "operator": "",
    "createdAt": "2023-05-19T07:56:12.000Z",
    "updatedAt": "2023-05-19T07:56:12.000Z"
  }, {
    "id": 2,
    "fontlibName": "汉仪孙尚香繁体",
    "key": "hyssxft",
    "fontlibfile": "https://osstest.jrdaimao.com/file/168448426103890.ttf",
    "fontImgUrl": "https://osstest.jrdaimao.com/file/1684484313329597.jpg",
    "operator": "",
    "createdAt": "2023-05-19T08:18:35.000Z",
    "updatedAt": "2023-05-19T08:18:35.000Z"
  }, {
    "id": 3,
    "fontlibName": "DINBLACK",
    "key": "dinblack",
    "fontlibfile": "https://osstest.jrdaimao.com/file/1684926716437711.otf",
    "fontImgUrl": "https://osstest.jrdaimao.com/file/1684926724428125.jpg",
    "operator": "管理员",
    "createdAt": "2023-05-24T11:12:15.000Z",
    "updatedAt": "2023-05-24T11:12:15.000Z"
  }, {
    "id": 4,
    "fontlibName": "Bebas-Regular",
    "key": "bebasRegular",
    "fontlibfile": "https://osstest.jrdaimao.com/file/1684932496362386.ttf",
    "fontImgUrl": "https://osstest.jrdaimao.com/file/1684932519267667.jpg",
    "operator": "管理员",
    "createdAt": "2023-05-24T12:48:43.000Z",
    "updatedAt": "2023-05-24T12:48:43.000Z"
  }, {
    "id": 6,
    "fontlibName": "汉仪小松激浪体",
    "key": "hyxsjl",
    "fontlibfile": "https://osstest.jrdaimao.com/file/1685001304598186.ttf",
    "fontImgUrl": "https://osstest.jrdaimao.com/file/1685001311019992.jpg",
    "operator": "管理员",
    "createdAt": "2023-05-25T07:55:34.000Z",
    "updatedAt": "2023-05-30T08:58:25.000Z"
  }, {
    "id": 13,
    "fontlibName": "叶子",
    "key": "yezi",
    "fontlibfile": "https://osstest.jrdaimao.com/file/168543899068477.ttf",
    "fontImgUrl": "https://osstest.jrdaimao.com/file/1685438995766786.jpg",
    "operator": "管理员",
    "createdAt": "2023-05-30T09:30:14.000Z",
    "updatedAt": "2023-05-30T09:30:14.000Z"
  }, {
    "id": 14,
    "fontlibName": "Aa马克",
    "key": "aamk",
    "fontlibfile": "https://osstest.jrdaimao.com/file/1685439688863813.ttf",
    "fontImgUrl": "https://osstest.jrdaimao.com/file/1685439704617823.jpg",
    "operator": "管理员",
    "createdAt": "2023-05-30T09:41:46.000Z",
    "updatedAt": "2023-05-30T09:41:46.000Z"
  }, {
    "id": 15,
    "fontlibName": "Egosta",
    "key": "egosta",
    "fontlibfile": "https://osstest.jrdaimao.com/file/1685439871684955.ttf",
    "fontImgUrl": "https://osstest.jrdaimao.com/file/1685439875954916.jpg",
    "operator": "管理员",
    "createdAt": "2023-05-30T09:44:45.000Z",
    "updatedAt": "2023-05-30T09:44:45.000Z"
  }, {
    "id": 16,
    "fontlibName": "汉仪永字七巧板",
    "key": "hyyzqqb",
    "fontlibfile": "https://osstest.jrdaimao.com/file/1685440650813535.ttf",
    "fontImgUrl": "https://osstest.jrdaimao.com/file/1685440825332319.jpg",
    "operator": "管理员",
    "createdAt": "2023-05-30T10:00:28.000Z",
    "updatedAt": "2023-05-30T10:00:28.000Z"
  }, {
    "id": 17,
    "fontlibName": "阿里妈妈数黑体",
    "key": "alimamasht",
    "fontlibfile": "https://osstest.jrdaimao.com/file/1688626758184870.ttf",
    "fontImgUrl": "https://osstest.jrdaimao.com/file/1688626774033978.jpg",
    "operator": "管理员",
    "createdAt": "2023-07-06T06:59:37.000Z",
    "updatedAt": "2023-07-06T06:59:37.000Z"
  }]);
};

const GeneralTextList = ['serif'];
const Font = new Map();
let globalFontList = null;
const filterToText = list => {
  if (!Array.isArray(list)) return [];
  return list.filter(item => item.type === 'i-text' && !GeneralTextList.includes(item.fontFamily));
};
const useChangeFontFamily = () => {
  const {
    setAttr
  } = useAttr();
  const {
    setLoading
  } = useContext(Context$1);
  const [fontList, setFontList] = useState([]);
  const [fontLoaded, setFontLoaded] = useState(false);
  const useFontListLast = useRef();
  useFontListLast.current = fontList;
  useEffect(() => {
    (async () => {
      let list = [];
      if (globalFontList) {
        list = globalFontList;
      } else {
        const res = await getFontManage();
        list = res.map(item => {
          return {
            value: item.key,
            label: item.fontlibName,
            url: item.fontlibfile
          };
        });
      }
      setFontLoaded(true);
      globalFontList = list;
      setFontList(list);
    })();
  }, []);
  const runChange = useCallback(item => {
    if (Font.has(item.name)) {
      setAttr({
        fontFamily: item.name
      });
      return;
    }
    setLoading(true);
    const styleContent = `
     @font-face {
      font-family: ${item.name};
      src: url('${item.src}');
     }`;
    const style = document.createElement('style');
    style.innerHTML = styleContent;
    document.body.appendChild(style);
    const font = new FontFaceObserver(item.name);
    return font.load(item.name, 2000000).then(function () {
      Font.set(item.name, true);
      setLoading(false);
      console.log('Font is available');
      setAttr({
        fontFamily: item.name
      });
    }, function (e) {
      setLoading(false);
      document.body.removeChild(style);
      console.log('Font is not available', e);
    });
  }, [setAttr]);
  const loadFont = useCallback(objectsData => {
    if (!objectsData) return Promise.resolve();
    const textList = filterToText(objectsData);
    let style = '';
    textList.forEach(item => {
      useFontListLast.current.forEach(r => {
        if (item.fontFamily === r.value && !Font.has(r.value)) {
          style += `@font-face {font-family: ${r.value};src: url('${r.url}');}`;
        }
      });
    });
    if (style === '') return Promise.resolve();
    const el = document.createElement('style');
    el.innerHTML = style;
    document.body.appendChild(el);
    const fontFamiliesAll = textList.map(item => {
      return new Promise((resolve, reject) => {
        const font = new FontFaceObserver(item.fontFamily);
        font.load(item.fontFamily, 2000000).then(() => {
          Font.set(item.fontFamily, true);
          resolve();
        }).catch(err => {
          reject();
          console.log('loadFont', err);
        });
      });
    });
    return Promise.all(fontFamiliesAll);
  }, [fontList, fontLoaded]);
  return {
    fontList,
    runChange,
    loadFont,
    fontLoaded
  };
};

const ColorPicker = SketchPicker;
const TextAttr = () => {
  const {
    getActiveObject,
    setAttr
  } = useAttr();
  const {
    fontList,
    runChange
  } = useChangeFontFamily();
  const [fontSize, setFontSize] = useState('12');
  const [color, setColor] = useState('#000000');
  const [visible, setVisible] = useState(false);
  const [fontWeight, setFontWeight] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [incline, setIncline] = useState(false);
  const [align, setAlign] = useState('');
  const [fontStyle, setFontStyle] = useState(null);
  const [fontFamily, setFontFamily] = useState(null);
  useEffect(() => {
    const activeObject = getActiveObject();
    if (!activeObject) return;
    setFontSize(activeObject.get('fontSize'));
    setColor(activeObject.get('fill'));
    setUnderline(activeObject.get('underline'));
    setAlign(activeObject.get('textAlign'));
    setIncline(activeObject.get('fontStyle') === 'italic');
    const fontWeight = activeObject.get('fontWeight');
    const isWeight = fontWeight === 'bold' || fontWeight > 500;
    setFontWeight(isWeight);
    setFontStyle(isWeight ? textStyleList[1] : textStyleList[0]);
  }, [getActiveObject, fontList]);
  useEffect(() => {
    const activeObject = getActiveObject();
    if (!activeObject) return;
    const fontFamily = activeObject.get('fontFamily');
    setFontFamily(fontList.find(item => item.value === fontFamily));
  }, [getActiveObject, fontList]);
  useEffect(() => {
    const el = document.querySelector('#attr-content');
    if (!el) return;
    if (visible) {
      el.style.overflow = 'inherit';
    } else {
      el.style.overflow = 'auto';
    }
    return () => {
      el.style.overflow = 'auto';
    };
  }, [visible]);
  const onFontSizeChange = e => {
    setAttr({
      fontSize: +e
    });
    setFontSize(e);
  };
  const onChangeComplete = e => {
    setAttr({
      fill: e.hex
    });
    setColor(e.hex);
  };
  const onWeightChange = () => {
    if (fontWeight) {
      setAttr({
        fontWeight: 'normal'
      });
    } else {
      setAttr({
        fontWeight: 'bold'
      });
    }
    setFontWeight(prevState => !prevState);
  };
  const onUnderlineChange = () => {
    setAttr({
      underline: !underline
    });
    setUnderline(prevState => !prevState);
  };
  const onAlignChange = item => {
    setAttr({
      textAlign: item.key
    });
    setAlign(item.key);
  };
  const onInclineChange = () => {
    if (incline) {
      setAttr({
        fontStyle: 'normal'
      });
    } else {
      setAttr({
        fontStyle: 'italic'
      });
    }
    setIncline(prevState => !prevState);
  };
  const onFontStyleChange = item => {
    setFontStyle(item);
    setAttr({
      fontWeight: item.value
    });
  };
  const onChangeFontFamily = item => {
    runChange({
      src: item.url,
      name: item.value
    });
  };
  return React.createElement("div", {
    className: style$5.textArea
  }, React.createElement("div", {
    className: style$5.title
  }, "\u6587\u5B57"), React.createElement("div", {
    className: style$5.textAreaContent
  }, React.createElement("div", {
    className: style$5.fontFamily
  }, React.createElement(Select, {
    placeholder: '\u8BF7\u9009\u62E9\u5B57\u4F53',
    onChange: onChangeFontFamily,
    components: {
      DropdownIndicator
    },
    className: style$5.select,
    styles: ReactSelectStyles,
    isSearchable: false,
    options: fontList,
    value: fontFamily
  }), React.createElement("div", {
    className: style$5.size
  }, React.createElement(InputNumber, {
    value: fontSize,
    onChange: onFontSizeChange
  }))), React.createElement("div", {
    className: style$5.color
  }, React.createElement(Select, {
    isDisabled: true,
    onChange: onFontStyleChange,
    value: fontStyle,
    components: {
      DropdownIndicator
    },
    className: `${style$5.select} ${style$5.disabledSelect}`,
    styles: ReactSelectStyles,
    isSearchable: false,
    options: textStyleList
  }), React.createElement("div", {
    className: style$5.colorContent,
    onClick: () => setVisible(prevState => !prevState)
  }, React.createElement("div", {
    style: {
      background: color
    }
  }), React.createElement("span", null, color))), React.createElement("div", {
    className: style$5.style
  }, React.createElement("div", {
    className: style$5.alignGroup
  }, textAlignList.map(item => {
    return React.createElement("div", {
      className: item.key === align ? style$5.alignGroupActive : '',
      onClick: () => onAlignChange(item),
      key: item.key
    }, React.createElement("img", {
      src: item.src,
      alt: ""
    }), React.createElement("img", {
      src: item.activeSrc,
      alt: ""
    }));
  })), React.createElement("div", {
    className: style$5.styleGroup
  }, React.createElement("div", {
    onClick: onWeightChange
  }, React.createElement("div", {
    className: fontWeight ? style$5.styleGroupActive : ''
  }, React.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690964441564257.svg",
    alt: ""
  }), React.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690964450733564.svg",
    alt: ""
  }))), React.createElement("div", {
    onClick: onInclineChange
  }, React.createElement("div", {
    className: incline ? style$5.styleGroupActive : ''
  }, React.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690971550502930.svg",
    alt: ""
  }), React.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690971566471578.svg",
    alt: ""
  }))), React.createElement("div", {
    onClick: onUnderlineChange
  }, React.createElement("div", {
    className: underline ? style$5.styleGroupActive : ''
  }, React.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690964614214969.svg",
    alt: ""
  }), React.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690964622200366.svg",
    alt: ""
  })))))), visible ? React.createElement("div", {
    className: style$5.fixColorPicker
  }, React.createElement(ColorPicker, {
    className: style$5.colorPicker,
    onChangeComplete: onChangeComplete,
    color: color
  })) : null);
};

const TextSpaceAttr = () => {
  const {
    getActiveObject
  } = useAttr();
  return React.createElement("div", {
    className: style$1.workSpaceAttr
  }, React.createElement("div", {
    className: style$1.base
  }, React.createElement("div", null, React.createElement(Size, {
    getActiveObject: getActiveObject,
    showRation: true
  })), React.createElement("div", null, React.createElement(Position, null)), React.createElement("div", null, React.createElement(Transparent, null))), React.createElement("div", {
    className: style$1.division
  }), React.createElement(TextAttr, null), React.createElement("div", {
    className: style$1.division
  }), React.createElement(PageAlign, null), React.createElement("div", {
    className: style$1.division
  }), React.createElement(CoverOrder, null));
};

const attrTabList = [{
  title: '属性',
  key: 'Attr',
  bg: 'https://ossprod.jrdaimao.com/file/1690510922616482.svg'
}, {
  title: '图层',
  key: 'coverage',
  bg: 'https://ossprod.jrdaimao.com/file/1690511949701720.svg'
}];
const attrAreaComponent = {
  'image': ImageSpaceAttr,
  'i-text': TextSpaceAttr
};
const DefaultKey = 'Attr';

const InitState = {
  attrTab: DefaultKey,
  loading: false,
  loadingText: '',
  setLoading: () => {},
  setLoadingText: () => {},
  setAttrTab: () => {}
};
const Context$1 = createContext(InitState);
const EditorProvider = ({
  children
}) => {
  const [attrTab, setAttrTab] = useState(DefaultKey);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('加载中');
  const value = {
    attrTab,
    loading,
    loadingText,
    setLoading,
    setLoadingText,
    setAttrTab
  };
  return React.createElement(Context$1.Provider, {
    value: value
  }, children);
};

const loadImage = src => {
  if (!src) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve();
    };
    img.onerror = err => {
      reject(err);
    };
    img.src = src;
  });
};
function base64ConvertFile(urlData) {
  const arr = urlData.split(',');
  const type = arr[0].match(/:(.*?);/)[1];
  const fileExt = type.split('/')[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], `${uuid()}.` + fileExt, {
    type: type
  });
}

const request = axios.create({
  baseURL: ''
});
request.interceptors.response.use(response => {
  if (response.data.code === '200') {
    return response.data.data;
  }
  return response;
}, error => {
  console.log(error);
});
const fetch = {
  get: (url, params) => {
    return request.get(url, {
      params
    });
  },
  post: (url, data) => {
    return request.post(url, data);
  }
};

const getImageList = data => {
  return fetch.get('/api_editimg/liststock', data);
};
const postUploadImage = file => {
  const form = new FormData();
  form.append('file', file);
  return fetch.post('/api_image/upload', form);
};
const addImageApi = data => {
  return fetch.post('/api_editimg/addstock', data);
};
const saveHistory = data => {
  return fetch.post('/api_editimg/save', data);
};
const delstock = data => {
  return fetch.get('/api_editimg/delstock', data);
};
const getDetail = data => {
  return fetch.get('/api_editimg/detail', data);
};

const useToast = () => {
  const error = useCallback(text => {
    toast(text, {
      duration: 1500,
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff'
      }
    });
  }, []);
  return {
    error
  };
};

const useClipImage = () => {
  const {
    workSpace,
    canvas,
    clipImageId,
    clipRawIndex,
    setIsClipImage
  } = useContext(Context);
  const {
    setLoading
  } = useContext(Context$1);
  const toast = useToast();
  const saveClipImage = useCallback(async () => {
    if (!canvas || !workSpace) return;
    const scale = canvas.getZoom();
    try {
      let image = null;
      let rect = null;
      let currentClipImageIndex = null;
      canvas.getObjects().forEach((item, index) => {
        if (item.id === 'currentClipRect') {
          rect = item;
        }
        if (item.id === clipImageId) {
          image = item;
          currentClipImageIndex = index;
        }
      });
      if (!image || !rect) return;
      setLoading(true);
      const newRect = new fabric.Rect({
        left: rect.left,
        top: rect.top,
        width: rect.getScaledWidth(),
        height: rect.getScaledHeight(),
        absolutePositioned: true
      });
      image.clipPath = newRect;
      const cropped = new Image();
      cropped.crossOrigin = 'anonymous';
      canvas.remove(rect);
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      const base64 = canvas.toDataURL({
        left: newRect.left,
        top: newRect.top,
        width: newRect.width,
        height: newRect.height
      });
      const file = base64ConvertFile(base64);
      const res = await postUploadImage(file);
      cropped.src = res.url;
      workSpace === null || workSpace === void 0 ? void 0 : workSpace.setZoomAuto(scale);
      cropped.onload = function () {
        canvas.remove(image);
        const newImage = new fabric.Image(cropped, {
          crossOrigin: 'anonymous'
        });
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
        });
        canvas.add(newImage);
        if (currentClipImageIndex !== clipRawIndex) {
          while (currentClipImageIndex !== clipRawIndex) {
            newImage.sendBackwards();
            currentClipImageIndex--;
          }
        }
        canvas.renderAll();
        setIsClipImage(false);
        setLoading(false);
      };
    } catch (err) {
      setLoading(false);
      workSpace === null || workSpace === void 0 ? void 0 : workSpace.setZoomAuto(scale);
      cancelClipImage();
      toast.error('裁剪失败，请稍后重试~');
      console.log(err);
    }
  }, [canvas, workSpace, clipImageId, clipRawIndex]);
  const cancelClipImage = useCallback(() => {
    if (!canvas) return;
    let rect = null;
    let clipImage = null;
    let currentClipImageIndex = null;
    canvas.getObjects().forEach((item, index) => {
      if (item.id === 'currentClipRect') {
        rect = item;
      }
      if (item.id === clipImageId) {
        clipImage = item;
        currentClipImageIndex = index;
      }
    });
    if (!clipImage) return;
    if (rect) canvas.remove(rect);
    canvas.remove(clipImage);
    const cloneObject = clipImage.get('cloneObject');
    if (!clipImage) return;
    cloneObject.set({
      id: uuid(),
      sourceSrc: clipImage.sourceSrc,
      rawScaleX: clipImage.scaleX,
      rawScaleY: clipImage.scaleY,
      rectDiffLeft: clipImage.rectDiffLeft,
      rectDiffTop: clipImage.rectDiffTop
    });
    canvas.add(cloneObject);
    if (cloneObject && currentClipImageIndex !== clipRawIndex) {
      while (currentClipImageIndex !== clipRawIndex) {
        cloneObject.sendBackwards();
        currentClipImageIndex--;
      }
    }
    setIsClipImage(false);
    canvas.renderAll();
  }, [canvas, workSpace, clipImageId, clipRawIndex]);
  return {
    saveClipImage,
    cancelClipImage
  };
};

const useEvents = () => {
  const {
    canvas,
    editor,
    workSpace,
    setSelectMode,
    setSelectIds,
    setSelectOneType,
    clipImageId,
    setIsClipImage,
    clipRawIndex,
    isClipImage
  } = useContext(Context);
  const {
    setLoading
  } = useContext(Context$1);
  const {
    cancelClipImage
  } = useClipImage();
  useEffect(() => {
    events.on(Types.SHOW_LOADING, setLoading);
    return () => {
      events.off(Types.SHOW_LOADING, setLoading);
    };
  }, []);
  useEffect(() => {
    if (!canvas) return;
    canvas.on({
      'selection:created': selected,
      'selection:updated': selected,
      'selection:cleared': selected,
      'mouse:wheel': onWheel
    });
    return () => {
      canvas.off({
        'selection:created': selected,
        'selection:updated': selected,
        'selection:cleared': selected,
        'mouse:wheel': onWheel
      });
    };
  }, [canvas, editor]);
  useEffect(() => {
    hotkeys(KeyNames.delete, deleteObjects);
    return () => {
      hotkeys.unbind(KeyNames.delete, deleteObjects);
    };
  }, [canvas, isClipImage, clipImageId]);
  useEffect(() => {
    hotkeys(KeyNames.zoom, onZoom);
    return () => {
      hotkeys.unbind(KeyNames.zoom, onZoom);
    };
  }, [canvas, workSpace]);
  const selected = useCallback(() => {
    if (!canvas) return;
    const actives = canvas.getActiveObjects().filter(item => !(item instanceof fabric.GuideLine));
    if (actives && actives.length === 1) {
      const activeObject = actives[0];
      if (activeObject && activeObject.type === 'image') {
        activeObject.set({
          prevWidth: activeObject.getScaledWidth(),
          prevHeight: activeObject.getScaledHeight()
        });
        canvas.renderAll();
      }
      if (activeObject.type === 'i-text') {
        activeObject.setControlsVisibility({
          mt: false,
          ml: false,
          mb: false,
          mr: false
        });
        canvas.renderAll();
      }
      setSelectMode('one');
      setSelectIds([activeObject.id]);
      setSelectOneType(activeObject.type);
    } else if (actives && actives.length > 1) {
      setSelectMode('multiple');
      setSelectIds(actives.map(item => item.id));
    } else {
      setSelectMode('');
      setSelectIds([]);
      setSelectOneType('');
    }
  }, [canvas, editor]);
  const onZoom = useCallback(e => {
    if (e.code === 'Minus') {
      workSpace === null || workSpace === void 0 ? void 0 : workSpace.small(0.05);
      e.preventDefault();
      e.stopPropagation();
    }
    if (e.code === 'Equal') {
      workSpace === null || workSpace === void 0 ? void 0 : workSpace.big(0.05);
      e.preventDefault();
      e.stopPropagation();
    }
  }, [canvas, workSpace]);
  useEffect(() => {
    if (!canvas) return;
    canvas.on('object:modified', e => {
      var _e$transform;
      const target = (_e$transform = e.transform) === null || _e$transform === void 0 ? void 0 : _e$transform.target;
      if (!target) return;
      if (target.type !== 'image') return;
      if (isUndef(target.rawScaleX) || isUndef(target.rawScaleY)) return;
      const prevWidth = target.prevWidth;
      const prevHeight = target.prevHeight;
      target.set({
        rawScaleX: target.getScaledWidth() / prevWidth * target.rawScaleX,
        rawScaleY: target.getScaledHeight() / prevHeight * target.rawScaleY,
        prevWidth: target.getScaledWidth(),
        prevHeight: target.getScaledHeight()
      });
      canvas.renderAll();
    });
  }, [canvas]);
  const onWheel = useCallback(({
    e
  }) => {
    const delta = e.deltaY;
    if (delta > 0) {
      workSpace === null || workSpace === void 0 ? void 0 : workSpace.small(0.01);
    } else {
      workSpace === null || workSpace === void 0 ? void 0 : workSpace.big(0.01);
    }
    e.preventDefault();
    e.stopPropagation();
  }, [canvas, workSpace]);
  const deleteClipImageAndRect = useCallback(() => {
    if (!canvas) return;
    let rect = null;
    let clipImage = null;
    canvas.getObjects().forEach(item => {
      if (item.id === 'currentClipRect') {
        rect = item;
      }
      if (item.id === clipImageId) {
        clipImage = item;
      }
    });
    if (!rect || !clipImage) return;
    canvas.remove(rect);
    canvas.remove(clipImage);
    canvas.discardActiveObject();
    canvas.renderAll();
    setIsClipImage(false);
  }, [canvas, clipImageId]);
  const deleteObjects = useCallback(() => {
    if (isClipImage) {
      return;
    }
    const activeObject = canvas.getActiveObjects();
    if (activeObject) {
      activeObject.map(item => canvas.remove(item));
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  }, [canvas, isClipImage, clipImageId]);
};

const DefaultWidth = 1024;
const DefaultHeight = 1024;
const DefaultWorkSpaceColor = 'rgba(255,255,255,1)';
class EditorWorkspace {
  constructor(canvas, option) {
    this.canvas = canvas;
    const workspaceEl = document.querySelector('#workspace');
    if (!workspaceEl) {
      throw new Error('element #workspace is missing, plz check!');
    }
    this.workspaceEl = workspaceEl;
    this.workspace = null;
    this.option = option;
    this.dragMode = false;
    this.fill = DefaultWorkSpaceColor;
    this._initBackground();
    this._initWorkspace();
    this._initResizeObserve();
    this._initDring();
  }
  _initBackground() {
    this.canvas.setWidth(this.workspaceEl.offsetWidth);
    this.canvas.setHeight(this.workspaceEl.offsetHeight);
  }
  _initWorkspace() {
    const {
      src,
      canvasData,
      callback
    } = this.option;
    if (canvasData && canvasData.objects.length) {
      const rectOptions = canvasData.objects.find(item => item.type === 'rect');
      this.width = rectOptions.width;
      this.height = this.height = rectOptions.height;
      this.fill = rectOptions.fill;
      this.canvas.loadFromJSON(canvasData, () => {
        const workspace = this.canvas.getObjects().find(item => item.id === 'workspace');
        workspace.set('selectable', false);
        workspace.set('hasControls', false);
        this.setSize(workspace.width, workspace.height);
        this.canvas.renderAll();
        callback();
      });
      return;
    }
    if (!src) {
      this.width = DefaultWidth;
      this.height = DefaultHeight;
      this._initRect();
      return;
    }
    fabric.Image.fromURL(src, img => {
      img.set({
        type: 'image',
        left: 0.5,
        top: 0.5,
        id: 'mainImg'
      });
      this.width = img.width || DefaultWidth;
      this.height = img.height || DefaultHeight;
      this._initRect(img);
    }, {
      crossOrigin: 'anonymous'
    });
  }
  _initRect(img) {
    var _this$option$callback, _this$option;
    const workspace = new fabric.Rect({
      fill: this.fill,
      width: this.width,
      height: this.height,
      id: 'workspace'
    });
    workspace.w = this;
    workspace.set('selectable', false);
    workspace.set('hasControls', false);
    workspace.hoverCursor = 'default';
    this.canvas.add(workspace);
    if (img && img.width && img.height) {
      this.canvas.add(img);
    }
    this.canvas.renderAll();
    this.workspace = workspace;
    (_this$option$callback = (_this$option = this.option).callback) === null || _this$option$callback === void 0 ? void 0 : _this$option$callback.call(_this$option);
    this.auto();
  }
  setBgColor(color) {
    var _this$workspace;
    this.fill = color;
    (_this$workspace = this.workspace) === null || _this$workspace === void 0 ? void 0 : _this$workspace.set({
      fill: color
    });
    this.canvas.renderAll();
  }
  setCenterFromObject(obj) {
    const {
      canvas
    } = this;
    const objCenter = obj.getCenterPoint();
    const viewportTransform = canvas.viewportTransform;
    if (canvas.width === undefined || canvas.height === undefined || !viewportTransform) return;
    viewportTransform[4] = canvas.width / 2 - objCenter.x * viewportTransform[0];
    viewportTransform[5] = canvas.height / 2 - objCenter.y * viewportTransform[3];
    canvas.setViewportTransform(viewportTransform);
    canvas.renderAll();
  }
  _initResizeObserve() {
    const resizeObserver = new ResizeObserver(throttle(() => {
      this.auto();
    }, 50));
    resizeObserver.observe(this.workspaceEl);
  }
  setSize(width, height) {
    this._initBackground();
    this.width = isNumber(width) ? width : +width;
    this.height = isNumber(height) ? height : +height;
    this.workspace = this.canvas.getObjects().find(item => item.id === 'workspace');
    this.workspace.set('width', this.width);
    this.workspace.set('height', this.height);
    this.auto();
  }
  setZoomAuto(scale, cb) {
    const {
      workspaceEl
    } = this;
    const width = workspaceEl.offsetWidth;
    const height = workspaceEl.offsetHeight;
    this.canvas.setWidth(width);
    this.canvas.setHeight(height);
    const center = this.canvas.getCenter();
    this.canvas.setViewportTransform(fabric.iMatrix.concat());
    this.canvas.zoomToPoint(new fabric.Point(center.left, center.top), scale);
    if (!this.workspace) return;
    this.setCenterFromObject(this.workspace);
    this.workspace.clone(cloned => {
      this.canvas.clipPath = cloned;
      this.canvas.requestRenderAll();
    });
    if (cb) cb(this.workspace.left, this.workspace.top);
  }
  getScale() {
    const viewPortWidth = this.workspaceEl.offsetWidth;
    const viewPortHeight = this.workspaceEl.offsetHeight;
    const width = this.width || 0;
    const height = this.height || 0;
    if (!width || !height) return 0;
    if (viewPortWidth / viewPortHeight < width / height) {
      return subtract(divide(viewPortWidth, width), 0.08);
    }
    return subtract(divide(viewPortHeight, height), 0.08);
  }
  big(value) {
    let zoomRatio = this.canvas.getZoom();
    zoomRatio += value || 0.05;
    if (zoomRatio >= 3) {
      zoomRatio = 3;
    }
    events.emit(Types.CHANGE_SCALE, zoomRatio);
    const center = this.canvas.getCenter();
    this.canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoomRatio);
  }
  small(value) {
    let zoomRatio = this.canvas.getZoom();
    zoomRatio -= value || 0.05;
    if (zoomRatio <= 0.1) {
      zoomRatio = 0.1;
    }
    events.emit(Types.CHANGE_SCALE, zoomRatio);
    const center = this.canvas.getCenter();
    this.canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoomRatio < 0 ? 0.01 : zoomRatio);
  }
  auto() {
    const scale = this.getScale();
    if (scale) {
      this.scale = scale;
      events.emit(Types.CHANGE_SCALE, scale);
      this.setZoomAuto(scale);
    }
  }
  one() {
    this.setZoomAuto(0.8 - 0.08);
    this.canvas.requestRenderAll();
  }
  startDring() {
    this.dragMode = true;
    this.canvas.defaultCursor = 'grab';
  }
  endDring() {
    this.dragMode = false;
    this.canvas.defaultCursor = 'default';
  }
  _initDring() {
    const This = this;
    this.canvas.on('mouse:down', function (opt) {
      const evt = opt.e;
      if (evt.altKey || This.dragMode) {
        This.canvas.defaultCursor = 'grabbing';
        This.canvas.discardActiveObject();
        This._setDring();
        this.selection = false;
        this.isDragging = true;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
        this.requestRenderAll();
      }
    });
    this.canvas.on('mouse:move', function (opt) {
      if (this.isDragging) {
        This.canvas.discardActiveObject();
        This.canvas.defaultCursor = 'grabbing';
        const {
          e
        } = opt;
        if (!this.viewportTransform) return;
        const vpt = this.viewportTransform;
        vpt[4] += e.clientX - this.lastPosX;
        vpt[5] += e.clientY - this.lastPosY;
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
        this.requestRenderAll();
      }
    });
    this.canvas.on('mouse:up', function () {
      if (!this.viewportTransform) return;
      this.setViewportTransform(this.viewportTransform);
      this.isDragging = false;
      this.selection = true;
      this.getObjects().forEach(obj => {
        if (obj.id !== 'workspace' && obj.hasControls) {
          obj.selectable = true;
        }
      });
      this.requestRenderAll();
      This.canvas.defaultCursor = 'default';
    });
    this.canvas.on('mouse:wheel', function (opt) {
      const delta = opt.e.deltaY;
      let zoom = this.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      const center = this.getCenter();
      this.zoomToPoint(new fabric.Point(center.left, center.top), zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });
  }
  _setDring() {
    this.canvas.selection = false;
    this.canvas.defaultCursor = 'grab';
    this.canvas.getObjects().forEach(obj => {
      obj.selectable = false;
    });
    this.canvas.renderAll();
    this.canvas.requestRenderAll();
  }
}

const useSave = () => {
  const toast = useToast();
  const {
    editor,
    canvas,
    workSpace,
    mainUrl,
    isClipImage,
    clipImageId,
    clipRawIndex
  } = useContext(Context);
  const {
    cancelClipImage
  } = useClipImage();
  const [saveToImageLoading, setSaveToImageLoading] = useState(false);
  const useLast = useRef({});
  useLast.current = {
    editor,
    mainUrl
  };
  const unloadSendBeacon = useCallback(() => {
    const {
      editor,
      mainUrl
    } = useLast.current;
    if (!editor || !mainUrl) return;
    const dataJson = editor.getJson();
    dataJson.objects = dataJson.objects.filter(item => item.id !== 'currentClipRect');
    const data = JSON.stringify({
      data: dataJson ? JSON.stringify(dataJson) : '',
      imgSrc: mainUrl
    });
    const blob = new Blob([data], {
      type: 'application/json'
    });
    const isPush = navigator.sendBeacon('/api_editimg/save', blob);
    console.log('navigator.sendBeacon event', isPush);
  }, [editor, mainUrl]);
  const saveHistory$1 = useCallback(() => {
    if (!editor || !mainUrl) return;
    const dataJson = editor.getJson();
    return saveHistory({
      data: dataJson ? JSON.stringify(dataJson) : '',
      imgSrc: mainUrl
    });
  }, [editor, mainUrl]);
  const saveToJson = useCallback(() => {
    if (!editor) return;
    saveHistory$1();
    const dataUrl = editor.getJson();
    const fileStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataUrl, null, '\t'))}`;
    saveAs(fileStr, `${uuid()}.json`);
  }, [editor]);
  const saveToImage = useCallback(async () => {
    if (saveToImageLoading) return;
    if (!canvas || !editor) return;
    if (isClipImage) {
      cancelClipImage();
    }
    try {
      setSaveToImageLoading(true);
      await saveHistory$1();
      const workspace = canvas === null || canvas === void 0 ? void 0 : canvas.getObjects().find(item => item.id === 'workspace');
      editor.ruler.hideGuideline();
      if (!workspace) return;
      const {
        left,
        top,
        width,
        height
      } = workspace;
      const option = {
        format: 'png',
        quality: 1,
        left,
        top,
        width,
        height
      };
      const scale = canvas.getZoom();
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      const dataUrl = canvas.toDataURL(option);
      saveAs(dataUrl, `${uuid()}.png`);
      workSpace === null || workSpace === void 0 ? void 0 : workSpace.setZoomAuto(scale);
      editor.ruler.showGuideline();
      setSaveToImageLoading(false);
    } catch (err) {
      console.log('onSaveToImage err', err);
      workSpace === null || workSpace === void 0 ? void 0 : workSpace.auto();
      toast.error(err.message);
      setSaveToImageLoading(false);
    }
  }, [canvas, editor, workSpace, isClipImage, clipImageId, clipRawIndex]);
  return {
    saveToJson,
    saveHistory: saveHistory$1,
    unloadSendBeacon,
    saveToImage
  };
};

const Draw = props => {
  const {
    setCanvas,
    setEditor,
    setWorkSpace,
    setShow,
    setMainUrl
  } = useContext(Context);
  const {
    setLoading
  } = useContext(Context$1);
  const {
    loadFont,
    fontLoaded
  } = useChangeFontFamily();
  const {
    unloadSendBeacon
  } = useSave();
  useEvents();
  useEffect(() => {
    if (!fontLoaded) return;
    init();
    setMainUrl(props.src);
  }, [fontLoaded]);
  useEffect(() => {
    window.addEventListener('beforeunload', () => {
      unloadSendBeacon();
    });
  }, []);
  const init = async () => {
    if (!props.src) {
      return initCanvas();
    }
    try {
      const res = await getDetail({
        imgSrc: props.src
      });
      initCanvas(JSON.parse(res));
    } catch (err) {
      initCanvas();
    }
  };
  const initCanvas = async canvasData => {
    let mainImg = null;
    if (canvasData && canvasData.objects) {
      var _canvasData$objects$f;
      mainImg = (_canvasData$objects$f = canvasData.objects.find(item => item.id === 'mainImg')) === null || _canvasData$objects$f === void 0 ? void 0 : _canvasData$objects$f.src;
    } else {
      mainImg = props.src;
    }
    try {
      setLoading(true);
      await loadFont(canvasData === null || canvasData === void 0 ? void 0 : canvasData.objects);
      await loadImage(mainImg);
      setLoading(false);
    } catch (err) {
      console.log(`initCanvas error`, err);
      setLoading(false);
    }
    const canvas = new fabric.Canvas('fabric-canvas', {
      fireRightClick: true,
      stopContextMenu: true,
      controlsAboveOverlay: true,
      preserveObjectStacking: true
    });
    const workSpace = new EditorWorkspace(canvas, {
      src: props.src,
      callback: () => setShow(true),
      canvasData
    });
    const editor = new Editor(canvas);
    setWorkSpace(workSpace);
    setCanvas(canvas);
    setEditor(editor);
  };
  return React.createElement("div", {
    className: styles.workContent,
    id: 'workspace'
  }, React.createElement("canvas", {
    className: styles.canvas,
    id: 'fabric-canvas'
  }));
};

var style$6 = {"importFile":"_index-module__importFile__3dqN7","openFile":"_index-module__openFile__2iRcv"};

const ImportFile = props => {
  const {
    saveHistory,
    unloadSendBeacon
  } = useSave();
  const back = () => {
    var _props$onBack;
    saveHistory();
    unloadSendBeacon();
    (_props$onBack = props.onBack) === null || _props$onBack === void 0 ? void 0 : _props$onBack.call(props);
  };
  return React.createElement("div", {
    className: style$6.importFile
  }, props.onBack ? React.createElement("span", {
    className: style$6.back,
    onClick: back
  }, React.createElement("img", {
    src: 'https://ossprod.jrdaimao.com/file/1690265070713402.svg',
    alt: ''
  }), React.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690358472515604.svg",
    alt: ""
  }), React.createElement("span", null, "\u8FD4\u56DE")) : null);
};

var styles$2 = {"headerControl":"_styles-module__headerControl__231xi","button":"_styles-module__button__1BWG3","active":"_styles-module__active__2gyAH","disabled":"_styles-module__disabled__2q4y6","ratioText":"_styles-module__ratioText__1kiSM","line":"_styles-module__line__319O5","reactTooltip":"_styles-module__reactTooltip__1d1Sx","clipSaveButton":"_styles-module__clipSaveButton__26Y5H"};

function useMemoizedFn(fn) {
  const fnRef = useRef(fn);
  fnRef.current = useMemo(() => fn, [fn]);
  const memoizedFn = useRef();
  if (!memoizedFn.current) {
    memoizedFn.current = function (...args) {
      return fnRef.current.apply(this, args);
    };
  }
  return memoizedFn.current;
}

const dumpIndex = (step, arr) => {
  let index = step > 0 ? step - 1 : arr.length + step;
  if (index >= arr.length - 1) {
    index = arr.length - 1;
  }
  if (index < 0) {
    index = 0;
  }
  return index;
};
const split = (step, targetArr) => {
  const index = dumpIndex(step, targetArr);
  return {
    _current: targetArr[index],
    _before: targetArr.slice(0, index),
    _after: targetArr.slice(index + 1)
  };
};
function useHistoryTravel(initialValue, maxLength = 0) {
  const [history, setHistory] = useState({
    present: initialValue,
    past: [],
    future: []
  });
  const {
    present,
    past,
    future
  } = history;
  const initialValueRef = useRef(initialValue);
  const reset = (...params) => {
    const _initial = params.length > 0 ? params[0] : initialValueRef.current;
    initialValueRef.current = _initial;
    setHistory({
      present: _initial,
      future: [],
      past: []
    });
  };
  const updateValue = val => {
    const _past = [...past, present];
    const maxLengthNum = isNumber(maxLength) ? maxLength : Number(maxLength);
    if (maxLengthNum > 0 && _past.length > maxLengthNum) {
      _past.splice(0, 1);
    }
    setHistory({
      present: val,
      future: [],
      past: _past
    });
  };
  const _forward = (step = 1) => {
    if (future.length === 0) {
      return;
    }
    const {
      _before,
      _current,
      _after
    } = split(step, future);
    setHistory({
      past: [...past, present, ..._before],
      present: _current,
      future: _after
    });
  };
  const _backward = (step = -1) => {
    if (past.length === 0) {
      return;
    }
    const {
      _before,
      _current,
      _after
    } = split(step, past);
    setHistory({
      past: _before,
      present: _current,
      future: [..._after, present, ...future]
    });
  };
  const go = step => {
    const stepNum = isNumber(step) ? step : Number(step);
    if (stepNum === 0) {
      return;
    }
    if (stepNum > 0) {
      return _forward(stepNum);
    }
    _backward(stepNum);
  };
  return {
    value: present,
    backLength: past.length,
    forwardLength: future.length,
    setValue: useMemoizedFn(updateValue),
    go: useMemoizedFn(go),
    back: useMemoizedFn(() => {
      go(-1);
    }),
    forward: useMemoizedFn(() => {
      go(1);
    }),
    reset: useMemoizedFn(reset)
  };
}

const useHistory = () => {
  const {
    canvas,
    workSpace,
    editor,
    clipImageId,
    isClipImage
  } = useContext(Context);
  const {
    value,
    setValue,
    go,
    reset,
    backLength,
    forwardLength
  } = useHistoryTravel(undefined, 50);
  const historyFlagRef = useRef(false);
  useEffect(() => {
    canvas === null || canvas === void 0 ? void 0 : canvas.on({
      'object:added': save,
      'object:modified': save,
      'object:removed': save
    });
    return () => {
      canvas === null || canvas === void 0 ? void 0 : canvas.off({
        'object:added': save,
        'object:modified': save,
        'object:removed': save
      });
    };
  }, [canvas, editor, setValue, isClipImage, clipImageId]);
  useEffect(() => {
    if (!workSpace || !editor) return;
    reset(editor.getJson());
  }, [editor, workSpace]);
  useEffect(() => {
    if (!canvas) return;
    if (!historyFlagRef.current) return;
    canvas === null || canvas === void 0 ? void 0 : canvas.clear();
    canvas === null || canvas === void 0 ? void 0 : canvas.loadFromJSON(value, () => {
      historyFlagRef.current = false;
      canvas.renderAll();
    });
  }, [value, canvas]);
  const save = useCallback(event => {
    const isSelect = event.action === undefined && event.e;
    if (isSelect || !canvas) return;
    if (historyFlagRef.current) return;
    if (event.target && event.target.id === "currentClipRect") {
      return;
    }
    if (isClipImage && event.target.id === clipImageId || event.target.id === 'clipRawImage') {
      return;
    }
    setValue(editor === null || editor === void 0 ? void 0 : editor.getJson());
  }, [canvas, editor, setValue, isClipImage, clipImageId]);
  const undo = useCallback(() => {
    historyFlagRef.current = true;
    go(-1);
  }, [go]);
  const redo = useCallback(() => {
    historyFlagRef.current = true;
    go(1);
  }, [go]);
  return {
    undo,
    redo,
    backLength,
    forwardLength
  };
};

const HeaderControl = () => {
  const {
    workSpace,
    drawMode,
    setDrawMode,
    canvas,
    editor,
    isClipImage,
    setIsClipImage,
    setClipImageId,
    setClipRawIndex,
    clipImageId,
    clipRawIndex
  } = useContext(Context);
  const {
    saveClipImage,
    cancelClipImage
  } = useClipImage();
  const {
    undo,
    redo,
    backLength,
    forwardLength
  } = useHistory();
  const [scale, setScale] = useState(0);
  const drawModeRef = useRef('default');
  drawModeRef.current = drawMode;
  useEffect(() => {
    hotkeys(KeyNames.enter, saveClipImage);
    hotkeys(KeyNames.esc, cancelClipImage);
    return () => {
      hotkeys.unbind(KeyNames.enter, saveClipImage);
      hotkeys.unbind(KeyNames.esc, cancelClipImage);
    };
  }, [canvas, workSpace, clipImageId, clipRawIndex]);
  useEffect(() => {
    hotkeys(KeyNames.ctrlz, undo);
    hotkeys(KeyNames.ctrlshiftz, redo);
    events.on(Types.CLIP_IMAGE, onClipImage);
    return () => {
      hotkeys.unbind(KeyNames.ctrlz, undo);
      hotkeys.unbind(KeyNames.ctrlshiftz, redo);
      events.off(Types.CLIP_IMAGE, onClipImage);
    };
  }, []);
  useEffect(() => {
    if (workSpace !== null && workSpace !== void 0 && workSpace.scale) {
      setScale(floatRound(workSpace.scale * 100));
    }
  }, [workSpace === null || workSpace === void 0 ? void 0 : workSpace.scale]);
  useEffect(() => {
    events.on(Types.CHANGE_SCALE, scale => {
      setScale(floatRound(scale * 100));
    });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [workSpace, drawMode]);
  const onClipImage = ({
    visible,
    rawIndex,
    clipImageId
  }) => {
    setIsClipImage(visible);
    setClipRawIndex(rawIndex);
    setClipImageId(clipImageId);
  };
  const onKeyDown = e => {
    if (e.code !== 'Space') return;
    if (drawModeRef.current === 'move') return;
    switchDragMode();
  };
  const onKeyUp = e => {
    if (e.code !== 'Space') return;
    switchDefaultMode();
  };
  const switchDragMode = () => {
    var _editor$disableGuidel;
    editor === null || editor === void 0 ? void 0 : (_editor$disableGuidel = editor.disableGuidelines) === null || _editor$disableGuidel === void 0 ? void 0 : _editor$disableGuidel.call(editor);
    workSpace === null || workSpace === void 0 ? void 0 : workSpace.startDring();
    setDrawMode('move');
  };
  const switchDefaultMode = () => {
    var _editor$enableGuideli;
    editor === null || editor === void 0 ? void 0 : (_editor$enableGuideli = editor.enableGuidelines) === null || _editor$enableGuideli === void 0 ? void 0 : _editor$enableGuideli.call(editor);
    workSpace === null || workSpace === void 0 ? void 0 : workSpace.endDring();
    setDrawMode('default');
  };
  if (isClipImage) {
    return React.createElement("div", {
      className: styles$2.headerControl
    }, React.createElement("span", {
      className: styles$2.clipSaveButton,
      onClick: saveClipImage
    }, React.createElement("img", {
      src: "https://ossprod.jrdaimao.com/file/1691980964433863.svg",
      alt: ""
    }), React.createElement("img", {
      src: "https://ossprod.jrdaimao.com/file/1691981310968623.svg",
      alt: ""
    }), React.createElement("span", null, "\u4FDD\u5B58")), React.createElement("span", {
      className: styles$2.clipSaveButton,
      onClick: cancelClipImage
    }, React.createElement("img", {
      src: "https://ossprod.jrdaimao.com/file/1691980998460679.svg",
      alt: ""
    }), React.createElement("img", {
      src: "https://ossprod.jrdaimao.com/file/1691981320881591.svg",
      alt: ""
    }), React.createElement("span", null, "\u53D6\u6D88")));
  }
  return React.createElement("div", {
    className: styles$2.headerControl
  }, React.createElement("div", null, React.createElement("div", {
    "data-tooltip-content": "\u64A4\u9500 Ctrl Z",
    "data-tooltip-place": "bottom",
    onClick: undo,
    className: `${styles$2.button} ${backLength ? '' : styles$2.disabled}`
  }, React.createElement("img", {
    src: backLength ? "https://ossprod.jrdaimao.com/file/1690509281581673.svg" : "https://ossprod.jrdaimao.com/file/1690789676330313.svg",
    alt: ""
  }), React.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690509933132558.svg",
    alt: ""
  })), React.createElement("div", {
    onClick: redo,
    className: `${styles$2.button} ${forwardLength ? '' : styles$2.disabled}`,
    id: 'control-tooltip',
    "data-tooltip-content": "\u91CD\u505A Ctrl Shift Z",
    "data-tooltip-place": "bottom"
  }, React.createElement("img", {
    src: forwardLength ? "https://ossprod.jrdaimao.com/file/1690509311318726.svg" : "https://ossprod.jrdaimao.com/file/1690789758114451.svg",
    alt: ""
  }), React.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690509942889198.svg",
    alt: ""
  }))), React.createElement("div", {
    className: styles$2.line
  }), React.createElement("div", null, React.createElement("div", {
    className: `${styles$2.button} ${drawMode === 'move' ? styles$2.active : ''}`,
    onClick: switchDragMode,
    id: 'control-tooltip',
    "data-tooltip-content": "\u79FB\u52A8\u89C6\u56FE Space",
    "data-tooltip-place": "bottom"
  }, React.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690509577879796.svg",
    alt: ""
  }), React.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690509952709638.svg",
    alt: ""
  })), React.createElement("div", {
    className: `${styles$2.button} ${drawMode === 'default' ? styles$2.active : ''}`,
    onClick: switchDefaultMode,
    id: 'control-tooltip',
    "data-tooltip-content": "\u9009\u62E9",
    "data-tooltip-place": "bottom"
  }, React.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690509620102920.svg",
    alt: ""
  }), React.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690509961015895.svg",
    alt: ""
  }))), React.createElement("div", {
    className: styles$2.line
  }), React.createElement("div", null, React.createElement("div", {
    className: styles$2.button,
    onClick: () => workSpace === null || workSpace === void 0 ? void 0 : workSpace.big(),
    id: 'control-tooltip',
    "data-tooltip-content": "\u653E\u5927\u89C6\u56FE Ctrl +",
    "data-tooltip-place": "bottom"
  }, React.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690509650392929.svg",
    alt: ""
  }), React.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/169050996966396.svg",
    alt: ""
  })), React.createElement("div", {
    className: styles$2.button,
    onClick: () => workSpace === null || workSpace === void 0 ? void 0 : workSpace.small(),
    id: 'control-tooltip',
    "data-tooltip-content": "\u7F29\u5C0F\u89C6\u56FE Ctrl -",
    "data-tooltip-place": "bottom"
  }, React.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690509673723181.svg",
    alt: ""
  }), React.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/1690509977928322.svg",
    alt: ""
  })), React.createElement("div", {
    style: {
      visibility: scale ? 'visible' : 'hidden'
    },
    className: styles$2.ratioText
  }, scale, "%")));
};

var styles$3 = {"headerRightControl":"_index-module__headerRightControl__1SUwQ","saveButton":"_index-module__saveButton__3Wh6y","previewButton":"_index-module__previewButton__1UAg_","saveWrap":"_index-module__saveWrap__Mk1Te","fixButton":"_index-module__fixButton__2n_FI","showButton":"_index-module__showButton__3Qae8"};

const SaveButton = () => {
  const {
    saveToImage
  } = useSave();
  return React.createElement("div", {
    className: styles$3.headerRightControl
  }, React.createElement("span", {
    className: styles$3.saveWrap
  }, React.createElement("span", {
    onClick: saveToImage,
    className: styles$3.saveButton
  }, "\u4E0B\u00A0\u8F7D")));
};

var styles$4 = {"imageResource":"_index-module__imageResource__1mciG","searchBox":"_index-module__searchBox__iEuoB","uploadFile":"_index-module__uploadFile__3rrLu","fileList":"_index-module__fileList__1lwJG","empty":"_index-module__empty__1dOE_","fileListItem":"_index-module__fileListItem__3PLjp","image":"_index-module__image__evLSw","more":"_index-module__more__3qqMp"};

const useDropDown = () => {
  const clickRef = useRef();
  const cacheItem = useRef();
  const [show, setShow] = useState(false);
  const {
    setLoading
  } = useContext(Context$1);
  const shareEl = useRef();
  useEffect(() => {
    const el = document.querySelector('#img-file-list');
    if (!el) return;
    if (show) {
      el.style.overflow = 'hidden';
    } else {
      el.style.overflow = 'auto';
    }
  }, [show]);
  useEffect(() => {
    window.addEventListener('click', removeEl);
    return () => {
      removeEl();
      window.removeEventListener('click', removeEl);
    };
  }, []);
  const removeEl = useCallback(e => {
    if ((e === null || e === void 0 ? void 0 : e.target) === clickRef.current) return;
    if (shareEl.current) {
      document.body.removeChild(shareEl.current);
      shareEl.current = null;
      setShow(false);
    }
  }, []);
  const onClick = async e => {
    if (!e.target || !cacheItem.current) return;
    const {
      imgSrc,
      stockName,
      _id,
      callback
    } = cacheItem.current;
    if (e.target.innerHTML === '下载') {
      saveAs(imgSrc, `${stockName}${imgSrc.slice(imgSrc.lastIndexOf('.'))}`);
    }
    if (e.target.innerHTML === '删除') {
      try {
        setLoading(true);
        await delstock({
          id: _id
        });
        await (callback === null || callback === void 0 ? void 0 : callback());
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    }
  };
  const run = (e, item) => {
    setShow(true);
    cacheItem.current = item;
    if (shareEl.current) {
      document.body.removeChild(shareEl.current);
      shareEl.current = null;
    }
    clickRef.current = e.target;
    const parentNode = e.target.parentNode;
    const {
      top,
      left
    } = parentNode.getBoundingClientRect();
    const div = shareEl.current = document.createElement('div');
    div.addEventListener('click', onClick);
    div.innerHTML = `<div class='customMenu' style='left:${left + parentNode.offsetWidth + 10}px;top:${top}px'>
<!--    <div class='editName'>-->
<!--      <span>某某文件名...名称.png</span>-->
<!--      <img src="https://ossprod.jrdaimao.com/file/1690528866207938.svg" alt=""/>-->
<!--    </div>-->
    <div class='buttons'>
      <div>下载</div>
      <div>删除</div>
    </div>
  </div>`;
    document.body.appendChild(div);
  };
  return {
    run
  };
};

const DefaultOptions = {
  text: {
    fill: '#000000'
  },
  image: {}
};
const useAddObject = () => {
  const {
    workSpace,
    canvas,
    isClipImage,
    clipImageId,
    clipRawIndex
  } = useContext(Context);
  const {
    cancelClipImage
  } = useClipImage();
  const {
    setLoading
  } = useContext(Context$1);
  const addImage = useCallback((src, options, callback) => {
    if (!workSpace) return;
    setLoading(true);
    if (isClipImage) cancelClipImage();
    const scale = workSpace.getScale();
    fabric.Image.fromURL(`${src}?t=${Date.now()}`, img => {
      if (!img.width || !img.height) {
        setLoading(false);
        return;
      }
      img.set({
        ...DefaultOptions.image,
        id: uuid(),
        scaleY: scale,
        scaleX: scale,
        left: (workSpace.width - img.width * scale) / 2,
        top: (workSpace.height - img.height * scale) / 2,
        ...options
      });
      canvas === null || canvas === void 0 ? void 0 : canvas.add(img);
      canvas === null || canvas === void 0 ? void 0 : canvas.setActiveObject(img);
      callback === null || callback === void 0 ? void 0 : callback(img);
      canvas === null || canvas === void 0 ? void 0 : canvas.renderAll();
      setLoading(false);
    }, {
      crossOrigin: 'anonymous'
    });
  }, [workSpace, canvas, clipImageId, clipRawIndex]);
  const addText = useCallback(item => {
    if (!workSpace) return;
    if (isClipImage) cancelClipImage();
    const text = new fabric.IText(item.title, {
      fontFamily: 'serif',
      fontSize: item.style.fontSize * 3,
      fontWeight: item.style.fontWeight,
      id: uuid(),
      lockScalingX: false,
      lockScalingY: false,
      ...DefaultOptions.text
    });
    text.set({
      left: (workSpace.width - text.width) / 2,
      top: (workSpace.height - text.height) / 2
    });
    canvas === null || canvas === void 0 ? void 0 : canvas.add(text);
    canvas === null || canvas === void 0 ? void 0 : canvas.setActiveObject(text);
    canvas === null || canvas === void 0 ? void 0 : canvas.renderAll();
  }, [workSpace, canvas, clipImageId, clipRawIndex]);
  return {
    addImage,
    addText
  };
};

const ImageResource = () => {
  const {
    setLoading
  } = useContext(Context$1);
  const toast = useToast();
  const {
    canvas
  } = useContext(Context);
  const EDIT_IMAGE_LIST = sessionStorage.getItem('EDIT_IMAGE_LIST');
  const [uploading, setUploading] = useState(false);
  const {
    addImage
  } = useAddObject();
  const [list, setList] = useState(EDIT_IMAGE_LIST ? JSON.parse(EDIT_IMAGE_LIST) : []);
  const {
    run
  } = useDropDown();
  useEffect(() => {
    queryList();
  }, []);
  useEffect(() => {
    if (!canvas) return;
    canvas.on('drop', onDrop);
    canvas.on('dragover', onDragover);
    return () => {
      canvas.off('drop', onDrop);
      canvas.off('dragover', onDragover);
    };
  }, [canvas]);
  const onDrop = ({
    e
  }) => {
    e.preventDefault();
    const imageUrl = e.dataTransfer.getData('text/plain');
    let offset = {
      left: canvas.getSelectionElement().getBoundingClientRect().left,
      top: canvas.getSelectionElement().getBoundingClientRect().top
    };
    let point = {
      x: e.x - offset.left,
      y: e.y - offset.top
    };
    let pointerVpt = canvas.restorePointerVpt(point);
    addImage(imageUrl, {}, img => {
      img.set({
        left: pointerVpt.x - img.getScaledWidth() / 2,
        top: pointerVpt.y - img.getScaledHeight() / 2
      });
    });
  };
  const onDragover = ({
    e
  }) => {
    e.preventDefault();
  };
  const onClickMore = (e, item) => {
    run(e, {
      ...item,
      callback: queryList
    });
  };
  const queryList = async () => {
    try {
      const res = await getImageList({
        pageIndex: 1,
        pageSize: 500
      });
      if (res) {
        sessionStorage.setItem('EDIT_IMAGE_LIST', JSON.stringify(res));
      }
      setList(res);
    } catch (err) {
      console.log(err);
    }
  };
  const onUploadFile = async e => {
    if (uploading) return;
    const fileList = e.target.files;
    try {
      setUploading(true);
      setLoading(true);
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (!/(png|jpg|jpeg)/g.test(file.type)) continue;
        const res = await postUploadImage(file);
        await addImageApi({
          imgSrc: res.url,
          stockName: file.name
        });
      }
      await queryList();
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setUploading(false);
      setLoading(false);
    }
  };
  const onDragStart = e => {
    e.dataTransfer.setData('text/plain', e.target.src);
  };
  return React.createElement("div", {
    className: styles$4.imageResource
  }, React.createElement("div", {
    className: styles$4.uploadFile
  }, React.createElement("span", null, uploading ? '上传中...' : '上传文件'), React.createElement("input", {
    multiple: true,
    disabled: uploading,
    type: "file",
    accept: '.png,.jpg,.jpeg',
    onChange: onUploadFile
  })), !(list !== null && list !== void 0 && list.length) ? React.createElement("div", {
    className: styles$4.empty
  }, React.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/169035729200810.png",
    alt: ""
  }), React.createElement("p", null, "\u8FD8\u6CA1\u6709\u6587\u4EF6\u54E6~")) : null, list !== null && list !== void 0 && list.length ? React.createElement("div", {
    className: styles$4.fileList,
    id: 'img-file-list'
  }, list.map(item => {
    return React.createElement("div", {
      key: item._id,
      className: styles$4.fileListItem
    }, React.createElement("img", {
      onDragStart: onDragStart,
      onClick: () => addImage(item.imgSrc),
      className: styles$4.image,
      src: item.imgSrc,
      alt: ""
    }), React.createElement("img", {
      onClick: e => onClickMore(e, item),
      className: styles$4.more,
      src: "https://ossprod.jrdaimao.com/file/1690363754666532.svg",
      alt: ""
    }));
  })) : null);
};

const textList = [{
  title: '添加标题',
  key: 'addTitle',
  style: {
    fontSize: 20,
    fontWeight: 600
  }
}, {
  title: '添加副标题',
  key: 'addSubTitle',
  style: {
    fontSize: 16,
    fontWeight: 600
  }
}, {
  title: '添加正文',
  key: 'addText',
  style: {
    fontSize: 14
  }
}, {
  title: '添加注释',
  key: 'addAnnotation',
  style: {
    fontSize: 12
  }
}];

var styles$5 = {"textResource":"_index-module__textResource__qOoMp","addShareTextButton":"_index-module__addShareTextButton__3uKaf","textListItem":"_index-module__textListItem__3_inJ"};

const TextResource = () => {
  const {
    addText
  } = useAddObject();
  return React.createElement("div", {
    className: styles$5.textResource
  }, React.createElement("div", {
    className: styles$5.addShareTextButton
  }, React.createElement("span", {
    onClick: () => addText({
      ...textList[3],
      title: '文本框'
    })
  }, "\u6DFB\u52A0\u6587\u672C\u6846")), React.createElement("div", {
    className: styles$5.textList
  }, textList.map(item => {
    return React.createElement("div", {
      onClick: () => addText(item),
      key: item.key,
      style: item.style,
      className: styles$5.textListItem
    }, React.createElement("span", null, item.title));
  })));
};

const ResourceTypeEnum = {
  ALREADY_UPLOAD: 'alreadyUpload',
  TEXT: 'i-text'
};
const resourceNavList = [{
  title: '已上传',
  icon: 'https://ossprod.jrdaimao.com/file/1690351687096238.svg',
  activeIcon: 'https://ossprod.jrdaimao.com/file/1690351735822596.svg',
  key: ResourceTypeEnum.ALREADY_UPLOAD
}, {
  title: '文 字',
  icon: 'https://ossprod.jrdaimao.com/file/1690351715036668.svg',
  activeIcon: 'https://ossprod.jrdaimao.com/file/1690351759741179.svg',
  key: ResourceTypeEnum.TEXT
}];
const ResourceContentComEnum = {
  [ResourceTypeEnum.ALREADY_UPLOAD]: ImageResource,
  [ResourceTypeEnum.TEXT]: TextResource
};
const DefaultSelectKey = ResourceTypeEnum.ALREADY_UPLOAD;

var styles$6 = {"resourceNav":"_index-module__resourceNav__2Z57U","resourceContent":"_index-module__resourceContent__IR3Ff","resourceNavItem":"_index-module__resourceNavItem__1cunE","resourceNavPlace":"_index-module__resourceNavPlace__2CAgV","resourceNavItemActive":"_index-module__resourceNavItemActive__MUADE","resourceNavItemPrevActive":"_index-module__resourceNavItemPrevActive__1OMMf","resourceArea":"_index-module__resourceArea__1SeNE","packUp":"_index-module__packUp__LUVGf"};

const ResourceArea = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState(DefaultSelectKey);
  const onResourceNavChange = item => {
    setActiveKey(item.key);
  };
  const activeIndex = resourceNavList.findIndex(item => item.key === activeKey);
  const ResourceComponent = ResourceContentComEnum[activeKey];
  const onSetCollapsed = () => {
    if (!collapsed) {
      document.body.style.setProperty('--dm-change-resource-content-width', '0');
      setCollapsed(true);
    } else {
      document.body.style.setProperty('--dm-change-resource-content-width', '240px');
      setCollapsed(false);
    }
  };
  return React.createElement("div", {
    className: styles$6.resourceArea
  }, React.createElement("div", {
    className: styles$6.resourceNav
  }, resourceNavList.map((item, index) => {
    const active = activeIndex === index;
    let className = `${styles$6.resourceNavItem} ${active ? styles$6.resourceNavItemActive : ''}`;
    if (index === activeIndex - 1) {
      className += styles$6.resourceNavItemPrevActive;
    }
    return React.createElement("div", {
      onClick: () => onResourceNavChange(item),
      className: className,
      key: item.key
    }, React.createElement("img", {
      src: active ? item.activeIcon : item.icon,
      alt: ""
    }), React.createElement("span", null, item.title));
  }), React.createElement("div", {
    className: styles$6.resourceNavPlace
  })), React.createElement("div", {
    className: styles$6.resourceContent
  }, React.createElement(ResourceComponent, null), React.createElement("div", {
    className: styles$6.packUp,
    onClick: onSetCollapsed
  }, React.createElement("img", {
    src: collapsed ? 'https://ossprod.jrdaimao.com/file/1690513793832702.svg' : 'https://ossprod.jrdaimao.com/file/1690445829374723.svg',
    alt: ""
  }))));
};

var style$7 = {"attrWrap":"_index-module__attrWrap__1Um4N","attrTab":"_index-module__attrTab__2Zu3W","attrTabActive":"_index-module__attrTabActive__3Q6Gq","attrContent":"_index-module__attrContent__yV77-"};

var style$8 = {"orderWrap":"_index-module__orderWrap__1OXXV","orderListTitle":"_index-module__orderListTitle__3Taww","orderList":"_index-module__orderList__2rRt5","orderListItem":"_index-module__orderListItem__1VS8z","active":"_index-module__active__saBU6","button":"_index-module__button__226hu","move":"_index-module__move__16YUk","content":"_index-module__content__3hSBb","text":"_index-module__text__1r5UD","image":"_index-module__image__yBptY","empty":"_index-module__empty__14aJw"};

const SortableItem = sortableElement(props => {
  const {
    changeOwnLock
  } = useLock();
  const {
    item
  } = props;
  const {
    selectIds,
    canvas
  } = useContext(Context);
  const isLock = item.object.hasControls;
  const isVisible = item.object.visible;
  const clickItem = useCallback(() => {
    if (!canvas) return;
    canvas.setActiveObject(item.object);
    canvas.renderAll();
  }, [item, canvas]);
  const onLockObject = e => {
    e.stopPropagation();
    changeOwnLock(!isLock, item.object);
  };
  const onHiddenObject = e => {
    e.stopPropagation();
    item.object.set({
      visible: !isVisible
    });
    canvas === null || canvas === void 0 ? void 0 : canvas.renderAll();
  };
  const fontFamily = item.object.get('fontFamily');
  return React.createElement("div", {
    onClick: clickItem,
    className: `${style$8.orderListItem} ${selectIds.includes(item.id) ? style$8.active : ''}`
  }, React.createElement("div", {
    className: style$8.button
  }, React.createElement("img", {
    draggable: false,
    onClick: onHiddenObject,
    src: isVisible ? 'https://ossprod.jrdaimao.com/file/1690437893570728.svg' : 'https://ossprod.jrdaimao.com/file/1690945206225980.svg',
    alt: ""
  }), React.createElement("img", {
    draggable: false,
    onClick: onLockObject,
    src: isLock ? 'https://ossprod.jrdaimao.com/file/1690437902259961.svg' : 'https://ossprod.jrdaimao.com/file/1690944574168632.svg',
    alt: ""
  })), React.createElement("div", {
    className: style$8.content
  }, item.type === 'image' ? React.createElement("div", {
    className: style$8.image
  }, React.createElement("img", {
    draggable: false,
    src: item.src,
    alt: ""
  })) : React.createElement("div", {
    className: style$8.text,
    style: {
      fontFamily: fontFamily || 'serif'
    }
  }, item.text)), React.createElement(DragHandle, null));
});
const DragHandle = () => {
  return React.createElement("div", {
    className: style$8.move
  }, React.createElement("img", {
    draggable: false,
    src: "https://ossprod.jrdaimao.com/file/1690437934587361.svg",
    alt: ""
  }));
};
const SortableContainer = sortableContainer(({
  children
}) => {
  return children;
});
const OrderList = () => {
  const {
    canvas
  } = useContext(Context);
  const {
    up,
    upTop,
    down,
    downTop
  } = userOrder();
  const [list, setList] = useState([]);
  const onSortEnd = useCallback(({
    oldIndex,
    newIndex
  }) => {
    var _list$oldIndex;
    if (oldIndex === newIndex) return;
    const oldObject = (_list$oldIndex = list[oldIndex]) === null || _list$oldIndex === void 0 ? void 0 : _list$oldIndex.object;
    if (!oldObject) return;
    if (newIndex < oldIndex) {
      if (newIndex === 0) return upTop(oldObject);
      for (let i = newIndex; i < oldIndex; i++) {
        up(oldObject);
      }
    } else {
      if (newIndex === list.length - 1) return downTop(oldObject);
      for (let i = oldIndex; i < newIndex; i++) {
        down(oldObject);
      }
    }
    setList(prevState => arrayMove(prevState, oldIndex, newIndex));
  }, [list, setList, up, upTop, down, downTop]);
  useEffect(() => {
    if (!canvas) return;
    canvas.on('after:render', getList);
    return () => {
      canvas.off('after:render', getList);
    };
  }, [canvas]);
  const getList = useCallback(() => {
    const objects = (canvas === null || canvas === void 0 ? void 0 : canvas.getObjects()) || [];
    const list = [...objects.filter(item => {
      return !(item instanceof fabric.GuideLine || item.id === 'workspace' || item.id === 'currentClipRect');
    })].reverse().map(item => {
      var _item$_element;
      const {
        type,
        id,
        text
      } = item;
      const src = type === 'image' ? (_item$_element = item._element) === null || _item$_element === void 0 ? void 0 : _item$_element.src : undefined;
      return {
        object: item,
        type,
        id,
        text,
        src
      };
    });
    setList(list);
  }, [setList, canvas]);
  return React.createElement("div", {
    className: style$8.orderWrap
  }, React.createElement("div", {
    className: style$8.orderListTitle
  }, "\u56FE\u5C42"), !list.length ? React.createElement("div", {
    className: style$8.orderListEmpty
  }, React.createElement("div", {
    className: style$8.empty
  }, React.createElement("img", {
    src: "https://ossprod.jrdaimao.com/file/169035729200810.png",
    alt: ""
  }), React.createElement("p", null, "\u6682\u65E0\u56FE\u5C42~"))) : null, list.length ? React.createElement(SortableContainer, {
    distance: 10,
    lockAxis: "y",
    onSortEnd: onSortEnd
  }, React.createElement("div", {
    className: style$8.orderList
  }, list.map((item, index) => {
    return React.createElement(SortableItem, {
      index: index,
      key: item.id,
      item: item
    });
  }))) : null);
};

const ColorPicker$1 = SketchPicker;
const WorkSpaceAttr = () => {
  const {
    workSpace
  } = useContext(Context);
  const [color, setColor] = useState((workSpace === null || workSpace === void 0 ? void 0 : workSpace.fill) || DefaultWorkSpaceColor);
  const onChangeColor = e => {
    setColor(e.hex);
    console.log('change bg color e.hex', e.hex);
    workSpace === null || workSpace === void 0 ? void 0 : workSpace.setBgColor(e.hex);
  };
  return React.createElement("div", {
    className: style$1.workSpaceAttr
  }, React.createElement("div", {
    className: style$1.base
  }, React.createElement("div", null, React.createElement(Size, {
    isWorkSpace: true,
    getActiveObject: () => workSpace === null || workSpace === void 0 ? void 0 : workSpace.workspace
  })), React.createElement("div", null, React.createElement("div", {
    className: style$1.title
  }, "\u80CC\u666F\u8272"), React.createElement(ColorPicker$1, {
    color: color,
    onChange: onChangeColor,
    className: style$1.colorPicker
  }))));
};

const AttrArea = () => {
  const {
    selectOneType
  } = useContext(Context);
  const {
    attrTab,
    setAttrTab
  } = useContext(Context$1);
  const bg = useMemo(() => {
    var _attrTabList$find;
    return (_attrTabList$find = attrTabList.find(item => item.key === attrTab)) === null || _attrTabList$find === void 0 ? void 0 : _attrTabList$find.bg;
  }, [attrTabList, attrTab]);
  const onChangeTab = item => {
    setAttrTab(item.key);
  };
  const AttrCom = attrAreaComponent[selectOneType];
  return React.createElement("div", {
    className: style$7.attrWrap
  }, React.createElement("div", {
    className: style$7.attrTab,
    style: {
      backgroundImage: `url(${bg})`
    }
  }, attrTabList.map(item => {
    return React.createElement("div", {
      onClick: () => onChangeTab(item),
      key: item.key,
      className: attrTab === item.key ? style$7.attrTabActive : ''
    }, React.createElement("span", null, item.title));
  })), React.createElement("div", {
    id: 'attr-content',
    className: style$7.attrContent
  }, React.createElement("div", {
    style: {
      display: attrTab === 'Attr' ? 'block' : 'none'
    }
  }, AttrCom ? React.createElement(AttrCom, null) : React.createElement(WorkSpaceAttr, null)), React.createElement("div", {
    style: {
      display: attrTab === 'coverage' ? 'block' : 'none'
    }
  }, React.createElement(OrderList, null))));
};

var styles$7 = {"dmEditImageContainer":"_styles-module__dmEditImageContainer__1PAn4","header":"_styles-module__header__2NqZJ","content":"_styles-module__content__2pvIH","canvasArea":"_styles-module__canvasArea__f4hmY","attrArea":"_styles-module__attrArea__1Dyk-"};

const Editor$1 = props => {
  const {
    loading,
    loadingText
  } = useContext(Context$1);
  const {
    show
  } = useContext(Context);
  return React.createElement(LoadingOverlay, {
    active: loading,
    spinner: true,
    text: loadingText
  }, React.createElement("div", {
    className: styles$7.dmEditImageContainer
  }, React.createElement("div", {
    className: styles$7.header
  }, React.createElement(ImportFile, {
    onBack: props.onBack
  }), show ? React.createElement(HeaderControl, null) : null, React.createElement(SaveButton, null)), React.createElement("div", {
    className: styles$7.content
  }, React.createElement(ResourceArea, null), React.createElement("div", {
    className: styles$7.canvasArea
  }, React.createElement(Draw, {
    src: props.src
  })), React.createElement("div", {
    className: styles$7.attrArea
  }, React.createElement(AttrArea, null)))));
};

const EditImage = props => {
  return React.createElement(CanvasProvider, null, React.createElement(EditorProvider, null, React.createElement(Editor$1, {
    onBack: props.onBack,
    src: props.src
  }), React.createElement(Toaster, null)));
};

export { EditImage };
//# sourceMappingURL=index.modern.js.map
