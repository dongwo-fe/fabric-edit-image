import React from 'react'
import style from './index.module.scss'
import useSave from '../../Draw/hooks/useSave';

interface ImportFileProps {
  onBack?: () => void
}

const ImportFile: React.FC<ImportFileProps> = (props) => {
  const {saveHistory} = useSave()
  const back = () => {
    saveHistory()
    props.onBack?.()
  }
  return (
    <div className={style.importFile}>
      <span className={style.back} onClick={back}>
        <img src='https://ossprod.jrdaimao.com/file/1690265070713402.svg' alt=''/>
        <img src="https://ossprod.jrdaimao.com/file/1690358472515604.svg" alt=""/>
        <span>返回</span>
      </span>
      {/*<span className={style.openFile}>*/}
      {/*  <img src="https://ossprod.jrdaimao.com/file/1690423416245892.svg" alt=""/>*/}
      {/*  <img src="https://ossprod.jrdaimao.com/file/1690423788579835.svg" alt=""/>*/}
      {/*  <span>打开文件</span>*/}
      {/*</span>*/}
    </div>
  )
}

export default ImportFile
