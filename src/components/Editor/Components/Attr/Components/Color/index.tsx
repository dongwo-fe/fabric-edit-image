// @ts-nocheck
import React, { useState } from 'react'
import * as Sketch from 'react-color'
import style from './index.module.scss'

const SketchPicker: any = Sketch.SketchPicker;

const Color = () => {
  const [color, setColor] = useState('rgba(255,255,255,1)')
  return (
    <div className={style.colorPicker}>
      <div className={style.title}>背景色</div>
      <div className={style.wrap}>
        {/*<div style={{background: color}} className={style.button}></div>*/}
        <SketchPicker color={color} />
      </div>
    </div>
  );
}

export default Color
