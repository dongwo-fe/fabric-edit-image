// @ts-nocheck
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Context } from '../../Draw'
import { events, Types } from '../../../utils/events'
import { KeyNames } from '../../../utils/hotEventKeys'
import { hotkeys } from '../../../core/initHotKeys'
import styles from './styles.module.scss'
import { floatRound } from '../../../utils/calculate'
import useClipImage from '../../Draw/hooks/useClipImage'
import useHistory from '../../Draw/hooks/useHistory';

const HeaderControl = () => {
  const {
    workSpace, drawMode, setDrawMode, canvas, editor, isClipImage,
    setIsClipImage, setClipImageId, setClipRawIndex, clipImageId, clipRawIndex
  } = useContext(Context)
  const {saveClipImage, cancelClipImage} = useClipImage()
  const {undo, redo, backLength, forwardLength} = useHistory()
  const [scale, setScale] = useState(0)
  const drawModeRef = useRef('default')
  drawModeRef.current = drawMode

  useEffect(() => {
    hotkeys(KeyNames.enter, saveClipImage)
    hotkeys(KeyNames.esc, cancelClipImage)
    return () => {
      hotkeys.unbind(KeyNames.enter, saveClipImage)
      hotkeys.unbind(KeyNames.esc, cancelClipImage)
    }
  }, [canvas, workSpace, clipImageId, clipRawIndex])
  useEffect(() => {
    hotkeys(KeyNames.ctrlz, undo)
    hotkeys(KeyNames.ctrlshiftz, redo)
    events.on(Types.CLIP_IMAGE, onClipImage)
    return () => {
      hotkeys.unbind(KeyNames.ctrlz, undo)
      hotkeys.unbind(KeyNames.ctrlshiftz, redo)
      events.off(Types.CLIP_IMAGE, onClipImage)
    }
  }, [])
  useEffect(() => {
    if (workSpace?.scale) {
      setScale(floatRound(workSpace.scale * 100))
    }
  }, [workSpace?.scale])
  useEffect(() => {
    events.on(Types.CHANGE_SCALE, scale => {
      setScale(floatRound(scale * 100))
    })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [workSpace, drawMode])

  /**
   * 裁剪的回调，存储一些裁剪信息
   * @param visible
   * @param rawIndex
   * @param clipImageId
   */
  const onClipImage = ({visible, rawIndex, clipImageId}) => {
    setIsClipImage(visible)
    setClipRawIndex(rawIndex)
    setClipImageId(clipImageId)
  }
  /**
   * 按下空格开启拖拽模式
   * @param e
   */
  const onKeyDown = (e: any) => {
    if (e.code !== 'Space') return
    if (drawModeRef.current === 'move') return
    switchDragMode()
  }
  /**
   * 抬起空格取消拖拽模式
   * @param e
   */
  const onKeyUp = (e: any) => {
    if (e.code !== 'Space') return
    switchDefaultMode()
  }
  /**
   * 开启拖拽模式
   */
  const switchDragMode = () => {
    editor?.disableGuidelines?.()
    workSpace?.startDring()
    setDrawMode('move')
  }
  /**
   * 恢复默认模式
   */
  const switchDefaultMode = () => {
    editor?.enableGuidelines?.()
    workSpace?.endDring()
    setDrawMode('default')
  }
  // 是否正在剪裁图片，如果正在裁剪图片应该展示裁剪图片的按钮
  if (isClipImage) {
    return <div className={styles.headerControl}>
      <span className={styles.clipSaveButton} onClick={saveClipImage}>
        <img src="https://ossprod.jrdaimao.com/file/1691980964433863.svg" alt=""/>
        <img src="https://ossprod.jrdaimao.com/file/1691981310968623.svg" alt=""/>
        <span>保存</span>
      </span>
      <span className={styles.clipSaveButton} onClick={cancelClipImage}>
        <img src="https://ossprod.jrdaimao.com/file/1691980998460679.svg" alt=""/>
        <img src="https://ossprod.jrdaimao.com/file/1691981320881591.svg" alt=""/>
        <span>取消</span>
      </span>
    </div>
  }

  return (
    <div className={styles.headerControl}>
      <div>
        {/* 撤销 */}
        <div
          data-tooltip-content="撤销 Ctrl Z"
          data-tooltip-place="bottom"
          onClick={undo}
          className={`${styles.button} ${backLength ? '' : styles.disabled}`}
        >
          <img
            src={backLength ?
              "https://ossprod.jrdaimao.com/file/1690509281581673.svg" :
              "https://ossprod.jrdaimao.com/file/1690789676330313.svg"}
            alt=""
          />
          <img src="https://ossprod.jrdaimao.com/file/1690509933132558.svg" alt=""/>
        </div>
        {/* 重做 */}
        <div
          onClick={redo}
          className={`${styles.button} ${forwardLength ? '' : styles.disabled}`}
          id='control-tooltip'
          data-tooltip-content="重做 Ctrl Shift Z"
          data-tooltip-place="bottom"
        >
          <img
            src={forwardLength ?
              "https://ossprod.jrdaimao.com/file/1690509311318726.svg" :
              "https://ossprod.jrdaimao.com/file/1690789758114451.svg"}
            alt=""
          />
          <img src="https://ossprod.jrdaimao.com/file/1690509942889198.svg" alt=""/>
        </div>
      </div>
      <div className={styles.line}/>
      <div>
        {/* 拖拽 */}
        <div
          className={`${styles.button} ${drawMode === 'move' ? styles.active : ''}`}
          onClick={switchDragMode}
          id='control-tooltip'
          data-tooltip-content="移动视图 Space"
          data-tooltip-place="bottom"
        >
          <img src="https://ossprod.jrdaimao.com/file/1690509577879796.svg" alt=""/>
          <img src="https://ossprod.jrdaimao.com/file/1690509952709638.svg" alt=""/>
        </div>
        {/* 默认鼠标 */}
        <div
          className={`${styles.button} ${drawMode === 'default' ? styles.active : ''}`}
          onClick={switchDefaultMode}
          id='control-tooltip'
          data-tooltip-content="选择"
          data-tooltip-place="bottom"
        >
          <img src="https://ossprod.jrdaimao.com/file/1690509620102920.svg" alt=""/>
          <img src="https://ossprod.jrdaimao.com/file/1690509961015895.svg" alt=""/>
        </div>
      </div>
      <div className={styles.line}/>
      <div>
        {/* 放大 */}
        <div
          className={styles.button}
          onClick={() => workSpace?.big()}
          id='control-tooltip'
          data-tooltip-content="放大视图 Ctrl +"
          data-tooltip-place="bottom"
        >
          <img src="https://ossprod.jrdaimao.com/file/1690509650392929.svg" alt=""/>
          <img src="https://ossprod.jrdaimao.com/file/169050996966396.svg" alt=""/>
        </div>
        {/* 缩小 */}
        <div
          className={styles.button}
          onClick={() => workSpace?.small()}
          id='control-tooltip'
          data-tooltip-content="缩小视图 Ctrl -"
          data-tooltip-place="bottom"
        >
          <img src="https://ossprod.jrdaimao.com/file/1690509673723181.svg" alt=""/>
          <img src="https://ossprod.jrdaimao.com/file/1690509977928322.svg" alt=""/>
        </div>
        {/* 比例 */}
        <div style={{visibility: scale ? 'visible' : 'hidden'}} className={styles.ratioText}>{scale}%</div>
      </div>
    </div>
  );
}


export default HeaderControl
