// @ts-nocheck
import React, { useContext, useEffect } from 'react'
import ImportFile from './ImportFile'
import HeaderControl from './HeaderControl'
import SaveButton from './SaveButton'
import ResourceArea from './ResourceArea'
import Draw, { Context } from '../Draw'
import { Context as EditorContext } from './Context'
import AttrArea from './AttrArea'
import LoadingOverlay from 'react-loading-overlay'
import styles from './styles.module.css'
import { EditImageProps } from '../../index';

const Editor: React.FC<EditImageProps> = (props) => {
  const {loading, loadingText} = useContext(EditorContext)
  const {show} = useContext(Context)

  return <LoadingOverlay
    active={loading}
    spinner
    text={loadingText}
  >
    <div className={styles.dmEditImageContainer}>
      <div className={styles.header}>
        {/* 导入文件 */}
        <ImportFile onBack={props.onBack}/>
        {/* 快捷操作 */}
        { show ?  <HeaderControl/> : null}
        {/* 保存 */}
        <SaveButton />
      </div>
      <div className={styles.content}>
        {/* 左侧资源区域 */}
        <ResourceArea/>
        <div className={styles.canvasArea}>
          {/* 画布区域 */}
          <Draw src={props.src}/>
        </div>
        {
          <div className={styles.attrArea}>
            {/* 属性区域 */}
            <AttrArea/>
          </div>
        }
      </div>
    </div>
  </LoadingOverlay>
}

export default Editor
