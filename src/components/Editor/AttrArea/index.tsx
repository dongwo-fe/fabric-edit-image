import React, { useContext, useMemo } from 'react'
import style from './index.module.scss'
import { attrAreaComponent, attrTabList, AttrTabListItem } from './config'
import { Context as EditorContext } from '../Context'
import OrderList from '../OrderList';
import WorkSpaceAttr from '../Components/Attr/WorkSpaceAttr'
import { Context } from '../../Draw';

const AttrArea = () => {
  const {selectOneType} = useContext(Context)
  const {attrTab, setAttrTab} = useContext(EditorContext)
  const bg = useMemo(() => {
    return attrTabList.find(item => item.key === attrTab)?.bg
  }, [attrTabList, attrTab])

  const onChangeTab = (item: AttrTabListItem) => {
    setAttrTab(item.key)
  }
  const AttrCom = attrAreaComponent[selectOneType];
  return (
    <div className={style.attrWrap}>
      <div className={style.attrTab} style={{backgroundImage: `url(${bg})`}}>
        {
          attrTabList.map(item => {
            return <div
              onClick={() => onChangeTab(item)}
              key={item.key}
              className={attrTab === item.key ? style.attrTabActive : ''}
            >
              <span>{item.title}</span>
            </div>
          })
        }
      </div>
      <div id='attr-content' className={style.attrContent}>
        <div style={{display: attrTab === 'Attr' ? 'block' : 'none'}}>
          {
            AttrCom ? <AttrCom/> : <WorkSpaceAttr/>
          }
        </div>
        <div style={{display: attrTab === 'coverage' ? 'block' : 'none'}}>
          <OrderList/>
        </div>
      </div>
    </div>
  )
}

export default AttrArea
