// @ts-nocheck
import React, { useContext, useEffect, useState } from 'react'
import style from './index.module.scss'
import Input from '../../../../Input'
import { retainNumber } from '../../../../../../utils/utils'
import { fabric } from 'fabric';
import { Context } from '../../../../../Draw'
import useLock, { isControlsInRatioVisible } from '../../../../../Draw/hooks/useLock'


interface SizeProps {
  getActiveObject: () => fabric.Object
  showRation?: boolean
}

const Size: React.FC<SizeProps> = ({getActiveObject, showRation}) => {
  const {canvas} = useContext(Context)
  const {changeInRatioLock} = useLock()
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [lockRatio, setLockRatio] = useState(false)

  useEffect(() => {
    getAttr()
  }, [canvas, getActiveObject])

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
    setWidth(parseInt(activeObject.width))
    setHeight(parseInt(activeObject.height))
    setLockRatio(isControlsInRatioVisible(activeObject))
  }
  /**
   * 修改宽
   * @param value
   */
  const onWidthChange = (value) => {
    const activeObject = getActiveObject()
    if (!activeObject) return
    value = retainNumber(value)
    activeObject.set({width: +value})
    canvas?.renderAll()
    setWidth(value)
  }
  /**
   * 修改高
   * @param value
   */
  const onHeightChange = (value) => {
    const activeObject = getActiveObject()
    if (!activeObject) return
    value = retainNumber(value)
    activeObject.set({height: +value})
    canvas?.renderAll()
    setHeight(value)
  }

  const changeLock = () => {
    changeInRatioLock(lockRatio)
    setLockRatio(prevState => !prevState)
  }
  return (
    <div className={style.size}>
      <Input
        afterText='像素'
        title='宽度'
        value={width}
        onChange={e => onWidthChange(e.target.value)}
      />
      <Input
        afterText='像素'
        title='高度'
        value={height}
        onChange={e => onHeightChange(e.target.value)}
      />
      {
        showRation ? <div className={style.ratio}>
          <div className={style.title}>比例</div>
          <div className={style.content} onClick={changeLock}>
            <img
              src={lockRatio ?
                "https://ossprod.jrdaimao.com/file/1690955813239228.svg" :
                "https://ossprod.jrdaimao.com/file/1690425288688481.svg"}
              alt=""
            />
          </div>
        </div> : <div className={style.ratio}></div>
      }
    </div>
  )
}

export default Size
