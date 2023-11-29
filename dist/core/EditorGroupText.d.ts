import { fabric } from 'fabric';
declare class EditorGroupText {
    canvas: fabric.Canvas;
    isDown: boolean;
    constructor(canvas: fabric.Canvas);
    _init(): void;
    _getGroupTextObj(opt: fabric.IEvent<MouseEvent>): false | fabric.Object;
    _bedingEditingEvent(textObject: fabric.IText, opt: fabric.IEvent<MouseEvent>): void;
    _unGroup(): string[] | undefined;
    isText(obj: fabric.Object): boolean | "" | undefined;
}
export default EditorGroupText;
