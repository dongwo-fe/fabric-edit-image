import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../../Draw'
import { saveAs } from 'file-saver'
import styles from './index.module.scss'
import { uuid } from '../../../utils/utils';


const SaveButton = () => {
  const {editor, canvas} = useContext(Context)
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onClick = () => {
      setShow(false)
    }
    window.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('click', onClick)
    }
  }, [])
  /**
   * 保存
   */
  const onSave = (e: any) => {
    e.stopPropagation()
    setShow(prevState => !prevState)
  }
  /**
   * 保存为json
   */
  const onSaveToJson = () => {
    if (!editor) return
    const dataUrl = editor.getJson();
    const fileStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataUrl, null, '\t')
    )}`;
    saveAs(fileStr, `${uuid()}.json`)
  }
  /**
   * 保存为图片
   */
  const onSaveToImage = () => {
    if (!canvas || !editor) return
    const workspace = canvas?.getObjects().find((item) => item.id === 'workspace');
    if (!workspace) return
    const {left, top, width, height} = workspace;
    const option = {
      name: 'New Image',
      format: 'png',
      quality: 1,
      left,
      top,
      width,
      height,
    };
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl = canvas.toDataURL(option);
    saveAs(dataUrl,`${uuid()}.png`)
  }
  return (
    <div className={styles.headerRightControl}>
      {/*<span className={styles.previewButton} onClick={onPreview}>*/}
      {/*  <img src="https://ossprod.jrdaimao.com/file/1690422594923183.svg" alt=""/>*/}
      {/*  <img src="https://ossprod.jrdaimao.com/file/1690423932285584.svg" alt=""/>*/}
      {/*  <span>预览</span>*/}
      {/*</span>*/}
      <span className={styles.saveWrap}>
        <span onClick={onSave} className={styles.saveButton}>保&nbsp;存</span>
        <span className={`${styles.fixButton} ${show ? styles.showButton : ''}`}>
          <span onClick={onSaveToJson}>保存</span>
          <span onClick={onSaveToImage}>保存为图片</span>
        </span>
      </span>
    </div>
  )
}

export default SaveButton
