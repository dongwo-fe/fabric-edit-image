import React, { useContext, useEffect, useState } from 'react'
import style from './index.module.scss'
import Input from '../../../../Input'
import useAttr from '../../../../../Draw/hooks/useAttr';
import { Context } from '../../../../../Draw';
import { retainNumber } from '../../../../../../utils/utils';
import { floatRound } from '../../../../../../utils/calculate';

const Position = () => {
  const {canvas} = useContext(Context)
  const {getActiveObject, setAttr} = useAttr()
  const [rotate, setRotate] = useState<string | number>('0')
  const [x, setX] = useState<string | number>(0)
  const [y, setY] = useState<string | number>(0)

  useEffect(() => {
    getAttr()
  }, [canvas])

  useEffect(() => {
    if (!canvas) return
    canvas.on('object:modified', getAttr)
    return () => {
      canvas.off('object:modified', getAttr)
    }
  }, [canvas])
  const getAttr = () => {
    const activeObject = getActiveObject()
    if (!activeObject) return
    setX(floatRound(activeObject.left || 0))
    setY(floatRound(activeObject.top || 0))
    setRotate(floatRound(activeObject.angle || 0))
  }
  /**
   * 修改旋转角度
   * @param value
   */
  const onRotateChange = (value: string) => {
    const activeObject = getActiveObject()
    if (!activeObject) return
    activeObject.rotate(+value)
    canvas?.renderAll()
    setRotate(value)
  }
  /**
   * 修改X坐标
   * @param value
   */
  const onPositionXChange = (value: string) => {
    value = retainNumber(value)
    setAttr({left: +value})
    setX(value)
  }
  /**
   * 修改Y坐标
   * @param value
   */
  const onPositionYChange = (value: string) => {
    value = retainNumber(value)
    setAttr({top: +value})
    setY(value)
  }
  return (
    <div className={style.position}>
      <Input
        afterText='像素'
        value={x}
        onChange={e => onPositionXChange(e.target.value)}
        title='X'
      />
      <Input
        afterText='像素'
        value={y}
        onChange={e => onPositionYChange(e.target.value)}
        title='Y'
      />
      <div className={style.rotate}>
        <div className={style.title}>旋转</div>
        <div className={style.content}>
          <input value={rotate} onChange={e => onRotateChange(retainNumber(e.target.value))} type="text"/>
        </div>
      </div>
    </div>
  )
}

export default Position
