import { fabric } from 'fabric';
declare function initAligningGuidelines(canvas: fabric.Canvas): {
    disable: () => boolean;
    enable: () => boolean;
};
export default initAligningGuidelines;
