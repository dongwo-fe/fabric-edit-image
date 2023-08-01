import hotkeys from 'hotkeys-js';
import type { fabric } from 'fabric';
import { KeyNames } from '../utils/hotEventKeys';


function initHotkeys(canvas: fabric.Canvas) {
  const deleteObjects = () => {
    const activeObject = canvas.getActiveObjects();
    if (activeObject) {
      activeObject.map((item) => canvas.remove(item));
      canvas.requestRenderAll();
      canvas.discardActiveObject();
    }
  }
  // 删除快捷键
  hotkeys(KeyNames.delete, deleteObjects);

  // 移动快捷键
  hotkeys(KeyNames.lrdu, (_event, handler) => {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    switch (handler.key) {
      case 'left':
        if (activeObject.left === undefined) return;
        activeObject.set('left', activeObject.left - 5);
        break;
      case 'right':
        if (activeObject.left === undefined) return;
        activeObject.set('left', activeObject.left + 5);
        break;
      case 'down':
        if (activeObject.top === undefined) return;
        activeObject.set('top', activeObject.top + 5);
        break;
      case 'up':
        if (activeObject.top === undefined) return;
        activeObject.set('top', activeObject.top - 5);
        break;
      default:
    }
    canvas.renderAll();
  });

}

export default initHotkeys;
export { hotkeys };
