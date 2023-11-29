import { fabric } from 'fabric';
declare type EditorWorkspaceOption = {
    src: string | undefined;
    callback?: () => void;
    canvasData: any;
};
export declare const DefaultWorkSpaceColor = "rgba(255,255,255,1)";
declare class EditorWorkspace {
    canvas: fabric.Canvas;
    workspaceEl: HTMLElement;
    workspace: fabric.Rect | null;
    option: EditorWorkspaceOption;
    dragMode: boolean;
    fill: string;
    width: number | undefined;
    height: number | undefined;
    scale: number;
    constructor(canvas: fabric.Canvas, option: EditorWorkspaceOption);
    _initBackground(): void;
    _initWorkspace(): void;
    _initRect(img?: fabric.Object): void;
    setBgColor(color: string): void;
    /**
     * 设置画布中心到指定对象中心点上
     * @param {Object} obj 指定的对象
     */
    setCenterFromObject(obj: fabric.Rect): void;
    _initResizeObserve(): void;
    setSize(width: number, height: number): void;
    setZoomAuto(scale: number, cb?: (left?: number, top?: number) => void): void;
    getScale(): number;
    big(value: number): void;
    small(value: number): void;
    auto(): void;
    one(): void;
    startDring(): void;
    endDring(): void;
    _initDring(): void;
    _setDring(): void;
}
export default EditorWorkspace;
