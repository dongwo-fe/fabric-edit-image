import React from 'react'
import pageAlignStyle from '../PageAlign/index.module.scss'
import { coverOrderList, CoverOrderListItem } from './config'
import userOrder from '../../../../../Draw/hooks/userOrder'
import style from './index.module.scss'

const CoverOrder = () => {
  const orderFunc = userOrder()
  const changeCoverOrder = (item: CoverOrderListItem) => {
    orderFunc[item.key]?.()
  }
  return (
    <div className={style.coverOrder}>
      <div className={style.coverOrderTitle}>图层顺序</div>
      <div className={pageAlignStyle.shareShapeList}>
        {
          coverOrderList.map(item => {
            return <div
              onClick={() => changeCoverOrder(item)}
              key={item.key}
              className={pageAlignStyle.shareShapeListItem}
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

export default CoverOrder
