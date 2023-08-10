import React from 'react'
import { EditImage } from '@dm/edit-image'
import '@dm/edit-image/dist/index.css'

const App = () => {
  return <>
    <EditImage src={'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2Fb9882382-2bb9-41ce-b438-db52186a0ede%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1694157168&t=7439a7a708762268949848e7da5e4a2c'} />
    {/*<EditImage />*/}
  </>
}

export default App
