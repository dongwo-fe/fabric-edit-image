// @ts-nocheck
import React, { useState } from 'react'
import { ResourceContentComEnum, DefaultSelectKey, ResourceNavItem, resourceNavList } from './config'
import styles from './index.module.scss'


const ResourceArea = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState(DefaultSelectKey)
  const onResourceNavChange = (item: ResourceNavItem) => {
    setActiveKey(item.key)
  }
  const activeIndex = resourceNavList.findIndex(item => item.key === activeKey)
  const ResourceComponent = ResourceContentComEnum[activeKey]
  const onSetCollapsed = () => {
    if (!collapsed) {
      document.body.style.setProperty('--dm-change-Resource-content-width', '0')
      setCollapsed(true)
    } else {
      document.body.style.setProperty('--dm-change-Resource-content-width', '240px')
      setCollapsed(false)
    }
  }
  return (
    <div className={styles.resourceArea}>
      <div className={styles.resourceNav}>
        {
          resourceNavList.map((item, index) => {
            const active = activeIndex === index
            let className = `${styles.resourceNavItem} ${active ? styles.resourceNavItemActive : ''}`
            // 获取一下高亮的前一个元素加下border-radius
            if (index === activeIndex - 1) {
              className += styles.resourceNavItemPrevActive
            }
            return <div
              onClick={() => onResourceNavChange(item)}
              className={className}
              key={item.key}
            >
              <img src={active ? item.activeIcon : item.icon} alt=""/>
              <span>{item.title}</span>
            </div>
          })
        }
        <div className={styles.resourceNavPlace}/>
      </div>
      <div className={styles.resourceContent}>
        <ResourceComponent/>
        <div className={styles.packUp} onClick={onSetCollapsed}>
          <img
            src={collapsed ?
              'https://ossprod.jrdaimao.com/file/1690513793832702.svg' :
              'https://ossprod.jrdaimao.com/file/1690445829374723.svg'
            }
            alt=""
          />
        </div>
      </div>
    </div>
  )
}

export default ResourceArea
