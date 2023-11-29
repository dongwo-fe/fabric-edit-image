import type { Rect } from './ruler';
/**
 * 计算尺子间距
 * @param zoom 缩放比例
 * @returns 返回计算出的尺子间距
 */
declare const getGap: (zoom: number) => number;
/**
 * 线段合并
 * @param rect Rect数组
 * @param isHorizontal
 * @returns 合并后的Rect数组
 */
declare const mergeLines: (rect: Rect[], isHorizontal: boolean) => Rect[];
declare const darwLine: (ctx: CanvasRenderingContext2D, options: {
    left: number;
    top: number;
    width: number;
    height: number;
    stroke?: string | CanvasGradient | CanvasPattern;
    lineWidth?: number;
}) => void;
declare const darwText: (ctx: CanvasRenderingContext2D, options: {
    left: number;
    top: number;
    text: string;
    fill?: string | CanvasGradient | CanvasPattern;
    align?: CanvasTextAlign;
    angle?: number;
    fontSize?: number;
}) => void;
declare const darwRect: (ctx: CanvasRenderingContext2D, options: {
    left: number;
    top: number;
    width: number;
    height: number;
    fill?: string | CanvasGradient | CanvasPattern;
    stroke?: string;
    strokeWidth?: number;
}) => void;
declare const drawMask: (ctx: CanvasRenderingContext2D, options: {
    isHorizontal: boolean;
    left: number;
    top: number;
    width: number;
    height: number;
    backgroundColor: string;
}) => void;
export { getGap, mergeLines, darwRect, darwText, darwLine, drawMask };
