import React, { createContext, useState } from 'react'
import { DefaultKey } from '../AttrArea/config'

interface EditorContext {
  attrTab: string
  setAttrTab: (value: string) => void
  loading: boolean
  setLoading: (value: boolean) => void
  loadingText: string
  setLoadingText: (value: string) => void

}

const InitState: EditorContext = {
  attrTab: DefaultKey,
  loading: false,
  loadingText: '',
  setLoading: () => {
  },
  setLoadingText: () => {
  },
  setAttrTab: () => {
  }
}

export const Context = createContext<EditorContext>(InitState)

export const EditorProvider: React.FC = ({children}) => {
  const [attrTab, setAttrTab] = useState(DefaultKey);
  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('加载中')
  const value: EditorContext = {
    attrTab,
    loading,
    loadingText,
    setLoading,
    setLoadingText,
    setAttrTab
  }
  return <Context.Provider value={value}>
    {children}
  </Context.Provider>
}

