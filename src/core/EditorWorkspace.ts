import { fabric } from 'fabric';
import { throttle, uuid } from '../utils/utils';
import { events, Types } from '../utils/events';
import { isNumber } from '../utils';

declare type EditorWorkspaceOption = {
  src: string | undefined
  callback?: () => void
};
declare type ExtCanvas = fabric.Canvas & {
  isDragging: boolean;
  lastPosX: number;
  lastPosY: number;
};
export const DefaultWorkSpaceColor = 'rgba(255,255,255,1)'

class EditorWorkspace {
  canvas: fabric.Canvas;
  workspaceEl: HTMLElement;
  workspace: fabric.Rect | null;
  option: EditorWorkspaceOption;
  dragMode: boolean;
  fill: string;
  width: number | undefined
  height: number | undefined

  constructor(canvas: fabric.Canvas, option: EditorWorkspaceOption) {
    this.canvas = canvas;
    const workspaceEl = document.querySelector('#workspace') as HTMLElement;
    if (!workspaceEl) {
      throw new Error('element #workspace is missing, plz check!');
    }
    this.workspaceEl = workspaceEl;
    this.workspace = null;
    this.option = option;
    this.dragMode = false;
    this.fill = DefaultWorkSpaceColor
    this._initBackground();
    this._initWorkspace();
    this._initResizeObserve();
    this._initDring();
  }

  // 初始化背景
  _initBackground() {
    this.canvas.setWidth(this.workspaceEl.offsetWidth);
    this.canvas.setHeight(this.workspaceEl.offsetHeight);
  }

  // 初始化画布
  _initWorkspace() {
    if (!this.option.src) {
      this.width = 1024
      this.height = 1024
      this._initRect()
      return
    }
    fabric.Image.fromURL(this.option.src, img => {
      img.set({
        type: 'image',
        id: uuid(),
        left: 0.5,
        top: 0.5,
      })
      this.width = img.width
      this.height = img.height
      this._initRect(img)
    }, { crossOrigin: 'anonymous'})
  }

  _initRect(img?: fabric.Object) {
    const workspace = new fabric.Rect({
      fill: this.fill,
      width: this.width,
      height: this.height,
      id: 'workspace',
    });

    workspace.set('selectable', false);
    workspace.set('hasControls', false);
    workspace.hoverCursor = 'default';
    this.canvas.add(workspace);
    if (img) this.canvas.add(img)
    this.canvas.renderAll();
    this.workspace = workspace;
    this.option.callback?.();
    this.auto();
  }

  setBgColor(color: string) {
    this.fill = color;
    this.workspace?.set({fill: color});
    this.canvas.renderAll();
  }

  /**
   * 设置画布中心到指定对象中心点上
   * @param {Object} obj 指定的对象
   */
  setCenterFromObject(obj: fabric.Rect) {
    const {canvas} = this;
    const objCenter = obj.getCenterPoint();
    const viewportTransform = canvas.viewportTransform;
    if (canvas.width === undefined || canvas.height === undefined || !viewportTransform) return;
    viewportTransform[4] = canvas.width / 2 - objCenter.x * viewportTransform[0];
    viewportTransform[5] = canvas.height / 2 - objCenter.y * viewportTransform[3];
    canvas.setViewportTransform(viewportTransform);
    canvas.renderAll();
  }

  // 初始化监听器
  _initResizeObserve() {
    const resizeObserver = new ResizeObserver(
      throttle(() => {
        this.auto();
      }, 50)
    );
    resizeObserver.observe(this.workspaceEl);
  }

  setSize(width: number, height: number) {
    this._initBackground();
    this.width = isNumber(width) ? width : +width;
    this.height = isNumber(height) ? height : +height;
    // 重新设置workspace
    this.workspace = this.canvas
      .getObjects()
      .find((item) => item.id === 'workspace') as fabric.Rect;
    this.workspace.set('width', this.width);
    this.workspace.set('height', this.height);
    this.auto();
  }

  setZoomAuto(scale: number, cb?: (left?: number, top?: number) => void) {
    const {workspaceEl} = this;
    const width = workspaceEl.offsetWidth;
    const height = workspaceEl.offsetHeight;
    this.canvas.setWidth(width);
    this.canvas.setHeight(height);
    const center = this.canvas.getCenter();
    this.canvas.setViewportTransform(fabric.iMatrix.concat());
    this.canvas.zoomToPoint(new fabric.Point(center.left, center.top), scale);
    if (!this.workspace) return;
    this.setCenterFromObject(this.workspace);

    // 超出画布不展示
    this.workspace.clone((cloned: fabric.Rect) => {
      this.canvas.clipPath = cloned;
      this.canvas.requestRenderAll();
    });
    if (cb) cb(this.workspace.left, this.workspace.top);
  }

  getScale() {
    const viewPortWidth = this.workspaceEl.offsetWidth;
    const viewPortHeight = this.workspaceEl.offsetHeight;
    const width = this.width || 0
    const height = this.height || 0
    if (!width || !height) return 0
    // 按照宽度
    if (viewPortWidth / viewPortHeight < width / height) {
      return viewPortWidth / width - 0.08;
    } // 按照宽度缩放
    return viewPortHeight / height - 0.08;
  }

  // 放大
  big() {
    let zoomRatio = this.canvas.getZoom();
    zoomRatio += 0.05;
    const center = this.canvas.getCenter();
    this.canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoomRatio);
  }

  // 缩小
  small() {
    let zoomRatio = this.canvas.getZoom();
    zoomRatio -= 0.05;
    const center = this.canvas.getCenter();
    this.canvas.zoomToPoint(
      new fabric.Point(center.left, center.top),
      zoomRatio < 0 ? 0.01 : zoomRatio
    );
  }

  // 自动缩放
  auto() {
    const scale = this.getScale();
    if (scale) {
      events.emit(Types.CHANGE_SCALE, scale)
      this.setZoomAuto(scale);
    }
  }

  // 1:1 放大
  one() {
    this.setZoomAuto(0.8 - 0.08);
    this.canvas.requestRenderAll();
  }

  // 开始拖拽
  startDring() {
    this.dragMode = true;
    this.canvas.defaultCursor = 'grab';
  }

  endDring() {
    this.dragMode = false;
    this.canvas.defaultCursor = 'default';
  }

  // 拖拽模式
  _initDring() {
    const This = this;
    this.canvas.on('mouse:down', function (this: ExtCanvas, opt) {
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

    this.canvas.on('mouse:move', function (this: ExtCanvas, opt) {
      if (this.isDragging) {
        This.canvas.discardActiveObject();
        This.canvas.defaultCursor = 'grabbing';
        const {e} = opt;
        if (!this.viewportTransform) return;
        const vpt = this.viewportTransform;
        vpt[4] += e.clientX - this.lastPosX;
        vpt[5] += e.clientY - this.lastPosY;
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
        this.requestRenderAll();
      }
    });

    this.canvas.on('mouse:up', function (this: ExtCanvas) {
      if (!this.viewportTransform) return;
      this.setViewportTransform(this.viewportTransform);
      this.isDragging = false;
      this.selection = true;
      this.getObjects().forEach((obj) => {
        if (obj.id !== 'workspace' && obj.hasControls) {
          obj.selectable = true;
        }
      });
      this.requestRenderAll();
      This.canvas.defaultCursor = 'default';
    });

    this.canvas.on('mouse:wheel', function (this: fabric.Canvas, opt) {
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
    this.canvas.getObjects().forEach((obj) => {
      obj.selectable = false;
    });
    this.canvas.renderAll();
    this.canvas.requestRenderAll();
  }
}

export default EditorWorkspace;
