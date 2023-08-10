import React from 'react'
import { CanvasProvider } from './components/Draw'
import { EditorProvider } from './components/Editor/Context'
import Editor from './components/Editor';


export interface EditImageProps {
  src?: string
  onBack?: () => void
}

export const EditImage: React.FC<EditImageProps> = (props) => {
  return (
    <CanvasProvider>
      <EditorProvider>
        <Editor
          onBack={props.onBack}
          src={props.src}
        />
      </EditorProvider>
    </CanvasProvider>
  )
}
