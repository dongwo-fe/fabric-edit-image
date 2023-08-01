import React  from 'react'
import ImportFile from './ImportFile'
import HeaderControl from './HeaderControl'
import SaveButton from './SaveButton'
import ResourceArea from './ResourceArea'
import Draw from '../Draw'
import AttrArea from './AttrArea'
import styles from './styles.module.css'


const Editor = () => {
  return <div className={styles.dmEditImageContainer}>
    <div className={styles.header}>
      {/* 导入文件 */}
      <ImportFile/>
      {/* 快捷操作 */}
      <HeaderControl/>
      {/* 保存 */}
      <SaveButton/>
    </div>
    <div className={styles.content}>
      {/* 左侧资源区域 */}
      <ResourceArea/>
      <div className={styles.canvasArea}>
        {/* 画布区域 */}
        <Draw/>
      </div>
      <div className={styles.attrArea}>
        {/* 属性区域 */}
        <AttrArea/>
      </div>
    </div>
  </div>
}

export default Editor
