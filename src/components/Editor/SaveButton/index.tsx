// @ts-nocheck
import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../../Draw'
import { saveAs } from 'file-saver'
import styles from './index.module.scss'
import { uuid } from '../../../utils/utils'
import { saveHistory } from '../../../api/image'
import { trackSensors, SensorKeys } from '../../../utils/sensors'

const SaveButton = ({ src }: { src: string | undefined }) => {
  const userInfo = localStorage.getItem('userInfo')
  const phone = userInfo ? JSON.parse(userInfo).phone : '15612868761'
  const { editor, canvas, workSpace, show } = useContext(Context)
  // const [show, setShow] = useState(false)
  // useEffect(() => {
  //   const onClick = () => {
  //     setShow(false)
  //   }
  //   window.addEventListener('click', onClick)
  //   return () => {
  //     window.removeEventListener('click', onClick)
  //   }
  // }, [])
  /**
   * 保存
   */
  const onSave = (e: any) => {
    e.stopPropagation()
    if (!editor || !show) return
    // setShow(prevState => !prevState)
    const dataJson = editor.getJson()
    saveHistory({
      phone,
      data: dataJson ? JSON.stringify(dataJson) : {},
      imgSrc: src
    })
    onSaveToImage()
    trackSensors(SensorKeys.saveEditImageClick, {
      imgSrc: src,
      userPhone: phone
    })
  }
  /**
   * 保存为json
   */
  // const onSaveToJson = () => {
  //   if (!editor) return
  //   const dataUrl = editor.getJson();
  //   const fileStr = `data:text/json;charset=utf-8,${encodeURIComponent(
  //     JSON.stringify(dataUrl, null, '\t')
  //   )}`;
  //   saveAs(fileStr, `${uuid()}.json`)
  // }
  /**
   * 保存为图片
   */
  const onSaveToImage = () => {
    if (!canvas || !editor) return
    try {
      const workspace = canvas
        ?.getObjects()
        .find((item) => item.id === 'workspace')
      editor.ruler.hideGuideline()
      if (!workspace) return
      const { left, top, width, height } = workspace
      const option = {
        format: 'png',
        quality: 1,
        left,
        top,
        width,
        height
      }

      canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
      const dataUrl = canvas.toDataURL(option)
      saveAs(dataUrl, `${uuid()}.png`)
      workSpace?.auto()
      // 恢复之前的缩放比例
      editor.ruler.showGuideline()
    } catch (err) {
      console.log('onSaveToImage', err)
      workSpace?.auto()
    }
  }

  return (
    <div className={styles.headerRightControl}>
      {/*<span className={styles.previewButton} onClick={onPreview}>*/}
      {/*  <img src="https://ossprod.jrdaimao.com/file/1690422594923183.svg" alt=""/>*/}
      {/*  <img src="https://ossprod.jrdaimao.com/file/1690423932285584.svg" alt=""/>*/}
      {/*  <span>预览</span>*/}
      {/*</span>*/}
      <span className={styles.saveWrap}>
        <span onClick={onSave} className={styles.saveButton}>
          下&nbsp;载
        </span>
        {/*<span className={`${styles.fixButton} ${show ? styles.showButton : ''}`}>*/}
        {/*<span onClick={onSaveToJson}>保存</span>*/}
        {/*<span onClick={onSaveToImage}>保存为图片</span>*/}
        {/*</span>*/}
      </span>
    </div>
  )
}

export default SaveButton
