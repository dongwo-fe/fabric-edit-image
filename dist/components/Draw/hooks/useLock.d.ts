import { fabric } from 'fabric';
/**
 * 检测fabric对象是否隐藏了X Y缩放
 * @param object
 */
export declare const isControlsInRatioVisible: (object: fabric.Object) => boolean;
declare const useLock: () => {
    changeOwnLock: (isLock: boolean, object?: fabric.Object | undefined) => void;
    changeInRatioLock: (isLock: boolean, object?: fabric.Object | undefined) => void;
};
export default useLock;
