// @ts-nocheck
import React, { useEffect, useState } from 'react';
import Size from '../Components/Size'
import style from '../WorkSpaceAttr/index.module.scss'
import Position from '../Components/Pos'
import Transparent from '../Components/Trans'
import PageAlign from '../Components/PageAlign'
import CoverOrder from '../Components/CoverOrder'
import useAttr from '../../../../Draw/hooks/useAttr';


const ImageSpaceAttr = () => {
  const {getActiveObject} = useAttr()
  return (
    <div className={style.workSpaceAttr}>
      <div className={style.base}>
        <div>
          {/* 设置元素的大小、锁定比例 */}
          <Size
            getActiveObject={getActiveObject}
            showRation={true}
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
