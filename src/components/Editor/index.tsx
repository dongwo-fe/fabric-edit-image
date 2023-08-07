import React, { useContext, useEffect } from 'react'
import ImportFile from './ImportFile'
import HeaderControl from './HeaderControl'
import SaveButton from './SaveButton'
import ResourceArea from './ResourceArea'
import Draw from '../Draw'
import { Context as EditorContext } from './Context'
import AttrArea from './AttrArea'
import LoadingOverlay from 'react-loading-overlay'
import styles from './styles.module.css'
import { EditImageProps } from '../../index';
import { isUrl } from '../../utils';

const Editor: React.FC<EditImageProps> = (props) => {
  const {loading, loadingText, setLoading} = useContext(EditorContext)

  useEffect(() => {
    if (isUrl(props.src)) {
      setLoading(true)
      const img = new Image()
      img.src = props.src
      img.onload = () => {
        setLoading(false)
      }
      img.onerror = (err) => {
        console.log('load props image error', err)
        setLoading(false)
      }
    }
  }, [props.src])
  // @ts-ignore
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
        <HeaderControl/>
        {/* 保存 */}
        <SaveButton src={props.src}/>
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
