import React, { useEffect, useContext } from 'react'
import styles from './styles.module.css'
import { fabric } from 'fabric'
import Editor from '../../core';
import { Context } from './CanvasContext'
import useEvents from './hooks/useEvents';
import EditorWorkspace from '../../core/EditorWorkspace';


const Draw:React.FC<{src?:string}> = (props) => {
  const {setCanvas, setEditor, setWorkSpace, setShow} = useContext(Context)
  useEvents()
  useEffect(() => {
    const canvas = new fabric.Canvas('fabric-canvas', {
      fireRightClick: true, // 启用右键，button的数字为3
      stopContextMenu: true, // 禁止默认右键菜单
      controlsAboveOverlay: true, // 超出clipPath后仍然展示控制条
      preserveObjectStacking: true,
    })
    console.log('EditorWorkspace')
    const workSpace = new EditorWorkspace(canvas, {
      src: props.src,
      callback:() => setShow(true)
    })
    const editor = new Editor(canvas)
    setWorkSpace(workSpace)
    setCanvas(canvas)
    setEditor(editor)
  }, [])
  return (
    <div className={styles.workContent} id='workspace'>
      <canvas className={styles.canvas} id='fabric-canvas'/>
    </div>
  )
}

export default Draw
