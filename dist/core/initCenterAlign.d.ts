import { fabric } from 'fabric';
declare class CenterAlign {
    canvas: fabric.Canvas;
    constructor(canvas: fabric.Canvas);
    centerH(workspace: fabric.Rect, object: fabric.Object): any;
    center(workspace: fabric.Rect, object: fabric.Object): any;
    centerV(workspace: fabric.Rect, object: fabric.Object): any;
    position(name: 'centerH' | 'center' | 'centerV'): void;
}
export default CenterAlign;
