// @ts-nocheck
import React, { useContext, useEffect, useState } from 'react';
import Size from '../Components/Size'
import style from './index.module.scss'
import { SketchPicker } from 'react-color'
import { Context } from '../../../../Draw';
import { DefaultWorkSpaceColor } from '../../../../../core/EditorWorkspace';

const ColorPicker: any = SketchPicker

const WorkSpaceAttr = () => {
  const {workSpace} = useContext(Context)
  const [color, setColor] = useState(workSpace?.fill || DefaultWorkSpaceColor)
  const onChangeColor = (e) => {
    setColor(e.hex)
    workSpace?.setBgColor(e.hex)
  }
  return (
    <div className={style.workSpaceAttr}>
      <div className={style.base}>
        <div>
          {/* 设置元素的大小、锁定比例 */}
          <Size getActiveObject={() => workSpace?.workspace}/>
        </div>
        <div>
          <div className={style.title}>背景色</div>
          <ColorPicker color={color} onChange={onChangeColor}/>
        </div>
      </div>
    </div>
  );
};

export default WorkSpaceAttr;
