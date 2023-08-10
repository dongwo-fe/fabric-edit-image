// @ts-nocheck
import React, { useContext, useEffect, useState } from 'react'
import customInputStyle from '../../../../Input/index.module.scss'
import style from './index.module.scss'
import useAttr from '../../../../../Draw/hooks/useAttr'
import { Context } from '../../../../../Draw'
import { retainNumber } from '../../../../../../utils/utils';

const Transparent = () => {
  const {canvas} = useContext(Context)
  const {getActiveObject, setAttr} = useAttr()
  const [opacity, setOpacity] = useState(0)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const activeObject = getActiveObject()
    if (!activeObject) return
    setOpacity(parseInt((activeObject.opacity || 0) * 100))
    setOpacity((activeObject.opacity * 100).toFixed(0))
    setVisible(activeObject.visible || false)
  }, [getActiveObject])
  /**
   * 透明度修改
   * @param value
   */
  const onOpacityChange = (value: string) => {
    if (value > 100) {
      value = 100
    }
    value = retainNumber(value)
    setAttr({opacity: (value / 100).toFixed(2)})
    setOpacity(+value)
  }
  /**
   * 翻转
   * @param value
   */
  const onFlipChange = (value: string) => {
    const activeObject = getActiveObject()
    if (!activeObject) return
    // @ts-ignore
    activeObject.set(`flip${value}`, !activeObject[`flip${value}`]).setCoords();
    canvas?.renderAll()
  }
  /**
   * 可见性修改
   */
  const onVisibleChange = () => {
    setAttr({visible: !visible})
    setVisible(prevState => !prevState)
  }
  return (
    <div className={style.transparent}>
      <div className={customInputStyle.customInput}>
        <div className={customInputStyle.title}>不透明度</div>
        <div className={customInputStyle.inputWrap}>
          <input
            style={{width: 48}}
            onChange={e => onOpacityChange(e.target.value)}
            value={opacity}
            type="text"
          />
          <span>%</span>
        </div>
      </div>
      <div className={style.reverse}>
        <div className={style.title}>翻转</div>
        <div className={style.reverseWrap}>
          <div onClick={() => onFlipChange('X')}>
            <img src="https://ossprod.jrdaimao.com/file/1690428298144872.svg" alt=""/>
          </div>
          <div onClick={() => onFlipChange('Y')}>
            <img src="https://ossprod.jrdaimao.com/file/1690428330458222.svg" alt=""/>
          </div>
        </div>
      </div>
      <div className={style.visible}>
        <div className={style.title}>可见性</div>
        <div className={style.content} onClick={onVisibleChange}>
          {
            visible ?
              <img src="https://ossprod.jrdaimao.com/file/1690428533888278.svg" alt=""/> :
              <img src="https://ossprod.jrdaimao.com/file/1690883271867109.svg" alt=""/>
          }
        </div>
      </div>
    </div>
  )
}

export default Transparent
