// @ts-nocheck
import React from 'react'
import style from './index.module.scss'
import Input from '../../../../Input'
import { retainNumber } from '../../../../../../utils/utils';

export interface SizeProps {
  size: {
    width: string
    height: string
  },
  lockRatio?: boolean
  showRation?: boolean
  onChangeSize: () => void
}

const Size = (props: SizeProps) => {
  const {size, showRation, onChangeSize: callbackSize} = props
  const onChangeSize = (key: string, value) => {
    callbackSize({
      width: key === 'width' ? value : retainNumber(size.width),
      height: key === 'height' ? value : retainNumber(size.height),
    })
  }
  return (
    <div className={style.size}>
      <Input
        title='宽度'
        value={size.width}
        onChange={e => onChangeSize('width', e.target.value)}
      />
      <Input
        title='高度'
        value={size.height}
        onChange={e => onChangeSize('height', e.target.value)}
      />
      {
        showRation ? <div className={style.ratio}>
          <div className={style.title}>比例</div>
          <div className={style.content}>
            <img src="https://ossprod.jrdaimao.com/file/1690425288688481.svg" alt=""/>
          </div>
        </div> : <div className={style.ratio}></div>
      }
    </div>
  )
}

export default Size
