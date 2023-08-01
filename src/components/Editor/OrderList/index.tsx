// @ts-nocheck
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'
import { arrayMoveImmutable } from 'array-move'
import { fabric } from 'fabric'
import style from './index.module.scss'
import { Context } from '../../Draw'
import userOrder from '../../Draw/hooks/userOrder';

const SortableItem = sortableElement((props: { item }) => {
  const {item} = props
  const {selectIds, canvas} = useContext(Context)
  /**
   * 设置高亮
   */
  const clickItem = useCallback(() => {
    if (!canvas) return
    canvas.setActiveObject(item.object)
    canvas.renderAll()
  }, [item, canvas])
  return <div
    onClick={clickItem}
    className={`${style.orderListItem} ${selectIds.includes(item.id) ? style.active : ''}`}
  >
    <div className={style.button}>
      <img src="https://ossprod.jrdaimao.com/file/1690437893570728.svg" alt=""/>
      <img src="https://ossprod.jrdaimao.com/file/1690437902259961.svg" alt=""/>
    </div>
    <div className={style.content}>
      {/*目前只有俩类型，先这样写吧，后面多了跨域拆成枚举组件*/}
      {
        item.type === 'image' ?
          <div className={style.image}>
            <img src={item.src} alt=""/>
          </div> :
          <div className={style.text}>{item.text}</div>
      }
    </div>
    <DragHandle/>
  </div>
})

const DragHandle = sortableHandle(() => {
  return <div className={style.move}>
    <img src="https://ossprod.jrdaimao.com/file/1690437934587361.svg" alt=""/>
  </div>
})

const SortableContainer = sortableContainer(({children}: { children }) => {
  return children
})

const OrderList = () => {
  const {canvas} = useContext(Context)
  const {up, upTop, down, downTop} = userOrder()
  const [list, setList] = useState([])
  /**
   * 修改层级顺序
   * @param oldIndex
   * @param newIndex
   */
  const onSortEnd = useCallback(({oldIndex, newIndex}) => {
    // 位置不变不处理
    if (oldIndex === newIndex) return
    setList(prevState => arrayMoveImmutable(prevState, oldIndex, newIndex))
    const oldObject = list[oldIndex]?.object;
    if (!oldObject) return
    if (newIndex < oldIndex) {
      if (newIndex === 0) return upTop(oldObject)
      // 上移
      for (let i = newIndex; i < oldIndex; i++) {
        up(oldObject)
      }
    } else {
      if (newIndex === list.length - 1) return downTop(oldObject)
      // 下移
      for (let i = oldIndex; i > newIndex; i++) {
        down(oldObject)
      }
    }
  }, [list, setList, up, upTop, down, downTop]);

  useEffect(() => {
    canvas?.on('after:render', getList);
  }, [canvas])

  /**
   * 获取列表数据
   */
  const getList = useCallback(() => {
    const objects = canvas?.getObjects() || []
    const list = [
      ...objects.filter((item) => {
        // 过滤掉辅助线和背景
        return !(item instanceof fabric.GuideLine || item.id === 'workspace');
      })
    ]
      .reverse()
      .map((item) => {
        const {type, id, text} = item;
        const src = type === 'image' ? item._element?.src : undefined
        return {
          object: item,
          type,
          id,
          text,
          src
        };
      });
    setList(list)
  }, [setList, canvas]);

  return (
    <div className={style.orderWrap}>
      <div className={style.orderListTitle}>图层</div>
      {
        !list.length ? <div className={style.orderListEmpty}>
          <div className={style.empty}>
            <img src="https://ossprod.jrdaimao.com/file/169035729200810.png" alt=""/>
            <p>暂无图层~</p>
          </div>
        </div> : null
      }
      {
        list.length ? <SortableContainer onSortEnd={onSortEnd} useDragHandle>
          <div className={style.orderList}>
            {
              list.map((item, index) => {
                return <SortableItem index={index} key={`item-${index}`} item={item}/>
              })
            }
          </div>
        </SortableContainer> : null
      }
    </div>
  )
}

export default OrderList
