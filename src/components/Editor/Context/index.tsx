import React, { createContext, useState } from 'react'
import { DefaultKey } from '../AttrArea/config'

interface EditorContext {
  attrTab: string
  setAttrTab: (value: string) => void
}

const InitState: EditorContext = {
  attrTab: DefaultKey,
  setAttrTab: () => {
  }
}

export const Context = createContext<EditorContext>(InitState)

export const EditorProvider: React.FC = ({children}) => {
  const [attrTab, setAttrTab] = useState(DefaultKey);
  const value: EditorContext = {
    attrTab,
    setAttrTab
  }
  return <Context.Provider value={value}>
    {children}
  </Context.Provider>
}

