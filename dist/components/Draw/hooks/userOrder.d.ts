import { fabric } from 'fabric';
/**
 * 修改层级顺序
 */
declare const userOrder: () => {
    up: (object: fabric.Object) => void;
    upTop: (object: fabric.Object) => void;
    down: (object: fabric.Object) => void;
    downTop: (object: fabric.Object) => void;
};
export default userOrder;
