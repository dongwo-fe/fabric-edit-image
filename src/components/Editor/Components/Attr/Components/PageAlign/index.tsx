import React from 'react'
import usePageAlign from '../../../../../Draw/hooks/usePageAlign'
import { alignTypeList, AlignTypeListItem } from './config'
import style from './index.module.scss'

const PageAlign = () => {
  const alignFunc = usePageAlign()
  const onClick = (item: AlignTypeListItem) => {
    alignFunc[item.key]?.()
  }
  return (
    <div className={style.pageAlign}>
      <div className={style.title}>页面对齐</div>
      <div className={style.shareShapeList}>
        {
          alignTypeList.map(item => {
            return <div
              onClick={() => onClick(item)}
              key={item.key}
              className={style.shareShapeListItem}
            >
              <img src={item.icon} alt=""/>
              <img src={item.activeIcon} alt=""/>
              <span>{item.title}</span>
            </div>
          })
        }
      </div>
    </div>
  )
}

export default PageAlign
