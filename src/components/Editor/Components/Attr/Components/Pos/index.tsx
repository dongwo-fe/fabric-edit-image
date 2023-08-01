import React, { useContext, useEffect, useState } from 'react'
import style from './index.module.scss'
import Input from '../../../../Input'
import useAttr from '../../../../../Draw/hooks/useAttr';
import { Context } from '../../../../../Draw';

const Position = () => {
  const {canvas} = useContext(Context)
  const {getActiveObject, setAttr} = useAttr()
  const [rotate, setRotate] = useState('0')
  const [x, setX] = useState<string | number>(0)
  const [y, setY] = useState<string | number>(0)

  useEffect(() => {
    const activeObject = getActiveObject()
    if (!activeObject) return
    setX(parseInt(String(activeObject.left || 0)))
    setY(parseInt(String(activeObject.top || 0)))
  }, [canvas])

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
    setAttr({left: +value})
    setX(value)
  }
  /**
   * 修改Y坐标
   * @param value
   */
  const onPositionYChange = (value: string) => {
    setAttr({top: +value})
    setY(value)
  }
  return (
    <div className={style.position}>
      <Input value={x} onChange={e => onPositionXChange(e.target.value)} title='X'/>
      <Input value={y} onChange={e => onPositionYChange(e.target.value)} title='Y'/>
      <div className={style.rotate}>
        <div className={style.title}>旋转</div>
        <div className={style.content}>
          <input value={rotate} onChange={e => onRotateChange(e.target.value)} type="text"/>
        </div>
      </div>
    </div>
  )
}

export default Position
