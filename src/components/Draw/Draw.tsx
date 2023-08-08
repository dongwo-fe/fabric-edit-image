// @ts-nocheck
import React, { useEffect, useContext } from 'react'
import styles from './styles.module.css'
import { fabric } from 'fabric'
import Editor from '../../core';
import { Context } from './CanvasContext'
import { Context as EditorContext } from '../Editor/Context'
import useEvents from './hooks/useEvents';
import EditorWorkspace from '../../core/EditorWorkspace';
import { getLocal } from '../../utils/local';
import { LocalKeys } from '../../utils/local/keys';
import { getDetail } from '../../api/image';
import { loadImage } from '../../utils/tool';
import useSave from './hooks/useSave';


const Draw: React.FC<{ src?: string }> = (props) => {
  const {setCanvas, setEditor, setWorkSpace, setShow, setMainUrl} = useContext(Context)
  const {setLoading} = useContext(EditorContext)
  const {unloadSendBeacon} = useSave()
  useEvents()

  useEffect(() => {
    init()
    setMainUrl(props.src)
  }, [props.src])

  useEffect(() => {
    window.addEventListener('beforeunload', (e) => {
      unloadSendBeacon()
    })
  }, [])

  const init = async () => {
    // 本地有数据就先用本地，优先本地数据
    // const canvasData = getLocal(LocalKeys.CANVAS_DATA)
    // if (canvasData) {
    //   return initCanvas(canvasData)
    // }

    // 没有src不去请求，直接生成背景
    if (!props.src) {
      return initCanvas()
    }
    // 获取接口的历史数据
    try {
      const res = await getDetail({imgSrc: props.src})
      initCanvas(JSON.parse(res.data))
    } catch (err) {
      initCanvas()
    }
  }
  /**
   * 初始化canvas
   * @param canvasData
   */
  const initCanvas = async (canvasData?: any) => {
    let mainImg = null;
    if (canvasData && canvasData.objects) {
      // 先从缓存中获取主图src
      mainImg = canvasData.objects.find(item => item.id === 'mainImg')?.src
    } else {
      // 缓存中取不到就去看props里是否有
      mainImg = props.src
    }

    // 主图会很大，这里做个loading
    if (mainImg) {
      try {
        setLoading(true)
        await loadImage(mainImg)
        setLoading(false)
      } catch (err) {
        console.log(`initCanvas load main url error url=${mainImg}`)
        setLoading(false)
      }
    }

    const canvas = new fabric.Canvas('fabric-canvas', {
      fireRightClick: true, // 启用右键，button的数字为3
      stopContextMenu: true, // 禁止默认右键菜单
      controlsAboveOverlay: true, // 超出clipPath后仍然展示控制条
    })
    const workSpace = new EditorWorkspace(canvas, {
      src: props.src,
      callback: () => setShow(true),
      canvasData,
    })
    const editor = new Editor(canvas)
    setWorkSpace(workSpace)
    setCanvas(canvas)
    setEditor(editor)
  }

  return (
    <div className={styles.workContent} id='workspace'>
      <canvas className={styles.canvas} id='fabric-canvas'/>
    </div>
  )
}

export default Draw
