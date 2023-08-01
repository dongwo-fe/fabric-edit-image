// @ts-nocheck
import React, { useContext, useEffect, useState } from 'react';
import Size from '../Components/Size'
import style from '../WorkSpaceAttr/index.module.scss'
import { Context } from '../../../../Draw';
import Position from '../Components/Pos'
import Transparent from '../Components/Trans'
import PageAlign from '../Components/PageAlign'
import CoverOrder from '../Components/CoverOrder'
import useAttr from '../../../../Draw/hooks/useAttr';


const ImageSpaceAttr = () => {
  const {canvas} = useContext(Context)
  const {getActiveObject, setAttr} = useAttr()
  const [size, setSize] = useState({width: '', height: ''})
  useEffect(() => {
    // 回显属性
    const activeObject = getActiveObject()
    if (!activeObject) return
    setSize({
      width: parseInt(activeObject.width),
      height: parseInt(activeObject.height)
    })
  }, [canvas])
  /**
   * 修改尺寸
   * @param value
   */
  const onChangeSize = (value) => {
    setAttr({
      width: +value.width,
      height: +value.height,
    })
    setSize(value)
  }
  return (
    <div className={style.workSpaceAttr}>
      <div className={style.base}>
        <div>
          {/* 设置元素的大小、锁定比例 */}
          <Size
            showRation={true}
            size={size}
            onChangeSize={onChangeSize}
          />
        </div>
        <div>
          {/* 设置元素的位置、旋转角度 */}
          <Position/>
        </div>
        <div>
          <Transparent/>
        </div>
      </div>
      <div className={style.division}></div>
      {/* 页面对齐 */}
      <PageAlign/>
      <div className={style.division}></div>
      {/*图层顺序 */}
      <CoverOrder/>
    </div>
  );
};

export default ImageSpaceAttr;
