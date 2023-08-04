import React, { useContext } from 'react'
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
  const {show} = useContext(Context)
  const {loading, loadingText} = useContext(EditorContext)
  // @ts-ignore
  return <LoadingOverlay
    active={loading}
    spinner
    text={loadingText}
  >
    <div className={styles.dmEditImageContainer}>
      <div className={styles.header}>
        {/* 导入文件 */}
        <ImportFile onBack={props.onBack} />
        {/* 快捷操作 */}
        <HeaderControl/>
        {/* 保存 */}
        <SaveButton src={props.src} />
      </div>
      <div className={styles.content}>
        {/* 左侧资源区域 */}
        <ResourceArea/>
        <div className={styles.canvasArea}>
          {/* 画布区域 */}
          <Draw src={props.src}/>
        </div>
        <div className={styles.attrArea}>
          {/* 属性区域 */}
          {show ? <AttrArea/> : null}
        </div>
      </div>
    </div>
  </LoadingOverlay>
}

export default Editor
