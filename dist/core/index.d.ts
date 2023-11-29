/// <reference types="node" />
import EventEmitter from 'events';
import InitCenterAlign from './initCenterAlign';
import type CanvasRuler from './ruler/ruler';
import type EditorWorkspace from './EditorWorkspace';
import type { fabric } from 'fabric';
declare class Editor extends EventEmitter {
    canvas: fabric.Canvas;
    editorWorkspace: EditorWorkspace | null;
    centerAlign: InitCenterAlign;
    ruler: CanvasRuler;
    disableGuidelines: () => void;
    enableGuidelines: () => void;
    constructor(canvas: fabric.Canvas);
    _copyActiveSelection(activeObject: fabric.Object): void;
    _copyObject(activeObject: fabric.Object): void;
    clone(paramsActiveObeject: fabric.ActiveSelection | fabric.Object): void;
    unGroup(): void;
    group(): void;
    getWorkspace(): fabric.Object | undefined;
    workspaceSendToBack(): void;
    getJson(): {
        version: string;
        objects: fabric.Object[];
    };
    /**
     * @description: 拖拽添加到画布
     * @param {Event} event
     * @param {Object} item
     */
    dragAddItem(event: DragEvent, item: fabric.Object): void;
}
export default Editor;
