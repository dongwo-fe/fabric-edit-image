import hotkeys from 'hotkeys-js';
import type { fabric } from 'fabric';
import { KeyNames } from '../utils/hotEventKeys';


function initHotkeys(canvas: fabric.Canvas) {

  // 移动快捷键
  hotkeys(KeyNames.lrdu, (_event, handler) => {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    switch (handler.key) {
      case 'left':
        if (activeObject.left === undefined) return;
        activeObject.set('left', activeObject.left - 1);
        break;
      case 'right':
        if (activeObject.left === undefined) return;
        activeObject.set('left', activeObject.left + 1);
        break;
      case 'down':
        if (activeObject.top === undefined) return;
        activeObject.set('top', activeObject.top + 1);
        break;
      case 'up':
        if (activeObject.top === undefined) return;
        activeObject.set('top', activeObject.top - 1);
        break;
      default:
    }
    canvas.renderAll();
  });

  // 移动快捷键
  hotkeys(KeyNames.shiftMove, (_event, handler) => {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    switch (handler.key) {
      case 'shift+left':
        if (activeObject.left === undefined) return;
        activeObject.set('left', activeObject.left - 10);
        break;
      case 'shift+right':
        if (activeObject.left === undefined) return;
        activeObject.set('left', activeObject.left + 10);
        break;
      case 'shift+down':
        if (activeObject.top === undefined) return;
        activeObject.set('top', activeObject.top + 10);
        break;
      case 'shift+up':
        if (activeObject.top === undefined) return;
        activeObject.set('top', activeObject.top - 10);
        break;
      default:
    }
    canvas.renderAll();
  });

}

export default initHotkeys;
export { hotkeys };
