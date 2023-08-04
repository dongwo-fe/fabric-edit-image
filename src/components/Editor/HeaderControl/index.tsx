// @ts-nocheck
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Context } from '../../Draw'
import { events, Types } from '../../../utils/events'
import useHistoryTravel from '../../../hooks/useHistoryTravel';
import { KeyNames } from '../../../utils/hotEventKeys';
import { hotkeys } from '../../../core/initHotKeys';
import styles from './styles.module.scss'

const HeaderControl = () => {
  const {workSpace, drawMode, setDrawMode, canvas, editor, show} = useContext(Context)
  const [scale, setScale] = useState(0)
  const drawModeRef = useRef('default')
  const historyFlagRef = useRef(false)
  drawModeRef.current = drawMode
  const {value, setValue, go, reset, backLength, forwardLength} = useHistoryTravel<any>(undefined, 50)
  useEffect(() => {
    canvas?.on({
      'object:added': save,
      'object:modified': save,
      'selection:updated': save,
    })
    return () => {
      canvas?.off({
        'object:added': save,
        'object:modified': save,
        'selection:updated': save,
      })
    }
  }, [canvas, workSpace])
  useEffect(() => {
    hotkeys(KeyNames.ctrlz, undo)
    hotkeys(KeyNames.ctrlshiftz, redo)
    return () => {
      hotkeys.unbind(KeyNames.ctrlz, undo)
      hotkeys.unbind(KeyNames.ctrlshiftz, redo)
    }
  }, [])

  useEffect(() => {
    if (!canvas) return
    if (!historyFlagRef.current) return
    canvas?.clear();
    canvas?.loadFromJSON(value, () => {
      historyFlagRef.current = false
      canvas.renderAll();
    });
  }, [value, canvas])

  useEffect(() => {
    events.on(Types.CHANGE_SCALE, scale => {
      setScale(Math.round(scale * 100))
    })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [workSpace, drawMode])

  useEffect(() => {
    if (!workSpace || !editor) return
    reset(editor.getJson());
  }, [editor, workSpace, show])

  const save = (event: any) => {
    // 过滤选择元素事件
    const isSelect = event.action === undefined && event.e;
    if (isSelect || !canvas) return;
    if (historyFlagRef.current) return;
    setValue(editor?.getJson())
  }
  const onKeyDown = (e: any) => {
    if (e.code !== 'Space') return
    if (drawModeRef.current === 'move') return
    switchDragMode()
  }
  const onKeyUp = (e: any) => {
    if (e.code !== 'Space') return
    switchDefaultMode()
  }
  /**
   * 开启拖拽模式
   */
  const switchDragMode = () => {
    workSpace?.startDring()
    setDrawMode('move')
  }
  /**
   * 恢复默认模式
   */
  const switchDefaultMode = () => {
    workSpace?.endDring()
    setDrawMode('default')
  }
  /**
   * 后退
   */
  const undo = () => {
    historyFlagRef.current = true
    go(-1);
  };
  /**
   * 重做
   */
  const redo = () => {
    historyFlagRef.current = true
    go(1);
  };

  return (
    <div className={styles.headerControl}>
      <div>
        {/* 撤销 */}
        <div onClick={undo} className={`${styles.button} ${backLength ? '' : styles.disabled}`}>
          <img
            src={backLength ?
              "https://ossprod.jrdaimao.com/file/1690509281581673.svg" :
              "https://ossprod.jrdaimao.com/file/1690789676330313.svg"}
            alt=""
          />
          <img src="https://ossprod.jrdaimao.com/file/1690509933132558.svg" alt=""/>
        </div>
        {/* 重做 */}
        <div onClick={redo} className={`${styles.button} ${forwardLength ? '' : styles.disabled}`}>
          <img
            src={forwardLength ?
              "https://ossprod.jrdaimao.com/file/1690509311318726.svg" :
              "https://ossprod.jrdaimao.com/file/1690789758114451.svg"}
            alt=""
          />
          <img src="https://ossprod.jrdaimao.com/file/1690509942889198.svg" alt=""/>
        </div>
      </div>
      <div>
        {/* 拖拽 */}
        <div className={`${styles.button} ${drawMode === 'move' ? styles.active : ''}`} onClick={switchDragMode}>
          <img src="https://ossprod.jrdaimao.com/file/1690509577879796.svg" alt=""/>
          <img src="https://ossprod.jrdaimao.com/file/1690509952709638.svg" alt=""/>
        </div>
        {/* 默认鼠标 */}
        <div className={`${styles.button} ${drawMode === 'default' ? styles.active : ''}`} onClick={switchDefaultMode}>
          <img src="https://ossprod.jrdaimao.com/file/1690509620102920.svg" alt=""/>
          <img src="https://ossprod.jrdaimao.com/file/1690509961015895.svg" alt=""/>
        </div>
      </div>
      <div>
        {/* 放大 */}
        <div className={styles.button} onClick={() => workSpace?.big()}>
          <img src="https://ossprod.jrdaimao.com/file/1690509650392929.svg" alt=""/>
          <img src="https://ossprod.jrdaimao.com/file/169050996966396.svg" alt=""/>
        </div>
        {/* 缩小 */}
        <div className={styles.button} onClick={() => workSpace?.small()}>
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
