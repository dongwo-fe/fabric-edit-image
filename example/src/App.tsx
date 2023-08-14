import React from 'react'
import { EditImage } from '@dm/edit-image'
import '@dm/edit-image/dist/index.css'

const App = () => {
  return <>
    <EditImage src={'https://img1.baidu.com/it/u=3628156758,730403125&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1691773200&t=cd675ee39c43b81dbffb50907f239ef9'} />
    {/*<EditImage />*/}
  </>
}

export default App
