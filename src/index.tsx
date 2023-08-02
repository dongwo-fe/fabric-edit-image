import React from 'react'
import { CanvasProvider } from './components/Draw'
import { EditorProvider } from './components/Editor/Context'
import Editor from './components/Editor';

export const ExampleComponent = () => {
  return (
    <CanvasProvider>
      <EditorProvider>
        <Editor/>
      </EditorProvider>
    </CanvasProvider>
  )
}
