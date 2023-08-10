// @ts-nocheck
import { fabric } from 'fabric';

class CenterAlign {
  canvas: fabric.Canvas;
  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  centerH(workspace: fabric.Rect, object: fabric.Object) {
    return this.canvas._centerObject(
      object,
      new fabric.Point(workspace.getCenterPoint().x, object.getCenterPoint().y)
    );
  }

  center(workspace: fabric.Rect, object: fabric.Object) {
    const center = workspace.getCenterPoint();
    return this.canvas._centerObject(object, center);
  }

  centerV(workspace: fabric.Rect, object: fabric.Object) {
    return this.canvas._centerObject(
      object,
      new fabric.Point(object.getCenterPoint().x, workspace.getCenterPoint().y)
    );
  }

  position(name: 'centerH' | 'center' | 'centerV') {
    const anignType = ['centerH', 'center', 'centerV'];
    const activeObject = this.canvas.getActiveObject();
    if (anignType.includes(name) && activeObject) {
      const defaultWorkspace = this.canvas.getObjects().find((item) => item.id === 'workspace');
      if (defaultWorkspace) {
        this[name](defaultWorkspace, activeObject);
      }
      this.canvas.renderAll();
    }
  }
}

export default CenterAlign;
