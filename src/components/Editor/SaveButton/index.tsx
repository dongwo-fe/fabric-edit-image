// @ts-nocheck
import React  from 'react'
import styles from './index.module.scss'
import useSave from '../../Draw/hooks/useSave';


const SaveButton = () => {
  const {saveToImage} = useSave()
  return (
    <div className={styles.headerRightControl}>
      {/*<span className={styles.previewButton} onClick={onPreview}>*/}
      {/*  <img src="https://ossprod.jrdaimao.com/file/1690422594923183.svg" alt=""/>*/}
      {/*  <img src="https://ossprod.jrdaimao.com/file/1690423932285584.svg" alt=""/>*/}
      {/*  <span>预览</span>*/}
      {/*</span>*/}
      <span className={styles.saveWrap}>
        <span
          onClick={() => saveToImage()}
          className={styles.saveButton}
        >下&nbsp;载</span>
        {/*<span className={`${styles.fixButton} ${show ? styles.showButton : ''}`}>*/}
        {/*<span onClick={onSaveToJson}>保存</span>*/}
        {/*<span onClick={onSaveToImage}>保存为图片</span>*/}
        {/*</span>*/}
      </span>
    </div>
  )
}

export default SaveButton
