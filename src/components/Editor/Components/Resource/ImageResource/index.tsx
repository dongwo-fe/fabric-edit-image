// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'
import { useDropDown } from './dropDown';
import useAddObject from '../../../../Draw/hooks/useAddObject';
import { getImageList } from '../../../../../api/image';

const ImageResource = () => {
  const {addImage} = useAddObject()
  const searchRef = useRef('')
  const [list, setList] = useState([])
  const {run} = useDropDown()
  useEffect(() => {
    queryList()
  }, [])
  const onClickMore = (e: any, item: any) => {
    run(e, item)
  }
  const queryList = async () => {
    try {
      const res = await getImageList({phone: '15612868761'})
      console.log(res)
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div className={styles.imageResource}>
      <div className={styles.searchBox}>
        <input type='text' placeholder='请输入' onChange={e => searchRef.current = e.target.value}/>
        <img src="https://ossprod.jrdaimao.com/file/1690356901972689.svg" alt=""/>
      </div>
      <div className={styles.uploadFile}>
        <span>上传文件</span>
      </div>
      {
        !list.length ? <div className={styles.empty}>
          <img src="https://ossprod.jrdaimao.com/file/169035729200810.png" alt=""/>
          <p>还没有文件哦~</p>
        </div> : null
      }
      {
        list.length ? <div className={styles.fileList}>
          {
            list.map((item) => {
              return <div key={item.id} className={styles.fileListItem}>
                <img
                  onClick={() => addImage(item)}
                  className={styles.image}
                  src={item.src}
                  alt=""
                />
                <img
                  onClick={(e) => onClickMore(e, item)}
                  className={styles.more}
                  src="https://ossprod.jrdaimao.com/file/1690363754666532.svg"
                  alt=""
                />
              </div>
            })
          }
        </div> : null
      }
    </div>
  )
}

export default ImageResource
