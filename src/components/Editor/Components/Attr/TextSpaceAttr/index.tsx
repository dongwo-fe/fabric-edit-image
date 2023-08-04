// @ts-nocheck
import React from 'react';
import Size from '../Components/Size'
import style from '../WorkSpaceAttr/index.module.scss'
import Position from '../Components/Pos'
import Transparent from '../Components/Trans'
import PageAlign from '../Components/PageAlign'
import CoverOrder from '../Components/CoverOrder'
import useAttr from '../../../../Draw/hooks/useAttr'
import TextAttr from '../Components/Text';

const TextSpaceAttr = () => {
  const {getActiveObject} = useAttr()
  return (
    <div className={style.workSpaceAttr}>
      <div className={style.base}>
        <div>
          {/* 设置元素的大小、锁定比例 */}
          <Size getActiveObject={getActiveObject} showRation/>
        </div>
        <div>
          {/* 设置元素的位置、旋转角度 */}
          <Position/>
        </div>
        <div>
          <Transparent/>
        </div>
      </div>
      <div className={style.division}/>
      <TextAttr/>
      <div className={style.division}/>
      {/* 页面对齐 */}
      <PageAlign/>
      <div className={style.division}/>
      {/*图层顺序 */}
      <CoverOrder/>
    </div>
  );
};

export default TextSpaceAttr;
