import React, { FC, createContext, useState } from 'react'
import { fabric } from 'fabric'
import Editor from '../../core';
import EditorWorkspace from '../../core/EditorWorkspace';

const noop = () => {
}

interface CanvasContext {
  canvas: fabric.Canvas | null
  editor: Editor | null
  workSpace: EditorWorkspace | null
  drawMode: string,
  setDrawMode: (value: string) => void
  setCanvas: (canvas: fabric.Canvas) => void
  setEditor: (value: Editor) => void
  setWorkSpace: (value: EditorWorkspace) => void
  selectMode: string
  setSelectMode: (value: string) => void
  selectIds: Array<string>
  setSelectIds: (value: Array<string>) => void
  selectOneType: string
  setSelectOneType: (value: string) => void
  selectActive: Array<string>
  setSelectActive: (value: Array<string>) => void
  show: boolean
  setShow: (value: boolean) => void
  mainUrl: string | undefined
  setMainUrl: (value: string | undefined) => void
  isClipImage: boolean
  setIsClipImage: (value: boolean) => void
}

export const Context = createContext<CanvasContext>({
  editor: null, // canvas编辑器实例
  canvas: null, // fabric canvas实例
  workSpace: null, // 白色画布实例
  drawMode: '', // default 默认模式 move拖拽模式
  selectMode: '',
  selectIds: [],
  selectOneType: '',
  selectActive: [],
  show: false,
  mainUrl: '',
  isClipImage: false,
  setIsClipImage: noop,
  setMainUrl: noop,
  setSelectOneType: noop,
  setSelectActive: noop,
  setSelectMode: noop,
  setSelectIds: noop,
  setDrawMode: noop,
  setCanvas: noop,
  setEditor: noop,
  setWorkSpace: noop,
  setShow: noop
})

export const CanvasProvider: FC = ({children}) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
  const [editor, setEditor] = useState<Editor | null>(null)
  const [workSpace, setWorkSpace] = useState<EditorWorkspace | null>(null)
  const [drawMode, setDrawMode] = useState<string>('default')
  const [selectMode, setSelectMode] = useState('')
  const [selectIds, setSelectIds] = useState([])
  const [selectOneType, setSelectOneType] = useState('')
  const [selectActive, setSelectActive] = useState([])
  const [show, setShow] = useState(false)
  const [mainUrl, setMainUrl] = useState('')
  const [isClipImage, setIsClipImage] = useState(false)
  const context = {
    canvas,
    editor,
    workSpace,
    drawMode,
    selectMode,
    setSelectMode,
    selectIds,
    setSelectIds,
    selectOneType,
    setSelectOneType,
    selectActive,
    setSelectActive,
    setDrawMode,
    setWorkSpace,
    setCanvas,
    setEditor,
    show,
    setShow,
    mainUrl,
    setMainUrl,
    isClipImage,
    setIsClipImage
  }

  // @ts-ignore
  return <Context.Provider value={context}>{children}</Context.Provider>
}
