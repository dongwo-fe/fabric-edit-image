import { Canvas, Point } from 'fabric/fabric-impl';
/**
 * 配置
 */
export interface RulerOptions {
    /**
     * Canvas
     */
    canvas: Canvas;
    /**
     * 标尺宽高
     * @default 20
     */
    ruleSize?: number;
    /**
     * 字体大小
     * @default 10
     */
    fontSize?: number;
    /**
     * 是否开启标尺
     * @default false
     */
    enabled?: boolean;
    /**
     * 背景颜色
     */
    backgroundColor?: string;
    /**
     * 文字颜色
     */
    textColor?: string;
    /**
     * 边框颜色
     */
    borderColor?: string;
    /**
     * 高亮颜色
     */
    highlightColor?: string;
}
export declare type Rect = {
    left: number;
    top: number;
    width: number;
    height: number;
};
export declare type HighlightRect = {
    skip?: 'x' | 'y';
} & Rect;
declare class CanvasRuler {
    protected ctx: CanvasRenderingContext2D;
    /**
     * 配置
     */
    options: Required<RulerOptions>;
    /**
     * 标尺起始点
     */
    startCalibration: undefined | Point;
    private activeOn;
    /**
     * 选取对象矩形坐标
     */
    private objectRect;
    /**
     * 事件句柄缓存
     */
    private eventHandler;
    private lastAttr;
    private tempGuidelLine;
    constructor(_options: RulerOptions);
    destroy(): void;
    /**
     * 移除全部辅助线
     */
    clearGuideline(): void;
    /**
     * 显示全部辅助线
     */
    showGuideline(): void;
    /**
     * 隐藏全部辅助线
     */
    hideGuideline(): void;
    /**
     * 启用
     */
    enable(): void;
    /**
     * 禁用
     */
    disable(): void;
    /**
     * 绘制
     */
    render(): void;
    /**
     * 获取画板尺寸
     */
    private getSize;
    private getZoom;
    private draw;
    /**
     * 计算起始点
     */
    private calcObjectRect;
    /**
     * 清除起始点和矩形坐标
     */
    private clearStatus;
    /**
      判断鼠标是否在标尺上
     * @param point
     * @returns "vertical" | "horizontal" | false
     */
    isPointOnRuler(point: Point): false | "horizontal" | "vertical";
    private canvasMouseDown;
    private getCommonEventInfo;
    private canvasMouseMove;
    private canvasMouseUp;
}
export default CanvasRuler;
