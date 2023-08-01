// @ts-nocheck
import React  from 'react'
import { textList } from './config'
import styles from './index.module.scss'
import useAddObject from '../../../../Draw/hooks/useAddObject';


const TextResource = () => {
  const {addText} = useAddObject()
  return (
    <div className={styles.textResource}>
      <div className={styles.addShareTextButton}>
        <span>添加文本框</span>
      </div>
      <div className={styles.textList}>
        {
          textList.map(item => {
            return <div
              onClick={() => addText(item)}
              key={item.key}
              style={item.style}
              className={styles.textListItem}
            >
              <span>{item.title}</span>
            </div>
          })
        }
      </div>
    </div>
  )
}

export default TextResource
