export const Types = {
  /**
   * 比例修改
   */
  CHANGE_SCALE: 'changeScale',
  /**
   * 监听画布修改啊，这个事件用来做数据存储的，主要是增删改会调用
   * TODO 如果新增了增删改的操作记得调用这个方法
   */
  CANVAS_CHANGE: 'canvasChange',
  /**
   * 剪裁图片
   */
  CLIP_IMAGE: 'clipImage'
}
